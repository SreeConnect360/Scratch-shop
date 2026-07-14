import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Search, Heart, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

const items = [
  { key: "home", label: "Home", Icon: Home, target: "hero" },
  { key: "cart", label: "Cart", Icon: ShoppingBag, target: "best-sellers" },
  { key: "search", label: "Search", Icon: Search, target: null }, // center
  { key: "wishlist", label: "Wishlist", Icon: Heart, target: "trending" },
  { key: "account", label: "Account", Icon: User, target: "footer" },
] as const;

/**
 * Mobile-only full-width glass bottom navigation, flush with the bottom
 * edge (hidden ≥768px). Search sits
 * center in a raised gold pearl; active tab tracked by scroll position.
 * Safe-area aware.
 */
export default function BottomNav() {
  const { cartCount, wishlist, setSearchOpen } = useStore();
  const [active, setActive] = useState<string>("home");

  // map scroll position to the nearest nav destination
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight / 2;
      const pick = (id: string) => {
        const el = document.getElementById(id);
        return el ? Math.abs(el.offsetTop + el.offsetHeight / 2 - y) : Infinity;
      };
      const nearest = items
        .filter((i) => i.target)
        .map((i) => ({ key: i.key, d: pick(i.target!) }))
        .sort((a, b) => a.d - b.d)[0];
      if (nearest) setActive(nearest.key);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const badge = (key: string) =>
    key === "cart" ? cartCount : key === "wishlist" ? wishlist.length : 0;

  return (
    <nav
      aria-label="Mobile navigation"
      className="glass glass-strong fixed inset-x-0 bottom-0 z-[90] border-x-0 border-b-0 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-end justify-between px-2 py-1.5">
        {items.map(({ key, label, Icon, target }) => {
          const isSearch = key === "search";
          const isActive = active === key && !isSearch;
          const count = badge(key);

          if (isSearch) {
            return (
              <button
                key={key}
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="relative z-10 -mt-6 flex h-14 w-14 shrink-0 -translate-y-2 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep text-obsidian shadow-[0_10px_28px_-6px_rgba(200,169,106,0.7)] transition-transform duration-300 active:scale-90"
              >
                <Search size={21} strokeWidth={2} />
              </button>
            );
          }

          return (
            <button
              key={key}
              type="button"
              aria-label={count ? `${label}, ${count} items` : label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                setActive(key);
                if (target)
                  document
                    .getElementById(target)
                    ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={cn(
                "relative flex min-h-[52px] min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl px-2 transition-colors duration-300",
                isActive ? "text-gold" : "text-ink-muted"
              )}
            >
              <span className="relative">
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className={cn(isActive && key === "wishlist" && "fill-gold")}
                />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-obsidian"
                  >
                    {count}
                  </motion.span>
                )}
              </span>
              <span className="text-[9px] tracking-[0.08em] uppercase">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
