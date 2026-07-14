import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

/** Full-screen frosted search. Esc / backdrop closes; results jump to Best Sellers. */
export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const goTo = () => {
    setSearchOpen(false);
    document
      .getElementById("best-sellers")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-[14vh] backdrop-blur-xl"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ y: 24, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass glass-strong glass-edge w-full max-w-xl rounded-3xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <Search size={18} className="shrink-0 text-gold" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search coats, dresses, fragrance…"
                aria-label="Search products"
                className="w-full bg-transparent text-lg text-ink placeholder:text-ink-muted focus:outline-none"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {query && (
              <ul role="list" className="border-t border-[var(--glass-border)] p-2">
                {results.length === 0 && (
                  <li className="px-4 py-6 text-center text-sm text-ink-muted">
                    Nothing found for “{query}” — try “coat” or “silk”.
                  </li>
                )}
                {results.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={goTo}
                      className="group flex w-full items-center gap-4 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-gold/8"
                    >
                      <img
                        src={p.image}
                        alt=""
                        width={44}
                        height={55}
                        loading="lazy"
                        className="h-[52px] w-[42px] rounded-lg object-cover"
                      />
                      <span className="flex-1">
                        <span className="block text-sm text-ink">{p.name}</span>
                        <span className="block text-xs text-gold">
                          {formatPrice(p.price)}
                        </span>
                      </span>
                      <ArrowRight
                        size={15}
                        className="text-ink-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
