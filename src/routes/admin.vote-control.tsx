import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Radio, Vote, Star, Play, Square, Crown, Sparkles, X, Heart, Shield, Film, Image as ImageIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminLayout, AdminCard, AdminButton, StatusChip } from "@/components/layout/AdminLayout";
import { useAppStore } from "@/lib/portal-state";

export const Route = createFileRoute("/admin/vote-control")({
  head: () => ({ meta: [{ title: "Vote & Rated — Control Center" }] }),
  component: VoteRatedAdmin,
});

/* ───────── Types & constants ───────── */
type StageKey = "TOP_16" | "TOP_8" | "TOP_4" | "FINALS" | "WINNER";
const STAGES: { key: StageKey; label: string; slots: number }[] = [
  { key: "TOP_16", label: "Top 16", slots: 16 },
  { key: "TOP_8",  label: "Top 8",  slots: 8 },
  { key: "TOP_4",  label: "Top 4",  slots: 4 },
  { key: "FINALS", label: "Finals", slots: 2 },
  { key: "WINNER", label: "Winner", slots: 1 },
];

type Country = { id: string; name: string; year: string };

type StageSponsor = { id: string; sponsorId: string; url: string; order: number };
type StageConfig = {
  lineup: string[]; // contestant ids
  customPhotos: Record<string, string>;
  sponsors: StageSponsor[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: "draft" | "published";
};

type VoteRecord = {
  userId: string;
  countryId: string;
  stageKey: string;
  battleId: string;
  contestantId: string;
  dateCycle: string;
};

type RatingRecord = {
  mediaId: string;
  contestantId: string;
  countryId: string;
  stageKey: string;
  userId: string;
  ratingValue: number;
  createdDate: string;
  updatedDate: string;
};

type ControlState = {
  voting: "active" | "stopped";
  rating: "active" | "stopped";
};

type ControlMap = Record<string, ControlState>;

/* ───────── Country Logo Component ───────── */
function CountryLogo({ countryName, className }: { countryName: string; className?: string }) {
  const [whiteLogo, setWhiteLogo] = useState<string | null>(null);
  const [blackLogo, setBlackLogo] = useState<string | null>(null);

  useEffect(() => {
    let activeName = countryName;
    if (activeName.toLowerCase() === "global") {
      activeName = "Globe";
    }
    fetch(`/api/countries-logos?country=${encodeURIComponent(activeName)}`)
      .then(res => res.json())
      .then(data => {
        if (data.whiteLogo) setWhiteLogo(data.whiteLogo);
        if (data.blackLogo) setBlackLogo(data.blackLogo);
      })
      .catch(err => console.error("Error loading country logo:", err));
  }, [countryName]);

  if (!whiteLogo && !blackLogo) {
    return (
      <div className="font-serif text-xl tracking-wider text-foreground select-none opacity-80 uppercase text-center">
        {countryName}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {whiteLogo && <img src={whiteLogo} alt={countryName} className={`${className} dark:block hidden`} />}
      {blackLogo && <img src={blackLogo} alt={countryName} className={`${className} dark:hidden block`} />}
      {!blackLogo && whiteLogo && <img src={whiteLogo} alt={countryName} className={className} />}
    </div>
  );
}

/* ============================================================ ROOT ============================================================ */
function VoteRatedAdmin() {
  const [countryId, setCountryId] = useState<string | null>(null);
  const [publishedIds, setPublishedIds] = useState<string[]>([]);
  const [publishedCountryMeta, setPublishedCountryMeta] = useState<Record<string, Country>>({});
  const [byCountryConfig, setByCountryConfig] = useState<Record<string, Record<StageKey, StageConfig>>>({});
  
  // Real-time vote/rate local storage tracking
  const [votesList, setVotesList] = useState<VoteRecord[]>([]);
  const [ratingsList, setRatingsList] = useState<RatingRecord[]>([]);
  const [controlState, setControlState] = useState<ControlMap>({});

  const reloadData = () => {
    try {
      const rawLineups = window.localStorage.getItem("reevibes:published-lineups");
      if (rawLineups) setPublishedIds(JSON.parse(rawLineups));

      const rawMeta = window.localStorage.getItem("reevibes:published-countries-meta");
      if (rawMeta) setPublishedCountryMeta(JSON.parse(rawMeta));

      const rawConfig = window.localStorage.getItem("reevibes:live-contest:by-country");
      if (rawConfig) setByCountryConfig(JSON.parse(rawConfig));

      const rawVotes = window.localStorage.getItem("reevibes:votes");
      if (rawVotes) setVotesList(JSON.parse(rawVotes));

      const rawRatings = window.localStorage.getItem("reevibes:ratings");
      if (rawRatings) setRatingsList(JSON.parse(rawRatings));

      const rawControls = window.localStorage.getItem("reevibes:vote-rate-controls");
      if (rawControls) setControlState(JSON.parse(rawControls));
    } catch (e) {
      console.error("Error loading local storage data:", e);
    }
  };

  useEffect(() => {
    reloadData();
    
    // Listen for local storage changes from other tabs/pages
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === "reevibes:published-lineups" ||
        e.key === "reevibes:live-contest:by-country" ||
        e.key === "reevibes:votes" ||
        e.key === "reevibes:ratings" ||
        e.key === "reevibes:vote-rate-controls"
      ) {
        reloadData();
      }
    };
    window.addEventListener("storage", handleStorage);
    
    // Local state polling as fallback for active edits on the same tab
    const interval = setInterval(reloadData, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Filter out unpublished countries
  const countries = useMemo<Country[]>(() => {
    return publishedIds.map(id => {
      const config = byCountryConfig[id];
      if (!config) return null;
      const hasPublishedStage = Object.values(config).some(stageCfg => stageCfg.status === "published");
      if (!hasPublishedStage) return null;
      return publishedCountryMeta[id] || { id, name: id.charAt(0).toUpperCase() + id.slice(1), year: "2026" };
    }).filter(Boolean) as Country[];
  }, [publishedIds, byCountryConfig, publishedCountryMeta]);

  const country = countries.find(c => c.id === countryId) || null;

  const handleUpdateControl = (updatedControls: ControlMap) => {
    setControlState(updatedControls);
    window.localStorage.setItem("reevibes:vote-rate-controls", JSON.stringify(updatedControls));
  };

  return (
    <AdminLayout
      eyebrow="Module · Vote & Rated Control"
      title={country ? `${country.name} ${country.year}` : "Vote & Rated"}
      actions={country ? (
        <AdminButton variant="outline" onClick={() => setCountryId(null)}>
          <ChevronLeft className="w-3.5 h-3.5 inline mr-2" />All Contests
        </AdminButton>
      ) : null}
    >
      {!country ? (
        <CountrySelector countries={countries} configs={byCountryConfig} onPick={setCountryId} />
      ) : (
        <CountryControl
          country={country}
          config={byCountryConfig[country.id] || {}}
          votesList={votesList}
          ratingsList={ratingsList}
          controlState={controlState}
          onUpdateControls={handleUpdateControl}
        />
      )}
    </AdminLayout>
  );
}

/* ───────── Country selector ───────── */
function CountrySelector({
  countries, configs, onPick
}: {
  countries: Country[];
  configs: Record<string, Record<StageKey, StageConfig>>;
  onPick: (id: string) => void;
}) {
  if (countries.length === 0) {
    return (
      <div className="border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto my-8">
        <Radio className="w-8 h-8 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-serif text-xl mb-2">No Published Stages</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          To manage votes and ratings, you must first publish a stage in the Live Contest Dashboard.
        </p>
        <a href="/admin/live-contest">
          <AdminButton variant="accent">Go to Live Contest Studio</AdminButton>
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="editorial-label text-muted-foreground mb-4 font-mono">Published Live Contests</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((c, i) => {
          const countryConfig = configs[c.id];
          const publishedCount = countryConfig ? Object.values(countryConfig).filter(cfg => cfg.status === "published").length : 0;
          return (
            <motion.button
              key={c.id}
              onClick={() => onPick(c.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group text-left"
            >
              <AdminCard className="relative overflow-hidden hover:border-accent transition-all duration-500 bg-surface min-h-[220px] flex flex-col justify-between p-8">
                <div>
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="editorial-label text-emerald-500">Live</span>
                  </div>
                  <div className="editorial-label text-muted-foreground mb-3 flex items-center gap-2">
                    <Radio className="w-3 h-3" /> ReeVibes
                  </div>
                  <div className="h-16 flex items-center justify-start my-4">
                    <CountryLogo countryName={c.name} className="max-h-12 w-auto max-w-[80%] object-contain" />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border-subtle/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">{publishedCount} Stage{publishedCount > 1 ? "s" : ""} Published</span>
                    <span className="text-accent group-hover:translate-x-1 transition-transform">Enter Control →</span>
                  </div>
                </div>
              </AdminCard>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function CountryControl({
  country, config, votesList, ratingsList, controlState, onUpdateControls
}: {
  country: Country;
  config: Record<StageKey, StageConfig>;
  votesList: VoteRecord[];
  ratingsList: RatingRecord[];
  controlState: ControlMap;
  onUpdateControls: (next: ControlMap) => void;
}) {
  const { state } = useAppStore();
  const { theme } = useTheme();
  const [selectedContestantId, setSelectedContestantId] = useState<string | null>(null);

  // Filter to show only published stages
  const publishedStages = useMemo(() => {
    return STAGES.filter(s => config[s.key]?.status === "published");
  }, [config]);

  const [stage, setStage] = useState<StageKey | null>(null);

  // Set default stage when list updates
  useEffect(() => {
    if (publishedStages.length > 0) {
      if (!stage || !publishedStages.some(s => s.key === stage)) {
        setStage(publishedStages[0].key);
      }
    } else {
      setStage(null);
    }
  }, [publishedStages]);

  const stageConfig = stage ? config[stage] : null;

  // Build battles layout
  const battles = useMemo(() => {
    if (!stage || !stageConfig || stage === "WINNER") return [];
    const slots = STAGES.find(s => s.key === stage)!.slots;
    const arr = [];
    const half = slots / 2;
    for (let i = 0; i < half; i++) {
      arr.push({
        id: `battle-${stage}-${i}`,
        leftId: stageConfig.lineup[i],
        rightId: stageConfig.lineup[half + i],
      });
    }
    return arr;
  }, [stageConfig, stage]);

  // Bulk Controls Helper
  const handleBulkControl = (kind: "voting" | "rating", value: "active" | "stopped") => {
    if (!stage || !stageConfig) return;
    const nextControls = { ...controlState };
    
    if (stage === "WINNER") {
      const winnerId = stageConfig.lineup[0];
      if (winnerId) {
        const key = `${country.id}:${country.name}:${country.year}:${stage}:winner:${winnerId}`;
        const prev = nextControls[key] || { voting: "active", rating: "active" };
        nextControls[key] = { ...prev, [kind]: value };
      }
    } else {
      battles.forEach((b) => {
        if (b.leftId) {
          const key = `${country.id}:${country.name}:${country.year}:${stage}:${b.id}:${b.leftId}`;
          const prev = nextControls[key] || { voting: "active", rating: "active" };
          nextControls[key] = { ...prev, [kind]: value };
        }
        if (b.rightId) {
          const key = `${country.id}:${country.name}:${country.year}:${stage}:${b.id}:${b.rightId}`;
          const prev = nextControls[key] || { voting: "active", rating: "active" };
          nextControls[key] = { ...prev, [kind]: value };
        }
      });
    }
    onUpdateControls(nextControls);
  };

  const getContestantStatus = (contestantId: string, battleId: string) => {
    if (!stage) return { voting: "active" as const, rating: "active" as const };
    const key = `${country.id}:${country.name}:${country.year}:${stage}:${battleId}:${contestantId}`;
    return controlState[key] || { voting: "active", rating: "active" };
  };

  const handleToggleIndividual = (contestantId: string, battleId: string, kind: "voting" | "rating") => {
    if (!stage) return;
    const key = `${country.id}:${country.name}:${country.year}:${stage}:${battleId}:${contestantId}`;
    const nextControls = { ...controlState };
    const prev = nextControls[key] || { voting: "active", rating: "active" };
    nextControls[key] = {
      ...prev,
      [kind]: prev[kind] === "active" ? "stopped" : "active"
    };
    onUpdateControls(nextControls);
  };

  const getVoteCount = (contestantId: string, battleId: string) => {
    if (!stage) return 0;
    return votesList.filter(v => 
      v.countryId === country.id &&
      v.stageKey === stage &&
      v.battleId === battleId &&
      v.contestantId === contestantId
    ).length;
  };

  // Find selected contestant application data
  const selectedContestantData = useMemo(() => {
    if (!selectedContestantId) return null;
    return state.applications.find(a => a.contestantId === selectedContestantId) || null;
  }, [selectedContestantId, state.applications]);

  const activeStageLabel = stage ? STAGES.find(s => s.key === stage)?.label : "";

  return (
    <div className="space-y-6">
      {/* Stage tabs */}
      <div className="flex items-center gap-1 border-b border-border-subtle overflow-x-auto">
        {publishedStages.map(s => {
          const active = stage === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setStage(s.key)}
              className={`relative px-5 py-3 editorial-label transition-colors shrink-0 ${active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              <span className="flex items-center gap-2">
                {s.key === "WINNER" && <Crown className="w-3 h-3" />}
                {s.label}
              </span>
              {active && (
                <motion.div layoutId="vr-stage-underline" className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {stage && stageConfig && (
        <>
          {/* Top global control buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-surface border border-border-subtle rounded">
            <div>
              <div className="editorial-label text-muted-foreground font-mono">{activeStageLabel} Stage · {country.name}</div>
              <h3 className="font-serif text-2xl mt-1">Global Broadcast Controls</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className={`editorial-label px-5 py-2.5 font-semibold transition-colors cursor-pointer rounded ${
                theme === "light"
                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`} onClick={() => handleBulkControl("voting", "active")}>
                Start All Voting
              </button>
              <button className={`editorial-label px-5 py-2.5 font-semibold transition-colors cursor-pointer rounded ${
                theme === "light"
                  ? "bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300"
                  : "bg-rose-600 text-white hover:bg-rose-700"
              }`} onClick={() => handleBulkControl("voting", "stopped")}>
                Stop All Voting
              </button>
              <button className={`editorial-label px-5 py-2.5 font-semibold transition-colors cursor-pointer rounded ${
                theme === "light"
                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`} onClick={() => handleBulkControl("rating", "active")}>
                Start All Rating
              </button>
              <button className={`editorial-label px-5 py-2.5 font-semibold transition-colors cursor-pointer rounded ${
                theme === "light"
                  ? "bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300"
                  : "bg-rose-600 text-white hover:bg-rose-700"
              }`} onClick={() => handleBulkControl("rating", "stopped")}>
                Stop All Rating
              </button>
            </div>
          </div>

          {/* Battle layout */}
          {stage === "WINNER" ? (
            <div className="max-w-md mx-auto">
              <div className="editorial-label text-center text-muted-foreground mb-4">Coronation Winner Card</div>
              {stageConfig.lineup[0] ? (
                (() => {
                  const cId = stageConfig.lineup[0];
                  const contestant = state.applications.find(a => a.contestantId === cId);
                  const eng = getContestantStatus(cId, "winner");
                  const votes = getVoteCount(cId, "winner");
                  if (!contestant) return null;
                  return (
                    <ContestantCard
                      contestant={{
                        id: contestant.contestantId,
                        name: contestant.fullName,
                        country: contestant.country || "Global",
                        image: stageConfig.customPhotos[cId] || contestant.photos?.portrait || ""
                      }}
                      eng={{
                        voting: eng.voting,
                        rating: eng.rating,
                        votes: votes
                      }}
                      isWinner={true}
                      onToggleVoting={() => handleToggleIndividual(cId, "winner", "voting")}
                      onToggleRating={() => handleToggleIndividual(cId, "winner", "rating")}
                      onOpenDetails={() => setSelectedContestantId(cId)}
                    />
                  );
                })()
              ) : (
                <div className="border border-dashed border-border-subtle p-8 text-center text-sm text-muted-foreground rounded">
                  No Winner Coronation set in Live Contest Dashboard.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {battles.map((b, idx) => {
                const leftContestant = state.applications.find(a => a.contestantId === b.leftId);
                const rightContestant = state.applications.find(a => a.contestantId === b.rightId);
                const leftEng = b.leftId ? getContestantStatus(b.leftId, b.id) : null;
                const rightEng = b.rightId ? getContestantStatus(b.rightId, b.id) : null;
                const leftVotes = b.leftId ? getVoteCount(b.leftId, b.id) : 0;
                const rightVotes = b.rightId ? getVoteCount(b.rightId, b.id) : 0;

                return (
                  <div key={b.id} className="border border-border-subtle bg-surface p-6 rounded relative">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mb-4">
                      Matchup Row #{idx + 1}
                    </div>

                    <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-10">
                      {/* Left card */}
                      {leftContestant && leftEng ? (
                        <ContestantCard
                          contestant={{
                            id: leftContestant.contestantId,
                            name: leftContestant.fullName,
                            country: leftContestant.country || "Global",
                            image: stageConfig.customPhotos[b.leftId] || leftContestant.photos?.portrait || ""
                          }}
                          eng={{
                            voting: leftEng.voting,
                            rating: leftEng.rating,
                            votes: leftVotes
                          }}
                          onToggleVoting={() => handleToggleIndividual(b.leftId, b.id, "voting")}
                          onToggleRating={() => handleToggleIndividual(b.leftId, b.id, "rating")}
                          onOpenDetails={() => setSelectedContestantId(b.leftId)}
                        />
                      ) : (
                        <div className="border border-dashed border-border-subtle py-24 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest rounded bg-background/30">
                          Unassigned Slot
                        </div>
                      )}

                      {/* VS separator */}
                      <div className="flex flex-col items-center justify-center py-2 md:py-0 self-stretch px-4 border-y md:border-y-0 md:border-x border-border-subtle/30 bg-surface-2/20 rounded">
                        <span className="font-serif italic text-4xl md:text-5xl text-accent/80 font-bold select-none">
                          vs
                        </span>
                      </div>

                      {/* Right card */}
                      {rightContestant && rightEng ? (
                        <ContestantCard
                          contestant={{
                            id: rightContestant.contestantId,
                            name: rightContestant.fullName,
                            country: rightContestant.country || "Global",
                            image: stageConfig.customPhotos[b.rightId] || rightContestant.photos?.portrait || ""
                          }}
                          eng={{
                            voting: rightEng.voting,
                            rating: rightEng.rating,
                            votes: rightVotes
                          }}
                          onToggleVoting={() => handleToggleIndividual(b.rightId, b.id, "voting")}
                          onToggleRating={() => handleToggleIndividual(b.rightId, b.id, "rating")}
                          onOpenDetails={() => setSelectedContestantId(b.rightId)}
                        />
                      ) : (
                        <div className="border border-dashed border-border-subtle py-24 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest rounded bg-background/30">
                          Unassigned Slot
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Contestant Details Modal */}
      <Dialog open={selectedContestantId !== null} onOpenChange={(open) => !open && setSelectedContestantId(null)}>
        {selectedContestantId && selectedContestantData && stage && (
          <ContestantDetailsModal
            contestant={selectedContestantData}
            stageKey={stage}
            country={country}
            battleId={stage === "WINNER" ? "winner" : battles.find(b => b.leftId === selectedContestantId || b.rightId === selectedContestantId)?.id || ""}
            votes={getVoteCount(selectedContestantId, stage === "WINNER" ? "winner" : battles.find(b => b.leftId === selectedContestantId || b.rightId === selectedContestantId)?.id || "")}
            status={getContestantStatus(selectedContestantId, stage === "WINNER" ? "winner" : battles.find(b => b.leftId === selectedContestantId || b.rightId === selectedContestantId)?.id || "")}
            ratingsList={ratingsList}
            onClose={() => setSelectedContestantId(null)}
          />
        )}
      </Dialog>
    </div>
  );
}

/* ───────── Contestant performance card ───────── */
function ContestantCard({
  contestant, eng, isWinner = false, onToggleVoting, onToggleRating, onOpenDetails
}: {
  contestant: { id: string; name: string; country: string; image: string };
  eng: { voting: "active" | "stopped"; rating: "active" | "stopped"; votes: number };
  isWinner?: boolean;
  onToggleVoting: () => void;
  onToggleRating: () => void;
  onOpenDetails: () => void;
}) {
  const vOn = eng.voting === "active";
  const rOn = eng.rating === "active";

  return (
    <AdminCard className="overflow-hidden p-0 bg-background/40 hover:border-accent transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
        <button onClick={onOpenDetails} className="w-full h-full block text-left">
          <img src={contestant.image} alt={contestant.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

        {/* Top indicators */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5">
            <StatusPill on={vOn} label={vOn ? "Voting Active" : "Voting Stopped"} />
            <StatusPill on={rOn} label={rOn ? "Rating Active" : "Rating Stopped"} />
          </div>
          {isWinner && (
            <div className="bg-accent text-white px-2 py-1 editorial-label flex items-center gap-1 shadow-md">
              <Crown className="w-3 h-3" />Winner
            </div>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none">
          <div className="editorial-label text-white/70">{contestant.country}</div>
          <div className="font-serif text-xl leading-tight mt-0.5">{contestant.name}</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats view */}
        <div className="grid grid-cols-2 gap-3 border-b border-border-subtle/50 pb-3">
          <div>
            <div className="editorial-label text-muted-foreground flex items-center gap-1.5"><Vote className="w-3.5 h-3.5 text-accent" />Votes</div>
            <div className="font-serif text-lg mt-0.5 font-bold">{eng.votes.toLocaleString()}</div>
          </div>
          <div>
            <div className="editorial-label text-muted-foreground flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent" />Engagement</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-mono">Live stats</div>
          </div>
        </div>

        {/* Toggle buttons */}
        <div className="flex items-center gap-2">
          <ToggleButton
            active={vOn}
            onClick={onToggleVoting}
            activeLabel="Stop Voting"
            inactiveLabel="Start Voting"
            activeIcon={<Square className="w-3 h-3" />}
            inactiveIcon={<Play className="w-3 h-3" />}
          />
          <ToggleButton
            active={rOn}
            onClick={onToggleRating}
            activeLabel="Stop Rating"
            inactiveLabel="Start Rating"
            activeIcon={<Square className="w-3 h-3" />}
            inactiveIcon={<Star className="w-3 h-3" />}
          />
        </div>
      </div>
    </AdminCard>
  );
}

function StatusPill({ on, label }: { on: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 backdrop-blur-md text-[9px] tracking-[0.15em] uppercase font-bold ${
      on ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40" : "bg-red-500/25 text-red-300 border border-red-500/40"
    }`}>
      <span className={`w-1 h-1 rounded-full ${on ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
      {label}
    </span>
  );
}

function ToggleButton({
  active, onClick, activeLabel, inactiveLabel, activeIcon, inactiveIcon,
}: {
  active: boolean;
  onClick: () => void;
  activeLabel: string;
  inactiveLabel: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 flex items-center justify-center gap-1 px-2 py-2.5 text-[9px] tracking-[0.12em] uppercase font-bold transition-all duration-300 cursor-pointer rounded border ${
        active
          ? theme === "light"
            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300"
            : "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-750 shadow-md"
          : theme === "light"
            ? "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-300"
            : "bg-rose-600 text-white hover:bg-rose-700 border-rose-750 shadow-md"
      }`}
    >
      <span className="flex items-center gap-1">
        {active ? activeIcon : inactiveIcon}
        {active ? activeLabel : inactiveLabel}
      </span>
    </button>
  );
}

/* ───────── Contestant Details Modal Component ───────── */
function ContestantDetailsModal({
  contestant, stageKey, country, battleId, votes, status, ratingsList, onClose
}: {
  contestant: any;
  stageKey: StageKey;
  country: Country;
  battleId: string;
  votes: number;
  status: ControlState;
  ratingsList: RatingRecord[];
  onClose: () => void;
}) {
  // Get campaign media for this stage
  const stageMedia = useMemo(() => {
    let list: any[] = [];
    try {
      const rawMedia = window.localStorage.getItem(`reevibes:top16:media:${contestant.contestantId}`);
      if (rawMedia) {
        list = JSON.parse(rawMedia);
      }
    } catch (e) {
      console.error(e);
    }

    const stageTagMap: Record<StageKey, string> = {
      TOP_16: "TOP 16",
      TOP_8: "TOP 8",
      TOP_4: "TOP 4",
      FINALS: "FINALS",
      WINNER: "WINNER"
    };
    const currentStageTag = stageTagMap[stageKey];

    // Fallback if no media items
    if (list.length === 0 && stageKey === "TOP_16") {
      list = [
        {
          id: `${contestant.contestantId}-m-portrait`,
          image: contestant.photos?.portrait || "",
          positions: ["TOP 16"],
        }
      ];
    }

    return list.filter((m: any) => m.positions && m.positions.includes(currentStageTag));
  }, [contestant, stageKey]);

  // Aggregate average ratings per media item
  const getAverageRating = (mediaId: string) => {
    const mediaRatings = ratingsList.filter(r => r.mediaId === mediaId);
    if (mediaRatings.length === 0) {
      return { average: "0.0", count: 0 };
    }
    const sum = mediaRatings.reduce((acc, r) => acc + r.ratingValue, 0);
    const avg = sum / mediaRatings.length;
    return {
      average: avg.toFixed(1),
      count: mediaRatings.length
    };
  };

  const videoList = useMemo(() => {
    if (!contestant.videos) return [];
    return [
      { id: `${contestant.contestantId}-v-intro`, url: contestant.videos.intro, title: "Introduction Reel" },
      ...(Array.isArray(contestant.videos.additional) ? contestant.videos.additional.map((url: string, i: number) => ({
        id: `${contestant.contestantId}-v-add-${i}`,
        url,
        title: `Additional Reel ${i + 1}`
      })) : [])
    ].filter(v => !!v.url);
  }, [contestant]);

  const activeStageLabel = STAGES.find(s => s.key === stageKey)?.label || "";

  return (
    <DialogContent className="max-w-4xl bg-zinc-950 border border-zinc-800 text-zinc-100 [color-scheme:dark] max-h-[90vh] overflow-y-auto">
      <DialogHeader className="border-b border-zinc-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="editorial-label text-accent font-mono">{activeStageLabel} Stage · Details View</span>
            <DialogTitle className="font-serif text-3xl mt-1">{contestant.fullName}</DialogTitle>
          </div>
        </div>
      </DialogHeader>

      <div className="grid md:grid-cols-12 gap-8 my-6">
        {/* Left Column - Image & Status Badges */}
        <div className="md:col-span-5 space-y-4">
          <div className="aspect-[3/4] border border-zinc-800 bg-zinc-900 overflow-hidden rounded relative">
            <img src={contestant.photos?.portrait || ""} alt={contestant.fullName} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">Voting Status</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded mt-1 w-full justify-center ${
                status.voting === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}>
                {status.voting === "active" ? "Active" : "Stopped"}
              </span>
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">Rating Status</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded mt-1 w-full justify-center ${
                status.rating === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}>
                {status.rating === "active" ? "Active" : "Stopped"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Contestant Specifications */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <h4 className="editorial-label text-accent border-b border-zinc-800 pb-1 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Metrics & Identification
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm font-mono text-zinc-300">
              <div><span className="text-zinc-500 uppercase text-[10px]">Contestant ID:</span> {contestant.contestantId}</div>
              <div><span className="text-zinc-500 uppercase text-[10px]">Battle ID:</span> {battleId}</div>
              <div><span className="text-zinc-500 uppercase text-[10px]">Country Name:</span> {country.name}</div>
              <div><span className="text-zinc-500 uppercase text-[10px]">Year:</span> {country.year}</div>
              <div><span className="text-zinc-500 uppercase text-[10px]">Stage:</span> {activeStageLabel}</div>
              <div><span className="text-zinc-500 uppercase text-[10px]">Total Votes:</span> {votes.toLocaleString()}</div>
              <div><span className="text-zinc-500 uppercase text-[10px]">Age:</span> {contestant.age} years</div>
              <div><span className="text-zinc-500 uppercase text-[10px]">Height:</span> {contestant.height || "—"}</div>
            </div>
          </div>

          <div>
            <h4 className="editorial-label text-accent border-b border-zinc-800 pb-1">Representation Details</h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm font-mono text-zinc-300">
              <div><span className="text-zinc-500 uppercase text-[10px]">Representing:</span> {contestant.country}</div>
              <div><span className="text-zinc-500 uppercase text-[10px]">Home City:</span> {contestant.city || "—"}</div>
            </div>
          </div>

          {contestant.biography && (
            <div>
              <h4 className="editorial-label text-accent border-b border-zinc-800 pb-1">Biography</h4>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed font-serif italic">{contestant.biography}</p>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Media Grid & Ratings */}
      <div className="space-y-6 pt-6 border-t border-zinc-900">
        <h4 className="editorial-label text-accent flex items-center gap-1.5 font-mono">
          <ImageIcon className="w-4 h-4 text-accent" /> Campaign Photos Average Ratings ({stageMedia.length})
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {stageMedia.map((m) => {
            const ratingsObj = getAverageRating(m.id);
            return (
              <div key={m.id} className="border border-zinc-800 bg-zinc-900/40 p-4 rounded flex gap-4 items-center">
                <div className="relative w-16 h-20 bg-zinc-900 rounded overflow-hidden shrink-0 border border-zinc-800">
                  <img src={m.image} alt="Campaign frame" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Photo Media</div>
                  <div className="font-serif text-sm font-semibold truncate max-w-[200px] mt-0.5">{m.caption || "Campaign Image"}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {ratingsObj.average} / 5
                    </span>
                    <span className="text-zinc-500 font-mono text-[10px]">{ratingsObj.count} ratings</span>
                  </div>
                </div>
              </div>
            );
          })}
          {stageMedia.length === 0 && (
            <div className="col-span-full border border-dashed border-zinc-800 py-8 text-center text-xs text-zinc-500 font-mono">
              No campaign photo files found for this stage.
            </div>
          )}
        </div>
      </div>

      {/* Videos Section */}
      {videoList.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-zinc-900">
          <h4 className="editorial-label text-accent flex items-center gap-1.5 font-mono">
            <Film className="w-4 h-4 text-accent" /> Campaign Videos Average Ratings ({videoList.length})
          </h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {videoList.map((v) => {
              const ratingsObj = getAverageRating(v.id);
              return (
                <div key={v.id} className="border border-zinc-800 bg-zinc-900/40 p-4 rounded flex gap-4 items-center">
                  <div className="relative w-16 h-12 bg-zinc-950 rounded flex items-center justify-center shrink-0 border border-zinc-800">
                    <Film className="w-5 h-5 text-zinc-600" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Video Reel</div>
                    <div className="font-serif text-sm font-semibold truncate max-w-[200px] mt-0.5">{v.title}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {ratingsObj.average} / 5
                      </span>
                      <span className="text-zinc-500 font-mono text-[10px]">{ratingsObj.count} ratings</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <DialogFooter className="border-t border-zinc-800 pt-4">
        <AdminButton variant="outline" onClick={onClose}>Close Detail View</AdminButton>
      </DialogFooter>
    </DialogContent>
  );
}
