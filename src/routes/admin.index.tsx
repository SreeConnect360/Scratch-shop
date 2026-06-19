import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout, AdminCard, AdminButton, StatusChip } from "@/components/layout/AdminLayout";
import { STATS, BATTLES, CONTESTANTS, ABUSE_REPORTS } from "@/lib/data";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Overview — ReeVibes" }] }),
  component: AdminHome,
});

function AdminHome() {
  return (
    <AdminLayout
      eyebrow="Season 03 · Live"
      title="Operations Overview"
      actions={<><AdminButton variant="outline">Export Report</AdminButton><AdminButton variant="accent">Open Live Producer</AdminButton></>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          ["Total Votes", STATS.totalVotes.toLocaleString(), "+12.4%"],
          ["Active Contestants", STATS.activeContestants, "+3"],
          ["Live Viewers", STATS.liveViewers.toLocaleString(), "live"],
          ["Sponsor Revenue", STATS.revenue, "+8.2%"],
        ].map(([k, v, d]) => (
          <AdminCard key={k as string}>
            <div className="editorial-label text-muted-foreground">{k}</div>
            <div className="font-serif text-4xl mt-3">{v}</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-accent"><TrendingUp className="w-3 h-3" />{d}</div>
          </AdminCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <AdminCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div><div className="editorial-label text-accent">Live Battles</div><div className="font-serif text-2xl mt-1">Round of 16</div></div>
            <Link to="/admin/live-contest" className="editorial-label hover:text-accent inline-flex items-center gap-1">Manage <ArrowUpRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="space-y-4">
            {BATTLES.map((b) => (
              <div key={b.id} className="flex items-center gap-4 border-t border-border-subtle pt-4 first:border-0 first:pt-0">
                <img src={b.a.image} alt="" className="w-10 h-14 object-cover" />
                <div className="font-serif italic text-accent">vs</div>
                <img src={b.b.image} alt="" className="w-10 h-14 object-cover" />
                <div className="flex-1">
                  <div className="text-sm">{b.a.name} <span className="text-muted-foreground">vs</span> {b.b.name}</div>
                  <div className="editorial-label text-muted-foreground mt-1">{b.round}</div>
                </div>
                <StatusChip status={b.status} tone={b.status === "live" ? "accent" : "neutral"} />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="editorial-label text-accent">Recent Reports</div>
          <div className="font-serif text-2xl mt-1 mb-6">Moderation Queue</div>
          <div className="space-y-4">
            {ABUSE_REPORTS.slice(0, 3).map((r) => (
              <div key={r.id} className="border-t border-border-subtle pt-3 first:border-0 first:pt-0">
                <div className="text-sm">{r.target}</div>
                <div className="text-xs text-muted-foreground mt-1">{r.reason}</div>
                <div className="mt-2"><StatusChip status={r.severity} tone={r.severity === "High" ? "danger" : r.severity === "Medium" ? "warn" : "neutral"} /></div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <AdminCard>
          <div className="editorial-label text-accent">Newest Applications</div>
          <div className="font-serif text-2xl mt-1 mb-6">Pending Review</div>
          <div className="space-y-3">
            {CONTESTANTS.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-4">
                <img src={c.image} className="w-10 h-12 object-cover" alt="" />
                <div className="flex-1">
                  <div className="text-sm">{c.name}</div>
                  <div className="editorial-label text-muted-foreground">{c.country}</div>
                </div>
                <StatusChip status={c.status} tone={c.status === "Approved" ? "success" : "neutral"} />
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard>
          <div className="editorial-label text-accent">Voting Velocity</div>
          <div className="font-serif text-2xl mt-1 mb-6">Last 12 Hours</div>
          <div className="flex items-end gap-1.5 h-32">
            {[40, 55, 38, 70, 62, 84, 91, 72, 65, 88, 95, 78].map((v, i) => (
              <div key={i} className="flex-1 bg-foreground/20 hover:bg-accent transition-colors" style={{ height: `${v}%` }} />
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
