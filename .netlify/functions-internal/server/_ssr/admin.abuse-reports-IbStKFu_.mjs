import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as useAppStore, A as AdminLayout, e as AdminCard, g as StatusChip, i as AdminButton } from "./router-BFsnZUKW.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
function ContestantDetailModal({
  contestant,
  onClose
}) {
  if (!contestant) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent", children: "Contestant Profile (Admin Review)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl mt-0.5", children: contestant.fullName || contestant.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto space-y-8 flex-1 text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-12 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos?.portrait || contestant.image, alt: "", className: "w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          contestant.photos?.fullBody && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos.fullBody, alt: "", className: "w-full h-full object-cover" }) }),
          contestant.photos?.sideProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos.sideProfile, alt: "", className: "w-full h-full object-cover" }) }),
          contestant.photos?.candid && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos.candid, alt: "", className: "w-full h-full object-cover" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-7 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Personal Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Age:" }),
              " ",
              contestant.age,
              " years"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Height:" }),
              " ",
              contestant.height || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Hair:" }),
              " ",
              contestant.hairColour || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Eyes:" }),
              " ",
              contestant.eyeColour || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Measurements:" }),
              " ",
              contestant.bust ? `${contestant.bust} - ${contestant.waist} - ${contestant.hips}` : contestant.measurements || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Date of Birth:" }),
              " ",
              contestant.dob || "—"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Country:" }),
              " ",
              contestant.country
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "City:" }),
              " ",
              contestant.city || "—"
            ] })
          ] })
        ] }),
        (contestant.biography || contestant.bio) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Biography" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap", children: contestant.biography || contestant.bio })
        ] })
      ] })
    ] }) })
  ] }) });
}
function AbuseReportsPage() {
  const {
    state,
    resolveReport
  } = useAppStore();
  const reports = state.reports;
  const [selectedGroup, setSelectedGroup] = reactExports.useState(null);
  const [viewingContestant, setViewingContestant] = reactExports.useState(null);
  const groupedReports = reactExports.useMemo(() => {
    const groups = {};
    reports.forEach((r) => {
      const key = r.target;
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    return Object.entries(groups).map(([targetKey, rList]) => {
      const app = state.applications.find((a) => a.contestantId === targetKey || a.fullName === targetKey);
      const name = app ? app.fullName : targetKey;
      const country = app ? app.country : "Global";
      const year = app ? app.contestYear : 2026;
      const count = rList.length;
      const status = rList.some((r) => r.status === "Open") ? "Open" : rList.some((r) => r.status === "Reviewing") ? "Reviewing" : "Resolved";
      return {
        targetKey,
        name,
        country,
        year,
        count,
        status,
        reports: rList,
        app
      };
    });
  }, [reports, state.applications]);
  const openCount = groupedReports.filter((g) => g.status === "Open").length;
  const reviewingCount = groupedReports.filter((g) => g.status === "Reviewing").length;
  const resolvedCount = groupedReports.filter((g) => g.status === "Resolved").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { eyebrow: "Module · Moderation", title: "Abuse Reports", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", children: "Export" }) }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4 mb-4", children: [["Open", openCount, "danger"], ["Reviewing", reviewingCount, "warn"], ["Resolved", resolvedCount, "success"]].map(([k, v, t]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: k }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-4xl", children: v }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: k, tone: t })
      ] })
    ] }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-6", children: "Moderation Queue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3", children: "Target (Contestant)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Country" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Year" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Recent Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          groupedReports.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle hover:bg-surface-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewingContestant(g.app || {
                name: g.name,
                country: g.country,
                age: 24,
                dob: "",
                countryLogo: "",
                id: g.targetKey
              }), className: "font-serif text-base text-accent hover:underline text-left block", children: g.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono", children: g.targetKey })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-semibold text-rose-500", children: g.count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: g.country }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: g.year }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-muted-foreground max-w-xs truncate", children: g.reports[0]?.reason }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: g.status, tone: g.status === "Resolved" ? "success" : g.status === "Reviewing" ? "warn" : "danger" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right space-x-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedGroup(g), className: "editorial-label text-accent hover:underline", children: "Review" }) })
          ] }, g.targetKey)),
          groupedReports.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "py-12 text-center text-muted-foreground", children: "No abuse reports in queue." }) })
        ] })
      ] }) })
    ] }),
    selectedGroup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-2xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent", children: "Review Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-serif text-xl mt-0.5", children: [
            "Flags for ",
            selectedGroup.name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedGroup(null), className: "p-2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto space-y-4 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: selectedGroup.reports.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle/60 p-4 rounded bg-surface/50 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
            "Reporter: ",
            r.reporter
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Status: ",
            r.status
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground italic", children: [
          '"',
          r.reason,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2 border-t border-border-subtle/30", children: [
          r.status !== "Reviewing" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            resolveReport(r.id, "Reviewing");
            setSelectedGroup(null);
          }, className: "text-[10px] uppercase font-bold text-amber-500 hover:underline", children: "Mark Reviewing" }),
          r.status !== "Resolved" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            resolveReport(r.id, "Resolved");
            setSelectedGroup(null);
          }, className: "text-[10px] uppercase font-bold text-emerald-500 hover:underline", children: "Resolve / Dismiss" })
        ] })
      ] }, r.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-border-subtle bg-surface flex justify-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          selectedGroup.reports.forEach((r) => resolveReport(r.id, "Reviewing"));
          setSelectedGroup(null);
        }, className: "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors", children: "Mark All Reviewing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          selectedGroup.reports.forEach((r) => resolveReport(r.id, "Resolved"));
          setSelectedGroup(null);
        }, className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors", children: "Resolve All" })
      ] })
    ] }) }),
    viewingContestant && /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantDetailModal, { contestant: viewingContestant, onClose: () => setViewingContestant(null) })
  ] });
}
export {
  AbuseReportsPage as component
};
