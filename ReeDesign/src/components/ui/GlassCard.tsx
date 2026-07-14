import React, { useCallback, useRef } from "react";
import { cn, isDesktopPointer, prefersReducedMotion } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable 3D tilt toward the cursor (±maxTilt degrees). */
  tilt?: boolean;
  maxTilt?: number;
  children: React.ReactNode;
}

/**
 * Liquid Glass surface. Tracks the pointer to drive a moving light
 * reflection (via --mx/--my consumed by .glass-reflect) and an optional
 * GPU-only 3D tilt. All updates are direct style writes — no re-renders.
 */
export default function GlassCard({
  tilt = false,
  maxTilt = 6,
  className,
  children,
  ...rest
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        if (tilt && isDesktopPointer() && !prefersReducedMotion()) {
          const rx = (0.5 - py) * maxTilt;
          const ry = (px - 0.5) * maxTilt;
          el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
        }
      });
    },
    [tilt, maxTilt]
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    if (tilt)
      el.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  }, [tilt]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "glass glass-reflect glass-edge rounded-3xl transition-transform duration-300 ease-out will-change-transform",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
