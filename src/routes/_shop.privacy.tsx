import { createFileRoute, Link } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import { BrandLogo } from "@/components/theme/ThemeToggle";
import { ShieldCheck, Lock, Eye, FileText, UserCheck, ArrowLeft, Sparkles, Server, Key, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/_shop/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — ReeVibes Curation" }] }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
      theme === "light" ? "bg-stone-50 text-zinc-900" : "bg-zinc-950 text-zinc-100"
    }`}>
      {/* Liquid Glass Golden Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/15 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-amber-600/10 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/3" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
        {/* Navigation / Header Bar */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Curation
          </Link>
          <BrandLogo className="h-9 w-auto" />
        </div>

        {/* Hero Banner */}
        <div className="text-center space-y-4 py-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Official Governance Document
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
            Privacy & Data Policy
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            At Maison ReeVibes, we prioritize your absolute digital privacy and commit to safeguarding your personal information with bank-grade security protocols.
          </p>
          <p className="text-[11px] font-mono text-amber-500/80">
            Last Updated: July 24, 2026 | Version 2.4
          </p>
        </div>

        {/* Main Content Glassmorphic Container */}
        <div className={`p-8 sm:p-12 rounded-3xl border backdrop-blur-xl shadow-2xl space-y-10 ${
          theme === "light"
            ? "bg-white/80 border-amber-500/30 shadow-amber-900/5"
            : "bg-zinc-900/60 border-amber-500/20 shadow-black/60"
        }`}>
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pl-13">
              We collect information to provide superior, tailored shopping experiences. This includes:
            </p>
            <ul className="list-disc pl-18 space-y-2 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Account Information:</strong> Your name, email address, contact phone number, and delivery details provided during sign-up or checkout.</li>
              <li><strong className="text-foreground">Google OAuth Data:</strong> When utilizing "Continue with Google", we access your basic profile (full name, email address, profile picture URL) strictly to authenticate your account.</li>
              <li><strong className="text-foreground">Transactional Records:</strong> Order details, purchase history, and shipping preferences to fulfill your orders.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 border-t border-amber-500/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Key className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                2. Google OAuth User Data Compliance
              </h2>
            </div>
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-sm leading-relaxed space-y-3">
              <p className="text-amber-200/90 font-medium">
                ReeVibes adheres to the Google API Services User Data Policy, including the Limited Use requirements.
              </p>
              <p className="text-xs text-muted-foreground">
                We use Google OAuth credentials strictly to authenticate your identity. We do not store, sell, or utilize your Google authentication credentials or profile data for third-party marketing, advertisement targeting, or unauthorized profiling.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 border-t border-amber-500/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                3. How We Use Your Data
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pl-13">
              Your personal data is used solely for the following operational purposes:
            </p>
            <ul className="list-disc pl-18 space-y-2 text-sm text-muted-foreground">
              <li>Processing, fulfilling, and dispatching luxury product orders via logistics partners.</li>
              <li>Sending transactional notifications, tracking updates, and account security OTP codes.</li>
              <li>Customizing your personal fashion feed and curating bespoke recommendations.</li>
              <li>Ensuring platform integrity and preventing fraudulent activity.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 border-t border-amber-500/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                4. Cookies & Personalization
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pl-13">
              Maison ReeVibes utilizes essential session cookies and persistent state tokens to preserve your active shopping cart, theme preferences, and authentication state. You may clear your browser storage at any time to purge cached credentials.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 border-t border-amber-500/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                5. Your Data Rights & Contact
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pl-13">
              You retain full rights to request access, correction, or deletion of your personal data stored on our servers. For privacy inquiries or data deletion requests, contact our Data Concierge:
            </p>
            <div className="mt-4 p-5 rounded-2xl bg-zinc-950/40 border border-amber-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-amber-400">Data Concierge Officer</p>
                <p className="text-sm font-semibold text-foreground">hello@reevibes.com</p>
              </div>
              <Link
                to="/account"
                search={{ tab: "profile" }}
                className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all"
              >
                Manage Profile
              </Link>
            </div>
          </section>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          © 2026 Maison ReeVibes Inc. All Rights Reserved. Designed with Liquid Glass Golden Aesthetic.
        </div>
      </div>
    </div>
  );
}
