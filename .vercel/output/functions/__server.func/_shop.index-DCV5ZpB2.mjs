import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as usePortal, i as useShopNotification, Q as QuickAddContext } from "./_ssr/router-CgqY8r00.mjs";
import { F as FadeUp } from "./_ssr/Reveal-DABDixyV.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/maplibre-gl.mjs";
import { a7 as Mail, s as Star, J as ArrowUpRight, a8 as Flame, A as ArrowRight, b as ChevronLeft, d as ChevronRight, a9 as Heart, aa as ShoppingCart } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "node:fs";
import "node:path";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-alert-dialog.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/framer-motion.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
import "./_libs/zod.mjs";
function ShopHome() {
  const {
    state,
    toggleShopWishlist,
    addToShopCart
  } = usePortal();
  const products = (state.products || []).filter((p) => !p.status || p.status === "PUBLISHED" || p.status === "published");
  const isPreview = typeof window !== "undefined" && window.location.search.includes("preview=true");
  const layout = isPreview ? state.homepageLayoutDraft : state.homepageLayout;
  const [activeHeroIdx, setActiveHeroIdx] = reactExports.useState(0);
  const [activeFeedIdx, setActiveFeedIdx] = reactExports.useState(0);
  const demoPurchases = [{
    name: "Priya",
    item: "Oversized Hoodie",
    time: "2 minutes ago"
  }, {
    name: "Rahul",
    item: "Black Maxi Dress",
    time: "5 minutes ago"
  }, {
    name: "Ananya",
    item: "Tailored Linen Blazer",
    time: "12 minutes ago"
  }, {
    name: "Kabir",
    item: "Cashmere Cape",
    time: "15 minutes ago"
  }];
  reactExports.useEffect(() => {
    if (layout?.liveFeed?.enabled) {
      const feedInterval = setInterval(() => {
        setActiveFeedIdx((prev) => (prev + 1) % demoPurchases.length);
      }, 5e3);
      return () => clearInterval(feedInterval);
    }
  }, [layout]);
  const [timeLeft, setTimeLeft] = reactExports.useState({
    hours: 12,
    minutes: 22,
    seconds: 30
  });
  reactExports.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return {
          ...prev,
          seconds: prev.seconds - 1
        };
        if (prev.minutes > 0) return {
          ...prev,
          minutes: prev.minutes - 1,
          seconds: 59
        };
        if (prev.hours > 0) return {
          hours: prev.hours - 1,
          minutes: 59,
          seconds: 59
        };
        clearInterval(timer);
        return prev;
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (t) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(t.hours)}h ${pad(t.minutes)}m ${pad(t.seconds)}s`;
  };
  const [newsletterSent, setNewsletterSent] = reactExports.useState(false);
  const [emailInput, setEmailInput] = reactExports.useState("");
  const [lookbookSelectedProduct, setLookbookSelectedProduct] = reactExports.useState(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("reevibes:recently_viewed");
        if (stored) {
          setRecentlyViewedIds(JSON.parse(stored).slice(0, 4));
        }
      } catch {
      }
    }
  }, []);
  if (!layout) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 text-muted-foreground", children: "Initializing layout..." });
  }
  const renderSection = (sectionId) => {
    const sec = layout[sectionId];
    if (!sec || !sec.enabled) return null;
    switch (sectionId) {
      case "hero":
        const heroData = layout.hero;
        if (!heroData.banners || heroData.banners.length === 0) return null;
        const currentBanner = heroData.banners[activeHeroIdx % heroData.banners.length];
        return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative w-full h-[calc(80vh-80px)] min-h-[480px] bg-zinc-950 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
          currentBanner.type === "Video Banner" && currentBanner.videoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: currentBanner.videoUrl, autoPlay: true, loop: true, muted: true, playsInline: true, className: "w-full h-full object-cover opacity-75" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: currentBanner.desktopImage, alt: currentBanner.title, className: "w-full h-full object-cover select-none pointer-events-none opacity-85 transition-all duration-1000" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col justify-end p-8 md:p-16 space-y-4 max-w-3xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(FadeUp, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-[0.25em] text-accent font-bold", children: currentBanner.subtitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-light tracking-wide text-white font-serif mt-2 leading-tight", children: currentBanner.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 flex gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: currentBanner.redirectUrl, className: "liquid-glass-btn bg-white text-zinc-950 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-md", children: currentBanner.buttonText || "Explore Collection" }) })
          ] }),
          heroData.banners.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-6 right-8 flex gap-2", children: heroData.banners.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveHeroIdx(idx), className: `w-2 h-2 rounded-full transition-all ${idx === activeHeroIdx ? "bg-accent w-6" : "bg-white/40"}` }, idx)) })
        ] }) }, sectionId);
      case "categories":
        const catData = layout.categories;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border-subtle pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Shop By Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl mt-1", children: "Editorial Curation Lists" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: catData.items.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: cat.redirectUrl, className: "liquid-glass liquid-glass-card-hover group relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cat.image, className: "absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-5 flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-lg font-medium text-white", children: cat.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 text-white group-hover:text-accent transition-colors" })
            ] })
          ] }, cat.id)) })
        ] }, sectionId);
      case "flashSale":
        const fs = layout.flashSale;
        const fsProducts = products.filter((p) => fs.products.includes(p.id));
        if (fsProducts.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass bg-gradient-to-r from-red-950/20 via-surface-2/40 to-zinc-900/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10 rounded-3xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-6 h-6 text-red-500 animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-serif", children: "Limited Flash Sale" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "Exclusive ",
                  fs.discount,
                  "% discount live right now"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground", children: "Ends In" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm font-bold text-red-400 mt-1", children: formatTime(timeLeft) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories", className: "liquid-glass-btn bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest py-3 px-6 transition-all rounded-full", children: "Shop Flash Sale" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: fsProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""], discountPercent: fs.discount }, p.id)) })
        ] }, sectionId);
      case "trending":
        const trendingCuration = layout.trending;
        let trendingProductsList = [];
        if (trendingCuration.autoMode) {
          trendingProductsList = [...products].sort((a, b) => {
            const scoreA = (state.productViews[a.id] ?? 0) + (state.productCartAdditions[a.id] ?? 0) * 3 + (state.productPurchases[a.id] ?? 0) * 5;
            const scoreB = (state.productViews[b.id] ?? 0) + (state.productCartAdditions[b.id] ?? 0) * 3 + (state.productPurchases[b.id] ?? 0) * 5;
            return scoreB - scoreA;
          }).slice(0, 3);
        } else {
          trendingProductsList = products.filter((p) => trendingCuration.manualProducts.includes(p.id));
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-end border-b border-border-subtle pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Trending Curation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mt-1", children: "High-Fidelity Statements" })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: trendingProductsList.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
        ] }, sectionId);
      case "newArrivals":
        const naConfig = layout.newArrival || {
          productCount: 3,
          layoutStyle: "grid"
        };
        const naProducts = products.slice(0, naConfig.productCount || 3);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end border-b border-border-subtle pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "New Arrivals" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mt-1", children: "Season Statement Curation" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/categories", className: "text-xs uppercase tracking-widest font-semibold hover:text-accent flex items-center gap-1.5 transition-colors", children: [
              "View All ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: naConfig.layoutStyle === "carousel" ? "flex gap-8 overflow-x-auto pb-4 scrollbar-thin" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: naProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: naConfig.layoutStyle === "carousel" ? "w-80 shrink-0" : "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }) }, p.id)) })
        ] }, sectionId);
      case "campaign":
        const camp = layout.campaign;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-6 lg:px-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[21/9] min-h-[300px] overflow-hidden bg-zinc-950 group rounded-3xl border border-border-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: camp.image, className: "absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105", alt: "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 p-8 md:p-12 flex flex-col justify-center space-y-4 max-w-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-[0.2em] text-accent font-bold", children: "Editorial Fashion Campaign" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-3xl md:text-4xl text-white leading-tight", children: camp.heading }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: camp.redirectUrl || "/categories", className: "liquid-glass-btn bg-white text-zinc-950 font-bold px-6 py-2.5 text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-full w-fit", children: camp.ctaText || "Explore Curation" })
          ] })
        ] }) }) }, sectionId);
      case "collections":
        const colData = layout.collections;
        const colProducts = products.slice(0, 3);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/1] min-h-[220px] rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: colData.coverImage, className: "absolute inset-0 w-full h-full object-cover opacity-60", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl md:text-5xl italic tracking-widest text-white uppercase font-bold", children: colData.collectionId }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: colProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
        ] }, sectionId);
      case "liveFeed":
        const activeFeed = demoPurchases[activeFeedIdx];
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 left-6 z-40 animate-in slide-in-from-bottom-5 duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/20 px-4 py-3 rounded-full flex items-center gap-3 bg-black/85 shadow-2xl max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground leading-normal pr-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: activeFeed.name }),
            " from Mumbai purchased ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-accent", children: activeFeed.item }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic", children: activeFeed.time })
          ] })
        ] }) }, sectionId);
      case "bestSellers":
        const bsConfig = layout.bestSellers;
        let bsProducts = [];
        if (bsConfig.autoMode) {
          bsProducts = products.slice(1, 4);
        } else {
          bsProducts = products.filter((p) => bsConfig.manualProducts.includes(p.id));
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border-subtle pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Best Sellers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mt-1", children: "Most Coveted Curation" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: bsProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
        ] }, sectionId);
      case "limitedStock":
        const lim = layout.limitedStock;
        const limProducts = products.filter((p) => {
          const totalStock = p.stockPerSize ? Object.values(p.stockPerSize).reduce((a, b) => a + b, 0) : 0;
          return totalStock > 0 && totalStock <= (lim.threshold || 5);
        }).slice(0, 3);
        if (limProducts.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-500/10 border border-amber-500/20 p-4 rounded-3xl text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] font-bold text-amber-400", children: "High Conversion Alert" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg mt-1", children: "Couture Pieces Selling Fast" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: limProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""], stockWarningText: `Only ${Object.values(p.stockPerSize || {}).reduce((a, b) => a + b, 0)} left` }, p.id)) })
        ] }, sectionId);
      case "influencerPicks":
        const inf = layout.influencerPicks;
        const infProducts = products.filter((p) => inf.products.includes(p.id));
        if (infProducts.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border-subtle pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Influencer Picks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mt-1", children: "Editor's & Stylist Favorites" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: infProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
        ] }, sectionId);
      case "reviews":
        const revIds = layout.reviews.featuredReviewIds || [];
        const allReviews = Object.entries(state.productReviews).flatMap(([pId, list]) => list.map((r) => ({
          ...r,
          productId: pId
        })));
        const featuredReviews = allReviews.filter((r) => revIds.includes(r.id));
        if (featuredReviews.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-5xl mx-auto px-6 lg:px-16 space-y-8 text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Customer Commendations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-8", children: featuredReviews.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/10 p-6 rounded-3xl text-left space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif font-bold text-sm text-foreground", children: r.userName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex text-amber-400", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-3 h-3 fill-current ${i < r.rating ? "text-amber-400" : "text-zinc-600"}` }, i)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs italic text-muted-foreground", children: [
              '"',
              r.comment,
              '"'
            ] })
          ] }, r.id)) })
        ] }, sectionId);
      case "lookbook":
        const lb = layout.lookbook;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-4xl mx-auto px-6 lg:px-16 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Fashion Lookbook" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: "Visual Outfitters" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/20 bg-zinc-950 shadow-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: lb.image, className: "w-full h-full object-cover", alt: "Outfit Lookbook" }),
            lb.taggedProducts.map((tag, idx) => {
              const match = products.find((p) => p.id === tag.productId);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute cursor-pointer group", style: {
                left: `${tag.x}%`,
                top: `${tag.y}%`,
                transform: "translate(-50%, -50%)"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-accent border-2 border-white flex items-center justify-center text-[10px] text-white font-bold animate-pulse shadow-lg" }),
                match && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-zinc-950 border border-white/20 p-3 rounded-2xl w-48 shadow-2xl pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 transition-all duration-300 z-30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: match.image, className: "w-full h-24 object-cover rounded-lg", alt: "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-foreground mt-2", children: match.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-accent mt-0.5", children: match.price }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
                    productId: match.id
                  }, className: "text-[9px] uppercase tracking-wider text-white font-bold hover:text-accent mt-2 block underline", children: "Shop Product" })
                ] })
              ] }, idx);
            })
          ] })
        ] }, sectionId);
      case "recentlyViewed":
        const recentProducts = products.filter((p) => recentlyViewedIds.includes(p.id));
        if (recentProducts.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-white/10 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg tracking-wider", children: "Recently Viewed" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: recentProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
              productId: p.id
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, className: "aspect-[3/4] object-cover rounded-2xl w-full", alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold truncate", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-accent font-bold", children: p.price })
          ] }, p.id)) })
        ] }, sectionId);
      case "recommended":
        layout.recommended;
        const recProducts = products.slice(0, 3);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-white/10 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg tracking-wider", children: "Recommended For You" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-8", children: recProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
        ] }, sectionId);
      case "brandStory":
        const story = layout.brandStory;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent font-bold uppercase tracking-widest text-[10px]", children: "Maison ReeVibes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-3xl md:text-4xl leading-tight", children: "Behind the Digital Curations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: story.text })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: story.image1, className: "aspect-[3/4] object-cover rounded-3xl border border-white/10 shadow-lg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: story.image2, className: "aspect-[3/4] object-cover rounded-3xl border border-white/10 shadow-lg mt-8", alt: "" })
          ] })
        ] }) }, sectionId);
      case "newsletter":
        const news = layout.newsletter;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-4xl mx-auto px-6 lg:px-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-accent/20 bg-gradient-to-br from-accent/15 via-background to-surface-2 p-8 rounded-3xl text-center space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block p-1.5 bg-accent/20 text-accent rounded-full mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-serif text-2xl md:text-3xl text-foreground font-bold", children: [
              "Claim ₹",
              news.rewardAmount,
              " Store Credit"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed", children: "Join ReeVibes concierge curations today and unlock seasonal credits on your first order." })
          ] }),
          newsletterSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-emerald-400 font-mono py-2 animate-in zoom-in-95", children: [
            "✓ Congratulations! Your ₹",
            news.rewardAmount,
            " Coupon code [FESTIVE",
            news.rewardAmount,
            "] has been sent to your email."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
            e.preventDefault();
            if (emailInput.trim()) setNewsletterSent(true);
          }, className: "flex flex-col sm:flex-row gap-3 max-w-md mx-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "email", placeholder: "Enter email for curation code", className: "flex-1 bg-background border border-border-subtle rounded-full py-3 px-6 text-xs outline-none focus:border-accent text-center sm:text-left text-foreground", value: emailInput, onChange: (e) => setEmailInput(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "liquid-glass-btn bg-foreground text-background text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-full hover:bg-accent hover:text-white transition-all shrink-0", children: "Send Credits" })
          ] })
        ] }) }, sectionId);
      default:
        if (sectionId.startsWith("banner-")) {
          const banner = layout[sectionId];
          if (!banner) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-6 lg:px-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: banner.redirectUrl || "/shop", className: "relative aspect-[21/9] min-h-[260px] overflow-hidden bg-zinc-950 group rounded-3xl border border-border-subtle block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-[1.05]", style: {
              backgroundImage: `url(${banner.desktopImage})`,
              transform: `scale(${banner.scale || 1}) translate(${banner.xOffset || 0}%, ${banner.yOffset || 0}%)`,
              transformOrigin: "center center"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 p-8 md:p-12 flex flex-col justify-center space-y-3 max-w-xl z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-[0.2em] text-accent font-bold", children: "Featured Showcase" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-3xl md:text-4xl text-white leading-tight", children: banner.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest text-white hover:text-accent font-bold transition-colors", children: "Discover Collection →" })
            ] })
          ] }) }) }, sectionId);
        } else if (sectionId.startsWith("bucket-")) {
          const bucketSection = layout[sectionId];
          if (!bucketSection) return null;
          const bucket = state.buckets?.find((b) => b.id === bucketSection.id);
          if (!bucket) return null;
          const starProd = products.find((p) => p.id === bucket.starProductId) || products.find((p) => bucket.productIds.includes(p.id));
          const thumbnail = starProd?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&h=500&q=80";
          const bucketProducts = products.filter((p) => bucket.productIds.includes(p.id));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[21/9] min-h-[220px] rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: thumbnail, className: "absolute inset-0 w-full h-full object-cover opacity-60", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-black/40 flex flex-col justify-center p-8 md:p-12", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-accent font-bold", children: "Curated Set Selection" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl md:text-4xl text-white font-bold mt-1 uppercase tracking-wider", children: bucket.name })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: bucketProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
          ] }, sectionId);
        }
        return null;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-16 pb-16", children: layout.sectionOrder.map((sectionId) => {
    if (["announcement", "navigation", "footer"].includes(sectionId)) return null;
    return renderSection(sectionId);
  }) });
}
function ProductCard({
  p,
  toggleShopWishlist,
  addToShopCart,
  wishlist,
  discountPercent,
  stockWarningText
}) {
  const {
    state
  } = usePortal();
  const {
    triggerPopup
  } = useShopNotification();
  const userId = state.user?.id;
  const isFavorite = wishlist ? wishlist.includes(p.id) : false;
  const quickAdd = reactExports.useContext(QuickAddContext);
  const gallery = p.images && p.images.length > 0 ? p.images : [p.image];
  const [activeImgIdx, setActiveImgIdx] = reactExports.useState(0);
  const [isTitleHovered, setIsTitleHovered] = reactExports.useState(false);
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      toast.error("Please login to manage your wishlist.");
      return;
    }
    toggleShopWishlist(userId, p.id);
    triggerPopup(!isFavorite ? `${p.name} added to wishlist!` : `${p.name} removed from wishlist.`, () => toggleShopWishlist(userId, p.id), !isFavorite ? `${p.name} removed from wishlist.` : `${p.name} added to wishlist!`, () => toggleShopWishlist(userId, p.id), !isFavorite ? `${p.name} added to wishlist!` : `${p.name} removed from wishlist.`);
  };
  const handleAddToCartClick = (e) => {
    e.preventDefault();
    if (quickAdd) {
      quickAdd.openQuickAdd(p);
    }
  };
  const pct = discountPercent || p.discount || 0;
  const hasDiscount = !!(pct || p.originalPrice);
  let origPrice = p.price;
  let finalPrice = p.price;
  if (p.originalPrice && p.originalPrice !== p.price) {
    origPrice = p.originalPrice;
    finalPrice = p.price;
  } else if (pct) {
    try {
      const numeric = Number(String(p.price).replace(/[^0-9]/g, ""));
      if (!isNaN(numeric)) {
        const discounted = Math.round(numeric * (1 - pct / 100));
        finalPrice = `₹${discounted.toLocaleString()}`;
        origPrice = p.price;
      }
    } catch {
    }
  }
  const ensureRupees = (val) => {
    if (val === void 0 || val === null) return "";
    const clean = String(val).trim();
    return clean.startsWith("₹") ? clean : `₹${clean}`;
  };
  const displayFinalPrice = ensureRupees(finalPrice);
  const displayOrigPrice = ensureRupees(origPrice);
  let displayPct = pct;
  if (hasDiscount && !displayPct) {
    try {
      const origNumeric = Number(String(origPrice).replace(/[^0-9]/g, ""));
      const finalNumeric = Number(String(finalPrice).replace(/[^0-9]/g, ""));
      if (origNumeric && finalNumeric && origNumeric > finalNumeric) {
        displayPct = Math.round((origNumeric - finalNumeric) / origNumeric * 100);
      }
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass liquid-glass-card-hover group flex flex-col justify-between h-full relative overflow-hidden bg-transparent border border-white/10 rounded-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] bg-zinc-950 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
        productId: p.id
      }, className: "block w-full h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: gallery[activeImgIdx], className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105", alt: "" }) }),
      gallery.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveImgIdx((prev) => prev === 0 ? gallery.length - 1 : prev - 1);
        }, className: "absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveImgIdx((prev) => prev === gallery.length - 1 ? 0 : prev + 1);
        }, className: "absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" }) })
      ] }),
      gallery.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: gallery.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1.5 h-1.5 rounded-full transition-all ${activeImgIdx === idx ? "bg-accent scale-110" : "bg-white/40"}` }, idx)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleWishlistClick, className: "absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md hover:bg-accent rounded-full transition-all cursor-pointer z-20 hover:scale-110 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-3.5 h-3.5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}` }) }),
      hasDiscount && displayPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-3 left-3 bg-red-600 text-white text-[9px] uppercase tracking-[0.15em] font-bold py-1 px-3 z-10 rounded-full", children: [
        displayPct,
        "% OFF"
      ] }),
      stockWarningText && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-4 left-4 bg-amber-600 text-white text-[8px] uppercase tracking-[0.1em] font-bold py-1 px-2.5 rounded-full z-10", children: stockWarningText })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex-1 flex flex-col justify-between space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground text-[9px]", children: p.house }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
          productId: p.id
        }, className: "hover:text-accent transition-colors block mt-1", onMouseEnter: () => setIsTitleHovered(true), onMouseLeave: () => setIsTitleHovered(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-sm leading-tight font-medium text-foreground line-clamp-1", children: p.name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-accent", children: displayFinalPrice }),
          hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs line-through text-muted-foreground", children: displayOrigPrice })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `transition-all duration-300 overflow-hidden ${isTitleHovered ? "h-6 opacity-100 mt-1.5" : "h-0 opacity-0"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-muted-foreground shrink-0", children: "Sizes:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden w-full relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                  @keyframes marquee-pingpong {
                    0%, 15% { transform: translateX(0%); }
                    85%, 100% { transform: translateX(-45%); }
                  }
                ` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", style: isTitleHovered && (p.sizes || ["S", "M", "L", "XL"]).length > 3 ? {
              animation: "marquee-pingpong 4s ease-in-out infinite alternate",
              animationDelay: "1s",
              width: "max-content"
            } : {
              width: "max-content"
            }, children: (p.sizes || ["S", "M", "L", "XL"]).map((sz, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded border border-white/5 text-foreground whitespace-nowrap", children: sz }, sz + "-" + idx)) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-border-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAddToCartClick, className: "w-full liquid-glass-btn bg-foreground text-background py-2.5 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 hover:bg-accent hover:text-white transition-all duration-300 rounded-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3.5 h-3.5" }),
        " Add to Cart"
      ] }) })
    ] })
  ] });
}
export {
  ShopHome as component
};
