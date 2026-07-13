import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";

/** Glass confirmation toast for cart adds. aria-live so it never steals focus. */
export default function Toast() {
  const { toast } = useStore();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[110] -translate-x-1/2"
    >
      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ y: 24, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="glass glass-strong glass-edge flex items-center gap-2.5 rounded-full px-5 py-3 text-sm text-ink shadow-[var(--gold-glow)]"
          >
            <ShoppingBag size={15} className="text-gold" aria-hidden="true" />
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
