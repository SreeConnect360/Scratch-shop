import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as usePortal } from "./router-CgqY8r00.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { X, ad as Film, a7 as Mail, aw as Phone, g as MapPin, ai as Globe } from "../_libs/lucide-react.mjs";
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
const TABS = ["Approved", "Selected", "Hold", "Thank You", "Block"];
function ContestantDetailModal({
  contestant,
  onClose
}) {
  const {
    state,
    reportAbuse
  } = usePortal();
  const [showAbuseForm, setShowAbuseForm] = reactExports.useState(false);
  const [abuseComment, setAbuseComment] = reactExports.useState("");
  const [isSubmitted, setIsSubmitted] = reactExports.useState(false);
  if (!contestant) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent", children: "Contestant Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl mt-0.5", children: contestant.fullName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAbuseForm(true), className: "text-xs uppercase tracking-wider font-semibold border border-rose-500/30 text-rose-400 px-3 py-1.5 hover:bg-rose-500/10 transition-colors rounded-sm", children: "Report Abuse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto space-y-8 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-12 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos.portrait, alt: "", className: "w-full h-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
            contestant.photos.fullBody && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos.fullBody, alt: "", className: "w-full h-full object-cover" }) }),
            contestant.photos.sideProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos.sideProfile, alt: "", className: "w-full h-full object-cover" }) }),
            contestant.photos.candid && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos.candid, alt: "", className: "w-full h-full object-cover" }) })
          ] }),
          contestant.photos.additional && contestant.photos.additional.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-2", children: "Additional Media" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1.5", children: contestant.photos.additional.map((ph, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square border border-border-subtle bg-surface rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: ph, className: "w-full h-full object-cover" }) }, idx)) })
          ] }),
          contestant.videos?.intro && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground mb-2 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3.5 h-3.5 text-accent" }),
              " Introduction Video"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-black rounded overflow-hidden border border-border-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: contestant.videos.intro, controls: true, className: "w-full h-full object-contain" }) })
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Weight:" }),
                " ",
                contestant.weight || "—"
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shoe Size:" }),
                " ",
                contestant.shoeSize || "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Measurements:" }),
                " ",
                contestant.bust ? `${contestant.bust} - ${contestant.waist} - ${contestant.hips}` : "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Date of Birth:" }),
                " ",
                contestant.dob || "—"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Contact & Location" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: contestant.email })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: contestant.phone })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex items-start gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-muted-foreground mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: contestant.streetAddress ? `${contestant.streetAddress}, ${contestant.city}, ${contestant.stateProvince} ${contestant.zipCode}, ${contestant.country}` : contestant.country })
              ] })
            ] })
          ] }),
          contestant.biography && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Biography" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap", children: contestant.biography })
          ] }),
          contestant.experience && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Modeling Experience" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap", children: contestant.experience })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            contestant.profession && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Profession" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm", children: contestant.profession })
            ] }),
            contestant.education && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Education" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm", children: contestant.education })
            ] })
          ] }),
          contestant.socialLinks && contestant.socialLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Social Links" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: contestant.socialLinks.map((link, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: link.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 text-xs bg-surface-3 px-2.5 py-1 border border-border-subtle hover:text-accent transition-colors rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }),
              " ",
              link.platform,
              ": ",
              link.url
            ] }, idx)) })
          ] })
        ] })
      ] }) })
    ] }),
    showAbuseForm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-md rounded shadow-2xl p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-border-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg text-rose-500", children: "Report Abuse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setShowAbuseForm(false);
          setAbuseComment("");
        }, className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
      ] }),
      isSubmitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "Thank you. Your report has been submitted for review." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setShowAbuseForm(false);
          setIsSubmitted(false);
          setAbuseComment("");
        }, className: "px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-accent text-white rounded-sm hover:opacity-90", children: "Close" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Reporting contestant: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: contestant.fullName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground", children: "Leave your comment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: abuseComment, onChange: (e) => setAbuseComment(e.target.value), placeholder: "Provide details about the issue...", rows: 4, className: "w-full bg-transparent border border-border-subtle p-2 text-sm rounded bg-background text-foreground focus:outline-none focus:border-accent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setShowAbuseForm(false);
            setAbuseComment("");
          }, className: "px-4 py-2 text-xs uppercase tracking-wider font-semibold border border-border-subtle text-muted-foreground rounded-sm hover:text-foreground hover:bg-surface", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            if (!abuseComment.trim()) return;
            reportAbuse({
              target: contestant.contestantId,
              reason: abuseComment,
              reporter: state.user?.email || "anonymous"
            });
            setIsSubmitted(true);
          }, disabled: !abuseComment.trim(), className: "px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-rose-600 text-white rounded-sm hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed", children: "Submit Report" })
        ] })
      ] })
    ] }) })
  ] });
}
function RoleCastingPage() {
  const {
    state,
    setCastingStatus
  } = usePortal();
  const countries = reactExports.useMemo(() => Array.from(new Set(state.contests.filter((c) => c.published).map((c) => c.country))), [state.contests]);
  const [country, setCountry] = reactExports.useState(countries[0] ?? "Global");
  const [tab, setTab] = reactExports.useState("Approved");
  const [pendingCasting, setPendingCasting] = reactExports.useState({});
  const [viewingContestant, setViewingContestant] = reactExports.useState(null);
  const apps = state.applications.filter((a) => a.country === country && (state.applicationsWorkflow[a.contestantId] ?? a.status) === "Approved");
  const filtered = apps.filter((a) => (state.castingWorkflow[a.contestantId] ?? "Approved") === tab);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Role · Casting Call" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-serif text-3xl", children: "Casting Decisions" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: country, onChange: (e) => {
      setCountry(e.target.value);
      setPendingCasting({});
    }, className: "bg-transparent border border-border-subtle px-3 py-2 text-sm rounded bg-background", children: countries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-background", children: c }, c)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 editorial-label", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
      setTab(t);
      setPendingCasting({});
    }, className: `px-3 py-1 border transition-colors ${tab === t ? "border-accent text-accent bg-accent/5" : "border-border-subtle text-muted-foreground hover:text-foreground"}`, children: [
      t,
      " (",
      apps.filter((a) => (state.castingWorkflow[a.contestantId] ?? "Approved") === t).length,
      ")"
    ] }, t)) }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "No contestants in ",
      tab,
      "."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map((a) => {
      const savedStatus = state.castingWorkflow[a.contestantId] ?? "Approved";
      const currentStatus = pendingCasting[a.contestantId] ?? savedStatus;
      const isChanged = currentStatus !== savedStatus;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-4 space-y-3 bg-surface rounded flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] w-full overflow-hidden rounded border border-border-subtle group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.photos.portrait, alt: a.fullName, className: "w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300", onClick: () => setViewingContestant(a) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer", onClick: () => setViewingContestant(a), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-widest text-white border border-white px-3 py-1.5 rounded-sm", children: "View Details" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg", children: a.fullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: a.contestantId })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mt-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: currentStatus, onChange: (e) => setPendingCasting((prev) => ({
            ...prev,
            [a.contestantId]: e.target.value
          })), className: "w-full bg-transparent border border-border-subtle px-3 py-2 text-sm rounded bg-background", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, className: "bg-background", children: t }, t)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !isChanged, onClick: () => {
            setCastingStatus(a.contestantId, currentStatus);
            setPendingCasting((prev) => {
              const copy = {
                ...prev
              };
              delete copy[a.contestantId];
              return copy;
            });
          }, className: `w-full py-2 text-xs uppercase tracking-wider font-semibold border transition-all duration-300 rounded-sm ${isChanged ? "text-white cursor-pointer font-bold" : "bg-transparent border-border-subtle text-muted-foreground cursor-not-allowed opacity-50"}`, style: isChanged ? {
            backgroundColor: "#db2777",
            borderColor: "#db2777"
          } : {}, children: "Save Judges" })
        ] })
      ] }, a.contestantId);
    }) }),
    viewingContestant && /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantDetailModal, { contestant: viewingContestant, onClose: () => setViewingContestant(null) })
  ] });
}
export {
  RoleCastingPage as component
};
