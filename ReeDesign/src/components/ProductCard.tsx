import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { cn, formatPrice, isDesktopPointer, prefersReducedMotion } from "@/lib/utils";

/**
 * Liquid Glass product card.
 * - Wishlist heart: ALWAYS visible, top-right, gold-filled when saved.
 * - Desktop (md+): Add-to-Bag slides up over the image on hover; 3D tilt.
 * - Mobile/touch: Add-to-Bag is a permanent gold button below the details —
 *   no hover required anywhere.
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

  const goldBtn =
    "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter,transform] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105 active:scale-[0.97]";

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group glass glass-reflect glass-edge relative flex h-full flex-col overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* image */}
      <div className="relative aspect-[4/5] shrink-0 overflow-hidden bg-charcoal/5">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1000}
          className="h-full w-full origin-top object-cover transition-transform duration-700 ease-out md:group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block" />

        {/* wishlist heart — always visible, top-right */}
        <motion.button
          type="button"
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wished}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          whileTap={{ scale: 0.8 }}
          className={cn(
            "glass glass-strong absolute right-2 top-2 z-[3] flex h-9 w-9 items-center justify-center rounded-full transition-shadow duration-300 sm:right-3 sm:top-3 sm:h-11 sm:w-11",
            wished && "shadow-[0_0_20px_-2px_rgba(200,169,106,0.6)]"
          )}
        >
          <motion.span
            key={String(wished)}
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
                wished ? "fill-gold text-gold" : "text-ink"
              )}
            />
          </motion.span>
        </motion.button>

        {/* add to bag — desktop: slides up over the image on hover */}
        <div className="absolute inset-x-3 bottom-3 z-[2] hidden translate-y-[130%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 md:block">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className={cn(goldBtn, "py-2.5")}
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Add to Bag
          </button>
        </div>
      </div>

      {/* details */}
      <div className="relative z-[2] flex flex-1 flex-col gap-2 p-2.5 sm:gap-3 sm:p-4">
        <div className="flex flex-1 items-start justify-between gap-2 sm:gap-2.5">
          <div className="min-w-0">
            <h3 className="truncate text-[13px] text-ink sm:text-[15px]">
              {product.name}
            </h3>
            <p
              className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-muted sm:text-xs"
              aria-label={`Rated ${product.rating} out of 5`}
            >
              <Star
                size={11}
                className="fill-gold text-gold"
                aria-hidden="true"
              />
              {product.rating.toFixed(1)}
            </p>
          </div>
          <p className="shrink-0 text-right">
            <span className="block text-[13px] text-gold sm:text-[15px]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="block text-[11px] text-ink-muted line-through sm:text-xs">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </p>
        </div>

        {/* add to bag — mobile/tablet: always visible, no hover needed */}
        <button
          type="button"
          onClick={() => addToCart(product)}
          className={cn(
            goldBtn,
            "min-h-[38px] py-2 text-[10px] tracking-[0.16em] sm:min-h-[44px] sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] md:hidden"
          )}
        >
          <ShoppingBag size={13} strokeWidth={2} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}
