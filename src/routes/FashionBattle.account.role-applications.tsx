import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePortal, type WorkflowStatus } from "@/lib/portal-state";
import { X, Film, Mail, Phone, MapPin, Globe } from "lucide-react";

export const Route = createFileRoute("/FashionBattle/account/role-applications")({
  component: RoleApplicationsPage,
});

const TABS: WorkflowStatus[] = ["Applied", "Approved", "Hold", "Thank You", "Block"];

function ContestantDetailModal({ contestant, onClose }: { contestant: any; onClose: () => void }) {
  const { state, reportAbuse } = usePortal();
  const [showAbuseForm, setShowAbuseForm] = useState(false);
  const [abuseComment, setAbuseComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!contestant) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-background border border-border-subtle w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface">
          <div>
            <span className="editorial-label text-accent">Contestant Profile</span>
            <h3 className="font-serif text-2xl mt-0.5">{contestant.fullName}</h3>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAbuseForm(true)} 
              className="text-xs uppercase tracking-wider font-semibold border border-rose-500/30 text-rose-400 px-3 py-1.5 hover:bg-rose-500/10 transition-colors rounded-sm"
            >
              Report Abuse
            </button>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4">
              <div className="aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded">
                <img src={contestant.photos.portrait} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {contestant.photos.fullBody && (
                  <div className="aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded">
                    <img src={contestant.photos.fullBody} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {contestant.photos.sideProfile && (
                  <div className="aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded">
                    <img src={contestant.photos.sideProfile} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {contestant.photos.candid && (
                  <div className="aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded">
                    <img src={contestant.photos.candid} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              
              {contestant.photos.additional && contestant.photos.additional.length > 0 && (
                <div>
                  <div className="editorial-label text-muted-foreground mb-2">Additional Media</div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {contestant.photos.additional.map((ph: string, idx: number) => (
                      <div key={idx} className="aspect-square border border-border-subtle bg-surface rounded overflow-hidden">
                        <img src={ph} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {contestant.videos?.intro && (
                <div className="pt-2">
                  <div className="editorial-label text-muted-foreground mb-2 flex items-center gap-1.5"><Film className="w-3.5 h-3.5 text-accent" /> Introduction Video</div>
                  <div className="aspect-video bg-black rounded overflow-hidden border border-border-subtle">
                    <video src={contestant.videos.intro} controls className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-7 space-y-6">
              <div>
                <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Personal Details</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm">
                  <div><span className="text-muted-foreground">Age:</span> {contestant.age} years</div>
                  <div><span className="text-muted-foreground">Height:</span> {contestant.height || "—"}</div>
                  <div><span className="text-muted-foreground">Weight:</span> {contestant.weight || "—"}</div>
                  <div><span className="text-muted-foreground">Hair:</span> {contestant.hairColour || "—"}</div>
                  <div><span className="text-muted-foreground">Eyes:</span> {contestant.eyeColour || "—"}</div>
                  <div><span className="text-muted-foreground">Shoe Size:</span> {contestant.shoeSize || "—"}</div>
                  <div><span className="text-muted-foreground">Measurements:</span> {contestant.bust ? `${contestant.bust} - ${contestant.waist} - ${contestant.hips}` : "—"}</div>
                  <div><span className="text-muted-foreground">Date of Birth:</span> {contestant.dob || "—"}</div>
                </div>
              </div>

              <div>
                <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Contact & Location</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm">
                  <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-muted-foreground" /> <span className="truncate">{contestant.email}</span></div>
                  <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-muted-foreground" /> <span>{contestant.phone}</span></div>
                  <div className="col-span-2 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5" /> 
                    <span>{contestant.streetAddress ? `${contestant.streetAddress}, ${contestant.city}, ${contestant.stateProvince} ${contestant.zipCode}, ${contestant.country}` : contestant.country}</span>
                  </div>
                </div>
              </div>

              {contestant.biography && (
                <div>
                  <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Biography</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{contestant.biography}</p>
                </div>
              )}

              {contestant.experience && (
                <div>
                  <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Modeling Experience</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{contestant.experience}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {contestant.profession && (
                  <div>
                    <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Profession</h4>
                    <p className="mt-2 text-sm">{contestant.profession}</p>
                  </div>
                )}
                {contestant.education && (
                  <div>
                    <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Education</h4>
                    <p className="mt-2 text-sm">{contestant.education}</p>
                  </div>
                )}
              </div>

              {contestant.socialLinks && contestant.socialLinks.length > 0 && (
                <div>
                  <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Social Links</h4>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {contestant.socialLinks.map((link: any, idx: number) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs bg-surface-3 px-2.5 py-1 border border-border-subtle hover:text-accent transition-colors rounded">
                        <Globe className="w-3 h-3" /> {link.platform}: {link.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAbuseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-background border border-border-subtle w-full max-w-md rounded shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
              <h4 className="font-serif text-lg text-rose-500">Report Abuse</h4>
              <button onClick={() => { setShowAbuseForm(false); setAbuseComment(""); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            {isSubmitted ? (
              <div className="space-y-4 py-4 text-center">
                <p className="text-sm text-foreground">Thank you. Your report has been submitted for review.</p>
                <button 
                  onClick={() => {
                    setShowAbuseForm(false);
                    setIsSubmitted(false);
                    setAbuseComment("");
                  }} 
                  className="px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-accent text-white rounded-sm hover:opacity-90"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Reporting contestant: <strong className="text-foreground">{contestant.fullName}</strong>
                </p>
                <div className="space-y-1.5">
                  <label className="editorial-label text-muted-foreground">Leave your comment</label>
                  <textarea 
                    value={abuseComment}
                    onChange={e => setAbuseComment(e.target.value)}
                    placeholder="Provide details about the issue..."
                    rows={4}
                    className="w-full bg-transparent border border-border-subtle p-2 text-sm rounded bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => { setShowAbuseForm(false); setAbuseComment(""); }} 
                    className="px-4 py-2 text-xs uppercase tracking-wider font-semibold border border-border-subtle text-muted-foreground rounded-sm hover:text-foreground hover:bg-surface"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!abuseComment.trim()) return;
                      reportAbuse({
                        target: contestant.contestantId,
                        reason: abuseComment,
                        reporter: state.user?.email || "anonymous"
                      });
                      setIsSubmitted(true);
                    }}
                    disabled={!abuseComment.trim()}
                    className="px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-rose-600 text-white rounded-sm hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RoleApplicationsPage() {
  const { state, setApplicationStatus } = usePortal();
  const countries = useMemo(() => Array.from(new Set(state.contests.filter(c => c.published).map(c => c.country))), [state.contests]);
  const [country, setCountry] = useState<string>(countries[0] ?? "Global");
  const [contestId, setContestId] = useState<string>(state.contests.find(c => c.country === country)?.id ?? "");
  const [tab, setTab] = useState<WorkflowStatus>("Applied");
  const [pendingStatus, setPendingStatus] = useState<Record<string, WorkflowStatus>>({});
  const [viewingContestant, setViewingContestant] = useState<any | null>(null);

  const apps = state.applications.filter(a => a.country === country);
  const filtered = apps.filter(a => (state.applicationsWorkflow[a.contestantId] ?? "Applied") === tab);

  return (
    <div className="space-y-8">
      <header>
        <p className="editorial-eyebrow text-accent">Role · Applications</p>
        <h2 className="mt-2 font-serif text-3xl">Application Review</h2>
      </header>

      <div className="flex flex-wrap gap-3">
        <select value={country} onChange={e => { setCountry(e.target.value); setPendingStatus({}); }} className="bg-transparent border border-border-subtle px-3 py-2 text-sm rounded bg-background">
          {countries.map(c => <option key={c} className="bg-background">{c}</option>)}
        </select>
        <select value={contestId} onChange={e => setContestId(e.target.value)} className="bg-transparent border border-border-subtle px-3 py-2 text-sm rounded bg-background">
          {state.contests.filter(c => c.country === country).map(c => <option key={c.id} value={c.id} className="bg-background">{c.year} · {c.stage}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-1 editorial-label">
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setPendingStatus({}); }} className={`px-3 py-1 border transition-colors ${tab === t ? "border-accent text-accent bg-accent/5" : "border-border-subtle text-muted-foreground hover:text-foreground"}`}>
            {t} ({apps.filter(a => (state.applicationsWorkflow[a.contestantId] ?? "Applied") === t).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No contestants in {tab}.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => {
            const savedStatus = state.applicationsWorkflow[a.contestantId] ?? "Applied";
            const currentStatus = pendingStatus[a.contestantId] ?? savedStatus;
            const isChanged = currentStatus !== savedStatus;

            return (
              <div key={a.contestantId} className="border border-border-subtle p-4 space-y-3 bg-surface rounded flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded border border-border-subtle group">
                    <img 
                      src={a.photos.portrait} 
                      alt={a.fullName} 
                      className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                      onClick={() => setViewingContestant(a)} 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => setViewingContestant(a)}>
                      <span className="text-xs uppercase tracking-widest text-white border border-white px-3 py-1.5 rounded-sm">View Details</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-serif text-lg">{a.fullName}</div>
                    <div className="editorial-label text-muted-foreground">{a.contestantId} · {a.country}</div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4 pt-2">
                  <select 
                    value={currentStatus} 
                    onChange={e => setPendingStatus(prev => ({ ...prev, [a.contestantId]: e.target.value as WorkflowStatus }))} 
                    className="w-full bg-transparent border border-border-subtle px-3 py-2 text-sm rounded bg-background"
                  >
                    {TABS.map(t => <option key={t} value={t} className="bg-background">{t}</option>)}
                  </select>
                  
                  <button
                    disabled={!isChanged}
                    onClick={() => {
                      setApplicationStatus(a.contestantId, currentStatus);
                      setPendingStatus(prev => {
                        const copy = { ...prev };
                        delete copy[a.contestantId];
                        return copy;
                      });
                    }}
                    className={`w-full py-2 text-xs uppercase tracking-wider font-semibold border transition-all duration-300 rounded-sm ${
                      isChanged
                        ? "text-white cursor-pointer font-bold"
                        : "bg-transparent border-border-subtle text-muted-foreground cursor-not-allowed opacity-50"
                    }`}
                    style={isChanged ? { backgroundColor: "#db2777", borderColor: "#db2777" } : {}}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewingContestant && (
        <ContestantDetailModal 
          contestant={viewingContestant} 
          onClose={() => setViewingContestant(null)} 
        />
      )}
    </div>
  );
}
