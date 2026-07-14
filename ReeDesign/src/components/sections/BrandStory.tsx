import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "1987", label: "Maison founded" },
  { value: "42", label: "Ateliers worldwide" },
  { value: "100%", label: "Ethically sourced" },
];

/** Editorial split: GSAP scroll-parallax imagery beside the maison's story. */
export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".story-img", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="brand-story"
      ref={sectionRef}
      aria-labelledby="brand-story-heading"
      className="relative py-16 md:py-20"
    >
      <div className="section-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* imagery */}
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          data-cursor="explore"
        >
          <div className="glass overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop"
                alt="Inside the ÉLYSIA atelier — garments on a curated rail"
                loading="lazy"
                className="story-img h-[112%] w-full object-cover"
              />
            </div>
          </div>
          {/* floating glass caption */}
          <motion.figure
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glass glass-strong glass-edge absolute -bottom-6 -right-3 max-w-[15rem] rounded-2xl p-4 sm:-right-6 motion-reduce:animate-none"
          >
            <p className="text-[10px] tracking-[0.26em] uppercase text-gold">
              Since 1987
            </p>
            <p className="mt-1 text-sm leading-snug text-ink">
              Every seam placed by hand, every fabric traced to origin.
            </p>
          </motion.figure>
        </motion.div>

        {/* story */}
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold">
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            The Maison
          </p>
          <h2
            id="brand-story-heading"
            className="text-balance text-3xl leading-[1.15] text-ink sm:text-4xl lg:text-[2.6rem]"
          >
            Quiet luxury,
            <br />
            <span className="gold-text">loudly crafted.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-muted">
            ÉLYSIA began as a two-room atelier above a Lyon silk house. Four
            decades on, we still cut in small batches, still sign each lining,
            and still believe a garment should outlive its trend. Our
            collections travel from loom to wardrobe with nothing lost in
            between.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass glass-edge rounded-2xl p-4 text-center"
              >
                <dt className="order-2 mt-1 block text-[10px] leading-tight tracking-[0.14em] uppercase text-ink-muted">
                  {s.label}
                </dt>
                <dd className="text-xl text-gold sm:text-2xl">{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <MagneticButton variant="glass">
              Our Story <ArrowRight size={14} aria-hidden="true" />
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
