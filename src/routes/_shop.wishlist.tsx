import { createFileRoute, Link } from "@tanstack/react-router";
import { usePortal } from "@/lib/portal-state";
import { PRODUCTS } from "@/lib/data";
import { useState } from "react";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useShopNotification } from "./_shop";

export const Route = createFileRoute("/_shop/wishlist")({
  head: () => ({ meta: [{ title: "My Wishlist Curation — ReeVibes" }] }),
  component: ShopWishlistPage,
});

function ShopWishlistPage() {
  const { state, toggleShopWishlist, addToShopCart } = usePortal();
  const { triggerPopup } = useShopNotification();
  const user = state.user;

  // Wishlist Items
  const wishlistIds = user
    ? (state.shopWishlist?.[user.id] ||
       state.shopWishlist?.[user.id.toLowerCase()] ||
       state.shopWishlist?.[user.id.toUpperCase()] ||
       [])
    : [];
  
  const wishlistItems = (state.products || PRODUCTS).filter(p =>
    wishlistIds.map(String).includes(String(p.id))
  );

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
        <div className="liquid-glass p-8 max-w-md w-full border border-white/20 rounded-3xl">
          <p className="editorial-eyebrow text-accent">Shop Members Only</p>
          <h1 className="mt-4 font-serif text-3xl">Sign in to continue.</h1>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            Your shopping wishlist is reserved for registered members of the maison.
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
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl md:text-5xl">My Wishlist Curation</h1>
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

      {wishlistItems.length === 0 ? (
        <div className="liquid-glass border border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl text-foreground">Your Wishlist is Empty</h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Discover our luxury collections and add your favorite statements to your personal curation folder.
          </p>
          <Link to="/" className="inline-block bg-accent hover:bg-accent-foreground text-white border border-accent/20 px-8 py-3 text-xs uppercase tracking-widest font-bold rounded-full transition-colors cursor-pointer shadow-lg shadow-accent/25">
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((p) => (
            <WishlistPageCard
              key={p.id}
              p={p}
              user={user}
              toggleShopWishlist={toggleShopWishlist}
              addToShopCart={addToShopCart}
              triggerPopup={triggerPopup}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistPageCard({
  p,
  user,
  toggleShopWishlist,
  addToShopCart,
  triggerPopup,
}: {
  p: any;
  user: any;
  toggleShopWishlist: any;
  addToShopCart: any;
  triggerPopup: any;
}) {
  const ensureRupees = (val: any) => {
    if (val === undefined || val === null) return "";
    const clean = String(val).trim();
    return clean.startsWith("₹") ? clean : `₹${clean}`;
  };

  const handleRemove = () => {
    toggleShopWishlist(user.id, p.id);
    triggerPopup(
      `${p.name} removed from wishlist.`,
      () => toggleShopWishlist(user.id, p.id),
      `${p.name} added to wishlist!`,
      () => toggleShopWishlist(user.id, p.id),
      `${p.name} removed from wishlist.`
    );
  };

  const availableSizes = p.sizes || ["S", "M", "L", "XL"];

  return (
    <div className="flex flex-col bg-white/5 border border-white/10 rounded-3xl relative group overflow-hidden shadow-xl hover:border-white/20 transition-all duration-300">
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-foreground/5">
        <Link to="/product/$productId" params={{ productId: p.id }} className="block w-full h-full">
          <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </Link>
        {/* Remove from Wishlist Button Overlay */}
        <button
          onClick={handleRemove}
          className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-rose-950/40 rounded-full transition-colors group/btn cursor-pointer z-10"
          title="Remove from Wishlist"
        >
          <Trash2 className="w-4 h-4 text-rose-400 group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>

      {/* Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">
            {p.house}
          </span>
          <Link
            to="/product/$productId"
            params={{ productId: p.id }}
            className="hover:text-accent transition-colors block mt-1"
          >
            <h3 className="font-serif text-base font-semibold truncate">{p.name}</h3>
          </Link>
          <div className="text-accent text-sm font-bold mt-1.5">{ensureRupees(p.price)}</div>
        </div>

        {/* Sizes Row */}
        <div className="space-y-1">
          <span className="text-[8px] uppercase tracking-widest text-muted-foreground block">Available Sizes</span>
          <div className="flex gap-1.5 flex-wrap">
            {availableSizes.map((sz: string, idx: number) => (
              <span key={idx} className="text-[9px] bg-white/10 text-white border border-white/5 px-2 py-0.5 rounded-full font-mono font-medium">
                {sz}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            addToShopCart({ productId: p.id, name: p.name, house: p.house, price: p.price, image: p.image, selectedSize: "M" });
            triggerPopup(
              `${p.name} (M) added to cart!`,
              () => {},
              `${p.name} removed from cart.`,
              () => {},
              `${p.name} added to cart!`
            );
          }}
          className="w-full bg-accent hover:bg-accent-foreground text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <ShoppingBag className="w-4 h-4" /> Move to Cart
        </button>
      </div>
    </div>
  );
}
