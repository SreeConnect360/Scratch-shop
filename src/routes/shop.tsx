import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { Search, Heart, ShoppingBag, Bell, Sun, Moon, ArrowRight, User } from "lucide-react";
import { BrandLogo, ThemeToggle } from "@/components/theme/ThemeToggle";

export const Route = createFileRoute("/shop")({
  component: ShopLayout,
});

function ShopLayout() {
  const { state, toggleShopWishlist, removeFromShopCart } = usePortal();
  const { shopCount, shopTotal } = useCartTotal();
  const navigate = useNavigate();

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Suggested keywords
  const trendingSearches = ["Corset", "Cashmere", "Trousers", "Linen", "Maison", "Atelier"];

  // Filter products by autocomplete
  const products = state.products || [];
  const suggestions = searchQuery.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.house.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate({ to: "/shop/categories", search: { q: searchQuery } as any });
    }
  };

  // User notifications & wishlist count
  const user = state.user;
  const wishlistCount = user ? (state.shopWishlist[user.id] || []).length : 0;
  const unreadNotifCount = state.notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      {/* Premium Floating Liquid Glass Header */}
      <div className="px-4 lg:px-8 pt-4 sticky top-0 z-40">
        <header className="liquid-glass-header liquid-glass h-20 px-6 lg:px-12 flex items-center justify-between rounded-full border border-white/20">
          <div className="flex items-center gap-10">
            <Link to="/" className="block">
              <BrandLogo className="w-28 h-auto" />
              <div className="text-[7px] uppercase tracking-[0.25em] text-muted-foreground mt-1">House of Fashion</div>
            </Link>
            <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest font-semibold text-foreground/85">
              <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
              <Link to="/shop/categories" className="hover:text-accent transition-colors">Collections</Link>
              <Link to="/live-contest" className="hover:text-accent transition-colors">Contests</Link>
            </nav>
          </div>

          {/* Global Search Bar with Autocomplete Suggestions */}
          <div ref={searchRef} className="relative max-w-md w-full mx-6 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search luxury fashion curation…"
                className="w-full bg-white/5 dark:bg-white/5 border border-white/10 pl-12 pr-4 py-2.5 rounded-full text-xs outline-none focus:border-accent focus:bg-white/10 transition-all placeholder:text-muted-foreground/50 text-foreground"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </form>

            {/* Autocomplete Suggestions Box */}
            {showSuggestions && (searchQuery.trim() || suggestions.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-3 liquid-glass p-5 space-y-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 rounded-3xl">
                {suggestions.length > 0 ? (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Product Matches</div>
                    <div className="space-y-2">
                      {suggestions.map(p => (
                        <Link
                          key={p.id}
                          to="/shop/product/$productId"
                          params={{ productId: p.id }}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 p-2 hover:bg-white/10 dark:hover:bg-white/10 rounded-xl transition-all"
                        >
                          <img src={p.image} className="w-8 h-10 object-cover rounded-lg" />
                          <div>
                            <div className="text-xs font-semibold text-foreground">{p.name}</div>
                            <div className="text-[10px] text-muted-foreground">{p.house}</div>
                          </div>
                          <div className="ml-auto text-xs text-accent font-semibold">{p.price}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="text-xs text-muted-foreground py-2">No direct products match. Press enter to search categories.</div>
                ) : null}

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Trending Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map(kw => (
                      <button
                        key={kw}
                        onClick={() => {
                          setSearchQuery(kw);
                          navigate({ to: "/shop/categories", search: { q: kw } as any });
                          setShowSuggestions(false);
                        }}
                        className="text-[10px] uppercase tracking-wider bg-white/5 hover:bg-accent dark:bg-white/5 hover:text-white border border-white/10 rounded-full py-1.5 px-3.5 transition-all text-foreground cursor-pointer"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Header Icons & Cart Trigger */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* User Account Portal shortcut */}
            <Link to="/shop/account" search={{ tab: "dashboard" }} className="relative text-foreground/75 hover:text-foreground p-2">
              <User className="w-4.5 h-4.5" />
            </Link>

            {/* Persistent Floating Badges (Wishlist, Cart, Notifs) */}
            <Link to="/shop/account" search={{ tab: "wishlist" }} className="relative text-foreground/75 hover:text-foreground p-2">
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-accent text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/shop/cart" className="relative text-foreground/75 hover:text-foreground p-2">
              <ShoppingBag className="w-4.5 h-4.5" />
              {shopCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-accent text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                  {shopCount}
                </span>
              )}
            </Link>

            <Link to="/shop/account" search={{ tab: "notifications" }} className="relative text-foreground/75 hover:text-foreground p-2 hidden sm:block">
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
              )}
            </Link>
          </div>
        </header>
      </div>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Luxury Footer */}
      <footer className="border-t border-white/10 bg-background px-6 lg:px-16 py-12 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-6 items-center">
        <div>© 2026 ReeVibes. Designed by Google DeepMind Team. All Rights Reserved.</div>
        <div className="flex gap-6 uppercase tracking-wider font-semibold">
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/shop/categories" className="hover:text-foreground transition-colors">Catalog</Link>
          <Link to="/admin" className="hover:text-foreground transition-colors">Admin Workspace</Link>
        </div>
      </footer>
    </div>
  );
}
