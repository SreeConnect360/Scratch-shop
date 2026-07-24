import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { usePortal } from "@/lib/portal-state";
import { useTheme } from "@/hooks/use-theme";
import { BrandLogo } from "@/components/theme/ThemeToggle";
import { ArrowLeft, Sparkles, Mail, Lock, CheckCircle2, ShieldCheck, X, AlertCircle, ShieldAlert, Clock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/config";
import { z } from "zod";

const forgotPasswordSearchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute("/_shop/forgot-password")({
  validateSearch: (search) => forgotPasswordSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "Forgot Password — ReeVibes" }] }),
  component: ShopForgotPasswordPage,
});

function ShopForgotPasswordPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { theme } = useTheme();

  const [email, setEmail] = useState(search?.email || "");

  useEffect(() => {
    if (search?.email) {
      setEmail(search.email);
    }
  }, [search?.email]);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP Modal & Floating Alert states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpStatus, setOtpStatus] = useState<"idle" | "success" | "invalid" | "expired">("idle");
  const [otpMessage, setOtpMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const [isResetting, setIsResetting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resend Countdown Timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleRequestResetClick = async (e: React.FormEvent) => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
    } catch (err: any) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
      setResendCountdown(30);
      toast.success("OTP resent successfully!");
    } catch (err: any) {
      setOtpStatus("invalid");
      setOtpMessage(err.message);
      toast.error(err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || isNaN(Number(otp))) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
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
    } catch (err: any) {
      setOtpMessage(err.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password reset failed");

      setSuccess(true);
      toast.success("Password updated successfully.");
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2500);
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-colors duration-300 relative ${
      theme === "light" ? "bg-zinc-50 text-zinc-950" : "bg-zinc-950 text-zinc-50"
    }`}>
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* OTP Verification Popup Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass border border-white/20 p-6 md:p-8 max-w-sm w-full rounded-3xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-lg font-bold">Security Verification</h3>
              </div>
              <button onClick={() => setShowOtpModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              We've dispatched a security OTP to <span className="font-semibold text-foreground">{email}</span>.
            </p>

            {/* OTP Status Messages */}
            {otpStatus === "success" && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wide justify-center py-1">
                <CheckCircle2 className="w-4 h-4" /> ✔ Verified
              </div>
            )}
            {otpStatus === "invalid" && (
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wide justify-center py-1">
                <ShieldAlert className="w-4 h-4" /> ❌ Invalid OTP
              </div>
            )}
            {otpStatus === "expired" && (
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wide justify-center py-1">
                <Clock className="w-4 h-4" /> ⏰ OTP Expired
              </div>
            )}

            {otpMessage && otpStatus !== "success" && (
              <p className="text-[10px] text-center text-rose-400 font-medium">{otpMessage}</p>
            )}

            <form onSubmit={handleOtpVerify} className="space-y-5">
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                disabled={otpStatus === "success" || isVerifyingOtp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-40 bg-white/5 border border-white/10 px-4 py-3 text-center text-xl tracking-[0.4em] font-mono outline-none focus:border-accent rounded-xl text-foreground mx-auto block transition-all disabled:opacity-50"
                required
              />
              
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={otpStatus === "success" || isVerifyingOtp || otp.length !== 6}
                  className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-2.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-102 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify Code"}
                </button>

                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-muted-foreground mt-2 px-1">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCountdown > 0 || isSendingOtp || otpStatus === "success"}
                    className="hover:text-accent font-bold disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors"
                  >
                    {isSendingOtp ? "Sending..." : resendCountdown > 0 ? `Resend OTP (${resendCountdown}s)` : "Resend OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Navigation back to login */}
        {!success && (
          <div className="flex justify-start">
            <Link to="/login" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        )}

        {/* Liquid Glass Card */}
        <div className="liquid-glass border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-md space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <BrandLogo className="w-28 h-auto mx-auto" />
            <p className="editorial-eyebrow text-accent mt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Security Center
            </p>
            <h1 className="font-serif text-3xl md:text-4xl mt-3 font-semibold tracking-tight">
              {success ? "All Set!" : step === "email" ? "Recover Password" : "Reset Password"}
            </h1>
          </div>

          {!success ? (
            <>
              {step === "email" ? (
                /* STEP 1: REQUEST OTP */
                <form onSubmit={handleRequestResetClick} className="space-y-5">
                  <p className="text-xs text-muted-foreground text-center">
                    Enter your registered email address below. We'll send you an OTP to verify your identity.
                  </p>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-accent" /> Email Address
                    </span>
                    <input
                      type="email"
                      placeholder="your@address.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2 transition-all"
                      required
                    />
                  </label>

                  {error && <p className="text-xs text-rose-500 font-medium text-center">{error}</p>}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-6 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingOtp ? "Checking..." : "Request Reset OTP"}
                  </button>
                </form>
              ) : (
                /* STEP 3: RESET PASSWORD FORM */
                <form onSubmit={handleResetSubmit} className="space-y-5">
                  <label className="block relative">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-accent" /> New Password
                    </span>
                    <div className="relative mt-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="•••••••• (Min 6 characters)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 pl-4 pr-12 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </label>

                  <label className="block relative">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-accent" /> Re-enter Password
                    </span>
                    <div className="relative mt-2">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 pl-4 pr-12 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && password !== confirmPassword && (
                      <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1.5 mt-2 px-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Passwords do not match
                      </p>
                    )}
                  </label>

                  {error && <p className="text-xs text-rose-500 font-medium text-center">{error}</p>}

                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-6 cursor-pointer disabled:opacity-50"
                  >
                    {isResetting ? "Updating..." : "Reset Password"}
                  </button>
                </form>
              )}
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Password updated successfully.
                </p>
                <p className="text-xs font-semibold text-accent animate-pulse">
                  Redirecting to Sign In...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
