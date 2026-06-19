import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";

export const ease = [0.2, 0.7, 0.2, 1] as const;

export function FadeUp({
  children, delay = 0, className, as = "div",
}: { children: ReactNode; delay?: number; className?: string; as?: "div" | "section" | "h1" | "h2" | "p" }) {
  const Comp = (motion as unknown as Record<string, React.ComponentType<MotionProps & { className?: string; children?: ReactNode }>>)[as];
  return (
    <Comp
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CinematicImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <motion.div
      initial={{ scale: 1.08, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.4, ease }}
      className={`overflow-hidden ${className ?? ""}`}
    >
      <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover img-cinematic" />
    </motion.div>
  );
}
