import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/utils";

interface Dot {
  x: number;
  y: number;
  hx: number;
  hy: number;
  r: number;
  a: number;
  vx: number;
  vy: number;
  phase: number;
  depth: number;
}

/**
 * Ambient gold particle field, visible in both themes (deeper gold and
 * higher opacity in light mode). The whole field drifts with the mouse
 * (per-dot depth parallax) and dots near the cursor are gently repelled,
 * easing back home afterwards.
 */
export default function Particles({ count = 38 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };
    // smoothed mouse for the parallax drift
    const smooth = { x: 0, y: 0 };
    const dots: Dot[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    smooth.x = w / 2;
    smooth.y = h / 2;

    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      dots.push({
        x,
        y,
        hx: x,
        hy: y,
        r: 0.8 + Math.random() * 2,
        a: 0.14 + Math.random() * 0.32,
        vx: 0,
        vy: 0,
        phase: Math.random() * Math.PI * 2,
        depth: 0.35 + Math.random() * 0.65, // closer dots parallax more
      });
    }

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    let t = 0;
    const tick = () => {
      t += 0.005;

      // theme-aware color (checked per frame — cheap classList lookup)
      const dark = document.documentElement.classList.contains("dark");
      const rgb = dark ? "200, 169, 106" : "150, 118, 62";
      const alphaBoost = dark ? 1 : 1.35;

      // ease the parallax anchor toward the cursor
      if (mouse.x > -999) {
        smooth.x += (mouse.x - smooth.x) * 0.04;
        smooth.y += (mouse.y - smooth.y) * 0.04;
      }
      const parX = (smooth.x - w / 2) / (w / 2 || 1); // -1..1
      const parY = (smooth.y - h / 2) / (h / 2 || 1);

      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        // orbital drift + mouse-follow parallax (deeper dots move less)
        const driftX =
          d.hx + Math.sin(t + d.phase) * 26 + parX * 34 * d.depth;
        const driftY =
          d.hy + Math.cos(t * 0.8 + d.phase) * 20 + parY * 26 * d.depth;

        // cursor repulsion for nearby dots
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 140 * 140) {
          const dist = Math.sqrt(dist2) || 1;
          const force = ((140 - dist) / 140) * 0.7;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        // spring toward drift target
        d.vx += (driftX - d.x) * 0.012;
        d.vy += (driftY - d.y) * 0.012;
        d.vx *= 0.92;
        d.vy *= 0.92;
        d.x += d.vx;
        d.y += d.vy;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${Math.min(0.55, d.a * alphaBoost)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1]"
    />
  );
}
