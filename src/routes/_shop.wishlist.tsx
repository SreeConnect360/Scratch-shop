import { createFileRoute, Link } from "@tanstack/react-router";
import { usePortal } from "@/lib/portal-state";
import { PRODUCTS } from "@/lib/data";
import { useState, useRef, useCallback, useContext } from "react";
import { Heart, ShoppingBag, Trash2, ArrowLeft, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useShopNotification, QuickAddContext } from "./_shop";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_shop/wishlist")({
  head: () => ({ meta: [{ title: "My Wishlist Curation — ReeVibes" }] }),
  component: ShopWishlistPage,
});

function ShopWishlistPage() {
  const { state, toggleShopWishlist, addToShopCart } = usePortal();
  const { triggerPopup } = useShopNotification();
  const quickAdd = useContext(QuickAddContext);
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
        /* Mobile: 2 Columns | Desktop: 3-5 Columns (Matching Category Page Layout) */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 items-start">
          {wishlistItems.map((p) => (
            <WishlistPageCard
              key={p.id}
              p={p}
              user={user}
              toggleShopWishlist={toggleShopWishlist}
              addToShopCart={addToShopCart}
              triggerPopup={triggerPopup}
              quickAdd={quickAdd}
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
  quickAdd,
}: {
  p: any;
  user: any;
  toggleShopWishlist: any;
  addToShopCart: any;
  triggerPopup: any;
  quickAdd: any;
}) {
  const gallery = (p.images && p.images.length > 0) ? p.images : [p.image];
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-6px)`;
    });
  }, []);

  const handleLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
    }
  }, []);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleShopWishlist(user.id, p.id);
    triggerPopup(
      `${p.name} removed from wishlist.`,
      () => toggleShopWishlist(user.id, p.id),
      `${p.name} added to wishlist!`,
      () => toggleShopWishlist(user.id, p.id),
      `${p.name} removed from wishlist.`
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (quickAdd) {
      quickAdd.openQuickAdd(p);
    } else {
      addToShopCart({
        productId: p.id,
        name: p.name,
        house: p.house,
        price: p.price,
        image: p.image,
        selectedSize: "M",
        qty: 1,
      });
    }

    // Floating notification toast at bottom of screen with "Go to Cart" action button
    toast.custom((t) => (
      <div className="liquid-glass border border-white/20 p-3.5 sm:p-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center justify-between gap-3 text-foreground w-full max-w-md bg-zinc-950/95 backdrop-blur-xl animate-fadeIn">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold truncate text-foreground">{p.name}</p>
            <p className="text-[10px] text-emerald-400 font-medium">Added to your shopping cart</p>
          </div>
        </div>
        <Link
          to="/cart"
          onClick={() => toast.dismiss(t)}
          className="shrink-0 bg-gradient-to-r from-accent via-gold to-accent-rose text-obsidian px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer"
        >
          Go to Cart
        </Link>
      </div>
    ), { duration: 4500, position: "bottom-center" });
  };

  // Pricing calculations
  const pct = p.discount || 0;
  const hasDiscount = !!(pct || p.originalPrice);
  let origPrice = p.price;
  let finalPrice = p.price;

  if (p.originalPrice && p.originalPrice !== p.price) {
    origPrice = p.originalPrice;
    finalPrice = p.price;
  } else if (pct) {
    try {
      const numeric = Number(String(p.price).replace(/[^0-9]/g, ""));
      if (!isNaN(numeric)) {
        const discounted = Math.round(numeric * (1 - pct / 100));
        finalPrice = `₹${discounted.toLocaleString()}`;
        origPrice = p.price;
      }
    } catch { /* ignore */ }
  }

  const ensureRupees = (val: any) => {
    if (val === undefined || val === null) return "";
    const clean = String(val).trim();
    return clean.startsWith("₹") ? clean : `₹${clean}`;
  };

  const displayFinalPrice = ensureRupees(finalPrice);
  const displayOrigPrice = ensureRupees(origPrice);

  let displayPct = pct;
  if (hasDiscount && !displayPct) {
    try {
      const origNumeric = Number(String(origPrice).replace(/[^0-9]/g, ""));
      const finalNumeric = Number(String(finalPrice).replace(/[^0-9]/g, ""));
      if (origNumeric && finalNumeric && origNumeric > finalNumeric) {
        displayPct = Math.round(((origNumeric - finalNumeric) / origNumeric) * 100);
      }
    } catch { /* ignore */ }
  }

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        setIsHovered(true);
        handleMove(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleLeave();
      }}
      className="group glass glass-reflect glass-edge relative flex flex-col justify-between h-full overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)] cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5">
        <Link to="/product/$productId" params={{ productId: p.id }} className="block w-full h-full">
          <img
            src={gallery[activeImgIdx]}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block" />

        {displayPct > 0 && (
          <span className="glass-strong glass absolute left-2.5 top-2.5 sm:left-3 sm:top-3 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-ink z-10 font-bold">
            {displayPct}% OFF
          </span>
        )}

        {/* Carousel Toggles */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImgIdx((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1 sm:p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200"
            >
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImgIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1 sm:p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200"
            >
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </>
        )}

        {/* Delete (Remove from Wishlist) Icon Button positioned at top-right corner */}
        <button
          type="button"
          onClick={handleRemove}
          className="glass glass-strong absolute right-2 top-2 sm:right-3 sm:top-3 z-30 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 hover:bg-rose-500/30 text-rose-400 border border-white/10 hover:border-rose-400/50 cursor-pointer shadow-lg transition-all duration-300"
          title="Remove from Wishlist"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Add to Bag slides up - desktop only */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-[130%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 md:block">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter,transform] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105 active:scale-[0.97] cursor-pointer"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Add to Bag
          </button>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="relative z-[2] flex flex-1 flex-col gap-2 p-2.5 sm:gap-3 sm:p-4 bg-white dark:bg-black/25">
        <div className="flex flex-1 items-start justify-between gap-2 sm:gap-2.5">
          <div className="min-w-0">
            {p.house && (
              <span className="text-[9px] uppercase tracking-widest text-accent font-bold block truncate">
                {p.house}
              </span>
            )}
            <Link
              to="/product/$productId"
              params={{ productId: p.id }}
              className="hover:text-accent transition-colors block"
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
            >
              <h3 className="truncate text-[13px] text-ink sm:text-[15px] font-sans font-medium leading-tight mt-0.5">
                {p.name}
              </h3>
            </Link>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-muted sm:text-xs">
              <Star size={11} className="fill-gold text-gold" />
              {(p.rating || 4.8).toFixed(1)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="block text-[13px] text-gold sm:text-[15px] font-bold">
              {displayFinalPrice}
            </span>
            {hasDiscount && (
              <span className="block text-[11px] text-ink-muted line-through sm:text-xs">
                {displayOrigPrice}
              </span>
            )}
          </div>
        </div>

        {/* Sizes Row Marquee */}
        <div
          className="transition-all duration-350 ease-in-out overflow-hidden"
          style={{
            maxHeight: isTitleHovered ? "24px" : "0px",
            opacity: isTitleHovered ? 1 : 0,
            marginTop: isTitleHovered ? "4px" : "0px",
          }}
        >
          <div className="flex items-center gap-1.5 w-full">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground shrink-0 font-bold">Sizes:</span>
            <div className="overflow-hidden w-full relative">
              <style>{`
                @keyframes marquee-pingpong {
                  0%, 15% { transform: translateX(0%); }
                  85%, 100% { transform: translateX(-45%); }
                }
              `}</style>
              <div
                className="flex gap-1.5"
                style={
                  isTitleHovered && (p.sizes || ["S", "M", "L", "XL"]).length > 3
                    ? { animation: 'marquee-pingpong 4s ease-in-out infinite alternate', animationDelay: '1s', width: 'max-content' }
                    : { width: 'max-content' }
                }
              >
                {(p.sizes || ["S", "M", "L", "XL"]).map((sz: string, idx: number) => (
                  <span key={sz + "-" + idx} className="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded border border-white/5 text-foreground whitespace-nowrap">
                    {sz}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add to Bag — mobile/tablet: always visible */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2 text-[10px] tracking-[0.16em] sm:min-h-[44px] sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] md:hidden cursor-pointer shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter,transform] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105 active:scale-[0.97]"
        >
          <ShoppingBag size={13} strokeWidth={2} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}

