/**
 * Supabase Overview Metrics & Real-time Analytics Service
 * Provides live aggregation, Supabase persistence, and timeframe filtering
 * for the ReeVibes Admin Shop Overview Dashboard.
 */

const SUPABASE_URL = "https://rofhcjedmviwzysipmav.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmhjamVkbXZpd3p5c2lwbWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNjYxNjIsImV4cCI6MjA1NTk0MjE2Mn0.lTz9_1EaU-jHqQG9Yw0m8u2n7n0Y4X1Z0Y4X1Z0Y4X1";

export type TimeframeFilter = "today" | "7days" | "30days" | "all_time";

export interface TopProductMetric {
  id: string;
  name: string;
  house: string;
  image: string;
  unitsSold: number;
  revenue: number;
  stockLeft: number;
  inStock: boolean;
}

export interface OverviewMetrics {
  id: string;
  timeframe: TimeframeFilter;
  newUsersCount: number;
  totalOrdersCount: number;
  turnoverAmount: number;
  netRevenueAmount: number;
  deliveredOrdersCount: number;
  inShippingCount: number;
  pendingApprovalCount: number;
  declinedOrdersCount: number;
  totalReturnsCount: number;
  pendingRefundAmount: number;
  pendingRefundCount: number;
  settledRefundAmount: number;
  razorpayPaymentsAmount: number;
  walletPaymentsAmount: number;
  codPaymentsAmount: number;
  topProducts: TopProductMetric[];
  lastCalculatedAt: string;
}

/**
 * Checks if a given timestamp string falls within the selected timeframe
 */
export function isWithinTimeframe(dateStr: string | undefined | null, timeframe: TimeframeFilter): boolean {
  if (!dateStr) return timeframe === "all_time";
  if (timeframe === "all_time") return true;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;

  const now = new Date();
  if (timeframe === "today") {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    return date.getTime() >= startOfToday.getTime();
  }

  if (timeframe === "7days") {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date.getTime() >= sevenDaysAgo.getTime();
  }

  if (timeframe === "30days") {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return date.getTime() >= thirtyDaysAgo.getTime();
  }

  return true;
}

/**
 * Computes live metrics across orders, returns, users, and catalog products
 */
export function computeOverviewMetrics(
  timeframe: TimeframeFilter,
  ordersList: any[],
  returnsList: any[],
  usersList: any[],
  productsList: any[]
): OverviewMetrics {
  // 1. Filter Orders by Timeframe
  const scopedOrders = ordersList.filter(o => isWithinTimeframe(o.date || o.orderDate || o.created_at, timeframe));

  // 2. Filter Returns by Timeframe
  const scopedReturns = returnsList.filter(r => isWithinTimeframe(r.refundDate || r.created_at || r.pickup_date, timeframe));

  // 3. Filter New Users by Timeframe
  const scopedUsers = usersList.filter(u => isWithinTimeframe(u.registeredAt || u.created_at, timeframe));

  // 4. Financial Calculations
  const totalOrdersCount = scopedOrders.length;
  const turnoverAmount = scopedOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Payment Breakdown
  let razorpayPaymentsAmount = 0;
  let walletPaymentsAmount = 0;
  let codPaymentsAmount = 0;

  scopedOrders.forEach(o => {
    const total = Number(o.total) || 0;
    const isCod = (o.paymentMethod || "").toLowerCase().includes("cash") || (o.paymentMethod || "").toLowerCase().includes("cod");
    const rzpPaid = o.razorpayAmountPaid !== undefined ? Number(o.razorpayAmountPaid) : 0;
    const wltUsed = o.walletAmountUsed !== undefined ? Number(o.walletAmountUsed) : 0;

    if (rzpPaid > 0 && wltUsed > 0) {
      razorpayPaymentsAmount += rzpPaid;
      walletPaymentsAmount += wltUsed;
    } else if (isCod) {
      codPaymentsAmount += total;
    } else if ((o.paymentMethod || "").toLowerCase().includes("wallet")) {
      walletPaymentsAmount += total;
    } else {
      razorpayPaymentsAmount += total;
    }
  });

  // 5. Order Funnel Statuses
  let pendingApprovalCount = 0;
  let inShippingCount = 0;
  let deliveredOrdersCount = 0;
  let declinedOrdersCount = 0;

  scopedOrders.forEach(o => {
    const st = (o.status || "").toLowerCase().trim();
    if (["pending approval", "pending", "order placed", "placed"].includes(st)) {
      pendingApprovalCount++;
    } else if (["ready to ship", "pickup scheduled", "shipped", "in transit", "in-transit", "out for delivery"].includes(st)) {
      inShippingCount++;
    } else if (["delivered"].includes(st)) {
      deliveredOrdersCount++;
    } else if (["cancelled", "declined", "rejected"].includes(st)) {
      declinedOrdersCount++;
    }
  });

  // 6. Returns & Refunds Calculations
  const totalReturnsCount = scopedReturns.length;
  let pendingRefundAmount = 0;
  let pendingRefundCount = 0;
  let settledRefundAmount = 0;

  // We check all active returns in the system for pending refund liabilities,
  // while checking settled returns specifically in the timeframe window
  returnsList.forEach(r => {
    const refAmt = Number(r.refundAmount) || 0;
    if (r.status === "Item Received" || r.status === "Ready for Refund") {
      pendingRefundAmount += refAmt;
      pendingRefundCount++;
    }
  });

  scopedReturns.forEach(r => {
    const refAmt = Number(r.refundAmount) || 0;
    if (r.status === "Refund Completed") {
      settledRefundAmount += refAmt;
    }
  });

  // Net Revenue = Turnover minus settled refunds in period
  const netRevenueAmount = Math.max(0, turnoverAmount - settledRefundAmount);

  // 7. Top Selling Products Leaderboard
  const productSalesMap = new Map<string, { unitsSold: number; revenue: number; item: any }>();

  scopedOrders.forEach(o => {
    let items: any[] = [];
    if (Array.isArray(o.items) && o.items.length > 0) {
      items = o.items;
    } else if (o.itemsJson) {
      try {
        const parsed = typeof o.itemsJson === "string" ? JSON.parse(o.itemsJson) : o.itemsJson;
        if (Array.isArray(parsed)) items = parsed;
      } catch {}
    }

    items.forEach(item => {
      if (!item) return;
      const prodId = String(item.productId || item.id || item.name).trim();
      const qty = Number(item.qty) || 1;
      const price = Number(item.price) || (Number(o.total) / Math.max(1, items.length));
      const rev = price * qty;

      if (productSalesMap.has(prodId)) {
        const curr = productSalesMap.get(prodId)!;
        productSalesMap.set(prodId, {
          unitsSold: curr.unitsSold + qty,
          revenue: curr.revenue + rev,
          item: curr.item || item
        });
      } else {
        productSalesMap.set(prodId, { unitsSold: qty, revenue: rev, item });
      }
    });
  });

  // Map to catalog products
  const topProducts: TopProductMetric[] = Array.from(productSalesMap.entries())
    .map(([prodId, sales]) => {
      const catalogProd = productsList.find(p => String(p.id).trim() === prodId || p.name === sales.item.name) || {};
      const stock = catalogProd.stockQuantity ?? catalogProd.units ?? 50;
      return {
        id: prodId,
        name: catalogProd.name || sales.item.name || "Luxury Piece",
        house: catalogProd.house || sales.item.house || "Maison ReeVibes",
        image: catalogProd.image || sales.item.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
        unitsSold: sales.unitsSold,
        revenue: sales.revenue,
        stockLeft: stock,
        inStock: stock > 0
      };
    })
    .sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue)
    .slice(0, 5);

  // Fallback top products from catalog if no orders in timeframe
  if (topProducts.length === 0 && productsList.length > 0) {
    productsList.slice(0, 4).forEach((p, idx) => {
      topProducts.push({
        id: p.id || `pr-${idx}`,
        name: p.name || "Curated Editorial",
        house: p.house || "ReeVibes Atelier",
        image: p.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
        unitsSold: 0,
        revenue: 0,
        stockLeft: p.stockQuantity ?? p.units ?? 50,
        inStock: (p.stockQuantity ?? p.units ?? 50) > 0
      });
    });
  }

  return {
    id: `metric_${timeframe}`,
    timeframe,
    newUsersCount: scopedUsers.length,
    totalOrdersCount,
    turnoverAmount,
    netRevenueAmount,
    deliveredOrdersCount,
    inShippingCount,
    pendingApprovalCount,
    declinedOrdersCount,
    totalReturnsCount,
    pendingRefundAmount,
    pendingRefundCount,
    settledRefundAmount,
    razorpayPaymentsAmount,
    walletPaymentsAmount,
    codPaymentsAmount,
    topProducts,
    lastCalculatedAt: new Date().toISOString()
  };
}

/**
 * Persists calculated metrics snapshot into public.shop_overview_metrics in Supabase
 */
export async function saveOverviewMetricsToSupabase(metrics: OverviewMetrics): Promise<boolean> {
  try {
    const payload = {
      id: metrics.id,
      timeframe: metrics.timeframe,
      new_users_count: metrics.newUsersCount,
      total_orders_count: metrics.totalOrdersCount,
      turnover_amount: metrics.turnoverAmount,
      net_revenue_amount: metrics.netRevenueAmount,
      delivered_orders_count: metrics.deliveredOrdersCount,
      in_shipping_count: metrics.inShippingCount,
      pending_approval_count: metrics.pendingApprovalCount,
      declined_orders_count: metrics.declinedOrdersCount,
      total_returns_count: metrics.totalReturnsCount,
      pending_refund_amount: metrics.pendingRefundAmount,
      pending_refund_count: metrics.pendingRefundCount,
      settled_refund_amount: metrics.settledRefundAmount,
      razorpay_payments_amount: metrics.razorpayPaymentsAmount,
      wallet_payments_amount: metrics.walletPaymentsAmount,
      cod_payments_amount: metrics.codPaymentsAmount,
      top_products_json: metrics.topProducts,
      metrics_json: {
        lastCalculated: metrics.lastCalculatedAt
      },
      last_calculated_at: metrics.lastCalculatedAt
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/shop_overview_metrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.warn("Failed to persist overview metrics to Supabase:", err);
    return false;
  }
}

/**
 * Fetches cached overview metrics snapshot from public.shop_overview_metrics
 */
export async function fetchOverviewMetricsFromSupabase(timeframe: TimeframeFilter): Promise<OverviewMetrics | null> {
  try {
    const targetId = `metric_${timeframe}`;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/shop_overview_metrics?id=eq.${targetId}&select=*`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const row = data[0];
    return {
      id: row.id,
      timeframe: row.timeframe,
      newUsersCount: Number(row.new_users_count) || 0,
      totalOrdersCount: Number(row.total_orders_count) || 0,
      turnoverAmount: Number(row.turnover_amount) || 0,
      netRevenueAmount: Number(row.net_revenue_amount) || 0,
      deliveredOrdersCount: Number(row.delivered_orders_count) || 0,
      inShippingCount: Number(row.in_shipping_count) || 0,
      pendingApprovalCount: Number(row.pending_approval_count) || 0,
      declinedOrdersCount: Number(row.declined_orders_count) || 0,
      totalReturnsCount: Number(row.total_returns_count) || 0,
      pendingRefundAmount: Number(row.pending_refund_amount) || 0,
      pendingRefundCount: Number(row.pending_refund_count) || 0,
      settledRefundAmount: Number(row.settled_refund_amount) || 0,
      razorpayPaymentsAmount: Number(row.razorpay_payments_amount) || 0,
      walletPaymentsAmount: Number(row.wallet_payments_amount) || 0,
      codPaymentsAmount: Number(row.cod_payments_amount) || 0,
      topProducts: Array.isArray(row.top_products_json) ? row.top_products_json : [],
      lastCalculatedAt: row.last_calculated_at || new Date().toISOString()
    };
  } catch (err) {
    console.warn("Failed to fetch overview metrics from Supabase:", err);
    return null;
  }
}
