import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout, AdminCard, AdminButton } from "@/components/layout/AdminLayout";
import { useAppStore, type JudgeCriteria } from "@/lib/portal-state";
import { X, Film, Mail, Phone, MapPin, Globe, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Admin" }] }),
  component: ReportsPage,
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
                  <div><span className="text-muted-foreground">Country:</span> {contestant.country || contestant.contestCountry}</div>
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

const TABS = ["Agency", "Rating", "Casting Call", "Judgement", "Top 16", "Top 8", "Top 4", "Finals", "Winner"];
const YEARS = [2026, 2025, 2024];
const COUNTRIES = [
  "Global", "Adygea", "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica",
  "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Bermuda", "Bhutan", "Bolivia", "Bosnia-Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
  "Catalonia", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Cook Islands",
  "Costa Rica", "Cote D'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "England", "Equatorial Guinea", "Eritrea", "Estonia",
  "Ethiopia", "European Union", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia",
  "Gabon", "Georgia", "Germany", "Ghana", "Gibrlatar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala",
  "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Iceland", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Liechtenstein", "Luxembourg",
  "Lybia", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Island",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "Niue", "North Korea", "Northern Ireland", "Northern Mariana Islands", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Principality of Sealand", "Puerto Rico", "Qatar", "Republic of the Congo", "Romania", "Russia",
  "Rwanda", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Scotland", "Senegal", "Serbia",
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "St Vincent", "St. Helena", "St. Kitts and Nevis", "St. Lucia", "Sudan",
  "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
  "The Gambia", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "U.S. Virgin Islands", "Uganda", "Ukraine", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
];
const MONTHS = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const JUDGE_PARTICULARS: { key: JudgeCriteria; label: string }[] = [
  { key: "catwalk", label: "Catwalk & Pose" },
  { key: "personality", label: "Personality & Vitality" },
  { key: "communication", label: "Communication Skill" },
  { key: "q1", label: "Question 1" },
  { key: "q2", label: "Question 2" },
  { key: "appearance", label: "Appearance" },
  { key: "friendliness", label: "Friendliness" },
  { key: "interaction", label: "Interaction with Judges" },
  { key: "q3", label: "Question 3" },
  { key: "q4", label: "Question 4" },
];

function avg(nums: number[]) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

function matchCountryName(a: string, b: string): boolean {
  const norm = (s: string) => {
    let low = s.toLowerCase().trim();
    if (low === "uk") return "united kingdom";
    if (low === "usa") return "united states";
    return low;
  };
  return norm(a) === norm(b);
}

function ReportsPage() {
  const { state, setMultiplePositions, setPosition, updateApplication } = useAppStore();

  const [activeTab, setActiveTab] = useState<string>("Agency");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("Global");

  const [selectedContestantIds, setSelectedContestantIds] = useState<string[]>([]);
  const [viewingContestant, setViewingContestant] = useState<any | null>(null);
  
  // Details Modal overlays
  const [showAgencyModal, setShowAgencyModal] = useState<any | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<any | null>(null);
  const [showCastingModal, setShowCastingModal] = useState<any | null>(null);
  const [showJudgementModal, setShowJudgementModal] = useState<any | null>(null);
  
  // Nested 10 particulars ratings modal for a judge
  const [showJudgeRatingsDetail, setShowJudgeRatingsDetail] = useState<{ contestant: any; judge: any } | null>(null);

  const [successPopup, setSuccessPopup] = useState<{
    open: boolean;
    title: string;
    message: string;
  } | null>(null);

  // Filtered applications
  const filteredContestants = useMemo(() => {
    return state.applications.filter(a => {
      const matchYear = a.contestYear === selectedYear;
      const matchCountry = selectedCountry === "Global" || a.country === selectedCountry;
      return matchYear && matchCountry;
    });
  }, [state.applications, selectedYear, selectedCountry]);

  // Role users list
  const agencyUsers = useMemo(() => state.users.filter(u => u.roles.includes("Applications")), [state.users]);
  const ratingUsers = useMemo(() => state.users.filter(u => u.roles.includes("Ratings")), [state.users]);
  const castingUsers = useMemo(() => state.users.filter(u => u.roles.includes("Casting Call")), [state.users]);
  const judgementUsers = useMemo(() => state.users.filter(u => u.roles.includes("Judgements")), [state.users]);

  return (
    <AdminLayout eyebrow="Module · Analytics" title="Moderation & Contest Reports">
      
      {/* Top Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-6 bg-surface p-4 border border-border-subtle rounded">
        <div className="flex flex-col gap-1.5">
          <label className="editorial-label text-muted-foreground text-xs">Year</label>
          <select 
            value={selectedYear} 
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="bg-transparent border border-border-subtle px-3 py-1.5 text-sm rounded bg-background text-foreground"
          >
            {YEARS.map(y => <option key={y} value={y} className="bg-background">{y}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="editorial-label text-muted-foreground text-xs">Month</label>
          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(e.target.value)}
            className="bg-transparent border border-border-subtle px-3 py-1.5 text-sm rounded bg-background text-foreground"
          >
            {MONTHS.map(m => <option key={m} value={m} className="bg-background">{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="editorial-label text-muted-foreground text-xs">Country</label>
          <select 
            value={selectedCountry} 
            onChange={e => setSelectedCountry(e.target.value)}
            className="bg-transparent border border-border-subtle px-3 py-1.5 text-sm rounded bg-background text-foreground"
          >
            {COUNTRIES.map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs ordered from Left to Right */}
      <div className="flex justify-start gap-1.5 border-b border-border-subtle pb-3 mb-6 flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-all duration-200 rounded-sm ${
              activeTab === t
                ? "border-accent text-accent bg-accent/5 font-bold"
                : "border-border-subtle text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Table view based on active tab */}
      <AdminCard>
        {activeTab === "Agency" && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl border-b border-border-subtle pb-2">Agency Applications</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40">
                    <th className="py-3 px-4">S.no</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Applied Date</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th className="text-right px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContestants.map((c, idx) => (
                    <tr key={c.contestantId} className="border-b border-border-subtle/60 hover:bg-surface-2/50 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs">{idx + 1}</td>
                      <td className="font-mono text-xs text-accent font-semibold">{c.contestantId}</td>
                      <td className="font-medium">{c.fullName}</td>
                      <td>{c.applicationDate || "2026-01-10"}</td>
                      <td>{selectedYear}-01-01</td>
                      <td>{selectedYear}-02-28</td>
                      <td className="text-right px-4 space-x-4">
                        <button 
                          onClick={() => setShowAgencyModal(c)}
                          className="text-xs uppercase tracking-wider font-semibold text-accent hover:underline"
                        >
                          Application Details
                        </button>
                        <span className="text-muted-foreground/30">|</span>
                        <button 
                          onClick={() => setViewingContestant(c)}
                          className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground hover:underline"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredContestants.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No contestant records found for selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Rating" && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl border-b border-border-subtle pb-2">Ratings Analytics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40">
                    <th className="py-3 px-4">S.no</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Ratings</th>
                    <th className="text-right px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContestants.map((c, idx) => {
                    const scores = ratingUsers.map(u => state.rateScores[u.id]?.[c.contestantId]).filter((s): s is number => typeof s === "number");
                    const avgRating = scores.length ? avg(scores).toFixed(1) : "—";
                    return (
                      <tr key={c.contestantId} className="border-b border-border-subtle/60 hover:bg-surface-2/50 transition-colors">
                        <td className="py-4 px-4 font-mono text-xs">{idx + 1}</td>
                        <td className="font-mono text-xs text-accent font-semibold">{c.contestantId}</td>
                        <td className="font-medium">{c.fullName}</td>
                        <td>{selectedYear}-03-01</td>
                        <td>{selectedYear}-04-15</td>
                        <td className="font-serif font-bold text-accent">{avgRating}</td>
                        <td className="text-right px-4 space-x-4">
                          <button 
                            onClick={() => setShowRatingModal(c)}
                            className="text-xs uppercase tracking-wider font-semibold text-accent hover:underline"
                          >
                            Rating Details
                          </button>
                          <span className="text-muted-foreground/30">|</span>
                          <button 
                            onClick={() => setViewingContestant(c)}
                            className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground hover:underline"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredContestants.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No contestant records found for selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Casting Call" && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl border-b border-border-subtle pb-2">Casting Decisions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40">
                    <th className="py-3 px-4">S.no</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Applied Date</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th className="text-right px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContestants.map((c, idx) => (
                    <tr key={c.contestantId} className="border-b border-border-subtle/60 hover:bg-surface-2/50 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs">{idx + 1}</td>
                      <td className="font-mono text-xs text-accent font-semibold">{c.contestantId}</td>
                      <td className="font-medium">{c.fullName}</td>
                      <td>{c.applicationDate || "2026-01-10"}</td>
                      <td>{selectedYear}-04-16</td>
                      <td>{selectedYear}-05-31</td>
                      <td className="text-right px-4 space-x-4">
                        <button 
                          onClick={() => setShowCastingModal(c)}
                          className="text-xs uppercase tracking-wider font-semibold text-accent hover:underline"
                        >
                          Application Details
                        </button>
                        <span className="text-muted-foreground/30">|</span>
                        <button 
                          onClick={() => setViewingContestant(c)}
                          className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground hover:underline"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredContestants.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No contestant records found for selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Judgement" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2">
              <h3 className="font-serif text-xl">Judgement Summary</h3>
              {selectedContestantIds.length > 0 && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <span className="text-xs text-accent font-mono font-bold">
                    {selectedContestantIds.length} Selected
                  </span>
                  <button
                    onClick={() => {
                      const existingTop16Ids = state.applications
                        .filter(a => {
                          const isGlobalSelect = selectedCountry === "Global" || selectedCountry === "Globe";
                          const matchCountry = isGlobalSelect
                            ? (matchCountryName(a.country, "Global") || matchCountryName(a.country, "Globe"))
                            : matchCountryName(a.country, selectedCountry);
                          return matchCountry && state.positions[a.contestantId] === "Top16";
                        })
                        .map(a => a.contestantId);
                      
                      if (existingTop16Ids.length > 0) {
                        setMultiplePositions(existingTop16Ids, null);
                      }

                      // Update proceeded contestant countries to match the selected dropdown
                      selectedContestantIds.forEach(id => {
                        updateApplication(id, { 
                          country: selectedCountry, 
                          contestCountry: selectedCountry 
                        });
                      });

                      setMultiplePositions(selectedContestantIds, "Top16");
                      setSelectedContestantIds([]);
                      setSuccessPopup({
                        open: true,
                        title: "Proceed Top 16 Successful",
                        message: `Top 16 has been successfully proceeded for ${selectedCountry} - ${selectedYear}.`
                      });
                    }}
                    className="bg-accent hover:bg-accent/90 text-white text-xs uppercase tracking-wider font-semibold px-4 py-1.5 rounded transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Proceed Top 16
                  </button>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40">
                    <th className="py-3 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={filteredContestants.length > 0 && selectedContestantIds.length === filteredContestants.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContestantIds(filteredContestants.map(c => c.contestantId));
                          } else {
                            setSelectedContestantIds([]);
                          }
                        }}
                        className="rounded border-border-subtle text-accent focus:ring-accent bg-transparent w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">S.no</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Total Avg Rating</th>
                    <th>Int.Rating</th>
                    <th>Total</th>
                    <th className="text-right px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContestants.map((c, idx) => {
                    const cId = c.contestantId;
                    const ratingScores = ratingUsers.map(u => state.rateScores[u.id]?.[cId]).filter((s): s is number => typeof s === "number");
                    const rateAvg = ratingScores.length ? avg(ratingScores) : 0;
                    
                    const judgeAvgScores = judgementUsers.map(u => {
                      const m = state.judgeRatings[u.id]?.[cId];
                      return m ? avg(Object.values(m).filter((n): n is number => typeof n === "number")) : NaN;
                    }).filter(n => !Number.isNaN(n));
                    const intlAvg = judgeAvgScores.length ? avg(judgeAvgScores) : 0;

                    const total = rateAvg + intlAvg;
                    const status = state.castingWorkflow[cId] ?? "Approved";

                    return (
                      <tr key={cId} className="border-b border-border-subtle/60 hover:bg-surface-2/50 transition-colors">
                        <td className="py-4 px-4 w-12 text-center">
                          <input
                            type="checkbox"
                            checked={selectedContestantIds.includes(cId)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedContestantIds(prev => [...prev, cId]);
                              } else {
                                setSelectedContestantIds(prev => prev.filter(id => id !== cId));
                              }
                            }}
                            className="rounded border-border-subtle text-accent focus:ring-accent bg-transparent w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-4 font-mono text-xs">{idx + 1}</td>
                        <td className="font-mono text-xs text-accent font-semibold">{cId}</td>
                        <td className="font-medium">{c.fullName}</td>
                        <td>{selectedYear}-06-01</td>
                        <td>{selectedYear}-07-31</td>
                        <td className="editorial-label text-xs">{status}</td>
                        <td className="font-mono">{rateAvg.toFixed(1)}</td>
                        <td className="font-mono">{intlAvg.toFixed(1)}</td>
                        <td className="font-serif font-bold text-accent text-base">{total.toFixed(1)}</td>
                        <td className="text-right px-4 space-x-4">
                          <button 
                            onClick={() => setShowJudgementModal(c)}
                            className="text-xs uppercase tracking-wider font-semibold text-accent hover:underline"
                          >
                            Judgement Details
                          </button>
                          <span className="text-muted-foreground/30">|</span>
                          <button 
                            onClick={() => setViewingContestant(c)}
                            className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground hover:underline"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredContestants.length === 0 && (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-muted-foreground">
                        No contestant records found for selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty placeholder states for Top Stages */}
        {["Winner", "Finals", "Top 4", "Top 8", "Top 16"].includes(activeTab) && (
          <div className="py-12 text-center text-muted-foreground">
            <h3 className="font-serif text-xl mb-2">{activeTab} Details</h3>
            <p className="text-sm">Stage data holds placeholder config and will be populated in subsequent contest stages.</p>
          </div>
        )}
      </AdminCard>

      {/* 1. Agency Application Details Sub-Modal */}
      {showAgencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-background border border-border-subtle w-full max-w-6xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface">
              <div>
                <span className="editorial-label text-accent">Agency Reviews</span>
                <h3 className="font-serif text-xl mt-0.5">{showAgencyModal.fullName} ({showAgencyModal.contestantId})</h3>
              </div>
              <button onClick={() => setShowAgencyModal(null)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40">
                    <th className="py-3 px-4">S.no</th>
                    <th className="py-3 px-4">First name</th>
                    <th className="py-3 px-4">Last Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agencyUsers.map((u, i) => {
                    const status = state.applicationsWorkflow[showAgencyModal.contestantId] ?? showAgencyModal.status;
                    return (
                      <tr key={u.id} className="border-b border-border-subtle/40 hover:bg-surface-2/20">
                        <td className="py-3 px-4 font-mono text-xs">{i + 1}</td>
                        <td className="py-3 px-4 font-medium">{u.firstName}</td>
                        <td className="py-3 px-4">{u.lastName}</td>
                        <td className="py-3 px-4 editorial-label text-xs">{u.roles.filter(r => ["Applications", "Ratings", "Casting Call", "Judgements"].includes(r)).join(", ") || "—"}</td>
                        <td className="py-3 px-4">{u.country}</td>
                        <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                            status === "Approved" ? "bg-emerald-500/10 text-emerald-500" :
                            status === "Hold" ? "bg-amber-500/10 text-amber-500" :
                            status === "Block" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Rating Details Sub-Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-background border border-border-subtle w-full max-w-6xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface">
              <div>
                <span className="editorial-label text-accent">Ratings Panel Logs</span>
                <h3 className="font-serif text-xl mt-0.5">{showRatingModal.fullName} ({showRatingModal.contestantId})</h3>
              </div>
              <button onClick={() => setShowRatingModal(null)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40">
                    <th className="py-3 px-4">S.no</th>
                    <th className="py-3 px-4">First name</th>
                    <th className="py-3 px-4">Last Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Total ratings</th>
                  </tr>
                </thead>
                <tbody>
                  {ratingUsers.map((u, i) => {
                    const score = state.rateScores[u.id]?.[showRatingModal.contestantId] ?? "—";
                    return (
                      <tr key={u.id} className="border-b border-border-subtle/40 hover:bg-surface-2/20">
                        <td className="py-3 px-4 font-mono text-xs">{i + 1}</td>
                        <td className="py-3 px-4 font-medium">{u.firstName}</td>
                        <td className="py-3 px-4">{u.lastName}</td>
                        <td className="py-3 px-4 editorial-label text-xs">{u.roles.filter(r => ["Applications", "Ratings", "Casting Call", "Judgements"].includes(r)).join(", ") || "—"}</td>
                        <td className="py-3 px-4">{u.country}</td>
                        <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4 font-serif font-bold text-accent text-base">{score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Casting Call Application Details Sub-Modal */}
      {showCastingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-background border border-border-subtle w-full max-w-6xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface">
              <div>
                <span className="editorial-label text-accent">Casting Call Decisions</span>
                <h3 className="font-serif text-xl mt-0.5">{showCastingModal.fullName} ({showCastingModal.contestantId})</h3>
              </div>
              <button onClick={() => setShowCastingModal(null)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40">
                    <th className="py-3 px-4">S.no</th>
                    <th className="py-3 px-4">First name</th>
                    <th className="py-3 px-4">Last Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {castingUsers.map((u, i) => {
                    const status = state.castingWorkflow[showCastingModal.contestantId] ?? "Approved";
                    return (
                      <tr key={u.id} className="border-b border-border-subtle/40 hover:bg-surface-2/20">
                        <td className="py-3 px-4 font-mono text-xs">{i + 1}</td>
                        <td className="py-3 px-4 font-medium">{u.firstName}</td>
                        <td className="py-3 px-4">{u.lastName}</td>
                        <td className="py-3 px-4 editorial-label text-xs">{u.roles.filter(r => ["Applications", "Ratings", "Casting Call", "Judgements"].includes(r)).join(", ") || "—"}</td>
                        <td className="py-3 px-4">{u.country}</td>
                        <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                            status === "Selected" ? "bg-emerald-500/10 text-emerald-500" :
                            status === "Hold" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Judgement Details Sub-Modal */}
      {showJudgementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-background border border-border-subtle w-full max-w-6xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface">
              <div>
                <span className="editorial-label text-accent">Panel Judges Scores</span>
                <h3 className="font-serif text-xl mt-0.5">{showJudgementModal.fullName} ({showJudgementModal.contestantId})</h3>
              </div>
              <button onClick={() => setShowJudgementModal(null)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40">
                    <th className="py-3 px-4">S.no</th>
                    <th className="py-3 px-4">First name</th>
                    <th className="py-3 px-4">Last Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Status (Rating)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {judgementUsers.map((u, i) => {
                    const scoresMap = state.judgeRatings[u.id]?.[showJudgementModal.contestantId] ?? {};
                    const scoresList = Object.values(scoresMap).filter((s): s is number => typeof s === "number");
                    const finalAvg = scoresList.length ? avg(scoresList).toFixed(1) : "0.0";
                    return (
                      <tr key={u.id} className="border-b border-border-subtle/40 hover:bg-surface-2/20">
                        <td className="py-3 px-4 font-mono text-xs">{i + 1}</td>
                        <td className="py-3 px-4 font-medium">{u.firstName}</td>
                        <td className="py-3 px-4">{u.lastName}</td>
                        <td className="py-3 px-4 editorial-label text-xs">{u.roles.filter(r => ["Applications", "Ratings", "Casting Call", "Judgements"].includes(r)).join(", ") || "—"}</td>
                        <td className="py-3 px-4">{u.country}</td>
                        <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4 font-serif font-bold text-accent text-base">{finalAvg}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setShowJudgeRatingsDetail({ contestant: showJudgementModal, judge: u })}
                            className="text-xs uppercase tracking-wider font-semibold text-accent hover:underline"
                          >
                            Complete Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4.b Judge complete 10 criteria details overlay */}
      {showJudgeRatingsDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-background border border-border-subtle w-full max-w-lg rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[80vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface">
              <div>
                <span className="editorial-label text-accent">Score Breakdown</span>
                <h3 className="font-serif text-lg mt-0.5">{showJudgeRatingsDetail.judge.firstName}'s Ratings for {showJudgeRatingsDetail.contestant.fullName}</h3>
              </div>
              <button onClick={() => setShowJudgeRatingsDetail(null)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {JUDGE_PARTICULARS.map(p => {
                const score = state.judgeRatings[showJudgeRatingsDetail.judge.id]?.[showJudgeRatingsDetail.contestant.contestantId]?.[p.key] ?? 0;
                return (
                  <div key={p.key} className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
                    <span className="text-sm font-medium">{p.label}</span>
                    <span className="font-serif text-lg text-accent bg-accent/5 border border-accent/20 px-2 py-0.5 rounded-sm">{score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Basic Profile Details Modal */}
      {viewingContestant && (
        <ContestantDetailModal 
          contestant={viewingContestant} 
          onClose={() => setViewingContestant(null)} 
        />
      )}

      {/* Proceed Top 16 Success Popup */}
      {successPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold tracking-tight">{successPopup.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {successPopup.message}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setSuccessPopup(null)}
                className="bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
