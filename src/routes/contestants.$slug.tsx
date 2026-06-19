import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Instagram } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { CinematicImage, FadeUp } from "@/components/motion/Reveal";
import { CONTESTANTS } from "@/lib/data";

export const Route = createFileRoute("/contestants/$slug")({
  loader: ({ params }) => {
    const contestant = CONTESTANTS.find((c) => c.slug === params.slug);
    if (!contestant) throw notFound();
    return { contestant };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.contestant.name} — ReeVibes` },
      { name: "description", content: `${loaderData.contestant.name}, ${loaderData.contestant.country}. ${loaderData.contestant.bio}` },
      { property: "og:image", content: loaderData.contestant.image },
    ] : [],
  }),
  notFoundComponent: () => (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center"><div className="text-center"><p className="editorial-label text-accent">404</p><h1 className="mt-4 font-serif text-5xl">Contestant Not Found</h1><Link to="/angels" className="mt-8 inline-block editorial-label hover:text-accent">← Browse Angels</Link></div></div>
    </PublicLayout>
  ),
  component: ContestantPage,
});

function ContestantPage() {
  const { contestant: c } = Route.useLoaderData();
  return (
    <PublicLayout>
      <section className="relative h-[88vh] min-h-[640px] overflow-hidden">
        <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover img-cinematic" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-16 text-white">
          <FadeUp><p className="editorial-eyebrow text-accent">N° {c.rank ?? "—"} · Season 03</p></FadeUp>
          <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-6xl lg:text-9xl leading-none">{c.name}</h1></FadeUp>
          <FadeUp delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-10 items-end">
              <div><div className="editorial-label text-white/60">Origin</div><div className="font-serif text-2xl">{c.city}, {c.country}</div></div>
              <div><div className="editorial-label text-white/60">Votes</div><div className="font-serif text-2xl">{c.votes.toLocaleString()}</div></div>
              <button className="inline-flex items-center gap-2 bg-accent text-white px-7 py-3.5 editorial-label hover:bg-white hover:text-black transition-colors">
                <Heart className="w-4 h-4" /> Vote for {c.name.split(" ")[0]}
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="px-6 lg:px-16 py-24 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <FadeUp><p className="editorial-eyebrow text-accent">Biography</p></FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-6 font-serif text-3xl lg:text-4xl leading-tight text-balance">{c.bio}</p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-8 text-muted-foreground max-w-xl">
              Discovered during ReeVibes's open casting in {c.city}, she has since fronted campaigns for {c.campaigns.join(", ")} and continues to define the new editorial silhouette.
            </p>
          </FadeUp>
        </div>
        <aside className="lg:col-span-4 lg:col-start-9 space-y-6">
          <div className="border-t border-border pt-6"><div className="editorial-label text-muted-foreground">Age</div><div className="font-serif text-2xl mt-1">{c.age}</div></div>
          <div className="border-t border-border pt-6"><div className="editorial-label text-muted-foreground">Height</div><div className="font-serif text-2xl mt-1">{c.height}</div></div>
          <div className="border-t border-border pt-6"><div className="editorial-label text-muted-foreground">Measurements</div><div className="font-serif text-2xl mt-1">{c.measurements}</div></div>
          <div className="border-t border-border pt-6"><div className="editorial-label text-muted-foreground">Social</div><div className="mt-2 flex items-center gap-2 text-sm"><Instagram className="w-4 h-4 text-accent" /> {c.social.instagram}</div></div>
        </aside>
      </section>

      <section className="px-6 lg:px-16 pb-24">
        <FadeUp><p className="editorial-eyebrow text-accent">Portfolio</p></FadeUp>
        <FadeUp delay={0.1}><h2 className="mt-4 font-serif text-4xl mb-10">Selected Frames</h2></FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {c.gallery.map((g: string, i: number) => (
            <CinematicImage key={i} src={g} alt={`${c.name} frame ${i + 1}`} className={i === 0 ? "md:col-span-2 aspect-[4/3]" : "aspect-[3/4]"} />
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-16 border-t border-border-subtle text-center">
        <FadeUp>
          <p className="editorial-eyebrow text-accent">Cast Your Voice</p>
          <h3 className="mt-4 font-serif text-3xl">Every vote shapes Season 03.</h3>
          <button className="mt-8 inline-flex items-center gap-2 bg-accent text-white px-8 py-4 editorial-label hover:bg-white hover:text-black transition-colors">
            <Heart className="w-4 h-4" /> Vote for {c.name.split(" ")[0]}
          </button>
        </FadeUp>
      </section>
    </PublicLayout>
  );
}
