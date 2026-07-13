import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { R as Route$y, u as usePortal, Q as QuickAddContext } from "./_ssr/router-BFsnZUKW.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { F as FadeUp } from "./_ssr/Reveal-DABDixyV.mjs";
import "./_libs/react-oauth__google.mjs";
import "./_libs/maplibre-gl.mjs";
import { n as Sparkles, A as ArrowRight, b as ChevronLeft, d as ChevronRight, f as ShoppingBag, a6 as Heart } from "./_libs/lucide-react.mjs";
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
import "./_libs/xlsx.mjs";
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
function ProductCard({
  product,
  idx,
  isRelated = false,
  isWishlisted,
  onWishlist,
  onAddToCart
}) {
  const [activeImageIndex, setActiveImageIndex] = reactExports.useState(0);
  const [isTitleHovered, setIsTitleHovered] = reactExports.useState(false);
  const [isImageHovered, setIsImageHovered] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const frame = reactExports.useRef(0);
  const handleMove = reactExports.useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 4}deg) rotateY(${(px - 0.5) * 4}deg) translateY(-4px)`;
    });
  }, []);
  const handleLeave = reactExports.useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
    }
  }, []);
  const images = product.images || product.gallery || (product.image ? [product.image] : []);
  const pct = product.discount || 0;
  const hasDiscount = !!(pct || product.originalPrice);
  const formatPrice = (pStr) => {
    if (pStr === void 0 || pStr === null) return "";
    let clean = String(pStr).replace(/[^0-9]/g, "");
    const val = parseInt(clean, 10) || 0;
    return `₹${val.toLocaleString("en-IN")}`;
  };
  let finalPrice = formatPrice(product.price);
  let originalPriceDisplay = product.originalPrice ? formatPrice(product.originalPrice) : "";
  let displayPct = pct;
  if (pct > 0) {
    const numeric = parseInt(String(product.price).replace(/[^0-9]/g, ""), 10) || 0;
    const discounted = Math.round(numeric * (1 - pct / 100));
    finalPrice = `₹${discounted.toLocaleString("en-IN")}`;
    originalPriceDisplay = formatPrice(product.price);
  } else if (hasDiscount && originalPriceDisplay) {
    const orig = parseInt(String(product.originalPrice).replace(/[^0-9]/g, ""), 10) || 0;
    const curr = parseInt(String(product.price).replace(/[^0-9]/g, ""), 10) || 0;
    if (orig > curr) {
      displayPct = Math.round((orig - curr) / orig * 100);
    }
  }
  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };
  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: idx * 0.05 + (isRelated ? 0.15 : 0), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, onMouseMove: handleMove, onMouseLeave: handleLeave, className: "group glass glass-reflect glass-edge relative overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)] flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 cursor-pointer", style: {
    transformStyle: "preserve-3d"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-48 lg:w-56 aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal/5 shrink-0 relative", onMouseEnter: () => setIsImageHovered(true), onMouseLeave: () => setIsImageHovered(false), children: [
      images.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: images[activeImageIndex], alt: product.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-neutral-200 dark:bg-neutral-800" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" }),
      displayPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "glass-strong glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-ink z-10", children: [
        displayPct,
        "% OFF"
      ] }),
      images.length > 1 && isImageHovered && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handlePrevImage, className: "absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/70 transition-colors z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleNextImage, className: "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/70 transition-colors z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-3 bottom-3 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: (e) => onAddToCart(product, e), className: "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 14, strokeWidth: 2 }),
        "Add to Bag"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full text-center md:text-left flex flex-col justify-between py-2 z-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-accent/90 block mb-1", children: product.house }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
          productId: product.id
        }, className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl md:text-2xl text-foreground hover:text-accent transition-colors duration-300 inline-block cursor-pointer", onMouseEnter: () => setIsTitleHovered(true), onMouseLeave: () => setIsTitleHovered(false), children: product.name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-8 mt-3 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute inset-0 flex flex-wrap items-center justify-center md:justify-start gap-2 transition-all duration-300 ${isTitleHovered ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"}`, children: [
            product.gender && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-wider bg-foreground/5 border border-foreground/10 px-2.5 py-1 rounded-full text-muted-foreground", children: product.gender }),
            product.category && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-wider bg-foreground/5 border border-foreground/10 px-2.5 py-1 rounded-full text-muted-foreground", children: product.category })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute inset-0 flex flex-wrap items-center justify-center md:justify-start gap-1.5 transition-all duration-300 ${isTitleHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-accent font-bold mr-1", children: "Sizes:" }),
            (product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent", children: size }, size))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 justify-center md:justify-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-semibold text-foreground", children: finalPrice }),
          hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through text-xs text-muted-foreground", children: originalPriceDisplay }),
            displayPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-emerald-500 font-bold", children: [
              "(",
              displayPct,
              "% OFF)"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 w-full sm:w-auto justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => onWishlist(product, e), className: `p-3 rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer ${isWishlisted ? "bg-rose-500/10 border-rose-500/30 text-rose-500" : "border-foreground/10 hover:border-accent/40 text-foreground hover:text-accent"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4", fill: isWishlisted ? "currentColor" : "none" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: (e) => onAddToCart(product, e), className: "flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add to Cart" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
            productId: product.id
          }, className: "p-3 rounded-full border border-foreground/10 hover:border-accent/40 text-foreground hover:text-accent transition-all duration-300 hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" }) })
        ] })
      ] })
    ] })
  ] }) });
}
function SearchResultsPage() {
  const {
    q = ""
  } = Route$y.useSearch();
  const {
    state,
    toggleShopWishlist,
    addToShopCart
  } = usePortal();
  reactExports.useContext(QuickAddContext);
  const products = (state.products || []).filter((p) => !p.status || p.status === "PUBLISHED" || p.status === "published");
  const user = state.user;
  const keywords = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  let mainProducts = [];
  let relatedProducts = [];
  if (keywords.length > 0) {
    products.forEach((p) => {
      let score = 0;
      keywords.forEach((kw) => {
        const name = (p.name || "").toLowerCase();
        const house = (p.house || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const gender = (p.gender || "").toLowerCase();
        const fabric = (p.fabricMaterial || "").toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());
        const tag = (p.tag || "").toLowerCase();
        if (["men", "man", "gentlemen", "boy", "male"].includes(kw)) {
          if (gender === "men" || gender === "unisex") {
            score++;
            return;
          }
        }
        if (["women", "woman", "lady", "ladies", "girl", "female"].includes(kw)) {
          if (gender === "women" || gender === "unisex") {
            score++;
            return;
          }
        }
        const catNorm = category.replace("s", "");
        const kwNorm = kw.replace("s", "");
        if (catNorm.includes(kwNorm) || kwNorm.includes(catNorm)) {
          score++;
          return;
        }
        if (name.includes(kw) || house.includes(kw) || fabric.includes(kw) || tag.includes(kw) || tags.some((t) => t.includes(kw))) {
          score++;
          return;
        }
      });
      if (score === keywords.length) {
        mainProducts.push(p);
      } else if (score > 0) {
        relatedProducts.push(p);
      }
    });
  } else {
    mainProducts = products;
  }
  const handleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to manage your wishlist");
      return;
    }
    toggleShopWishlist(user.id, product.id);
  };
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToShopCart({
      productId: product.id,
      name: product.name,
      house: product.house,
      price: product.price,
      image: product.image,
      selectedSize: "M"
    });
    toast.success(`${product.name} added to cart`);
  };
  const isWishlisted = (productId) => {
    if (!user) return false;
    return (state.shopWishlist[user.id] || []).includes(productId);
  };
  const totalFound = mainProducts.length + relatedProducts.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen py-24 px-4 lg:px-8 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FadeUp, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] uppercase tracking-[0.2em] mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Search Curation" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground", children: [
        "Curation for",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 font-semibold italic", children: [
          '"',
          q || "All Curation",
          '"'
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs md:text-sm text-muted-foreground max-w-md mx-auto uppercase tracking-widest leading-relaxed", children: [
        totalFound,
        " ",
        totalFound === 1 ? "Product" : "Products",
        " Found"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-12", children: [
      mainProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: mainProducts.map((product, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product, idx, isRelated: false, isWishlisted: isWishlisted(product.id), onWishlist: handleWishlist, onAddToCart: handleAddToCart }, product.id)) }),
      relatedProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left border-t border-white/10 pt-8 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl text-accent italic", children: "Related Curations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-widest mt-1", children: "You might also be interested in these matching styles" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: relatedProducts.map((product, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product, idx, isRelated: true, isWishlisted: isWishlisted(product.id), onWishlist: handleWishlist, onAddToCart: handleAddToCart }, product.id)) })
      ] }),
      totalFound === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/10 p-12 text-center space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground uppercase tracking-widest", children: "No products found matching your search." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/categories", className: "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:underline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Browse All Collections" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  SearchResultsPage as component
};
