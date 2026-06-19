import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { Trash2, Tag, MapPin, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/motion/Reveal";
import { AdminCard } from "@/components/layout/AdminLayout";

export const Route = createFileRoute("/shop/cart")({
  component: ShopCart,
});

function ShopCart() {
  const { state, removeFromShopCart, clearShopCart, createOrder, addAddress } = usePortal();
  const { shopCount: count, shopTotal: total } = useCartTotal();
  const navigate = useNavigate();

  const user = state.user;
  const cartItems = state.shopCart || [];

  // Address and Coupon states
  const savedAddresses = user ? state.addresses[user.id] || [] : [];
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0] || "");
  const [newAddressInput, setNewAddressInput] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAddressInput.trim()) return;
    addAddress(user.id, newAddressInput.trim());
    setSelectedAddress(newAddressInput.trim());
    setNewAddressInput("");
    setIsAddingAddress(false);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon = state.coupons.find(
      (c) => c.code === couponCode.trim().toUpperCase() && c.active,
    );
    if (coupon) {
      const discount = Math.round((total * coupon.discount) / 100);
      setDiscountAmount(discount);
      setAppliedCoupon(coupon.code);
      alert(`Success! Coupon applied: ₹${discount.toLocaleString()} OFF`);
    } else {
      alert("Invalid or expired coupon code.");
    }
  };

  const handlePlaceOrder = () => {
    if (!user) {
      alert("Please sign in to place an order.");
      navigate({ to: "/shop/login" });
      return;
    }
    if (cartItems.length === 0) return;
    if (!selectedAddress) {
      alert("Please select or add a shipping address.");
      return;
    }

    const finalTotal = Math.max(0, total - discountAmount);
    createOrder(user.id, {
      items: cartItems,
      total: finalTotal,
      address: selectedAddress,
    });

    alert("Thank you! Your order has been placed successfully.");
    navigate({ to: "/shop/account", search: { tab: "orders" } as any });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-white/5 dark:bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner backdrop-blur-md">
          <ShoppingBag className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="font-serif text-3xl">Your Cart is Empty</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Explore our curated collections to discover statement pieces tailored for you.
          </p>
        </div>
        <Link
          to="/shop"
          className="bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full transition-transform hover:scale-105 active:scale-95"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 space-y-8">
      <h1 className="font-serif text-3xl md:text-5xl">Your Shopping Cart</h1>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="liquid-glass overflow-hidden divide-y divide-white/10 dark:divide-white/10 rounded-3xl border border-white/10">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                <img
                  src={item.image}
                  className="w-20 aspect-[3/4] object-cover rounded-xl border border-white/10 shadow-md"
                />
                <div className="flex-1 space-y-1">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {item.house}
                  </div>
                  <h3 className="font-serif text-lg text-foreground hover:text-accent">
                    <Link to="/shop/product/$productId" params={{ productId: item.productId }}>
                      {item.name}
                    </Link>
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    Size:{" "}
                    <span className="font-semibold text-foreground uppercase">
                      {item.selectedSize || "M"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Quantity: <span className="font-semibold text-foreground">{item.qty}</span>
                  </div>
                </div>
                <div className="sm:text-right space-y-2 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                  <div className="font-serif text-base font-semibold">{item.price}</div>
                  <button
                    onClick={() => removeFromShopCart(item.productId)}
                    className="text-rose-400 hover:text-rose-500 hover:scale-105 transition-all p-2 rounded-full hover:bg-rose-500/10 border border-transparent"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address Selector */}
          <div className="liquid-glass p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <MapPin className="w-5 h-5 text-accent" />
              <h3 className="font-serif text-xl">Shipping Address</h3>
            </div>

            {user ? (
              <div className="space-y-4">
                {savedAddresses.length > 0 ? (
                  <div className="grid gap-3">
                    {savedAddresses.map((addr, idx) => (
                      <label
                        key={idx}
                        className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                          selectedAddress === addr
                            ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                            : "border-white/10 hover:border-white/25 bg-white/5 dark:bg-white/5"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping_address"
                          className="mt-1 accent-accent"
                          checked={selectedAddress === addr}
                          onChange={() => setSelectedAddress(addr)}
                        />
                        <span className="text-xs leading-relaxed">{addr}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No shipping addresses saved yet.
                  </p>
                )}

                {isAddingAddress ? (
                  <form
                    onSubmit={handleAddAddressSubmit}
                    className="space-y-3 pt-3 border-t border-white/10"
                  >
                    <label className="block text-xs text-muted-foreground">
                      New Address Details
                    </label>
                    <textarea
                      required
                      className="w-full bg-white/5 dark:bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-accent rounded-xl h-20 placeholder:text-muted-foreground/50 transition-colors"
                      placeholder="Street address, apartment, city, state, zip code…"
                      value={newAddressInput}
                      onChange={(e) => setNewAddressInput(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="editorial-label bg-accent text-white px-5 py-2 hover:bg-accent/90 rounded-full text-xs font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 rounded-full text-xs text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-accent hover:text-accent/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add New Address
                  </button>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic">
                Please{" "}
                <Link to="/shop/login" className="text-accent underline">
                  sign in
                </Link>{" "}
                to select a shipping address.
              </div>
            )}
          </div>
        </div>

        {/* Checkout summary sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="liquid-glass p-6 space-y-6 shadow-xl">
            <h3 className="font-serif text-2xl border-b border-white/10 pb-4">Checkout Summary</h3>

            {/* Coupons box */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                Promo Coupon
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-3.5 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="FESTIVE20"
                    className="w-full bg-white/5 dark:bg-white/5 border border-white/10 pl-10 pr-3 py-2.5 text-xs outline-none uppercase rounded-full focus:border-accent transition-colors"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white/10 hover:bg-white/20 border border-white/15 px-5 text-xs font-semibold uppercase tracking-widest rounded-full text-foreground transition-all"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">
                  Applied Code: {appliedCoupon}
                </div>
              )}
            </form>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items Subtotal</span>
                <span className="font-serif">₹{total.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span className="font-serif">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                  FREE
                </span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between text-base font-bold">
                <span>Estimated Total</span>
                <span className="font-serif text-accent text-lg">
                  ₹{Math.max(0, total - discountAmount).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="w-full bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Place Order <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
