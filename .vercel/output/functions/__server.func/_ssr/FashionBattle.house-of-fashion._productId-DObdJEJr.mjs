import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PublicLayout } from "./PublicLayout-DQjLDRSD.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { F as Route$c, u as usePortal, P as PRODUCTS } from "./router-CgqY8r00.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { ag as Check, f as ShoppingBag, a9 as Heart } from "../_libs/lucide-react.mjs";
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
function ProductPage() {
  const {
    product
  } = Route$c.useLoaderData();
  const {
    addToCart
  } = usePortal();
  const [added, setAdded] = reactExports.useState(false);
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  const onAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      house: product.house,
      price: product.price,
      image: product.image
    });
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 lg:px-16 pt-24 pb-16 grid lg:grid-cols-2 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] overflow-hidden bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: product.name, className: "w-full h-full object-cover img-cinematic" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:sticky lg:top-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: product.house }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-serif text-5xl lg:text-6xl", children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 font-serif text-3xl", children: product.price }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-muted-foreground max-w-md", children: "An archival piece from the atelier — hand-finished in limited numbers. Curated for the ReeVibes editorial wardrobe." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: "Size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["XS", "S", "M", "L", "XL", "XXL"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-12 h-12 border border-border-subtle editorial-label hover:border-accent hover:text-accent transition-colors", children: s }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onAdd, className: "flex-1 bg-foreground text-background py-4 editorial-label hover:bg-accent hover:text-white transition-colors inline-flex items-center justify-center gap-2", children: added ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
            " Added"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4" }),
            " Add to Cart"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-14 h-14 border border-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center", "aria-label": "Favorite", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-12 divide-y divide-border-subtle border-y border-border-subtle text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Atelier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: product.house })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Origin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "Made in Italy" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "Complimentary worldwide" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 lg:px-16 py-16 border-t border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "You may also like" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.05, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-serif text-3xl mb-8", children: "From the same season" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-6", children: related.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/FashionBattle/house-of-fashion/$productId", params: {
        productId: p.id
      }, className: "group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] overflow-hidden bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, alt: p.name, className: "w-full h-full object-cover img-cinematic transition-transform duration-[1500ms] group-hover:scale-105" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: p.house }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg mt-1", children: p.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif", children: p.price })
        ] })
      ] }, p.id)) })
    ] })
  ] });
}
export {
  ProductPage as component
};
