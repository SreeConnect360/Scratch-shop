import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeUp } from "@/components/motion/Reveal";
import { usePortal } from "@/lib/portal-state";

export const Route = createFileRoute("/account/applications")({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { state } = usePortal();

  return (
    <div className="space-y-12">
      <FadeUp>
        <section>
          <p className="editorial-eyebrow text-accent">In Progress</p>
          <h2 className="mt-3 font-serif text-3xl">Drafts</h2>
          {state.drafts.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No drafts yet. Start your <Link to="/apply" className="underline">application</Link>.</p>
          ) : (
            <div className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
              {state.drafts.map(d => (
                <div key={d.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-serif text-lg">Draft #{d.id.slice(-4)}</div>
                    <div className="editorial-label text-muted-foreground">Step {d.step} · Updated {d.updatedAt}</div>
                  </div>
                  <Link to="/apply" className="editorial-label hover:text-accent">Continue →</Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </FadeUp>

      <FadeUp delay={0.05}>
        <section>
          <p className="editorial-eyebrow text-accent">Submitted</p>
          <h2 className="mt-3 font-serif text-3xl">Awaiting Review</h2>
          {state.submitted.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No submitted applications yet.</p>
          ) : (
            <div className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
              {state.submitted.map(d => (
                <div key={d.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-serif text-lg">Application #{d.id.slice(-4)}</div>
                    <div className="editorial-label text-muted-foreground">Submitted {d.updatedAt}</div>
                  </div>
                  <span className="editorial-label text-accent">In Review</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </FadeUp>
    </div>
  );
}
