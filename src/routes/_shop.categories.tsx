import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FadeUp } from "@/components/motion/Reveal";
import { PRODUCTS } from "@/lib/data";
import { usePortal } from "@/lib/portal-state";
import { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { Heart, ShoppingBag, Star, Sparkles, ArrowRight, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { QuickAddContext, useShopNotification } from "./_shop";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/public/ProductCard";

const categoriesSearchSchema = z.object({
  gender: z.enum(["Men", "Women", "Unisex", "All"]).optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  bucketId: z.string().optional(),
  view: z.string().optional(),
  q: z.string().optional(),
  brand: z.string().optional(),
});

export const Route = createFileRoute("/_shop/categories")({
  validateSearch: (search) => categoriesSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "Categories — ReeVibes" }] }),
  component: CategoriesPage,
});

interface StyleFilters {
  gender?: "Men" | "Women" | "Unisex";
  category?: string;
  categories?: string[];
  size?: string;
  color?: string;
  priceLimit?: number;
  tag?: string;
  fabric?: string;
  brand?: string;
  discountLimit?: number; // e.g. minimum discount percentage
  customTags?: string[];
}

function parseStyleQuery(q: string): StyleFilters {
  let query = q.toLowerCase().replace(/['’]s\b/g, "");
  
  // Strip conversational filler words
  query = query.replace(/\b(show|me|find|get|please|i|want|search|for|a|an|the|look|display|view|products|related|to|items|matching)\b/g, " ").replace(/\s+/g, " ").trim();
  
  const filters: StyleFilters = {};

  // 1. Gender Match
  if (/\b(men|man|gentlemen|boy|male)s?\b/.test(query)) {
    filters.gender = "Men";
  } else if (/\b(women|woman|lady|ladies|girl|female)s?\b/.test(query)) {
    filters.gender = "Women";
  } else if (/\b(unisex|both|all)s?\b/.test(query)) {
    filters.gender = "Unisex";
  }

  // 2. Category Match (check T-Shirts first)
  const matchedCategories: string[] = [];
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

  // 3. Size Match (XS, S, M, L, XL, 2XL, 3XL, 4XL, XXL, XXXL, XXXXL)
  const sizeMatch = query.match(/\b(xs|s|m|l|xl|2xl|3xl|4xl|xxl|xxxl|xxxxl)\b/);
  if (sizeMatch) {
    filters.size = sizeMatch[1].toUpperCase();
  }

  // 4. Price Limit Match
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

  // 5. Color Match
  const colors = ["black", "white", "red", "blue", "green", "pink", "yellow", "orange", "grey", "gray", "purple", "gold", "silver", "brown", "beige", "navy", "noir"];
  for (const c of colors) {
    if (new RegExp(`\\b${c}\\b`).test(query)) {
      filters.color = c === "noir" ? "black" : c;
      break;
    }
  }

  // 6. Tag Match
  if (/\b(new|latest|arrival)s?\b/.test(query)) {
    filters.tag = "New Arrivals";
  } else if (/\b(trend|trending|popular|hot)s?\b/.test(query)) {
    filters.tag = "Trending";
  } else if (/\b(best|bestseller|best selling)s?\b/.test(query)) {
    filters.tag = "Bestsellers";
  }

  // 7. Fabric Match
  const fabrics = ["cotton", "silk", "polyester", "denim", "leather", "wool", "linen", "velvet", "satin", "crepe", "georgette", "nylon", "viscose"];
  for (const f of fabrics) {
    if (new RegExp(`\\b${f}\\b`).test(query)) {
      filters.fabric = f;
      break;
    }
  }

  // 8. Discount Match
  const discountMatch = query.match(/\b(\d+)\s*%\s*(?:off|discount)?\b/) || query.match(/\b(?:off|discount of)\s*(\d+)\s*%\b/);
  if (discountMatch) {
    filters.discountLimit = parseInt(discountMatch[1], 10);
  }

  // 9. Custom Tags Match
  const customTagsList = ["hoodie", "cargo", "jacket", "coat", "suit", "blazer", "trench", "sweater", "cardigan", "shorts"];
  const matchedTags: string[] = [];
  for (const t of customTagsList) {
    if (new RegExp(`\\b${t}s?\\b`).test(query)) {
      matchedTags.push(t);
    }
  }
  if (matchedTags.length > 0) {
    filters.customTags = matchedTags;
  }

  // 10. Brand Match
  const knownBrands = ["maison lumière", "atelier reine", "studio onyx", "curvy couture", "rose éternelle", "velvet & co", "atelier royale", "maison curation"];
  for (const b of knownBrands) {
    if (query.includes(b)) {
      filters.brand = b;
      break;
    }
  }

  return filters;
}

function CategoriesPage() {
  const { state, toggleShopWishlist, addToShopCart, reloadProducts } = usePortal();
  const searchParams = Route.useSearch();
  const quickAdd = useContext(QuickAddContext);
  const navigate = useNavigate();
  
  const [styleInput, setStyleInput] = useState(searchParams.q || "");

  // Re-verify latest catalog from Supabase on mount across any device/session
  useEffect(() => {
    if (reloadProducts) {
      reloadProducts(true);
    }
  }, [reloadProducts]);

  useEffect(() => {
    setStyleInput(searchParams.q || "");
  }, [searchParams.q]);

  const products = useMemo(() => {
    const rawList = (state.products && state.products.length > 0) ? state.products : PRODUCTS;
    return (rawList as any[]).filter((p: any) => {
      const st = String(p.status || "PUBLISHED").toUpperCase();
      const vis = String(p.visibility || "VISIBLE").toUpperCase();
      return st !== "DELETED" && st !== "DRAFT" && vis !== "HIDDEN";
    });
  }, [state.products]);

  const parsedFilters = useMemo(() => parseStyleQuery(searchParams.q || ""), [searchParams.q]);
  
  const genderFilter = searchParams.gender || parsedFilters.gender || "All";
  const categoryFilter = searchParams.category || parsedFilters.category || "All";
  const categoriesFilter = parsedFilters.categories || [];
  const sizeFilter = parsedFilters.size || "";
  const colorFilter = parsedFilters.color || "";
  const priceLimitFilter = parsedFilters.priceLimit || null;
  const tagFilter = searchParams.tag || parsedFilters.tag || "";
  const brandFilter = searchParams.brand || parsedFilters.brand || "";

  // Orders count map per product across all orders & purchases
  const productOrdersCount = useMemo(() => {
    const counts: Record<string, number> = {};
    if (state.orders) {
      Object.values(state.orders).forEach((userOrders: any[]) => {
        (userOrders || []).forEach((order: any) => {
          (order.items || []).forEach((item: any) => {
            const pid = item.productId || item.id;
            if (pid) {
              counts[pid] = (counts[pid] || 0) + (Number(item.qty) || 1);
            }
          });
        });
      });
    }
    if (state.productPurchases) {
      Object.entries(state.productPurchases).forEach(([pid, num]) => {
        counts[pid] = (counts[pid] || 0) + (num || 0);
      });
    }
    return counts;
  }, [state.orders, state.productPurchases]);

  // Available unique categories extracted dynamically from Supabase products + baseline catalog
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    ["All", "Tops", "Shirts", "T-Shirts", "Bottoms", "Dresses", "Hoodies", "Cargos", "Accessories"].forEach(c => set.add(c));
    products.forEach((p: any) => {
      if (p.category && typeof p.category === "string" && p.category.trim()) {
        const catName = p.category.trim();
        const formatted = catName.charAt(0).toUpperCase() + catName.slice(1);
        set.add(formatted);
      }
      if (Array.isArray(p.categoriesList)) {
        p.categoriesList.forEach((c: string) => {
          if (c && typeof c === "string" && c.trim()) {
            const formatted = c.trim().charAt(0).toUpperCase() + c.trim().slice(1);
            set.add(formatted);
          }
        });
      }
    });
    return Array.from(set);
  }, [products]);

  const parsePrice = useCallback((priceStr: string): number => {
    return Number(priceStr.replace(/[^0-9.]/g, ""));
  }, []);

  const filteredProducts = useMemo(() => {
    const getTrendingScore = (pId: string) => {
      const views = state.productViews?.[pId] || 0;
      const additions = state.productCartAdditions?.[pId] || 0;
      const purchases = state.productPurchases?.[pId] || 0;
      const reviews = state.productReviews?.[pId] || [];
      const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
      return views + additions * 3 + purchases * 5 + avgRating * 10;
    };

    const list = products.filter(p => {
      // 1. Bucket ID Search
      if (searchParams.bucketId) {
        const bucket = state.buckets?.find(b => b.id === searchParams.bucketId);
        if (!bucket || !bucket.productIds.includes(p.id)) return false;
      }

      // 2. Gender filtering
      if (genderFilter !== "All") {
        if (p.gender !== genderFilter && p.gender !== "Unisex") {
          return false;
        }
      }

      // 3. Category filtering (Robust support for category string and categories array)
      if (categoriesFilter.length > 0) {
        const matchesCategory = categoriesFilter.some(cat => {
          const catLower = cat.toLowerCase();
          const pCatLower = (p.category || "").toLowerCase();
          const pTypeLower = (p.type || "").toLowerCase();
          const pList = Array.isArray(p.categoriesList) ? p.categoriesList.map((c: string) => c.toLowerCase()) : [];
          return pCatLower.includes(catLower) || catLower.includes(pCatLower) || pTypeLower.includes(catLower) || pList.includes(catLower);
        });
        if (!matchesCategory) return false;
      } else if (categoryFilter !== "All") {
        const targetCatLower = categoryFilter.toLowerCase();
        const pCatLower = (p.category || "").toLowerCase();
        const pTypeLower = (p.type || "").toLowerCase();
        const pList = Array.isArray(p.categoriesList) ? p.categoriesList.map((c: string) => c.toLowerCase()) : [];
        const matches = pCatLower === targetCatLower || pCatLower.includes(targetCatLower) || targetCatLower.includes(pCatLower) || pTypeLower === targetCatLower || pList.includes(targetCatLower);
        if (!matches) return false;
      }

      // 4. Size filtering
      if (sizeFilter) {
        const productSizes = p.sizes || ["XS", "S", "M", "L", "XL", "XXL"];
        if (!productSizes.includes(sizeFilter)) {
          return false;
        }
      }

      // 5. Color filtering
      if (colorFilter) {
        const nameLower = (p.name || "").toLowerCase();
        const houseLower = (p.house || "").toLowerCase();
        const isBlack = colorFilter === "black" && (nameLower.includes("black") || nameLower.includes("noir") || houseLower.includes("noir"));
        const genericMatch = nameLower.includes(colorFilter) || houseLower.includes(colorFilter);
        if (!isBlack && !genericMatch) {
          return false;
        }
      }

      // 6. Price Limit filtering
      if (priceLimitFilter !== null) {
        const priceVal = parsePrice(p.price);
        if (priceVal > priceLimitFilter) {
          return false;
        }
      }

      // 6.1 Fabric filtering
      if (parsedFilters.fabric) {
        const fabricLower = (p.fabricMaterial || "").toLowerCase();
        if (!fabricLower.includes(parsedFilters.fabric)) {
          return false;
        }
      }

      // 6.2 Discount filtering
      if (parsedFilters.discountLimit !== undefined) {
        const actual = parseFloat(String(p.originalPrice || "").replace(/[^0-9.]/g, ""));
        const disc = parseFloat(String(p.price || "").replace(/[^0-9.]/g, ""));
        const pct = (actual && disc && actual > disc) ? Math.round(((actual - disc) / actual) * 100) : 0;
        if (pct < parsedFilters.discountLimit) {
          return false;
        }
      }

      // 6.3 Custom Tags filtering
      if (parsedFilters.customTags && parsedFilters.customTags.length > 0) {
        const productTags = (p.tags || []).map((t: string) => t.toLowerCase());
        const hasMatchingTag = parsedFilters.customTags.some(t => 
          productTags.some((pt: string) => pt.includes(t)) || (p.name || "").toLowerCase().includes(t)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // 6.4 Brand filtering
      if (brandFilter) {
        const bLower = brandFilter.trim().toLowerCase();
        const pHouse = (p.house || "").trim().toLowerCase();
        const pBrand = (p.brand || "").trim().toLowerCase();
        const matchesBrand = pHouse === bLower || pBrand === bLower || pHouse.includes(bLower) || pBrand.includes(bLower);
        if (!matchesBrand) return false;
      }

      // 7. Tag filtering
      if (tagFilter === "New" || tagFilter === "New Arrivals") {
        // All published catalog items are eligible for new releases curation
      } else if (tagFilter === "Trending") {
        // All published items are eligible for trending curation, ranked by orders/rating/reviews
      } else if (tagFilter === "Bestsellers") {
        const purchases = productOrdersCount[p.id] || state.productPurchases?.[p.id] || 0;
        if (p.tag !== "Bestseller" && purchases < 1) return false;
      }

      // 8. Keyword match for remaining parts
      const remainingQuery = styleInput
        .replace(/\b(show|me|find|get|please|i|want|search|for|a|an|the|look|display|view|products|related|to|items|matching)\b/gi, "")
        .replace(/\b(men|man|gentlemen|boy|male|women|woman|lady|ladies|girl|female)s?\b/gi, "")
        .replace(/\b(t-custom-custom-shirts?|t-shirts?|t shirts?|tshirts?|shirts?|tops?|bottoms?|pants?|trousers?|accessories?|couture|gown|dress)s?\b/gi, "")
        .replace(/\b(xs|s|m|l|xl|2xl|3xl|4xl|xxl|xxxl|xxxxl)\b/gi, "")
        .replace(/\b(black|white|red|blue|green|pink|yellow|orange|grey|gray|purple|gold|silver|brown|beige|navy|noir|cotton|silk|polyester|denim|leather|wool|linen|velvet|satin|crepe|georgette|nylon|viscose)\b/gi, "")
        .replace(/\b(?:under|below|less than|max|budget)\s*(?:rs\.?|inr|₹)?\s*\d+[\d,]*\b/gi, "")
        .replace(/(?:rs\.?|inr|₹)\s*\d+[\d,]*\b/gi, "")
        .replace(/\b(new|latest|arrival|trend|trending|popular|hot|best|bestseller|best selling)s?\b/gi, "")
        .replace(/\b\d+\s*%\s*(?:off|discount)?\b/gi, "")
        .replace(/\b(?:off|discount of)\s*\d+\s*%\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();

      if (remainingQuery) {
        const keywords = remainingQuery.toLowerCase().split(/\s+/);
        const nameLower = (p.name || "").toLowerCase();
        const houseLower = (p.house || "").toLowerCase();
        const matches = keywords.every((kw: string) => nameLower.includes(kw) || houseLower.includes(kw));
        if (!matches) return false;
      }

      return true;
    });

    // Sort logic
    if (tagFilter === "Trending") {
      list.sort((a, b) => {
        const ordersA = productOrdersCount[a.id] || 0;
        const ordersB = productOrdersCount[b.id] || 0;
        if (ordersB !== ordersA) {
          return ordersB - ordersA;
        }

        const ratingA = Number(a.rating || a.customRating || 0);
        const ratingB = Number(b.rating || b.customRating || 0);
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }

        const reviewsA = (state.productReviews?.[a.id]?.length || 0) || Number(a.reviewCount || a.customReviewCount || 0);
        const reviewsB = (state.productReviews?.[b.id]?.length || 0) || Number(b.reviewCount || b.customReviewCount || 0);
        return reviewsB - reviewsA;
      });
    } else if (tagFilter === "New" || tagFilter === "New Arrivals") {
      list.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        return b.id.localeCompare(a.id);
      });
    }

    return list;
  }, [products, searchParams, genderFilter, categoryFilter, categoriesFilter, sizeFilter, colorFilter, priceLimitFilter, tagFilter, brandFilter, productOrdersCount, parsedFilters, styleInput, parsePrice, state.buckets, state.productViews, state.productCartAdditions, state.productPurchases, state.productReviews]);

  const userWishlist = state.user ? (state.shopWishlist[state.user.id] || []) : [];

  const showCollectionsGrid = searchParams.view === "collections" && !searchParams.bucketId;

  let pageTitle = "Fashion Curation";
  let pageEyebrow = "Style Your Fashion";
  if (showCollectionsGrid) {
    pageTitle = "Collections Curation";
    pageEyebrow = "EDITORIAL LOOKBOOKS";
  } else if (brandFilter) {
    pageTitle = `${brandFilter} Atelier`;
    pageEyebrow = "DESIGNER BRAND EDIT";
  } else if (tagFilter === "New" || tagFilter === "New Arrivals") {
    pageTitle = "New Arrivals";
    pageEyebrow = "LATEST ATELIER RELEASES";
  } else if (tagFilter === "Trending") {
    pageTitle = "Trending Curation";
    pageEyebrow = "HIGH-FIDELITY STATEMENTS";
  } else if (searchParams.bucketId) {
    const bucket = state.buckets?.find(b => b.id === searchParams.bucketId);
    pageTitle = bucket ? bucket.name : "Collection Curation";
    pageEyebrow = "EDITORIAL EDIT SET";
  }

  const handleSearchChange = (val: string) => {
    setStyleInput(val);
    navigate({
      to: "/categories",
      search: (prev: any) => ({ ...prev, q: val || undefined }),
      replace: true,
    });
  };

  const clearFilter = (filterType: string) => {
    let newQ = styleInput;
    if (filterType === "brand") {
      navigate({
        to: "/categories",
        search: (prev: any) => {
          const next = { ...prev };
          delete next.brand;
          return next;
        }
      });
      return;
    }
    if (filterType === "gender") {
      navigate({
        to: "/categories",
        search: (prev: any) => {
          const next = { ...prev };
          delete next.gender;
          return next;
        }
      });
      return;
    }
    if (filterType === "tag") {
      navigate({
        to: "/categories",
        search: (prev: any) => {
          const next = { ...prev };
          delete next.tag;
          return next;
        }
      });
      return;
    }
    
    if (filterType === "category") {
      navigate({
        to: "/categories",
        search: (prev: any) => {
          const next = { ...prev };
          delete next.category;
          return next;
        },
        replace: true
      });
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
      search: (prev: any) => ({ ...prev, q: newQ || undefined }),
      replace: true,
    });
  };

  // Render collections grid
  if (showCollectionsGrid) {
    const unhiddenBuckets = (state.buckets || [])
      .filter(b => !b.hidden)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    return (
      <div className="space-y-8 pb-16 public-layout">
        <header className="px-6 lg:px-16 pt-12 pb-12 border border-white/10 dark:border-white/10 bg-white/5 backdrop-blur-md rounded-3xl mx-4 lg:mx-8 relative overflow-hidden grain shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-60 pointer-events-none" />
          <FadeUp><p className="editorial-eyebrow text-accent flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" /> {pageEyebrow}</p></FadeUp>
          <FadeUp delay={0.1}><h1 className="mt-6 font-serif text-5xl lg:text-7xl text-foreground font-bold tracking-wide uppercase">{pageTitle}</h1></FadeUp>
          <FadeUp delay={0.2}><p className="mt-4 max-w-xl text-muted-foreground text-sm">Explore our curated collections of luxury outfits and select sets.</p></FadeUp>
        </header>

        <section className="px-4 sm:px-6 lg:px-16 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 bg-transparent">
          {unhiddenBuckets.length === 0 ? (
            <div className="col-span-full py-24 text-center text-sm text-muted-foreground italic bg-white/5 border border-white/10 rounded-3xl p-6">
              No collections are currently published by the admin.
            </div>
          ) : (
            unhiddenBuckets.map((b, i) => {
              const starProd = products.find((p) => p.id === b.starProductId) || products.find((p) => (b.productIds || []).includes(p.id));
              const thumbnail = b.thumbnail || starProd?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&h=500&q=80";
              return (
                <FadeUp key={b.id} delay={i * 0.05}>
                  <Link
                    to="/categories"
                    search={{ bucketId: b.id } as any}
                    className="liquid-glass liquid-glass-card-hover relative flex flex-col group overflow-hidden bg-transparent border border-white/10 rounded-3xl"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-zinc-950 relative">
                      <img src={thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-center z-10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase tracking-widest text-accent font-bold">Curation Collection</span>
                          </div>
                          <h4 className="font-serif text-xl mt-1 text-white font-bold">{b.name}</h4>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:text-accent transition-colors shrink-0" />
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              );
            })
          )}
        </section>
      </div>
    );
  }

  // Active filter tags array
  const activeChips = [];
  if (genderFilter !== "All") activeChips.push({ label: `Gender: ${genderFilter}`, type: "gender" });
  if (categoryFilter !== "All") activeChips.push({ label: `Category: ${categoryFilter}`, type: "category" });
  if (sizeFilter) activeChips.push({ label: `Size: ${sizeFilter}`, type: "size" });
  if (colorFilter) activeChips.push({ label: `Color: ${colorFilter}`, type: "color" });
  if (priceLimitFilter !== null) activeChips.push({ label: `Price: Under ₹${priceLimitFilter.toLocaleString()}`, type: "priceLimit" });
  if (tagFilter) activeChips.push({ label: `Tag: ${tagFilter}`, type: "tag" });
  if (brandFilter) activeChips.push({ label: `Brand: ${brandFilter}`, type: "brand" });

  // Dedicated New Arrivals layout: active when on New Arrivals tag without a restrictive sub-filter
  const isNewArrivalsView = (tagFilter === "New" || tagFilter === "New Arrivals") && genderFilter === "All" && categoryFilter === "All" && !brandFilter;

  const newArrivalSections = useMemo(() => {
    if (!isNewArrivalsView) {
      return { newlyAdded: [], women: [], men: [], unisex: [], others: [] };
    }

    const sorted = [...filteredProducts];
    const usedIds = new Set<string>();

    // 1. Newly Added Releases: First 2 rows (top 8 newest catalog items)
    const newlyAdded = sorted.slice(0, 8);
    newlyAdded.forEach((p) => usedIds.add(p.id));

    // 2. Women's Wear New Arrivals (deduplicated)
    const women = sorted.filter(
      (p) =>
        !usedIds.has(p.id) &&
        ((p.gender || "").toLowerCase() === "women" || (p.gender || "").toLowerCase() === "female")
    );
    women.forEach((p) => usedIds.add(p.id));

    // 3. Men's Wear New Arrivals (deduplicated)
    const men = sorted.filter(
      (p) =>
        !usedIds.has(p.id) &&
        ((p.gender || "").toLowerCase() === "men" || (p.gender || "").toLowerCase() === "male")
    );
    men.forEach((p) => usedIds.add(p.id));

    // 4. Unisex Wear New Arrivals (deduplicated)
    const unisex = sorted.filter(
      (p) =>
        !usedIds.has(p.id) &&
        ((p.gender || "").toLowerCase() === "unisex" || !p.gender || (p.gender || "").toLowerCase() === "all")
    );
    unisex.forEach((p) => usedIds.add(p.id));

    // 5. More New Releases (remaining deduplicated)
    const others = sorted.filter((p) => !usedIds.has(p.id));

    return { newlyAdded, women, men, unisex, others };
  }, [filteredProducts, isNewArrivalsView]);

  return (
    <div className="space-y-8 pb-16 public-layout">
      <header className="px-6 lg:px-16 pt-12 pb-12 border border-white/10 dark:border-white/10 bg-white/5 backdrop-blur-md rounded-3xl mx-4 lg:mx-8 relative overflow-hidden grain shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <FadeUp><p className="editorial-eyebrow text-accent flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" /> {pageEyebrow}</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-6 font-serif text-5xl lg:text-7xl text-foreground font-bold tracking-wide uppercase">{pageTitle}</h1></FadeUp>
        <FadeUp delay={0.2}><p className="mt-4 max-w-xl text-muted-foreground text-sm">Discover and filter luxury curation using natural language commands or search keys.</p></FadeUp>
        
        {/* Style Your Fashion Search Bar */}
        <div className="relative w-full max-w-2xl mt-8">
          <input
            type="text"
            placeholder="Style Your Fashion... (e.g. men's XL shirts under 20000)"
            value={styleInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 focus:border-accent pl-12 pr-6 py-4 rounded-full text-xs outline-none transition-all placeholder:text-muted-foreground/60 text-foreground shadow-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
          {styleInput && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-all cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </header>

      {/* Dynamic Filter Chips Section */}
      {activeChips.length > 0 && (
        <section className="px-6 lg:px-16 py-4 flex flex-wrap gap-2 items-center bg-transparent">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-2 font-bold">Active Curation:</span>
          {activeChips.map((chip, idx) => (
            <div key={idx} className="flex items-center gap-1.5 bg-accent/10 border border-accent/35 text-accent rounded-full py-1.5 px-3 text-[10px] uppercase tracking-wider font-bold shadow-sm">
              <span>{chip.label}</span>
              <button onClick={() => clearFilter(chip.type)} className="p-0.5 rounded-full hover:bg-accent/25 transition-all text-accent cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              setStyleInput("");
              navigate({
                to: "/categories",
                search: () => ({}),
                replace: true
              });
            }}
            className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-accent underline transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </section>
      )}

      {/* Category Tabs & Quick Filter Controls */}
      <section className="px-4 sm:px-6 lg:px-16 pt-2 pb-2 space-y-4">
        {/* Horizontal Category Navigation Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-white/10">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
            {availableCategories.map((cat) => {
              const isSelected = (cat === "All" && categoryFilter === "All") || (categoryFilter.toLowerCase() === cat.toLowerCase());
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    navigate({
                      to: "/categories",
                      search: (prev: any) => ({
                        ...prev,
                        category: cat === "All" ? undefined : cat,
                      }),
                      replace: true,
                    });
                  }}
                  className={cn(
                    "px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 uppercase whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "bg-accent text-obsidian shadow-[0_0_20px_-3px_rgba(200,169,106,0.6)] font-bold scale-[1.02]"
                      : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground border border-white/10"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Gender Filters */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
              {["All", "Women", "Men", "Unisex"].map((g) => {
                const isSelected = genderFilter === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      navigate({
                        to: "/categories",
                        search: (prev: any) => ({
                          ...prev,
                          gender: g === "All" ? undefined : (g as any),
                        }),
                        replace: true,
                      });
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-full transition-colors cursor-pointer",
                      isSelected
                        ? "bg-accent text-obsidian shadow-sm font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {g}
                  </button>
                );
              })}
            </div>

            {/* Counter */}
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest hidden md:inline-block">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Piece" : "Pieces"}
            </span>
          </div>
        </div>
      </section>

      {/* Product Grid / New Arrivals Multi-Row View */}
      {isNewArrivalsView ? (
        <div className="px-4 sm:px-6 lg:px-16 py-8 space-y-12 sm:space-y-14">
          {/* 1. Newly Added Releases: First 2 Rows */}
          {newArrivalSections.newlyAdded.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                  <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide uppercase text-foreground">
                    Newly Added Releases
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                  {newArrivalSections.newlyAdded.length} {newArrivalSections.newlyAdded.length === 1 ? "Piece" : "Pieces"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10 items-start">
                {newArrivalSections.newlyAdded.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    toggleShopWishlist={toggleShopWishlist}
                    addToShopCart={addToShopCart}
                    wishlist={userWishlist}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 2. Women's Wear New Items */}
          {newArrivalSections.women.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide uppercase text-foreground">
                  Women's Wear New Arrivals
                </h2>
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                  {newArrivalSections.women.length} {newArrivalSections.women.length === 1 ? "Piece" : "Pieces"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10 items-start">
                {newArrivalSections.women.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    toggleShopWishlist={toggleShopWishlist}
                    addToShopCart={addToShopCart}
                    wishlist={userWishlist}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 3. Men's Wear New Items */}
          {newArrivalSections.men.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide uppercase text-foreground">
                  Men's Wear New Arrivals
                </h2>
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                  {newArrivalSections.men.length} {newArrivalSections.men.length === 1 ? "Piece" : "Pieces"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10 items-start">
                {newArrivalSections.men.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    toggleShopWishlist={toggleShopWishlist}
                    addToShopCart={addToShopCart}
                    wishlist={userWishlist}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 4. Unisex Wear New Items */}
          {newArrivalSections.unisex.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide uppercase text-foreground">
                  Unisex Wear New Arrivals
                </h2>
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                  {newArrivalSections.unisex.length} {newArrivalSections.unisex.length === 1 ? "Piece" : "Pieces"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10 items-start">
                {newArrivalSections.unisex.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    toggleShopWishlist={toggleShopWishlist}
                    addToShopCart={addToShopCart}
                    wishlist={userWishlist}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 5. More New Releases */}
          {newArrivalSections.others.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide uppercase text-foreground">
                  More New Releases
                </h2>
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                  {newArrivalSections.others.length} {newArrivalSections.others.length === 1 ? "Piece" : "Pieces"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10 items-start">
                {newArrivalSections.others.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    toggleShopWishlist={toggleShopWishlist}
                    addToShopCart={addToShopCart}
                    wishlist={userWishlist}
                  />
                ))}
              </div>
            </section>
          )}

          {filteredProducts.length === 0 && (
            <div className="py-24 text-center text-sm text-muted-foreground italic bg-white/5 border border-white/10 rounded-3xl p-6">
              No new products found matching the selected criteria.
            </div>
          )}
        </div>
      ) : (
        <section className="px-4 sm:px-6 lg:px-16 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10 bg-transparent items-start">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-24 text-center text-sm text-muted-foreground italic bg-white/5 border border-white/10 rounded-3xl p-6">
              No items found matching the selected filters.
            </div>
          ) : (
            filteredProducts.map((p) => {
              return (
                <ProductCard
                  key={p.id}
                  p={p}
                  toggleShopWishlist={toggleShopWishlist}
                  addToShopCart={addToShopCart}
                  wishlist={userWishlist}
                />
              );
            })
          )}
        </section>
      )}
    </div>
  );
}
