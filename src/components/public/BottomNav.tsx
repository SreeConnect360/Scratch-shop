import { motion } from "framer-motion";
import { Home, ShoppingBag, Search, Heart, User } from "lucide-react";
import { Link, useLocation, useSearch } from "@tanstack/react-router";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  setSearchOpen: (open: boolean) => void;
}

export default function BottomNav({ setSearchOpen }: BottomNavProps) {
  const { state } = usePortal();
  const { shopCount } = useCartTotal();
  const location = useLocation();
  const searchParams = useSearch({ from: "/_shop" }) as any;

  const currentTab = searchParams.tab || "";
  const path = location.pathname;

  // Determine active item based on current route/search params
  let active = "home";
  if (path === "/cart") {
    active = "cart";
  } else if (path === "/account") {
    if (currentTab === "wishlist") {
      active = "wishlist";
    } else {
      active = "account";
    }
  } else if (path === "/") {
    active = "home";
  } else {
    active = ""; // other pages (e.g. categories, search, product)
  }

  const wishlistCount = state.shopWishlist[state.user?.id || ""]?.length || 0;

  const items = [
    { key: "home", label: "Home", Icon: Home, to: "/" },
    { key: "cart", label: "Cart", Icon: ShoppingBag, to: "/cart", badge: shopCount },
    { key: "search", label: "Search", Icon: Search, isAction: true },
    { key: "wishlist", label: "Wishlist", Icon: Heart, to: "/account", search: { tab: "wishlist" }, badge: wishlistCount },
    { key: "account", label: "Account", Icon: User, to: "/account", search: { tab: "profile" } },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-3 bottom-3 z-[90] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="glass glass-strong glass-edge flex items-end justify-between rounded-[1.6rem] px-2 py-1.5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        {items.map((item) => {
          const isSearch = item.key === "search";
          const isActive = active === item.key;
          const count = item.badge || 0;

          if (isSearch) {
            return (
              <button
                key={item.key}
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="relative -mt-6 flex h-14 w-14 shrink-0 -translate-y-2 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep text-obsidian shadow-[0_10px_28px_-6px_rgba(200,169,106,0.7)] transition-transform duration-300 active:scale-90 cursor-pointer"
              >
                <Search size={21} strokeWidth={2} />
              </button>
            );
          }

          const linkProps: any = {
            to: item.to,
          };
          if (item.search) {
            linkProps.search = item.search;
          }

          return (
            <Link
              key={item.key}
              {...linkProps}
              aria-label={count ? `${item.label}, ${count} items` : item.label}
              className={cn(
                "relative flex min-h-[52px] min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl px-2 transition-colors duration-300",
                isActive ? "text-gold" : "text-ink-muted"
              )}
            >
              <span className="relative">
                <item.Icon
                  size={20}
                  strokeWidth={1.8}
                  className={cn(isActive && item.key === "wishlist" && "fill-gold")}
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
              <span className="text-[9px] tracking-[0.08em] uppercase font-semibold">
                {item.label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-dot"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute bottom-1 h-1 w-1 rounded-full bg-gold shadow-[0_0_8px_rgba(200,169,106,0.9)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
