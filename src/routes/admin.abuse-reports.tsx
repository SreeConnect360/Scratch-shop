import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout, AdminCard, AdminButton, StatusChip } from "@/components/layout/AdminLayout";
import { useAppStore } from "@/lib/portal-state";
import { X, Film, Mail, Phone, MapPin, Globe } from "lucide-react";

export const Route = createFileRoute("/admin/abuse-reports")({
  head: () => ({ meta: [{ title: "Abuse Reports — Admin" }] }),
  component: AbuseReportsPage,
});

function ContestantDetailModal({ contestant, onClose }: { contestant: any; onClose: () => void }) {
  if (!contestant) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-background border border-border-subtle w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface">
          <div>
            <span className="editorial-label text-accent">Contestant Profile (Admin Review)</span>
            <h3 className="font-serif text-2xl mt-0.5">{contestant.fullName || contestant.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 flex-1 text-foreground">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4">
              <div className="aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded">
                <img src={contestant.photos?.portrait || contestant.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {contestant.photos?.fullBody && (
                  <div className="aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded">
                    <img src={contestant.photos.fullBody} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {contestant.photos?.sideProfile && (
                  <div className="aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded">
                    <img src={contestant.photos.sideProfile} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {contestant.photos?.candid && (
                  <div className="aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded">
                    <img src={contestant.photos.candid} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-7 space-y-6">
              <div>
                <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Personal Details</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm">
                  <div><span className="text-muted-foreground">Age:</span> {contestant.age} years</div>
                  <div><span className="text-muted-foreground">Height:</span> {contestant.height || "—"}</div>
                  <div><span className="text-muted-foreground">Hair:</span> {contestant.hairColour || "—"}</div>
                  <div><span className="text-muted-foreground">Eyes:</span> {contestant.eyeColour || "—"}</div>
                  <div><span className="text-muted-foreground">Measurements:</span> {contestant.bust ? `${contestant.bust} - ${contestant.waist} - ${contestant.hips}` : contestant.measurements || "—"}</div>
                  <div><span className="text-muted-foreground">Date of Birth:</span> {contestant.dob || "—"}</div>
                </div>
              </div>

              <div>
                <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Location</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm">
                  <div><span className="text-muted-foreground">Country:</span> {contestant.country}</div>
                  <div><span className="text-muted-foreground">City:</span> {contestant.city || "—"}</div>
                </div>
              </div>

              {(contestant.biography || contestant.bio) && (
                <div>
                  <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Biography</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{contestant.biography || contestant.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AbuseReportsPage() {
  const { state, resolveReport } = useAppStore();
  const reports = state.reports;
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [viewingContestant, setViewingContestant] = useState<any | null>(null);

  // Group reports by target (contestant ID or name)
  const groupedReports = useMemo(() => {
    const groups: Record<string, typeof reports> = {};
    reports.forEach(r => {
      const key = r.target;
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });

    return Object.entries(groups).map(([targetKey, rList]) => {
      const app = state.applications.find(a => a.contestantId === targetKey || a.fullName === targetKey);
      const name = app ? app.fullName : targetKey;
      const country = app ? app.country : "Global";
      const year = app ? app.contestYear : 2026;
      const count = rList.length;
      const status = rList.some(r => r.status === "Open") 
        ? "Open" 
        : rList.some(r => r.status === "Reviewing") 
          ? "Reviewing" 
          : "Resolved";

      return {
        targetKey,
        name,
        country,
        year,
        count,
        status,
        reports: rList,
        app,
      };
    });
  }, [reports, state.applications]);

  const openCount = groupedReports.filter(g => g.status === "Open").length;
  const reviewingCount = groupedReports.filter(g => g.status === "Reviewing").length;
  const resolvedCount = groupedReports.filter(g => g.status === "Resolved").length;

  return (
    <AdminLayout eyebrow="Module · Moderation" title="Abuse Reports"
      actions={<><AdminButton variant="outline">Export</AdminButton></>}>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          ["Open", openCount, "danger"],
          ["Reviewing", reviewingCount, "warn"],
          ["Resolved", resolvedCount, "success"]
        ].map(([k, v, t]) => (
          <AdminCard key={k as string}>
            <div className="editorial-label text-muted-foreground">{k}</div>
            <div className="flex items-end justify-between mt-3">
              <div className="font-serif text-4xl">{v}</div>
              <StatusChip status={k as string} tone={t as "danger" | "warn" | "success"} />
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard>
        <div className="editorial-label text-muted-foreground mb-6">Moderation Queue</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle">
                <th className="py-3">Target (Contestant)</th>
                <th>Reports</th>
                <th>Country</th>
                <th>Year</th>
                <th>Recent Reason</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedReports.map(g => (
                <tr key={g.targetKey} className="border-b border-border-subtle hover:bg-surface-2">
                  <td className="py-4">
                    <button 
                      onClick={() => setViewingContestant(g.app || { name: g.name, country: g.country, age: 24, dob: "", countryLogo: "", id: g.targetKey })}
                      className="font-serif text-base text-accent hover:underline text-left block"
                    >
                      {g.name}
                    </button>
                    <span className="text-[10px] text-muted-foreground font-mono">{g.targetKey}</span>
                  </td>
                  <td className="font-semibold text-rose-500">{g.count}</td>
                  <td>{g.country}</td>
                  <td>{g.year}</td>
                  <td className="text-muted-foreground max-w-xs truncate">{g.reports[0]?.reason}</td>
                  <td>
                    <StatusChip 
                      status={g.status} 
                      tone={g.status === "Resolved" ? "success" : g.status === "Reviewing" ? "warn" : "danger"} 
                    />
                  </td>
                  <td className="text-right space-x-2">
                    <button 
                      onClick={() => setSelectedGroup(g)} 
                      className="editorial-label text-accent hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {groupedReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No abuse reports in queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Review Details Overlay Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-background border border-border-subtle w-full max-w-2xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface">
              <div>
                <span className="editorial-label text-accent">Review Reports</span>
                <h3 className="font-serif text-xl mt-0.5">Flags for {selectedGroup.name}</h3>
              </div>
              <button onClick={() => setSelectedGroup(null)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-3">
                {selectedGroup.reports.map((r: any) => (
                  <div key={r.id} className="border border-border-subtle/60 p-4 rounded bg-surface/50 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Reporter: {r.reporter}</span>
                      <span>Status: {r.status}</span>
                    </div>
                    <p className="text-sm text-foreground italic">"{r.reason}"</p>
                    <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle/30">
                      {r.status !== "Reviewing" && (
                        <button 
                          onClick={() => {
                            resolveReport(r.id, "Reviewing");
                            setSelectedGroup(null);
                          }} 
                          className="text-[10px] uppercase font-bold text-amber-500 hover:underline"
                        >
                          Mark Reviewing
                        </button>
                      )}
                      {r.status !== "Resolved" && (
                        <button 
                          onClick={() => {
                            resolveReport(r.id, "Resolved");
                            setSelectedGroup(null);
                          }} 
                          className="text-[10px] uppercase font-bold text-emerald-500 hover:underline"
                        >
                          Resolve / Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-border-subtle bg-surface flex justify-end gap-3">
              <button 
                onClick={() => {
                  selectedGroup.reports.forEach((r: any) => resolveReport(r.id, "Reviewing"));
                  setSelectedGroup(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
              >
                Mark All Reviewing
              </button>
              <button 
                onClick={() => {
                  selectedGroup.reports.forEach((r: any) => resolveReport(r.id, "Resolved"));
                  setSelectedGroup(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
              >
                Resolve All
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingContestant && (
        <ContestantDetailModal 
          contestant={viewingContestant} 
          onClose={() => setViewingContestant(null)} 
        />
      )}
    </AdminLayout>
  );
}
