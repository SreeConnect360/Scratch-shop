import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PublicLayout } from "./PublicLayout-DIee0132.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { u as usePortal, H as HERO_IMAGES } from "./router-C_drxgJo.mjs";
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
function LoginPage() {
  const {
    signIn
  } = usePortal();
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    const success = signIn(email);
    if (!success) {
      setError("This email address is not registered. Please create an account first.");
      return;
    }
    const redirectContestId = sessionStorage.getItem("apply:redirectContestId");
    if (redirectContestId) {
      sessionStorage.removeItem("apply:redirectContestId");
      navigate({
        to: `/apply/${redirectContestId}`
      });
    } else {
      navigate({
        to: "/FashionBattle/account",
        search: {
          tab: "dashboard"
        }
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid lg:grid-cols-2 min-h-[88vh]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:block relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: HERO_IMAGES[3], alt: "", className: "absolute inset-0 w-full h-full object-cover img-cinematic" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-12 left-12 right-12 text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Maison Access" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-serif text-5xl", children: "Return to the salon." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8 lg:p-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Sign In" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-5xl", children: "Welcome back." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-10 space-y-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your@address.com" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••" }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-500", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full bg-foreground text-background py-4 editorial-label hover:bg-accent hover:text-white transition-colors", children: "Enter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "hover:text-accent", href: "#", children: "Forgot password?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/register", className: "hover:text-accent", children: "Create account →" })
        ] })
      ] })
    ] }) })
  ] }) });
}
function Field({
  label,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...props, className: "mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50" })
  ] });
}
export {
  LoginPage as component
};
