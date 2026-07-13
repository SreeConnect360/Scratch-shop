import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PublicLayout } from "./PublicLayout-u1w3O0qP.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { b as useTheme } from "./router-C0nupAs3.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { v as Camera, al as Globe, aa as Award, X, ap as Calendar } from "../_libs/lucide-react.mjs";
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
function PhotographyPage() {
  const {
    theme
  } = useTheme();
  const [portfolio, setPortfolio] = reactExports.useState([]);
  const [selectedPhoto, setSelectedPhoto] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const loadPortfolio = () => {
      try {
        const raw = window.localStorage.getItem("reevibes:best-photography:portfolio");
        if (raw) {
          const list = JSON.parse(raw);
          setPortfolio(list.filter((item) => item.publishStatus === "published"));
        } else {
          setPortfolio([]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadPortfolio();
    window.addEventListener("storage", loadPortfolio);
    const interval = setInterval(loadPortfolio, 1e3);
    return () => {
      window.removeEventListener("storage", loadPortfolio);
      clearInterval(interval);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-28 pb-16 border-b border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Visual Archive" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-6xl lg:text-8xl", children: "Best Photography" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-muted-foreground", children: "A dynamic curated showcase of this season's most evocative editorial frames — captured live by our network of master photographers." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 lg:px-16 py-16 min-h-[40vh]", children: portfolio.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-border-subtle py-24 text-center rounded max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-8 h-8 mx-auto text-muted-foreground/40 mb-4 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl text-foreground/80 mb-2", children: "No Published Work Yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mx-auto", children: "Photographers and administrators have not published any best photography portfolios for the live contest stages yet." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-12 gap-6", children: portfolio.map((w, i) => {
      const span = i % 6 === 0 ? "col-span-12 md:col-span-8 aspect-[16/10]" : i % 5 === 0 ? "col-span-12 md:col-span-4 aspect-[4/5]" : "col-span-12 sm:col-span-6 md:col-span-4 aspect-[3/4]";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${span} flex flex-col group cursor-pointer`, onClick: () => setSelectedPhoto(w), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex-1 overflow-hidden bg-black/5 border border-border-subtle rounded relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: w.photoUrl, alt: w.alt || `By ${w.photographerName}`, className: "w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white uppercase tracking-[0.2em] font-mono font-semibold", children: "View Editorial Frame" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg font-bold text-foreground leading-tight", children: w.contestantName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 font-mono uppercase mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3 text-muted-foreground/60" }),
              " ",
              w.countryName,
              " · ",
              w.year
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-accent/10 border border-accent/20 px-2.5 py-1 rounded text-accent flex items-center gap-1.5 shrink-0 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-wider font-semibold font-mono", children: w.photographerName })
          ] })
        ] })
      ] }, w.portfolioId);
    }) }) }),
    selectedPhoto && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh] text-foreground animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-5 h-5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent", children: "Visual Archive · Best Photography Details" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedPhoto(null), className: "p-2 text-muted-foreground hover:text-foreground rounded border border-transparent hover:border-border-subtle transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto flex-1 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-12 gap-8 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-7 flex justify-center bg-black/5 border border-border-subtle/50 rounded overflow-hidden p-2 aspect-[3/4] max-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedPhoto.photoUrl, alt: selectedPhoto.alt || `By ${selectedPhoto.photographerName}`, className: "max-w-full max-h-full object-contain rounded" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent font-mono", children: "Contestant" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-3xl font-bold mt-1 text-foreground leading-tight", children: selectedPhoto.contestantName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 font-mono text-sm text-muted-foreground border-y border-border-subtle py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4 text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Country: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: selectedPhoto.countryName })
              ] })
            ] }),
            selectedPhoto.year && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Edition / Year: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: selectedPhoto.year })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-4 h-4 text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Position Tag: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-[10px]", children: "BEST PHOTOGRAPHY" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/50 border border-border-subtle p-4 rounded flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 border border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground/60 text-[9px] font-mono uppercase tracking-wider", children: "Master Photographer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg font-bold text-foreground mt-0.5", children: selectedPhoto.photographerName })
            ] })
          ] }),
          selectedPhoto.caption && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "editorial-label text-muted-foreground/60 text-[9px] font-mono uppercase tracking-wider mb-1", children: "Caption / Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed italic font-serif", children: selectedPhoto.caption })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 bg-surface/50 border-t border-border-subtle flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedPhoto(null), className: "bg-foreground text-background font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded transition-colors hover:bg-foreground/90 shadow-md", children: "Close View" }) })
    ] }) })
  ] });
}
export {
  PhotographyPage as component
};
