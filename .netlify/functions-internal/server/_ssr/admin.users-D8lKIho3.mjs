import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as useAppStore, A as AdminLayout, e as AdminCard, r as ALL_ROLES, g as StatusChip, D as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, s as DialogDescription, q as DialogFooter, i as AdminButton, P as PRODUCTS, c as cn } from "./router-C0nupAs3.mjs";
import { I as Input, L as Label } from "./label-CN0sQG51.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { S as Search, ai as ArrowUpDown, G as Eye, aj as Pencil, e as Shield, T as Trash2, P as Plus, V as Check } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = Checkbox$1.displayName;
const ROLE_TONES = {
  General: "neutral",
  Contestant: "accent",
  Photographer: "success",
  Admin: "danger",
  Applications: "warn",
  Ratings: "warn",
  "Casting Call": "warn",
  Judgements: "warn"
};
function emptyDraft() {
  return {
    firstName: "",
    lastName: "",
    gender: "Female",
    dob: "",
    country: "",
    email: "",
    phone: "",
    password: "",
    confirm: ""
  };
}
const FLAG_COUNTRIES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh"];
function UsersPage() {
  const {
    state,
    updateUser,
    deleteUser,
    setUserRoles,
    registerUser,
    updateOrderStatus
  } = useAppStore();
  const users = state.users;
  const [filter, setFilter] = reactExports.useState("All");
  const [q, setQ] = reactExports.useState("");
  const [activeViewTab, setActiveViewTab] = reactExports.useState("Info & Roles");
  const [countryFilter, setCountryFilter] = reactExports.useState("All");
  const [countrySearchOpen, setCountrySearchOpen] = reactExports.useState(false);
  const [countryQuery, setCountryQuery] = reactExports.useState("");
  const [sortBy, setSortBy] = reactExports.useState("none");
  const [sortOrder, setSortOrder] = reactExports.useState("asc");
  const [sortDropdownOpen, setSortDropdownOpen] = reactExports.useState(false);
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState(emptyDraft());
  const [formCountrySearchOpen, setFormCountrySearchOpen] = reactExports.useState(false);
  const [formCountryQuery, setFormCountryQuery] = reactExports.useState("");
  const filteredFormCountries = reactExports.useMemo(() => {
    return FLAG_COUNTRIES.filter((c) => c.toLowerCase().includes(formCountryQuery.toLowerCase()));
  }, [formCountryQuery]);
  const handleFormCountryQueryChange = (val) => {
    setFormCountryQuery(val);
    const exactMatch = FLAG_COUNTRIES.find((c) => c.toLowerCase() === val.trim().toLowerCase());
    if (exactMatch) {
      setDraft((prev) => ({
        ...prev,
        country: exactMatch
      }));
    }
  };
  const handleFormCountryKeyDown = (e) => {
    if (e.key === "Enter" && filteredFormCountries.length > 0) {
      e.preventDefault();
      setDraft((prev) => ({
        ...prev,
        country: filteredFormCountries[0]
      }));
      setFormCountrySearchOpen(false);
      setFormCountryQuery("");
    }
  };
  const [viewing, setViewing] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  const [rolesOf, setRolesOf] = reactExports.useState(null);
  const filteredCountries = reactExports.useMemo(() => {
    return ["All", ...FLAG_COUNTRIES].filter((c) => c.toLowerCase().includes(countryQuery.toLowerCase()));
  }, [countryQuery]);
  const handleCountryQueryChange = (val) => {
    setCountryQuery(val);
    const match = FLAG_COUNTRIES.find((c) => c.toLowerCase() === val.trim().toLowerCase());
    if (match) {
      setCountryFilter(match);
      setCountrySearchOpen(false);
      setCountryQuery("");
    } else if (val.trim().toLowerCase() === "all") {
      setCountryFilter("All");
      setCountrySearchOpen(false);
      setCountryQuery("");
    }
  };
  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  const list = reactExports.useMemo(() => {
    let result = users.filter((u) => {
      if (filter !== "All" && !u.roles.includes(filter)) return false;
      if (countryFilter !== "All" && u.country.toLowerCase() !== countryFilter.toLowerCase()) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return u.firstName.toLowerCase().includes(s) || u.lastName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.id.toLowerCase().includes(s);
    });
    if (sortBy !== "none") {
      result = [...result].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (sortBy === "age") {
          valA = Number(valA);
          valB = Number(valB);
        } else {
          valA = String(valA || "");
          valB = String(valB || "");
        }
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [users, filter, countryFilter, q, sortBy, sortOrder]);
  const handleCreate = () => {
    if (!draft.firstName || !draft.lastName || !draft.email) return;
    registerUser({
      firstName: draft.firstName,
      lastName: draft.lastName,
      email: draft.email,
      phone: draft.phone,
      country: draft.country,
      dob: draft.dob
    });
    setDraft(emptyDraft());
    setCreateOpen(false);
  };
  const toggleRole = (user, role, on) => {
    if (role === "General") return;
    const nextRoles = on ? Array.from(/* @__PURE__ */ new Set([...user.roles, role])) : user.roles.filter((r) => r !== role);
    setUserRoles(user.id, nextRoles);
    setRolesOf((prev) => prev && prev.id === user.id ? {
      ...prev,
      roles: nextRoles
    } : prev);
  };
  const saveEdit = () => {
    if (!editing) return;
    updateUser(editing.id, editing);
    setEditing(null);
  };
  const remove = (u) => {
    if (!confirm(`Delete ${u.firstName} ${u.lastName}?`)) return;
    deleteUser(u.id);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { eyebrow: "Module · User & Role Management", title: "Manage Users", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminButton, { variant: "accent", onClick: () => setCreateOpen(true), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
    " Add User"
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 mb-6 z-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-surface-2 px-3 py-2 border border-border-subtle min-w-72", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search by name, email or ID…", className: "bg-transparent outline-none text-sm flex-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setCountrySearchOpen(!countrySearchOpen);
              setSortDropdownOpen(false);
            }, className: "flex items-center justify-between gap-2 bg-surface border border-border-subtle px-3 py-2 text-sm rounded hover:bg-surface-2 transition-colors min-w-44 text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                "State: ",
                countryFilter
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px]", children: "▼" })
            ] }),
            countrySearchOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 mt-1 z-30 bg-background border border-border-subtle shadow-2xl p-3 rounded w-52 max-h-72 overflow-y-auto animate-in fade-in duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 bg-background pb-2 mb-2 border-b border-border-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: countryQuery, onChange: (e) => handleCountryQueryChange(e.target.value), placeholder: "Type state name...", className: "w-full bg-surface border border-border-subtle px-2 py-1 text-xs rounded outline-none focus:border-accent text-foreground", autoFocus: true }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                filteredCountries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                  setCountryFilter(c);
                  setCountrySearchOpen(false);
                  setCountryQuery("");
                }, className: `w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-accent/10 hover:text-accent transition-colors ${countryFilter === c ? "text-accent font-semibold bg-accent/5" : "text-muted-foreground"}`, children: c }, c)),
                filteredCountries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-[10px] text-muted-foreground py-2 italic", children: "No match" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setSortDropdownOpen(!sortDropdownOpen);
              setCountrySearchOpen(false);
            }, className: "flex items-center justify-between gap-2 bg-surface border border-border-subtle px-3 py-2 text-sm rounded hover:bg-surface-2 transition-colors min-w-44 text-left font-mono font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 truncate", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-3.5 h-3.5 text-muted-foreground shrink-0" }),
                "Sort: ",
                sortBy === "none" ? "None" : sortBy === "registeredAt" ? `Registered ${sortOrder === "asc" ? "↑" : "↓"}` : `Age ${sortOrder === "asc" ? "↑" : "↓"}`
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px]", children: "▼" })
            ] }),
            sortDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 mt-1 z-30 bg-background border border-border-subtle shadow-2xl p-2 rounded w-48 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                setSortBy("none");
                setSortDropdownOpen(false);
              }, className: `w-full text-left px-2.5 py-2 text-xs rounded hover:bg-accent/10 hover:text-accent transition-colors ${sortBy === "none" ? "text-accent font-semibold bg-accent/5" : "text-muted-foreground"}`, children: "None" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                handleSortToggle("registeredAt");
                setSortDropdownOpen(false);
              }, className: `w-full text-left px-2.5 py-2 text-xs rounded hover:bg-accent/10 hover:text-accent transition-colors flex items-center justify-between ${sortBy === "registeredAt" ? "text-accent font-semibold bg-accent/5" : "text-muted-foreground"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sort Registered" }),
                sortBy === "registeredAt" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: sortOrder === "asc" ? "↑" : "↓" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                handleSortToggle("age");
                setSortDropdownOpen(false);
              }, className: `w-full text-left px-2.5 py-2 text-xs rounded hover:bg-accent/10 hover:text-accent transition-colors flex items-center justify-between ${sortBy === "age" ? "text-accent font-semibold bg-accent/5" : "text-muted-foreground"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sort Age" }),
                sortBy === "age" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: sortOrder === "asc" ? "↑" : "↓" })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 editorial-label text-muted-foreground", children: ["All", ...ALL_ROLES.filter((r) => r !== "General")].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilter(r), className: `px-3 py-1 border ${filter === r ? "border-accent text-accent" : "border-border-subtle hover:text-foreground"}`, children: [
          r,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-50", children: [
            "(",
            r === "All" ? users.length : users.filter((u) => u.roles.includes(r)).length,
            ")"
          ] })
        ] }, r)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[1100px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "User ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Age" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "State" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Registered" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3", children: "Roles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 pr-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          list.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle hover:bg-surface-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3 font-mono text-xs text-muted-foreground", children: u.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.avatar, alt: "", className: "w-9 h-9 rounded-full object-cover bg-surface-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  u.firstName,
                  " ",
                  u.lastName
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: u.email })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 pr-3 text-muted-foreground", children: [
              u.age,
              " yrs"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: u.country }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3 text-muted-foreground", children: u.registeredAt }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: u.roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: r, tone: ROLE_TONES[r] }, r)) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "View", onClick: () => setViewing(u), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "Edit", onClick: () => setEditing({
                ...u
              }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "Manage Roles", onClick: () => setRolesOf(u), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "Delete", onClick: () => remove(u), danger: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
            ] }) })
          ] }, u.id)),
          list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, className: "py-12 text-center text-muted-foreground", children: "No users match this filter." }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl bg-background border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-serif text-2xl", children: "Create New User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Manually onboard an account into the ReeVibes platform." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "First Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.firstName, onChange: (e) => setDraft({
          ...draft,
          firstName: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.lastName, onChange: (e) => setDraft({
          ...draft,
          lastName: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: draft.email, onChange: (e) => setDraft({
          ...draft,
          email: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.phone, onChange: (e) => setDraft({
          ...draft,
          phone: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: draft.password, onChange: (e) => setDraft({
          ...draft,
          password: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Confirm Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: draft.confirm, onChange: (e) => setDraft({
          ...draft,
          confirm: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Gender", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: draft.gender, onChange: (e) => setDraft({
          ...draft,
          gender: e.target.value
        }), className: "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Female" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Male" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Other" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Date of Birth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: draft.dob, onChange: (e) => setDraft({
          ...draft,
          dob: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "State", className: "sm:col-span-2 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setFormCountrySearchOpen(!formCountrySearchOpen), className: "flex items-center justify-between gap-2 bg-transparent border border-input h-9 px-3 py-2 text-sm rounded-md hover:bg-surface-2 transition-colors w-full text-left text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: draft.country || "Select State..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px]", children: "▼" })
          ] }),
          formCountrySearchOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 right-0 mt-1 z-50 bg-background border border-border-subtle shadow-2xl p-3 rounded w-full max-h-60 overflow-y-auto animate-in duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 bg-background pb-2 mb-2 border-b border-border-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: formCountryQuery, onChange: (e) => handleFormCountryQueryChange(e.target.value), onKeyDown: handleFormCountryKeyDown, placeholder: "Type state name...", className: "w-full bg-surface border border-border-subtle px-2.5 py-1.5 text-sm rounded outline-none focus:border-accent text-foreground", autoFocus: true }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              filteredFormCountries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setDraft((prev) => ({
                  ...prev,
                  country: c
                }));
                setFormCountrySearchOpen(false);
                setFormCountryQuery("");
              }, className: `w-full text-left px-2.5 py-1.5 text-sm rounded hover:bg-accent/10 hover:text-accent transition-colors ${draft.country === c ? "text-accent font-semibold bg-accent/5" : "text-muted-foreground"}`, children: c }, c)),
              filteredFormCountries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-xs text-muted-foreground py-2 italic", children: "No match" })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => setCreateOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", onClick: handleCreate, children: "Create User" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!viewing, onOpenChange: (o) => !o && setViewing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-2xl bg-background border-border-subtle overflow-y-auto max-h-[90vh]", children: viewing && (() => {
      const userAddresses = state.addresses[viewing.id] || [];
      const wishlistIds = state.wishlist[viewing.id] || [];
      const userOrders = state.orders[viewing.id] || [];
      const cartItems = state.cart.filter(() => viewing.id === state.user?.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-serif text-2xl", children: [
            viewing.firstName,
            " ",
            viewing.lastName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            viewing.id,
            " · Onboarded Account"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border-subtle gap-4 text-xs uppercase font-semibold pb-1.5 mb-4", children: ["Info & Roles", "Addresses", "Cart & Wishlist", "Orders"].map((tabLabel, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setActiveViewTab(tabLabel);
        }, className: `pb-1 border-b-2 transition-colors ${activeViewTab === tabLabel ? "border-accent text-accent font-bold" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: tabLabel }, idx)) }),
        activeViewTab === "Info & Roles" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: viewing.avatar, className: "w-20 h-20 rounded-full object-cover bg-surface-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Email · " }),
                viewing.email
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Phone · " }),
                viewing.phone
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "State · " }),
                viewing.country
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "DOB · " }),
                viewing.dob,
                " (",
                viewing.age,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Registered · " }),
                viewing.registeredAt
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-2", children: "Current Roles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: viewing.roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: r, tone: ROLE_TONES[r] }, r)) })
          ] })
        ] }),
        activeViewTab === "Addresses" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-2", children: "Saved Addresses" }),
          userAddresses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "No addresses saved." }) : userAddresses.map((addr, idx) => {
            let parsed = {
              name: `${viewing.firstName} ${viewing.lastName}`,
              address: addr,
              phone: viewing.phone || ""
            };
            try {
              if (addr.trim().startsWith("{")) {
                parsed = JSON.parse(addr);
              }
            } catch (e) {
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border border-border-subtle bg-surface text-xs rounded-sm space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: parsed.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: parsed.address }),
              parsed.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-accent", children: [
                "Phone: ",
                parsed.phone
              ] })
            ] }, idx);
          })
        ] }),
        activeViewTab === "Cart & Wishlist" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground mb-2", children: [
              "Wishlist Items (",
              wishlistIds.length,
              ")"
            ] }),
            wishlistIds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "Wishlist is empty." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: PRODUCTS.filter((p) => wishlistIds.includes(p.id)).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 border border-border-subtle text-xs bg-surface flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, className: "w-8 h-10 object-cover shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: p.name })
            ] }, p.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-2", children: "Current Cart Items" }),
            cartItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "Cart is empty." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: cartItems.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 border border-border-subtle text-xs bg-surface flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                item.name,
                " x ",
                item.qty
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: item.price })
            ] }, idx)) })
          ] })
        ] }),
        activeViewTab === "Orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground mb-2", children: [
            "Past Orders (",
            userOrders.length,
            ")"
          ] }),
          userOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "No orders placed." }) : userOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-border-subtle bg-surface text-xs space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center font-semibold border-b border-border-subtle pb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-accent", children: [
                order.id,
                " (",
                order.date,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase text-muted-foreground", children: "Status:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: order.status, onChange: (e) => {
                  updateOrderStatus(viewing.id, order.id, e.target.value);
                  alert(`Updated ${order.id} status to ${e.target.value}`);
                }, className: "bg-background border border-border-subtle text-xs px-1 py-0.5 rounded outline-none text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Processing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Shipped" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Delivered" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Cancelled" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                item.name,
                " x ",
                item.qty
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.price })
            ] }, item.productId)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold border-t border-border-subtle/50 pt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "₹",
                order.total.toLocaleString()
              ] })
            ] })
          ] }, order.id))
        ] })
      ] });
    })() }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (o) => !o && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-2xl bg-background border-border-subtle", children: editing && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-serif text-2xl", children: "Edit User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editing.id })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "First Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.firstName, onChange: (e) => setEditing({
          ...editing,
          firstName: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.lastName, onChange: (e) => setEditing({
          ...editing,
          lastName: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.email, onChange: (e) => setEditing({
          ...editing,
          email: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.phone, onChange: (e) => setEditing({
          ...editing,
          phone: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "State", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.country, onChange: (e) => setEditing({
          ...editing,
          country: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "DOB", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: editing.dob, onChange: (e) => setEditing({
          ...editing,
          dob: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: editing.status, onChange: (e) => setEditing({
          ...editing,
          status: e.target.value
        }), className: "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Invited" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Suspended" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => setEditing(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", onClick: saveEdit, children: "Save Changes" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!rolesOf, onOpenChange: (o) => !o && setRolesOf(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-lg bg-background border-border-subtle", children: rolesOf && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-serif text-2xl", children: "Manage Roles" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          rolesOf.firstName,
          " ",
          rolesOf.lastName,
          " · ",
          rolesOf.id
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RoleGroup, { title: "Default Roles", roles: ["General", "Contestant", "Photographer", "Admin"], user: rolesOf, onToggle: toggleRole }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RoleGroup, { title: "Contest Workflow Roles", roles: ["Applications", "Ratings", "Casting Call", "Judgements"], user: rolesOf, onToggle: toggleRole }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground border-t border-border-subtle pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "General" }),
          " is auto-assigned to every account. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Contestant" }),
          " is auto-assigned when a user submits a contest application. All other roles unlock the matching admin module immediately."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", onClick: () => setRolesOf(null), children: "Done" }) })
    ] }) }) })
  ] });
}
function Field({
  label,
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-1.5 ${className ?? ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "editorial-label text-muted-foreground", children: label }),
    children
  ] });
}
function IconBtn({
  children,
  onClick,
  title,
  danger
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title, onClick, className: `p-2 border border-border-subtle hover:border-foreground/40 transition-colors ${danger ? "text-rose-400 hover:text-rose-300" : "text-foreground/70 hover:text-foreground"}`, children });
}
function RoleGroup({
  title,
  roles,
  user,
  onToggle
}) {
  const {
    state
  } = useAppStore();
  const hasApplied = state.applications.some((app) => app.userId === user.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-2", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: roles.map((r) => {
      const isContestant = r === "Contestant";
      const checked = r === "General" ? true : isContestant ? hasApplied : user.roles.includes(r);
      const locked = r === "General" || isContestant;
      const label = r === "General" ? "Auto" : isContestant ? hasApplied ? "Applied" : "No App" : "";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-center gap-3 px-3 py-2 border ${checked ? "border-accent/60 bg-accent/5" : "border-border-subtle"} ${locked ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:border-foreground/40"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked, disabled: locked, onCheckedChange: (v) => onToggle(user, r, !!v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: r }),
        label && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto editorial-label text-muted-foreground", children: label })
      ] }, r);
    }) })
  ] });
}
export {
  UsersPage as component
};
