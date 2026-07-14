import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { usePortal } from "@/lib/portal-state";
import { Heart, ShoppingBag, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { QuickAddContext } from "./_shop";
import { useContext, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { FadeUp } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const searchParamsSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/_shop/search")({
  validateSearch: (search) => searchParamsSchema.parse(search),
  head: (ctx: any) => {
    const q = ctx.match?.search?.q || "";
    return {
      meta: [{ title: q ? `Search: "${q}" — ReeVibes` : "Search Results — ReeVibes" }],
    };
  },
  component: SearchResultsPage,
});

interface ExtractedFilters {
  gender?: string;
  categories?: string[];
  priceLimit?: number;
  color?: string;
  fabric?: string;
  brand?: string;
  customTags?: string[];
}

function parsePrice(priceStr: string): number {
  return parseInt(String(priceStr || "").replace(/[^0-9]/g, ""), 10) || 0;
}

function parseSearchQuery(q: string): ExtractedFilters {
  const query = q.toLowerCase().replace(/['’]s\b/g, "").trim();
  const filters: ExtractedFilters = {};

  // 1. Gender Match
  if (/\b(men|man|gentlemen|boy|male)s?\b/.test(query)) {
    filters.gender = "Men";
  } else if (/\b(women|woman|lady|ladies|girl|female)s?\b/.test(query)) {
    filters.gender = "Women";
  } else if (/\b(unisex)s?\b/.test(query)) {
    filters.gender = "Unisex";
  }

  // 2. Category Match
  const categoriesList = ["tops", "bottoms", "couture", "accessories", "shirts", "t-shirts", "hoodies", "cargos", "jackets", "sweaters"];
  const matchedCategories: string[] = [];
  for (const cat of categoriesList) {
    const regex = new RegExp(`\\b${cat.replace("-", "\\-")}s?\\b`);
    if (regex.test(query)) {
      // Normalize category name for matching data
      if (cat === "t-shirts") matchedCategories.push("T-Shirts");
      else if (cat === "shirts") matchedCategories.push("Shirts");
      else matchedCategories.push(cat.charAt(0).toUpperCase() + cat.slice(1));
    }
  }
  if (matchedCategories.length > 0) {
    filters.categories = matchedCategories;
  }

  // 3. Price Limit Match (e.g., "under 50000", "below 150000", "under ₹80,000")
  const priceMatch = query.match(/\b(?:under|below|less than|max|budget)\s*(?:rs\.?|inr|₹)?\s*(\d+[\d,]*)\b/);
  if (priceMatch) {
    const rawVal = priceMatch[1].replace(/,/g, "");
    filters.priceLimit = parseInt(rawVal, 10);
  }

  // 4. Color Match
  const colors = ["black", "white", "red", "blue", "green", "pink", "yellow", "orange", "grey", "gray", "purple", "gold", "silver", "brown", "beige", "navy", "noir"];
  for (const c of colors) {
    if (new RegExp(`\\b${c}\\b`).test(query)) {
      filters.color = c === "noir" ? "black" : c;
      break;
    }
  }

  // 5. Fabric Match
  const fabrics = ["cotton", "silk", "polyester", "denim", "leather", "wool", "linen", "velvet", "satin", "crepe", "georgette", "nylon", "viscose", "cashmere"];
  for (const f of fabrics) {
    if (new RegExp(`\\b${f}\\b`).test(query)) {
      filters.fabric = f;
      break;
    }
  }

  // 6. Brand / House Match
  const brands = [
    { key: "lumiere", name: "Maison Lumière" },
    { key: "reine", name: "Atelier Reine" },
    { key: "onyx", name: "Studio Onyx" },
    { key: "curvy", name: "Curvy Couture" },
    { key: "rose", name: "Rose Éternelle" },
    { key: "velvet", name: "Velvet & Co." }
  ];
  for (const b of brands) {
    if (query.includes(b.key)) {
      filters.brand = b.name;
      break;
    }
  }

  // 7. Custom Tags Match (e.g., new, trending, limited, classic)
  const tags = ["new", "trending", "limited", "classic", "bestseller"];
  const matchedTags: string[] = [];
  for (const t of tags) {
    if (new RegExp(`\\b${t}s?\\b`).test(query)) {
      matchedTags.push(t);
    }
  }
  if (matchedTags.length > 0) {
    filters.customTags = matchedTags;
  }

  return filters;
}

interface ProductCardProps {
  product: any;
  idx: number;
  isRelated?: boolean;
  isWishlisted: boolean;
  onWishlist: (product: any, e: React.MouseEvent) => void;
  onAddToCart: (product: any, e: React.MouseEvent) => void;
}

function ProductCard({ product, idx, isRelated = false, isWishlisted, onWishlist, onAddToCart }: ProductCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = useCallback((e: React.MouseEvent) => {
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

  const handleLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
    }
  }, []);

  // 1. Get images (support array or single image)
  const images = product.images || product.gallery || (product.image ? [product.image] : []);

  // 2. Calculate discounted price if applicable
  const pct = product.discount || 0;
  const hasDiscount = !!(pct || product.originalPrice);
  
  // Format price helper (ensure rupees symbol and correct currency format)
  const formatPrice = (pStr: any) => {
    if (pStr === undefined || pStr === null) return "";
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
      displayPct = Math.round(((orig - curr) / orig) * 100);
    }
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  return (
    <FadeUp delay={idx * 0.05 + (isRelated ? 0.15 : 0)}>
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group glass glass-reflect glass-edge relative overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)] flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Product Image Container */}
        <div 
          className="w-full md:w-48 lg:w-56 aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal/5 shrink-0 relative"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          {images.length > 0 ? (
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {displayPct > 0 && (
            <span className="glass-strong glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-ink z-10">
              {displayPct}% OFF
            </span>
          )}

          <motion.button
            type="button"
            onClick={(e) => onWishlist(product, e)}
            whileTap={{ scale: 0.8 }}
            className={cn(
              "glass glass-strong absolute right-2 top-2 z-[3] flex h-9 w-9 items-center justify-center rounded-full transition-shadow duration-300 sm:right-3 sm:top-3 sm:h-11 sm:w-11",
              isWishlisted && "shadow-[0_0_20px_-2px_rgba(200,169,106,0.6)]"
            )}
          >
            <motion.span
              key={String(isWishlisted)}
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 480, damping: 15 }}
              className="flex"
            >
              <Heart
                size={15}
                strokeWidth={1.8}
                className={cn(
                  "transition-colors duration-300",
                  isWishlisted ? "fill-gold text-gold" : "text-ink"
                )}
              />
            </motion.span>
          </motion.button>

          {/* Left/Right Navigation on Hover if more than 1 image */}
          {images.length > 1 && isImageHovered && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/70 transition-colors z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/70 transition-colors z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Add to Bag slides up inside image - desktop only */}
          <div className="absolute inset-x-3 bottom-3 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 z-10 hidden md:block">
            <button
              type="button"
              onClick={(e) => onAddToCart(product, e)}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105"
            >
              <ShoppingBag size={14} strokeWidth={2} />
              Add to Bag
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 w-full text-center md:text-left flex flex-col justify-between py-2 z-20">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent/90 block mb-1">
              {product.house}
            </span>
            
            <Link to="/product/$productId" params={{ productId: product.id }} className="block">
              <h3 
                className="font-serif text-xl md:text-2xl text-foreground hover:text-accent transition-colors duration-300 inline-block cursor-pointer"
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
              >
                {product.name}
              </h3>
            </Link>
            
            {/* Metadata Tags / Sizes Transition */}
            <div className="relative h-8 mt-3 overflow-hidden">
              <div className={`absolute inset-0 flex flex-wrap items-center justify-center md:justify-start gap-2 transition-all duration-300 ${isTitleHovered ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"}`}>
                {product.gender && (
                  <span className="text-[9px] uppercase tracking-wider bg-foreground/5 border border-foreground/10 px-2.5 py-1 rounded-full text-muted-foreground">
                    {product.gender}
                  </span>
                )}
                {product.category && (
                  <span className="text-[9px] uppercase tracking-wider bg-foreground/5 border border-foreground/10 px-2.5 py-1 rounded-full text-muted-foreground">
                    {product.category}
                  </span>
                )}
              </div>
              <div className={`absolute inset-0 flex flex-wrap items-center justify-center md:justify-start gap-1.5 transition-all duration-300 ${isTitleHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                <span className="text-[9px] uppercase tracking-widest text-accent font-bold mr-1">Sizes:</span>
                {(product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).map((size: string) => (
                  <span key={size} className="text-[9px] font-bold bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Price with Discount */}
            <div className="flex items-baseline gap-2 justify-center md:justify-start">
              <span className="text-xl font-semibold text-foreground">
                {finalPrice}
              </span>
              {hasDiscount && (
                <>
                  <span className="line-through text-xs text-muted-foreground">
                    {originalPriceDisplay}
                  </span>
                  {displayPct > 0 && (
                    <span className="text-xs text-emerald-500 font-bold">
                      ({displayPct}% OFF)
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
              <button
                onClick={(e) => onAddToCart(product, e)}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>

              <Link
                to="/product/$productId"
                params={{ productId: product.id }}
                className="p-3 rounded-full border border-foreground/10 hover:border-accent/40 text-foreground hover:text-accent transition-all duration-300 hover:scale-105"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

function SearchResultsPage() {
  const { q = "" } = Route.useSearch();
  const { state, toggleShopWishlist, addToShopCart } = usePortal();
  const quickAdd = useContext(QuickAddContext);

  const products = (state.products || []).filter(p => !p.status || p.status === "PUBLISHED" || p.status === "published");
  const user = state.user;

  // Split query into keywords
  const keywords = q.toLowerCase().trim().split(/\s+/).filter(Boolean);

  let mainProducts: typeof products = [];
  let relatedProducts: typeof products = [];

  if (keywords.length > 0) {
    products.forEach((p: any) => {
      let score = 0;
      keywords.forEach((kw: string) => {
        const name = (p.name || "").toLowerCase();
        const house = (p.house || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const gender = (p.gender || "").toLowerCase();
        const fabric = (p.fabricMaterial || "").toLowerCase();
        const tags = (p.tags || []).map((t: string) => t.toLowerCase());
        const tag = (p.tag || "").toLowerCase();

        // Check gender
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

        // Check category (handle plurals/singulars, e.g. "t-shirt" vs "t-shirts")
        const catNorm = category.replace("s", "");
        const kwNorm = kw.replace("s", "");
        if (catNorm.includes(kwNorm) || kwNorm.includes(catNorm)) {
          score++;
          return;
        }

        // Check general text fields
        if (
          name.includes(kw) ||
          house.includes(kw) ||
          fabric.includes(kw) ||
          tag.includes(kw) ||
          tags.some((t: string) => t.includes(kw))
        ) {
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

  const handleWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to manage your wishlist");
      return;
    }
    toggleShopWishlist(user.id, product.id);
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
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

  const isWishlisted = (productId: string) => {
    if (!user) return false;
    return (state.shopWishlist[user.id] || []).includes(productId);
  };

  const totalFound = mainProducts.length + relatedProducts.length;

  return (
    <div className="min-h-screen py-24 px-4 lg:px-8 max-w-6xl mx-auto">
      {/* Search Header */}
      <div className="mb-12 text-center">
        <FadeUp>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search Curation</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground">
            Curation for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 font-semibold italic">
              "{q || "All Curation"}"
            </span>
          </h1>
          <p className="mt-4 text-xs md:text-sm text-muted-foreground max-w-md mx-auto uppercase tracking-widest leading-relaxed">
            {totalFound} {totalFound === 1 ? "Product" : "Products"} Found
          </p>
        </FadeUp>
      </div>

      {/* Product Lists */}
      <div className="space-y-12">
        {mainProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {mainProducts.map((product, idx) => (
              <ProductCard 
                key={product.id}
                product={product}
                idx={idx}
                isRelated={false}
                isWishlisted={isWishlisted(product.id)}
                onWishlist={handleWishlist}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="text-left border-t border-white/10 pt-8 pb-2">
              <h2 className="font-serif text-2xl text-accent italic">Related Curations</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                You might also be interested in these matching styles
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {relatedProducts.map((product, idx) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  idx={idx}
                  isRelated={true}
                  isWishlisted={isWishlisted(product.id)}
                  onWishlist={handleWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}

        {totalFound === 0 && (
          <FadeUp>
            <div className="liquid-glass border border-white/10 p-12 text-center space-y-6">
              <p className="text-sm text-muted-foreground uppercase tracking-widest">
                No products found matching your search.
              </p>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:underline"
              >
                <span>Browse All Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
