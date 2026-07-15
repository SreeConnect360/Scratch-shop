import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { CinematicImage, FadeUp } from "@/components/motion/Reveal";
import { PRODUCTS, CAMPAIGNS } from "@/lib/data";
import { usePortal } from "@/lib/portal-state";

export const Route = createFileRoute("/FashionBattle/house-of-fashion")({
  head: () => ({ meta: [{ title: "House of Fashion — ReeVibes" }, { name: "description", content: "Discover the curated maisons and editorial collections of the ReeVibes ecosystem." }] }),
  component: HousePage,
});

function HousePage() {
  const { state, toggleWishlist } = usePortal();
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

  return (
    <PublicLayout>
      <header className="px-6 lg:px-16 pt-24 pb-12 border-b border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">The Boutique</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-6 font-serif text-6xl lg:text-8xl">House of Fashion</h1></FadeUp>
        <FadeUp delay={0.2}><p className="mt-6 max-w-xl text-muted-foreground">A curated edit of the season's most coveted pieces — from the ateliers worn by our Angels.</p></FadeUp>
      </header>

      <section className="px-6 lg:px-16 py-12 border-b border-border-subtle">
        <div className="flex items-center gap-6 overflow-x-auto editorial-label text-muted-foreground">
          {["All", "Atelier", "Ready-to-Wear", "Couture", "Accessories", "Beauty"].map((c, i) => (
            <button key={c} className={i === 0 ? "text-foreground border-b border-accent pb-2" : "hover:text-foreground pb-2"}>{c}</button>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-16 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
        {PRODUCTS.map((p, i) => (
          <FadeUp key={p.id} delay={(i % 6) * 0.05}>
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden bg-surface relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover img-cinematic transition-transform duration-[1500ms] group-hover:scale-105" />
                {p.tag && <div className="absolute top-3 left-3 bg-white text-black editorial-label px-2.5 py-1">{p.tag}</div>}
                <button
                  type="button"
                  onClick={(e) => handleWishlist(e, p.id, p.name)}
                  title={wishlist.includes(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                  className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 cursor-pointer"
                >
                  <Heart className={`w-4 h-4 transition-colors ${wishlist.includes(p.id) ? "fill-accent text-accent" : "text-white"}`} />
                </button>
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <div className="editorial-label text-muted-foreground">{p.house}</div>
                  <div className="font-serif text-xl mt-1">{p.name}</div>
                </div>
                <div className="font-serif text-lg">{p.price}</div>
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      <section className="px-6 lg:px-16 py-20 border-t border-border-subtle bg-surface">
        <FadeUp><p className="editorial-eyebrow text-accent">Campaigns</p></FadeUp>
        <FadeUp delay={0.1}><h2 className="mt-4 font-serif text-4xl mb-10">Editorial Stories</h2></FadeUp>
        <div className="grid md:grid-cols-2 gap-1">
          {CAMPAIGNS.slice(0, 4).map((c) => (
            <div key={c.id} className="group relative aspect-[16/10] overflow-hidden">
              <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover img-cinematic transition-transform duration-[1500ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="editorial-label text-white/70">{c.season} · {c.tag}</div>
                <div className="font-serif text-3xl mt-2">{c.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
