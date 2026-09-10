import { createFileRoute, Link } from "@tanstack/react-router";
import { usePortal } from "@/lib/portal-state";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { ProductCard } from "@/components/public/ProductCard";

export const Route = createFileRoute("/_shop/category/$categorySlug")({
  component: CategoryProductsPage,
});

function CategoryProductsPage() {
  const { categorySlug } = Route.useParams();
  const { state, toggleShopWishlist, addToShopCart } = usePortal();

  // Find category display name from the slug
  const allProducts = (state.products && state.products.length > 0) ? (state.products as any[]) : [];
  const activeCategory = allProducts.find(
    (p) => p.category && p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === categorySlug
  )?.category || categorySlug.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  // Filter products by category slug (support category, type, and categoriesList)
  const filteredProducts = allProducts.filter((p: any) => {
    const slug = categorySlug.toLowerCase();
    const pCat = (p.category || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const pType = (p.type || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const pList = Array.isArray(p.categoriesList) ? p.categoriesList.map((c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-")) : [];
    const matches = pCat === slug || pType === slug || pList.includes(slug) || pCat.includes(slug) || slug.includes(pCat);
    const st = String(p.status || "PUBLISHED").toUpperCase();
    const vis = String(p.visibility || "VISIBLE").toUpperCase();
    return matches && st !== "DELETED" && st !== "DRAFT" && vis !== "HIDDEN";
  });

  const wishlist = state.user ? (state.shopWishlist[state.user.id] || []) : [];

  useEffect(() => {
    document.title = `${activeCategory} — ReeVibes`;
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </Link>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide capitalize mb-2">
          {activeCategory}
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Curated statement pieces in {activeCategory}. Hand-picked for timeless elegance and contemporary sophistication.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center py-12 border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-md">
            <p className="text-muted-foreground text-sm mb-4">No statement pieces found in this category.</p>
            <Link
              to="/categories"
              className="border border-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
            >
              Explore All Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                p={product}
                toggleShopWishlist={toggleShopWishlist}
                addToShopCart={addToShopCart}
                wishlist={wishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
