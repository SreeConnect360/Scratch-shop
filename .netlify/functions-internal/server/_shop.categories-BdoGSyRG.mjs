import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { F as FadeUp } from "./_ssr/Reveal-DABDixyV.mjs";
import { u as usePortal, v as Route$u, Q as QuickAddContext, P as PRODUCTS, k as useShopNotification, c as cn } from "./_ssr/router-C_drxgJo.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/react-oauth__google.mjs";
import "./_libs/maplibre-gl.mjs";
import { n as Sparkles, A as ArrowRight, S as Search, X, b as ChevronLeft, d as ChevronRight, a6 as Heart, f as ShoppingBag } from "./_libs/lucide-react.mjs";
import { m as motion } from "./_libs/framer-motion.mjs";
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
import "./_libs/zod.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
function parseStyleQuery(q) {
  let query = q.toLowerCase().replace(/['’]s\b/g, "");
  query = query.replace(/\b(show|me|find|get|please|i|want|search|for|a|an|the|look|display|view|products|related|to|items|matching)\b/g, " ").replace(/\s+/g, " ").trim();
  const filters = {};
  if (/\b(men|man|gentlemen|boy|male)s?\b/.test(query)) {
    filters.gender = "Men";
  } else if (/\b(women|woman|lady|ladies|girl|female)s?\b/.test(query)) {
    filters.gender = "Women";
  } else if (/\b(unisex|both|all)s?\b/.test(query)) {
    filters.gender = "Unisex";
  }
  const matchedCategories = [];
  if (/\b(t-shirt|t shirt|tshirt)s?\b/.test(query)) matchedCategories.push("T-Shirts");
  if (/\bshirts?\b/.test(query) && !matchedCategories.includes("T-Shirts")) matchedCategories.push("Shirts");
  if (/\b(top|blouse)s?\b/.test(query)) matchedCategories.push("Tops");
  if (/\b(bottom|pant|trouser|jean|skirt)s?\b/.test(query)) matchedCategories.push("Bottoms");
  if (/\b(accessories|accessory|bag|shoe|heel|belt)s?\b/.test(query)) matchedCategories.push("Accessories");
  if (/\b(couture|gown|dress)es?\b/.test(query)) matchedCategories.push("Couture");
  if (/\bhoodies?\b/.test(query)) matchedCategories.push("Hoodies");
  if (/\bcargos?\b/.test(query)) matchedCategories.push("Cargos");
  if (matchedCategories.length > 0) {
    filters.categories = matchedCategories;
    filters.category = matchedCategories[0];
  }
  const sizeMatch = query.match(/\b(xs|s|m|l|xl|2xl|3xl|4xl|xxl|xxxl|xxxxl)\b/);
  if (sizeMatch) {
    filters.size = sizeMatch[1].toUpperCase();
  }
  const priceMatch = query.match(/\b(?:under|below|less than|max|budget)\s*(?:rs\.?|inr|₹)?\s*(\d+[\d,]*)\b/);
  if (priceMatch) {
    const rawVal = priceMatch[1].replace(/,/g, "");
    filters.priceLimit = parseInt(rawVal, 10);
  } else {
    const fallbackPriceMatch = query.match(/(?:rs\.?|inr|₹)\s*(\d+[\d,]*)\b/);
    if (fallbackPriceMatch) {
      const rawVal = fallbackPriceMatch[1].replace(/,/g, "");
      filters.priceLimit = parseInt(rawVal, 10);
    }
  }
  const colors = ["black", "white", "red", "blue", "green", "pink", "yellow", "orange", "grey", "gray", "purple", "gold", "silver", "brown", "beige", "navy", "noir"];
  for (const c of colors) {
    if (new RegExp(`\\b${c}\\b`).test(query)) {
      filters.color = c === "noir" ? "black" : c;
      break;
    }
  }
  if (/\b(new|latest|arrival)s?\b/.test(query)) {
    filters.tag = "New Arrivals";
  } else if (/\b(trend|trending|popular|hot)s?\b/.test(query)) {
    filters.tag = "Trending";
  } else if (/\b(best|bestseller|best selling)s?\b/.test(query)) {
    filters.tag = "Bestsellers";
  }
  const fabrics = ["cotton", "silk", "polyester", "denim", "leather", "wool", "linen", "velvet", "satin", "crepe", "georgette", "nylon", "viscose"];
  for (const f of fabrics) {
    if (new RegExp(`\\b${f}\\b`).test(query)) {
      filters.fabric = f;
      break;
    }
  }
  const discountMatch = query.match(/\b(\d+)\s*%\s*(?:off|discount)?\b/) || query.match(/\b(?:off|discount of)\s*(\d+)\s*%\b/);
  if (discountMatch) {
    filters.discountLimit = parseInt(discountMatch[1], 10);
  }
  const customTagsList = ["hoodie", "cargo", "jacket", "coat", "suit", "blazer", "trench", "sweater", "cardigan", "shorts"];
  const matchedTags = [];
  for (const t of customTagsList) {
    if (new RegExp(`\\b${t}s?\\b`).test(query)) {
      matchedTags.push(t);
    }
  }
  if (matchedTags.length > 0) {
    filters.customTags = matchedTags;
  }
  return filters;
}
function CategoriesPage() {
  const {
    state,
    toggleShopWishlist
  } = usePortal();
  const searchParams = Route$u.useSearch();
  const quickAdd = reactExports.useContext(QuickAddContext);
  const navigate = useNavigate();
  const [styleInput, setStyleInput] = reactExports.useState(searchParams.q || "");
  reactExports.useEffect(() => {
    setStyleInput(searchParams.q || "");
  }, [searchParams.q]);
  const products = (state.products || PRODUCTS).filter((p) => !p.status || p.status === "PUBLISHED" || p.status === "published");
  const getTrendingScore = (pId) => {
    const views = state.productViews?.[pId] || 0;
    const additions = state.productCartAdditions?.[pId] || 0;
    const purchases = state.productPurchases?.[pId] || 0;
    const reviews = state.productReviews?.[pId] || [];
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    return views + additions * 3 + purchases * 5 + avgRating * 10;
  };
  const parsedFilters = parseStyleQuery(searchParams.q || "");
  const genderFilter = searchParams.gender || parsedFilters.gender || "All";
  const categoryFilter = parsedFilters.category || "All";
  const categoriesFilter = parsedFilters.categories || [];
  const sizeFilter = parsedFilters.size || "";
  const colorFilter = parsedFilters.color || "";
  const priceLimitFilter = parsedFilters.priceLimit || null;
  const tagFilter = searchParams.tag || parsedFilters.tag || "";
  const parsePrice = (priceStr) => {
    return Number(priceStr.replace(/[^0-9.]/g, ""));
  };
  const filteredProducts = products.filter((p) => {
    if (searchParams.bucketId) {
      const bucket = state.buckets?.find((b) => b.id === searchParams.bucketId);
      if (!bucket || !bucket.productIds.includes(p.id)) return false;
    }
    if (genderFilter !== "All") {
      if (p.gender !== genderFilter && p.gender !== "Unisex") {
        return false;
      }
    }
    if (categoriesFilter.length > 0) {
      if (!categoriesFilter.includes(p.category)) {
        return false;
      }
    } else if (categoryFilter !== "All" && p.category !== categoryFilter) {
      return false;
    }
    if (sizeFilter) {
      const productSizes = p.sizes || ["XS", "S", "M", "L", "XL", "XXL"];
      if (!productSizes.includes(sizeFilter)) {
        return false;
      }
    }
    if (colorFilter) {
      const nameLower = (p.name || "").toLowerCase();
      const houseLower = (p.house || "").toLowerCase();
      const isBlack = colorFilter === "black" && (nameLower.includes("black") || nameLower.includes("noir") || houseLower.includes("noir"));
      const genericMatch = nameLower.includes(colorFilter) || houseLower.includes(colorFilter);
      if (!isBlack && !genericMatch) {
        return false;
      }
    }
    if (priceLimitFilter !== null) {
      const priceVal = parsePrice(p.price);
      if (priceVal > priceLimitFilter) {
        return false;
      }
    }
    if (parsedFilters.fabric) {
      const fabricLower = (p.fabricMaterial || "").toLowerCase();
      if (!fabricLower.includes(parsedFilters.fabric)) {
        return false;
      }
    }
    if (parsedFilters.discountLimit !== void 0) {
      const actual = parseFloat(String(p.originalPrice || "").replace(/[^0-9.]/g, ""));
      const disc = parseFloat(String(p.price || "").replace(/[^0-9.]/g, ""));
      const pct = actual && disc && actual > disc ? Math.round((actual - disc) / actual * 100) : 0;
      if (pct < parsedFilters.discountLimit) {
        return false;
      }
    }
    if (parsedFilters.customTags && parsedFilters.customTags.length > 0) {
      const productTags = (p.tags || []).map((t) => t.toLowerCase());
      const hasMatchingTag = parsedFilters.customTags.some((t) => productTags.some((pt) => pt.includes(t)) || (p.name || "").toLowerCase().includes(t));
      if (!hasMatchingTag) {
        return false;
      }
    }
    if (tagFilter === "New" || tagFilter === "New Arrivals") {
      const isNewId = p.id.startsWith("pr-");
      if (p.tag !== "New" && !isNewId) return false;
    } else if (tagFilter === "Trending") {
      if (getTrendingScore(p.id) < 5 && p.tag !== "Trending") return false;
    } else if (tagFilter === "Bestsellers") {
      const purchases = state.productPurchases?.[p.id] || 0;
      if (p.tag !== "Bestseller" && purchases < 2) return false;
    }
    const remainingQuery = styleInput.replace(/\b(show|me|find|get|please|i|want|search|for|a|an|the|look|display|view|products|related|to|items|matching)\b/gi, "").replace(/\b(men|man|gentlemen|boy|male|women|woman|lady|ladies|girl|female)s?\b/gi, "").replace(/\b(t-custom-custom-shirts?|t-shirts?|t shirts?|tshirts?|shirts?|tops?|bottoms?|pants?|trousers?|accessories?|couture|gown|dress)s?\b/gi, "").replace(/\b(xs|s|m|l|xl|2xl|3xl|4xl|xxl|xxxl|xxxxl)\b/gi, "").replace(/\b(black|white|red|blue|green|pink|yellow|orange|grey|gray|purple|gold|silver|brown|beige|navy|noir|cotton|silk|polyester|denim|leather|wool|linen|velvet|satin|crepe|georgette|nylon|viscose)\b/gi, "").replace(/\b(?:under|below|less than|max|budget)\s*(?:rs\.?|inr|₹)?\s*\d+[\d,]*\b/gi, "").replace(/(?:rs\.?|inr|₹)\s*\d+[\d,]*\b/gi, "").replace(/\b(new|latest|arrival|trend|trending|popular|hot|best|bestseller|best selling)s?\b/gi, "").replace(/\b\d+\s*%\s*(?:off|discount)?\b/gi, "").replace(/\b(?:off|discount of)\s*\d+\s*%\b/gi, "").replace(/\s+/g, " ").trim();
    if (remainingQuery) {
      const keywords = remainingQuery.toLowerCase().split(/\s+/);
      const nameLower = (p.name || "").toLowerCase();
      const houseLower = (p.house || "").toLowerCase();
      const matches = keywords.every((kw) => nameLower.includes(kw) || houseLower.includes(kw));
      if (!matches) return false;
    }
    return true;
  });
  if (tagFilter === "Trending") {
    filteredProducts.sort((a, b) => getTrendingScore(b.id) - getTrendingScore(a.id));
  } else if (tagFilter === "New" || tagFilter === "New Arrivals") {
    filteredProducts.sort((a, b) => {
      const isANew = a.id.startsWith("pr-");
      const isBNew = b.id.startsWith("pr-");
      if (isANew && !isBNew) return -1;
      if (!isANew && isBNew) return 1;
      return b.id.localeCompare(a.id);
    });
  }
  const userWishlist = state.user ? state.shopWishlist[state.user.id] || [] : [];
  const showCollectionsGrid = searchParams.view === "collections" && !searchParams.bucketId;
  let pageTitle = "Fashion Curation";
  let pageEyebrow = "Style Your Fashion";
  if (showCollectionsGrid) {
    pageTitle = "Collections Curation";
    pageEyebrow = "EDITORIAL LOOKBOOKS";
  } else if (tagFilter === "New" || tagFilter === "New Arrivals") {
    pageTitle = "New Arrivals";
    pageEyebrow = "LATEST ATELIER RELEASES";
  } else if (tagFilter === "Trending") {
    pageTitle = "Trending Curation";
    pageEyebrow = "HIGH-FIDELITY STATEMENTS";
  } else if (searchParams.bucketId) {
    const bucket = state.buckets?.find((b) => b.id === searchParams.bucketId);
    pageTitle = bucket ? bucket.name : "Collection Curation";
    pageEyebrow = "EDITORIAL EDIT SET";
  }
  const handleSearchChange = (val) => {
    setStyleInput(val);
    navigate({
      to: "/categories",
      search: (prev) => ({
        ...prev,
        q: val || void 0
      }),
      replace: true
    });
  };
  const clearFilter = (filterType) => {
    let newQ = styleInput;
    if (filterType === "gender") {
      navigate({
        to: "/categories",
        search: (prev) => {
          const next = {
            ...prev
          };
          delete next.gender;
          return next;
        }
      });
      return;
    }
    if (filterType === "tag") {
      navigate({
        to: "/categories",
        search: (prev) => {
          const next = {
            ...prev
          };
          delete next.tag;
          return next;
        }
      });
      return;
    }
    if (filterType === "category") {
      newQ = newQ.replace(/\b(shirts?|t-shirts?|t shirts?|tshirts?|tops?|bottoms?|pants?|trousers?|accessories?|couture|gown|dress)es?\b/gi, "").trim();
    } else if (filterType === "size") {
      newQ = newQ.replace(/\b(xs|s|m|l|xl|xxl)\b/gi, "").trim();
    } else if (filterType === "color") {
      const colorsPattern = new RegExp(`\\b(black|white|red|blue|green|pink|yellow|orange|grey|gray|purple|gold|silver|brown|beige|navy|noir)\\b`, "gi");
      newQ = newQ.replace(colorsPattern, "").trim();
    } else if (filterType === "priceLimit") {
      newQ = newQ.replace(/\b(?:under|below|less than|max|budget)\s*(?:rs\.?|inr|₹)?\s*\d+[\d,]*\b/gi, "").trim();
      newQ = newQ.replace(/(?:rs\.?|inr|₹)\s*\d+[\d,]*\b/gi, "").trim();
    }
    navigate({
      to: "/categories",
      search: (prev) => ({
        ...prev,
        q: newQ || void 0
      }),
      replace: true
    });
  };
  if (showCollectionsGrid) {
    const unhiddenBuckets = (state.buckets || []).filter((b) => !b.hidden);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-16 public-layout", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-12 pb-12 border border-white/10 dark:border-white/10 bg-white/5 backdrop-blur-md rounded-3xl mx-4 lg:mx-8 relative overflow-hidden grain shadow-[0_4px_30px_rgba(0,0,0,0.1)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-60 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "editorial-eyebrow text-accent flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-accent animate-pulse" }),
          " ",
          pageEyebrow
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-5xl lg:text-7xl text-foreground font-bold tracking-wide uppercase", children: pageTitle }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-xl text-muted-foreground text-sm", children: "Explore our curated collections of luxury outfits and select sets." }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 lg:px-16 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-transparent", children: unhiddenBuckets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full py-24 text-center text-sm text-muted-foreground italic bg-white/5 border border-white/10 rounded-3xl p-6", children: "No collections are currently published by the admin." }) : unhiddenBuckets.map((b, i) => {
        const starProd = products.find((p) => p.id === b.starProductId) || products.find((p) => b.productIds.includes(p.id));
        const thumbnail = starProd?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&h=500&q=80";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: i * 0.05, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories", search: {
          bucketId: b.id
        }, className: "liquid-glass liquid-glass-card-hover relative flex flex-col group overflow-hidden bg-transparent border border-white/10 rounded-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[3/4] overflow-hidden bg-zinc-950 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: thumbnail, className: "absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105", alt: "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-6 flex justify-between items-center z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-accent font-bold", children: "Curation Collection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-xl mt-1 text-white font-bold", children: b.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5 text-white group-hover:text-accent transition-colors shrink-0" })
          ] })
        ] }) }) }, b.id);
      }) })
    ] });
  }
  const activeChips = [];
  if (genderFilter !== "All") activeChips.push({
    label: `Gender: ${genderFilter}`,
    type: "gender"
  });
  if (categoryFilter !== "All") activeChips.push({
    label: `Category: ${categoryFilter}`,
    type: "category"
  });
  if (sizeFilter) activeChips.push({
    label: `Size: ${sizeFilter}`,
    type: "size"
  });
  if (colorFilter) activeChips.push({
    label: `Color: ${colorFilter}`,
    type: "color"
  });
  if (priceLimitFilter !== null) activeChips.push({
    label: `Price: Under ₹${priceLimitFilter.toLocaleString()}`,
    type: "priceLimit"
  });
  if (tagFilter) activeChips.push({
    label: `Tag: ${tagFilter}`,
    type: "tag"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-16 public-layout", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-12 pb-12 border border-white/10 dark:border-white/10 bg-white/5 backdrop-blur-md rounded-3xl mx-4 lg:mx-8 relative overflow-hidden grain shadow-[0_4px_30px_rgba(0,0,0,0.1)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-60 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "editorial-eyebrow text-accent flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-accent animate-pulse" }),
        " ",
        pageEyebrow
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-5xl lg:text-7xl text-foreground font-bold tracking-wide uppercase", children: pageTitle }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-xl text-muted-foreground text-sm", children: "Discover and filter luxury curation using natural language commands or search keys." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-2xl mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Style Your Fashion... (e.g. men's XL shirts under 20000)", value: styleInput, onChange: (e) => handleSearchChange(e.target.value), className: "w-full bg-white/10 border border-white/20 focus:border-accent pl-12 pr-6 py-4 rounded-full text-xs outline-none transition-all placeholder:text-muted-foreground/60 text-foreground shadow-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" }),
        styleInput && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleSearchChange(""), className: "absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-all cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }) })
      ] })
    ] }),
    activeChips.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 lg:px-16 py-4 flex flex-wrap gap-2 items-center bg-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mr-2 font-bold", children: "Active Curation:" }),
      activeChips.map((chip, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-accent/10 border border-accent/35 text-accent rounded-full py-1.5 px-3 text-[10px] uppercase tracking-wider font-bold shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: chip.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => clearFilter(chip.type), className: "p-0.5 rounded-full hover:bg-accent/25 transition-all text-accent cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }) })
      ] }, idx)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setStyleInput("");
        navigate({
          to: "/categories",
          search: () => ({}),
          replace: true
        });
      }, className: "text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-accent underline transition-colors cursor-pointer", children: "Clear All" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 lg:px-16 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 bg-transparent", children: filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full py-24 text-center text-sm text-muted-foreground italic bg-white/5 border border-white/10 rounded-3xl p-6", children: "No items found matching the selected filters." }) : filteredProducts.map((p, i) => {
      const isWishlisted = userWishlist.includes(p.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryProductCard, { p, i, state, isWishlisted, toggleShopWishlist, quickAdd }, p.id);
    }) })
  ] });
}
function CategoryProductCard({
  p,
  i,
  state,
  isWishlisted,
  toggleShopWishlist,
  quickAdd
}) {
  const {
    triggerPopup
  } = useShopNotification();
  const gallery = p.images && p.images.length > 0 ? p.images : [p.image];
  const [activeImgIdx, setActiveImgIdx] = reactExports.useState(0);
  const [isTitleHovered, setIsTitleHovered] = reactExports.useState(false);
  const [isHovered, setIsHovered] = reactExports.useState(false);
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
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-6px)`;
    });
  }, []);
  const handleLeave = reactExports.useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
    }
  }, []);
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.user) {
      toast.error("Please login to manage your wishlist.");
      return;
    }
    toggleShopWishlist(state.user.id, p.id);
    triggerPopup(!isWishlisted ? `${p.name} added to wishlist!` : `${p.name} removed from wishlist.`, () => toggleShopWishlist(state.user.id, p.id), !isWishlisted ? `${p.name} removed from wishlist.` : `${p.name} added to wishlist!`, () => toggleShopWishlist(state.user.id, p.id), !isWishlisted ? `${p.name} added to wishlist!` : `${p.name} removed from wishlist.`);
  };
  const handleAddToCartClick = (e) => {
    e.preventDefault();
    if (quickAdd) {
      quickAdd.openQuickAdd(p);
    }
  };
  const pct = p.discount || 0;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: i % 6 * 0.05, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, onMouseMove: (e) => {
    setIsHovered(true);
    handleMove(e);
  }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => {
    setIsHovered(false);
    handleLeave();
  }, className: "group glass glass-reflect glass-edge relative overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)] flex flex-col justify-between h-full cursor-pointer", style: {
    transformStyle: "preserve-3d"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/5] overflow-hidden bg-charcoal/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
        productId: p.id
      }, className: "block w-full h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: gallery[activeImgIdx], alt: p.name, className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" }),
      displayPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "glass-strong glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-ink z-10", children: [
        displayPct,
        "% OFF"
      ] }),
      gallery.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveImgIdx((prev) => prev === 0 ? gallery.length - 1 : prev - 1);
        }, className: "absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveImgIdx((prev) => prev === gallery.length - 1 ? 0 : prev + 1);
        }, className: "absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.button, { type: "button", onClick: handleWishlistClick, whileTap: {
        scale: 0.8
      }, className: `glass glass-strong absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full cursor-pointer transition-all duration-300 ease-out ${isWishlisted ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-[-10px] pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { initial: {
        scale: 0.4
      }, animate: {
        scale: 1
      }, transition: {
        type: "spring",
        stiffness: 480,
        damping: 15
      }, className: "flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 16, strokeWidth: 1.8, className: cn("transition-colors duration-300", isWishlisted ? "fill-gold text-gold" : "text-ink") }) }, String(isWishlisted)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-3 bottom-3 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleAddToCartClick, className: "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 14, strokeWidth: 2 }),
        "Add to Bag"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-[2] flex flex-col justify-between p-5 bg-black/25 flex-1 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground text-[9px]", children: p.house }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
        productId: p.id
      }, className: "hover:text-accent transition-colors block mt-1", onMouseEnter: () => setIsTitleHovered(true), onMouseLeave: () => setIsTitleHovered(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate font-serif text-sm font-medium text-ink leading-tight", children: p.name }) }),
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
    ] }) })
  ] }) }, p.id);
}
export {
  CategoriesPage as component
};
