import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { cn, formatPrice, isDesktopPointer, prefersReducedMotion } from "@/lib/utils";

/**
 * Liquid Glass product card: 3D tilt toward the cursor (±6°), traveling
 * light reflection, image zoom, slide-up Add-to-Bag, animated wishlist.
 * No gold borders — thin transparent glass only.
 */
export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);
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
      if (isDesktopPointer() && !prefersReducedMotion()) {
        el.style.transform = `perspective(900px) rotateX(${
          (0.5 - py) * 6
        }deg) rotateY(${(px - 0.5) * 6}deg) translateY(-6px)`;
      }
    });
  }, []);

  const handleLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (ref.current)
      ref.current.style.transform =
        "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
  }, []);

  return (
    <div
      ref={ref}
      data-cursor="view"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group glass glass-reflect glass-edge relative overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1000}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {product.tag && (
          <span className="glass-strong glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-ink">
            {product.tag}
          </span>
        )}

        {/* wishlist */}
        <motion.button
          type="button"
          data-cursor="button"
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wished}
          onClick={() => toggleWishlist(product)}
          whileTap={{ scale: 0.8 }}
          className="glass glass-strong absolute right-3 top-3 z-[2] flex h-10 w-10 items-center justify-center rounded-full"
        >
          <motion.span
            key={String(wished)}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 480, damping: 15 }}
            className="flex"
          >
            <Heart
              size={16}
              strokeWidth={1.8}
              className={cn(
                "transition-colors duration-300",
                wished ? "fill-gold text-gold" : "text-ink"
              )}
            />
          </motion.span>
        </motion.button>

        {/* quick view */}
        <button
          type="button"
          data-cursor="button"
          aria-label={`Quick view ${product.name}`}
          className="glass absolute right-3 top-[3.6rem] flex h-10 w-10 translate-y-2 items-center justify-center rounded-full text-white opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
        >
          <Eye size={16} strokeWidth={1.8} />
        </button>

        {/* add to bag slides up */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0">
          <button
            type="button"
            data-cursor="button"
            onClick={() => addToCart(product)}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Add to Bag
          </button>
        </div>
      </div>

      {/* details */}
      <div className="relative z-[2] flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] text-ink">{product.name}</h3>
          <p
            className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted"
            aria-label={`Rated ${product.rating} out of 5`}
          >
            <Star size={11} className="fill-gold text-gold" aria-hidden="true" />
            {product.rating.toFixed(1)}
          </p>
        </div>
        <p className="shrink-0 text-right">
          <span className="text-[15px] text-gold">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="ml-1.5 text-xs text-ink-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
