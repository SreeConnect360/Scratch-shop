import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { usePortal } from "@/lib/portal-state";
import { FadeUp } from "@/components/motion/Reveal";
import { Play, ArrowUpRight, ShoppingCart, Heart, Flame, ShieldCheck, HelpCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Maison ReeVibes — Luxury Fashion E-Commerce" },
      { name: "description", content: "Curated collections and luxury editorial statements celebrating beauty in diversity." },
    ],
  }),
  component: ShopHome,
});

function ShopHome() {
  const { state, toggleShopWishlist, addToShopCart } = usePortal();
  const products = state.products || [];
  const layout = state.homepageLayout;

  // Flash Sale Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter Categories
  const newArrivals = products.slice(0, 3);
  const bestSellers = products.slice(3, 6);
  
  // Calculate dynamic trending products (sorted by views + cart additions + purchases)
  const sortedTrending = [...products].sort((a, b) => {
    const scoreA = (state.productViews[a.id] ?? 0) + (state.productCartAdditions[a.id] ?? 0) * 3 + (state.productPurchases[a.id] ?? 0) * 5;
    const scoreB = (state.productViews[b.id] ?? 0) + (state.productCartAdditions[b.id] ?? 0) * 3 + (state.productPurchases[b.id] ?? 0) * 5;
    return scoreB - scoreA;
  }).slice(0, 3);

  const formatTime = (t: typeof timeLeft) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(t.hours)}h : ${pad(t.minutes)}m : ${pad(t.seconds)}s`;
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SLIDESHOW / BANNER */}
      <section className="relative w-full h-[calc(80vh-80px)] min-h-[450px] bg-zinc-950 overflow-hidden">
        {layout.heroBanners.length > 0 && (
          <div className="absolute inset-0">
            <img
              src={layout.heroBanners[0].image}
              alt={layout.heroBanners[0].title}
              className="w-full h-full object-cover select-none pointer-events-none opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 space-y-4 max-w-3xl">
              <FadeUp>
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                  {layout.heroBanners[0].subtitle}
                </span>
                <h1 className="text-4xl md:text-6xl font-light tracking-wide text-white font-serif mt-2 leading-tight">
                  {layout.heroBanners[0].title}
                </h1>
              </FadeUp>
              <div className="pt-4 flex gap-4">
                <Link
                  to="/shop/categories"
                  className="liquid-glass-btn bg-white text-zinc-950 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-md"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. FLASH SALE WIDGET */}
      {layout.flashSale.active && (
        <section className="max-w-7xl mx-auto px-6 lg:px-16">
          <FadeUp>
            <div className="liquid-glass bg-gradient-to-r from-red-950/20 via-surface-2/40 to-zinc-900/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10 rounded-3xl">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-red-500 animate-pulse" />
                <div>
                  <h3 className="text-lg font-serif">Luxury Flash Sale</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Exclusive 15% discount for members</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Ends In</div>
                  <div className="font-mono text-sm font-bold text-red-400 mt-1">{formatTime(timeLeft)}</div>
                </div>
                <Link
                  to="/shop/categories"
                  className="liquid-glass-btn bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest py-3 px-6 transition-all rounded-full"
                >
                  Shop Flash Sale
                </Link>
              </div>
            </div>
          </FadeUp>
        </section>
      )}

      {/* 3. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 space-y-8">
        <FadeUp>
          <div className="flex justify-between items-end border-b border-border-subtle pb-4">
            <div>
              <p className="editorial-eyebrow text-accent">New Arrivals</p>
              <h2 className="font-serif text-3xl mt-1">Season Statement Curation</h2>
            </div>
            <Link to="/shop/categories" className="text-xs uppercase tracking-widest font-semibold hover:text-accent flex items-center gap-1.5 transition-colors">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newArrivals.map(p => (
            <FadeUp key={p.id}>
              <ProductCard p={p} toggleShopWishlist={toggleShopWishlist} addToShopCart={addToShopCart} wishlist={state.shopWishlist[state.user?.id || ""]} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL DOUBLE BANNER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 grid md:grid-cols-2 gap-8">
        <div className="relative aspect-[3/2] overflow-hidden bg-zinc-950 group rounded-3xl border border-border-subtle">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&h=600&q=80" className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-accent font-bold">Women Collection</span>
            <h3 className="font-serif text-2xl text-white">Avant-Garde Silhouettes</h3>
            <Link to="/shop/categories" className="text-xs text-white uppercase tracking-widest font-semibold pt-2 hover:underline flex items-center gap-1">Shop Curation <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
        </div>

        <div className="relative aspect-[3/2] overflow-hidden bg-zinc-950 group rounded-3xl border border-border-subtle">
          <img src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&h=600&q=80" className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-accent font-bold">Men Collection</span>
            <h3 className="font-serif text-2xl text-white">Tailored Editorial Fits</h3>
            <Link to="/shop/categories" className="text-xs text-white uppercase tracking-widest font-semibold pt-2 hover:underline flex items-center gap-1">Shop Curation <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
        </div>
      </section>

      {/* 5. TRENDING SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 space-y-8">
        <FadeUp>
          <div className="flex justify-between items-end border-b border-border-subtle pb-4">
            <div>
              <p className="editorial-eyebrow text-accent">Trending Curation</p>
              <h2 className="font-serif text-3xl mt-1">High-Fidelity Statements</h2>
            </div>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedTrending.map(p => (
            <FadeUp key={p.id}>
              <ProductCard p={p} toggleShopWishlist={toggleShopWishlist} addToShopCart={addToShopCart} wishlist={state.shopWishlist[state.user?.id || ""]} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* NEW: FASHION WALK PROMOTION BANNER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16">
        <FadeUp>
          <div className="liquid-glass relative overflow-hidden p-8 md:p-12 rounded-3xl border border-white/20 bg-gradient-to-br from-accent/20 to-black/40 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] bg-accent text-white px-3 py-1 rounded-full font-bold">ReeVibes Community</span>
              <h3 className="font-serif text-3xl md:text-4xl leading-tight">Walk the Runway. Influence the Curation.</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Join ReeVibes' digital Fashion Walk. Vote for contestants, showcase your premium style, or register today to become our next seasonal model!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link to="/live-contest" className="liquid-glass-btn bg-white text-black text-center text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-full hover:bg-neutral-100 transition-all">Vote Contestants</Link>
              <Link to="/apply" className="liquid-glass-btn border border-white text-center text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-full hover:bg-white/10 text-white transition-all">Become a Model</Link>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* 6. SPONSOR BRANDS */}
      <section className="py-16 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center space-y-8">
          <p className="editorial-eyebrow text-accent">Featured Partners & Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
            {["Maison Lumière", "Atelier Reine", "Studio Onyx", "Curvy Couture"].map(b => (
              <span key={b} className="font-serif font-bold text-lg md:text-2xl tracking-[0.15em]">{b.toUpperCase()}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ p, toggleShopWishlist, addToShopCart, wishlist }: { p: any; toggleShopWishlist: any; addToShopCart: any; wishlist: string[] }) {
  const { state } = usePortal();
  const userId = state.user?.id;
  const isFavorite = wishlist ? wishlist.includes(p.id) : false;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("Please login to manage your wishlist.");
      return;
    }
    toggleShopWishlist(userId, p.id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addToShopCart({
      productId: p.id,
      name: p.name,
      house: p.house,
      price: p.price,
      image: p.image,
      selectedSize: "M"
    });
    alert(`${p.name} added to cart!`);
  };

  return (
    <div className="liquid-glass liquid-glass-card-hover group flex flex-col justify-between h-full relative overflow-hidden bg-transparent border border-white/10 rounded-3xl">
      <Link to="/shop/product/$productId" params={{ productId: p.id }} className="block relative aspect-[3/4] bg-zinc-950 overflow-hidden">
        <img
          src={p.image}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {p.tag && (
          <span className="absolute top-4 left-4 bg-accent/90 text-white text-[9px] uppercase tracking-[0.15em] font-bold py-1 px-3">
            {p.tag}
          </span>
        )}
      </Link>
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="editorial-label text-muted-foreground text-[10px]">{p.house}</div>
          <Link to="/shop/product/$productId" params={{ productId: p.id }} className="hover:text-accent transition-colors block mt-1">
            <h3 className="font-serif text-lg leading-tight font-medium text-foreground">{p.name}</h3>
          </Link>
          <div className="text-sm font-semibold text-accent mt-2">{p.price}</div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-border-subtle">
          <button
            onClick={handleAddToCartClick}
            className="flex-1 liquid-glass-btn bg-foreground text-background py-2.5 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 hover:bg-accent hover:text-white transition-all duration-300 rounded-full"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
          </button>
          <button
            onClick={handleWishlistClick}
            className={`liquid-glass border py-2 px-3 transition-all duration-300 rounded-full ${
              isFavorite ? "border-accent text-accent fill-current" : "border-foreground/25 hover:border-foreground"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
