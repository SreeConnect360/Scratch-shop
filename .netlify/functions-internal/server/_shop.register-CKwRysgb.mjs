import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as usePortal, b as useTheme, t as BrandLogo, B as BACKEND_URL } from "./_ssr/router-C0nupAs3.mjs";
import { u as useGoogleLogin } from "./_libs/react-oauth__google.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/maplibre-gl.mjs";
import { aq as CircleAlert, ar as ShieldCheck, X, k as CircleCheck, H as ShieldAlert, ao as Clock, Q as ArrowLeft, n as Sparkles, a7 as User, ad as Mail, L as Lock } from "./_libs/lucide-react.mjs";
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
function ShopRegisterPage() {
  const {
    state,
    registerUser,
    signIn,
    signUp
  } = usePortal();
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [emailVerified, setEmailVerified] = reactExports.useState(false);
  const [showOtpModal, setShowOtpModal] = reactExports.useState(false);
  const [otp, setOtp] = reactExports.useState("");
  const [isSendingOtp, setIsSendingOtp] = reactExports.useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = reactExports.useState(false);
  const [otpStatus, setOtpStatus] = reactExports.useState("idle");
  const [otpMessage, setOtpMessage] = reactExports.useState("");
  const [resendCountdown, setResendCountdown] = reactExports.useState(0);
  const [showFloatingWarning, setShowFloatingWarning] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (showFloatingWarning) {
      const timer = setTimeout(() => {
        setShowFloatingWarning(false);
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [showFloatingWarning]);
  reactExports.useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1e3);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);
  const handleVerifyClick = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address first.");
      return;
    }
    setError(null);
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          type: "SIGNUP"
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
      setOtp("");
      setOtpStatus("idle");
      setOtpMessage("");
      setShowOtpModal(true);
      setResendCountdown(30);
      toast.success("OTP sent to your email!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setIsSendingOtp(true);
    setOtpStatus("idle");
    setOtpMessage("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          type: "SIGNUP"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
      setResendCountdown(30);
      toast.success("OTP resent successfully!");
    } catch (err) {
      setOtpStatus("invalid");
      setOtpMessage(err.message);
      toast.error(err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || isNaN(Number(otp))) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          otp
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.message && data.message.toLowerCase().includes("expired")) {
          setOtpStatus("expired");
        } else {
          setOtpStatus("invalid");
        }
        throw new Error(data.message || "Invalid OTP");
      }
      setOtpStatus("success");
      setEmailVerified(true);
      setTimeout(() => {
        setShowOtpModal(false);
      }, 1500);
      toast.success("Email verified successfully!");
    } catch (err) {
      setOtpMessage(err.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!fullName) {
      toast.error("Please enter your Full Name.");
      return;
    }
    if (!emailVerified) {
      setShowFloatingWarning(true);
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      signUp({
        email,
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" ")
      });
      setSuccess(true);
      toast.success("Account registered successfully!");
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
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
        console.error("Google Sign-Up error:", err);
        setError("Google Sign-In failed. Please try again.");
        toast.error("Google Sign-In failed.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google signup error:", err);
      setError("Google Sign-In was cancelled or failed.");
      toast.error("Google Sign-In failed.");
    }
  });
  const handleGoogleSignup = () => {
    setError(null);
    setIsGoogleLoading(true);
    googleLogin();
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
        "We've sent a 6-digit verification code to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: email }),
        "."
      ] }),
      otpStatus === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wide justify-center py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
        " ✔ Verified"
      ] }),
      otpStatus === "invalid" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wide justify-center py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-4 h-4" }),
        " ❌ Invalid OTP"
      ] }),
      otpStatus === "expired" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wide justify-center py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
        " ⏰ OTP Expired"
      ] }),
      otpMessage && otpStatus !== "success" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-center text-rose-400 font-medium", children: otpMessage }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleOtpVerify, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", maxLength: 6, placeholder: "000000", value: otp, disabled: otpStatus === "success" || isVerifyingOtp, onChange: (e) => setOtp(e.target.value.replace(/\D/g, "")), className: "w-40 bg-white/5 border border-white/10 px-4 py-3 text-center text-xl tracking-[0.4em] font-mono outline-none focus:border-accent rounded-xl text-foreground mx-auto block transition-all disabled:opacity-50", required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: otpStatus === "success" || isVerifyingOtp || otp.length !== 6, className: "w-full bg-accent hover:bg-accent/90 text-white rounded-full py-2.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-102 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", children: isVerifyingOtp ? "Verifying..." : "Verify Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px] uppercase tracking-wider text-muted-foreground mt-2 px-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleResendOtp, disabled: resendCountdown > 0 || isSendingOtp || otpStatus === "success", className: "hover:text-accent font-bold disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors", children: isSendingOtp ? "Sending..." : resendCountdown > 0 ? `Resend OTP (${resendCountdown}s)` : "Resend OTP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowOtpModal(false), className: "hover:text-rose-400 transition-colors", children: "Cancel" })
          ] })
        ] })
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5 text-accent" }),
                " Full Name"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Enter your full name", value: fullName, onChange: (e) => setFullName(e.target.value), className: "w-full bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2 transition-all", required: true })
            ] }),
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
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleVerifyClick, disabled: isSendingOtp, className: "bg-accent hover:bg-accent/90 text-white rounded-full px-5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-wait", children: isSendingOtp ? "Sending..." : "Verify" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-accent" }),
                " Set Password"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "•••••••• (Min 6 characters)", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2 transition-all", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-accent" }),
                " Confirm Password"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "••••••••", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2 transition-all", required: true })
            ] }),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-500 font-medium text-center", children: error }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: !emailVerified, className: "w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", children: "Create Account" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center my-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-white/10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 text-[9px] uppercase tracking-widest text-muted-foreground font-mono", children: "Or connect with" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-white/10" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleGoogleSignup, disabled: isGoogleLoading, className: "w-full border border-white/10 bg-white/5 hover:bg-white/10 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer text-foreground disabled:opacity-60 disabled:cursor-wait", children: isGoogleLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-accent", children: "Welcome to ReeVibes! We've sent you a Welcome Email." })
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
