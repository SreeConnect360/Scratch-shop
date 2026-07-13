import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AdminLayout, d as STATS, e as AdminCard, f as BATTLES, g as StatusChip, h as ABUSE_REPORTS, C as CONTESTANTS, i as AdminButton } from "./router-C0nupAs3.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { ac as TrendingUp, J as ArrowUpRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
function AdminHome() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { eyebrow: "Season 03 · Live", title: "Operations Overview", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", children: "Export Report" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", children: "Open Live Producer" })
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10", children: [["Total Votes", STATS.totalVotes.toLocaleString(), "+12.4%"], ["Active Contestants", STATS.activeContestants, "+3"], ["Live Viewers", STATS.liveViewers.toLocaleString(), "live"], ["Sponsor Revenue", STATS.revenue, "+8.2%"]].map(([k, v, d]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: k }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-4xl mt-3", children: v }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2 text-xs text-accent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3" }),
        d
      ] })
    ] }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent", children: "Live Battles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-2xl mt-1", children: "Round of 16" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/live-contest", className: "editorial-label hover:text-accent inline-flex items-center gap-1", children: [
            "Manage ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: BATTLES.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 border-t border-border-subtle pt-4 first:border-0 first:pt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.a.image, alt: "", className: "w-10 h-14 object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif italic text-accent", children: "vs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.b.image, alt: "", className: "w-10 h-14 object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
              b.a.name,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "vs" }),
              " ",
              b.b.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mt-1", children: b.round })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: b.status, tone: b.status === "live" ? "accent" : "neutral" })
        ] }, b.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent", children: "Recent Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-2xl mt-1 mb-6", children: "Moderation Queue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: ABUSE_REPORTS.slice(0, 3).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border-subtle pt-3 first:border-0 first:pt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: r.target }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: r.reason }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: r.severity, tone: r.severity === "High" ? "danger" : r.severity === "Medium" ? "warn" : "neutral" }) })
        ] }, r.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4 mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent", children: "Newest Applications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-2xl mt-1 mb-6", children: "Pending Review" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: CONTESTANTS.slice(0, 4).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.image, className: "w-10 h-12 object-cover", alt: "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: c.country })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: c.status, tone: c.status === "Approved" ? "success" : "neutral" })
        ] }, c.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent", children: "Voting Velocity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-2xl mt-1 mb-6", children: "Last 12 Hours" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1.5 h-32", children: [40, 55, 38, 70, 62, 84, 91, 72, 65, 88, 95, 78].map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-foreground/20 hover:bg-accent transition-colors", style: {
          height: `${v}%`
        } }, i)) })
      ] })
    ] })
  ] });
}
export {
  AdminHome as component
};
