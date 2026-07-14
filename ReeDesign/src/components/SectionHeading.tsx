import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}

/** Editorial section header with gold eyebrow rule and blur-reveal entrance. */
export default function SectionHeading({
  eyebrow,
  title,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={centered ? "mb-10 text-center" : "mb-10"}
    >
      <p
        className={`mb-3 flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
        {eyebrow}
        {centered && <span className="h-px w-8 bg-gold/50" aria-hidden="true" />}
      </p>
      <h2 className="text-balance text-3xl text-ink sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
        {title}
      </h2>
    </motion.div>
  );
}
