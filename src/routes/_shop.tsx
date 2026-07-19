import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect, useRef, createContext, useContext, useMemo } from "react";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { Search, Heart, ShoppingBag, Bell, Sun, Moon, ArrowRight, User, X, Minus, Plus, Menu } from "lucide-react";
import { BrandLogo, ThemeToggle } from "@/components/theme/ThemeToggle";
import { toast } from "sonner";
import AssistantLauncher from "@/components/ai-assistant/AssistantLauncher";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import SearchOverlay from "@/components/public/SearchOverlay";
import Particles from "@/components/public/Particles";
import BottomNav from "@/components/public/BottomNav";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export interface QuickAddContextType {
  openQuickAdd: (product: any) => void;
}
export const QuickAddContext = createContext<QuickAddContextType | null>(null);

export function useQuickAdd() {
  const ctx = useContext(QuickAddContext);
  if (!ctx) throw new Error("useQuickAdd must be used inside QuickAddProvider");
  return ctx;
}

export interface ShopNotificationContextType {
  triggerPopup: (message: string, undo: () => void, undoMessage: string, redo: () => void, redoMessage: string) => void;
}
export const ShopNotificationContext = createContext<ShopNotificationContextType | null>(null);

export function useShopNotification() {
  const ctx = useContext(ShopNotificationContext);
  if (!ctx) throw new Error("useShopNotification must be used inside ShopNotificationProvider");
  return ctx;
}

export function LiveCountdown({ endsAt, onComplete }: { endsAt: string; onComplete?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const onCompleteRef = useRef(onComplete);
  const hasCompleted = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(endsAt).getTime();
      if (isNaN(target)) {
        setTimeLeft("");
        return;
      }
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft("00H 00M 00S");
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onCompleteRef.current?.();
        }
        return;
      }

      const totalSecs = Math.floor(diff / 1000);
      const days = Math.floor(totalSecs / (3600 * 24));
      const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      const pad = (num: number) => String(num).padStart(2, "0");
      let formatted = "";
      if (days > 0) {
        formatted += `${days}D `;
      }
      formatted += `${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`;
      setTimeLeft(formatted);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (!timeLeft) return null;

  return <span className="ml-3 font-mono bg-black/20 px-2.5 py-0.5 rounded text-[9px]">{timeLeft}</span>;
}

export const Route = createFileRoute("/_shop")({
  component: ShopLayout,
});

function ShopLayout() {
  const { state, toggleShopWishlist, removeFromShopCart, updateHomepageLayout, updateHomepageLayoutDraft, addToShopCart, markNotificationsRead, dismissNotification } = usePortal();
  const { shopCount, shopTotal } = useCartTotal();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const isProductPage = location.pathname.includes("/product/");

  const [quickAddProduct, setQuickAddProduct] = useState<any | null>(null);
  const [activeFooterPopup, setActiveFooterPopup] = useState<'about' | 'returns' | 'privacy' | 'terms' | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const barRef = useRef<HTMLElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 24);
      
      if (currentScrollY <= 10) {
        setShowNavbar(true);
      } else {
        if (isProductPage) {
          if (currentScrollY > lastScrollY) {
            setShowNavbar(false);
          }
        } else {
          if (currentScrollY > lastScrollY) {
            setShowNavbar(false);
          } else {
            setShowNavbar(true);
          }
        }
      }
      lastScrollY = currentScrollY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isProductPage]);

  const onBarMove = (e: React.MouseEvent) => {
    const el = barRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  // Mouse Interaction States
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 350, mass: 0.3 };
  const ringSpringConfig = { damping: 25, stiffness: 150, mass: 0.6 };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const ringXSpring = useSpring(ringX, ringSpringConfig);
  const ringYSpring = useSpring(ringY, ringSpringConfig);

  const [cursorType, setCursorType] = useState<"default" | "hover" | "view" | "explore" | "pill">("default");
  const [cursorText, setCursorText] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // Event delegation for cursor types
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const magneticBtn = target.closest(".magnetic-btn");
      if (magneticBtn) {
        setCursorType("hover");
        return;
      }

      const button = target.closest("button, a, input, select, textarea, [role='button']");
      if (button) {
        if (button.classList.contains("nav-link") || button.closest("nav")) {
          setCursorType("pill");
        } else if (button.closest(".product-card-hover") || button.classList.contains("product-card-link")) {
          setCursorType("view");
          setCursorText("View");
        } else {
          setCursorType("hover");
        }
        return;
      }

      const img = target.closest("img, .explore-img");
      if (img) {
        setCursorType("explore");
        setCursorText("Explore");
        return;
      }

      setCursorType("default");
    };

    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, [isTouchDevice]);

  // Magnetic button physics
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const magneticElements = document.querySelectorAll(".magnetic-btn");
      magneticElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elX = rect.left + rect.width / 2;
        const elY = rect.top + rect.height / 2;

        const distX = e.clientX - elX;
        const distY = e.clientY - elY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 75) {
          const strength = 0.2;
          const x = distX * strength;
          const y = distY * strength;
          (el as HTMLElement).style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.05)`;
          (el as HTMLElement).style.transition = "transform 0.1s ease-out";
        } else {
          (el as HTMLElement).style.transform = "";
          (el as HTMLElement).style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouchDevice]);

  // Glass moving light reflections
  useEffect(() => {
    const handleGlassReflection = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".glass-shine-container");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        (card as HTMLElement).style.setProperty("--mouse-x", `${x}%`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${y}%`);
      });
    };
    window.addEventListener("mousemove", handleGlassReflection);
    return () => window.removeEventListener("mousemove", handleGlassReflection);
  }, []);

  const [popup, setPopup] = useState<{
    visible: boolean;
    message: string;
    undo: () => void;
    undoMessage: string;
    redo: () => void;
    redoMessage: string;
    isUndoState: boolean;
  }>({
    visible: false,
    message: "",
    undo: () => {},
    undoMessage: "",
    redo: () => {},
    redoMessage: "",
    isUndoState: false,
  });

  const popupTimerRef = useRef<any>(null);

  const triggerPopup = (message: string, undo: () => void, undoMessage: string, redo: () => void, redoMessage: string) => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    setPopup({
      visible: true,
      message,
      undo,
      undoMessage,
      redo,
      redoMessage,
      isUndoState: false,
    });
    popupTimerRef.current = setTimeout(() => {
      setPopup(prev => ({ ...prev, visible: false }));
    }, 2000);
  };

  const handleUndoClick = () => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popup.undo();
    setPopup(prev => ({
      ...prev,
      message: prev.undoMessage,
      isUndoState: true,
    }));
    popupTimerRef.current = setTimeout(() => {
      setPopup(prev => ({ ...prev, visible: false }));
    }, 2000);
  };

  const handleRedoClick = () => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popup.redo();
    setPopup(prev => ({
      ...prev,
      message: prev.redoMessage,
      isUndoState: false,
    }));
    popupTimerRef.current = setTimeout(() => {
      setPopup(prev => ({ ...prev, visible: false }));
    }, 2000);
  };

  const openQuickAdd = (product: any) => {
    setQuickAddProduct(product);
  };

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Suggested keywords
  const trendingSearches = ["Corset", "Cashmere", "Trousers", "Linen", "Maison", "Atelier"];

  // Filter products by autocomplete
  const products = (state.products || []).filter(p => !p.status || p.status === "PUBLISHED" || p.status === "published");
  const suggestions = searchQuery.trim()
    ? products.filter(p => (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (p.house || "").toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      window.open(`/search?q=${encodeURIComponent(searchQuery.trim())}`, '_blank');
    }
  };

  // User notifications & wishlist count
  const user = state.user;
  const unreadNotifCount = state.notifications.filter(n => n.unread).length;

  const twoDaysMs = 2 * 24 * 3600 * 1000;
  const visibleNotifications = (state.notifications || []).filter(n => {
    if (n.createdAt) {
      return Date.now() - n.createdAt < twoDaysMs;
    }
    const lowerTime = (n.time || "").toLowerCase();
    if (lowerTime.includes("3d") || lowerTime.includes("4d") || lowerTime.includes("5d") || lowerTime.includes("2 days") || lowerTime.includes("3 days")) {
      return false;
    }
    return true;
  });

  // Retrieve dynamic homepage layout config
  const isPreview = typeof window !== "undefined" && window.location.search.includes("preview=true");
  const layout = isPreview ? state.homepageLayoutDraft : state.homepageLayout;

  return (
    <QuickAddContext.Provider value={{ openQuickAdd }}>
      <ShopNotificationContext.Provider value={{ triggerPopup }}>
      <div className="shop-portal-layout min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
        
        {/* 1. DYNAMIC ANNOUNCEMENT BAR */}
        {isHomepage && layout?.announcement?.enabled && !scrolled && (
          <div
            style={{ backgroundColor: layout.announcement.backgroundColor }}
            className="w-full text-center py-2.5 text-[10px] font-semibold tracking-widest uppercase text-white animate-in slide-in-from-top-2 duration-300 sticky top-0 z-50"
          >
            <Link to={layout.announcement.linkUrl} className="hover:underline">
              {layout.announcement.text}
            </Link>
            {layout.announcement.countdownActive && (
              <LiveCountdown
                endsAt={layout.announcement.countdownEndsAt}
                onComplete={() => {
                  if (isPreview) {
                    updateHomepageLayoutDraft({
                      announcement: {
                        ...layout.announcement,
                        enabled: false
                      }
                    });
                  } else {
                    updateHomepageLayout({
                      announcement: {
                        ...layout.announcement,
                        enabled: false
                      }
                    });
                  }
                }}
              />
            )}
          </div>
        )}

        <Particles />
        <BottomNav setSearchOpen={setSearchOpen} />
        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} products={products} />

        {/* Premium Full-Width Liquid Glass Header (flush top, left, right) */}
        <div className={cn(
          "sticky top-0 z-50 transition-all duration-500 ease-in-out w-full",
          isProductPage && !showNavbar && "-translate-y-28 opacity-0 pointer-events-none"
        )}>
          <header
            ref={barRef}
            onMouseMove={onBarMove}
            className={cn(
              "glass glass-reflect flex w-full items-center justify-between gap-2 px-4 py-2.5 transition-shadow duration-500 sm:px-6 h-16 md:h-20 !border-x-0 !border-t-0 border-b border-white/10",
              scrolled && "glass-strong shadow-[var(--glass-shadow-hover)]"
            )}
          >
            {/* Logo */}
            <div className="flex items-center gap-10 z-10">
              {layout?.navigation?.visibleItems?.includes("Logo") !== false && (
                <Link to="/" className="block transition-transform shrink-0 text-xl tracking-[0.3em] text-ink font-serif hover:opacity-90">
                  S<span className="gold-text">REEVIBES</span>
                  <div className="text-[7px] uppercase tracking-[0.25em] text-muted-foreground mt-1">House of Fashion</div>
                </Link>
              )}

              {/* desktop links */}
              <ul className="hidden items-center gap-0.5 md:flex" role="list">
                {layout?.navigation?.itemsOrder ? (
                  layout.navigation.itemsOrder.map((item: string) => {
                    const isVisible = layout?.navigation?.visibleItems?.includes(item);
                    if (!isVisible || item === "Logo" || ["Search", "Wishlist", "Account", "Cart"].includes(item)) return null;

                    if (item === "Men") return null;

                    const searchParams = location.search as any;

                    if (item === "Women") {
                      const isActive = location.pathname === "/categories" && !searchParams?.view && !searchParams?.tag;
                      return (
                        <li key={item} className="relative">
                          <Link
                            to="/categories"
                            className="relative rounded-full px-3 py-1.5 text-[15px] tracking-[0.08em] font-semibold transition-colors duration-300 outline-none focus:outline-none focus-visible:outline-none"
                          >
                            <span className={isActive ? "text-gold" : "text-ink-muted hover:text-ink"}>
                              Fashion
                            </span>
                          </Link>
                        </li>
                      );
                    }

                    if (item === "Collections") {
                      const isActive = location.pathname === "/categories" && searchParams?.view === "collections";
                      return (
                        <li key={item} className="relative">
                          <Link
                            to="/categories"
                            search={{ view: "collections" } as any}
                            className="relative rounded-full px-3 py-1.5 text-[15px] tracking-[0.08em] font-semibold transition-colors duration-300 outline-none focus:outline-none focus-visible:outline-none"
                          >
                            <span className={isActive ? "text-gold" : "text-ink-muted hover:text-ink"}>
                              Collections
                            </span>
                          </Link>
                        </li>
                      );
                    }

                    let linkSearch: any = {};
                    if (item === "New Arrivals") linkSearch = { tag: "New" };
                    else if (item === "Trending") linkSearch = { tag: "Trending" };

                    const label = item === "New Arrivals" ? "New" : item;
                    const isActive = item === "New Arrivals"
                      ? (location.pathname === "/categories" && searchParams?.tag === "New")
                      : (item === "Trending"
                        ? (location.pathname === "/categories" && searchParams?.tag === "Trending")
                        : false);

                    return (
                      <li key={item} className="relative">
                        <Link
                          to="/categories"
                          search={linkSearch}
                          className="relative rounded-full px-3 py-1.5 text-[15px] tracking-[0.08em] font-semibold transition-colors duration-300 outline-none focus:outline-none focus-visible:outline-none"
                        >
                          <span className={isActive ? "text-gold" : "text-ink-muted hover:text-ink"}>
                            {label}
                          </span>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <>
                    <li className="relative">
                      <Link to="/" className="relative rounded-full px-3 py-1.5 text-[15px] tracking-[0.08em] font-semibold transition-colors outline-none focus:outline-none focus-visible:outline-none">
                        {({ isActive }) => (
                          <span className={isActive ? "text-gold" : "text-ink-muted hover:text-ink"}>
                            Shop
                          </span>
                        )}
                      </Link>
                    </li>
                    <li className="relative">
                      <Link to="/categories" className="relative rounded-full px-3 py-1.5 text-[15px] tracking-[0.08em] font-semibold transition-colors outline-none focus:outline-none focus-visible:outline-none">
                        {({ isActive }) => (
                          <span className={isActive ? "text-gold" : "text-ink-muted hover:text-ink"}>
                            Collections
                          </span>
                        )}
                      </Link>
                    </li>
                    <li className="relative">
                      <Link to="/FashionBattle/live-contest" className="relative rounded-full px-3 py-1.5 text-[15px] tracking-[0.08em] font-semibold transition-colors outline-none focus:outline-none focus-visible:outline-none">
                        {({ isActive }) => (
                          <span className={isActive ? "text-gold" : "text-ink-muted hover:text-ink"}>
                            Contests
                          </span>
                        )}
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 z-10">
              <motion.button
                type="button"
                onClick={() => setSearchOpen(true)}
                whileHover={{ scale: 1.12, rotate: 4 }}
                whileTap={{ scale: 0.9 }}
                className="relative hidden md:flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink cursor-pointer"
              >
                <Search size={18} strokeWidth={1.8} />
              </motion.button>

              <Link to="/account" search={{ tab: "wishlist" as any }} className="hidden md:block">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.12, rotate: 4 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink cursor-pointer"
                >
                  <Heart size={18} strokeWidth={1.8} />
                </motion.button>
              </Link>

              <Link to="/cart" className="hidden md:block">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.12, rotate: 4 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink cursor-pointer"
                >
                  <ShoppingBag size={18} strokeWidth={1.8} />
                  {shopCount > 0 && (
                    <motion.span
                      key={shopCount}
                      initial={{ scale: 0.4 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
                      className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-obsidian"
                    >
                      {shopCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {(!layout || !layout.navigation || !layout.navigation.visibleItems || layout.navigation.visibleItems.includes("Account")) && (
                <div className="relative group py-2 hidden md:block">
                  <Link to="/account" search={{ tab: "profile" }}>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.12, rotate: 4 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink cursor-pointer"
                    >
                      <User size={18} strokeWidth={1.8} />
                    </motion.button>
                  </Link>
                  {/* Dropdown Menu */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-52 bg-background/95 backdrop-blur-xl border border-accent/20 rounded-3xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[110] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                    <div className="space-y-1.5">
                      {[
                        { tab: "profile", label: "Profile" },
                        { tab: "orders", label: "My Orders" },
                        { tab: "wishlist", label: "Wishlist Curation" },
                        { tab: "coupons", label: "Maison Coupons" },
                        { tab: "addresses", label: "Address" },
                        { tab: "returns", label: "Returns & Refunds" },
                        { tab: "wallet", label: "Wallet" },
                      ].map((item) => (
                        <Link
                          key={item.tab}
                          to="/account"
                          search={{ tab: item.tab as any }}
                          className="block text-[11px] uppercase tracking-wider font-bold px-3 py-2 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={notifRef} className="relative group py-2 hidden md:block" onMouseEnter={markNotificationsRead}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.12, rotate: 4 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink cursor-pointer focus:outline-none animate-in"
                >
                  <Bell size={18} strokeWidth={1.8} />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
                  )}
                </motion.button>

                <div className="absolute right-0 top-full mt-1 w-80 bg-background/95 backdrop-blur-xl border border-accent/20 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[110] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                  <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-3 mb-3">
                    <h4 className="font-serif text-sm font-semibold text-foreground">Notifications</h4>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {visibleNotifications.length === 0 ? (
                      <div className="text-[11px] text-muted-foreground text-center py-4">No recent notifications.</div>
                    ) : (
                      visibleNotifications.map((n) => (
                        <div key={n.id} className="relative p-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl flex items-start gap-2.5 group">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-foreground leading-snug">{n.title}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{n.body}</div>
                            <div className="text-[8px] text-accent/70 mt-1 font-mono">{n.time}</div>
                          </div>
                          <button
                            onClick={() => dismissNotification(n.id)}
                            className="text-muted-foreground hover:text-rose-400 p-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                            title="Dismiss notification"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* theme toggle — morphing sun/moon */}
              <motion.button
                type="button"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                onClick={toggleTheme}
                whileHover={{ scale: 1.1, rotate: 8 }}
                whileTap={{ scale: 0.88 }}
                className="relative ml-1 hidden md:flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--glass-border)] bg-gold/5 text-gold transition-colors duration-300 hover:bg-gold/15 cursor-pointer"
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

              {/* Mobile quick actions: search + cart + menu */}
              <motion.button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                whileTap={{ scale: 0.9 }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink cursor-pointer md:hidden"
              >
                <Search size={18} strokeWidth={1.8} />
              </motion.button>

              {/* Mobile Drawer Trigger */}
              <span className="md:hidden">
                <motion.button
                  type="button"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMobileOpen((v) => !v)}
                  whileHover={{ scale: 1.12, rotate: 4 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink cursor-pointer"
                >
                  {mobileOpen ? <X size={19} strokeWidth={1.8} /> : <Menu size={19} strokeWidth={1.8} />}
                </motion.button>
              </span>
            </div>
          </header>

          {/* mobile drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="glass glass-strong absolute left-3 right-3 top-full mt-2 rounded-2xl p-3 md:hidden border border-white/10 z-[200] shadow-2xl"
              >
                <ul role="list" className="flex flex-col gap-1">
                  <li>
                    <Link
                      to="/categories"
                      onClick={() => setMobileOpen(false)}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm tracking-wide font-semibold transition-colors text-ink-muted hover:bg-gold/5 hover:text-ink block cursor-pointer"
                    >
                      Fashion
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories"
                      search={{ tag: "New" } as any}
                      onClick={() => setMobileOpen(false)}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm tracking-wide font-semibold transition-colors text-ink-muted hover:bg-gold/5 hover:text-ink block cursor-pointer"
                    >
                      New
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories"
                      search={{ tag: "Trending" } as any}
                      onClick={() => setMobileOpen(false)}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm tracking-wide font-semibold transition-colors text-ink-muted hover:bg-gold/5 hover:text-ink block cursor-pointer"
                    >
                      Trending
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories"
                      search={{ view: "collections" } as any}
                      onClick={() => setMobileOpen(false)}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm tracking-wide font-semibold transition-colors text-ink-muted hover:bg-gold/5 hover:text-ink block cursor-pointer"
                    >
                      Collections
                    </Link>
                  </li>
                </ul>

                <div className="gold-hairline my-2" />

                <ul role="list" className="flex flex-col gap-1">
                  <li>
                    <Link
                      to="/account"
                      search={{ tab: "profile" } as any}
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm tracking-wide font-semibold transition-colors text-ink-muted hover:bg-gold/5 hover:text-ink cursor-pointer"
                    >
                      <User size={16} strokeWidth={1.8} className="text-gold" />
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/account"
                      search={{ tab: "orders" } as any}
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm tracking-wide font-semibold transition-colors text-ink-muted hover:bg-gold/5 hover:text-ink cursor-pointer"
                    >
                      <ShoppingBag size={16} strokeWidth={1.8} className="text-gold" />
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/account"
                      search={{ tab: "wishlist" } as any}
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm tracking-wide font-semibold transition-colors text-ink-muted hover:bg-gold/5 hover:text-ink cursor-pointer"
                    >
                      <Heart size={16} strokeWidth={1.8} className="text-gold" />
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm tracking-wide font-semibold transition-colors text-ink-muted hover:bg-gold/5 hover:text-ink cursor-pointer"
                    >
                      {theme === "dark" ? (
                        <Sun size={16} strokeWidth={1.8} className="text-gold" />
                      ) : (
                        <Moon size={16} strokeWidth={1.8} className="text-gold" />
                      )}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Outlet */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Luxury Footer */}
        {(!layout || layout.footer?.enabled !== false) ? (
          <footer className="relative z-10 pb-16 pt-8 max-w-7xl mx-auto w-full px-3 sm:px-5">
            <div className="glass glass-reflect glass-edge rounded-[2rem] px-7 py-10 sm:px-10 lg:px-14 border border-white/10 shadow-[var(--glass-shadow)]">
              <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                <div className="space-y-3">
                  <div className="text-xl tracking-[0.3em] text-ink font-serif hover:opacity-90 transition-opacity">
                    R<span className="gold-text">EEVIBES</span>
                  </div>
                  <p className="leading-relaxed text-xs text-muted-foreground">{layout?.footer?.aboutText || "ReeVibes is a high-fidelity luxury e-commerce experience designed for global styling curators."}</p>
                </div>
                <div className="space-y-3">
                  <div className="text-foreground font-semibold uppercase tracking-wider text-xs">Quick Links</div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setActiveFooterPopup('about')} className="hover:text-accent transition-colors text-left font-semibold cursor-pointer bg-transparent border-none p-0 outline-none text-xs text-muted-foreground">About Us</button>
                    <button onClick={() => setActiveFooterPopup('returns')} className="hover:text-accent transition-colors text-left font-semibold cursor-pointer bg-transparent border-none p-0 outline-none text-xs text-muted-foreground">Returns & Exchanges</button>
                    <button onClick={() => setActiveFooterPopup('privacy')} className="hover:text-accent transition-colors text-left font-semibold cursor-pointer bg-transparent border-none p-0 outline-none text-xs text-muted-foreground">Privacy Policy</button>
                    <button onClick={() => setActiveFooterPopup('terms')} className="hover:text-accent transition-colors text-left font-semibold cursor-pointer bg-transparent border-none p-0 outline-none text-xs text-muted-foreground">Terms of Service</button>
                  </div>
                </div>
                <div className="space-y-3 font-mono text-[11px] text-muted-foreground">
                  <div className="text-foreground font-serif font-semibold uppercase tracking-wider not-mono text-xs">Concierge Desk</div>
                  <div>Phone: {layout?.footer?.phone || "+91 98765 43210"}</div>
                  <div>Email: {layout?.footer?.email || "concierge@reevibes.com"}</div>
                  <div className="not-mono text-xs mt-2">{layout?.footer?.address || "UB City, Level 14, Bangalore, Karnataka - 560001"}</div>
                </div>
              </div>
              <div className="border-t border-white/10 mt-8 pt-6 text-center text-[10px] text-muted-foreground">
                © 2026 ReeVibes. Designed by Google DeepMind Team. All Rights Reserved.
              </div>
            </div>
          </footer>
        ) : (
          <footer className="relative z-10 pb-8 pt-4 text-center text-[10px] text-muted-foreground">
            © 2026 ReeVibes. Designed by Google DeepMind Team. All Rights Reserved.
          </footer>
        )}
      </div>

      {quickAddProduct && (
        <QuickAddModal
          product={quickAddProduct}
          onClose={() => setQuickAddProduct(null)}
          addToShopCart={addToShopCart}
        />
      )}

      {activeFooterPopup && (
        <FooterPopupModal
          type={activeFooterPopup}
          onClose={() => setActiveFooterPopup(null)}
        />
      )}

      {/* Floating Bottom Popup */}
      {popup.visible && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="liquid-glass border border-white/20 bg-black/95 text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl">
            <span className="text-xs font-semibold">{popup.message}</span>
            <div className="h-4 w-px bg-white/20" />
            {popup.isUndoState ? (
              <button
                onClick={handleRedoClick}
                className="text-xs font-bold text-accent hover:text-white uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                Redo
              </button>
            ) : (
              <button
                onClick={handleUndoClick}
                className="text-xs font-bold text-accent hover:text-white uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                Undo
              </button>
            )}
          </div>
        </div>
      )}

      {(!layout || layout.chatbot?.enabled !== false) && <AssistantLauncher />}
      
      </ShopNotificationContext.Provider>
    </QuickAddContext.Provider>
  );
}

function FooterPopupModal({
  type,
  onClose
}: {
  type: 'about' | 'returns' | 'privacy' | 'terms';
  onClose: () => void;
}) {
  const contentMap = {
    about: {
      title: "About Maison ReeVibes",
      subtitle: "ESTABLISHED 2024 · BENGALURU",
      body: "Maison ReeVibes represents the zenith of high-fidelity luxury digital curations. Founded in 2024, our platform bridges the gap between avant-garde runway styling and digital-first pageantry. We curate works from top-tier fashion designers, independent couturiers, and global styling visionaries. Our mission is to democratize high fashion while preserving its pristine artisanal excellence."
    },
    returns: {
      title: "Returns & Exchanges Curation",
      subtitle: "CONCIERGE EXCHANGE POLICY",
      body: "We offer a 14-day complimentary returns concierge service for all unworn, tag-intact garments. To initiate a return, navigate to your Account Portal, select Order History, and request a return. A courier concierge will be scheduled for home pick-up within 48 hours. Refunds are credited directly to your ReeVibes Wallet or original payment method upon standard quality inspections."
    },
    privacy: {
      title: "Privacy & Data Protection",
      subtitle: "SECURE LUXURY TRANSACTION GUARANTEE",
      body: "Maison ReeVibes respects your absolute privacy. All transactions are routed through bank-grade SSL encryption and secure payment gateways. We store only necessary address credentials to optimize your delivery logistics. Your style preferences and viewing histories are parsed exclusively to customize your digital styling feed and are never shared with external advertisers."
    },
    terms: {
      title: "Terms of Couture Service",
      subtitle: "USER ENGAGEMENT & AGREEMENT",
      body: "By accessing Maison ReeVibes, you agree to engage with our portal in accordance with luxury retail etiquettes. All products listed are subject to size-limited availability. Intellectual assets, editorial images, and design configurations remain the exclusive property of Maison ReeVibes. We reserve the right to moderate reviews, adjust member tiers, and suspend accounts failing validation protocols."
    }
  };

  const current = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden liquid-glass bg-background/90 border border-accent/40 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.25)] p-8 text-foreground animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-accent transition-colors rounded-full bg-foreground/5 hover:bg-foreground/10 border border-accent/25"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
              {current.subtitle}
            </span>
            <h3 className="font-serif text-3xl mt-2 text-foreground font-bold tracking-wide border-b border-accent/20 pb-4">
              {current.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-sans mt-4">
            {current.body}
          </p>
          <div className="pt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-accent text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent-foreground transition-all duration-300 shadow-[0_0_12px_rgba(212,175,55,0.3)] border border-accent/20 cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAddModal({
  product,
  onClose,
  addToShopCart
}: {
  product: any;
  onClose: () => void;
  addToShopCart: any;
}) {
  const { removeFromShopCart } = usePortal();
  const { triggerPopup } = useShopNotification();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);

  const availableSizes = product.sizes || ["S", "M", "L", "XL"];
  const stockPerSize = product.stockPerSize || { S: 5, M: 8, L: 4, XL: 2 };

  const handleAdd = () => {
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    const item = {
      productId: product.id,
      name: product.name,
      house: product.house,
      price: product.price,
      image: product.image,
      selectedSize,
      qty
    };
    addToShopCart(item);
    triggerPopup(
      `${product.name} (${selectedSize} x ${qty}) added to cart!`,
      () => removeFromShopCart(product.id, selectedSize),
      `${product.name} (${selectedSize}) removed from cart.`,
      () => addToShopCart(item),
      `${product.name} (${selectedSize}) added to cart!`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-[92%] sm:w-[95%] max-w-lg max-h-[90vh] md:max-h-none overflow-hidden bg-background/95 border border-border-subtle rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 text-foreground animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-foreground/5 hover:bg-foreground/10 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-0">
          <div className="flex gap-4 md:gap-6 items-start">
            {/* Image */}
            <div className="w-20 sm:w-24 md:w-1/3 aspect-[3/4] bg-foreground/5 rounded-2xl overflow-hidden border border-border-subtle/50 shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 pr-6">
              <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">
                {product.house}
              </span>
              <h3 className="font-serif text-base sm:text-lg md:text-xl mt-1 text-foreground font-medium leading-tight">
                {product.name}
              </h3>
              <p className="text-accent font-semibold text-sm sm:text-base mt-1">{product.price}</p>
            </div>
          </div>

          <div className="space-y-4 mt-5">
            {/* Size Selector */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
                Select Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size: string) => {
                  const stock = stockPerSize[size] ?? 0;
                  const hasStock = stock > 0;
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      disabled={!hasStock}
                      onClick={() => setSelectedSize(size)}
                      className={`text-xs min-w-[42px] h-9 font-bold rounded-full transition-all duration-200 flex items-center justify-center px-3 ${
                        !hasStock
                          ? "opacity-30 bg-foreground/5 line-through text-muted-foreground cursor-not-allowed border border-transparent"
                          : isSelected
                          ? "bg-accent text-white border border-accent shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                          : "bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border-subtle"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
                Quantity:
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border-subtle rounded-full bg-foreground/5 p-1">
                  <button
                    onClick={() => setQty(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors rounded-full hover:bg-foreground/5"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold">{qty}</span>
                  <button
                    onClick={() => {
                      const maxStock = selectedSize ? (stockPerSize[selectedSize] ?? 10) : 10;
                      setQty(prev => Math.min(maxStock, prev + 1));
                    }}
                    className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors rounded-full hover:bg-foreground/5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {selectedSize && (
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {stockPerSize[selectedSize] ?? 0} items available
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Add to Cart Button */}
        <div className="mt-5 pt-4 border-t border-border-subtle shrink-0">
          <button
            onClick={handleAdd}
            disabled={!selectedSize}
            className={`w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-full transition-all duration-300 shadow-md ${
              selectedSize
                ? "bg-foreground text-background hover:bg-accent hover:text-white cursor-pointer"
                : "bg-foreground/10 text-muted-foreground/50 cursor-not-allowed opacity-50"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

