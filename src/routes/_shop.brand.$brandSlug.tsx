import { createFileRoute, Link } from "@tanstack/react-router";
import { usePortal } from "@/lib/portal-state";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { ProductCard } from "@/components/public/ProductCard";

export const Route = createFileRoute("/_shop/brand/$brandSlug")({
  component: BrandProductsPage,
});

function BrandProductsPage() {
  const { brandSlug } = Route.useParams();
  const { state, toggleShopWishlist, addToShopCart } = usePortal();

  const allProducts = (state.products as any[]) || [];

  // Helper function to check brand match
  const getProductBrand = (p: any) => p.brand || p.house || "Maison Curation";

  const activeBrand = allProducts.find(
    (p) => getProductBrand(p).toLowerCase().replace(/[^a-z0-9]+/g, "-") === brandSlug
  );
  const brandDisplayName = activeBrand ? getProductBrand(activeBrand) : brandSlug.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  // Filter products by brand slug
  const filteredProducts = allProducts.filter(
    (p) => getProductBrand(p).toLowerCase().replace(/[^a-z0-9]+/g, "-") === brandSlug && (!p.status || p.status === "PUBLISHED" || p.status === "published")
  );

  const wishlist = state.user ? (state.shopWishlist[state.user.id] || []) : [];

  useEffect(() => {
    document.title = `${brandDisplayName} — ReeVibes`;
  }, [brandDisplayName]);

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
          {brandDisplayName}
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Premium collection from {brandDisplayName}. Expertly crafted to elevate your wardrobe with modern sophistication.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center py-12 border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-md">
            <p className="text-muted-foreground text-sm mb-4">No statement pieces found from this brand.</p>
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
