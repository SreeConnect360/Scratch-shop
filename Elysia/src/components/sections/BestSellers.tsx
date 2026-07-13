import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { bestSellers } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";

/** Luxury 3-column grid of the house icons. */
export default function BestSellers() {
  return (
    <section
      id="best-sellers"
      aria-labelledby="best-sellers-heading"
      className="relative py-16 md:py-20"
    >
      <div className="section-shell">
        <SectionHeading eyebrow="Most Loved" title="Best Sellers" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {bestSellers.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.65,
                delay: (i % 3) * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
        <div className="mt-9 flex justify-center">
          <MagneticButton variant="glass">
            Browse Everything <ArrowRight size={14} aria-hidden="true" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
