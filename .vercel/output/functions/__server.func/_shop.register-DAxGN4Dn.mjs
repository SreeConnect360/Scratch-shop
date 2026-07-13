import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as usePortal, b as useTheme, B as BrandLogo } from "./_ssr/router-CgqY8r00.mjs";
import "./_libs/sonner.mjs";
import "./_libs/maplibre-gl.mjs";
import { an as CircleAlert, ao as ShieldCheck, X, ap as ArrowLeft, n as Sparkles, a7 as Mail, k as CircleCheck, L as Lock } from "./_libs/lucide-react.mjs";
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
function ShopRegisterPage() {
  const {
    state,
    registerUser,
    signIn
  } = usePortal();
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [emailVerified, setEmailVerified] = reactExports.useState(false);
  const [showOtpModal, setShowOtpModal] = reactExports.useState(false);
  const [otp, setOtp] = reactExports.useState("");
  const [showFloatingWarning, setShowFloatingWarning] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (showFloatingWarning) {
      const timer = setTimeout(() => {
        setShowFloatingWarning(false);
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [showFloatingWarning]);
  const handleVerifyClick = () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address first.");
      return;
    }
    setError(null);
    setOtp("");
    setShowOtpModal(true);
  };
  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 4 || isNaN(Number(otp))) {
      alert("Please enter a valid 4-digit OTP.");
      return;
    }
    setEmailVerified(true);
    setShowOtpModal(false);
    alert("Email verified successfully!");
  };
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!emailVerified) {
      setShowFloatingWarning(true);
      return;
    }
    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    const defaultFirstName = email.split("@")[0];
    registerUser({
      firstName: defaultFirstName,
      lastName: "",
      email,
      phone: "",
      dob: "",
      gender: "Female",
      country: ""
    });
    setSuccess(true);
  };
  const handleGoogleSignup = () => {
    const googleEmail = "lea.dubois@maison.com";
    const existing = state.users.find((u) => u.email.toLowerCase() === googleEmail);
    if (existing) {
      signIn(googleEmail);
    } else {
      registerUser({
        firstName: "Léa",
        lastName: "Dubois",
        email: googleEmail,
        phone: "+33 6 1234 5678",
        dob: "1998-05-15",
        gender: "Female",
        country: "France"
      });
    }
    alert("Logged in via Google! Welcome back, Léa Dubois.");
    navigate({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-colors duration-300 relative ${theme === "light" ? "bg-zinc-50 text-zinc-950" : "bg-zinc-950 text-zinc-50"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" }),
    showFloatingWarning && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-rose-500/30 bg-rose-950/20 backdrop-blur-md px-6 py-3.5 rounded-full flex items-center gap-2.5 shadow-2xl text-xs font-semibold uppercase tracking-wider text-rose-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-rose-400 animate-pulse" }),
      "Please verify your email address first!"
    ] }) }),
    showOtpModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/20 p-6 md:p-8 max-w-sm w-full rounded-3xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg font-bold", children: "Verify Your Email" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowOtpModal(false), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4.5 h-4.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
        "We've dispatched a mock verification code to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: email }),
        ".",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-accent font-mono block mt-1.5", children: "(Enter any 4-digit code to verify)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleOtpVerify, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", maxLength: 4, placeholder: "1234", value: otp, onChange: (e) => setOtp(e.target.value.replace(/\D/g, "")), className: "w-32 bg-white/5 border border-white/10 px-4 py-3 text-center text-lg tracking-[0.4em] font-mono outline-none focus:border-accent rounded-xl text-foreground mx-auto block transition-all", required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full bg-accent hover:bg-accent/90 text-white rounded-full py-2.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-102 shadow-md cursor-pointer", children: "Verify Code" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md space-y-8 relative z-10", children: [
      !success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
        " Return to Curation"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-md space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { className: "w-28 h-auto mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "editorial-eyebrow text-accent mt-2 flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 animate-pulse" }),
            " Maison Membership"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl md:text-4xl mt-3 font-semibold tracking-tight", children: success ? "Success!" : "Register" })
        ] }),
        !success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRegisterSubmit, className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5 text-accent" }),
                " Email Address"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "your@address.com", value: email, onChange: (e) => {
                  setEmail(e.target.value);
                  setEmailVerified(false);
                }, className: "flex-1 bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground transition-all", required: true }),
                emailVerified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 px-4 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-sans", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                  " Verified"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleVerifyClick, className: "bg-accent hover:bg-accent/90 text-white rounded-full px-5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-md cursor-pointer", children: "Verify" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-accent" }),
                " Set Password"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "••••••••", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2 transition-all", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-6 cursor-pointer", children: "Continue Shopping" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center my-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-white/10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 text-[9px] uppercase tracking-widest text-muted-foreground font-mono", children: "Or connect with" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-white/10" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleGoogleSignup, className: "w-full border border-white/10 bg-white/5 hover:bg-white/10 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.61 4.5 1.64l2.428-2.43C17.337 1.498 14.9 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.984 0-.74-.08-1.3-.2-1.87H12.24z" }) }),
            "Continue with Google"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-center text-muted-foreground uppercase tracking-wider mt-4", children: [
            "Already have an account?",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-accent hover:underline font-bold", children: "Sign In instead" })
          ] })
        ] }) : (
          /* Success State */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-6 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-10 h-10" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your curated shopper profile has been registered and verified successfully." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-accent", children: "Welcome to ReeVibes!" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
              to: "/"
            }), className: "w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-md cursor-pointer", children: "Go to Shop" })
          ] })
        )
      ] })
    ] })
  ] });
}
export {
  ShopRegisterPage as component
};
