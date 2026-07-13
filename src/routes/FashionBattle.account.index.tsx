import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { FadeUp } from "@/components/motion/Reveal";
import { PRODUCTS } from "@/lib/data";
import { useState, useEffect } from "react";
import { z } from "zod";
import { MapPin, Tag, Heart, ShoppingBag, ListOrdered, User, Save, Trash2, Plus, Check, RotateCcw, Wallet as WalletIcon, Bell as BellIcon, Settings as SettingsIcon, Camera, AlertCircle } from "lucide-react";
import { StatusChip } from "@/components/layout/AdminLayout";
import { toast } from "sonner";

const accountSearchSchema = z.object({
  tab: z.enum(["dashboard", "profile", "addresses", "coupons", "wishlist", "cart", "orders", "returns", "wallet", "notifications", "settings"]).catch("dashboard"),
});

export const Route = createFileRoute("/FashionBattle/account/")({
  validateSearch: (search) => accountSearchSchema.parse(search),
  component: Dashboard,
});

function Dashboard() {
  const { state, updateUser, addAddress, removeAddress, toggleWishlist, createOrder, addToCart, requestReturn, markNotificationsRead } = usePortal();
  const { count, total } = useCartTotal();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const user = state.user;

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "Female",
    dob: user?.dob || "",
    country: user?.country || "",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "Female",
        dob: user.dob || "",
        country: user.country || "",
      });
    }
  }, [user]);

  // Saved Addresses State
  const [newAddress, setNewAddress] = useState("");
  const userAddresses = user ? (state.addresses[user.id] || []) : [];

  // Wishlist Items
  const wishlistIds = user ? (state.wishlist[user.id] || []) : [];
  const wishlistItems = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  // Orders List
  const userOrders = user ? (state.orders[user.id] || []) : [];

  // Checkout Form State
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateUser(user.id, profileForm as any);
    alert("Profile updated successfully!");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAddress.trim()) return;
    addAddress(user.id, newAddress.trim());
    setNewAddress("");
  };

  const handlePlaceOrder = () => {
    if (!user || state.cart.length === 0) return;
    if (!checkoutAddress) {
      toast.error("Please select or add a shipping address first!");
      return;
    }
    const orderTotal = Math.max(0, total - discountAmount);
    createOrder(user.id, {
      items: state.cart,
      total: orderTotal,
      address: checkoutAddress,
      appliedCoupon: appliedCoupon || undefined
    });
    toast.success("Order placed successfully!");
    navigate({ to: "/FashionBattle/account", search: { tab: "orders" } });
  };

  const applyCouponCode = (code: string) => {
    const coupon = state.coupons.find(c => c.code === code.toUpperCase() && c.active);
    if (!coupon) {
      toast.error("Invalid coupon code.");
      return;
    }

    // Check Expiry Date
    if (coupon.expiryDate && coupon.expiryDate !== "unlimited") {
      const todayStr = new Date().toISOString().slice(0, 10);
      if (todayStr > coupon.expiryDate) {
        toast.error("This coupon has expired.");
        return;
      }
    }

    // Check Usage Limit
    if (coupon.usageLimit !== undefined && coupon.usageLimit !== -1) {
      if ((coupon.usedCount || 0) >= coupon.usageLimit) {
        toast.error("Coupon usage limit has been reached.");
        return;
      }
    }

    const discount = Math.round((total * coupon.discount) / 100);
    setDiscountAmount(discount);
    setAppliedCoupon(coupon.code);
    toast.success(`Coupon applied successfully! You got a ₹${discount.toLocaleString()} discount.`);
  };

  const activeTab = tab || "dashboard";

  return (
    <div className="space-y-8">
      {/* Tab Navigation header */}
      <div className="flex border-b border-border-subtle overflow-x-auto gap-6 pb-2 text-xs uppercase tracking-widest font-semibold">
        {[
          { id: "dashboard", label: "Overview", icon: User },
          { id: "profile", label: "Edit Profile", icon: User },
          { id: "addresses", label: "Addresses", icon: MapPin },
          { id: "coupons", label: "Coupons", icon: Tag },
          { id: "wishlist", label: "Wishlist", icon: Heart },
          { id: "cart", label: "Cart", icon: ShoppingBag },
          { id: "orders", label: "My Orders", icon: ListOrdered },
          { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
          { id: "wallet", label: "Wallet Balance", icon: WalletIcon },
          { id: "notifications", label: "Notifications", icon: BellIcon },
          { id: "settings", label: "Settings", icon: SettingsIcon },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => navigate({ to: "/FashionBattle/account", search: { tab: t.id as any } })}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === t.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Dashboard */}
      {activeTab === "dashboard" && (
        <div className="space-y-12 animate-in fade-in duration-300">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Wishlist Items", value: wishlistIds.length, sub: "Saved Products", tabId: "wishlist" as const },
              { label: "Saved Addresses", value: userAddresses.length, sub: "Shipping destinations", tabId: "addresses" as const },
              { label: "Available Coupons", value: state.coupons.length, sub: "Active offers", tabId: "coupons" as const },
              { label: "Cart Total", value: count, sub: total ? `₹${total.toLocaleString()}` : "Empty", tabId: "cart" as const },
            ].map((t, i) => (
              <FadeUp key={t.label} delay={i * 0.05}>
                <button
                  onClick={() => navigate({ to: "/FashionBattle/account", search: { tab: t.tabId } })}
                  className="w-full text-left block border border-border-subtle p-6 hover:border-accent transition-colors"
                >
                  <div className="editorial-label text-muted-foreground">{t.label}</div>
                  <div className="font-serif text-5xl mt-3">{t.value}</div>
                  <div className="editorial-label text-muted-foreground mt-2">{t.sub}</div>
                </button>
              </FadeUp>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <FadeUp>
              <div className="border border-border-subtle p-8 bg-surface-2 rounded-sm">
                <p className="editorial-eyebrow text-accent">Edit Profile Quick Link</p>
                <h2 className="mt-3 font-serif text-3xl">Keep your details fresh.</h2>
                <p className="mt-3 text-sm text-muted-foreground">Keep your email, phone, state, and other settings up to date for smooth deliveries.</p>
                <button
                  onClick={() => navigate({ to: "/FashionBattle/account", search: { tab: "profile" } })}
                  className="mt-6 inline-block bg-foreground text-background px-6 py-3 editorial-label hover:bg-accent hover:text-white transition-colors"
                >
                  Edit Profile Now →
                </button>
              </div>
            </FadeUp>
            <FadeUp delay={0.05}>
              <div className="border border-border-subtle p-8 bg-surface rounded-sm">
                <p className="editorial-eyebrow text-accent">Recent Notifications</p>
                <ul className="mt-4 divide-y divide-border-subtle">
                  {state.notifications.slice(0, 3).map(n => (
                    <li key={n.id} className="py-3">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.body} · {n.time}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      )}

      {/* Edit Profile View */}
      {activeTab === "profile" && (
        <div className="max-w-xl border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300">
          <h2 className="font-serif text-3xl mb-6">Edit Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="editorial-label text-muted-foreground text-[10px]">First Name</span>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className="w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm"
                  required
                />
              </label>
              <label className="block">
                <span className="editorial-label text-muted-foreground text-[10px]">Last Name</span>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  className="w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm"
                  required
                />
              </label>
            </div>
            <label className="block">
              <span className="editorial-label text-muted-foreground text-[10px]">Email Address</span>
              <input
                type="email"
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm"
                required
              />
            </label>
            <label className="block">
              <span className="editorial-label text-muted-foreground text-[10px]">Phone Number</span>
              <input
                type="text"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="editorial-label text-muted-foreground text-[10px]">Gender</span>
                <select
                  value={profileForm.gender}
                  onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}
                  className="w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm"
                >
                  <option className="bg-background">Female</option>
                  <option className="bg-background">Male</option>
                  <option className="bg-background">Other</option>
                </select>
              </label>
              <label className="block">
                <span className="editorial-label text-muted-foreground text-[10px]">Date of Birth</span>
                <input
                  type="date"
                  value={profileForm.dob}
                  onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })}
                  className="w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm"
                />
              </label>
            </div>
            <label className="block">
              <span className="editorial-label text-muted-foreground text-[10px]">State</span>
              <input
                type="text"
                value={profileForm.country}
                onChange={e => setProfileForm({ ...profileForm, country: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm"
              />
            </label>
            <button
              type="submit"
              className="mt-6 flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3.5 w-full editorial-label hover:bg-accent hover:text-white transition-colors"
            >
              <Save className="w-4 h-4" /> Save Profile Details
            </button>
          </form>
        </div>
      )}

      {/* Saved Addresses View */}
      {activeTab === "addresses" && (
        <div className="border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300">
          <h2 className="font-serif text-3xl mb-6">Saved Shipping Addresses</h2>
          
          <div className="space-y-4 mb-8">
            {userAddresses.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No addresses saved yet.</p>
            ) : (
              userAddresses.map((addr, idx) => (
                <div key={idx} className="flex items-start justify-between p-4 border border-border-subtle bg-background">
                  <div className="flex gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{addr}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (user) removeAddress(user.id, idx);
                    }}
                    className="p-1 hover:text-rose-500 text-muted-foreground transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddAddress} className="border-t border-border-subtle pt-6 space-y-4">
            <h3 className="text-sm uppercase tracking-wider font-semibold">Add New Address</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                placeholder="Enter full shipping address (street, city, state, pincode)..."
                className="flex-1 bg-transparent border-b border-foreground/30 py-2.5 outline-none focus:border-accent text-sm"
                required
              />
              <button
                type="submit"
                className="bg-foreground text-background px-6 py-2.5 flex items-center gap-1.5 hover:bg-accent hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons View */}
      {activeTab === "coupons" && (
        <div className="border border-border-subtle p-8 bg-surface animate-in fade-in duration-300">
          <h2 className="font-serif text-3xl mb-6">Active Promotional Coupons</h2>
          <p className="text-sm text-muted-foreground mb-6">Apply these coupon codes during checkout in your Cart tab to receive discounts.</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {state.coupons.map((c) => (
              <div key={c.code} className="border border-dashed border-accent/40 bg-accent/5 p-5 flex flex-col justify-between rounded-sm">
                <div>
                  <div className="font-mono text-xl font-bold tracking-wider text-accent">{c.code}</div>
                  <div className="text-sm mt-2 font-medium">{c.discount}% discount on all fashion pieces</div>
                </div>
                <div className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Status: <span className="text-emerald-500 font-semibold">{c.active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wishlist View */}
      {activeTab === "wishlist" && (
        <div className="border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300">
          <h2 className="font-serif text-3xl mb-6">My Wishlist</h2>
          
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground italic">Your wishlist is empty.</p>
              <Link to="/shop/categories" className="mt-4 inline-block bg-foreground text-background px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-accent transition-colors">
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {wishlistItems.map((p) => (
                <div key={p.id} className="group border border-border-subtle bg-background p-3 flex flex-col justify-between">
                  <div>
                    <div className="aspect-[3/4] overflow-hidden bg-surface relative">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" />
                    </div>
                    <div className="mt-3">
                      <div className="editorial-label text-muted-foreground text-[10px]">{p.house}</div>
                      <div className="font-serif text-base mt-0.5 line-clamp-1">{p.name}</div>
                      <div className="font-serif text-sm mt-1">{p.price}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        addToCart({ productId: p.id, name: p.name, house: p.house, price: p.price, image: p.image });
                        toast.success(`${p.name} added to cart!`);
                      }}
                      className="flex-1 bg-foreground text-background py-2 text-[10px] uppercase font-semibold hover:bg-accent hover:text-white transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        if (user) toggleWishlist(user.id, p.id);
                      }}
                      className="p-2 border border-border-subtle hover:text-rose-500 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cart & Checkout View */}
      {activeTab === "cart" && (
        <div className="border border-border-subtle p-8 bg-surface animate-in fade-in duration-300">
          <h2 className="font-serif text-3xl mb-6">Shopping Cart</h2>
          
          {state.cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground italic">Your cart is empty.</p>
              <Link to="/shop/categories" className="mt-4 inline-block bg-foreground text-background px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-accent transition-colors">
                Go Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-8 space-y-4">
                {state.cart.map((item) => (
                  <div key={item.productId} className="flex gap-4 p-3 border border-border-subtle bg-background">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-surface-2 shrink-0" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">{item.house}</div>
                        <div className="font-serif text-sm font-semibold">{item.name}</div>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-2">
                        <span className="font-mono text-muted-foreground">Qty: {item.qty}</span>
                        <span className="font-serif font-bold">{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Checkout Panel */}
              <div className="lg:col-span-4 border border-border-subtle p-5 bg-background space-y-5">
                <h3 className="text-xs uppercase tracking-widest font-bold border-b border-border-subtle pb-2">Checkout Details</h3>
                
                {/* Applied Coupons */}
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Promo Coupon</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={appliedCoupon}
                      onChange={e => setAppliedCoupon(e.target.value)}
                      placeholder="e.g. FESTIVE20"
                      className="flex-1 bg-surface border border-border-subtle px-2.5 py-1 text-xs outline-none focus:border-accent font-mono uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => applyCouponCode(appliedCoupon)}
                      className="bg-foreground text-background px-3 py-1 text-xs font-semibold hover:bg-accent hover:text-white transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Shipping Addresses selector */}
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Shipping Address</label>
                  {userAddresses.length === 0 ? (
                    <div className="text-[10px] text-rose-500 font-semibold">
                      Please add a shipping address in the "Addresses" tab first.
                    </div>
                  ) : (
                    <select
                      value={checkoutAddress}
                      onChange={e => setCheckoutAddress(e.target.value)}
                      className="w-full bg-surface border border-border-subtle p-2 text-xs outline-none"
                    >
                      <option value="">Select Shipping Address</option>
                      {userAddresses.map((addr, idx) => (
                        <option key={idx} value={addr}>{addr}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Subtotals */}
                <div className="border-t border-border-subtle pt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-serif">₹{total.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-accent font-medium">
                      <span>Discount</span>
                      <span className="font-serif">-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold border-t border-border-subtle pt-2">
                    <span>Order Total</span>
                    <span className="font-serif">₹{Math.max(0, total - discountAmount).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-widest font-bold hover:bg-accent hover:text-white transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Orders View */}
      {activeTab === "orders" && (
        <div className="border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300">
          <h2 className="font-serif text-3xl mb-6">My Order History</h2>
          
          {userOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => (
                <div key={order.id} className="border border-border-subtle bg-background p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-accent">{order.id}</span>
                      <span className="text-muted-foreground ml-3">Placed on: {order.date}</span>
                    </div>
                    <div>
                      <span className="editorial-label text-muted-foreground">Status: </span>
                      <span className={`font-semibold uppercase ${
                        order.status === "Delivered" ? "text-emerald-500" : "text-amber-500"
                      }`}>{order.status}</span>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex gap-4 text-xs items-center">
                        <img src={item.image} alt={item.name} className="w-10 h-12 object-cover bg-surface-2" />
                        <div>
                          <div className="font-serif font-bold">{item.name}</div>
                          <div className="text-muted-foreground">{item.house} (Qty: {item.qty})</div>
                        </div>
                        <div className="ml-auto font-serif">{item.price}</div>
                        {order.status === "Delivered" && (
                          <button
                            onClick={() => {
                              const reason = prompt("Enter return reason:", "Size issue");
                              const comment = prompt("Enter comments:", "Cape was too large.");
                              if (reason && user) {
                                requestReturn({
                                  orderId: order.id,
                                  productId: item.productId,
                                  productName: item.name,
                                  customerId: user.id,
                                  customerName: `${user.firstName} ${user.lastName}`,
                                  reason,
                                  comment: comment || "",
                                  images: [item.image],
                                  videos: [],
                                  refundAmount: order.total
                                });
                                alert("Return request submitted!");
                              }
                            }}
                            className="ml-4 border border-accent hover:bg-accent hover:text-white px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-accent"
                          >
                            Return
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Delivery address & totals */}
                  <div className="flex flex-wrap items-start justify-between border-t border-border-subtle pt-3 gap-4 text-xs">
                    <div>
                      <div className="editorial-label text-muted-foreground mb-1">Shipping Address</div>
                      <div className="text-muted-foreground">{order.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground">Total Paid</div>
                      <div className="font-serif text-base font-bold mt-1">₹{order.total.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Returns & Refunds View */}
      {activeTab === "returns" && (
        <div className="border border-border-subtle p-8 bg-surface animate-in fade-in duration-300 space-y-6">
          <h2 className="font-serif text-3xl">Returns & Refund Progress</h2>
          <p className="text-xs text-muted-foreground">Monitor return requests and automated Razorpay payout logs.</p>
          <div className="space-y-4">
            {state.returns.filter(r => r.customerId === user?.id).length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No return requests found.</p>
            ) : (
              state.returns.filter(r => r.customerId === user?.id).map(r => (
                <div key={r.id} className="border border-border-subtle p-5 bg-surface-2 space-y-3">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                    <span className="font-mono text-xs font-bold">{r.id} (Order: {r.orderId})</span>
                    <StatusChip status={r.status} tone={r.status === "Approved" ? "success" : r.status === "Pending" ? "warn" : "neutral"} />
                  </div>
                  <div className="text-xs space-y-1">
                    <div>Item: <span className="font-semibold">{r.productName}</span></div>
                    <div>Reason: <span className="text-muted-foreground">{r.reason}</span></div>
                    <div>Refund Amount: <span className="font-serif font-bold text-accent">₹{r.refundAmount.toLocaleString()}</span></div>
                    {r.refundTransactionId && (
                      <div className="text-emerald-400 font-mono mt-2 bg-emerald-500/5 p-2 border border-emerald-500/10 rounded">
                        Razorpay Payout ID: {r.refundTransactionId}<br/>
                        Refund Date: {r.refundDate}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Wallet View */}
      {activeTab === "wallet" && (
        <div className="border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300 space-y-6">
          <h2 className="font-serif text-3xl">My Luxury Wallet</h2>
          <div className="bg-gradient-to-br from-accent/15 via-surface-3 to-zinc-950/20 border border-accent/20 p-8 rounded-xl max-w-sm space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Available Credits</div>
            <div className="font-serif text-4xl font-bold text-accent">₹{(state.wallets[user?.id || ""] || 0).toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground">Use wallet credits to place instant shopping orders.</p>
          </div>
        </div>
      )}

      {/* Notifications View */}
      {activeTab === "notifications" && (
        <div className="border border-border-subtle p-8 bg-surface animate-in fade-in duration-300 space-y-6">
          <div className="flex justify-between items-center border-b border-border-subtle pb-4">
            <h2 className="font-serif text-3xl">Alerts & Notifications</h2>
            <button
              onClick={() => markNotificationsRead()}
              className="text-xs uppercase tracking-widest font-bold text-accent hover:underline"
            >
              Mark all read
            </button>
          </div>
          <div className="space-y-4">
            {state.notifications.map(n => (
              <div key={n.id} className={`p-4 border rounded flex gap-4 ${n.unread ? "bg-accent/5 border-accent/20" : "bg-surface-2 border-border-subtle"}`}>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{n.body}</div>
                  <div className="text-[9px] text-muted-foreground/60 mt-2 font-mono">{n.time}</div>
                </div>
                {n.unread && <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings View */}
      {activeTab === "settings" && (
        <div className="border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300 space-y-6">
          <h2 className="font-serif text-3xl">Account Settings</h2>
          <div className="space-y-4 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-accent" />
              <span>Subscribe to seasonal Maison catalogs & lookbooks</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-accent" />
              <span>Enable WhatsApp delivery and shipping logs notifications</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
