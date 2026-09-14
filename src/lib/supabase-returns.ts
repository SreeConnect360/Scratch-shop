import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-catalog";
import type { ReturnRequest } from "./portal-state";

function getHeaders(prefer?: string) {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (prefer) {
    headers["Prefer"] = prefer;
  }
  return headers;
}

export interface SupabaseReturnRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  customer_id: string;
  customer_name: string;
  reason: string;
  comment?: string | null;
  images?: string | null;
  videos?: string | null;
  status: string;
  refund_amount: number | string;
  refund_transaction_id?: string | null;
  refund_date?: string | null;
  selected_size?: string | null;
  qty?: number | null;
  refund_method?: string | null;
  rejection_reason?: string | null;
  expected_credit_date?: string | null;
  pickup_date?: string | null;
  shiprocket_return_order_id?: string | null;
  shiprocket_return_shipment_id?: string | null;
  return_awb?: string | null;
  return_courier?: string | null;
  wallet_refund_amount?: number | string | null;
  razorpay_refund_amount?: number | string | null;
  razorpay_refund_id?: string | null;
  wallet_transaction_id?: string | null;
  return_label_url?: string | null;
  return_scans_json?: string | null;
  refund_confirmation_message?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export function mapSupabaseRowToReturn(row: SupabaseReturnRow): ReturnRequest {
  let images: string[] = [];
  if (row.images) {
    try {
      images = typeof row.images === "string" ? row.images.split(",").map(s => s.trim()).filter(Boolean) : (row.images as any);
    } catch {
      images = [];
    }
  }

  let videos: string[] = [];
  if (row.videos) {
    try {
      videos = typeof row.videos === "string" ? row.videos.split(",").map(s => s.trim()).filter(Boolean) : (row.videos as any);
    } catch {
      videos = [];
    }
  }

  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    customerId: row.customer_id,
    customerName: row.customer_name,
    reason: row.reason,
    comment: row.comment || "",
    images,
    videos,
    status: row.status || "Return Requested",
    refundAmount: Number(row.refund_amount) || 0,
    refundTransactionId: row.refund_transaction_id || undefined,
    refundDate: row.refund_date || undefined,
    selectedSize: row.selected_size || undefined,
    qty: Number(row.qty) || 1,
    refundMethod: row.refund_method || undefined,
    rejectionReason: row.rejection_reason || undefined,
    expectedCreditDate: row.expected_credit_date || undefined,
    pickupDate: row.pickup_date || undefined,
    shiprocketReturnOrderId: row.shiprocket_return_order_id || undefined,
    shiprocketReturnShipmentId: row.shiprocket_return_shipment_id || undefined,
    returnAwb: row.return_awb || undefined,
    returnCourier: row.return_courier || undefined,
    walletRefundAmount: row.wallet_refund_amount != null ? Number(row.wallet_refund_amount) : undefined,
    razorpayRefundAmount: row.razorpay_refund_amount != null ? Number(row.razorpay_refund_amount) : undefined,
    razorpayRefundId: row.razorpay_refund_id || undefined,
    walletTransactionId: row.wallet_transaction_id || undefined,
    returnLabelUrl: row.return_label_url || undefined,
    returnScansJson: row.return_scans_json || undefined,
    refundConfirmationMessage: row.refund_confirmation_message || undefined,
    createdAt: row.created_at || undefined,
  };
}

export function mapReturnToSupabaseRow(req: Partial<ReturnRequest>): Partial<SupabaseReturnRow> {
  const row: Partial<SupabaseReturnRow> = {};
  if (req.id !== undefined) row.id = req.id;
  if (req.orderId !== undefined) row.order_id = req.orderId;
  if (req.productId !== undefined) row.product_id = req.productId;
  if (req.productName !== undefined) row.product_name = req.productName;
  if (req.customerId !== undefined) row.customer_id = req.customerId;
  if (req.customerName !== undefined) row.customer_name = req.customerName;
  if (req.reason !== undefined) row.reason = req.reason;
  if (req.comment !== undefined) row.comment = req.comment;
  if (req.images !== undefined) row.images = Array.isArray(req.images) ? req.images.join(",") : req.images;
  if (req.videos !== undefined) row.videos = Array.isArray(req.videos) ? req.videos.join(",") : req.videos;
  if (req.status !== undefined) row.status = req.status;
  if (req.refundAmount !== undefined) row.refund_amount = Number(req.refundAmount) || 0;
  if (req.refundTransactionId !== undefined) row.refund_transaction_id = req.refundTransactionId;
  if (req.refundDate !== undefined) row.refund_date = req.refundDate;
  if (req.selectedSize !== undefined) row.selected_size = req.selectedSize;
  if (req.qty !== undefined) row.qty = req.qty;
  if (req.refundMethod !== undefined) row.refund_method = req.refundMethod;
  if (req.rejectionReason !== undefined) row.rejection_reason = req.rejectionReason;
  if (req.expectedCreditDate !== undefined) row.expected_credit_date = req.expectedCreditDate;
  if (req.pickupDate !== undefined) row.pickup_date = req.pickupDate;
  if (req.shiprocketReturnOrderId !== undefined) row.shiprocket_return_order_id = req.shiprocketReturnOrderId;
  if (req.shiprocketReturnShipmentId !== undefined) row.shiprocket_return_shipment_id = req.shiprocketReturnShipmentId;
  if (req.returnAwb !== undefined) row.return_awb = req.returnAwb;
  if (req.returnCourier !== undefined) row.return_courier = req.returnCourier;
  if (req.walletRefundAmount !== undefined) row.wallet_refund_amount = req.walletRefundAmount;
  if (req.razorpayRefundAmount !== undefined) row.razorpay_refund_amount = req.razorpayRefundAmount;
  if (req.razorpayRefundId !== undefined) row.razorpay_refund_id = req.razorpayRefundId;
  if (req.walletTransactionId !== undefined) row.wallet_transaction_id = req.walletTransactionId;
  if (req.returnLabelUrl !== undefined) row.return_label_url = req.returnLabelUrl;
  if (req.returnScansJson !== undefined) row.return_scans_json = req.returnScansJson;
  if (req.refundConfirmationMessage !== undefined) row.refund_confirmation_message = req.refundConfirmationMessage;
  return row;
}

/**
 * Fetches all returns from Supabase return_requests table.
 */
export async function fetchReturnRequestsFromSupabase(): Promise<ReturnRequest[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/return_requests?select=*&order=created_at.desc`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) {
      console.warn("fetchReturnRequestsFromSupabase non-ok status:", res.status);
      return [];
    }
    const data: SupabaseReturnRow[] = await res.json();
    return data.map(mapSupabaseRowToReturn);
  } catch (err) {
    console.error("fetchReturnRequestsFromSupabase network error:", err);
    return [];
  }
}

/**
 * Upserts a return request directly to Supabase.
 */
export async function upsertReturnRequestToSupabase(returnReq: Partial<ReturnRequest>): Promise<{ ok: boolean; error?: any }> {
  try {
    const row = mapReturnToSupabaseRow(returnReq);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/return_requests`, {
      method: "POST",
      headers: getHeaders("resolution=merge-duplicates,return=representation"),
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("upsertReturnRequestToSupabase error response:", res.status, errBody);
      return { ok: false, error: errBody };
    }
    return { ok: true };
  } catch (err) {
    console.error("upsertReturnRequestToSupabase exception:", err);
    return { ok: false, error: err };
  }
}

/**
 * Patches a return request in Supabase by return ID.
 */
export async function updateReturnRequestInSupabase(id: string, patch: Partial<ReturnRequest>): Promise<{ ok: boolean; error?: any }> {
  if (!id) return { ok: false, error: "Missing return ID" };
  try {
    const row = mapReturnToSupabaseRow(patch);
    delete (row as any).id; // don't mutate primary key

    const res = await fetch(`${SUPABASE_URL}/rest/v1/return_requests?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: getHeaders("return=representation"),
      body: JSON.stringify({
        ...row,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("updateReturnRequestInSupabase error response:", res.status, errBody);
      return { ok: false, error: errBody };
    }
    return { ok: true };
  } catch (err) {
    console.error("updateReturnRequestInSupabase exception:", err);
    return { ok: false, error: err };
  }
}

/**
 * Deletes a return request from Supabase by return ID.
 */
export async function deleteReturnRequestFromSupabase(id: string): Promise<boolean> {
  if (!id) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/return_requests?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: getHeaders("return=minimal"),
    });
    return res.ok;
  } catch (err) {
    console.error("deleteReturnRequestFromSupabase exception:", err);
    return false;
  }
}
