import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/products";
import GlassCard from "@/components/ui/GlassCard";

/** Six glass category tiles with image parallax-zoom and stagger reveal. */
export default function Categories() {
  return (
    <section id="categories" aria-labelledby="categories-title" className="relative py-16 md:py-20">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <p className="mb-3 flex items-center justify-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold">
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            Curated Departments
            <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
          </p>
          <h2 id="categories-title" className="text-3xl text-ink sm:text-4xl">
            Shop by Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <GlassCard
                tilt
                data-cursor="explore"
                className="group cursor-pointer overflow-hidden !rounded-2xl"
              >
                <button
                  type="button"
                  aria-label={`Browse ${c.name}, ${c.count} pieces`}
                  className="block w-full text-left"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={c.image}
                      alt=""
                      loading="lazy"
                      width={600}
                      height={800}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3.5">
                      <span>
                        <span className="block text-[15px] text-white">
                          {c.name}
                        </span>
                        <span className="block text-[11px] text-white/60">
                          {c.count} pieces
                        </span>
                      </span>
                      <ArrowUpRight
                        size={15}
                        aria-hidden="true"
                        className="mb-1 text-gold-soft opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </div>
                  </div>
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
