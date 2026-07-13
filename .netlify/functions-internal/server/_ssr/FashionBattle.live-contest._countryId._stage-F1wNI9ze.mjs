import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useParams, L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PublicLayout } from "./PublicLayout-DIee0132.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { l as useAppStore, C as CONTESTANTS } from "./router-C_drxgJo.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
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
function StageView() {
  const {
    countryId,
    stage
  } = useParams({
    from: "/live-contest/$countryId/$stage"
  });
  const {
    state
  } = useAppStore();
  const stageKey = stage.toLowerCase();
  const inStage = Object.entries(state.positions).filter(([, pos]) => pos.toLowerCase().replace(/[^a-z0-9]/g, "") === stageKey.replace(/[^a-z0-9]/g, "")).map(([id]) => CONTESTANTS.find((c) => c.id === id)).filter((c) => !!c).filter((c) => c.country.toLowerCase() === countryId.toLowerCase() || countryId.toLowerCase() === "global");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-24 pb-10 border-b border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "editorial-eyebrow text-accent", children: [
        countryId,
        " · Stage"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-5xl lg:text-7xl capitalize", children: stage.replace(/-/g, " ") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-muted-foreground text-sm", children: [
        "Voting is ",
        state.voting.open ? "open" : "closed by the editor",
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 lg:px-16 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      inStage.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full text-center py-16 text-muted-foreground", children: [
        "No contestants tagged for this stage yet.",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/live-contest", className: "text-accent", children: "View all battles →" })
      ] }),
      inStage.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/FashionBattle/contestants/$slug", params: {
        slug: c.slug
      }, className: "group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.image, alt: c.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-xl", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: c.country })
        ] })
      ] }, c.id))
    ] })
  ] });
}
export {
  StageView as component
};
