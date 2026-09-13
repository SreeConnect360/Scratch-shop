import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePortal, isReturnEligible } from "@/lib/portal-state";
import { useState, useMemo } from "react";
import { z } from "zod";
import { 
  X, Check, AlertTriangle, Star, ListOrdered, 
  RotateCcw, ArrowLeft, Search, FileText, Copy, ExternalLink, Package, Truck, Clock, ShieldCheck,
  MapPin, Download, Calendar, ChevronRight, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

const ordersSearchSchema = z.object({
  tab: z.enum(["history", "returns"]).optional().catch("history"),
});

export const Route = createFileRoute("/_shop/orders")({
  validateSearch: (search) => ordersSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "My Maison Orders Tracker — ReeVibes" }] }),
  component: ShopOrdersPage,
});

export interface ScanActivity {
  date: string;
  activity: string;
  location: string;
  status?: string;
}

export function parseScans(scansJson: any): ScanActivity[] {
  if (!scansJson) return [];
  try {
    const raw = typeof scansJson === "string" ? JSON.parse(scansJson) : scansJson;
    if (Array.isArray(raw)) {
      return raw.map((item: any) => ({
        date: item.date || item["Date"] || item.timestamp || "",
        activity: item.activity || item["Activity"] || item.status_description || item.status || "Package in Transit",
        location: item.location || item["Location"] || item.city || "Transit Hub",
        status: item.status || item["Status"] || ""
      }));
    }
  } catch (e) {
    console.error("Failed to parse scansJson", e);
  }
  return [];
}

const getStatusBadge = (status: string) => {
  const s = status || "Processing";
  if (s.includes("Delivered") || s.includes("Completed")) {
    return "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
  }
  if (s.includes("Cancelled") || s.includes("Rejected")) {
    return "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400";
  }
  if (s.includes("Shipped") || s.includes("Approved") || s.includes("Transit")) {
    return "bg-sky-500/15 border-sky-500/30 text-sky-600 dark:text-sky-400";
  }
  return "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400";
};

export const REFINED_RETURN_REASONS = [
  {
    id: "size_fit",
    label: "Size & Fit Discrepancy",
    description: "Item does not fit as expected (runs too small, too large, or tight fit)",
    icon: "📏"
  },
  {
    id: "wrong_item",
    label: "Incorrect Item or Color Received",
    description: "Received a different product, wrong variant, or mismatched color",
    icon: "📦"
  },
  {
    id: "quality_defect",
    label: "Defective Finish or Poor Material Quality",
    description: "Flawed stitching, fabric defects, zipper issue, or substandard workmanship",
    icon: "⚠️"
  },
  {
    id: "transit_damage",
    label: "Damaged or Broken in Transit",
    description: "Item arrived physically broken, torn, or outer parcel heavily crushed",
    icon: "💔"
  },
  {
    id: "not_as_described",
    label: "Item Does Not Match Catalog Description",
    description: "Physical product appearance or specifications differ from maison display",
    icon: "🔍"
  },
  {
    id: "missing_accessories",
    label: "Missing Items, Tags, or Luxury Packaging",
    description: "Incomplete shipment; accessories, luxury garment box, or authenticity tags missing",
    icon: "❓"
  },
  {
    id: "changed_mind",
    label: "Change of Preference / No Longer Needed",
    description: "Selected in error or decided against keeping the piece",
    icon: "🔄"
  }
];

export const CANCELLATION_REASONS = [
  "Placed order by mistake",
  "Changed my decision / mind",
  "Found another choice / alternative",
  "Postponed / will purchase next time",
  "Other"
];

function ShopOrdersPage() {
  const { state, requestReturn, addReview, cancelOrder } = usePortal();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const user = state.user;

  // Active sub-tab
  const activeSubTab = tab || "history";

  // Details Modal States
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [selectedReturnDetails, setSelectedReturnDetails] = useState<any | null>(null);

  // Cancellation Modal States
  const [cancelModalOrder, setCancelModalOrder] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState("Placed order by mistake");
  const [cancelNote, setCancelNote] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirmCancelOrder = async () => {
    if (!user || !cancelModalOrder) return;
    if (cancelReason === "Other" && !cancelNote.trim()) {
      toast.error("Please enter a note explaining your reason for cancellation.");
      return;
    }
    setIsCancelling(true);
    try {
      toast.info(`Cancelling order #${cancelModalOrder.id}...`);
      await cancelOrder(user.id, cancelModalOrder.id, cancelReason, cancelNote.trim());
      toast.success(`Order #${cancelModalOrder.id} successfully cancelled. All items restored to inventory!`);
      setCancelModalOrder(null);
      setCancelReason("Placed order by mistake");
      setCancelNote("");
      if (selectedOrderDetails?.id === cancelModalOrder.id) {
        setSelectedOrderDetails(null);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Review Form States
  const [reviewFormItem, setReviewFormItem] = useState<{ productId: string; orderId: string; productName?: string; productImage?: string } | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // Return Wizard States
  const [returnFormItem, setReturnFormItem] = useState<{
    orderId: string;
    productId: string;
    productName: string;
    price: string;
    selectedSize: string;
    qty: number;
    image?: string;
    paymentMethod?: string;
    razorpayAmountPaid?: number;
    walletAmountUsed?: number;
    total?: number;
    deliveryDate?: string;
  } | null>(null);
  const [returnReason, setReturnReason] = useState("Size & Fit Discrepancy");
  const [returnDesc, setReturnDesc] = useState("");

  const userOrders = useMemo(() => {
    if (!user) return [];
    const list = state.orders?.[user.id] || [];
    return [...list].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      return timeB - timeA;
    });
  }, [user, state.orders]);

  const userReturns = useMemo(() => {
    if (!user) return [];
    return (state.returns || []).filter(r => r.customerId === user.id);
  }, [user, state.returns]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 text-center text-foreground">
        <div className="liquid-glass p-8 max-w-md w-full border border-black/15 dark:border-white/20 rounded-3xl bg-white/70 dark:bg-white/5 shadow-xl">
          <p className="editorial-eyebrow text-accent font-bold">Shop Members Only</p>
          <h1 className="mt-4 font-serif text-3xl font-bold">Sign in to continue.</h1>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            Your orders and transaction history are reserved for registered members of the maison.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/login" className="bg-foreground text-background px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-colors shadow-md">
              Sign In
            </Link>
            <Link to="/register" className="border border-black/15 dark:border-white/20 px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 md:py-12 space-y-8 md:space-y-10 animate-in fade-in duration-300 text-foreground">
      {/* Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-black/10 dark:border-white/10 pb-6">
        <div>
          <p className="editorial-eyebrow text-accent font-bold">Maison Shop Membership</p>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl md:text-5xl font-bold">Orders & Returns</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/account" search={{ tab: "profile" } as any} className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Account
          </Link>
          <div className="w-px h-4 bg-black/15 dark:bg-white/10" />
          <Link to="/" className="text-xs uppercase tracking-widest font-bold text-accent hover:underline">
            Return to Curation
          </Link>
        </div>
      </div>

      {/* Internal Tabs Switcher */}
      <div className="flex border-b border-black/10 dark:border-white/10 max-w-md">
        <button
          onClick={() => navigate({ to: "/orders", search: { tab: "history" } })}
          className={`flex-1 pb-4 text-xs uppercase tracking-wider font-bold border-b-2 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === "history"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListOrdered className="w-4 h-4" /> All Orders ({userOrders.length})
        </button>
        <button
          onClick={() => navigate({ to: "/orders", search: { tab: "returns" } })}
          className={`flex-1 pb-4 text-xs uppercase tracking-wider font-bold border-b-2 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === "returns"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Returns & Refunds ({(state.returns || []).filter(r => r.customerId === user.id).length})
        </button>
      </div>

      {/* Tab: All Orders */}
      {activeSubTab === "history" && (
        <div className="liquid-glass border border-black/15 dark:border-white/15 bg-white/70 dark:bg-black/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl dark:shadow-none">
          <div className="flex justify-between items-center pb-2 border-b border-black/10 dark:border-white/10">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">Maison Orders Tracker</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Click product name for details, or click card to expand complete order ledger</p>
            </div>
            <span className="text-[10px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 rounded-full text-muted-foreground font-mono font-bold">
              {userOrders.length} orders total
            </span>
          </div>

          {userOrders.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 mx-auto flex items-center justify-center text-accent">
                <ListOrdered className="w-8 h-8" />
              </div>
              <p className="text-sm text-muted-foreground italic">No orders found in your curation profile.</p>
              <Link to="/" className="inline-block bg-accent hover:bg-accent/90 text-white px-6 py-2.5 text-xs uppercase tracking-widest font-bold rounded-full transition-all shadow-md">
                Shop Curation
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map(order => {
                const firstItem = order.items?.[0];
                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-accent/50 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md text-foreground group"
                    onClick={() => setSelectedOrderDetails(order)}
                  >
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      {/* Left: Product Image & Basic Info */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        {firstItem?.image ? (
                          <img src={firstItem.image} alt={firstItem.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-black/10 dark:border-white/10 shrink-0 group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-accent shrink-0">
                            <ListOrdered className="w-8 h-8" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-accent">#{order.id}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">({order.date || "Recent"})</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate({ to: "/product/$productId", params: { productId: firstItem?.productId || "vnd-1" } });
                            }}
                            className="font-serif font-bold text-sm sm:text-base text-foreground hover:text-accent transition-colors truncate block text-left cursor-pointer"
                          >
                            {firstItem?.name || "Curation Apparel"}
                            {(order.items || []).length > 1 && (
                              <span className="text-xs font-mono text-accent ml-2 font-semibold">+{(order.items || []).length - 1} more items</span>
                            )}
                          </button>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span>Size: <strong className="text-foreground font-mono">{firstItem?.selectedSize || "M"}</strong></span>
                            <span>•</span>
                            <span>Qty: <strong className="text-foreground font-mono">{firstItem?.qty || 1}</strong></span>
                            <span>•</span>
                            <span>Est. Delivery: <strong className="text-foreground">{order.estimatedDeliveryDate || "3-5 Business Days"}</strong></span>
                          </div>

                          {(order.trackingNumber || order.awbCode) && (
                            <div className="flex flex-wrap items-center gap-2 pt-1.5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/25 text-accent text-[11px] font-semibold">
                                <Truck className="w-3.5 h-3.5 text-accent shrink-0" />
                                <span>{order.courierPartner || "Express Partner"}: <strong className="font-mono">{order.trackingNumber || order.awbCode}</strong></span>
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const trk = order.trackingNumber || order.awbCode || "";
                                  navigator.clipboard.writeText(trk);
                                  toast.success("AWB Tracking code copied to clipboard!");
                                }}
                                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-accent font-medium transition-colors cursor-pointer px-2 py-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-accent/20"
                                title="Copy AWB code"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy AWB</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Status Badge & Order Total & Actions */}
                      <div className="flex sm:flex-col justify-between sm:justify-center items-end gap-2 shrink-0 border-t sm:border-t-0 border-black/5 dark:border-white/5 pt-2 sm:pt-0">
                        <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                          {order.status || "Processing"}
                        </span>
                        {order.cancelReason && (
                          <span className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold block text-right max-w-[160px] truncate" title={order.cancelReason}>
                            {order.cancelReason}
                          </span>
                        )}
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Total Amount</span>
                          <span className="font-mono text-sm sm:text-base font-bold text-accent">₹{order.total.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap justify-end">
                          {!["delivered", "cancelled", "returned", "refunded", "rejected"].includes((order.status || "").toLowerCase()) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCancelModalOrder(order);
                              }}
                              className="text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <X className="w-3 h-3" />
                              <span>Cancel</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrderDetails(order);
                            }}
                            className="text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-black/10 dark:border-white/10 hover:border-accent hover:text-accent cursor-pointer transition-colors flex items-center gap-1 shadow-sm bg-white/50 dark:bg-zinc-900/50"
                          >
                            <Package className="w-3 h-3 text-accent" />
                            <span>Track & Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReviewFormItem({
                                productId: firstItem?.productId || (firstItem as any)?.id || "vnd-1",
                                orderId: order.id,
                                productName: firstItem?.name || "Apparel",
                                productImage: firstItem?.image || ""
                              });
                            }}
                            className="text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-white cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Star className="w-3 h-3 fill-current" />
                            <span>Review</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Returns & Refund Status */}
      {activeSubTab === "returns" && (
        <div className="liquid-glass border border-black/15 dark:border-white/15 bg-white/70 dark:bg-black/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl dark:shadow-none">
          <div className="flex justify-between items-center pb-2 border-b border-black/10 dark:border-white/10">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">Returns & Refunds Tracker</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Click card to view complete return timeline, settlement statement, and refund transaction details</p>
            </div>
          </div>

          <div className="space-y-4">
            {userReturns.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 mx-auto flex items-center justify-center text-accent">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <p className="text-xs text-muted-foreground italic">No return requests logged or in progress.</p>
              </div>
            ) : (
              userReturns.map(r => (
                <div
                  key={r.id}
                  className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-accent/50 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md text-foreground group"
                  onClick={() => setSelectedReturnDetails(r)}
                >
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Left: Icon & Product Info */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0 font-bold group-hover:scale-105 transition-transform">
                        <RotateCcw className="w-8 h-8" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-accent">#{r.id}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">(Order: #{r.orderId})</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate({ to: "/product/$productId", params: { productId: r.productId } });
                          }}
                          className="font-serif font-bold text-sm sm:text-base text-foreground hover:text-accent transition-colors truncate block text-left cursor-pointer"
                        >
                          {r.productName}
                        </button>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>Size: <strong className="text-foreground font-mono">{r.selectedSize || "M"}</strong></span>
                          <span>•</span>
                          <span>Qty: <strong className="text-foreground font-mono">{r.qty || 1}</strong></span>
                          <span>•</span>
                          <span>Reason: <strong className="text-foreground">{r.reason}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Badge & Refund Amount */}
                    <div className="flex sm:flex-col justify-between sm:justify-center items-end gap-2 shrink-0 border-t sm:border-t-0 border-black/5 dark:border-white/5 pt-2 sm:pt-0">
                      <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Refund Amount</span>
                        <span className="font-mono text-sm sm:text-base font-bold text-accent">₹{(r.refundAmount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Settled Refund Information Banner */}
                  {r.status === "Refund Completed" && (
                    <div className="mt-4 pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 bg-emerald-500/10 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 sm:px-5 rounded-b-2xl">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div className="text-xs">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            Refund Disbursed
                          </span>
                          <span className="text-muted-foreground ml-1.5 text-[11px]">
                            • {r.refundMethod || (r.razorpayRefundId ? "Original Payment Source (Razorpay)" : "ReeVibes Wallet")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        {(r.razorpayRefundId || r.refundTransactionId) && (
                          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 shadow-xs">
                            <span className="text-muted-foreground font-sans text-[10px] font-semibold uppercase">Razorpay Ref:</span>
                            <span className="font-bold text-sky-600 dark:text-sky-400">
                              {r.razorpayRefundId || r.refundTransactionId}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(r.razorpayRefundId || r.refundTransactionId || "");
                                toast.success("Razorpay Refund ID copied!");
                              }}
                              className="text-muted-foreground hover:text-accent p-0.5 cursor-pointer ml-1"
                              title="Copy Refund ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {r.walletTransactionId && (
                          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 shadow-xs">
                            <span className="text-muted-foreground font-sans text-[10px] font-semibold uppercase">Wallet:</span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              {r.walletTransactionId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Comprehensive Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="liquid-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-black/15 dark:border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 text-foreground shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-black/10 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Maison Order Ledger</span>
                <h3 className="font-serif text-2xl font-bold mt-0.5">Order #{selectedOrderDetails.id}</h3>
                <p className="text-[11px] text-muted-foreground font-mono">Placed on {selectedOrderDetails.date || "Recent"}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Cancellation Notice Banner */}
            {(selectedOrderDetails.status?.toLowerCase().includes("cancel") || selectedOrderDetails.cancelReason) && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Order Cancelled & Restored to Atelier Inventory</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Cancellation Reason: </span>
                  <span className="font-semibold text-foreground">{selectedOrderDetails.cancelReason || "Customer Cancellation"}</span>
                </div>
                {selectedOrderDetails.cancelNote && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Note: </span>
                    <span className="italic text-muted-foreground">"{selectedOrderDetails.cancelNote}"</span>
                  </div>
                )}
              </div>
            )}

            {/* Order Active Cancellation Action Bar */}
            {!["delivered", "cancelled", "returned", "refunded", "rejected"].includes((selectedOrderDetails.status || "").toLowerCase()) && (
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-foreground">Need to cancel this order?</span>
                  <p className="text-[11px] text-muted-foreground">You can cancel anytime before delivery. Size inventory will be immediately restored.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(selectedOrderDetails)}
                  className="px-4 py-2 rounded-full border border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer shrink-0"
                >
                  Cancel Order
                </button>
              </div>
            )}

            {/* Transit Timeline Progress Bar */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-accent" />
                  <span>Shipment Delivery Lifecycle</span>
                </span>
                <span className={`px-3 py-1 rounded-full border text-[10px] font-bold ${getStatusBadge(selectedOrderDetails.status)}`}>
                  {selectedOrderDetails.status || "Processing"}
                </span>
              </div>

              {(() => {
                const steps = [
                  { label: "Order Confirmed", desc: "Verified in system" },
                  { label: "Ready for Dispatch", desc: "AWB generated" },
                  { label: "In Transit", desc: "With carrier partner" },
                  { label: "Out for Delivery", desc: "Arriving with agent" },
                  { label: "Delivered", desc: "Successfully completed" }
                ];
                const status = (selectedOrderDetails.status || "").toLowerCase();
                let activeIdx = 0;
                if (selectedOrderDetails.courierPartner || selectedOrderDetails.trackingNumber || selectedOrderDetails.awbCode || status.includes("ready") || status.includes("scheduled") || status.includes("accepted")) activeIdx = 1;
                if (status.includes("shipped") || status.includes("transit") || status.includes("in-transit") || status.includes("dispatched")) activeIdx = 2;
                if (status.includes("out") || status.includes("delivery") || status.includes("tomorrow") || status.includes("today")) activeIdx = 3;
                if (status.includes("delivered") || status.includes("completed")) activeIdx = 4;

                return (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between w-full mt-2">
                      <div className="absolute left-0 right-0 top-2.5 h-1 bg-black/10 dark:bg-white/10 -z-10 rounded-full" />
                      <div
                        className="absolute left-0 top-2.5 h-1 bg-accent transition-all duration-500 -z-10 rounded-full shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                        style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
                      />
                      {steps.map((st, sIdx) => {
                        const isCompleted = sIdx <= activeIdx;
                        const isActive = sIdx === activeIdx;
                        return (
                          <div key={sIdx} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCompleted
                                  ? "bg-accent border-accent text-white shadow-[0_0_12px_rgba(212,175,55,0.7)]"
                                  : "bg-white dark:bg-zinc-950 border-black/20 dark:border-white/20 text-muted-foreground"
                              }`}
                            >
                              {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[10px] font-mono">{sIdx + 1}</span>}
                            </div>
                            <span
                              className={`text-[9px] uppercase tracking-wider mt-2 font-bold text-center leading-tight max-w-[70px] transition-colors ${
                                isActive ? "text-accent" : isCompleted ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Logistics Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-black/10 dark:border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">Courier Partner</span>
                  <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                    <Truck className="w-3 h-3 text-accent shrink-0" />
                    <span className="truncate">{selectedOrderDetails.courierPartner || "Shiprocket Express"}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">AWB Tracking Code</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-accent font-bold text-xs truncate">
                      {selectedOrderDetails.trackingNumber || selectedOrderDetails.awbCode || `Pending Assignment`}
                    </span>
                    {(selectedOrderDetails.trackingNumber || selectedOrderDetails.awbCode) && (
                      <button
                        type="button"
                        onClick={() => {
                          const trk = selectedOrderDetails.trackingNumber || selectedOrderDetails.awbCode;
                          navigator.clipboard.writeText(trk);
                          toast.success("AWB Tracking ID copied!");
                        }}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-accent transition-colors"
                        title="Copy AWB"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">Pickup Schedule</span>
                  <span className="font-medium text-foreground mt-0.5 block">
                    {selectedOrderDetails.pickupScheduledDate || "Warehouse Processing"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">Estimated Delivery</span>
                  <span className="font-medium text-foreground mt-0.5 block">
                    {selectedOrderDetails.estimatedDeliveryDate || "3-5 Business Days"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Live Track, Invoice, Label */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                {(selectedOrderDetails.trackingNumber || selectedOrderDetails.awbCode) && (
                  <button
                    type="button"
                    onClick={() => {
                      const trk = selectedOrderDetails.trackingNumber || selectedOrderDetails.awbCode;
                      window.open(`https://shiprocket.co/tracking/${encodeURIComponent(trk)}`, "_blank");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-white text-[10px] uppercase font-bold tracking-wider hover:bg-accent/90 transition-colors shadow-sm cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Carrier Tracking</span>
                  </button>
                )}

                {selectedOrderDetails.invoiceUrl ? (
                  <button
                    type="button"
                    onClick={() => window.open(selectedOrderDetails.invoiceUrl, "_blank")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/15 dark:border-white/15 bg-white/50 dark:bg-zinc-900/50 hover:border-accent text-[10px] uppercase font-bold tracking-wider hover:text-accent transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Download Tax Invoice (PDF)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => window.open(`/api/orders/${selectedOrderDetails.id}/print-invoice`, "_blank")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/15 dark:border-white/15 bg-white/50 dark:bg-zinc-900/50 hover:border-accent text-[10px] uppercase font-bold tracking-wider hover:text-accent transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Print Invoice</span>
                  </button>
                )}

                {selectedOrderDetails.labelUrl && (
                  <button
                    type="button"
                    onClick={() => window.open(selectedOrderDetails.labelUrl, "_blank")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/15 dark:border-white/15 bg-white/50 dark:bg-zinc-900/50 hover:border-accent text-[10px] uppercase font-bold tracking-wider hover:text-accent transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-500" />
                    <span>Shipping Docket (PDF)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Real-time Live Package Journey & Scan History */}
            <div className="border border-black/10 dark:border-white/10 rounded-2xl p-4 bg-black/5 dark:bg-white/5 space-y-3">
              <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-2">
                <h4 className="font-bold text-accent uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Live Package Journey & Scan Activity</span>
                </h4>
                <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  Active Sync
                </span>
              </div>

              {(() => {
                const scans = parseScans(selectedOrderDetails.scansJson);
                if (scans.length > 0) {
                  return (
                    <div className="space-y-3 max-h-52 overflow-y-auto pl-2 border-l-2 border-accent/40 my-2">
                      {scans.map((scan, sIdx) => (
                        <div key={sIdx} className="relative pl-4 space-y-0.5">
                          <div className="absolute left-[-9px] top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-white dark:border-zinc-950 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                          <div className="font-bold text-xs text-foreground flex items-center justify-between">
                            <span>{scan.activity}</span>
                            {scan.status && (
                              <span className="text-[9px] font-mono uppercase bg-black/5 dark:bg-white/10 px-1.5 py-0.2 rounded text-muted-foreground">
                                {scan.status}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                            <span>{scan.date}</span>
                            <span>•</span>
                            <span className="font-semibold text-accent/90">{scan.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                // If no scans yet, show reassuring milestone status
                const isDispatched = !!(selectedOrderDetails.trackingNumber || selectedOrderDetails.awbCode);
                return (
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs text-muted-foreground space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-accent" />
                      <span>{isDispatched ? "Shipment Registered with Courier Partner" : "Order Placed & In Queue"}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {isDispatched
                        ? `Airway Bill (AWB) has been generated via ${selectedOrderDetails.courierPartner || "Shiprocket Express"}. Real-time physical scan events will display here as your parcel passes through regional sorting and fulfillment hubs.`
                        : "Your order is confirmed and currently being prepared by the atelier. Airway Bill assignment and live transit scans will activate upon courier handover."}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Items List (Individual Product Section) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-2">
                <h4 className="text-xs uppercase font-bold tracking-wider text-accent">
                  Purchased Curation Items ({(selectedOrderDetails.items || []).length})
                </h4>
                <span className="text-[10px] text-muted-foreground">
                  Individual Product Tracking & Actions
                </span>
              </div>

              {(selectedOrderDetails.items || []).map((item: any, idx: number) => {
                const returnEligibility = isReturnEligible(selectedOrderDetails);
                const orderStatus = (selectedOrderDetails.status || "").toLowerCase();
                const trk = selectedOrderDetails.trackingNumber || selectedOrderDetails.awbCode;

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img src={item.image} alt={item.name} className="w-16 h-18 object-cover rounded-xl border border-black/10 dark:border-white/10 shrink-0" />
                        <div className="min-w-0 space-y-1">
                          <Link
                            to="/product/$productId"
                            params={{ productId: item.productId || (item as any)?.id || "vnd-1" }}
                            className="font-serif font-bold text-sm sm:text-base text-foreground hover:text-accent truncate block"
                          >
                            {item.name}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>Size: <strong className="text-foreground font-mono">{item.selectedSize || "M"}</strong></span>
                            <span>•</span>
                            <span>Qty: <strong className="text-foreground font-mono">{item.qty || 1}</strong></span>
                            <span>•</span>
                            <span className="font-mono font-bold text-foreground">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs text-muted-foreground block font-semibold">Unit Price</span>
                        <span className="font-mono font-bold text-sm text-accent">₹{(item.price || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Product-Specific Fulfillment Tracking Badge & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/5 dark:border-white/5 text-xs">
                      <div className="flex items-center gap-1.5">
                        {orderStatus.includes("delivered") ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Delivered to Recipient</span>
                          </span>
                        ) : orderStatus.includes("out") ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                            <Truck className="w-3 h-3" />
                            <span>Out for Delivery Today</span>
                          </span>
                        ) : trk ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-[10px] font-bold">
                            <Truck className="w-3 h-3" />
                            <span>In Transit via {selectedOrderDetails.courierPartner || "Express"} ({trk})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-muted-foreground text-[10px] font-bold">
                            <Clock className="w-3 h-3" />
                            <span>Atelier Packaging & Quality Check</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReviewFormItem({
                              productId: item.productId || (item as any)?.id || "vnd-1",
                              orderId: selectedOrderDetails.id,
                              productName: item.name,
                              productImage: item.image
                            });
                            setSelectedOrderDetails(null);
                          }}
                          className="text-[9px] uppercase font-bold px-3 py-1 rounded-full border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-white cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Rate Product</span>
                        </button>

                        {returnEligibility.eligible ? (
                          <button
                            onClick={() => {
                              setReturnFormItem({
                                orderId: selectedOrderDetails.id,
                                productId: item.productId || item.id,
                                productName: item.name,
                                price: String(item.price),
                                selectedSize: item.selectedSize || "M",
                                qty: item.qty || 1,
                                image: item.image,
                                paymentMethod: selectedOrderDetails.paymentMethod || "Razorpay Gateway",
                                razorpayAmountPaid: selectedOrderDetails.razorpayAmountPaid,
                                walletAmountUsed: selectedOrderDetails.walletAmountUsed,
                                total: selectedOrderDetails.total,
                                deliveryDate: selectedOrderDetails.deliveryDate
                              });
                              setSelectedOrderDetails(null);
                            }}
                            className="text-[9px] uppercase font-bold px-3 py-1 rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>Return Product ({returnEligibility.daysLeft}d left)</span>
                          </button>
                        ) : (
                          <span
                            title={returnEligibility.reason}
                            className="text-[9px] uppercase font-bold px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-muted-foreground opacity-60 cursor-not-allowed"
                          >
                            {orderStatus.includes("delivered") ? "7-Day Window Expired" : "Return Available After Delivery"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shipping Address & Payment Breakdown Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Shipping Address Card */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-accent block">Shipping Address</span>
                <div className="font-semibold text-foreground">{selectedOrderDetails.shippingAddress?.name || user.firstName}</div>
                <p className="text-muted-foreground leading-relaxed">{selectedOrderDetails.shippingAddress?.street || selectedOrderDetails.shippingAddress || "Primary Delivery Address"}</p>
                <div className="text-[11px] font-mono text-muted-foreground pt-1">Phone: {selectedOrderDetails.shippingAddress?.phone || user.phone || "N/A"}</div>
              </div>

              {/* Payment Breakdown Card */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-accent block">Payment Breakdown</span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-foreground uppercase">{selectedOrderDetails.paymentMethod || "Prepaid"}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment Status:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase">{selectedOrderDetails.paymentStatus || "Paid"}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pt-1 border-t border-black/5 dark:border-white/5">
                  <span>Subtotal:</span>
                  <span className="font-mono text-foreground">₹{(selectedOrderDetails.subtotal || selectedOrderDetails.total).toLocaleString()}</span>
                </div>
                {selectedOrderDetails.walletAmountUsed && (
                  <div className="flex justify-between text-purple-400 text-xs font-medium">
                    <span>Wallet Credits Used:</span>
                    <span className="font-mono">-₹{Number(selectedOrderDetails.walletAmountUsed).toLocaleString()}</span>
                  </div>
                )}
                {selectedOrderDetails.razorpayAmountPaid && (
                  <div className="flex justify-between text-sky-400 text-xs font-medium">
                    <span>Paid via Razorpay:</span>
                    <span className="font-mono">₹{Number(selectedOrderDetails.razorpayAmountPaid).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-foreground font-bold text-sm pt-1 border-t border-black/10 dark:border-white/10">
                  <span>Total Paid:</span>
                  <span className="font-mono text-accent">₹{selectedOrderDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Return & Refund Detailed View Modal */}
      {selectedReturnDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="liquid-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-black/15 dark:border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 text-foreground shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-black/10 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Return & Refund Ledger</span>
                <h3 className="font-serif text-2xl font-bold mt-0.5">Return #{selectedReturnDetails.id}</h3>
                <p className="text-[11px] text-muted-foreground font-mono">Associated Order ID: {selectedReturnDetails.orderId}</p>
              </div>
              <button
                onClick={() => setSelectedReturnDetails(null)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Return Progress Timeline */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span>Return Process Roadmap</span>
                <span className={`px-3 py-1 rounded-full border text-[10px] ${getStatusBadge(selectedReturnDetails.status)}`}>
                  {selectedReturnDetails.status}
                </span>
              </div>

              {(() => {
                const RETURN_TIMELINE_STEPS = [
                  "Return Requested",
                  "Under Review",
                  "Approved",
                  "Pickup Scheduled",
                  "Item Received",
                  "Refund Processed",
                  "Refund Completed"
                ];
                const isRejected = selectedReturnDetails.status === "Rejected";
                const currentStepIndex = RETURN_TIMELINE_STEPS.indexOf(selectedReturnDetails.status);

                if (isRejected) {
                  return (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-xs text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold uppercase tracking-wider">Return Request Rejected</h4>
                        <p className="mt-1 font-medium text-rose-500">Reason: {selectedReturnDetails.rejectionReason || "Item does not meet return policy criteria"}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between w-full mt-2">
                      <div className="absolute left-0 right-0 top-2.5 h-1 bg-black/10 dark:bg-white/10 -z-10 rounded-full" />
                      <div
                        className="absolute left-0 top-2.5 h-1 bg-accent transition-all duration-500 -z-10 rounded-full"
                        style={{ width: `${Math.max(0, (currentStepIndex / (RETURN_TIMELINE_STEPS.length - 1)) * 100)}%` }}
                      />
                      {RETURN_TIMELINE_STEPS.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;
                        return (
                          <div key={step} className="flex flex-col items-center flex-1">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                isCurrent
                                  ? "bg-accent border-accent text-white scale-110 shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                                  : isCompleted
                                  ? "bg-accent border-accent text-white"
                                  : "bg-white dark:bg-zinc-950 border-black/20 dark:border-white/20"
                              }`}
                            >
                              {isCompleted && !isCurrent ? (
                                <Check className="w-2.5 h-2.5" />
                              ) : (
                                <span className="text-[7px] font-mono font-bold">{idx + 1}</span>
                              )}
                            </div>
                            <span
                              className={`text-[8px] uppercase tracking-wider mt-2 font-bold text-center leading-tight transition-colors ${
                                isCurrent ? "text-accent" : isCompleted ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Return Item & Refund Details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-accent block">Returned Product Details</span>
                <div className="font-serif font-bold text-sm text-foreground">{selectedReturnDetails.productName}</div>
                <div className="text-muted-foreground font-mono">Size: <strong className="text-foreground">{selectedReturnDetails.selectedSize || "M"}</strong> • Qty: <strong className="text-foreground">{selectedReturnDetails.qty || 1}</strong></div>
                <div className="pt-2 border-t border-black/5 dark:border-white/5 text-muted-foreground">
                  <span className="font-semibold text-foreground">Return Reason:</span> {selectedReturnDetails.reason}
                </div>
                {selectedReturnDetails.comment && (
                  <div className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Customer Comments:</span> {selectedReturnDetails.comment}
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-accent block">Refund Statement & Settlement</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    selectedReturnDetails.status === "Refund Completed"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  }`}>
                    {selectedReturnDetails.status === "Refund Completed" ? "Disbursed & Settled" : "Refund Pending"}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground font-semibold">Total Refund Amount:</span>
                  <span className="font-mono text-base font-bold text-accent">₹{(selectedReturnDetails.refundAmount || 0).toLocaleString()}</span>
                </div>

                {selectedReturnDetails.razorpayRefundAmount > 0 && (
                  <div className="flex justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>• Razorpay Gateway Reversal:</span>
                    <span className="font-mono font-bold">₹{selectedReturnDetails.razorpayRefundAmount.toLocaleString()}</span>
                  </div>
                )}
                {selectedReturnDetails.walletRefundAmount > 0 && (
                  <div className="flex justify-between text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    <span>• ReeVibes Wallet Credit:</span>
                    <span className="font-mono font-bold">₹{selectedReturnDetails.walletRefundAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground font-semibold">Refund Mode:</span>
                  <span className="font-medium text-foreground">{selectedReturnDetails.refundMethod || (selectedReturnDetails.razorpayRefundId ? "Original Payment Source (Razorpay)" : "ReeVibes Wallet")}</span>
                </div>

                {/* Copyable Razorpay Refund ID */}
                {(selectedReturnDetails.razorpayRefundId || selectedReturnDetails.refundTransactionId) && (
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-black/5 dark:border-white/5">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Razorpay Refund ID</div>
                      <div className="font-mono text-xs text-sky-600 dark:text-sky-400 font-bold">
                        {selectedReturnDetails.razorpayRefundId || selectedReturnDetails.refundTransactionId}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedReturnDetails.razorpayRefundId || selectedReturnDetails.refundTransactionId || "");
                        toast.success("Razorpay Refund ID copied!");
                      }}
                      className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 bg-white dark:bg-zinc-800 px-2 py-1 rounded-md border border-black/10 dark:border-white/10 cursor-pointer shadow-xs"
                      title="Copy Refund ID"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                )}

                {/* Copyable Wallet Transaction ID */}
                {selectedReturnDetails.walletTransactionId && (
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-black/5 dark:border-white/5">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Wallet Transaction ID</div>
                      <div className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                        {selectedReturnDetails.walletTransactionId}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedReturnDetails.walletTransactionId || "");
                        toast.success("Wallet Transaction ID copied!");
                      }}
                      className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 bg-white dark:bg-zinc-800 px-2 py-1 rounded-md border border-black/10 dark:border-white/10 cursor-pointer shadow-xs"
                      title="Copy Wallet Tx ID"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                )}

                {selectedReturnDetails.refundDate && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-semibold">Refund Date:</span>
                    <span className="font-mono text-foreground">{selectedReturnDetails.refundDate}</span>
                  </div>
                )}

                {selectedReturnDetails.status === "Refund Completed" && (
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Settlement Confirmed</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      For Razorpay online payments, refunds are directly sent to your original bank, card, or UPI account. Depending on your bank's clearance cycles, funds typically reflect in 2–5 business days.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Dialog Modal */}
      {reviewFormItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass max-w-md w-full p-6 md:p-8 space-y-4 shadow-2xl bg-white dark:bg-zinc-950 border border-black/15 dark:border-white/20 rounded-3xl animate-in zoom-in-95 duration-200 text-foreground">
            <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-3">
              <h3 className="font-serif text-xl font-bold">Write Verified Review</h3>
              <button onClick={() => setReviewFormItem(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setReviewRating(stars)}
                  className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star className={`w-6 h-6 ${stars <= reviewRating ? "fill-current text-amber-400" : "text-black/20 dark:text-white/20"}`} />
                </button>
              ))}
            </div>
            <textarea
              required
              placeholder="Share your experience styling this piece..."
              className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded-2xl p-3 text-xs outline-none focus:border-accent h-28 text-foreground placeholder:text-muted-foreground/50 transition-colors"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  if (!reviewText.trim()) {
                    toast.error("Please explain your review in detail.");
                    return;
                  }
                  addReview(reviewFormItem.productId, {
                    userName: `${user.firstName} ${user.lastName}`,
                    rating: reviewRating,
                    comment: reviewText.trim()
                  });
                  toast.success("Thank you! Review submitted successfully.");
                  setReviewFormItem(null);
                }}
                className="flex-1 bg-accent text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent/90 transition-transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
              >
                Submit Review
              </button>
              <button
                onClick={() => setReviewFormItem(null)}
                className="bg-black/5 dark:bg-white/10 text-foreground px-5 py-2.5 rounded-full text-xs cursor-pointer font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Form Modal */}
      {returnFormItem && (() => {
        const unitPriceNum = Number(String(returnFormItem.price).replace(/[^0-9.]/g, "")) || 0;
        const totalRefundAmount = unitPriceNum * (returnFormItem.qty || 1);
        const isCOD = (returnFormItem.paymentMethod || "").toUpperCase().includes("COD");
        const isWallet = (returnFormItem.paymentMethod || "").toLowerCase().includes("wallet") || ((returnFormItem.walletAmountUsed ?? 0) > 0 && (returnFormItem.razorpayAmountPaid ?? 0) === 0);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="liquid-glass max-w-xl w-full p-6 md:p-8 space-y-5 shadow-2xl bg-white dark:bg-zinc-950 border border-black/15 dark:border-white/20 rounded-3xl animate-in zoom-in-95 duration-200 text-foreground max-h-[92vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-black/10 dark:border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Maison Returns & Exchanges</span>
                    <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                      7-Day Window Active
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1">Initiate Product Return</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Order #{returnFormItem.orderId} • Reverse courier arranged by Shiprocket</p>
                </div>
                <button onClick={() => setReturnFormItem(null)} className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Brief Card */}
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-3.5">
                {returnFormItem.image ? (
                  <img src={returnFormItem.image} alt="" className="w-14 h-16 object-cover rounded-xl border border-black/10 dark:border-white/10 shrink-0" />
                ) : (
                  <div className="w-14 h-16 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0 font-bold">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-0.5 text-xs">
                  <div className="font-serif font-bold text-sm text-foreground truncate">{returnFormItem.productName}</div>
                  <div className="text-muted-foreground flex flex-wrap gap-2 text-[11px]">
                    <span>Size: <strong className="text-foreground font-mono">{returnFormItem.selectedSize || "M"}</strong></span>
                    <span>•</span>
                    <span>Qty: <strong className="text-foreground font-mono">{returnFormItem.qty || 1}</strong></span>
                    <span>•</span>
                    <span>Unit: <strong className="text-accent font-mono">₹{unitPriceNum.toLocaleString()}</strong></span>
                  </div>
                  <div className="text-[11px] text-muted-foreground pt-0.5">
                    Original Payment: <strong className="text-foreground">{returnFormItem.paymentMethod || "Razorpay Gateway"}</strong>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Refundable</span>
                  <span className="font-mono text-base font-bold text-accent">₹{totalRefundAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                {/* Refined Reason Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    Primary Reason for Return <span className="text-accent">*</span>
                  </label>
                  <div className="space-y-1.5">
                    <select
                      value={returnReason}
                      onChange={e => setReturnReason(e.target.value)}
                      className="w-full bg-black/5 dark:bg-zinc-900 border border-black/15 dark:border-white/15 p-3 rounded-xl text-xs outline-none text-foreground focus:border-accent font-medium cursor-pointer"
                    >
                      {REFINED_RETURN_REASONS.map(r => (
                        <option key={r.id} value={`${r.icon} ${r.label}`}>
                          {r.icon} {r.label} — {r.description}
                        </option>
                      ))}
                    </select>
                    {(() => {
                      const matched = REFINED_RETURN_REASONS.find(r => returnReason.includes(r.label));
                      if (matched) {
                        return (
                          <div className="text-[11px] text-muted-foreground bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <span className="text-accent">{matched.icon}</span>
                            <span>{matched.description}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
                
                {/* Comments */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs text-muted-foreground uppercase tracking-wider font-bold">
                      Additional Remarks & Observations
                    </label>
                    <span className="text-[10px] font-mono text-muted-foreground">{returnDesc.length} / 500 characters</span>
                  </div>
                  <textarea
                    maxLength={500}
                    placeholder="Provide details about size discrepancy, flaw placement, or parcel condition to accelerate atelier verification..."
                    className="w-full bg-black/5 dark:bg-zinc-900 border border-black/15 dark:border-white/10 rounded-2xl p-3 text-xs outline-none focus:border-accent h-22 text-foreground resize-none"
                    value={returnDesc}
                    onChange={e => setReturnDesc(e.target.value)}
                  />
                </div>

                {/* Refund Settlement Preview Box */}
                <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/25 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-accent uppercase tracking-wider text-[10px]">
                      <ShieldCheck className="w-4 h-4 text-accent" />
                      <span>Settlement & Refund Guarantee</span>
                    </span>
                    <span className="font-mono text-sm text-foreground">₹{totalRefundAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {isCOD ? (
                      <span>
                        <strong>Cash on Delivery Order:</strong> Since this order was paid via cash, your refund will be deposited directly to your <strong>ReeVibes Wallet</strong> instantly once the return parcel is verified at the warehouse. You can use your wallet balance for future curated shopping anytime.
                      </span>
                    ) : isWallet ? (
                      <span>
                        <strong>ReeVibes Wallet Order:</strong> The entire refund amount of ₹{totalRefundAmount.toLocaleString()} will be refunded directly back to your <strong>ReeVibes Wallet balance</strong>.
                      </span>
                    ) : (
                      <span>
                        <strong>Online Payment (Razorpay / UPI):</strong> Once our warehouse team receives and inspects the return parcel, the refund of ₹{totalRefundAmount.toLocaleString()} will be automatically processed via <strong>Razorpay</strong> back to your original payment instrument (UPI / Bank Account / Card) or credited to your ReeVibes Wallet.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setReturnFormItem(null)}
                  className="flex-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/15 dark:border-white/15 py-2.5 rounded-full text-xs text-foreground font-semibold transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    requestReturn({
                      orderId: returnFormItem.orderId,
                      productId: returnFormItem.productId,
                      productName: returnFormItem.productName,
                      customerId: user.id,
                      customerName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Maison Customer",
                      reason: returnReason,
                      comment: returnDesc.trim(),
                      images: returnFormItem.image ? [returnFormItem.image] : [],
                      videos: [],
                      refundAmount: totalRefundAmount,
                      selectedSize: returnFormItem.selectedSize,
                      qty: returnFormItem.qty,
                      refundMethod: isCOD ? "ReeVibes Wallet (COD Refund)" : isWallet ? "ReeVibes Wallet" : "Original Payment Method (Razorpay)"
                    });
                    toast.success("Return request logged! Operations atelier has received your request.");
                    setReturnFormItem(null);
                    navigate({ to: "/orders", search: { tab: "returns" } as any });
                  }}
                  className="flex-1 bg-accent text-white hover:bg-accent/90 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Submit Return Request</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Review & Rating Form Modal */}
      {reviewFormItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl bg-white dark:bg-zinc-950 border border-black/15 dark:border-white/20 rounded-3xl animate-in zoom-in-95 duration-200 text-foreground">
            <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-accent/15 text-accent">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Verified Buyer Feedback</span>
                  <h3 className="font-serif text-xl font-bold mt-0.5">Rate & Review</h3>
                </div>
              </div>
              <button onClick={() => setReviewFormItem(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              {reviewFormItem.productImage && (
                <img
                  src={reviewFormItem.productImage}
                  alt={reviewFormItem.productName || "Product"}
                  className="w-14 h-16 object-cover rounded-xl border border-black/10 dark:border-white/10 shrink-0"
                />
              )}
              <div className="min-w-0">
                <div className="font-serif font-bold text-sm text-foreground truncate">
                  {reviewFormItem.productName || "Luxury Apparel"}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5 flex items-center gap-2">
                  <span>Product Code: <strong className="text-foreground">{reviewFormItem.productId}</strong></span>
                  <span>•</span>
                  <span>Order: <strong className="text-accent">#{reviewFormItem.orderId}</strong></span>
                </div>
              </div>
            </div>

            {/* Rating Stars Selector */}
            <div className="space-y-2 text-center">
              <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Your Overall Rating
              </label>
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setReviewRating(starVal)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        starVal <= reviewRating
                          ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
                          : "text-zinc-600 fill-transparent hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-500 block">
                {reviewRating === 5 && "Outstanding — 5 Stars"}
                {reviewRating === 4 && "Very Good — 4 Stars"}
                {reviewRating === 3 && "Average — 3 Stars"}
                {reviewRating === 2 && "Below Expectations — 2 Stars"}
                {reviewRating === 1 && "Poor — 1 Star"}
              </span>
            </div>

            {/* Review Comment Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Written Review
                </label>
                <span className="text-[10px] font-mono text-muted-foreground">{reviewText.length} / 500 characters</span>
              </div>
              <textarea
                maxLength={500}
                placeholder="Describe your fit, quality, styling experience, and material feel..."
                className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded-2xl p-3 text-xs outline-none focus:border-accent h-28 text-foreground resize-none leading-relaxed"
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-4 border-t border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setReviewFormItem(null)}
                className="flex-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/15 dark:border-white/15 py-2.5 rounded-full text-xs text-foreground font-semibold transition-colors uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!reviewText.trim()}
                onClick={() => {
                  if (!reviewText.trim()) {
                    toast.error("Please provide a written review comment.");
                    return;
                  }
                  addReview(reviewFormItem.productId, {
                    userId: user.id,
                    userEmail: user.email,
                    userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Verified Buyer",
                    orderId: reviewFormItem.orderId,
                    productName: reviewFormItem.productName,
                    productImage: reviewFormItem.productImage,
                    rating: reviewRating,
                    comment: reviewText.trim(),
                  });
                  toast.success("Thank you! Your verified purchase review has been submitted.");
                  setReviewFormItem(null);
                  setReviewText("");
                  setReviewRating(5);
                }}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform shadow-md cursor-pointer ${
                  reviewText.trim()
                    ? "bg-accent text-white hover:bg-accent/90 hover:scale-105 active:scale-95"
                    : "bg-black/20 dark:bg-white/10 text-muted-foreground cursor-not-allowed"
                }`}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Order Cancellation Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="liquid-glass max-w-md w-full bg-white dark:bg-zinc-950 border border-black/15 dark:border-white/20 rounded-3xl p-6 sm:p-7 space-y-5 text-foreground shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-black/10 dark:border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-rose-500 font-bold">Cancellation Request</span>
                <h3 className="font-serif text-xl font-bold mt-0.5">Cancel Order #{cancelModalOrder.id}</h3>
              </div>
              <button
                disabled={isCancelling}
                onClick={() => setCancelModalOrder(null)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning / Restock Notice */}
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-xs text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Cancelling will stop order fulfillment. All reserved quantities across your selected sizes will be automatically restored to the atelier catalog immediately.
              </p>
            </div>

            {/* Cancellation Reason Radios */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-accent block">
                Please select a reason for cancellation:
              </label>

              <div className="space-y-1.5">
                {CANCELLATION_REASONS.map((r) => {
                  const isSelected = cancelReason === r;
                  return (
                    <label
                      key={r}
                      onClick={() => setCancelReason(r)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "bg-accent/15 border-accent text-foreground font-semibold shadow-xs"
                          : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 text-muted-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancel_reason"
                        checked={isSelected}
                        onChange={() => setCancelReason(r)}
                        className="w-3.5 h-3.5 text-accent accent-accent cursor-pointer"
                      />
                      <span>{r}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Note / Comments Textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                {cancelReason === "Other" ? (
                  <span className="text-rose-500 dark:text-rose-400">Please provide reason details (Required) *</span>
                ) : (
                  <span>Additional note (Optional)</span>
                )}
              </label>
              <textarea
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                placeholder={cancelReason === "Other" ? "Explain why you are cancelling this order..." : "Any feedback for the atelier team..."}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded-xl p-3 text-xs outline-none focus:border-accent h-20 text-foreground resize-none leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2.5 pt-2 border-t border-black/10 dark:border-white/10">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setCancelModalOrder(null)}
                className="flex-1 py-2.5 rounded-full border border-black/15 dark:border-white/15 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={isCancelling || (cancelReason === "Other" && !cancelNote.trim())}
                onClick={handleConfirmCancelOrder}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
