import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePortal, type JudgeCriteria } from "@/lib/portal-state";
import { Slider } from "@/components/ui/slider";
import { X, Film, Mail, Phone, MapPin, Globe } from "lucide-react";

export const Route = createFileRoute("/account/role-judgements")({
  component: RoleJudgementsPage,
});

const LEFT: { key: JudgeCriteria; label: string }[] = [
  { key: "catwalk", label: "Catwalk & Pose" },
  { key: "personality", label: "Personality & Vitality" },
  { key: "communication", label: "Communication Skill" },
  { key: "q1", label: "Question 1" },
  { key: "q2", label: "Question 2" },
];
const RIGHT: { key: JudgeCriteria; label: string }[] = [
  { key: "appearance", label: "Appearance" },
  { key: "friendliness", label: "Friendliness" },
  { key: "interaction", label: "Interaction with Judges" },
  { key: "q3", label: "Question 3" },
  { key: "q4", label: "Question 4" },
];

function avg(nums: number[]) { return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0; }

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

function RoleJudgementsPage() {
  const { state, setJudgeRating } = usePortal();
  const me = state.user?.id ?? "";
  
  const countries = useMemo(() => Array.from(new Set(state.contests.filter(c => c.published).map(c => c.country))), [state.contests]);
  const [country, setCountry] = useState<string>(countries[0] ?? "Global");
  const [openId, setOpenId] = useState<string | null>(null);
  const [pendingScores, setPendingScores] = useState<Partial<Record<JudgeCriteria, number>>>({});
  const [viewingContestant, setViewingContestant] = useState<any | null>(null);

  const rateUserIds = useMemo(() => state.users.filter(u => u.roles.includes("Ratings")).map(u => u.id), [state.users]);
  const judgeUserIds = useMemo(() => state.users.filter(u => u.roles.includes("Judgements")).map(u => u.id), [state.users]);

  // Only selected contestants from casting call appear in Judgements for the selected country
  const selectedContestants = useMemo(() => {
    return state.applications.filter(
      a => a.country === country && state.castingWorkflow[a.contestantId] === "Selected"
    );
  }, [state.applications, country, state.castingWorkflow]);

  const rows = useMemo(() => {
    return selectedContestants.map((a, i) => {
      const cId = a.contestantId;
      const myMap = state.judgeRatings[me]?.[cId] ?? {};
      const myScore = avg(Object.values(myMap).filter((n): n is number => typeof n === "number"));
      const rateAvg = avg(rateUserIds.map(uid => state.rateScores[uid]?.[cId]).filter((n): n is number => typeof n === "number"));
      const intlAvg = avg(judgeUserIds.map(uid => {
        const m = state.judgeRatings[uid]?.[cId];
        return m ? avg(Object.values(m).filter((n): n is number => typeof n === "number")) : NaN;
      }).filter(n => !Number.isNaN(n)));
      return { sno: i + 1, app: a, myScore, rateAvg, intlAvg, total: rateAvg + intlAvg };
    });
  }, [selectedContestants, me, state.judgeRatings, state.rateScores, rateUserIds, judgeUserIds]);

  const open = rows.find(r => r.app.contestantId === openId);

  if (open) {
    const savedMap = state.judgeRatings[me]?.[open.app.contestantId] ?? {};
    
    // Check if any rating has changed
    const hasChanges = Object.keys(pendingScores).some(key => {
      const criteria = key as JudgeCriteria;
      return pendingScores[criteria] !== undefined && pendingScores[criteria] !== (savedMap[criteria] ?? 0);
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => { setOpenId(null); setPendingScores({}); }} className="editorial-label text-accent">← Back to list</button>
          
          <button
            disabled={!hasChanges}
            onClick={() => {
              Object.entries(pendingScores).forEach(([key, val]) => {
                if (val !== undefined) {
                  setJudgeRating(me, open.app.contestantId, key as JudgeCriteria, val);
                }
              });
              setPendingScores({});
            }}
            className={`px-6 py-2.5 text-xs uppercase tracking-wider font-semibold border transition-all duration-300 rounded-sm ${
              hasChanges
                ? "text-white cursor-pointer font-bold"
                : "bg-transparent border-border-subtle text-muted-foreground cursor-not-allowed opacity-50"
            }`}
            style={hasChanges ? { backgroundColor: "#db2777", borderColor: "#db2777" } : {}}
          >
            Save Judges
          </button>
        </div>

        <div className="flex gap-6 items-start bg-surface p-4 rounded border border-border-subtle">
          <div className="relative w-36 h-48 overflow-hidden rounded border border-border-subtle group shrink-0">
            <img 
              src={open.app.photos.portrait} 
              className="w-full h-full object-cover cursor-pointer" 
              onClick={() => setViewingContestant(open.app)}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-xs uppercase tracking-wider text-white text-center p-2" onClick={() => setViewingContestant(open.app)}>
              View Info
            </div>
          </div>
          <div>
            <p className="editorial-eyebrow text-accent">Judgement</p>
            <h2 className="font-serif text-3xl mt-1">{open.app.fullName}</h2>
            <div className="editorial-label text-muted-foreground mt-0.5">{open.app.contestantId} · {open.app.country}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[LEFT, RIGHT].map((col, ci) => (
            <div key={ci} className="space-y-4">
              {col.map(({ key, label }) => {
                const savedVal = savedMap[key] ?? 0;
                const v = pendingScores[key] ?? savedVal;
                return (
                  <div key={key} className="border border-border-subtle p-4 bg-surface rounded">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="font-serif text-xl">{v}</span>
                    </div>
                    <Slider 
                      value={[v]} 
                      max={10} 
                      step={1} 
                      onValueChange={val => setPendingScores(prev => ({ ...prev, [key]: val[0] }))} 
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {viewingContestant && (
          <ContestantDetailModal 
            contestant={viewingContestant} 
            onClose={() => setViewingContestant(null)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <p className="editorial-eyebrow text-accent">Role · Judgements</p>
          <h2 className="mt-2 font-serif text-3xl">Judging Panel</h2>
        </div>
        
        <div>
          <select value={country} onChange={e => setCountry(e.target.value)} className="bg-transparent border border-border-subtle px-3 py-2 text-sm rounded bg-background">
            {countries.map(c => <option key={c} className="bg-background">{c}</option>)}
          </select>
        </div>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground pt-4">No selected contestants to judge from {country}. Only contestants with status "Selected" in Casting Call will appear here.</p>
      ) : (
        <div className="overflow-x-auto border border-border-subtle bg-surface rounded">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2">
                <th className="py-3 px-4">S.No</th>
                <th className="py-3 pr-3">Photo</th>
                <th className="py-3 pr-3">Contestant ID</th>
                <th className="py-3 pr-3">Name</th>
                <th className="py-3 pr-3">My Rating</th>
                <th className="py-3 pr-3">Total Avg</th>
                <th className="py-3 pr-3">International</th>
                <th className="py-3 pr-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.app.contestantId} className="border-b border-border-subtle/60 hover:bg-surface-2/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs">{r.sno}</td>
                  <td className="py-3 pr-3">
                    <img 
                      src={r.app.photos.portrait} 
                      className="w-12 h-14 object-cover rounded border border-border-subtle cursor-pointer hover:opacity-85" 
                      onClick={() => setViewingContestant(r.app)}
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <button onClick={() => setOpenId(r.app.contestantId)} className="font-mono text-xs text-accent hover:underline">
                      {r.app.contestantId}
                    </button>
                  </td>
                  <td className="py-3 pr-3 font-medium">{r.app.fullName}</td>
                  <td className="py-3 pr-3 font-mono">{r.myScore.toFixed(1)}</td>
                  <td className="py-3 pr-3 font-mono">{r.rateAvg.toFixed(1)}</td>
                  <td className="py-3 pr-3 font-mono">{r.intlAvg.toFixed(1)}</td>
                  <td className="py-3 pr-3 font-serif text-base text-accent">{r.total.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
