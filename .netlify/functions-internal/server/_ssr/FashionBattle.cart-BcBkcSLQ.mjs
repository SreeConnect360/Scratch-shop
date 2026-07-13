import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PublicLayout } from "./PublicLayout-DIee0132.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { u as usePortal, a as useCartTotal } from "./router-C_drxgJo.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { f as ShoppingBag, T as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "node:fs";
import "node:path";
import "../_libs/xlsx.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/zod.mjs";
function CartPage() {
  const {
    state,
    removeFromCart,
    clearCart
  } = usePortal();
  const {
    count,
    total
  } = useCartTotal();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-24 pb-10 border-b border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "The Edit" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-5xl lg:text-7xl", children: "Your Cart" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-muted-foreground", children: [
        count,
        " piece",
        count === 1 ? "" : "s",
        " reserved · ",
        state.cart.length ? `$${total.toLocaleString()}` : "—"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 lg:px-16 py-16 grid lg:grid-cols-12 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-8", children: state.cart.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-border-subtle p-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8 mx-auto text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-6 font-serif text-3xl", children: "Your cart is empty." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Discover the season's most coveted pieces." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/house-of-fashion", className: "mt-8 inline-block bg-foreground text-background px-8 py-3.5 editorial-label hover:bg-accent hover:text-white transition-colors", children: "Enter the Boutique" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border-subtle", children: state.cart.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 flex items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.image, alt: c.name, className: "w-24 h-32 object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: c.house }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-xl mt-1", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground mt-2", children: [
            "Qty ",
            c.qty
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg", children: c.price }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeFromCart(c.productId), className: "p-2 text-muted-foreground hover:text-accent", "aria-label": "Remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
      ] }, c.productId)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "lg:col-span-4 lg:col-start-9", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface sticky top-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-eyebrow text-accent", children: "Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-serif text-3xl", children: "Order Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "$",
              total.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Complimentary" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Duties" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Calculated at checkout" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline my-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-serif text-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "$",
              total.toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: true, className: "mt-8 w-full bg-foreground text-background py-3.5 editorial-label disabled:opacity-60", children: "Checkout — Coming Soon" }),
        state.cart.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearCart, className: "mt-3 w-full text-xs text-muted-foreground hover:text-accent", children: "Empty cart" })
      ] }) })
    ] })
  ] });
}
export {
  CartPage as component
};
