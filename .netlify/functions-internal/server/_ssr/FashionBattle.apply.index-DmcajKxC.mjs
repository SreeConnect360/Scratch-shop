import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { P as PublicLayout } from "./PublicLayout-DIee0132.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { l as useAppStore, b as useTheme, t as BrandLogo } from "./router-C_drxgJo.mjs";
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
function ContestCardLogo({
  contest
}) {
  const {
    theme
  } = useTheme();
  const [logos, setLogos] = reactExports.useState({
    white: null,
    black: null
  });
  reactExports.useEffect(() => {
    if (contest.logoWhite || contest.logoBlack) {
      setLogos({
        white: contest.logoWhite || null,
        black: contest.logoBlack || null
      });
      return;
    }
    if (contest.country && contest.country !== "Global") {
      fetch(`/api/countries-logos?country=${encodeURIComponent(contest.country)}`).then((res) => res.json()).then((data) => {
        if (data && !data.error) {
          setLogos({
            white: data.whiteLogo || null,
            black: data.blackLogo || null
          });
        }
      }).catch((err) => console.error("Error fetching logos dynamically:", err));
    }
  }, [contest]);
  const displayLogo = theme === "dark" ? logos.white || contest.logo : logos.black || contest.logo;
  if (displayLogo) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: displayLogo, alt: contest.country, className: "w-48 h-16 object-contain transition-transform duration-300 group-hover:scale-105" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { className: "w-24 h-auto object-contain transition-transform duration-300 group-hover:scale-105" });
}
function ApplyPage() {
  const {
    state
  } = useAppStore();
  const navigate = useNavigate();
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  const publishedContests = state.contests.filter((c) => c.published);
  const handleCardClick = (id) => {
    if (!state.user) {
      sessionStorage.setItem("apply:redirectContestId", id);
      navigate({
        to: "/FashionBattle/login"
      });
    } else {
      navigate({
        to: `/apply/${id}`
      });
    }
  };
  if (!mounted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-24 pb-12 border-b border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Apply · Season 04 Casting" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-5xl lg:text-7xl", children: "Select Your Country" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground text-sm max-w-xl", children: "Choose a published country edition to start your application. Every entry is reviewed personally by our casting team." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 lg:px-16 py-16", children: publishedContests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 border border-dashed border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-2xl text-muted-foreground", children: "No live contests available at this moment." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground/70 mt-2", children: "Please check back later or contact support." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: publishedContests.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => handleCardClick(c.id), className: "group relative cursor-pointer aspect-[16/7] bg-surface hover:bg-surface-2 border border-border-subtle hover:border-accent/40 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden rounded shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-[10px] text-muted-foreground/60 tracking-[0.2em] font-medium", children: [
        "LIVE · ",
        c.year
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center flex-1 my-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContestCardLogo, { contest: c }) })
    ] }, c.id)) }) })
  ] });
}
export {
  ApplyPage as component
};
