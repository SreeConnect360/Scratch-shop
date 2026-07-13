import { Instagram, Twitter, Facebook, Youtube, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const columns = [
  {
    title: "Shop",
    links: ["New Arrivals", "Women", "Men", "Accessories", "Fragrance", "Sale"],
  },
  {
    title: "Maison",
    links: ["Our Story", "Ateliers", "Sustainability", "Careers", "Press"],
  },
  {
    title: "Care",
    links: ["Contact", "Shipping", "Returns", "Size Guide", "FAQ"],
  },
];

const socials = [
  { label: "Instagram", Icon: Instagram },
  { label: "Twitter", Icon: Twitter },
  { label: "Facebook", Icon: Facebook },
  { label: "YouTube", Icon: Youtube },
];

/** Premium glass footer with quiet columns and a back-to-top pearl. */
export default function Footer() {
  return (
    <footer
      id="footer"
      aria-label="Site footer"
      className="relative mt-10 pb-8"
    >
      <div className="section-shell">
        <div className="glass glass-reflect glass-edge rounded-[2rem] px-7 py-10 sm:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            {/* brand */}
            <div>
              <p className="text-2xl tracking-[0.3em] text-ink">
                É<span className="gold-text">LYSIA</span>
              </p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
                Couture-grade fashion, hand-finished in European ateliers and
                delivered with quiet ceremony.
              </p>
              <ul role="list" className="mt-6 flex gap-2">
                {socials.map(({ label, Icon }) => (
                  <li key={label}>
                    <motion.a
                      href="#"
                      aria-label={label}
                      data-cursor="link"
                      whileHover={{ scale: 1.12, y: -2 }}
                      whileTap={{ scale: 0.92 }}
                      className="glass flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-gold"
                    >
                      <Icon size={15} strokeWidth={1.8} />
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* link columns */}
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-[11px] tracking-[0.3em] uppercase text-gold">
                  {col.title}
                </h3>
                <ul role="list" className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        data-cursor="link"
                        className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--glass-border)] pt-6 sm:flex-row">
            <p className="text-xs text-ink-muted">
              © 2026 ÉLYSIA Maison. All rights reserved.
            </p>
            <motion.button
              type="button"
              data-cursor="button"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ y: -3, scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className="glass flex h-11 w-11 items-center justify-center rounded-full text-gold shadow-[var(--gold-glow)]"
            >
              <ArrowUp size={16} strokeWidth={1.8} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
