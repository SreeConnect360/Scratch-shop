import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { collections } from "@/data/products";
import SectionHeading from "@/components/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";

/** Magazine-style layout: one tall editorial feature + two stacked stories. */
export default function Collections() {
  const [feature, ...rest] = collections;

  const Card = ({
    c,
    tall = false,
    delay = 0,
  }: {
    c: (typeof collections)[number];
    tall?: boolean;
    delay?: number;
  }) => (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="explore"
      className={`group glass glass-reflect relative overflow-hidden rounded-3xl ${
        tall ? "row-span-2 min-h-[26rem] lg:min-h-full" : "min-h-[13rem]"
      }`}
    >
      <img
        src={c.image}
        alt={c.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
      <div className="absolute inset-x-0 bottom-0 z-[2] p-6 lg:p-7">
        <p className="mb-1.5 text-[10.5px] tracking-[0.3em] uppercase text-gold-soft">
          The Collection
        </p>
        <h3 className={`text-white ${tall ? "text-3xl lg:text-4xl" : "text-2xl"}`}>
          {c.name}
        </h3>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-white/70">
          {c.caption}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-gold-soft transition-all duration-300 group-hover:gap-3.5">
          Discover <ArrowRight size={13} aria-hidden="true" />
        </span>
      </div>
    </motion.article>
  );

  return (
    <section
      id="collections"
      aria-labelledby="collections-heading"
      className="relative py-16 md:py-20"
    >
      <div className="section-shell">
        <SectionHeading eyebrow="Editorial" title="The Season's Stories" />
        <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2 lg:gap-5">
          <Card c={feature} tall />
          {rest.map((c, i) => (
            <Card key={c.name} c={c} delay={0.12 * (i + 1)} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <MagneticButton variant="glass">
            View All Collections <ArrowRight size={14} aria-hidden="true" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
