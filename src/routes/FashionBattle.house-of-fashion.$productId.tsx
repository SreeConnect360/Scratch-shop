import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, Heart, Check } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp } from "@/components/motion/Reveal";
import { PRODUCTS } from "@/lib/data";
import { usePortal } from "@/lib/portal-state";
import { toast } from "sonner";

export const Route = createFileRoute("/FashionBattle/house-of-fashion/$productId")({
  loader: ({ params }) => {
    const product = PRODUCTS.find(p => p.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} — ${loaderData.product.house}` },
      { name: "description", content: `${loaderData.product.name} by ${loaderData.product.house}.` },
      { property: "og:image", content: loaderData.product.image },
    ] : [],
  }),
  notFoundComponent: () => (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div>
          <p className="editorial-label text-accent">404</p>
          <h1 className="mt-3 font-serif text-5xl">Piece not found</h1>
          <Link to="/FashionBattle/house-of-fashion" className="mt-6 inline-block editorial-label hover:text-accent">← Boutique</Link>
        </div>
      </div>
    </PublicLayout>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { state, addToCart, toggleWishlist } = usePortal();
  const [added, setAdded] = useState(false);
  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);
  const wishlist = state.user ? (state.wishlist[state.user.id] ?? []) : [];

  const handleWishlist = (e: React.MouseEvent, productId: string, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.user) {
      toast.error("Please sign in to manage your wishlist.");
      return;
    }
    const wasInWishlist = wishlist.includes(productId);
    toggleWishlist(state.user.id, productId);
    toast.success(wasInWishlist ? `${productName} removed from wishlist.` : `${productName} added to wishlist!`);
  };

  const onAdd = () => {
    addToCart({ productId: product.id, name: product.name, house: product.house, price: product.price, image: product.image });
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <PublicLayout>
      <section className="px-6 lg:px-16 pt-24 pb-16 grid lg:grid-cols-2 gap-12">
        <FadeUp>
          <div className="aspect-[3/4] overflow-hidden bg-surface">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover img-cinematic" />
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="lg:sticky lg:top-12">
            <p className="editorial-eyebrow text-accent">{product.house}</p>
            <h1 className="mt-3 font-serif text-5xl lg:text-6xl">{product.name}</h1>
            <div className="mt-6 font-serif text-3xl">{product.price}</div>
            <p className="mt-6 text-muted-foreground max-w-md">An archival piece from the atelier — hand-finished in limited numbers. Curated for the ReeVibes editorial wardrobe.</p>

            <div className="mt-10 space-y-3">
              <div className="editorial-label text-muted-foreground">Size</div>
              <div className="flex gap-2">
                {["XS","S","M","L","XL","XXL"].map(s => (
                  <button key={s} className="w-12 h-12 border border-border-subtle editorial-label hover:border-accent hover:text-accent transition-colors">{s}</button>
                ))}
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button onClick={onAdd} className="flex-1 bg-foreground text-background py-4 editorial-label hover:bg-accent hover:text-white transition-colors inline-flex items-center justify-center gap-2">
                {added ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
              </button>
              <button
                onClick={(e) => handleWishlist(e, product.id, product.name)}
                className="w-14 h-14 border border-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Favorite"
              >
                <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-accent text-accent" : ""}`} />
              </button>
            </div>

            <dl className="mt-12 divide-y divide-border-subtle border-y border-border-subtle text-sm">
              <div className="flex justify-between py-3"><dt className="text-muted-foreground">Atelier</dt><dd>{product.house}</dd></div>
              <div className="flex justify-between py-3"><dt className="text-muted-foreground">Origin</dt><dd>Made in Italy</dd></div>
              <div className="flex justify-between py-3"><dt className="text-muted-foreground">Shipping</dt><dd>Complimentary worldwide</dd></div>
            </dl>
          </div>
        </FadeUp>
      </section>

      <section className="px-6 lg:px-16 py-16 border-t border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">You may also like</p></FadeUp>
        <FadeUp delay={0.05}><h2 className="mt-3 font-serif text-3xl mb-8">From the same season</h2></FadeUp>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map(p => (
            <Link key={p.id} to="/FashionBattle/house-of-fashion/$productId" params={{ productId: p.id }} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-surface relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover img-cinematic transition-transform duration-[1500ms] group-hover:scale-105" />
                <button
                  type="button"
                  onClick={(e) => handleWishlist(e, p.id, p.name)}
                  title={wishlist.includes(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                  className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 cursor-pointer"
                >
                  <Heart className={`w-4 h-4 transition-colors ${wishlist.includes(p.id) ? "fill-accent text-accent" : "text-white"}`} />
                </button>
              </div>
              <div className="mt-3 flex items-start justify-between">
                <div>
                  <div className="editorial-label text-muted-foreground">{p.house}</div>
                  <div className="font-serif text-lg mt-1">{p.name}</div>
                </div>
                <div className="font-serif">{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
