import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useState, useEffect } from "react";
import { usePortal } from "@/lib/portal-state";
import { ArrowRight, Sparkles } from "lucide-react";
import { FadeUp } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/public/ProductCard";

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

function SearchResultsPage() {
  const { q = "" } = Route.useSearch();
  const { state, toggleShopWishlist, addToShopCart, reloadProducts, isProductsLoading } = usePortal();

  // Force refetch backend products on search page load to ensure real DB products are evaluated
  useEffect(() => {
    if (reloadProducts) {
      reloadProducts(true);
    }
  }, [reloadProducts]);

  // Exclude legacy dummy seed products so only live backend products display
  const products = (state.products || []).filter(
    p => (!p.status || p.status === "PUBLISHED" || p.status === "published") &&
    p.id !== "pr1" && p.id !== "pr2" && p.id !== "pr3" && p.id !== "pr4" && p.id !== "pr5" && p.id !== "pr6" &&
    p.id !== "prm1" && p.id !== "prm2" && p.id !== "prm3" && p.id !== "prm4" &&
    p.id !== "prw7" && p.id !== "prw8" && p.id !== "prw9"
  );
  const user = state.user;
  const wishlist = state.shopWishlist[user?.id || ""];

  // Responsive: detect desktop (md breakpoint = 768px)
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const cardVariant = isDesktop ? "horizontal" as const : "default" as const;

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

        // Check category (handle plurals/singulars)
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

  const totalFound = mainProducts.length + relatedProducts.length;

  return (
    <div className="min-h-screen py-24 px-4 lg:px-8 max-w-4xl mx-auto">
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
            {isProductsLoading ? "Searching Catalog..." : `${totalFound} ${totalFound === 1 ? "Product" : "Products"} Found`}
          </p>
        </FadeUp>
      </div>

      {/* Product Lists */}
      <div className="space-y-12">
        {isProductsLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl md:rounded-3xl h-48 animate-pulse bg-white/5 p-4 flex flex-col md:flex-row gap-4 border border-white/10">
                <div className="w-full md:w-48 h-full bg-white/10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-5 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-3 bg-white/5 rounded w-1/4 mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {mainProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-5">
                {mainProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    p={product}
                    toggleShopWishlist={toggleShopWishlist}
                    addToShopCart={addToShopCart}
                    wishlist={wishlist}
                    variant={cardVariant}
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
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6">
                  {relatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      p={product}
                      toggleShopWishlist={toggleShopWishlist}
                      addToShopCart={addToShopCart}
                      wishlist={wishlist}
                      variant={cardVariant}
                    />
                  ))}
                </div>
              </div>
            )}

            {!isProductsLoading && totalFound === 0 && (
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
          </>
        )}
      </div>
    </div>
  );
}
