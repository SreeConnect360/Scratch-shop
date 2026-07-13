import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PublicLayout } from "./PublicLayout-DsBdhFEV.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { P as PRODUCTS, z as CAMPAIGNS } from "./router-BFsnZUKW.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/lucide-react.mjs";
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
function HousePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-24 pb-12 border-b border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "The Boutique" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-6xl lg:text-8xl", children: "House of Fashion" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-muted-foreground", children: "A curated edit of the season's most coveted pieces — from the ateliers worn by our Angels." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 lg:px-16 py-12 border-b border-border-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-6 overflow-x-auto editorial-label text-muted-foreground", children: ["All", "Atelier", "Ready-to-Wear", "Couture", "Accessories", "Beauty"].map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: i === 0 ? "text-foreground border-b border-accent pb-2" : "hover:text-foreground pb-2", children: c }, c)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 lg:px-16 py-16 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16", children: PRODUCTS.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: i % 6 * 0.05, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group cursor-pointer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[3/4] overflow-hidden bg-surface relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, alt: p.name, className: "w-full h-full object-cover img-cinematic transition-transform duration-[1500ms] group-hover:scale-105" }),
        p.tag && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3 bg-white text-black editorial-label px-2.5 py-1", children: p.tag })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: p.house }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-xl mt-1", children: p.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg", children: p.price })
      ] })
    ] }) }, p.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 lg:px-16 py-20 border-t border-border-subtle bg-surface", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Campaigns" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-serif text-4xl mb-10", children: "Editorial Stories" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-1", children: CAMPAIGNS.slice(0, 4).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative aspect-[16/10] overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.image, alt: c.title, className: "absolute inset-0 w-full h-full object-cover img-cinematic transition-transform duration-[1500ms] group-hover:scale-105" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-white/70", children: [
            c.season,
            " · ",
            c.tag
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-3xl mt-2", children: c.title })
        ] })
      ] }, c.id)) })
    ] })
  ] });
}
export {
  HousePage as component
};
