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
      className="glass-dock fixed inset-x-0 bottom-0 z-[90] w-full md:hidden border-t border-white/10"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-around px-2 py-1.5 h-16">
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
                className="relative flex items-center justify-center cursor-pointer -translate-y-3.5 transition-transform duration-300 active:scale-95"
              >
                {/* Glow behind search button */}
                <div className="absolute -inset-1.5 bg-gold/25 rounded-full blur-md opacity-85" />
                {/* Circular Gold Button */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gold text-zinc-950 shadow-[0_4px_12px_rgba(0,0,0,0.3),0_0_15px_rgba(200,169,106,0.35)]">
                  <Search size={22} strokeWidth={2.2} />
                </div>
              </button>
            );
          }

          const innerContent = (
            <span className="relative flex flex-col items-center justify-center py-1">
              <item.Icon
                size={22}
                strokeWidth={1.8}
                className={cn(
                  "transition-colors duration-300",
                  isActive ? "text-gold" : "text-white/60 hover:text-white"
                )}
              />
              {count > 0 && (
                <span className="absolute -right-2.5 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-zinc-950 shadow-[0_2px_5px_rgba(0,0,0,0.35)]">
                  {count}
                </span>
              )}
              {isActive && (
                <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-gold shadow-[0_0_6px_rgba(200,169,106,0.9)]" />
              )}
            </span>
          );

          const itemClasses = cn(
            "relative flex flex-1 flex-col items-center justify-center py-2 px-1 cursor-pointer"
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

