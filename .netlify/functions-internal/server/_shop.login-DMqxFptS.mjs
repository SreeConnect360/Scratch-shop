import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as usePortal, b as useTheme, t as BrandLogo, B as BACKEND_URL } from "./_ssr/router-C_drxgJo.mjs";
import { u as useGoogleLogin } from "./_libs/react-oauth__google.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/maplibre-gl.mjs";
import { Q as ArrowLeft, n as Sparkles, ad as Mail, L as Lock, I as EyeOff, G as Eye } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "node:fs";
import "node:path";
import "./_libs/xlsx.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-alert-dialog.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/framer-motion.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
import "./_libs/zod.mjs";
function ShopLoginPage() {
  const {
    state,
    signIn,
    registerUser,
    signUp
  } = usePortal();
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = reactExports.useState(false);
  const [isLoggingIn, setIsLoggingIn] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }
      signUp({
        email: data.user.email,
        firstName: data.user.name,
        lastName: ""
      });
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate({
        to: "/"
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setError(null);
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch Google profile");
        const profile = await res.json();
        const googleEmail = profile.email;
        const firstName = profile.given_name || profile.name?.split(" ")[0] || "User";
        const lastName = profile.family_name || profile.name?.split(" ").slice(1).join(" ") || "";
        const existing = state.users.find((u) => u.email.toLowerCase() === googleEmail.toLowerCase());
        if (existing) {
          signIn(googleEmail);
        } else {
          registerUser({
            firstName,
            lastName,
            email: googleEmail,
            phone: "",
            dob: "",
            gender: "",
            country: ""
          });
        }
        toast.success(`Welcome, ${firstName}! Signed in with Google.`);
        navigate({
          to: "/"
        });
      } catch (err) {
        console.error("Google Sign-In error:", err);
        setError("Google Sign-In failed. Please try again.");
        toast.error("Google Sign-In failed.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google login error:", err);
      setError("Google Sign-In was cancelled or failed.");
      toast.error("Google Sign-In failed.");
    }
  });
  const handleGoogleLogin = () => {
    setError(null);
    setIsGoogleLoading(true);
    googleLogin();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-colors duration-300 ${theme === "light" ? "bg-zinc-50 text-zinc-950" : "bg-zinc-950 text-zinc-50"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md space-y-8 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
        " Return to Curation"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-md space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { className: "w-28 h-auto mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "editorial-eyebrow text-accent mt-2 flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 animate-pulse" }),
            " Curation Membership"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl md:text-4xl mt-3 font-semibold tracking-tight", children: "Sign In" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5 text-accent" }),
              " Email Address"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "your@address.com", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2 transition-all", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-accent" }),
                " Password"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", placeholder: "••••••••", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-white/5 border border-white/10 pl-4 pr-12 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground transition-all", required: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-2 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/forgot-password", className: "text-[10px] uppercase tracking-wider text-accent hover:underline font-bold transition-all", children: "Forgot Password?" }) })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-500 font-medium text-center", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: isLoggingIn, className: "w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-4 cursor-pointer disabled:opacity-50", children: isLoggingIn ? "Signing In..." : "Sign In to Account" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center my-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-white/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 text-[9px] uppercase tracking-widest text-muted-foreground font-mono", children: "Or connect with" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-white/10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleGoogleLogin, disabled: isGoogleLoading, className: "w-full border border-white/10 bg-white/5 hover:bg-white/10 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer text-foreground disabled:opacity-60 disabled:cursor-wait", children: isGoogleLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-4 h-4 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", className: "opacity-25" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 12a8 8 0 018-8", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", className: "opacity-75" })
          ] }),
          "Connecting..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z", fill: "#4285F4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })
          ] }),
          "Continue with Google"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-center text-muted-foreground uppercase tracking-wider mt-4", children: [
          "New to the shop?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "text-accent hover:underline font-bold", children: "Register Here" })
        ] })
      ] })
    ] })
  ] });
}
export {
  ShopLoginPage as component
};
