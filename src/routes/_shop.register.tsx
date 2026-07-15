import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { usePortal } from "@/lib/portal-state";
import { useTheme } from "@/hooks/use-theme";
import { BrandLogo } from "@/components/theme/ThemeToggle";
import { ArrowLeft, Sparkles, Mail, Lock, CheckCircle2, ShieldCheck, X, AlertCircle, User as UserIcon, ShieldAlert, Clock, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/config";

export const Route = createFileRoute("/_shop/register")({
  head: () => ({ meta: [{ title: "Shop Register — ReeVibes" }] }),
  component: ShopRegisterPage,
});

function ShopRegisterPage() {
  const { state, registerUser, signIn, signUp } = usePortal();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  
  // OTP Modal & Resend states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpStatus, setOtpStatus] = useState<"idle" | "success" | "invalid" | "expired">("idle");
  const [otpMessage, setOtpMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const [showFloatingWarning, setShowFloatingWarning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Auto-hide warning alert after 3 seconds
  useEffect(() => {
    if (showFloatingWarning) {
      const timer = setTimeout(() => {
        setShowFloatingWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showFloatingWarning]);

  // Resend Countdown Timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "SIGNUP" }),
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
      const res = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "SIGNUP" }),
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
      setEmailVerified(true);
      setTimeout(() => {
        setShowOtpModal(false);
      }, 1500);
      toast.success("Email verified successfully!");
    } catch (err: any) {
      setOtpMessage(err.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      toast.error("Please enter your Full Name.");
      return;
    }
    if (!emailVerified) {
      setShowFloatingWarning(true);
      return;
    }
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const isLessThan16 = password.length > 0 && password.length < 16;

    if (!isLessThan16) {
      toast.error("Password must be less than 16 characters.");
      return;
    }
    if (!hasLowercase) {
      toast.error("Password must include at least one lowercase letter.");
      return;
    }
    if (!hasUppercase) {
      toast.error("Password must include at least one uppercase letter.");
      return;
    }
    if (!hasNumber) {
      toast.error("Password must include at least one number.");
      return;
    }
    if (!hasSymbol) {
      toast.error("Password must include at least one symbol.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      // Set user session locally
      signUp({
        id: "USR-" + data.user.id,
        email,
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" "),
      });

      setSuccess(true);
      toast.success("Account registered successfully!");
    } catch (err: any) {
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
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch Google profile");
        const profile = await res.json();

        const googleEmail = profile.email;
        const firstName = profile.given_name || profile.name?.split(" ")[0] || "User";
        const lastName = profile.family_name || profile.name?.split(" ").slice(1).join(" ") || "";

        const existing = state.users.find(
          (u) => u.email.toLowerCase() === googleEmail.toLowerCase()
        );

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
            country: "",
          });
        }

        toast.success(`Welcome, ${firstName}! Signed in with Google.`);
        navigate({ to: "/" });
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
    },
  });

  const handleGoogleSignup = () => {
    setError(null);
    setIsGoogleLoading(true);
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      setTimeout(() => {
        const mockEmail = "testuser@gmail.com";
        const existing = state.users.find(
          (u) => u.email.toLowerCase() === mockEmail.toLowerCase()
        );
        if (existing) {
          signIn(mockEmail);
        } else {
          registerUser({
            firstName: "GoogleTest",
            lastName: "User",
            email: mockEmail,
            phone: "",
            dob: "",
            gender: "",
            country: "",
          });
        }
        toast.success("Registered and Signed in with Mock Google Account (Test Mode).");
        navigate({ to: "/" });
        setIsGoogleLoading(false);
      }, 800);
      return;
    }
    googleLogin();
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-colors duration-300 relative ${
      theme === "light" ? "bg-zinc-50 text-zinc-950" : "bg-zinc-950 text-zinc-50"
    }`}>
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Verification Warning Popup */}
      {showFloatingWarning && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="liquid-glass border border-rose-500/30 bg-rose-950/20 backdrop-blur-md px-6 py-3.5 rounded-full flex items-center gap-2.5 shadow-2xl text-xs font-semibold uppercase tracking-wider text-rose-400">
            <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
            Please verify your email address first!
          </div>
        </div>
      )}

      {/* OTP Verification Popup Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass border border-white/20 p-6 md:p-8 max-w-sm w-full rounded-3xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-lg font-bold">Verify Your Email</h3>
              </div>
              <button onClick={() => setShowOtpModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              We've sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>.
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
                  className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-2.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-102 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
        {/* Navigation back to shop */}
        {!success && (
          <div className="flex justify-start">
            <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent transition-colors">
              <ArrowLeft className="w-4 h-4" /> Return to Curation
            </Link>
          </div>
        )}

        {/* Liquid Glass Form Card */}
        <div className="liquid-glass border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-md space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <BrandLogo className="w-28 h-auto mx-auto" />
            <p className="editorial-eyebrow text-accent mt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Maison Membership
            </p>
            <h1 className="font-serif text-3xl md:text-4xl mt-3 font-semibold tracking-tight">
              {success ? "Success!" : "Register"}
            </h1>
          </div>

          {!success ? (
            <>
              {/* Single step registration form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-accent" /> Full Name
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2 transition-all"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-accent" /> Email Address
                  </span>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="email"
                      placeholder="your@address.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        setEmailVerified(false); // reset verified if edited
                      }}
                      className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground transition-all"
                      required
                    />
                    {emailVerified ? (
                      <span className="flex items-center gap-1.5 px-4 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleVerifyClick}
                        disabled={isSendingOtp}
                        className="bg-accent hover:bg-accent/90 text-white rounded-full px-5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                      >
                        {isSendingOtp ? "Sending..." : "Verify"}
                      </button>
                    )}
                  </div>
                </label>

                <div>
                  <label className="block relative">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-accent" /> Set Password
                    </span>
                    <div className="relative mt-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="•••••••• (Min 6 characters)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        maxLength={16}
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

                  {password.length > 0 && (
                    <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5 transition-all text-left">
                      <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-1">Password Requirements</p>
                      {password.length >= 16 && (
                        <p className="text-[10px] text-rose-400 flex items-center gap-1.5">
                          • Maximum 16 characters reached
                        </p>
                      )}
                      {password.length >= 16 && (
                        <p className="text-[10px] text-rose-400 flex items-center gap-1.5">
                          • Must be less than 16 characters
                        </p>
                      )}
                      {!/[a-z]/.test(password) && (
                        <p className="text-[10px] text-rose-400 flex items-center gap-1.5">
                          • Must include at least one lowercase letter
                        </p>
                      )}
                      {!/[A-Z]/.test(password) && (
                        <p className="text-[10px] text-rose-400 flex items-center gap-1.5">
                          • Must include at least one uppercase/capital letter
                        </p>
                      )}
                      {!/[0-9]/.test(password) && (
                        <p className="text-[10px] text-rose-400 flex items-center gap-1.5">
                          • Must include at least one number
                        </p>
                      )}
                      {!/[^A-Za-z0-9]/.test(password) && (
                        <p className="text-[10px] text-rose-400 flex items-center gap-1.5">
                          • Must include at least one symbol
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <label className="block relative">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-accent" /> Confirm Password
                  </span>
                  <div className="relative mt-2">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      maxLength={16}
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
                </label>

                {error && <p className="text-xs text-rose-500 font-medium text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={!emailVerified}
                  className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Account
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="px-4 text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Or connect with</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Google SSO */}
              <button
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                className="w-full border border-white/10 bg-white/5 hover:bg-white/10 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer text-foreground disabled:opacity-60 disabled:cursor-wait"
              >
                {isGoogleLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-accent hover:underline font-bold">
                  Sign In instead
                </Link>
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your curated shopper profile has been registered and verified successfully.
                </p>
                <p className="text-xs font-semibold text-accent">
                  Welcome to ReeVibes! We've sent you a Welcome Email.
                </p>
              </div>
              <button
                onClick={() => navigate({ to: "/" })}
                className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-md cursor-pointer"
              >
                Go to Shop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
