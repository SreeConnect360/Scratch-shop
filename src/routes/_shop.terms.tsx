import { createFileRoute, Link } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import { BrandLogo } from "@/components/theme/ThemeToggle";
import { FileText, Shield, Scale, CreditCard, RefreshCw, AlertCircle, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_shop/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — ReeVibes Curation" }] }),
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
      theme === "light" ? "bg-stone-50 text-zinc-900" : "bg-zinc-950 text-zinc-100"
    }`}>
      {/* Liquid Glass Golden Ambient Background Elements */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-amber-500/15 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-amber-600/10 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/3" />

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
            <Scale className="w-4 h-4" /> Terms of Engagement
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Welcome to Maison ReeVibes. By accessing our platform or purchasing curated items, you agree to comply with and be bound by the following conditions.
          </p>
          <p className="text-[11px] font-mono text-amber-500/80">
            Effective Date: July 24, 2026 | Version 2.4
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
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                1. Acceptance of Terms
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pl-13">
              By accessing, browsing, or placing an order on Maison ReeVibes (including our web platform and mobile services), you acknowledge having read, understood, and agreed to these Terms of Service in full. If you do not agree, please discontinue usage of the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 border-t border-amber-500/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                2. User Account & Authentication
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pl-13">
              When creating an account or authenticating via Google Single Sign-On, you agree to provide accurate and complete credentials. You remain solely responsible for maintaining the confidentiality of your account session.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 border-t border-amber-500/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                3. Orders, Pricing & Payments
              </h2>
            </div>
            <ul className="list-disc pl-18 space-y-2 text-sm text-muted-foreground">
              <li>All product prices are stated in INR (₹) or local currency equivalents, inclusive of applicable taxes.</li>
              <li>Payments are processed securely via encrypted gateways (Razorpay & verified payment providers).</li>
              <li>Maison ReeVibes reserves the right to cancel or adjust orders in cases of pricing errors or inventory unavailability.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 border-t border-amber-500/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                4. Shipping, Returns & Exchanges
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pl-13">
              We offer express delivery across covered postal zones. Items in original condition with tags intact are eligible for return or exchange within 15 days of dispatch. Please review our Returns Portal for full guidelines.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 border-t border-amber-500/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                5. Intellectual Property & Governing Law
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pl-13">
              All branding, typography, photography, design elements, and liquid glass assets are the exclusive intellectual property of Maison ReeVibes. Unauthorized reproduction is strictly prohibited. These terms are governed by the laws of India.
            </p>
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
