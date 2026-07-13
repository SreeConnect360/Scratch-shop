import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
}

export default function SearchOverlay({ isOpen, onClose, products }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => 
      (p.name || "").toLowerCase().includes(q) || 
      (p.house || "").toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query, products]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      window.open(`/search?q=${encodeURIComponent(query.trim())}`, '_blank');
    }
  };

  const ensureRupees = (val: any) => {
    if (val === undefined || val === null) return "";
    const clean = String(val).trim();
    return clean.startsWith("₹") ? clean : `₹${clean}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-2xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass glass-strong glass-edge w-full max-w-xl rounded-[2rem] p-2 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-4 py-3">
              <Search size={18} className="shrink-0 text-gold" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search luxury fashion curation…"
                aria-label="Search products"
                className="w-full bg-transparent text-lg text-ink placeholder:text-ink-muted/50 focus:outline-none border-none outline-none ring-0 text-foreground"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted hover:text-ink hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </form>

            {query && (
              <ul role="list" className="border-t border-white/10 p-2 space-y-1">
                {results.length === 0 && (
                  <li className="px-4 py-6 text-center text-sm text-ink-muted">
                    Nothing found for “{query}” — try different tags or collections.
                  </li>
                )}
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/product/$productId"
                      params={{ productId: p.id }}
                      onClick={onClose}
                      className="group flex w-full items-center gap-4 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-gold/10"
                    >
                      <img
                        src={p.image}
                        alt=""
                        className="h-[52px] w-[42px] rounded-lg object-cover"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-ink truncate font-medium">{p.name}</span>
                        <span className="block text-xs text-gold font-bold">
                          {ensureRupees(p.price)}
                        </span>
                      </span>
                      <ArrowRight
                        size={15}
                        className="text-gold opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
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
