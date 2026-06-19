import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Play, ArrowUpRight } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp } from "@/components/motion/Reveal";
import { HERO_IMAGES } from "@/lib/data";
import { Marquee } from "@/components/public/Marquee";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReeVibes — Where Curves Become Editorial" },
      { name: "description", content: "A luxury editorial platform celebrating women through fashion contests, runway storytelling and cinematic photography." },
      { property: "og:title", content: "ReeVibes — Luxury Fashion Contest Platform" },
      { property: "og:image", content: HERO_IMAGES[0] },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-24 pb-10">
        {/* Full-Sized Hero Photo with Overlay Content */}
        <div className="relative w-full h-[calc(100vh-160px)] min-h-[500px] overflow-hidden rounded-lg border border-border-subtle shadow-2xl bg-zinc-950">
          <img
            src={HERO_IMAGES[0]}
            alt="ReeVibes Showcase"
            className="w-full h-full object-cover object-[center_12%] select-none pointer-events-none"
          />
          {/* Gradient Overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          {/* Absolute Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 space-y-6 z-10">
            <FadeUp>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide text-white font-serif max-w-2xl leading-tight drop-shadow-md">
                Where curves<br />become editorial.
              </h1>
            </FadeUp>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/live-contest"
                className="group inline-flex items-center gap-3 bg-white text-zinc-950 px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-all duration-300 rounded shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Enter the Live Contest
              </Link>
              <Link
                to="/apply"
                className="group inline-flex items-center gap-3 border border-white/40 hover:border-white hover:bg-white hover:text-zinc-950 text-white px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded shadow-sm"
              >
                Apply Contest <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Sponsors Section */}
      <SponsorsMarquee />
    </PublicLayout>
  );
}

function SponsorsMarquee() {
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/sponsors?action=get-sponsors")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSponsors(data.filter(s => s.status !== "Inactive"));
        }
      })
      .catch(err => console.error("Error fetching homepage sponsors:", err));
  }, []);

  if (sponsors.length === 0) return null;

  return (
    <section className="py-16 border-t border-border-subtle overflow-hidden">
      <FadeUp>
        <p className="editorial-eyebrow text-accent text-center mb-10">Our Partners</p>
      </FadeUp>
      {sponsors.length > 5 ? (
        <div className="max-w-7xl mx-auto">
          <Marquee speed={35}>
            {sponsors.map((s, idx) => (
              <PublicSponsorLogoFrame key={`${s.id}-${idx}`} s={s} />
            ))}
          </Marquee>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-6">
          {sponsors.map(s => (
            <PublicSponsorLogoFrame key={s.id} s={s} />
          ))}
        </div>
      )}
    </section>
  );
}

function PublicSponsorLogoFrame({ s }: { s: any }) {
  const isLink = !!s.url;
  const content = (
    <div
      className="relative overflow-hidden bg-white border border-border-subtle rounded transition-transform hover:scale-[1.02] flex items-center justify-center shrink-0 shadow-sm"
      style={{ width: "120px", height: "72px", aspectRatio: "5/3", padding: "8px" }}
    >
      {s.logo ? (
        <img
          src={s.logo}
          alt={s.name}
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          style={{
            transform: `translate(${s.logoX || 0}%, ${s.logoY || 0}%) scale(${s.logoZoom || 1})`,
            transformOrigin: "center"
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400 font-serif font-bold bg-neutral-100 uppercase">
          {s.name ? s.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("") : "SP"}
        </div>
      )}
    </div>
  );

  if (isLink) {
    return (
      <a href={s.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer block">
        {content}
      </a>
    );
  }

  return content;
}
