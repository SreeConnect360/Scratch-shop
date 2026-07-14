import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  products: Product[];
  /** max cards visible at once on wide screens */
  perView?: 3 | 4;
  label: string;
}

/**
 * Product row shared by every section:
 * - Mobile (<md): compact 2-up grid so 4–6 products fit the first viewport.
 * - md and up: smooth horizontal snap carousel with edge-aware arrows that
 *   fade out at the start/end. Equal card widths at every breakpoint.
 */
export default function ProductCarousel({
  products,
  perView = 4,
  label,
}: ProductCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const nudge = (dir: 1 | -1) => {
    const el = scroller.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  // widths account for the md:gap-6 (1.5rem) between visible cards
  const basis =
    perView === 3
      ? "md:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
      : "md:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)] xl:basis-[calc((100%-4.5rem)/4)]";

  const arrows = [
    {
      dir: -1 as const,
      can: canPrev,
      Icon: ChevronLeft,
      text: `Previous ${label}`,
      pos: "left-0",
    },
    {
      dir: 1 as const,
      can: canNext,
      Icon: ChevronRight,
      text: `More ${label}`,
      pos: "right-0",
    },
  ];

  return (
    // md+: side gutters reserve space so the arrows sit fully OUTSIDE the cards
    <div className="relative md:px-14">
      <div
        ref={scroller}
        className="no-scrollbar grid grid-cols-2 gap-3 sm:gap-4 md:-mt-4 md:flex md:snap-x md:snap-mandatory md:gap-6 md:overflow-x-auto md:pb-3 md:pt-4"
        role="list"
        aria-label={label}
      >
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            role="listitem"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: (i % perView) * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn("md:snap-start md:shrink-0", basis)}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>

      {/* carousel arrows — float over the cards, vertically centered on the
          row; fade out at the ends (and entirely when nothing scrolls) */}
      {arrows.map(({ dir, can, Icon, text, pos }) => (
        <button
          key={dir}
          type="button"
          aria-label={text}
          aria-disabled={!can}
          tabIndex={can ? 0 : -1}
          onClick={() => nudge(dir)}
          className={cn(
            "glass glass-strong absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink shadow-[var(--glass-shadow-hover)] transition-all duration-300 hover:border-gold/40 hover:text-gold sm:h-11 sm:w-11",
            pos,
            can
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          )}
        >
          <Icon size={18} strokeWidth={1.8} />
        </button>
      ))}
    </div>
  );
}
