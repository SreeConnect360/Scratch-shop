// Single Best Photography image detail. Reads from the store's bestPhotos tag list.
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp } from "@/components/motion/Reveal";
import { useAppStore } from "@/lib/portal-state";

export const Route = createFileRoute("/photography/$photoId")({
  head: ({ params }) => ({ meta: [{ title: `Photography · ${params.photoId} — ReeVibes` }] }),
  component: PhotoDetail,
});

function PhotoDetail() {
  const { photoId } = useParams({ from: "/photography/$photoId" });
  const { state } = useAppStore();
  const isBest = state.bestPhotos.includes(photoId);
  const src = decodeURIComponent(photoId);
  return (
    <PublicLayout>
      <header className="px-6 lg:px-16 pt-24 pb-8 border-b border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">{isBest ? "Best Photography" : "Photography"}</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-5xl">Editorial frame</h1></FadeUp>
      </header>
      <section className="px-6 lg:px-16 py-10">
        <div className="max-w-5xl mx-auto">
          <img src={src} alt="" className="w-full h-auto object-cover" />
          <Link to="/best-photography" className="mt-6 inline-block editorial-label hover:text-accent">← All photography</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
