import { motion } from "framer-motion";
import { trendingProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";

/** Premium 4-up trending row with staggered blur reveal. */
export default function Trending() {
  return (
    <section
      id="trending"
      aria-labelledby="trending-heading"
      className="relative py-16 md:py-20"
    >
      <div className="section-shell">
        <SectionHeading eyebrow="This Week" title="Trending Now" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {trendingProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
