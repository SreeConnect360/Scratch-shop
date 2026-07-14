import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";

/** Luxury subscription card: inline validation, success morph, gold glow. */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="relative py-16 md:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[22rem] w-[44rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[110px] dark:block"
      />
      <div className="section-shell max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassCard className="glass-strong p-8 text-center sm:p-12">
            <span
              aria-hidden="true"
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold shadow-[var(--gold-glow)]"
            >
              <Mail size={22} strokeWidth={1.6} />
            </span>
            <h2
              id="newsletter-heading"
              className="text-balance text-2xl text-ink sm:text-3xl"
            >
              Join the Private List
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
              Seasonal previews, atelier stories, and first access to the Flash
              Édit — a few beautiful letters a year. Nothing more.
            </p>

            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.p
                  key="done"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mx-auto mt-7 flex max-w-md items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/10 py-3.5 text-sm text-gold"
                  role="status"
                >
                  <Check size={16} aria-hidden="true" /> Welcome to the maison —
                  see you in your inbox.
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, scale: 0.96 }}
                  onSubmit={submit}
                  noValidate
                  className="mx-auto mt-7 max-w-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="your@email.com"
                      aria-invalid={status === "error"}
                      aria-describedby={
                        status === "error" ? "newsletter-error" : undefined
                      }
                      className="glass min-h-[48px] flex-1 rounded-full border-[var(--glass-border)] bg-transparent px-6 text-sm text-ink placeholder:text-ink-muted focus:border-gold/50 focus:outline-none"
                    />
                    <MagneticButton variant="gold" type="submit">
                      Subscribe
                    </MagneticButton>
                  </div>
                  {status === "error" && (
                    <p
                      id="newsletter-error"
                      role="alert"
                      className="mt-2.5 text-left text-xs text-[#a83e3a] dark:text-[#d98a8a] sm:pl-6"
                    >
                      Please enter a valid email address — e.g.
                      name@example.com.
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
