import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { prefersReducedMotion } from "@/lib/utils";

const slides = [
  {
    eyebrow: "The Autumn Édition · 2026",
    title: "Wear the Extraordinary",
    sub: "Couture-grade essentials and editorial silhouettes, hand-finished in ateliers across Europe.",
    cta: "Explore Collections",
    target: "collections",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop",
  },
  {
    eyebrow: "New In · Nocturne",
    title: "Evenings in Obsidian",
    sub: "Silhouettes for after dark — silk, velvet, and champagne gold, cut to move with you.",
    cta: "Shop New Arrivals",
    target: "trending",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    eyebrow: "Limited Hours",
    title: "The Flash Édit",
    sub: "House icons at private-member prices. Tonight only — while the atelier allows.",
    cta: "Shop the Sale",
    target: "flash-sale",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop",
  },
];

const AUTO_MS = 5200;

/**
 * Cinematic hero banner: full-bleed glass-framed carousel that auto-advances,
 * pauses on hover, and crossfades with a slow Ken Burns zoom. Arrows, dots,
 * and per-slide magnetic CTAs.
 */
export default function Hero() {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i + dir + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // live :hover check each tick — a stateful mouseenter/leave pair can get
    // stuck when the page scrolls beneath a stationary cursor
    const id = setInterval(() => {
      // skip while hovered or in a background tab (rAF is paused there, so
      // exit animations can't run and slides would stack up)
      if (document.hidden || carouselRef.current?.matches(":hover")) return;
      go(1);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [go]);

  const slide = slides[index];

  return (
    <section
      id="hero"
      aria-label="Featured stories"
      className="relative flex min-h-[88svh] flex-col items-center justify-center overflow-hidden pb-14 pt-6"
    >
      {/* ambient gold light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[16%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px] dark:bg-gold/[0.14]"
      />

      <div className="section-shell relative z-10">
        <div
          ref={carouselRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Seasonal highlights"
          className="glass glass-edge group relative h-[62svh] min-h-[26rem] w-full overflow-hidden rounded-[1.8rem] sm:h-[68svh]"
        >
          {/* slides */}
          <AnimatePresence mode="sync">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
            >
              <motion.img
                src={slide.image}
                alt=""
                initial={{ scale: 1 }}
                animate={{ scale: prefersReducedMotion() ? 1 : 1.08 }}
                transition={{ duration: AUTO_MS / 1000 + 1.2, ease: "linear" }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

              {/* slide copy */}
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-14">
                <motion.p
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="mb-3 text-[10.5px] tracking-[0.34em] uppercase text-gold-soft"
                >
                  {slide.eyebrow}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.35, duration: 0.7 }}
                  className="max-w-2xl text-balance text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.48, duration: 0.6 }}
                  className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base"
                >
                  {slide.sub}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mt-6 flex flex-wrap gap-4"
                >
                  <MagneticButton
                    variant="gold"
                    onClick={() =>
                      document
                        .getElementById(slide.target)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    {slide.cta} <ArrowRight size={15} aria-hidden="true" />
                  </MagneticButton>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* arrows */}
          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => go(-1)}
            className="glass absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white opacity-0 transition-all duration-300 hover:border-gold/40 hover:text-gold-soft group-hover:opacity-100 focus-visible:opacity-100 sm:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next banner"
            onClick={() => go(1)}
            className="glass absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white opacity-0 transition-all duration-300 hover:border-gold/40 hover:text-gold-soft group-hover:opacity-100 focus-visible:opacity-100 sm:flex"
          >
            <ChevronRight size={18} />
          </button>

          {/* dots + progress */}
          <div
            className="absolute bottom-5 right-6 z-10 flex items-center gap-2 sm:bottom-7 sm:right-9"
            role="tablist"
            aria-label="Choose banner"
          >
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Banner ${i + 1}: ${s.title}`}
                onClick={() => setIndex(i)}
                className="group/dot relative flex h-6 items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === index
                      ? "w-8 bg-gold shadow-[0_0_12px_rgba(200,169,106,0.7)]"
                      : "w-1.5 bg-white/40 group-hover/dot:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <motion.button
        type="button"
        aria-label="Scroll to categories"
        onClick={() =>
          document
            .getElementById("categories")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-ink-muted transition-colors hover:text-gold motion-reduce:animate-none"
      >
        <ChevronDown size={22} strokeWidth={1.5} />
      </motion.button>
    </section>
  );
}
