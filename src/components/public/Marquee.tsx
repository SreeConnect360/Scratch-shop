import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Edge-to-edge auto-scrolling marquee, no JS animation.
export function Marquee({ children, speed = 40 }: { children: ReactNode; speed?: number }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        <div className="flex gap-16">{children}</div>
        <div className="flex gap-16" aria-hidden>{children}</div>
      </motion.div>
    </div>
  );
}
