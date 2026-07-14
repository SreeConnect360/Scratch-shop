import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { flashSaleProducts } from "@/data/products";
import ProductCarousel from "@/components/ProductCarousel";
import SectionHeading from "@/components/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";

function useCountdown() {
  const [left, setLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999); // sale ends at midnight tonight
    const tick = () => {
      const d = Math.max(0, end.getTime() - Date.now());
      setLeft({
        h: Math.floor(d / 3.6e6),
        m: Math.floor((d % 3.6e6) / 6e4),
        s: Math.floor((d % 6e4) / 1e3),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Luxury countdown in tabular glass tiles + discounted product row. */
export default function FlashSale() {
  const { h, m, s } = useCountdown();
  const cells = [
    { v: pad(h), l: "Hours" },
    { v: pad(m), l: "Minutes" },
    { v: pad(s), l: "Seconds" },
  ];

  return (
    <section
      id="flash-sale"
      aria-labelledby="flash-sale-heading"
      className="relative py-16 md:py-20"
    >
      {/* gold atmosphere behind the section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[30rem] w-[60rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.07] blur-[120px] dark:block"
      />
      <div className="section-shell">
        <div className="mb-10 flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <div className="text-center lg:text-left">
            <p className="mb-3 flex items-center justify-center gap-2 text-[11px] tracking-[0.3em] uppercase text-gold lg:justify-start">
              <Zap size={13} className="fill-gold" aria-hidden="true" />
              Limited Hours
            </p>
            <h2 id="flash-sale-heading" className="text-3xl text-ink sm:text-4xl">
              The Flash Édit
            </h2>
          </div>

          {/* countdown */}
          <div
            className="flex items-center gap-2.5"
            role="timer"
            aria-label={`Sale ends in ${h} hours, ${m} minutes, ${s} seconds`}
          >
            {cells.map((c, i) => (
              <div key={c.l} className="flex items-center gap-2.5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass glass-edge flex h-[4.4rem] w-[4.4rem] flex-col items-center justify-center rounded-2xl"
                >
                  <span className="text-2xl tabular-nums text-gold">{c.v}</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-ink-muted">
                    {c.l}
                  </span>
                </motion.div>
                {i < cells.length - 1 && (
                  <span className="text-xl text-gold/50" aria-hidden="true">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <ProductCarousel
          products={flashSaleProducts}
          label="flash sale products"
        />

        <div className="mt-8 flex justify-center">
          <MagneticButton variant="gold">
            Shop the Sale <ArrowRight size={14} aria-hidden="true" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
