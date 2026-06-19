import { createFileRoute } from "@tanstack/react-router";
import { FadeUp } from "@/components/motion/Reveal";
import { PRODUCTS } from "@/lib/data";
import { usePortal } from "@/lib/portal-state";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/shop/categories")({
  head: () => ({ meta: [{ title: "Categories — ReeVibes" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { state, toggleShopWishlist, addToShopCart } = usePortal();
  const [selectedGender, setSelectedGender] = useState<"Men" | "Women">("Women");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Shirts", "T-Shirts", "Tops", "Bottoms"];

  const filteredProducts = PRODUCTS.filter(p => {
    if (p.gender !== selectedGender) return false;
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    return true;
  });

  const userWishlist = state.user ? (state.shopWishlist[state.user.id] || []) : [];

  return (
    <div className="space-y-8 pb-16">
      <header className="px-6 lg:px-16 pt-12 pb-12 border-b border-border-subtle bg-surface-2/20 backdrop-blur-md rounded-3xl mx-4 lg:mx-8">
        <FadeUp><p className="editorial-eyebrow text-accent">Browse Collections</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-6 font-serif text-5xl lg:text-7xl">Categories</h1></FadeUp>
        <FadeUp delay={0.2}><p className="mt-4 max-w-xl text-muted-foreground text-sm">Select your preferences below to discover our curated shirts, t-shirts, tops, and bottoms.</p></FadeUp>
      </header>

      {/* Gender & Category Toggle Controls */}
      <section className="px-6 lg:px-16 py-8 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-background">
        {/* Gender Toggle */}
        <div className="flex gap-2">
          {(["Women", "Men"] as const).map(g => (
            <button
              key={g}
              onClick={() => {
                setSelectedGender(g);
                setSelectedCategory("All");
              }}
              className={`px-8 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${
                selectedGender === g 
                  ? "bg-foreground text-background border border-foreground" 
                  : "border border-border-subtle text-foreground hover:border-foreground"
              }`}
            >
              {g}'s Fashion
            </button>
          ))}
        </div>

        {/* Category List */}
        <div className="flex items-center gap-4 overflow-x-auto editorial-label text-xs uppercase tracking-wider text-muted-foreground">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`pb-1.5 transition-colors whitespace-nowrap ${
                selectedCategory === c ? "text-accent border-b-2 border-accent font-semibold" : "hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 lg:px-16 py-16 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 bg-background">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-sm text-muted-foreground italic">
            No items found in this category.
          </div>
        ) : (
          filteredProducts.map((p, i) => {
            const isWishlisted = userWishlist.includes(p.id);
            return (
              <FadeUp key={p.id} delay={(i % 6) * 0.05}>
                <div className="group cursor-pointer flex flex-col justify-between h-full border border-border-subtle/40 p-4 bg-surface-2 rounded-3xl">
                  <div>
                    <div className="aspect-[3/4] overflow-hidden bg-surface relative rounded-2xl">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover img-cinematic transition-transform duration-[1500ms] group-hover:scale-105" />
                      {p.tag && <div className="absolute top-3 left-3 bg-white text-black editorial-label px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold">{p.tag}</div>}
                      
                      {/* Wishlist Button Overlay */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!state.user) {
                            alert("Please sign in or register to save items to your wishlist!");
                            return;
                          }
                          toggleShopWishlist(state.user.id, p.id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-md hover:bg-background rounded-full transition-colors"
                      >
                        <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-foreground"}`} />
                      </button>
                    </div>
                    <div className="mt-4 flex items-start justify-between">
                      <div>
                        <div className="editorial-label text-muted-foreground text-[10px]">{p.house}</div>
                        <div className="font-serif text-lg mt-1 line-clamp-1">{p.name}</div>
                      </div>
                      <div className="font-serif text-base font-bold whitespace-nowrap">{p.price}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addToShopCart({ productId: p.id, name: p.name, house: p.house, price: p.price, image: p.image, selectedSize: "M" });
                      alert("Item added to Cart!");
                    }}
                    className="mt-6 flex items-center justify-center gap-2 bg-foreground text-background py-3 text-xs uppercase tracking-widest font-bold hover:bg-accent hover:text-white transition-colors rounded-full"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              </FadeUp>
            );
          })
        )}
      </section>
    </div>
  );
}
