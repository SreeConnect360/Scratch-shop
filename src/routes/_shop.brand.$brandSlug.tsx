import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePortal } from "@/lib/portal-state";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useEffect } from "react";

export const Route = createFileRoute("/_shop/brand/$brandSlug")({
  component: BrandProductsPage,
});

function BrandProductsPage() {
  const { brandSlug } = Route.useParams();
  const { state, toggleShopWishlist, addToShopCart } = usePortal();
  const navigate = useNavigate();

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const inWishlist = state.user ? (state.wishlist[state.user.id] || []).some((item: any) => item.id === product.id) : false;
              
              // Handle pricing details
              const pct = product.discount || 0;
              const hasDiscount = !!(pct || product.originalPrice);
              let finalPrice = product.price;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 hover:shadow-xl hover:shadow-gold/5"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={product.image || product.img}
                      alt={product.name}
                      onClick={() => navigate({ to: "/product/$productId", params: { productId: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") } })}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={() => {
                        if (!state.user) {
                          toast.error("Please login to manage wishlist");
                          return;
                        }
                        toggleShopWishlist(state.user.id, product.id);
                      }}
                      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground transition-all duration-300 hover:bg-background hover:scale-110"
                    >
                      <Heart
                        className={`h-4.5 w-4.5 ${inWishlist ? "fill-gold text-gold" : "text-foreground"}`}
                      />
                    </button>

                    {/* Discount badge */}
                    {hasDiscount && (
                      <div className="absolute left-3 top-3 z-10 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-black">
                        Sale
                      </div>
                    )}
                  </div>

                  {/* Info Container */}
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gold mb-1">
                      {getProductBrand(product)}
                    </span>
                    <h3
                      onClick={() => navigate({ to: "/product/$productId", params: { productId: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") } })}
                      className="font-serif text-sm text-foreground/90 group-hover:text-gold transition-colors line-clamp-1 cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-foreground/90">{finalPrice}</span>
                      </div>

                      {/* Add to Cart button */}
                      <button
                        onClick={() => {
                          const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Free Size";
                          addToShopCart({
                            productId: product.id,
                            name: product.name,
                            house: getProductBrand(product),
                            price: product.price,
                            image: product.image || product.img,
                            qty: 1,
                            selectedSize: size
                          });
                          toast.success("Added to shopping bag");
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold transition-all duration-300 hover:bg-gold hover:text-black"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
