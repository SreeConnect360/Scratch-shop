import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp } from "@/components/motion/Reveal";
import { HERO_IMAGES } from "@/lib/data";
import { usePortal } from "@/lib/portal-state";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — ReeVibes" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = usePortal();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    const success = signIn(email);
    if (!success) {
      setError("This email address is not registered. Please create an account first.");
      return;
    }
    const redirectContestId = sessionStorage.getItem("apply:redirectContestId");
    if (redirectContestId) {
      sessionStorage.removeItem("apply:redirectContestId");
      navigate({ to: `/apply/${redirectContestId}` });
    } else {
      navigate({ to: "/account", search: { tab: "dashboard" } });
    }
  };

  return (
    <PublicLayout>
      <section className="grid lg:grid-cols-2 min-h-[88vh]">
        <div className="hidden lg:block relative overflow-hidden">
          <img src={HERO_IMAGES[3]} alt="" className="absolute inset-0 w-full h-full object-cover img-cinematic" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <p className="editorial-eyebrow text-accent">Maison Access</p>
            <h2 className="mt-4 font-serif text-5xl">Return to the salon.</h2>
          </div>
        </div>
        <div className="flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <FadeUp><p className="editorial-eyebrow text-accent">Sign In</p></FadeUp>
            <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-5xl">Welcome back.</h1></FadeUp>
            <form onSubmit={submit} className="mt-10 space-y-7">
              <Field label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@address.com" />
              <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              {error && <p className="text-xs text-rose-500">{error}</p>}
              <button type="submit" className="w-full bg-foreground text-background py-4 editorial-label hover:bg-accent hover:text-white transition-colors">Enter</button>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <a className="hover:text-accent" href="#">Forgot password?</a>
                <Link to="/register" className="hover:text-accent">Create account →</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="editorial-label text-muted-foreground">{label}</span>
      <input {...props} className="mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50" />
    </label>
  );
}
