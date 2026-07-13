import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AdminLayout, D as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, i as AdminButton, e as AdminCard, g as StatusChip, c as cn } from "./router-C_drxgJo.mjs";
import { I as Input, L as Label } from "./label-BzdH3IcM.mjs";
import { R as Root2, V as Value, T as Trigger$1, I as Icon, P as Portal, C as Content2, a as Viewport, b as Item, c as ItemIndicator, d as ItemText, S as ScrollUpButton, e as ScrollDownButton, L as Label$1, f as Separator } from "../_libs/radix-ui__react-select.mjs";
import { R as Root2$1, T as Trigger, P as Portal$1, C as Content2$1 } from "../_libs/radix-ui__react-popover.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { P as Plus, aj as Pencil, T as Trash2, ak as ExternalLink, al as Globe, c as ChevronDown, V as Check, O as Upload, X, am as ChevronUp } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
const Select = Root2;
const SelectValue = Value;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger$1,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = Trigger$1.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Content2,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = Content2.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label$1,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = Label$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
    ]
  }
));
SelectItem.displayName = Item.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = Separator.displayName;
const Popover = Root2$1;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2$1,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2$1.displayName;
const PRESET_TYPES = ["Fashion", "Beauty", "Jewelry", "Food", "Lifestyle", "Photography", "Ecommerce", "Luxury Brand"];
const emptyDraft = () => ({
  id: `s-${Date.now()}`,
  name: "",
  type: "",
  url: "",
  countries: [],
  logoZoom: 1,
  logoX: 0,
  logoY: 0
});
function SponsorsPage() {
  const [sponsors, setSponsors] = reactExports.useState([]);
  const [openCountries, setOpenCountries] = reactExports.useState(["Global"]);
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    fetch("/api/sponsors?action=get-sponsors").then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) setSponsors(data);
    }).catch((err) => console.error("Error fetching sponsors:", err));
    fetch("/api/sponsors?action=get-open-countries").then((res) => res.json()).then((data) => {
      if (data && Array.isArray(data.countries)) {
        const list = ["Global", ...data.countries.filter((c) => c !== "Global")];
        setOpenCountries(list);
      }
    }).catch((err) => console.error("Error fetching open countries:", err));
  }, []);
  const openCreate = () => {
    setEditing(emptyDraft());
    setOpen(true);
  };
  const openEdit = (s) => {
    setEditing({
      ...s
    });
    setOpen(true);
  };
  const remove = (id) => {
    fetch("/api/sponsors?action=delete-sponsor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id
      })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        setSponsors((prev) => prev.filter((s) => s.id !== id));
      }
    }).catch((err) => console.error("Error deleting sponsor:", err));
  };
  const save = (s) => {
    fetch("/api/sponsors?action=save-sponsor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(s)
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        setSponsors((prev) => prev.some((p) => p.id === s.id) ? prev.map((p) => p.id === s.id ? s : p) : [...prev, s]);
        setOpen(false);
      }
    }).catch((err) => console.error("Error saving sponsor:", err));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { eyebrow: "Module · Brand Partnerships", title: "Sponsors", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminButton, { variant: "accent", onClick: openCreate, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5 inline" }),
    "Add Sponsor"
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: [
      sponsors.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SponsorCard, { s, onEdit: () => openEdit(s), onDelete: () => remove(s.id) }, s.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: openCreate, className: "rounded-lg border border-dashed border-border-subtle hover:border-accent transition-colors flex flex-col items-center justify-center min-h-[320px] text-center px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5 text-muted-foreground mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label", children: "Add New Sponsor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-2", children: "Logo · Type · Countries" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl p-0 bg-background border-border-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "px-8 pt-7 pb-4 border-b border-border-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: "Brand Partnership" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-serif text-2xl tracking-tight", children: sponsors.some((p) => editing && p.id === editing.id) ? "Edit Sponsor" : "Add Sponsor" })
      ] }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsx(SponsorForm, { initial: editing, openCountries, onCancel: () => setOpen(false), onSave: save }, editing.id)
    ] }) })
  ] });
}
function SponsorCard({
  s,
  onEdit,
  onDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
    opacity: 0,
    y: 8
  }, animate: {
    opacity: 1,
    y: 0
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: s.type || "Unlabeled", tone: "accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onEdit, className: "p-1.5 text-muted-foreground hover:text-foreground transition-colors", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, className: "p-1.5 text-muted-foreground hover:text-red-500 transition-colors", title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LogoFrame, { logo: s.logo, zoom: s.logoZoom, x: s.logoX, y: s.logoY, placeholder: s.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-xl truncate", children: s.name || "Untitled" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: s.url, target: "_blank", rel: "noreferrer", className: "text-xs text-muted-foreground hover:text-accent inline-flex items-center gap-1 mt-0.5 truncate max-w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3 shrink-0" }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: s.url || "no url" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
      s.countries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "No countries assigned" }),
      s.countries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] tracking-wide uppercase border border-border-subtle rounded-sm text-foreground/70", children: [
        c === "Global" && /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-2.5 h-2.5" }),
        c
      ] }, c))
    ] })
  ] }) });
}
function LogoFrame({
  logo,
  zoom,
  x,
  y,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full overflow-hidden rounded-md bg-white border border-border-subtle", style: {
    aspectRatio: "5 / 3"
  }, children: logo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "", className: "absolute inset-0 w-full h-full object-contain select-none pointer-events-none", style: {
    transform: `translate(${x}%, ${y}%) scale(${zoom})`,
    transformOrigin: "center"
  } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center font-serif italic text-3xl text-neutral-400", children: placeholder ? placeholder.split(" ").map((w) => w[0]).slice(0, 2).join("") : "Logo" }) });
}
function SponsorForm({
  initial,
  openCountries,
  onCancel,
  onSave
}) {
  const [draft, setDraft] = reactExports.useState(initial);
  const [otherType, setOtherType] = reactExports.useState(!PRESET_TYPES.includes(initial.type) && initial.type ? initial.type : "");
  const [useOther, setUseOther] = reactExports.useState(!!otherType);
  const fileRef = reactExports.useRef(null);
  const update = (k, v) => setDraft((d) => ({
    ...d,
    [k]: v
  }));
  const toggleCountry = (c) => {
    setDraft((d) => ({
      ...d,
      countries: d.countries.includes(c) ? d.countries.filter((x) => x !== c) : [...d.countries, c]
    }));
  };
  const onFile = (f) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => update("logo", reader.result);
    reader.readAsDataURL(f);
  };
  const canSave = reactExports.useMemo(() => {
    const t = useOther ? otherType.trim() : draft.type;
    return draft.name.trim() && t && draft.url.trim() && draft.countries.length > 0;
  }, [draft, useOther, otherType]);
  const submit = () => {
    const type = useOther ? otherType.trim() : draft.type;
    onSave({
      ...draft,
      type
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1.1fr_1fr] gap-0 max-h-[78vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-6 border-r border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Sponsor Type", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: useOther ? "__other__" : draft.type, onValueChange: (val) => {
          if (val === "__other__") {
            setUseOther(true);
            update("type", "");
          } else {
            setUseOther(false);
            update("type", val);
          }
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full h-9 text-xs tracking-wide border-border-subtle bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select sponsor type" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-popover border-border-subtle", children: [
            PRESET_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, className: "text-xs cursor-pointer", children: t }, t)),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__other__", className: "text-xs cursor-pointer", children: "Others" })
          ] })
        ] }),
        useOther && /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: otherType, onChange: (e) => setOtherType(e.target.value), placeholder: "e.g. Sustainable Fashion", className: "mt-3" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sponsor Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.name, onChange: (e) => update("name", e.target.value), placeholder: "e.g. Dior" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sponsor URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.url, onChange: (e) => update("url", e.target.value), placeholder: "https://www.dior.com" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Country Assignment", hint: "Select one, many, or Global", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-border-subtle bg-transparent px-3 py-2 text-xs shadow-sm ring-offset-background cursor-pointer hover:border-foreground/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: draft.countries.length === 0 ? "text-muted-foreground" : "text-foreground", children: draft.countries.length === 0 ? "Select countries..." : draft.countries.length === 1 ? draft.countries[0] : `${draft.countries.length} countries selected` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { className: "w-56 p-0 bg-popover border-border-subtle", align: "start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto p-1.5 space-y-0.5", children: openCountries.map((c) => {
              const active = draft.countries.includes(c);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggleCountry(c), className: `flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-xs transition-colors cursor-pointer ${active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  c === "Global" && /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }),
                  c
                ] }),
                active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" })
              ] }, c);
            }) }),
            draft.countries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border-subtle px-2.5 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => update("countries", []), className: "text-[10px] tracking-wide text-muted-foreground hover:text-foreground transition-colors", children: "Clear all" }) })
          ] })
        ] }),
        draft.countries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-2", children: draft.countries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] tracking-wide uppercase border border-border-subtle rounded-sm text-foreground/70", children: [
          c === "Global" && /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-2.5 h-2.5" }),
          c
        ] }, c)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-5 bg-surface-1/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: "Logo Studio · 5:3 Preview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogoFrame, { logo: draft.logo, zoom: draft.logoZoom, x: draft.logoX, y: draft.logoY, placeholder: draft.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => onFile(e.target.files?.[0]) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => fileRef.current?.click(), className: "inline-flex items-center gap-2 px-3 py-2 text-xs tracking-wide border border-border-subtle rounded-sm hover:border-accent transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5" }),
          " ",
          draft.logo ? "Replace Logo" : "Upload Logo"
        ] }),
        draft.logo && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => update("logo", void 0), className: "inline-flex items-center gap-1.5 px-3 py-2 text-xs tracking-wide text-muted-foreground hover:text-red-500 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
          " Remove"
        ] })
      ] }),
      draft.logo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: "Zoom", min: 0.4, max: 2, step: 0.01, value: draft.logoZoom, onChange: (v) => update("logoZoom", v), display: `${draft.logoZoom.toFixed(2)}×` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: "Horizontal", min: -50, max: 50, step: 1, value: draft.logoX, onChange: (v) => update("logoX", v), display: `${draft.logoX}%` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: "Vertical", min: -50, max: 50, step: 1, value: draft.logoY, onChange: (v) => update("logoY", v), display: `${draft.logoY}%` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          update("logoZoom", 1);
          update("logoX", 0);
          update("logoY", 0);
        }, className: "text-[11px] tracking-wide uppercase text-muted-foreground hover:text-foreground", children: "Reset positioning" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 flex items-center justify-end gap-3 px-8 py-5 border-t border-border-subtle bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, className: "px-4 py-2 text-xs tracking-wide text-muted-foreground hover:text-foreground", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", onClick: submit, disabled: !canSave, children: "Save Sponsor" })
    ] })
  ] });
}
function Field({
  label,
  hint,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "editorial-label text-foreground/80", children: label }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: hint })
    ] }),
    children
  ] });
}
function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  display
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-foreground/70", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground tabular-nums", children: display })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min, max, step, value, onChange: (e) => onChange(parseFloat(e.target.value)), className: "w-full accent-foreground" })
  ] });
}
export {
  SponsorsPage as component
};
