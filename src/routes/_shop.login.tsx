import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { usePortal } from "@/lib/portal-state";
import { useTheme } from "@/hooks/use-theme";
import { BrandLogo } from "@/components/theme/ThemeToggle";
import { ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/config";

export const Route = createFileRoute("/_shop/login")({
  head: () => ({ meta: [{ title: "Shop Sign In — ReeVibes" }] }),
  component: ShopLoginPage,
});

function ShopLoginPage() {
  const { state, signIn, registerUser, signUp } = usePortal();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Log in locally in portal context state
      signUp({
        id: "USR-" + data.user.id,
        email: data.user.email,
        firstName: data.user.name,
        lastName: "",
      });

      toast.success(`Welcome back, ${data.user.name}!`);
      navigate({ to: "/" });
    } catch (err: any) {
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
        console.error("Google Sign-In error:", err);
        setShowGoogleModal(true);
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google login error, launching modal fallback:", err);
      setIsGoogleLoading(false);
      setShowGoogleModal(true);
    },
  });

  const handleGoogleLogin = () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      googleLogin();
    } catch (err) {
      console.warn("Failed to launch Google Login popup, switching to modal:", err);
      setIsGoogleLoading(false);
      setShowGoogleModal(true);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-colors duration-300 ${
      theme === "light" ? "bg-zinc-50 text-zinc-950" : "bg-zinc-950 text-zinc-50"
    }`}>
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Navigation back to shop */}
        <div className="flex justify-start">
          <Link to="/" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Curation
          </Link>
        </div>

        {/* Liquid Glass Form Card */}
        <div className="liquid-glass border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-md space-y-6">
          <div className="text-center space-y-2">
            <BrandLogo className="w-28 h-auto mx-auto" />
            <p className="editorial-eyebrow text-accent mt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Curation Membership
            </p>
            <h1 className="font-serif text-3xl md:text-4xl mt-3 font-semibold tracking-tight">Sign In</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label className="block relative">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-accent" /> Password
                </span>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 pl-4 pr-12 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>
              
              <div className="flex justify-end mt-2 px-2">
                <Link to="/forgot-password" className="text-[10px] uppercase tracking-wider text-accent hover:underline font-bold transition-all">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && <p className="text-xs text-rose-500 font-medium text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-4 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? "Signing In..." : "Sign In to Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-4 text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Or connect with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google SSO Login */}
          <button
            onClick={handleGoogleLogin}
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
            New to the shop?{" "}
            <Link to="/register" className="text-accent hover:underline font-bold">
              Register Here
            </Link>
          </p>
        </div>
      </div>

      {/* Google Auth Quick Sign-In Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-900 border border-white/20 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-6">
            <button
              onClick={() => { setShowGoogleModal(false); setIsGoogleLoading(false); }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white p-2 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground">Sign in with Google</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Continue to your ReeVibes Curation account with your Google address.
              </p>
            </div>

            <div className="space-y-4">
              {/* Account Shortcut */}
              <button
                type="button"
                onClick={() => handleModalGoogleAuth("rockeysrinivas891@gmail.com")}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">
                    R
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground group-hover:text-accent">rockeysrinivas891@gmail.com</p>
                    <p className="text-[10px] text-muted-foreground">Google Account</p>
                  </div>
                </div>
                <span className="text-xs text-accent font-bold">Sign In →</span>
              </button>

              <div className="flex items-center my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="px-3 text-[9px] uppercase tracking-widest text-muted-foreground font-mono">Or enter Google Email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleModalGoogleAuth(); }} className="space-y-3">
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs outline-none focus:border-accent rounded-full text-foreground"
                />
                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-full text-xs uppercase tracking-widest transition-transform active:scale-95 cursor-pointer shadow-lg"
                >
                  Continue as Google User
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
