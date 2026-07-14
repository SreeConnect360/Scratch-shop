import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn, isDesktopPointer, prefersReducedMotion } from "@/lib/utils";

interface MagneticButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    | "onAnimationStart"
    | "onDragStart"
    | "onDragEnd"
    | "onDrag"
    | "onDragOver"
    | "onDragEnter"
    | "onDragLeave"
    | "onDrop"
  > {
  strength?: number;
  variant?: "gold" | "glass" | "ghost";
  children: React.ReactNode;
}

/**
 * Button that leans toward the cursor (max ~10px) and springs back on leave.
 * Ripple on click; gold / glass / ghost variants share the same glass DNA.
 */
export default function MagneticButton({
  strength = 10,
  variant = "gold",
  className,
  children,
  onClick,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDesktopPointer() || prefersReducedMotion() || !ref.current)
        return;
      const r = ref.current.getBoundingClientRect();
      x.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength);
      y.set(
        ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength
      );
    },
    [strength, x, y]
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = ref.current;
      if (btn) {
        const r = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const d = Math.max(r.width, r.height) * 2;
        ripple.style.cssText = `position:absolute;border-radius:9999px;pointer-events:none;left:${
          e.clientX - r.left - d / 2
        }px;top:${
          e.clientY - r.top - d / 2
        }px;width:${d}px;height:${d}px;background:radial-gradient(circle,rgba(255,255,255,0.35),transparent 60%);transform:scale(0);opacity:1;transition:transform .6s ease,opacity .7s ease;`;
        btn.appendChild(ripple);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            ripple.style.transform = "scale(1)";
            ripple.style.opacity = "0";
          })
        );
        setTimeout(() => ripple.remove(), 750);
      }
      onClick?.(e);
    },
    [onClick]
  );

  const variants = {
    gold: "bg-gradient-to-br from-gold-soft via-gold to-gold-deep text-obsidian shadow-[0_10px_30px_-8px_rgba(200,169,106,0.55)] hover:shadow-[0_16px_44px_-8px_rgba(200,169,106,0.7)]",
    glass:
      "glass glass-reflect text-ink hover:border-gold/40 hover:shadow-[0_0_30px_-6px_rgba(200,169,106,0.35)]",
    ghost:
      "border border-transparent text-ink-muted hover:text-ink hover:border-[var(--glass-border)]",
  };

  return (
    <motion.button
      ref={ref}
      data-cursor="button"
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={cn(
        "relative inline-flex min-h-[44px] items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-semibold tracking-[0.12em] uppercase transition-[box-shadow,border-color,color] duration-300 will-change-transform",
        variants[variant],
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
