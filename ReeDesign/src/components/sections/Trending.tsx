import { trendingProducts } from "@/data/products";
import ProductCarousel from "@/components/ProductCarousel";
import SectionHeading from "@/components/SectionHeading";

/** Trending row — 2-up grid on mobile, snap carousel with arrows on desktop. */
export default function Trending() {
  return (
    <section
      id="trending"
      aria-labelledby="trending-heading"
      className="relative py-16 md:py-20"
    >
      <div className="section-shell">
        <SectionHeading eyebrow="This Week" title="Trending Now" />
        <ProductCarousel products={trendingProducts} label="trending products" />
      </div>
    </section>
  );
}
