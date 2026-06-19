import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { usePortal } from "@/lib/portal-state";
import { useTheme } from "@/hooks/use-theme";
import { BrandLogo } from "@/components/theme/ThemeToggle";
import { ArrowLeft, Sparkles, Mail, Lock, CheckCircle2, ShieldCheck, X, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/shop/register")({
  head: () => ({ meta: [{ title: "Shop Register — ReeVibes" }] }),
  component: ShopRegisterPage,
});

function ShopRegisterPage() {
  const { state, registerUser, signIn } = usePortal();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  
  // OTP Modal & Floating Alert states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [showFloatingWarning, setShowFloatingWarning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-hide warning alert after 3 seconds
  useEffect(() => {
    if (showFloatingWarning) {
      const timer = setTimeout(() => {
        setShowFloatingWarning(false);
      }, 3000);
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

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4 || isNaN(Number(otp))) {
      alert("Please enter a valid 4-digit OTP.");
      return;
    }
    // Any 4-digit OTP succeeds
    setEmailVerified(true);
    setShowOtpModal(false);
    alert("Email verified successfully!");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
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
    
    // Create new account
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
    // Google mock sign-up details
    const googleEmail = "lea.dubois@maison.com";
    const existing = state.users.find(u => u.email.toLowerCase() === googleEmail);
    
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
    navigate({ to: "/shop" });
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
              We've dispatched a mock verification code to <span className="font-semibold text-foreground">{email}</span>.
              <br />
              <span className="text-[10px] text-accent font-mono block mt-1.5">(Enter any 4-digit code to verify)</span>
            </p>

            <form onSubmit={handleOtpVerify} className="space-y-4">
              <input
                type="text"
                maxLength={4}
                placeholder="1234"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-32 bg-white/5 border border-white/10 px-4 py-3 text-center text-lg tracking-[0.4em] font-mono outline-none focus:border-accent rounded-xl text-foreground mx-auto block transition-all"
                required
              />
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-2.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-102 shadow-md cursor-pointer"
              >
                Verify Code
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Navigation back to shop */}
        {!success && (
          <div className="flex justify-start">
            <Link to="/shop" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent transition-colors">
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
                        className="bg-accent hover:bg-accent/90 text-white rounded-full px-5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-md cursor-pointer"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-accent" /> Set Password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2 transition-all"
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-6 cursor-pointer"
                >
                  Continue Shopping
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
                className="w-full border border-white/10 bg-white/5 hover:bg-white/10 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer text-foreground"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.61 4.5 1.64l2.428-2.43C17.337 1.498 14.9 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.984 0-.74-.08-1.3-.2-1.87H12.24z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider mt-4">
                Already have an account?{" "}
                <Link to="/shop/login" className="text-accent hover:underline font-bold">
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
                  Welcome to ReeVibes!
                </p>
              </div>
              <button
                onClick={() => navigate({ to: "/shop" })}
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
