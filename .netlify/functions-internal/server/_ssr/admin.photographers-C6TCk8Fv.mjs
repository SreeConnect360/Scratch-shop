import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as useAppStore, A as AdminLayout, e as AdminCard, g as StatusChip, i as AdminButton } from "./router-C0nupAs3.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
function PhotographersAdmin() {
  const {
    state
  } = useAppStore();
  const [photographers, setPhotographers] = reactExports.useState([]);
  const [editingCountriesId, setEditingCountriesId] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const contestCountries = reactExports.useMemo(() => {
    const countries = state.contests.map((c) => c.country);
    return Array.from(new Set(countries)).filter(Boolean).sort();
  }, [state.contests]);
  const editingPhotographer = reactExports.useMemo(() => {
    return photographers.find((p) => p.id === editingCountriesId) || null;
  }, [photographers, editingCountriesId]);
  const filteredCountries = reactExports.useMemo(() => {
    return contestCountries.filter((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [contestCountries, searchQuery]);
  reactExports.useEffect(() => {
    setSearchQuery("");
  }, [editingCountriesId]);
  reactExports.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("reevibes:photographers");
      if (raw) {
        setPhotographers(JSON.parse(raw));
      } else {
        const seedList = state.users.filter((u) => u.roles.includes("Photographer")).map((u) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          status: "Active",
          assignedCountries: [u.country],
          avatar: u.avatar,
          email: u.email,
          phone: u.phone,
          createdDate: (/* @__PURE__ */ new Date()).toISOString(),
          updatedDate: (/* @__PURE__ */ new Date()).toISOString()
        }));
        window.localStorage.setItem("reevibes:photographers", JSON.stringify(seedList));
        setPhotographers(seedList);
      }
    } catch (e) {
      console.error(e);
    }
  }, [state.users]);
  const saveList = (newList) => {
    setPhotographers(newList);
    try {
      window.localStorage.setItem("reevibes:photographers", JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };
  const toggleStatus = (id) => {
    const next = photographers.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: p.status === "Active" ? "Inactive" : "Active",
          updatedDate: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      return p;
    });
    saveList(next);
  };
  const handleCountryToggle = (id, country) => {
    const next = photographers.map((p) => {
      if (p.id === id) {
        const list = p.assignedCountries.includes(country) ? p.assignedCountries.filter((c) => c !== country) : [...p.assignedCountries, country];
        return {
          ...p,
          assignedCountries: list,
          updatedDate: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      return p;
    });
    saveList(next);
  };
  const handleResetCountries = (id) => {
    const next = photographers.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          assignedCountries: [],
          updatedDate: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      return p;
    });
    saveList(next);
  };
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (!editingPhotographer) return;
    const exactMatch = contestCountries.find((c) => c.toLowerCase() === val.trim().toLowerCase());
    if (exactMatch && !editingPhotographer.assignedCountries.includes(exactMatch)) {
      handleCountryToggle(editingPhotographer.id, exactMatch);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { eyebrow: "Module · Creative Network", title: "Photographers", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground mb-6", children: [
        "Auto-synced from ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Manage Users" }),
        " · Set active statuses and assign countries for the editorial gallery."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[900px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Photographer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Email / Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Assigned Countries" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          photographers.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle hover:bg-surface-2 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.avatar, alt: "", className: "w-10 h-10 rounded-full object-cover bg-surface-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground text-[10px] font-mono", children: p.id })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 pr-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: p.email || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60 font-mono mt-0.5", children: p.phone || "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 max-w-[320px]", children: [
              p.assignedCountries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-rose-400 italic", children: "No countries assigned" }) : p.assignedCountries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-surface border border-border-subtle px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded text-muted-foreground", children: c }, c)),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingCountriesId(p.id), className: "text-[10px] uppercase font-mono text-accent hover:underline ml-1 self-center", children: "[Edit]" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: p.status, tone: p.status === "Active" ? "success" : "danger" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: p.status === "Active" ? "outline" : "default", onClick: () => toggleStatus(p.id), className: "text-[10px] px-3.5 py-1.5", children: p.status === "Active" ? "Deactivate" : "Activate" }) })
          ] }, p.id)),
          photographers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "py-12 text-center text-muted-foreground", children: "No photographers yet. Assign the Photographer role from Manage Users." }) })
        ] })
      ] }) })
    ] }),
    editingPhotographer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-md rounded shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border-subtle pb-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: editingPhotographer.avatar, alt: "", className: "w-10 h-10 rounded-full object-cover bg-surface-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg font-bold leading-none", children: editingPhotographer.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono mt-1 block", children: "Assign Countries" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleResetCountries(editingPhotographer.id), className: "text-xs text-rose-500 hover:text-rose-400 font-bold uppercase tracking-wider transition-colors", children: "Reset" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-600", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingCountriesId(null), className: "text-xs text-muted-foreground hover:text-foreground font-mono", children: "Close" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => handleSearchChange(e.target.value), onKeyDown: (e) => {
        if (e.key === "Enter" && filteredCountries.length > 0) {
          handleCountryToggle(editingPhotographer.id, filteredCountries[0]);
          setSearchQuery("");
        }
      }, placeholder: "Type country name to search & select...", className: "w-full bg-surface border border-border-subtle px-3 py-2 text-sm rounded outline-none focus:border-accent text-foreground font-sans placeholder:text-muted-foreground/50", autoFocus: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 max-h-[300px] overflow-y-auto pr-1", children: [
        filteredCountries.map((c) => {
          const checked = editingPhotographer.assignedCountries.includes(c);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleCountryToggle(editingPhotographer.id, c), className: `w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${checked ? "bg-accent/15 border-accent text-accent" : "bg-surface hover:bg-surface-2 border-border-subtle text-muted-foreground hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: c }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-4 h-4 rounded-full border flex items-center justify-center transition-all ${checked ? "border-accent bg-accent" : "border-zinc-400 dark:border-zinc-600"}`, children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-2.5 h-2.5 text-white", fill: "none", stroke: "currentColor", strokeWidth: "3", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }) })
          ] }, c);
        }),
        filteredCountries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-xs text-muted-foreground italic", children: "No matching countries found." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-3 mt-6 pt-4 border-t border-border-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingCountriesId(null), className: "bg-accent hover:bg-accent/90 text-white font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded transition-colors shadow-md w-full", children: "Done" }) })
    ] }) })
  ] });
}
export {
  PhotographersAdmin as component
};
