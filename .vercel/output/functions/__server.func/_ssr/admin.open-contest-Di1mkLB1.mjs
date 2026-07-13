import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useAppStore, A as AdminLayout, d as AdminCard, h as AdminButton, b as useTheme, f as StatusChip } from "./router-CgqY8r00.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { S as Search, F as Funnel, P as Plus, d as ChevronRight, n as Sparkles, ak as RotateCcw, T as Trash2, X, ai as Globe, ac as Image, al as Clock } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const STAGES = ["Application", "Agency", "Ratings", "Casting", "Judgement"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const seed = (offsetDays = 0) => {
  const today = /* @__PURE__ */ new Date();
  const fmt = (d) => d.toISOString().slice(0, 10);
  const out = [];
  let cursor = new Date(today.getTime() + offsetDays * 864e5);
  const spans = [10, 7, 7, 10, 7, 14, 1];
  STAGES.forEach((s, i) => {
    const start = new Date(cursor);
    const end = new Date(cursor.getTime() + spans[i] * 864e5);
    out.push({
      stage: s,
      start: fmt(start),
      end: fmt(end)
    });
    cursor = new Date(end.getTime() + 864e5);
  });
  return out;
};
const INITIAL_CONTESTS = [{
  id: "ct1",
  scope: "Global",
  country: "Global",
  year: 2025,
  month: 3,
  currentStage: "Casting",
  status: "Casting",
  contestants: 248,
  updated: "2h ago",
  timeline: seed(-20),
  featured: true,
  voting: true,
  publicVisible: true
}, {
  id: "ct2",
  scope: "Country",
  country: "Maharashtra",
  year: 2025,
  month: 4,
  currentStage: "Judgement",
  status: "Judgement",
  contestants: 64,
  updated: "1d ago",
  timeline: seed(-40),
  featured: false,
  voting: true,
  publicVisible: true
}, {
  id: "ct3",
  scope: "Country",
  country: "Karnataka",
  year: 2025,
  month: 5,
  currentStage: "Live",
  status: "Live",
  contestants: 32,
  updated: "12 min ago",
  timeline: seed(-55),
  featured: true,
  voting: true,
  publicVisible: true
}, {
  id: "ct4",
  scope: "Country",
  country: "Delhi",
  year: 2025,
  month: 6,
  currentStage: "Application",
  status: "Open",
  contestants: 412,
  updated: "5h ago",
  timeline: seed(2),
  featured: false,
  voting: false,
  publicVisible: true
}, {
  id: "ct5",
  scope: "Country",
  country: "Tamil Nadu",
  year: 2024,
  month: 11,
  currentStage: "Winner",
  status: "Closed",
  contestants: 184,
  updated: "3 mo ago",
  timeline: seed(-180),
  featured: false,
  voting: false,
  publicVisible: true
}, {
  id: "ct6",
  scope: "Country",
  country: "Telangana",
  year: 2024,
  month: 9,
  currentStage: "Ratings",
  status: "Deleted",
  contestants: 96,
  updated: "2 mo ago",
  timeline: seed(-90),
  featured: false,
  voting: false,
  publicVisible: false,
  deleted: true
}];
const stageStatusMap = {
  Application: "Open",
  Agency: "Agency",
  Ratings: "Ratings",
  Casting: "Casting",
  Judgement: "Judgement",
  Live: "Live",
  Winner: "Closed"
};
const statusTone = (s) => {
  if (s === "Live") return "accent";
  if (s === "Closed") return "success";
  if (s === "Deleted") return "danger";
  if (s === "Draft") return "warn";
  if (s === "Judgement" || s === "Casting") return "warn";
  return "neutral";
};
const contestTitle = (c) => `${c.scope === "Global" ? "Global" : c.country} · ${c.year}`;
const stagePurpose = (s) => ({
  Application: "Public applications open",
  Agency: "Internal agency review",
  Ratings: "Internal scoring",
  Casting: "Shortlist review & interview",
  Judgement: "Judge evaluation",
  Live: "Public voting battle",
  Winner: "Contest closure & announcement"
})[s];
function OpenContestPage() {
  const {
    replaceContests
  } = useAppStore();
  const [contests, setContests] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("opencontest:contests");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading contests from sessionStorage:", e);
        }
      }
    }
    return INITIAL_CONTESTS;
  });
  const [query, setQuery] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("All");
  const [filterYear, setFilterYear] = reactExports.useState("All");
  const [filterMonth, setFilterMonth] = reactExports.useState("All");
  const [editing, setEditing] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("opencontest:contests", JSON.stringify(contests));
      window.dispatchEvent(new Event("opencontest:contests:updated"));
    }
    replaceContests(contests.filter((c) => !c.deleted).map((c) => ({
      id: c.id,
      country: c.country,
      year: c.year,
      stage: c.currentStage,
      published: c.publicVisible && c.status !== "Draft" && c.status !== "Deleted",
      logo: c.logo,
      logoWhite: c.logoWhite,
      logoBlack: c.logoBlack
    })));
    fetch("/api/sponsors?action=sync-contests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contests)
    }).catch((err) => console.error("Error syncing contests to backend:", err));
  }, [contests, replaceContests]);
  const years = reactExports.useMemo(() => ["All", ...Array.from(new Set(contests.map((c) => String(c.year)))).sort()], [contests]);
  const filtered = contests.filter((c) => {
    const title = contestTitle(c).toLowerCase();
    if (query && !title.includes(query.toLowerCase()) && !c.country.toLowerCase().includes(query.toLowerCase())) return false;
    if (filterStatus !== "All" && c.status !== filterStatus) return false;
    if (filterYear !== "All" && String(c.year) !== filterYear) return false;
    if (filterMonth !== "All" && String(c.month) !== filterMonth) return false;
    return true;
  });
  const handleSoftDelete = (id) => setContests((prev) => prev.map((c) => c.id === id ? {
    ...c,
    deleted: true,
    status: "Deleted"
  } : c));
  const handleRestore = (id) => setContests((prev) => prev.map((c) => c.id === id ? {
    ...c,
    deleted: false,
    status: stageStatusMap[c.currentStage]
  } : c));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { eyebrow: "Module · Contest Editions", title: "Open Contest", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", children: "Export Schedule" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminButton, { variant: "accent", onClick: () => setCreating(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 inline -mt-0.5 mr-1.5" }),
      " Create Contest"
    ] })
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminCard, { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-3 border-b border-foreground/20 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 text-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search by state or edition…", className: "flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterSelect, { label: "Status", value: filterStatus, onChange: setFilterStatus, options: ["All", "Draft", "Open", "Agency", "Ratings", "Casting", "Judgement", "Closed", "Deleted"] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterSelect, { label: "Year", value: filterYear, onChange: setFilterYear, options: years }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterSelect, { label: "Month", value: filterMonth, onChange: setFilterMonth, options: ["All", ...MONTHS.map((_, i) => String(i + 1))], renderOption: (v) => v === "All" ? "All" : MONTHS[Number(v) - 1] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "editorial-label text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3 h-3" }),
          " More"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "mb-6 p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border-subtle flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: "Maison · Roster" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl mt-1", style: {
            fontFamily: "var(--font-display, 'Playfair Display'), serif"
          }, children: "Contest Operations" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          filtered.length,
          " of ",
          contests.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border-subtle", children: [
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-16 text-center text-sm text-muted-foreground", children: "No contests match the current filters." }),
        filtered.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(ContestRow, { contest: c, onEdit: () => setEditing(c), onDelete: () => handleSoftDelete(c.id), onRestore: () => handleRestore(c.id), onStageTransition: (id, stage) => {
          setContests((prev) => prev.map((x) => x.id === id ? {
            ...x,
            currentStage: stage,
            status: stageStatusMap[stage]
          } : x));
        } }, c.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: (creating || editing) && /* @__PURE__ */ jsxRuntimeExports.jsx(ContestFormModal, { contest: editing, onClose: () => {
      setCreating(false);
      setEditing(null);
    }, onSave: (c) => {
      setContests((prev) => editing ? prev.map((x) => x.id === c.id ? c : x) : [c, ...prev]);
      setCreating(false);
      setEditing(null);
    } }) })
  ] });
}
function FilterSelect({
  label,
  value,
  onChange,
  options,
  renderOption
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "relative inline-flex items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground/70 mr-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value, onChange: (e) => onChange(e.target.value), className: "appearance-none bg-transparent border border-foreground/20 hover:border-foreground/40 focus:border-accent transition-colors px-3 py-1.5 pr-7 text-xs cursor-pointer outline-none", children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, className: "bg-background", children: renderOption ? renderOption(o) : o }, o)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 absolute right-2 rotate-90 pointer-events-none text-foreground/50" })
  ] });
}
function ContestRowCountdown({
  contest,
  onUpdate
}) {
  const [countdownText, setCountdownText] = reactExports.useState("");
  const [activeStage, setActiveStage] = reactExports.useState("");
  reactExports.useEffect(() => {
    const calculateCountdown = () => {
      try {
        if (contest.status === "Draft" || contest.status === "Deleted" || contest.deleted) {
          setCountdownText("");
          return;
        }
        const timeline = contest.timeline || [];
        const sortedTimeline = [...timeline].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        const now = Date.now();
        const currentActive = sortedTimeline.find((t) => new Date(t.end).getTime() > now);
        if (!currentActive) {
          setCountdownText("Ended");
          setActiveStage("");
          return;
        }
        setActiveStage(currentActive.stage);
        const endTime = new Date(currentActive.end).getTime();
        const diff = endTime - now;
        const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
        const hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
        const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
        const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
        setCountdownText(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        if (contest.currentStage !== currentActive.stage) {
          onUpdate();
        }
      } catch (e) {
        console.error(e);
        setCountdownText("");
      }
    };
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1e3);
    return () => clearInterval(interval);
  }, [contest, onUpdate]);
  if (!countdownText) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 ml-2.5 font-mono text-[10px] text-accent bg-accent/10 px-2 py-0.5 border border-accent/20 rounded-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-sans font-semibold uppercase tracking-wider text-[9px]", children: [
      activeStage,
      ":"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums font-semibold", children: countdownText })
  ] });
}
function ContestRow({
  contest,
  onEdit,
  onDelete,
  onRestore,
  onStageTransition
}) {
  const completed = contest.timeline.filter((t) => new Date(t.end) < /* @__PURE__ */ new Date()).length;
  const progress = Math.round(completed / STAGES.length * 100);
  const title = contestTitle(contest);
  const {
    theme
  } = useTheme();
  theme === "dark" ? contest.logoWhite || contest.logo : contest.logoBlack || contest.logo;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 6
  }, animate: {
    opacity: contest.deleted ? 0.45 : 1,
    y: 0
  }, whileHover: {
    backgroundColor: "var(--surface-2)"
  }, transition: {
    duration: 0.3
  }, className: "group px-6 py-5 grid grid-cols-12 items-center gap-4 cursor-default", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-12 md:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: `/api/flags?country=${encodeURIComponent(contest.country)}`, alt: contest.country, className: "w-10 h-10 object-contain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm leading-tight flex items-center flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          fontFamily: "'Playfair Display', serif"
        }, className: "text-base", children: title }),
        contest.status === "Draft" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-[9px] tracking-[0.18em] uppercase border border-accent/50 text-accent px-1.5 py-0.5 leading-none", children: "Draft" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ContestRowCountdown, { contest, onUpdate: () => {
          const timeline = contest.timeline || [];
          const sortedTimeline = [...timeline].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
          const now = Date.now();
          const currentActive = sortedTimeline.find((t) => new Date(t.end).getTime() > now);
          if (currentActive && contest.currentStage !== currentActive.stage) {
            onStageTransition(contest.id, currentActive.stage);
          }
        } })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block col-span-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground/70 mb-1", children: "Stage" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: contest.currentStage })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block col-span-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: contest.status, tone: statusTone(contest.status) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-px bg-surface-3 relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        width: 0
      }, animate: {
        width: `${progress}%`
      }, transition: {
        duration: 0.8,
        ease: "easeOut"
      }, className: "absolute inset-y-0 left-0 bg-accent" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block col-span-1 text-xs text-muted-foreground", children: contest.updated }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-12 md:col-span-1 flex md:justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onEdit, className: "p-1.5 hover:text-accent text-foreground/60", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }) }),
      contest.deleted ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onRestore, className: "p-1.5 hover:text-accent text-foreground/60", title: "Restore", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, className: "p-1.5 hover:text-accent text-foreground/60", title: "Soft Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
    ] })
  ] });
}
function CountrySearchSelect({
  value,
  onChange,
  disabled,
  countries
}) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const containerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  const filtered = reactExports.useMemo(() => {
    if (!search) return countries;
    return countries.filter((c) => c.toLowerCase().includes(search.toLowerCase()));
  }, [countries, search]);
  if (disabled) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full border-b border-foreground/15 py-2 text-sm text-foreground/40 font-mono", children: "Global" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "relative w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setIsOpen(!isOpen), className: "w-full border-b border-foreground/25 py-2 text-sm outline-none focus:border-accent cursor-pointer flex justify-between items-center bg-transparent select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: value || "Select State..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60 transition-transform duration-200", style: {
        transform: isOpen ? "rotate(180deg)" : "none"
      }, children: "▼" })
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 right-0 mt-1 z-[100] max-h-64 overflow-y-auto bg-background/95 backdrop-blur-md border border-border-subtle shadow-2xl p-2 space-y-2 rounded", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border-subtle/50 pb-1.5 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 text-muted-foreground/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Search state...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground/45", autoFocus: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 text-xs text-muted-foreground text-center", children: "No states found" }) : filtered.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
        onChange(c);
        setIsOpen(false);
        setSearch("");
      }, className: `w-full text-left px-3 py-2 text-xs transition-all duration-150 rounded ${value === c ? "text-accent font-semibold bg-accent/10 border-l-2 border-accent" : "text-foreground/80 hover:bg-foreground/5"}`, children: c }, c)) })
    ] })
  ] });
}
const formatDisplayDateTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};
const toIsoString = (d) => {
  const pad = (num) => String(num).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
function DateTimePicker({
  value,
  onChange,
  label
}) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [inputValue, setInputValue] = reactExports.useState("");
  const containerRef = reactExports.useRef(null);
  const date = reactExports.useMemo(() => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? /* @__PURE__ */ new Date() : d;
  }, [value]);
  const [currentYear, setCurrentYear] = reactExports.useState(date.getFullYear());
  const [currentMonth, setCurrentMonth] = reactExports.useState(date.getMonth());
  reactExports.useEffect(() => {
    setInputValue(formatDisplayDateTime(value));
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
    }
  }, [value]);
  reactExports.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  const daysInMonth = reactExports.useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);
  const firstDayIndex = reactExports.useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);
  const handleDaySelect = (day) => {
    const newDate = new Date(date);
    newDate.setFullYear(currentYear);
    newDate.setMonth(currentMonth);
    newDate.setDate(day);
    onChange(toIsoString(newDate));
  };
  const handleTimeChange = (type, val) => {
    const newDate = new Date(date);
    if (type === "hours") {
      newDate.setHours(val);
    } else {
      newDate.setMinutes(val);
    }
    onChange(toIsoString(newDate));
  };
  const changeMonth = (offset) => {
    let nextMonth = currentMonth + offset;
    let nextYear = currentYear;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };
  const parseDisplayDateTime = (str) => {
    const match = str.trim().match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, day, month, year, hours, minutes] = match;
    const d = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
    return isNaN(d.getTime()) ? null : d;
  };
  const handleInputChange = (val) => {
    setInputValue(val);
    const parsed = parseDisplayDateTime(val);
    if (parsed) {
      onChange(toIsoString(parsed));
    }
  };
  const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const yearsRange = reactExports.useMemo(() => {
    const startYear = (/* @__PURE__ */ new Date()).getFullYear() - 10;
    return Array.from({
      length: 26
    }, (_, i) => startYear + i);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "relative w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full border-b border-foreground/25 py-1.5 flex justify-between items-center bg-transparent group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: inputValue, onChange: (e) => handleInputChange(e.target.value), onFocus: () => setIsOpen(true), placeholder: "dd-mm-yyyy hh:mm", className: "flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/45" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsOpen(!isOpen), className: "p-1 hover:text-accent text-muted-foreground/60 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }) })
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 mt-2 z-50 p-4 bg-background/95 backdrop-blur-md border border-border-subtle shadow-2xl rounded w-72 flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-border-subtle/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => changeMonth(-1), className: "text-xs hover:text-accent font-semibold p-1 text-foreground", children: "◀" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: currentMonth, onChange: (e) => setCurrentMonth(Number(e.target.value)), className: "bg-transparent text-xs font-semibold text-foreground outline-none border-b border-transparent focus:border-accent cursor-pointer", children: MONTH_NAMES.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i, className: "bg-background", children: m }, m)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: currentYear, onChange: (e) => setCurrentYear(Number(e.target.value)), className: "bg-transparent text-xs font-semibold text-foreground outline-none border-b border-transparent focus:border-accent cursor-pointer", children: yearsRange.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, className: "bg-background", children: y }, y)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => changeMonth(1), className: "text-xs hover:text-accent font-semibold p-1 text-foreground", children: "▶" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground font-semibold", children: WEEK_DAYS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d }, d)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-1 text-center text-xs", children: [
        Array.from({
          length: firstDayIndex
        }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}, `empty-${i}`)),
        Array.from({
          length: daysInMonth
        }).map((_, i) => {
          const day = i + 1;
          const isSelected = date.getDate() === day && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleDaySelect(day), className: `w-7 h-7 flex items-center justify-center rounded transition-all ${isSelected ? "bg-accent text-accent-foreground font-semibold" : "text-foreground/80 hover:bg-foreground/5"}`, children: day }, `day-${day}`);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border-subtle/50 pt-3 flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Time:" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: date.getHours(), onChange: (e) => handleTimeChange("hours", Number(e.target.value)), className: "bg-surface-2 border border-border-subtle/80 rounded px-1.5 py-1 text-xs text-foreground outline-none focus:border-accent", children: Array.from({
            length: 24
          }).map((_, h) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: h, className: "bg-background", children: String(h).padStart(2, "0") }, h)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: ":" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: date.getMinutes(), onChange: (e) => handleTimeChange("minutes", Number(e.target.value)), className: "bg-surface-2 border border-border-subtle/80 rounded px-1.5 py-1 text-xs text-foreground outline-none focus:border-accent", children: Array.from({
            length: 60
          }).map((_, m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, className: "bg-background", children: String(m).padStart(2, "0") }, m)) })
        ] })
      ] })
    ] })
  ] });
}
const DEFAULT_COUNTRIES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh"];
function ContestFormModal({
  contest,
  onClose,
  onSave
}) {
  const {
    theme
  } = useTheme();
  const [countries, setCountries] = reactExports.useState(DEFAULT_COUNTRIES);
  const [form, setForm] = reactExports.useState(contest ?? {
    id: `ct-${Date.now()}`,
    scope: "Global",
    country: "Global",
    year: (/* @__PURE__ */ new Date()).getFullYear(),
    month: (/* @__PURE__ */ new Date()).getMonth() + 1,
    currentStage: "Application",
    status: "Open",
    contestants: 0,
    updated: "just now",
    timeline: seed(0),
    featured: false,
    voting: false,
    publicVisible: true
  });
  reactExports.useEffect(() => {
    fetch("/api/countries-logos").then((res) => res.json()).then((data) => {
      if (data && data.countries) {
        setCountries(data.countries);
      }
    }).catch((err) => console.error("Error loading dynamic country list:", err));
  }, []);
  const set = (k, v) => setForm((p) => ({
    ...p,
    [k]: v
  }));
  const handleCountryChange = async (countryName) => {
    set("country", countryName);
    if (form.scope === "Country" && countryName) {
      try {
        const response = await fetch(`/api/countries-logos?country=${encodeURIComponent(countryName)}`);
        const data = await response.json();
        if (data && !data.error) {
          setForm((p) => ({
            ...p,
            country: countryName,
            logoWhite: data.whiteLogo || void 0,
            logoBlack: data.blackLogo || void 0,
            logo: (theme === "dark" ? data.whiteLogo : data.blackLogo) || data.whiteLogo || data.blackLogo || void 0
          }));
        }
      } catch (err) {
        console.error("Error auto-loading country logos:", err);
      }
    }
  };
  const handleLogo = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setForm((p) => ({
        ...p,
        logo: result,
        logoWhite: void 0,
        // Clear auto-loaded theme logos on manual upload
        logoBlack: void 0
      }));
    };
    reader.readAsDataURL(file);
  };
  const title = contestTitle(form);
  const displayLogo = theme === "dark" ? form.logoWhite || form.logo : form.logoBlack || form.logo;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
    opacity: 0
  }, animate: {
    opacity: 1
  }, exit: {
    opacity: 0
  }, className: "fixed inset-0 z-50 bg-background/70 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    scale: 0.97,
    opacity: 0,
    y: 12
  }, animate: {
    scale: 1,
    opacity: 1,
    y: 0
  }, exit: {
    scale: 0.97,
    opacity: 0,
    y: 12
  }, transition: {
    duration: 0.35,
    ease: [0.22, 1, 0.36, 1]
  }, onClick: (e) => e.stopPropagation(), className: "w-full h-full max-w-6xl max-h-[95vh] bg-background border border-border-subtle overflow-hidden flex flex-col shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-8 py-6 border-b border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: contest ? "Edit Contest" : "New Contest" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mt-2", style: {
          fontFamily: "'Playfair Display', serif"
        }, children: title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 hover:text-accent border border-border-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-10 max-w-4xl mx-auto space-y-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Edition Scope", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["Global", "Country"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
        set("scope", s);
        if (s === "Global") set("country", "Global");
        else if (form.country === "Global") set("country", countries[0] || "Maharashtra");
      }, className: `p-5 border text-left transition-colors ${form.scope === s ? "border-accent bg-accent/5" : "border-border-subtle hover:border-foreground/40"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: `w-4 h-4 mb-2 ${form.scope === s ? "text-accent" : "text-foreground/50"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", style: {
          fontFamily: "'Playfair Display', serif"
        }, children: [
          s === "Global" ? "Global" : "State",
          " Edition"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mt-1", children: s === "Global" ? "Worldwide edition" : "Single-state edition (India)" })
      ] }, s)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Edition Details", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "State", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CountrySearchSelect, { value: form.country, onChange: handleCountryChange, disabled: form.scope === "Global", countries }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Year", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.year, onChange: (e) => set("year", Number(e.target.value)), className: "w-full bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent text-sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Month", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: form.month, onChange: (e) => set("month", Number(e.target.value)), className: "w-full bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent text-sm", children: MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i + 1, className: "bg-background", children: m }, m)) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: form.scope === "Global" ? "Global Edition Logo" : `${form.country} Logo`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-foreground/20 hover:border-accent transition-colors p-10 text-center cursor-pointer group relative", children: [
        (form.logoWhite || form.logoBlack) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 text-[9px] editorial-label border border-accent/35 text-accent px-1.5 py-0.5 rounded-sm", children: "Auto-loaded Logo Folder" }),
        displayLogo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: displayLogo, alt: "logo", className: "w-32 h-32 object-contain" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: "Click to replace manually" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-8 h-8 text-foreground/40 group-hover:text-accent mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-foreground/80 mt-3", children: [
            "Upload ",
            form.scope === "Global" ? "global" : form.country,
            " logo"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground/60 mt-1", children: "SVG / PNG · transparent preferred" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => handleLogo(e.target.files?.[0] ?? null) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Contest Lifecycle Timeline", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground -mt-3 mb-4", children: "Configure start & end dates for every stage of this edition. Casting Call also requires a venue." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: STAGES.map((stage) => {
          const win = form.timeline.find((t) => t.stage === stage) ?? {
            stage,
            start: "",
            end: ""
          };
          const updateWin = (patch) => {
            const next = form.timeline.some((t) => t.stage === stage) ? form.timeline.map((t) => t.stage === stage ? {
              ...t,
              ...patch
            } : t) : [...form.timeline, {
              ...win,
              ...patch
            }];
            set("timeline", next);
          };
          const isWinner = stage === "Winner";
          const isCasting = stage === "Casting";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-4 hover:border-foreground/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", style: {
                  fontFamily: "'Playfair Display', serif"
                }, children: [
                  stage,
                  " Stage"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground/70 mt-0.5", children: stagePurpose(stage) })
              ] }),
              form.currentStage === stage && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent border border-accent/40 px-2 py-0.5", children: "Current" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid grid-cols-1 ${isCasting ? "md:grid-cols-3" : isWinner ? "md:grid-cols-1" : "md:grid-cols-2"} gap-4`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: isWinner ? "Announcement Date & Time" : "Start Date & Time", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DateTimePicker, { value: win.start, onChange: (val) => updateWin({
                start: val,
                ...isWinner ? {
                  end: val
                } : {}
              }), label: isWinner ? "Announcement" : "Start" }) }),
              !isWinner && /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "End Date & Time", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DateTimePicker, { value: win.end, onChange: (val) => updateWin({
                end: val
              }), label: "End" }) }),
              isCasting && /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Venue", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: form.castingVenue ?? "", onChange: (e) => set("castingVenue", e.target.value), placeholder: "e.g. Studio Maison, Paris", className: "w-full bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent text-sm placeholder:text-muted-foreground/40" }) })
            ] })
          ] }, stage);
        }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-5 border-t border-border-subtle bg-background flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
        "Edition will be saved as ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: title }),
        form.status === "Draft" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-accent", children: "· Draft" }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "ghost", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => onSave({
          ...form,
          status: "Draft"
        }), children: "Save Draft" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", onClick: () => onSave({
          ...form,
          status: stageStatusMap[form.currentStage]
        }), children: contest ? "Save Edition" : "Publish Contest" })
      ] })
    ] })
  ] }) });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-5", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children })
  ] });
}
function FormField({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground/70 text-[10px]", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children })
  ] });
}
export {
  OpenContestPage as component
};
