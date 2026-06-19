import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { FadeUp } from "@/components/motion/Reveal";
import { PRODUCTS } from "@/lib/data";
import { useState, useEffect } from "react";
import { z } from "zod";
import { MapPin, Tag, Heart, ShoppingBag, ListOrdered, User, Save, Trash2, Plus, Check, RotateCcw, Wallet as WalletIcon, Bell as BellIcon, Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import { StatusChip } from "@/components/layout/AdminLayout";

const accountSearchSchema = z.object({
  tab: z.enum(["dashboard", "profile", "addresses", "coupons", "wishlist", "cart", "orders", "returns", "wallet", "notifications", "settings"]).catch("dashboard"),
});

export const Route = createFileRoute("/shop/account")({
  validateSearch: (search) => accountSearchSchema.parse(search),
  component: ShopDashboard,
});

function ShopDashboard() {
  const { state, updateUser, addAddress, removeAddress, toggleShopWishlist, createOrder, addToShopCart, requestReturn, markNotificationsRead } = usePortal();
  const { shopCount, shopTotal } = useCartTotal();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const user = state.user;

  // Calculate profile completeness percentage
  const profileCompletionPercentage = (() => {
    if (!user) return 0;
    let score = 0;
    if (user.firstName) score += 15;
    if (user.lastName) score += 15;
    if (user.email) score += 15;
    if (user.phone) score += 15;
    if (user.dob) score += 15;
    if (user.gender) score += 15;
    if (user.country) score += 10;
    return score;
  })();

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
  const wishlistIds = user ? (state.shopWishlist[user.id] || []) : [];
  const wishlistItems = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  // Orders List
  const userOrders = user ? (state.orders[user.id] || []) : [];

  // Checkout Form State
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
        <div className="liquid-glass p-8 max-w-md w-full border border-white/20 rounded-3xl">
          <p className="editorial-eyebrow text-accent">Shop Members Only</p>
          <h1 className="mt-4 font-serif text-3xl">Sign in to continue.</h1>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">Your shopping account is reserved for registered members of the maison.</p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/shop/login" className="bg-foreground text-background px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-colors">Sign In</Link>
            <Link to="/shop/register" className="border border-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-foreground hover:text-background transition-colors">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, profileForm as any);
    alert("Profile updated successfully!");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    addAddress(user.id, newAddress.trim());
    setNewAddress("");
  };

  const handlePlaceOrder = () => {
    if (state.shopCart.length === 0) return;
    if (!checkoutAddress) {
      alert("Please select or add a shipping address first!");
      return;
    }
    const orderTotal = Math.max(0, shopTotal - discountAmount);
    createOrder(user.id, {
      items: state.shopCart,
      total: orderTotal,
      address: checkoutAddress
    });
    alert("Order placed successfully!");
    navigate({ to: "/shop/account", search: { tab: "orders" } });
  };

  const applyCouponCode = (code: string) => {
    const coupon = state.coupons.find(c => c.code === code.toUpperCase() && c.active);
    if (coupon) {
      const discount = Math.round((shopTotal * coupon.discount) / 100);
      setDiscountAmount(discount);
      alert(`Coupon applied successfully! You got a ₹${discount.toLocaleString()} discount.`);
    } else {
      alert("Invalid or expired coupon code.");
    }
  };

  const activeTab = tab || "dashboard";

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 space-y-8">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <p className="editorial-eyebrow text-accent">Maison Shop Membership</p>
          <h1 className="mt-2 font-serif text-3xl md:text-5xl">Welcome, {user.firstName}.</h1>
        </div>
        <Link to="/shop" className="text-xs uppercase tracking-widest font-bold text-accent hover:underline">
          Return to Curation
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 liquid-glass p-6 border border-white/15 rounded-3xl space-y-4">
          <h3 className="font-serif text-lg border-b border-white/10 pb-3">My Shop Account</h3>
          {[
            { id: "dashboard", label: "Overview", icon: User },
            { id: "profile", label: "Edit Profile", icon: User },
            { id: "addresses", label: "Addresses", icon: MapPin },
            { id: "coupons", label: "Coupons", icon: Tag },
            { id: "wishlist", label: "Wishlist", icon: Heart },
            { id: "cart", label: "Cart Status", icon: ShoppingBag },
            { id: "orders", label: "My Orders", icon: ListOrdered },
            { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
            { id: "wallet", label: "Wallet Balance", icon: WalletIcon },
            { id: "notifications", label: "Notifications", icon: BellIcon },
            { id: "settings", label: "Settings", icon: SettingsIcon },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => navigate({ to: "/shop/account", search: { tab: t.id as any } })}
              className={`w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 ${
                activeTab === t.id 
                  ? "bg-accent text-white shadow-md scale-105" 
                  : "hover:bg-white/10 text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <t.icon className="w-4 h-4" />
                {t.label}
              </span>
              {activeTab === t.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </aside>

        {/* Content Pane */}
        <main className="lg:col-span-9 space-y-6">
          {/* Tab: Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Profile Completeness Ring Card */}
              <div className="liquid-glass border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="font-serif text-xl md:text-2xl">Curation Completeness</h3>
                  <p className="text-xs text-muted-foreground max-w-md">
                    Complete your personal styling information to receive curated collections and customized seasonal sizing recommendation updates.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    {/* SVG Progress Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="34" className="stroke-white/10 fill-none" strokeWidth="6" />
                      <circle cx="40" cy="40" r="34" className="stroke-accent fill-none transition-all duration-1000" strokeWidth="6" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * profileCompletionPercentage) / 100} />
                    </svg>
                    <span className="absolute text-sm font-bold">{profileCompletionPercentage}%</span>
                  </div>
                  <button onClick={() => navigate({ to: "/shop/account", search: { tab: "profile" } })} className="text-xs uppercase bg-accent text-white px-5 py-2.5 rounded-full font-bold tracking-wider hover:bg-accent/90 transition-all">
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Wishlist Curation", value: wishlistIds.length, sub: "Saved items", tabId: "wishlist" as const },
                  { label: "Delivery Points", value: userAddresses.length, sub: "Shipping destinations", tabId: "addresses" as const },
                  { label: "Available Coupons", value: state.coupons.length, sub: "Active promos", tabId: "coupons" as const },
                  { label: "Luxury Credits", value: `₹${(state.wallets[user.id] ?? 0).toLocaleString()}`, sub: "Wallet balance", tabId: "wallet" as const },
                ].map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => navigate({ to: "/shop/account", search: { tab: t.tabId } })}
                    className="w-full text-left liquid-glass p-6 border border-white/10 hover:border-accent hover:scale-[1.02] transition-all rounded-3xl"
                  >
                    <div className="editorial-label text-muted-foreground text-[10px] uppercase tracking-widest">{t.label}</div>
                    <div className="font-serif text-4xl mt-3 text-foreground">{t.value}</div>
                    <div className="editorial-label text-muted-foreground text-[10px] uppercase mt-2">{t.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Profile */}
          {activeTab === "profile" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Edit Curation Profile</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">First Name</span>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Last Name</span>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                      required
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Email Address</span>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Phone Number</span>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Gender</span>
                    <select
                      value={profileForm.gender}
                      onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                    >
                      <option className="bg-zinc-950" value="Female">Female</option>
                      <option className="bg-zinc-950" value="Male">Male</option>
                      <option className="bg-zinc-950" value="Other">Other</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Date of Birth</span>
                    <input
                      type="date"
                      value={profileForm.dob}
                      onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Country</span>
                  <input
                    type="text"
                    value={profileForm.country}
                    onChange={e => setProfileForm({ ...profileForm, country: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 py-3 w-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-4"
                >
                  Save Profile Details
                </button>
              </form>
            </div>
          )}

          {/* Tab: Addresses */}
          {activeTab === "addresses" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Multiple Delivery Destinations</h2>
              <div className="space-y-3">
                {userAddresses.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No addresses saved yet.</p>
                ) : (
                  userAddresses.map((addr, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex gap-2 text-xs leading-relaxed">
                        <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{addr}</span>
                      </div>
                      <button onClick={() => removeAddress(user.id, idx)} className="text-rose-400 hover:text-rose-500 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleAddAddress} className="pt-4 border-t border-white/10 space-y-3">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block">Add Destination</label>
                <input
                  type="text"
                  placeholder="Apartment, Street Name, City, Pincode"
                  className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground"
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  required
                />
                <button type="submit" className="bg-accent text-white rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-accent/90">Add Destination</button>
              </form>
            </div>
          )}

          {/* Tab: Coupons */}
          {activeTab === "coupons" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Available Maison Coupons</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {state.coupons.map((c) => (
                  <div key={c.code} className="border border-dashed border-accent/40 bg-accent/5 p-5 flex flex-col justify-between rounded-2xl">
                    <div>
                      <div className="font-mono text-lg font-bold tracking-widest text-accent">{c.code}</div>
                      <div className="text-xs mt-1 font-semibold">{c.discount}% Discount for Curation Carts</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-4">Expiry: {c.expiryDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Wishlist */}
          {activeTab === "wishlist" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Isolated Shop Wishlist</h2>
              {wishlistItems.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Your shop wishlist is empty.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {wishlistItems.map((p) => (
                    <div key={p.id} className="flex gap-4 p-3 bg-white/5 border border-white/10 rounded-2xl">
                      <img src={p.image} className="w-16 h-20 object-cover rounded-xl" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] text-muted-foreground">{p.house}</div>
                          <div className="font-serif text-sm font-semibold">{p.name}</div>
                          <div className="text-accent text-xs font-bold mt-1">{p.price}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              addToShopCart({ productId: p.id, name: p.name, house: p.house, price: p.price, image: p.image, selectedSize: "M" });
                              alert("Added to Cart!");
                            }}
                            className="bg-accent text-white px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider hover:bg-accent/90"
                          >
                            Add Cart
                          </button>
                          <button onClick={() => toggleShopWishlist(user.id, p.id)} className="text-rose-400 hover:text-rose-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Cart */}
          {activeTab === "cart" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Checkout Summary</h2>
              {state.shopCart.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Your shop cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {state.shopCart.map(item => (
                    <div key={item.productId} className="flex gap-4 p-3 bg-white/5 border border-white/10 rounded-2xl">
                      <img src={item.image} className="w-12 h-16 object-cover rounded" />
                      <div className="flex-1 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-semibold">{item.name} ({item.selectedSize})</div>
                          <div className="text-muted-foreground">Qty: {item.qty}</div>
                        </div>
                        <div className="font-bold">{item.price}</div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <select
                      value={checkoutAddress}
                      onChange={e => setCheckoutAddress(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-full text-xs outline-none text-foreground"
                    >
                      <option className="bg-zinc-900" value="">Select Address</option>
                      {userAddresses.map((addr, idx) => (
                        <option className="bg-zinc-900" key={idx} value={addr}>{addr}</option>
                      ))}
                    </select>
                    <button onClick={handlePlaceOrder} className="w-full bg-accent text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-accent/90">Confirm Order</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Orders */}
          {activeTab === "orders" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Maison Orders Tracker</h2>
              {userOrders.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No orders found.</p>
              ) : (
                <div className="space-y-4">
                  {userOrders.map(order => (
                    <div key={order.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="font-mono text-xs font-semibold">{order.id}</span>
                        <StatusChip status={order.status} tone={order.status === "Delivered" ? "success" : "warn"} />
                      </div>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.productId} className="flex justify-between text-xs">
                            <span>{item.name} x{item.qty} ({item.selectedSize})</span>
                            <span>{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                        <span className="text-muted-foreground">Total Paid:</span>
                        <span className="font-bold text-accent">₹{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Returns */}
          {activeTab === "returns" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Returns & Refund analytics</h2>
              <div className="space-y-4">
                {state.returns.filter(r => r.customerId === user.id).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No returns logged.</p>
                ) : (
                  state.returns.filter(r => r.customerId === user.id).map(r => (
                    <div key={r.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-semibold">{r.id}</span>
                        <StatusChip status={r.status} tone={r.status === "Approved" ? "success" : "neutral"} />
                      </div>
                      <p className="text-xs">Reason: <span className="text-muted-foreground">{r.reason}</span></p>
                      <p className="text-xs">Refund Payout: <span className="text-accent font-bold">₹{r.refundAmount.toLocaleString()}</span></p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab: Wallet */}
          {activeTab === "wallet" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-4">
              <h2 className="font-serif text-2xl">My Luxury Wallet</h2>
              <div className="bg-gradient-to-br from-accent/20 to-black/40 border border-accent/20 p-6 rounded-2xl max-w-sm space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Available Credits</div>
                <div className="font-serif text-3xl font-bold text-accent">₹{(state.wallets[user.id] ?? 0).toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Tab: Notifications */}
          {activeTab === "notifications" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h2 className="font-serif text-2xl">Alerts & Notifications</h2>
                <button onClick={() => markNotificationsRead()} className="text-[10px] uppercase font-bold text-accent">Mark read</button>
              </div>
              <div className="space-y-3">
                {state.notifications.map(n => (
                  <div key={n.id} className="p-3 border border-white/10 rounded-2xl text-xs bg-white/5">
                    <div className="font-semibold">{n.title}</div>
                    <div className="text-muted-foreground mt-1">{n.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Settings */}
          {activeTab === "settings" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-4">
              <h2 className="font-serif text-2xl">Maison Preferences</h2>
              <div className="space-y-3 text-xs">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-accent" />
                  <span>Subscribe to ReeVibes' seasonal luxury fashion lookbooks</span>
                </label>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
