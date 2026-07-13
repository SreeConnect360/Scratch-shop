import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data/products";
import SectionHeading from "@/components/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

/** Frosted review cards with pointer-lit reflections. */
export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative py-16 md:py-20"
    >
      <div className="section-shell">
        <SectionHeading eyebrow="From Our Clients" title="Worn. Loved. Shared." />
        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.65,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              <GlassCard tilt maxTilt={4} className="flex h-full flex-col p-6 lg:p-7">
                <Quote
                  size={22}
                  aria-hidden="true"
                  className="mb-4 text-gold/60"
                />
                <blockquote className="flex-1 text-[15px] leading-relaxed text-ink">
                  “{t.quote}”
                </blockquote>
                <div
                  className="mt-5 flex gap-1"
                  aria-label="Rated 5 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={12}
                      aria-hidden="true"
                      className="fill-gold text-gold"
                    />
                  ))}
                </div>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-[var(--glass-border)] pt-4">
                  <img
                    src={t.avatar}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-gold/30"
                  />
                  <span>
                    <span className="block text-sm text-ink">{t.name}</span>
                    <span className="block text-xs text-ink-muted">
                      {t.role}
                    </span>
                  </span>
                </figcaption>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
