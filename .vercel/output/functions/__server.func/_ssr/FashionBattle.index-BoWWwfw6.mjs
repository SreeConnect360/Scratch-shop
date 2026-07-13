import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PublicLayout } from "./PublicLayout-DQjLDRSD.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { H as HERO_IMAGES } from "./router-CgqY8r00.mjs";
import { M as Marquee } from "./Marquee-D1BJev5N.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { K as Play, J as ArrowUpRight } from "../_libs/lucide-react.mjs";
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
function Home() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6 lg:px-16 pt-24 pb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-[calc(100vh-160px)] min-h-[500px] overflow-hidden rounded-lg border border-border-subtle shadow-2xl bg-zinc-950", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: HERO_IMAGES[0], alt: "ReeVibes Showcase", className: "w-full h-full object-cover object-[center_12%] select-none pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col justify-end p-8 md:p-16 space-y-6 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-6xl lg:text-7xl font-light tracking-wide text-white font-serif max-w-2xl leading-tight drop-shadow-md", children: [
          "Where curves",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "become editorial."
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/FashionBattle/live-contest", className: "group inline-flex items-center gap-3 bg-white text-zinc-950 px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-all duration-300 rounded shadow-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5 fill-current" }),
            " Enter the Live Contest"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/FashionBattle/apply", className: "group inline-flex items-center gap-3 border border-white/40 hover:border-white hover:bg-white hover:text-zinc-950 text-white px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded shadow-sm", children: [
            "Apply Contest ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SponsorsMarquee, {})
  ] });
}
function SponsorsMarquee() {
  const [sponsors, setSponsors] = reactExports.useState([]);
  reactExports.useEffect(() => {
    fetch("/api/sponsors?action=get-sponsors").then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) {
        setSponsors(data.filter((s) => s.status !== "Inactive"));
      }
    }).catch((err) => console.error("Error fetching homepage sponsors:", err));
  }, []);
  if (sponsors.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-16 border-t border-border-subtle overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent text-center mb-10", children: "Our Partners" }) }),
    sponsors.length > 5 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Marquee, { speed: 35, children: sponsors.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(PublicSponsorLogoFrame, { s }, `${s.id}-${idx}`)) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-center gap-6", children: sponsors.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(PublicSponsorLogoFrame, { s }, s.id)) })
  ] });
}
function PublicSponsorLogoFrame({
  s
}) {
  const isLink = !!s.url;
  const content = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden bg-white border border-border-subtle rounded transition-transform hover:scale-[1.02] flex items-center justify-center shrink-0 shadow-sm", style: {
    width: "120px",
    height: "72px",
    aspectRatio: "5/3",
    padding: "8px"
  }, children: s.logo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.logo, alt: s.name, className: "absolute inset-0 w-full h-full object-contain select-none pointer-events-none", style: {
    transform: `translate(${s.logoX || 0}%, ${s.logoY || 0}%) scale(${s.logoZoom || 1})`,
    transformOrigin: "center"
  } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center text-sm text-neutral-400 font-serif font-bold bg-neutral-100 uppercase", children: s.name ? s.name.split(" ").map((w) => w[0]).slice(0, 2).join("") : "SP" }) });
  if (isLink) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: s.url, target: "_blank", rel: "noopener noreferrer", className: "cursor-pointer block", children: content });
  }
  return content;
}
export {
  Home as component
};
