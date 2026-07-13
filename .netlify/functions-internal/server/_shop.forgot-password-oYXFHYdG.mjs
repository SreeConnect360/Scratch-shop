import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { b as useTheme, t as BrandLogo, B as BACKEND_URL } from "./_ssr/router-C_drxgJo.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/react-oauth__google.mjs";
import "./_libs/maplibre-gl.mjs";
import { ar as ShieldCheck, X, k as CircleCheck, H as ShieldAlert, ao as Clock, Q as ArrowLeft, n as Sparkles, ad as Mail, L as Lock } from "./_libs/lucide-react.mjs";
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
function ShopForgotPasswordPage() {
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const [email, setEmail] = reactExports.useState("");
  const [step, setStep] = reactExports.useState("email");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [showOtpModal, setShowOtpModal] = reactExports.useState(false);
  const [otp, setOtp] = reactExports.useState("");
  const [isSendingOtp, setIsSendingOtp] = reactExports.useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = reactExports.useState(false);
  const [otpStatus, setOtpStatus] = reactExports.useState("idle");
  const [otpMessage, setOtpMessage] = reactExports.useState("");
  const [resendCountdown, setResendCountdown] = reactExports.useState(0);
  const [isResetting, setIsResetting] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1e3);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);
  const handleRequestResetClick = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setError(null);
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link");
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
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
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
      setTimeout(() => {
        setShowOtpModal(false);
        setStep("reset");
      }, 1500);
      toast.success("OTP verified. Please reset your password.");
    } catch (err) {
      setOtpMessage(err.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password reset failed");
      setSuccess(true);
      toast.success("Password updated successfully.");
      setTimeout(() => {
        navigate({
          to: "/login"
        });
      }, 2500);
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsResetting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-colors duration-300 relative ${theme === "light" ? "bg-zinc-50 text-zinc-950" : "bg-zinc-950 text-zinc-50"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" }),
    showOtpModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/20 p-6 md:p-8 max-w-sm w-full rounded-3xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg font-bold", children: "Security Verification" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowOtpModal(false), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4.5 h-4.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
        "We've dispatched a security OTP to ",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: otpStatus === "success" || isVerifyingOtp || otp.length !== 6, className: "w-full bg-accent hover:bg-accent/90 text-white rounded-full py-2.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-102 shadow-md cursor-pointer disabled:opacity-50", children: isVerifyingOtp ? "Verifying..." : "Verify Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px] uppercase tracking-wider text-muted-foreground mt-2 px-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleResendOtp, disabled: resendCountdown > 0 || isSendingOtp || otpStatus === "success", className: "hover:text-accent font-bold disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors", children: isSendingOtp ? "Sending..." : resendCountdown > 0 ? `Resend OTP (${resendCountdown}s)` : "Resend OTP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowOtpModal(false), className: "hover:text-rose-400 transition-colors", children: "Cancel" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md space-y-8 relative z-10", children: [
      !success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", className: "flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
        " Back to Sign In"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-md space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { className: "w-28 h-auto mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "editorial-eyebrow text-accent mt-2 flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 animate-pulse" }),
            " Security Center"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl md:text-4xl mt-3 font-semibold tracking-tight", children: success ? "All Set!" : step === "email" ? "Recover Password" : "Reset Password" })
        ] }),
        !success ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: step === "email" ? (
          /* STEP 1: REQUEST OTP */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRequestResetClick, className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Enter your registered email address below. We'll send you an OTP to verify your identity." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5 text-accent" }),
                " Email Address"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "your@address.com", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2 transition-all", required: true })
            ] }),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-500 font-medium text-center", children: error }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: isSendingOtp, className: "w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-6 cursor-pointer disabled:opacity-50", children: isSendingOtp ? "Checking..." : "Request Reset OTP" })
          ] })
        ) : (
          /* STEP 3: RESET PASSWORD FORM */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleResetSubmit, className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-accent" }),
                " New Password"
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: isResetting, className: "w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-6 cursor-pointer disabled:opacity-50", children: isResetting ? "Updating..." : "Reset Password" })
          ] })
        ) }) : (
          /* Success State */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-6 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-10 h-10" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Password updated successfully." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-accent animate-pulse", children: "Redirecting to Sign In..." })
            ] })
          ] })
        )
      ] })
    ] })
  ] });
}
export {
  ShopForgotPasswordPage as component
};
