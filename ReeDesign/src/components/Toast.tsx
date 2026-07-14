import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { useStore } from "@/context/StoreContext";

/**
 * Floating glass notification, bottom-center. Gold bag icon for cart adds,
 * gold heart for wishlist changes. Sits above the mobile bottom nav.
 * aria-live so it never steals focus.
 */
export default function Toast() {
  const { toast } = useStore();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-24 left-1/2 z-[110] w-full max-w-[92vw] -translate-x-1/2 sm:max-w-md md:bottom-6"
    >
      <AnimatePresence>
        {toast && (
          <motion.p
            key={toast.message}
            initial={{ y: 24, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="glass glass-strong glass-edge mx-auto flex w-fit max-w-full items-center gap-2.5 rounded-full px-5 py-3 text-sm text-ink shadow-[var(--gold-glow)]"
          >
            {toast.kind === "wishlist" ? (
              <Heart
                size={15}
                className="shrink-0 fill-gold text-gold"
                aria-hidden="true"
              />
            ) : (
              <ShoppingBag
                size={15}
                className="shrink-0 text-gold"
                aria-hidden="true"
              />
            )}
            <span className="truncate">{toast.message}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
