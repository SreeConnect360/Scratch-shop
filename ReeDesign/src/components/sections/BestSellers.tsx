import { ArrowRight } from "lucide-react";
import { bestSellers } from "@/data/products";
import ProductCarousel from "@/components/ProductCarousel";
import SectionHeading from "@/components/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";

/** House icons — 2-up grid on mobile, 3-up snap carousel on desktop. */
export default function BestSellers() {
  return (
    <section
      id="best-sellers"
      aria-labelledby="best-sellers-heading"
      className="relative py-16 md:py-20"
    >
      <div className="section-shell">
        <SectionHeading eyebrow="Most Loved" title="Best Sellers" />
        <ProductCarousel
          products={bestSellers}
          perView={3}
          label="best sellers"
        />
        <div className="mt-9 flex justify-center">
          <MagneticButton variant="glass">
            Browse Everything <ArrowRight size={14} aria-hidden="true" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
