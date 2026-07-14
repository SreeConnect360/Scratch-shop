import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", target: "hero" },
  { label: "New Arrivals", target: "trending" },
  { label: "Collections", target: "collections" },
  { label: "Trending", target: "trending" },
  { label: "Flash Sale", target: "flash-sale" },
  { label: "Categories", target: "categories" },
  { label: "About", target: "brand-story" },
  { label: "Contact", target: "footer" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

interface IconButtonProps {
  label: string;
  onClick?: () => void;
  badge?: number;
  active?: boolean;
  children: React.ReactNode;
}

function IconButton({ label, onClick, badge, active, children }: IconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      data-cursor="link"
      onClick={onClick}
      whileHover={{ scale: 1.12, rotate: 4 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink",
        active && "text-gold"
      )}
    >
      {children}
      {badge != null && badge > 0 && (
        <motion.span
          key={badge}
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-obsidian"
        >
          {badge}
        </motion.span>
      )}
    </motion.button>
  );
}

/**
 * Full-width Liquid Glass navbar, flush with the top edge: sticky,
 * pointer-lit, with a gliding active
 * indicator, morphing theme toggle, and full mobile drawer.
 */
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, wishlist, setSearchOpen } = useStore();
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // glass highlight follows the cursor across the bar
  const onBarMove = (e: React.MouseEvent) => {
    const el = barRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className="sticky top-0 z-50">
      <motion.nav
        ref={barRef}
        onMouseMove={onBarMove}
        aria-label="Primary"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className={cn(
          "glass glass-reflect w-full border-x-0 border-t-0 transition-shadow duration-500",
          scrolled && "glass-strong shadow-[var(--glass-shadow)]"
        )}
      >
        <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* logo */}
        <a
          href="#hero"
          data-cursor="link"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("hero");
          }}
          className="shrink-0 text-xl tracking-[0.3em] text-ink"
          aria-label="ÉLYSIA home"
        >
          É<span className="gold-text">LYSIA</span>
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-0.5 xl:flex" role="list">
          {links.map((l) => (
            <li key={l.label} className="relative">
              <button
                type="button"
                data-cursor="pill"
                onClick={() => {
                  setActive(l.label);
                  scrollTo(l.target);
                }}
                className={cn(
                  "relative rounded-full px-3 py-2 text-[12.5px] tracking-[0.08em] transition-colors duration-300",
                  active === l.label
                    ? "text-ink"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                {active === l.label && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full border border-gold/25 bg-gold/10 shadow-[0_0_18px_-4px_rgba(200,169,106,0.4)]"
                  />
                )}
                <span className="relative">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* actions */}
        <div className="flex items-center gap-0.5">
          {/* on mobile these live in the bottom nav — show from md up */}
          <span className="hidden md:flex md:items-center md:gap-0.5">
            <IconButton label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={18} strokeWidth={1.8} />
            </IconButton>
            <IconButton
              label={`Wishlist, ${wishlist.length} items`}
              badge={wishlist.length}
              onClick={() => scrollTo("best-sellers")}
            >
              <Heart size={18} strokeWidth={1.8} />
            </IconButton>
            <IconButton
              label={`Shopping bag, ${cartCount} items`}
              badge={cartCount}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
            </IconButton>
            <IconButton label="Account">
              <User size={18} strokeWidth={1.8} />
            </IconButton>
          </span>

          {/* theme toggle — morphing sun/moon */}
          <motion.button
            type="button"
            data-cursor="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 8 }}
            whileTap={{ scale: 0.88 }}
            className="relative ml-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--glass-border)] bg-gold/5 text-gold transition-colors duration-300 hover:bg-gold/15"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ y: 14, opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                exit={{ y: -14, opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex"
              >
                {theme === "dark" ? (
                  <Sun size={17} strokeWidth={1.8} />
                ) : (
                  <Moon size={17} strokeWidth={1.8} />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* mobile menu */}
          <span className="xl:hidden">
            <IconButton
              label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X size={19} strokeWidth={1.8} />
              ) : (
                <Menu size={19} strokeWidth={1.8} />
              )}
            </IconButton>
          </span>
        </div>
        </div>
      </motion.nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass glass-strong absolute inset-x-0 top-full border-x-0 p-3 xl:hidden"
          >
            <ul role="list" className="grid grid-cols-2 gap-1">
              {links.map((l) => (
                <li key={l.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(l.label);
                      setMobileOpen(false);
                      scrollTo(l.target);
                    }}
                    className={cn(
                      "w-full rounded-xl px-4 py-3 text-left text-sm tracking-wide transition-colors",
                      active === l.label
                        ? "bg-gold/10 text-gold"
                        : "text-ink-muted hover:bg-gold/5 hover:text-ink"
                    )}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
