import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, d as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { P as PublicLayout } from "./PublicLayout-DQjLDRSD.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { u as usePortal } from "./router-CgqY8r00.mjs";
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
function AccountShell() {
  const {
    state,
    signOut
  } = usePortal();
  const navigate = useNavigate();
  const path = useRouterState({
    select: (s) => s.location.pathname
  });
  const [openSection, setOpenSection] = reactExports.useState(() => {
    if (path.startsWith("/account/role-applications")) return "Applications";
    if (path.startsWith("/account/role-ratings")) return "Ratings";
    if (path.startsWith("/account/role-casting")) return "Casting Call";
    if (path.startsWith("/account/role-judgements")) return "Judgements";
    return null;
  });
  if (!state.user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[70vh] flex items-center justify-center px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Members Only" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-5xl", children: "Sign in to continue." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Your account is reserved for registered members of the maison." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex gap-4 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/login", className: "bg-foreground text-background px-8 py-3.5 editorial-label hover:bg-accent hover:text-white transition-colors", children: "Sign In" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/register", className: "border border-foreground px-8 py-3.5 editorial-label hover:bg-foreground hover:text-background transition-colors", children: "Register" })
      ] })
    ] }) }) });
  }
  const handleLogout = () => {
    signOut();
    navigate({
      to: "/FashionBattle"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-24 pb-10 border-b border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Maison Membership" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-4 font-serif text-5xl lg:text-7xl", children: [
        "Welcome, ",
        state.user.firstName,
        "."
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: state.user.roles.join(" · ") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-10 px-6 lg:px-16 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "lg:col-span-3 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-4 border-b border-border-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl uppercase tracking-wider text-foreground", children: "My Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-6 bg-accent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/FashionBattle/account", search: {
            tab: "dashboard"
          }, className: `flex items-center justify-between text-xs uppercase tracking-widest font-semibold transition-colors ${path === "/account" ? "text-accent" : "text-foreground hover:text-accent"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "My Dashboard" }),
            path === "/account" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 bg-accent rotate-45" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop/categories", className: `flex items-center justify-between text-xs uppercase tracking-widest font-semibold transition-colors text-foreground/80 hover:text-accent`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Categories" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/account", search: {
            tab: "orders"
          }, className: `flex items-center justify-between text-xs uppercase tracking-widest font-semibold transition-colors text-foreground/80 hover:text-accent`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "My Orders" }) }),
          "            ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/apply", className: `block text-xs uppercase tracking-widest font-bold text-foreground hover:text-accent transition-colors`, children: "Apply To Contest" })
        ] }),
        (() => {
          const assignedRoles = [{
            role: "Applications",
            label: "Applications",
            to: "/FashionBattle/account/role-applications"
          }, {
            role: "Ratings",
            label: "Ratings",
            to: "/FashionBattle/account/role-ratings"
          }, {
            role: "Casting Call",
            label: "Casting Call",
            to: "/FashionBattle/account/role-casting"
          }, {
            role: "Judgements",
            label: "Judgement",
            to: "/FashionBattle/account/role-judgements"
          }].filter((r) => state.user?.roles.includes(r.role));
          if (assignedRoles.length === 0) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-accent/30 bg-black p-3.5 text-center rounded-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#", className: "text-accent text-[11px] font-bold tracking-wider hover:underline block", children: [
              "My Redbox Associates",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-accent/80 font-normal", children: "(By Invite Only) -?-" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5 pt-2", children: assignedRoles.map((r) => {
              const isOpen = openSection === r.role;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpenSection(isOpen ? null : r.role), className: "w-full bg-white text-black border border-black/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-between hover:bg-neutral-100 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm leading-none", children: isOpen ? "x" : "+" })
                ] }),
                isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface-2 p-3 border-x border-b border-border-subtle space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: r.to, className: "block text-xs text-foreground/95 hover:text-accent transition-colors", children: [
                  "→ Open ",
                  r.label
                ] }) })
              ] }, r.role);
            }) })
          ] });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", className: "text-[9px] tracking-widest text-foreground/60 hover:text-foreground uppercase block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-[8px] opacity-75", children: "SWITCH to ReeVibes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-xs text-foreground", children: "Luxury Shop" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleLogout, className: "w-full bg-[#C05621] text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#A04618] transition-colors rounded-sm", children: "Log Out" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AccountShell as component
};
