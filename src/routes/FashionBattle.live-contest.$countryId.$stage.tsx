// Stage-scoped live contest view (e.g. /live-contest/france/top-8).
// Reads the country + stage params and filters the same Live Contest layout.
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp } from "@/components/motion/Reveal";
import { useAppStore } from "@/lib/portal-state";
import { CONTESTANTS } from "@/lib/data";

export const Route = createFileRoute("/FashionBattle/live-contest/$countryId/$stage")({
  head: ({ params }) => ({ meta: [{ title: `${params.countryId} · ${params.stage} — Live Contest` }] }),
  component: StageView,
});

function StageView() {
  const { countryId, stage } = useParams({ from: "/live-contest/$countryId/$stage" });
  const { state } = useAppStore();
  const stageKey = stage.toLowerCase();
  const inStage = Object.entries(state.positions)
    .filter(([, pos]) => pos.toLowerCase().replace(/[^a-z0-9]/g, "") === stageKey.replace(/[^a-z0-9]/g, ""))
    .map(([id]) => CONTESTANTS.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .filter(c => c.country.toLowerCase() === countryId.toLowerCase() || countryId.toLowerCase() === "global");

  return (
    <PublicLayout>
      <header className="px-6 lg:px-16 pt-24 pb-10 border-b border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">{countryId} · Stage</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-5xl lg:text-7xl capitalize">{stage.replace(/-/g, " ")}</h1></FadeUp>
        <p className="mt-4 text-muted-foreground text-sm">Voting is {state.voting.open ? "open" : "closed by the editor"}.</p>
      </header>
      <section className="px-6 lg:px-16 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {inStage.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            No contestants tagged for this stage yet.{" "}
            <Link to="/FashionBattle/live-contest" className="text-accent">View all battles →</Link>
          </div>
        )}
        {inStage.map(c => (
          <Link key={c.id} to="/FashionBattle/contestants/$slug" params={{ slug: c.slug }} className="group">
            <div className="aspect-[3/4] overflow-hidden">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]" />
            </div>
            <div className="mt-3">
              <div className="font-serif text-xl">{c.name}</div>
              <div className="editorial-label text-muted-foreground">{c.country}</div>
            </div>
          </Link>
        ))}
      </section>
    </PublicLayout>
  );
}
