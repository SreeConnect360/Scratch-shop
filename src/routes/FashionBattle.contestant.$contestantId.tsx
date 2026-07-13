// Canonical contestant profile by id — redirects to the existing slug-based profile.
import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";
import { CONTESTANTS } from "@/lib/data";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const Route = createFileRoute("/FashionBattle/contestant/$contestantId")({
  component: ContestantById,
});

function ContestantById() {
  const { contestantId } = useParams({ from: "/contestant/$contestantId" });
  const c = CONTESTANTS.find(x => x.id === contestantId);
  if (!c) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Contestant not found.</div>
      </PublicLayout>
    );
  }
  return <Navigate to="/FashionBattle/contestants/$slug" params={{ slug: c.slug }} replace />;
}
