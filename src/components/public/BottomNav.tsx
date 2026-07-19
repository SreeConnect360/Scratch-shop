import { Home, ShoppingBag, Search, Heart, User } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  setSearchOpen: (open: boolean) => void;
}

export default function BottomNav({ setSearchOpen }: BottomNavProps) {
  const { state } = usePortal();
  const { shopCount } = useCartTotal();
  const location = useLocation();

  // Read `tab` from the fully-resolved location search — reading it from the
  // /_shop layout route misses params validated by child routes (the wishlist
  // tab never highlighted because of that).
  const currentTab = (location.search as any)?.tab || "";
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
      className="glass-dock fixed inset-x-0 bottom-0 z-[90] w-full md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-stretch justify-around px-1.5 h-[62px]">
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
                className="relative flex min-w-[52px] items-center justify-center cursor-pointer -translate-y-4 transition-transform duration-200 active:scale-90"
              >
                {/* Glow behind search button */}
                <span aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[54px] w-[54px] bg-gold/25 rounded-full blur-md" />
                {/* Circular Gold Button — gold bg + dark glyph reads correctly on both themes */}
                <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep text-obsidian ring-4 ring-[var(--color-background)] shadow-[0_6px_16px_rgba(0,0,0,0.28),0_0_18px_rgba(200,169,106,0.38)]">
                  <Search size={22} strokeWidth={2.2} />
                </span>
              </button>
            );
          }

          const innerContent = (
            <span className="relative flex flex-col items-center justify-center gap-0.5">
              <motion.span
                animate={{ scale: isActive ? 1.22 : 1, y: isActive ? -1.5 : 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 17 }}
                className="relative flex h-8 w-8 items-center justify-center"
              >
                <item.Icon
                  size={22}
                  strokeWidth={isActive ? 2.1 : 1.7}
                  className={cn(
                    "relative transition-colors duration-300",
                    isActive ? "text-gold" : "text-ink-muted"
                  )}
                />
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-obsidian shadow-[0_2px_5px_rgba(0,0,0,0.35)]">
                    {count}
                  </span>
                )}
              </motion.span>
              <span
                className={cn(
                  "text-[8.5px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
                  isActive ? "text-gold" : "text-ink-muted/80"
                )}
              >
                {item.label}
              </span>
            </span>
          );

          const itemClasses = cn(
            "relative flex flex-1 flex-col items-center justify-center min-h-[48px] py-1.5 cursor-pointer transition-transform duration-150 active:scale-90"
          );

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
              aria-current={isActive ? "page" : undefined}
              className={itemClasses}
            >
              {innerContent}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
