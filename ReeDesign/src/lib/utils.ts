import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fine-pointer desktop check — gates cursor/tilt/magnetic effects. */
export function isDesktopPointer() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches
  );
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export const formatPrice = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
