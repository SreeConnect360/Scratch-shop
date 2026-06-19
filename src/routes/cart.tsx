import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp } from "@/components/motion/Reveal";
import { usePortal, useCartTotal } from "@/lib/portal-state";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — ReeVibes" }, { name: "description", content: "Your selected pieces from the House of Fashion." }] }),
  component: CartPage,
});

function CartPage() {
  const { state, removeFromCart, clearCart } = usePortal();
  const { count, total } = useCartTotal();

  return (
    <PublicLayout>
      <header className="px-6 lg:px-16 pt-24 pb-10 border-b border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">The Edit</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-5xl lg:text-7xl">Your Cart</h1></FadeUp>
        <FadeUp delay={0.2}><p className="mt-4 text-muted-foreground">{count} piece{count === 1 ? "" : "s"} reserved · {state.cart.length ? `$${total.toLocaleString()}` : "—"}</p></FadeUp>
      </header>

      <section className="px-6 lg:px-16 py-16 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {state.cart.length === 0 ? (
            <div className="border border-dashed border-border-subtle p-20 text-center">
              <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground" />
              <h2 className="mt-6 font-serif text-3xl">Your cart is empty.</h2>
              <p className="mt-3 text-muted-foreground">Discover the season's most coveted pieces.</p>
              <Link to="/house-of-fashion" className="mt-8 inline-block bg-foreground text-background px-8 py-3.5 editorial-label hover:bg-accent hover:text-white transition-colors">Enter the Boutique</Link>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {state.cart.map((c) => (
                <div key={c.productId} className="py-6 flex items-center gap-6">
                  <img src={c.image} alt={c.name} className="w-24 h-32 object-cover" />
                  <div className="flex-1">
                    <div className="editorial-label text-muted-foreground">{c.house}</div>
                    <div className="font-serif text-xl mt-1">{c.name}</div>
                    <div className="editorial-label text-muted-foreground mt-2">Qty {c.qty}</div>
                  </div>
                  <div className="font-serif text-lg">{c.price}</div>
                  <button onClick={() => removeFromCart(c.productId)} className="p-2 text-muted-foreground hover:text-accent" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="border border-border-subtle p-8 bg-surface sticky top-6">
            <div className="editorial-eyebrow text-accent">Summary</div>
            <h3 className="mt-3 font-serif text-3xl">Order Total</h3>
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Complimentary</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duties</span><span>Calculated at checkout</span></div>
              <div className="hairline my-4" />
              <div className="flex justify-between font-serif text-2xl"><span>Total</span><span>${total.toLocaleString()}</span></div>
            </div>
            <button disabled className="mt-8 w-full bg-foreground text-background py-3.5 editorial-label disabled:opacity-60">Checkout — Coming Soon</button>
            {state.cart.length > 0 && (
              <button onClick={clearCart} className="mt-3 w-full text-xs text-muted-foreground hover:text-accent">Empty cart</button>
            )}
          </div>
        </aside>
      </section>
    </PublicLayout>
  );
}
