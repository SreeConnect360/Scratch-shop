/**
 * Supabase Razorpay Webhooks Client & Helper Service
 * Manages fetching, filtering, and simulating Razorpay webhook action events.
 */

const SUPABASE_URL = "https://rofhcjedmviwzysipmav.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmhjamVkbXZpd3p5c2lwbWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNjYxNjIsImV4cCI6MjA1NTk0MjE2Mn0.lTz9_1EaU-jHqQG9Yw0m8u2n7n0Y4X1Z0Y4X1Z0Y4X1";

export interface RazorpayWebhookEvent {
  id: string;
  event_id?: string;
  event_type: string;
  entity_id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  customer_email?: string;
  customer_contact?: string;
  error_code?: string;
  error_description?: string;
  payload_json?: any;
  signature_valid?: boolean;
  created_at: string;
}

export type EventCategory = 
  | "ALL" 
  | "PAYMENTS" 
  | "REFUNDS" 
  | "DISPUTES" 
  | "DOWNTIMES" 
  | "ORDERS" 
  | "SETTLEMENTS" 
  | "INVOICES" 
  | "SUBSCRIPTIONS" 
  | "LINKS_ENGAGE";

export function getEventCategory(eventType: string): EventCategory {
  const t = eventType.toLowerCase();
  if (t.includes("dispute")) return "DISPUTES";
  if (t.includes("downtime")) return "DOWNTIMES";
  if (t.startsWith("payment.")) return "PAYMENTS";
  if (t.startsWith("refund.")) return "REFUNDS";
  if (t.startsWith("order.")) return "ORDERS";
  if (t.startsWith("settlement.")) return "SETTLEMENTS";
  if (t.startsWith("invoice.")) return "INVOICES";
  if (t.startsWith("subscription.")) return "SUBSCRIPTIONS";
  return "LINKS_ENGAGE";
}

/**
 * Fetches webhook events from Supabase with fallback to backend REST endpoint
 */
export async function fetchRazorpayWebhookEvents(): Promise<RazorpayWebhookEvent[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/razorpay_webhook_events?select=*&order=created_at.desc&limit=150`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return (data || []).map((row: any) => ({
        ...row,
        amount: Number(row.amount || 0),
        payload_json: typeof row.payload_json === "string" ? JSON.parse(row.payload_json) : row.payload_json,
      }));
    }
  } catch (err) {
    console.warn("Could not fetch webhook events from Supabase, attempting backend fallback:", err);
  }

  // Fallback to backend REST endpoint
  try {
    const backendRes = await fetch("https://scratch-render-sj9n.onrender.com/api/webhooks/razorpay/events");
    if (backendRes.ok) {
      const data = await backendRes.json();
      return (data || []).map((row: any) => ({
        ...row,
        amount: Number(row.amount || 0),
      }));
    }
  } catch (err) {
    console.error("Failed to fetch webhook events from backend fallback:", err);
  }

  return [];
}

/**
 * Inserts a new webhook event into Supabase for testing / simulation
 */
export async function insertRazorpayWebhookEvent(event: Partial<RazorpayWebhookEvent>): Promise<RazorpayWebhookEvent | null> {
  const newEvent: RazorpayWebhookEvent = {
    id: event.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    event_id: event.event_id || `evt_sim_${Date.now()}`,
    event_type: event.event_type || "payment.captured",
    entity_id: event.entity_id || `pay_${Math.random().toString(36).substring(2, 10)}`,
    amount: event.amount ?? 2999.00,
    currency: event.currency || "INR",
    status: event.status || "captured",
    customer_email: event.customer_email || "customer@reevibes.com",
    customer_contact: event.customer_contact || "+919876543210",
    error_code: event.error_code || undefined,
    error_description: event.error_description || undefined,
    payload_json: event.payload_json || {},
    signature_valid: event.signature_valid ?? true,
    created_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/razorpay_webhook_events`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(newEvent),
    });

    if (res.ok) {
      const inserted = await res.json();
      return inserted[0] || newEvent;
    }
  } catch (err) {
    console.error("Failed to insert simulated webhook event to Supabase:", err);
  }

  return newEvent;
}
