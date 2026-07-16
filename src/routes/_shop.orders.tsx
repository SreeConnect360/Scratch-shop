import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePortal } from "@/lib/portal-state";
import { useState, useEffect } from "react";
import { z } from "zod";
import { 
  X, Check, AlertTriangle, Star, ShoppingBag, ListOrdered, 
  RotateCcw, ArrowLeft, ArrowUpRight, Search, FileText 
} from "lucide-react";
import { StatusChip } from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { useShopNotification } from "./_shop";

const ordersSearchSchema = z.object({
  tab: z.enum(["history", "returns"]).catch("history"),
});

export const Route = createFileRoute("/_shop/orders")({
  validateSearch: (search) => ordersSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "My Maison Orders Tracker — ReeVibes" }] }),
  component: ShopOrdersPage,
});

function ShopOrdersPage() {
  const { state, requestReturn, addReview, addToShopCart } = usePortal();
  const { triggerPopup } = useShopNotification();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const user = state.user;

  // Active sub-tab
  const activeSubTab = tab || "history";

  // Review Form States
  const [reviewFormItem, setReviewFormItem] = useState<{ productId: string; orderId: string } | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // Return Wizard States
  const [returnFormItem, setReturnFormItem] = useState<{ orderId: string; productId: string; productName: string; price: string; selectedSize: string; qty: number } | null>(null);
  const [returnReason, setReturnReason] = useState("Product arrived damaged");
  const [returnDesc, setReturnDesc] = useState("");

  const userOrders = user ? (state.orders?.[user.id] || []) : [];

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
        <div className="liquid-glass p-8 max-w-md w-full border border-white/20 rounded-3xl">
          <p className="editorial-eyebrow text-accent">Shop Members Only</p>
          <h1 className="mt-4 font-serif text-3xl">Sign in to continue.</h1>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            Your orders and transaction history are reserved for registered members of the maison.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/login" className="bg-foreground text-background px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="border border-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-foreground hover:text-background transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 md:py-12 space-y-8 md:space-y-10 animate-in fade-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/10 pb-6">
        <div>
          <p className="editorial-eyebrow text-accent">Maison Shop Membership</p>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl md:text-5xl">Orders & Returns</h1>
        </div>
        <div className="flex gap-4">
          <Link to="/account" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Account
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <Link to="/" className="text-xs uppercase tracking-widest font-bold text-accent hover:underline">
            Return to Curation
          </Link>
        </div>
      </div>

      {/* Internal Tabs Switcher */}
      <div className="flex border-b border-white/10 max-w-md">
        <button
          onClick={() => navigate({ to: "/orders", search: { tab: "history" } })}
          className={`flex-1 pb-4 text-xs uppercase tracking-wider font-bold border-b-2 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === "history"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListOrdered className="w-4 h-4" /> All Orders
        </button>
        <button
          onClick={() => navigate({ to: "/orders", search: { tab: "returns" } })}
          className={`flex-1 pb-4 text-xs uppercase tracking-wider font-bold border-b-2 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === "returns"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Returns & Refunds
        </button>
      </div>

      {/* Tab: All Orders */}
      {activeSubTab === "history" && (
        <div className="liquid-glass border border-white/15 p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h2 className="font-serif text-xl sm:text-2xl">Maison Orders Tracker</h2>
            <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-muted-foreground font-mono">
              {userOrders.length} orders total
            </span>
          </div>

          {userOrders.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-sm text-muted-foreground italic">No orders found in your curation profile.</p>
              <Link to="/" className="inline-block bg-accent hover:bg-accent-foreground text-white border border-accent/25 px-6 py-2.5 text-xs uppercase tracking-widest font-bold rounded-full transition-all">
                Shop Curation
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {userOrders.map(order => {
                const groupedItems: any[] = [];
                (order.items || []).forEach((item: any) => {
                  const existing = groupedItems.find(x => x.productId === item.productId);
                  if (existing) {
                    existing.variants.push({
                      size: item.selectedSize || "M",
                      qty: item.qty,
                      price: item.price
                    });
                  } else {
                    groupedItems.push({
                      ...item,
                      variants: [{
                        size: item.selectedSize || "M",
                        qty: item.qty,
                        price: item.price
                      }]
                    });
                  }
                });

                return (
                  <div key={order.id} className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-6 shadow-md transition-all hover:border-white/20">
                    {/* Header Info */}
                    <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-accent">{order.id}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{order.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusChip status={order.status} tone={order.status === "Delivered" ? "success" : "warn"} />
                      </div>
                    </div>

                    {/* Product Items List */}
                    <div className="space-y-4">
                      {groupedItems.map(groupedItem => (
                        <div key={groupedItem.productId} className="flex flex-col md:flex-row justify-between items-start gap-4 text-xs border-b border-white/[0.03] pb-4 last:border-0 last:pb-0 w-full">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <Link to="/product/$productId" params={{ productId: groupedItem.productId }} className="block shrink-0">
                              <img src={groupedItem.image} className="w-16 h-20 object-cover rounded-xl border border-white/10 hover:opacity-85 transition-opacity" />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link
                                to="/product/$productId"
                                params={{ productId: groupedItem.productId }}
                                className="font-semibold text-white hover:text-accent transition-colors block text-base font-serif truncate"
                              >
                                {groupedItem.name}
                              </Link>
                              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{groupedItem.house}</div>
                              
                              {/* Variant Sizing List */}
                              <div className="mt-3 space-y-2 max-w-xl">
                                {groupedItem.variants.map((v: any, vIdx: number) => {
                                  const hasBeenReturned = state.returns?.some(
                                    r => r.orderId === order.id && r.productId === groupedItem.productId && r.selectedSize === v.size
                                  );
                                  return (
                                    <div key={vIdx} className="flex flex-wrap items-center justify-between gap-2 bg-white/5 p-2 rounded-xl border border-white/5 w-full">
                                      <div className="flex items-center gap-3">
                                        <span className="text-[9px] uppercase tracking-widest font-bold bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/10">
                                          Size: {v.size}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-medium">
                                          Qty: {v.qty}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center gap-3 ml-auto">
                                        <span className="font-semibold font-mono text-xs text-foreground">{v.price}</span>
                                        {(() => {
                                          if (hasBeenReturned) {
                                            return (
                                              <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                                                Returned
                                              </span>
                                            );
                                          }
                                          
                                          if (order.status === "Delivered") {
                                            const delDate = order.deliveryDate || order.date;
                                            const deliveredTime = new Date(delDate).getTime();
                                            const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
                                            const isWithinSevenDays = (Date.now() - deliveredTime) < sevenDaysInMs;
                                            
                                            if (isWithinSevenDays) {
                                              return (
                                                <div className="flex gap-1.5">
                                                  <button
                                                    onClick={() => {
                                                      setReviewFormItem({ productId: groupedItem.productId, orderId: order.id });
                                                      setReviewText("");
                                                      setReviewRating(5);
                                                    }}
                                                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-full transition-all cursor-pointer"
                                                  >
                                                    Review
                                                  </button>
                                                  <button
                                                    onClick={() => {
                                                      setReturnFormItem({
                                                        orderId: order.id,
                                                        productId: groupedItem.productId,
                                                        productName: groupedItem.name,
                                                        price: v.price,
                                                        selectedSize: v.size,
                                                        qty: v.qty
                                                      });
                                                      setReturnReason("Product arrived damaged");
                                                      setReturnDesc("");
                                                    }}
                                                    className="bg-accent/20 hover:bg-accent hover:text-white border border-accent/20 text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-accent transition-colors cursor-pointer"
                                                  >
                                                    Return
                                                  </button>
                                                </div>
                                              );
                                            }
                                          }
                                          return null;
                                        })()}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipment Roadmap & Logs */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-4 text-xs text-muted-foreground leading-relaxed">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5 text-[11px]">
                        <div>
                          <span className="font-semibold text-white uppercase tracking-wider text-[9px] block">Courier Partner</span>
                          <span className="text-accent font-medium">{order.courierPartner || "Delhivery Express"}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-white uppercase tracking-wider text-[9px] block">Tracking ID</span>
                          <span className="font-mono text-white">{order.trackingNumber || `TRK-${order.id.replace("ORD-", "")}`}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-white uppercase tracking-wider text-[9px] block text-right">Est. Delivery Date</span>
                          <span className="text-white font-medium">{order.estimatedDeliveryDate || "July 24, 2026"}</span>
                        </div>
                      </div>

                      {/* Transit Timeline */}
                      <div className="py-1">
                        <span className="font-bold text-white uppercase tracking-widest text-[8px] block mb-3">Live Curation Transit Roadmap</span>
                        {(() => {
                          const steps = ["Order Placed", "Preparing Order", "Shipped", "In Transit", "Delivered"];
                          const status = order.status || "Order Placed";
                          
                          let activeIdx = 0;
                          if (status.includes("Confirmed") || status.includes("Accept") || status.includes("Prepare") || status.includes("Pack")) {
                            activeIdx = 1;
                          } else if (status.includes("Ship") || status.includes("Ready")) {
                            activeIdx = 2;
                          } else if (status.includes("Transit") || status.includes("Delivery") || status.includes("Today")) {
                            activeIdx = 3;
                          } else if (status.includes("Deliver")) {
                            activeIdx = 4;
                          }
                          
                          return (
                            <>
                              <div className="relative flex items-center justify-between w-full mt-4 pb-2">
                                {/* Track bar */}
                                <div className="absolute left-0 right-0 top-1.5 h-0.5 bg-white/10 -z-10" />
                                <div
                                  className="absolute left-0 top-1.5 h-0.5 bg-accent transition-all duration-500 -z-10"
                                  style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
                                />
                                
                                {steps.map((st, sIdx) => {
                                  const isCompleted = sIdx <= activeIdx;
                                  const isActive = sIdx === activeIdx;
                                  return (
                                    <div key={sIdx} className="flex flex-col items-center">
                                      <div
                                        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                                          isCompleted
                                            ? "bg-accent border-accent shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                                            : "bg-zinc-950 border-white/20"
                                        }`}
                                      >
                                        {isCompleted && (
                                          <div className="w-1 h-1 rounded-full bg-white" />
                                        )}
                                      </div>
                                      <span
                                        className={`text-[8px] uppercase tracking-wider mt-2.5 font-bold transition-colors ${
                                          isActive
                                            ? "text-accent"
                                            : isCompleted
                                            ? "text-white"
                                            : "text-muted-foreground"
                                        }`}
                                      >
                                        {st}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              {order.scansJson && (() => {
                                try {
                                  const scans = JSON.parse(order.scansJson);
                                  if (Array.isArray(scans) && scans.length > 0) {
                                    return (
                                      <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                        <span className="font-bold text-white uppercase tracking-widest text-[8px] block">Live Tracking History</span>
                                        <div className="space-y-2 pl-2 border-l border-white/10 max-h-36 overflow-y-auto">
                                          {scans.map((scan: any, idx: number) => (
                                            <div key={idx} className="relative pl-3 text-[10px] leading-relaxed">
                                              <div className="absolute left-[-4px] top-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
                                              <div className="font-semibold text-white">{scan.activity}</div>
                                              <div className="text-[9px] text-muted-foreground">{scan.date} · {scan.location}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  }
                                } catch (e) {
                                  console.error("Failed to parse user scansJson", e);
                                }
                                return null;
                              })()}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Footer / Total info */}
                    <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs">
                      <span className="text-muted-foreground font-semibold">Total Paid:</span>
                      <span className="font-bold text-accent text-sm">₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Returns & Refund status section */}
      {activeSubTab === "returns" && (
        <div className="liquid-glass border border-white/15 p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h2 className="font-serif text-xl sm:text-2xl">Returns Tracker & Refund Status</h2>
          </div>

          <div className="space-y-8">
            {state.returns.filter(r => r.customerId === user.id).length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-8">No returns logged or in progress.</p>
            ) : (
              state.returns.filter(r => r.customerId === user.id).map(r => {
                const RETURN_TIMELINE_STEPS = [
                  "Return Requested",
                  "Under Review",
                  "Return Approved",
                  "Pickup Scheduled",
                  "Item Received",
                  "Refund Processed",
                  "Refund Completed"
                ];
                
                const isRejected = r.status === "Rejected";
                const currentStepIndex = RETURN_TIMELINE_STEPS.indexOf(r.status);
                
                return (
                  <div key={r.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6 shadow-md hover:border-white/20 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-accent">{r.id}</span>
                        <span className="text-[10px] text-muted-foreground ml-3 font-mono">Order ID: {r.orderId}</span>
                      </div>
                      <StatusChip
                        status={r.status}
                        tone={isRejected ? "danger" : r.status === "Refund Completed" ? "success" : "warn"}
                      />
                    </div>

                    <div className="text-xs space-y-1 text-muted-foreground leading-relaxed">
                      <div><span className="font-bold text-foreground">Item:</span> {r.productName} ({r.selectedSize || "M"})</div>
                      <div><span className="font-bold text-foreground">Refund Method:</span> {r.refundMethod || "Original Payment Method"}</div>
                      <div><span className="font-bold text-foreground">Reason:</span> {r.reason}</div>
                      {r.comment && <div><span className="font-bold text-foreground">Comments:</span> {r.comment}</div>}
                    </div>

                    {/* Timeline */}
                    {!isRejected ? (
                      <div className="space-y-4">
                        <h4 className="text-[10px] uppercase tracking-widest text-accent font-bold">Return Status Timeline</h4>
                        <div className="relative pt-2 pb-6">
                          <div className="absolute top-4 left-1 right-1 h-0.5 bg-white/10 z-0 rounded-full" />
                          <div
                            className="absolute top-4 left-1 h-0.5 bg-accent transition-all duration-500 z-0 rounded-full"
                            style={{
                              width: `${Math.max(0, (currentStepIndex / (RETURN_TIMELINE_STEPS.length - 1)) * 100)}%`
                            }}
                          />
                          <div className="relative z-10 flex justify-between gap-1">
                            {RETURN_TIMELINE_STEPS.map((step, idx) => {
                              const isCompleted = idx <= currentStepIndex;
                              const isCurrent = idx === currentStepIndex;
                              return (
                                <div key={step} className="flex flex-col items-center flex-1 max-w-[80px]">
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                      isCurrent
                                        ? "border-accent bg-accent text-white scale-110 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                        : isCompleted
                                          ? "border-accent bg-accent text-white"
                                          : "border-white/20 bg-zinc-950 text-muted-foreground"
                                    }`}
                                  >
                                    {isCompleted && !isCurrent ? (
                                      <Check className="w-2.5 h-2.5" />
                                    ) : (
                                      <span className="text-[7px] font-mono">{idx + 1}</span>
                                    )}
                                  </div>
                                  <span
                                    className={`text-[7px] text-center mt-2 font-semibold uppercase tracking-wider block transition-colors leading-tight ${
                                      isCurrent ? "text-accent" : isCompleted ? "text-white" : "text-muted-foreground"
                                    }`}
                                  >
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-xs text-rose-300">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold uppercase tracking-wider">Return Request Rejected</div>
                          <p className="mt-1 text-rose-400 font-medium">Rejection Reason: {r.rejectionReason || "Insufficient evidence"}</p>
                        </div>
                      </div>
                    )}

                    {/* Statement details */}
                    <div className="pt-4 border-t border-white/5 text-xs space-y-3">
                      <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Detailed Refund Statement</h4>
                      <div className="grid grid-cols-2 gap-4 border border-white/5 bg-white/[0.02] p-4 rounded-2xl">
                        <div className="space-y-2">
                          <div>
                            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Refund Amount</span>
                            <span className="font-bold text-white text-sm">₹{r.refundAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Expected Settlement Date</span>
                            <span className="font-semibold text-white">
                              {r.status === "Refund Completed" ? "Completed" : r.expectedCreditDate || "Expected 3-5 days after approval"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Ref Transaction ID</span>
                            <span className="font-mono text-white text-[10px] break-all">{r.refundTransactionId || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Settlement Date</span>
                            <span className="font-semibold text-white">{r.refundDate || "Pending Payout"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Write Review Dialog Modal */}
      {reviewFormItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass max-w-md w-full p-6 md:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-serif text-xl">Write verified Review</h3>
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
                  className="text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-6 h-6 ${stars <= reviewRating ? "fill-current" : "text-zinc-600"}`} />
                </button>
              ))}
            </div>
            <textarea
              required
              placeholder="Share your experience styling this piece..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs outline-none focus:border-accent h-28 text-white placeholder:text-muted-foreground/50 transition-colors"
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
                className="flex-1 bg-accent text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent/90 transition-transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Submit Review
              </button>
              <button
                onClick={() => setReviewFormItem(null)}
                className="bg-white/10 text-foreground px-5 py-2.5 rounded-full text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Return Request Form Modal */}
      {returnFormItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Maison Returns Desk</span>
                <h3 className="font-serif text-xl mt-1">Return: {returnFormItem.productName}</h3>
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
                  className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl text-xs outline-none text-white focus:border-accent"
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
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs outline-none focus:border-accent h-24 text-white resize-none"
                  value={returnDesc}
                  onChange={e => setReturnDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setReturnFormItem(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/15 py-2.5 rounded-full text-xs text-foreground font-semibold transition-colors uppercase tracking-wider"
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
                className="flex-1 bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95"
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
