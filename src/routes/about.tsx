import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { CinematicImage, FadeUp } from "@/components/motion/Reveal";
import { HERO_IMAGES } from "@/lib/data";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — ReeVibes" }, { name: "description", content: "The ReeVibes maison — our mission, our manifesto, our cinema." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicLayout>
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <img src={HERO_IMAGES[2]} alt="About ReeVibes" className="absolute inset-0 w-full h-full object-cover img-cinematic" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-16 text-white">
          <FadeUp><p className="editorial-eyebrow text-accent">The Maison</p></FadeUp>
          <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-6xl lg:text-9xl">About Us</h1></FadeUp>
        </div>
      </section>

      <section className="px-6 lg:px-16 py-24 max-w-5xl">
        <FadeUp><p className="editorial-eyebrow text-accent">Manifesto</p></FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="mt-6 font-serif text-4xl lg:text-6xl leading-tight text-balance">
            We refuse the footnote. We write women into the headline of fashion — at every silhouette, every shade, every silhouette unbought.
          </h2>
        </FadeUp>
      </section>

      <section className="px-6 lg:px-16 py-16 grid lg:grid-cols-12 gap-10 border-t border-border-subtle">
        <div className="lg:col-span-5"><CinematicImage src={HERO_IMAGES[1]} alt="Editorial" className="aspect-[3/4]" /></div>
        <div className="lg:col-span-6 lg:col-start-7">
          <FadeUp><p className="editorial-eyebrow text-accent">Mission</p></FadeUp>
          <FadeUp delay={0.1}><h3 className="mt-4 font-serif text-4xl">A theatre for the new editorial woman.</h3></FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-6 text-muted-foreground">
              ReeVibes is part contest, part magazine, part runway. We discover, dress and chronicle the next generation of women defining fashion — across continents, ateliers and screens. Our craft is cinema; our subject is presence.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[["2018","Founded"],["64","Countries"],["1.2M","Voices"]].map(([k,v]) => (
                <div key={v} className="border-t border-border pt-4"><div className="font-serif text-3xl">{k}</div><div className="editorial-label text-muted-foreground mt-1">{v}</div></div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="px-6 lg:px-16 py-24 border-t border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">Pillars</p></FadeUp>
        <FadeUp delay={0.1}><h3 className="mt-4 font-serif text-4xl mb-12">What we stand for.</h3></FadeUp>
        <div className="grid md:grid-cols-3 gap-px bg-border">
          {[
            ["Editorial Truth", "Every frame, a sentence. Every issue, a chapter."],
            ["Curvature as Canon", "Bodies are not a category. They are the medium."],
            ["Global Atelier", "Paris to Lagos to Tokyo — one cinematic vocabulary."],
          ].map(([t, d]) => (
            <div key={t} className="bg-background p-10">
              <div className="font-serif text-2xl">{t}</div>
              <p className="mt-4 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
