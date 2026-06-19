import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { usePortal } from "@/lib/portal-state";
import { useTheme } from "@/hooks/use-theme";
import { BrandLogo } from "@/components/theme/ThemeToggle";
import { ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/shop/login")({
  head: () => ({ meta: [{ title: "Shop Sign In — ReeVibes" }] }),
  component: ShopLoginPage,
});

function ShopLoginPage() {
  const { state, signIn, registerUser } = usePortal();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const success = signIn(email);
    if (success) {
      navigate({ to: "/shop" });
    } else {
      setError("Email not registered. Please register a new account first.");
    }
  };

  const handleGoogleLogin = () => {
    setError(null);
    // Google Mock details
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
    <div className={`min-h-screen flex flex-col justify-center items-center px-4 py-12 transition-colors duration-300 ${
      theme === "light" ? "bg-zinc-50 text-zinc-950" : "bg-zinc-950 text-zinc-50"
    }`}>
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Navigation back to shop */}
        <div className="flex justify-start">
          <Link to="/shop" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent transition-colors">
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

            {error && <p className="text-xs text-rose-500 font-medium text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-6 cursor-pointer"
            >
              Sign In to Account
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
            className="w-full border border-white/10 bg-white/5 hover:bg-white/10 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer text-foreground"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.61 4.5 1.64l2.428-2.43C17.337 1.498 14.9 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.984 0-.74-.08-1.3-.2-1.87H12.24z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider mt-4">
            New to the shop?{" "}
            <Link to="/shop/register" className="text-accent hover:underline font-bold">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
