import { useState, useRef, useCallback, useContext } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { usePortal } from "@/lib/portal-state";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// These are imported from the _shop layout — consumers must be rendered inside
// the <QuickAddContext.Provider> and <ShopNotificationContext.Provider> trees.
import { QuickAddContext, useShopNotification } from "@/routes/_shop";

export interface ProductCardProps {
  p: any;
  toggleShopWishlist: (uid: string, pid: string) => void;
  addToShopCart: (p: any) => void;
  wishlist: string[] | undefined;
  discountPercent?: number;
  stockWarningText?: string;
  /** "default" = vertical card (image top, details bottom — homepage style)
   *  "horizontal" = image left, details right (search desktop style) */
  variant?: "default" | "horizontal";
}

export function ProductCard({
  p,
  toggleShopWishlist,
  addToShopCart,
  wishlist,
  discountPercent,
  stockWarningText,
  variant = "default",
}: ProductCardProps) {
  const { state } = usePortal();
  const { triggerPopup } = useShopNotification();
  const userId = state.user?.id;
  const isFavorite = wishlist ? wishlist.includes(p.id) : false;
  const quickAdd = useContext(QuickAddContext);

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

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      toast.error("Please login to manage your wishlist.");
      return;
    }
    toggleShopWishlist(userId, p.id);
    triggerPopup(
      !isFavorite ? `${p.name} added to wishlist!` : `${p.name} removed from wishlist.`,
      () => toggleShopWishlist(userId, p.id),
      !isFavorite ? `${p.name} removed from wishlist.` : `${p.name} added to wishlist!`,
      () => toggleShopWishlist(userId, p.id),
      !isFavorite ? `${p.name} added to wishlist!` : `${p.name} removed from wishlist.`
    );
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quickAdd) {
      quickAdd.openQuickAdd(p);
    }
  };

  // Calculate discounted price if applicable
  const pct = discountPercent || p.discount || 0;
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

  // Calculate final discount percentage if we have both prices
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

  /* ─────────────────── HORIZONTAL VARIANT (search desktop) ─────────────────── */
  if (variant === "horizontal") {
    const productDesc = p.description || p.shortDescription || p.tagline || "";

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
        className="group glass glass-reflect glass-edge relative flex flex-col md:flex-row md:h-48 overflow-hidden rounded-2xl md:rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)] cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* image — left side on desktop */}
        <div className="relative w-full md:w-44 lg:w-48 h-48 md:h-full shrink-0 overflow-hidden bg-charcoal/5">
          <Link to="/product/$productId" params={{ productId: p.id }} className="block w-full h-full">
            <img
              src={gallery[activeImgIdx]}
              alt={p.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          </Link>
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block" />

          {stockWarningText && (
            <span className="glass absolute bottom-2.5 left-2.5 rounded-full bg-amber-500/20 border border-amber-500/35 px-2 py-0.5 text-[8px] uppercase tracking-[0.1em] font-bold text-amber-300 z-10">
              {stockWarningText}
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
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImgIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* details — right side on desktop */}
        <div className="relative z-[2] flex flex-1 flex-col justify-between p-3.5 sm:p-4 md:px-5 md:py-3.5 bg-white/50 dark:bg-black/25 min-w-0">
          <div>
            <Link
              to="/product/$productId"
              params={{ productId: p.id }}
              className="hover:text-accent transition-colors block"
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
            >
              <h3 className="text-sm sm:text-base md:text-lg text-ink font-sans font-semibold leading-tight truncate">
                {p.name}
              </h3>
            </Link>

            {/* Rating & Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <p className="flex items-center gap-1 text-[11px] text-ink-muted font-medium">
                <Star size={11} className="fill-gold text-gold" />
                {(p.rating || 4.8).toFixed(1)}
              </p>

              {p.house && (
                <span className="text-[9px] uppercase tracking-wider bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                  {p.house}
                </span>
              )}
              {p.gender && (
                <span className="text-[9px] uppercase tracking-wider bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                  {p.gender}
                </span>
              )}
              {p.category && (
                <span className="text-[9px] uppercase tracking-wider bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                  {p.category}
                </span>
              )}
            </div>

            {/* Product Description */}
            {productDesc && (
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed font-sans">
                {productDesc}
              </p>
            )}

            {/* Sizes Row */}
            <div
              className="transition-all duration-300 ease-in-out overflow-hidden"
              style={{
                maxHeight: isTitleHovered ? "20px" : "0px",
                opacity: isTitleHovered ? 1 : 0,
                marginTop: isTitleHovered ? "4px" : "0px",
              }}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground shrink-0 font-bold">Sizes:</span>
                <div className="overflow-hidden w-full relative">
                  <div
                    className="flex gap-1"
                    style={
                      isTitleHovered && (p.sizes || ["S", "M", "L", "XL"]).length > 3
                        ? { animation: 'marquee-pingpong 4s ease-in-out infinite alternate', animationDelay: '1s', width: 'max-content' }
                        : { width: 'max-content' }
                    }
                  >
                    {(p.sizes || ["S", "M", "L", "XL"]).map((sz: string, idx: number) => (
                      <span key={sz + "-" + idx} className="text-[9px] font-bold bg-white/10 px-1.5 py-0.5 rounded border border-white/5 text-foreground whitespace-nowrap">
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price + Actions Row */}
          <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-foreground/5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base md:text-lg text-gold font-bold">
                {displayFinalPrice}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-ink-muted line-through">
                  {displayOrigPrice}
                </span>
              )}
              {displayPct > 0 && (
                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-400 tracking-wider uppercase">
                  {displayPct}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Wishlist button moved to the left side of Add to Bag */}
              <motion.button
                type="button"
                onClick={handleWishlistClick}
                whileTap={{ scale: 0.85 }}
                className={cn(
                  "flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-foreground/15 bg-white/40 dark:bg-white/5 text-foreground transition-all duration-200 hover:bg-gold/10 hover:border-gold/40 hover:text-gold cursor-pointer",
                  isFavorite && "border-gold/50 bg-gold/15 text-gold shadow-[0_0_12px_-2px_rgba(200,169,106,0.5)]"
                )}
                title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
              >
                <motion.span
                  key={String(isFavorite)}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 480, damping: 15 }}
                  className="flex"
                >
                  <Heart
                    size={15}
                    strokeWidth={1.8}
                    className={cn(
                      "transition-colors duration-300",
                      isFavorite ? "fill-gold text-gold" : "text-foreground"
                    )}
                  />
                </motion.span>
              </motion.button>

              <button
                type="button"
                onClick={handleAddToCartClick}
                className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep px-3.5 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[10px] font-semibold tracking-[0.14em] uppercase text-obsidian shadow-[0_8px_20px_-6px_rgba(200,169,106,0.6)] transition-[box-shadow,filter,transform] duration-300 hover:shadow-[0_12px_28px_-6px_rgba(200,169,106,0.8)] hover:brightness-105 active:scale-[0.97] cursor-pointer"
              >
                <ShoppingBag size={12} strokeWidth={2} />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────────── DEFAULT VARIANT (vertical card) ───────────────────── */
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
      className="group glass glass-reflect glass-edge relative flex h-full flex-col overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)] cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* image */}
      <div className="relative aspect-[4/5] shrink-0 overflow-hidden bg-charcoal/5">
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
          <span className="glass-strong glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-ink z-10">
            {displayPct}% OFF
          </span>
        )}

        {stockWarningText && (
          <span className="glass absolute bottom-3 left-3 rounded-full bg-amber-500/20 border border-amber-500/35 px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] font-bold text-amber-300 z-10">
            {stockWarningText}
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
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImgIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* wishlist */}
        <motion.button
          type="button"
          onClick={handleWishlistClick}
          whileTap={{ scale: 0.8 }}
          className={cn(
            "glass glass-strong absolute right-2 top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full transition-shadow duration-300 sm:right-3 sm:top-3 sm:h-11 sm:w-11 cursor-pointer",
            isFavorite && "shadow-[0_0_20px_-2px_rgba(200,169,106,0.6)]"
          )}
        >
          <motion.span
            key={String(isFavorite)}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 480, damping: 15 }}
            className="flex"
          >
            <Heart
              size={15}
              strokeWidth={1.8}
              className={cn(
                "transition-colors duration-300",
                isFavorite ? "fill-gold text-gold" : "text-ink"
              )}
            />
          </motion.span>
        </motion.button>

        {/* Add to Bag slides up - desktop only */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-[130%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 md:block">
          <button
            type="button"
            onClick={handleAddToCartClick}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter,transform] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105 active:scale-[0.97] cursor-pointer"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Add to Bag
          </button>
        </div>
      </div>

      {/* details */}
      <div className="relative z-[2] flex flex-1 flex-col gap-2 p-2.5 sm:gap-3 sm:p-4 bg-white dark:bg-black/25">
        <div className="flex flex-1 items-start justify-between gap-2 sm:gap-2.5">
          <div className="min-w-0">
            <Link
              to="/product/$productId"
              params={{ productId: p.id }}
              className="hover:text-accent transition-colors block"
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
            >
              <h3 className="truncate text-[13px] text-ink sm:text-[15px] font-sans font-medium leading-tight">
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

        {/* Sizes Row */}
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

        {/* add to bag — mobile/tablet: always visible, no hover needed */}
        <button
          type="button"
          onClick={handleAddToCartClick}
          className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2 text-[10px] tracking-[0.16em] sm:min-h-[44px] sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] md:hidden cursor-pointer shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter,transform] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105 active:scale-[0.97]"
        >
          <ShoppingBag size={13} strokeWidth={2} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}
