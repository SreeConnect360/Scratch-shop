import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePortal, isReturnEligible } from "@/lib/portal-state";
import { useState, useMemo } from "react";
import { z } from "zod";
import { 
  X, Check, AlertTriangle, Star, ListOrdered, 
  RotateCcw, ArrowLeft, Search, FileText, Copy, ExternalLink, Package, Truck, Clock, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

const ordersSearchSchema = z.object({
  tab: z.enum(["history", "returns"]).catch("history"),
});

export const Route = createFileRoute("/_shop/orders")({
  validateSearch: (search) => ordersSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "My Maison Orders Tracker — ReeVibes" }] }),
  component: ShopOrdersPage,
});

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

function ShopOrdersPage() {
  const { state, requestReturn, addReview } = usePortal();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const user = state.user;

  // Active sub-tab
  const activeSubTab = tab || "history";

  // Details Modal States
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [selectedReturnDetails, setSelectedReturnDetails] = useState<any | null>(null);

  // Review Form States
  const [reviewFormItem, setReviewFormItem] = useState<{ productId: string; orderId: string } | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // Return Wizard States
  const [returnFormItem, setReturnFormItem] = useState<{ orderId: string; productId: string; productName: string; price: string; selectedSize: string; qty: number } | null>(null);
  const [returnReason, setReturnReason] = useState("Product arrived damaged");
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
                        </div>
                      </div>

                      {/* Right: Status Badge & Order Total */}
                      <div className="flex sm:flex-col justify-between sm:justify-center items-end gap-2 shrink-0 border-t sm:border-t-0 border-black/5 dark:border-white/5 pt-2 sm:pt-0">
                        <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                          {order.status || "Processing"}
                        </span>
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Total Amount</span>
                          <span className="font-mono text-sm sm:text-base font-bold text-accent">₹{order.total.toLocaleString()}</span>
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

            {/* Transit Timeline Progress Bar */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span>Shipment Delivery Status</span>
                <span className={`px-3 py-1 rounded-full border text-[10px] ${getStatusBadge(selectedOrderDetails.status)}`}>
                  {selectedOrderDetails.status || "Processing"}
                </span>
              </div>

              {(() => {
                const steps = ["Order Confirmed", "Delivery Assigned", "Out for Delivery", "Delivered Successfully"];
                const status = (selectedOrderDetails.status || "").toLowerCase();
                let activeIdx = 0;
                if (selectedOrderDetails.courierPartner || selectedOrderDetails.trackingNumber || status.includes("ready") || status.includes("scheduled") || status.includes("shipped")) activeIdx = 1;
                if (status.includes("transit") || status.includes("out") || status.includes("delivery")) activeIdx = 2;
                if (status.includes("delivered") || status.includes("completed")) activeIdx = 3;

                return (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between w-full mt-2">
                      <div className="absolute left-0 right-0 top-2.5 h-1 bg-black/10 dark:bg-white/10 -z-10 rounded-full" />
                      <div
                        className="absolute left-0 top-2.5 h-1 bg-accent transition-all duration-500 -z-10 rounded-full"
                        style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
                      />
                      {steps.map((st, sIdx) => {
                        const isCompleted = sIdx <= activeIdx;
                        const isActive = sIdx === activeIdx;
                        return (
                          <div key={sIdx} className="flex flex-col items-center">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCompleted
                                  ? "bg-accent border-accent text-white shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                                  : "bg-white dark:bg-zinc-950 border-black/20 dark:border-white/20"
                              }`}
                            >
                              {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span
                              className={`text-[9px] uppercase tracking-wider mt-2 font-bold text-center leading-tight transition-colors ${
                                isActive ? "text-accent" : isCompleted ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-black/10 dark:border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">Courier Partner</span>
                  <span className="font-medium text-foreground">{selectedOrderDetails.courierPartner || "Delhivery Express"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">Tracking ID</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-accent font-bold">{selectedOrderDetails.trackingNumber || `TRK-${selectedOrderDetails.id.replace("ORD-", "")}`}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedOrderDetails.trackingNumber || `TRK-${selectedOrderDetails.id.replace("ORD-", "")}`);
                        toast.success("Tracking ID copied!");
                      }}
                      className="text-[9px] text-muted-foreground hover:text-accent underline cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">Estimated Delivery</span>
                  <span className="font-medium text-foreground">{selectedOrderDetails.estimatedDeliveryDate || "3-5 Business Days"}</span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-accent border-b border-black/10 dark:border-white/10 pb-2">Purchased Curation Items</h4>
              {(selectedOrderDetails.items || []).map((item: any, idx: number) => {
                const returnEligibility = isReturnEligible(selectedOrderDetails);
                return (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded-xl border border-black/10 dark:border-white/10 shrink-0" />
                      <div className="min-w-0">
                        <Link
                          to="/product/$productId"
                          params={{ productId: item.productId }}
                          className="font-serif font-bold text-sm text-foreground hover:text-accent truncate block"
                        >
                          {item.name}
                        </Link>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          Size: <strong className="text-foreground">{item.selectedSize || "M"}</strong> • Qty: <strong className="text-foreground">{item.qty || 1}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-sm text-foreground">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</div>
                      <div className="flex gap-1.5 mt-1.5 justify-end">
                        {selectedOrderDetails.status === "Delivered" && (
                          <button
                            onClick={() => {
                              setReviewFormItem({ productId: item.productId, orderId: selectedOrderDetails.id });
                              setSelectedOrderDetails(null);
                            }}
                            className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border border-accent/30 text-accent hover:bg-accent hover:text-white cursor-pointer"
                          >
                            Review
                          </button>
                        )}
                        {returnEligibility.eligible ? (
                          <button
                            onClick={() => {
                              setReturnFormItem({
                                orderId: selectedOrderDetails.id,
                                productId: item.productId,
                                productName: item.name,
                                price: String(item.price),
                                selectedSize: item.selectedSize || "M",
                                qty: item.qty || 1
                              });
                              setSelectedOrderDetails(null);
                            }}
                            className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white cursor-pointer"
                          >
                            Return Order
                          </button>
                        ) : (
                          <span
                            title={returnEligibility.reason}
                            className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-muted-foreground opacity-60 cursor-not-allowed"
                          >
                            Return Closed
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

              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-accent block">Refund Statement & Settlement</span>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Total Refund:</span>
                  <span className="font-mono text-sm font-bold text-accent">₹{(selectedReturnDetails.refundAmount || 0).toLocaleString()}</span>
                </div>
                {selectedReturnDetails.razorpayRefundAmount > 0 && (
                  <div className="flex justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>• Razorpay Gateway Refund:</span>
                    <span className="font-mono">₹{selectedReturnDetails.razorpayRefundAmount.toLocaleString()}</span>
                  </div>
                )}
                {selectedReturnDetails.walletRefundAmount > 0 && (
                  <div className="flex justify-between text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    <span>• ReeVibes Wallet Credit:</span>
                    <span className="font-mono">₹{selectedReturnDetails.walletRefundAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Refund Method:</span>
                  <span className="font-medium text-foreground">{selectedReturnDetails.refundMethod || "Original Payment Split"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Razorpay Ref:</span>
                  <span className="font-mono text-[10px] text-foreground">{selectedReturnDetails.razorpayRefundId || selectedReturnDetails.refundTransactionId || "N/A"}</span>
                </div>
                {selectedReturnDetails.walletTransactionId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Wallet Ref:</span>
                    <span className="font-mono text-[10px] text-amber-500">{selectedReturnDetails.walletTransactionId}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-black/5 dark:border-white/5">
                  <span className="text-muted-foreground font-semibold">Settlement Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedReturnDetails.status === "Refund Completed" ? "Refund Completed" : "Processing"}</span>
                </div>
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
      {returnFormItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl bg-white dark:bg-zinc-950 border border-black/15 dark:border-white/20 rounded-3xl animate-in zoom-in-95 duration-200 text-foreground">
            <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Maison Returns Desk</span>
                <h3 className="font-serif text-xl font-bold mt-1">Return: {returnFormItem.productName}</h3>
              </div>
              <button onClick={() => setReturnFormItem(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Return Reason</label>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="w-full bg-black/5 dark:bg-zinc-900 border border-black/15 dark:border-white/10 p-3 rounded-xl text-xs outline-none text-foreground focus:border-accent"
                >
                  <option value="Product arrived damaged">Product arrived damaged</option>
                  <option value="Wrong item delivered">Wrong item delivered</option>
                  <option value="Wrong size delivered">Wrong size delivered</option>
                  <option value="Too small">Too small</option>
                  <option value="Too large">Too large</option>
                  <option value="Product color different from website">Product color different from website</option>
                  <option value="Poor quality material">Poor quality material</option>
                  <option value="No longer needed">No longer needed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Comments (Optional)</label>
                  <span className="text-[10px] font-mono text-muted-foreground">{returnDesc.length} / 500 characters</span>
                </div>
                <textarea
                  maxLength={500}
                  placeholder="Please explain the issue or provide details..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded-2xl p-3 text-xs outline-none focus:border-accent h-24 text-foreground resize-none"
                  value={returnDesc}
                  onChange={e => setReturnDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-black/10 dark:border-white/10">
              <button
                onClick={() => setReturnFormItem(null)}
                className="flex-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/15 dark:border-white/15 py-2.5 rounded-full text-xs text-foreground font-semibold transition-colors uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  requestReturn({
                    orderId: returnFormItem.orderId,
                    productId: returnFormItem.productId,
                    productName: returnFormItem.productName,
                    customerId: user.id,
                    customerName: `${user.firstName} ${user.lastName}`,
                    reason: returnReason,
                    comment: returnDesc.trim(),
                    images: [],
                    videos: [],
                    refundAmount: Number(String(returnFormItem.price).replace(/[^0-9.]/g, "")) * returnFormItem.qty,
                    selectedSize: returnFormItem.selectedSize,
                    qty: returnFormItem.qty,
                    refundMethod: "Original Payment Method"
                  });
                  toast.success("Return request logged with Maison operations team!");
                  setReturnFormItem(null);
                  navigate({ to: "/orders", search: { tab: "returns" } as any });
                }}
                className="flex-1 bg-accent text-white hover:bg-accent/90 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              >
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
