import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PublicLayout } from "./PublicLayout-DIee0132.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
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
import "./router-C_drxgJo.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
function AngelsPage() {
  const [posts, setPosts] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    fetch("/api/angels").then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) {
        setPosts(data);
      }
    }).catch((err) => console.error("Error loading angels:", err)).finally(() => setIsLoading(false));
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-24 pb-16 border-b border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Hall of Fame" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-6xl lg:text-8xl", children: "Angels" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-muted-foreground", children: "The crowned winners of ReeVibes around the world — official representatives of our editorial vision." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 lg:px-16 py-16", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" }) }) : posts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 border border-dashed border-border-subtle max-w-md mx-auto my-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-serif text-lg", children: "No crowned winners posted yet." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto", children: posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: i * 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group overflow-hidden bg-surface dark:bg-zinc-950 border border-amber-500/20 dark:border-amber-500/10 shadow-2xl p-6 md:p-8 flex flex-col justify-between rounded-xl transition-all duration-500 hover:border-amber-500/40 hover:shadow-amber-500/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center mb-6 text-center z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 flex items-center justify-center max-w-[200px]", children: post.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.logoUrl, alt: `${post.countryName} Logo`, className: "max-h-12 w-auto object-contain dark:invert-0 filter dark:brightness-100" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-2xl tracking-widest text-amber-500/80 uppercase font-bold", children: post.countryName }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden rounded-lg border border-amber-500/30 bg-surface-2 shadow-inner group/photo", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 w-3 h-3 border-t border-l border-amber-500/50 z-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 w-3 h-3 border-t border-r border-amber-500/50 z-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber-500/50 z-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 w-3 h-3 border-b border-r border-amber-500/50 z-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.winnerPhotoUrl, alt: post.winnerName || "Winner", className: "w-full h-full object-cover img-cinematic transition-transform duration-[2000ms] group-hover/photo:scale-105" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 text-center z-10 flex flex-col items-center gap-3", children: [
        post.winnerName && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block px-4 py-1.5 border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 font-serif text-lg tracking-wider rounded", children: post.winnerName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-accent font-serif tracking-widest uppercase text-xs font-semibold mb-1", children: "Official Coronation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-serif text-2xl text-foreground font-semibold", children: [
            "ReeVibes ",
            post.countryName,
            " ",
            post.year,
            " Winner"
          ] })
        ] })
      ] })
    ] }) }, post.angelsPostId)) }) })
  ] });
}
export {
  AngelsPage as component
};
