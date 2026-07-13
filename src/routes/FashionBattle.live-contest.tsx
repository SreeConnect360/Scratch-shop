import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, X, Calendar, Clock, Lock, CheckCircle, Radio, User, Volume2, Award, Crown } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp, ease } from "@/components/motion/Reveal";
import { CONTESTANTS, type Contestant } from "@/lib/data";
import { useState, useEffect, useMemo, useRef } from "react";
import { Marquee } from "@/components/public/Marquee";
import { useAppStore } from "@/lib/portal-state";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/FashionBattle/live-contest")({
  head: () => ({
    meta: [
      { title: "Live Contest — ReeVibes" },
      { name: "description", content: "The runway is live. Cast your vote on tonight's editorial battles." },
    ],
  }),
  component: LiveContest,
});

type StageKey = "TOP_16" | "TOP_8" | "TOP_4" | "FINALS" | "WINNER";

const STAGES: { key: StageKey; label: string; slots: number }[] = [
  { key: "TOP_16", label: "Top 16", slots: 16 },
  { key: "TOP_8",  label: "Top 8",  slots: 8 },
  { key: "TOP_4",  label: "Top 4",  slots: 4 },
  { key: "FINALS", label: "Finals", slots: 2 },
  { key: "WINNER", label: "Winner", slots: 1 },
];

type StageSponsor = { id: string; sponsorId: string; url: string; order: number };
type StageConfig = {
  lineup: string[];
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

type FavoriteRecord = {
  userId: string;
  mediaId: string;
  contestantId: string;
  countryId: string;
  stageKey: string;
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

const STAGE_LABELS: Record<StageKey, string> = {
  TOP_16: "Top 16",
  TOP_8: "Top 8",
  TOP_4: "Top 4",
  FINALS: "Finals",
  WINNER: "Winner",
};

const STAGE_TAGS: Record<StageKey, string> = {
  TOP_16: "TOP 16",
  TOP_8: "TOP 8",
  TOP_4: "TOP 4",
  FINALS: "FINALS",
  WINNER: "WINNER",
};

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

function LiveContest() {
  const { state } = useAppStore();
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedStageKey, setSelectedStageKey] = useState<StageKey | null>(null);
  const [viewingContestantId, setViewingContestantId] = useState<string | null>(null);

  // Load configuration from local storage
  const [byCountryConfig, setByCountryConfig] = useState<Record<string, Record<StageKey, StageConfig>>>({});
  const [publishedCountryIds, setPublishedCountryIds] = useState<string[]>([]);
  const [publishedCountryMeta, setPublishedCountryMeta] = useState<Record<string, { id: string; name: string; year: string }>>({});
  
  // Real-time synchronization state for voting & rating controls
  const [controlState, setControlState] = useState<Record<string, { voting: "active" | "stopped"; rating: "active" | "stopped" }>>({});

  // Vote Confirmation & Success Modals States
  const [confirmVoteFor, setConfirmVoteFor] = useState<{ contestantId: string; contestantName: string; onConfirm: () => void } | null>(null);
  const [popup, setPopup] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawConfig = window.localStorage.getItem("reevibes:live-contest:by-country");
        if (rawConfig) setByCountryConfig(JSON.parse(rawConfig));

        const rawLineups = window.localStorage.getItem("reevibes:published-lineups");
        if (rawLineups) setPublishedCountryIds(JSON.parse(rawLineups));

        const rawMeta = window.localStorage.getItem("reevibes:published-countries-meta");
        if (rawMeta) setPublishedCountryMeta(JSON.parse(rawMeta));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const loadControls = () => {
      try {
        const raw = window.localStorage.getItem("reevibes:vote-rate-controls");
        if (raw) {
          setControlState(JSON.parse(raw));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadControls();
    
    window.addEventListener("storage", loadControls);
    const interval = setInterval(loadControls, 1000);
    return () => {
      window.removeEventListener("storage", loadControls);
      clearInterval(interval);
    };
  }, []);

  // Filter countries that have at least one published stage
  const publishedCountries = useMemo(() => {
    return publishedCountryIds.map(id => {
      const config = byCountryConfig[id];
      const meta = publishedCountryMeta[id] || { id, name: id.charAt(0).toUpperCase() + id.slice(1), year: "2026" };
      
      if (!config) return null;
      
      const hasPublishedStage = Object.values(config).some(stageCfg => stageCfg.status === "published");
      if (!hasPublishedStage) return null;

      const publishedStagesCount = Object.values(config).filter(stageCfg => stageCfg.status === "published").length;

      return {
        ...meta,
        stagesCount: publishedStagesCount,
        config
      };
    }).filter(Boolean) as Array<{ id: string; name: string; year: string; stagesCount: number; config: Record<StageKey, StageConfig> }>;
  }, [publishedCountryIds, byCountryConfig, publishedCountryMeta]);

  const activeCountry = useMemo(() => {
    return publishedCountries.find(c => c.id === selectedCountryId) || null;
  }, [publishedCountries, selectedCountryId]);

  // Set default stage when country is selected
  useEffect(() => {
    if (activeCountry) {
      const publishedStages = (Object.keys(activeCountry.config) as StageKey[]).filter(
        key => activeCountry.config[key]?.status === "published"
      );
      if (publishedStages.length > 0) {
        setSelectedStageKey(publishedStages[0]);
      } else {
        setSelectedStageKey(null);
      }
    } else {
      setSelectedStageKey(null);
    }
  }, [activeCountry]);

  const getVoteCycleKey = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    const resetTimeInMinutes = 0 * 60 + 30; // 12:30 AM
    
    if (currentTimeInMinutes < resetTimeInMinutes) {
      const prev = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return prev.toISOString().slice(0, 10);
    }
    return now.toISOString().slice(0, 10);
  };

  const dateCycle = getVoteCycleKey();
  const user = state.user;

  const initiateVote = (cId: string, cName: string, battleId: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setConfirmVoteFor({
      contestantId: cId,
      contestantName: cName,
      onConfirm: () => {
        try {
          const raw = window.localStorage.getItem("reevibes:votes");
          const list: VoteRecord[] = raw ? JSON.parse(raw) : [];
          
          const nextVote: VoteRecord = {
            userId: user.id,
            countryId: activeCountry!.id,
            stageKey: selectedStageKey!,
            battleId,
            contestantId: cId,
            dateCycle
          };

          list.push(nextVote);
          window.localStorage.setItem("reevibes:votes", JSON.stringify(list));
          
          // Dispatch a local storage reload event to sync states instantly
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("reevibes:vote-cast"));
          setPopup("Vote submitted");
          setTimeout(() => setPopup(null), 2000);
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background text-foreground">
        {!activeCountry ? (
          <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-20">
            <header className="mb-12 border-b border-border-subtle pb-10">
              <FadeUp>
                <p className="editorial-eyebrow text-accent flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> Live Competition Arena
                </p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h1 className="mt-6 font-serif text-5xl lg:text-7xl">Broadcasting Battles</h1>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className="text-muted-foreground text-sm mt-4 max-w-xl">
                  The pageant runway is active. Select a live country channel to review published stages and cast your daily votes.
                </p>
              </FadeUp>
            </header>

            <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedCountries.map((c, i) => (
                <FadeUp key={c.id} delay={i * 0.05}>
                  <button
                    onClick={() => setSelectedCountryId(c.id)}
                    className="group w-full text-left border border-border-subtle hover:border-accent transition-all duration-500 p-8 bg-surface rounded flex flex-col justify-between min-h-[220px] shadow-lg hover:shadow-accent/5"
                  >
                    <div>
                      <div className="editorial-label text-muted-foreground/60">Edition · {c.year}</div>
                      <div className="h-16 flex items-center justify-center my-4">
                        <CountryLogo countryName={c.name} className="max-h-12 w-auto max-w-[80%] object-contain" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-mono">{c.stagesCount} Published Stage{c.stagesCount > 1 ? "s" : ""}</span>
                      <span className="text-accent group-hover:translate-x-1.5 transition-transform flex items-center gap-1 font-semibold uppercase tracking-wider">
                        Enter Live <ArrowRightIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                </FadeUp>
              ))}

              {publishedCountries.length === 0 && (
                <div className="col-span-full border border-dashed border-border-subtle py-24 text-center rounded max-w-md mx-auto">
                  <Radio className="w-8 h-8 mx-auto text-muted-foreground/50 mb-4 animate-pulse" />
                  <h3 className="font-serif text-xl text-foreground/80 mb-2">No Active Broadcasts</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    There are currently no published stage lineups in progress. Check back later once the administrators release the live frames.
                  </p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-24 pb-20">
            {/* Header back button */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedCountryId(null)}
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <ChevronLeftIcon className="w-4 h-4" /> Back to Channels
              </button>
            </div>

            <header className="border-b border-border-subtle pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="h-12 w-auto max-w-[200px] flex items-center">
                  <CountryLogo countryName={activeCountry.name} className="max-h-10 object-contain text-left" />
                </div>
                <h1 className="font-serif text-3xl mt-3 text-foreground/85">Live Stage Orchestration</h1>
              </div>
              
              {/* Stage tabs */}
              <div className="flex items-center gap-1 border-b border-border-subtle self-start md:self-auto overflow-x-auto pb-px">
                {(Object.keys(activeCountry.config) as StageKey[]).map(key => {
                  const stageCfg = activeCountry.config[key];
                  if (stageCfg.status !== "published") return null;
                  const active = selectedStageKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedStageKey(key)}
                      className={`relative px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                        active ? "text-accent" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {STAGE_LABELS[key]}
                      {active && <motion.div layoutId="user-stage-indicator" className="absolute -bottom-px left-0 right-0 h-0.5 bg-accent" />}
                    </button>
                  );
                })}
              </div>
            </header>

            {selectedStageKey && (
              <StageLayoutView
                countryId={activeCountry.id}
                countryName={activeCountry.name}
                year={activeCountry.year}
                stageKey={selectedStageKey}
                cfg={activeCountry.config[selectedStageKey]}
                controlState={controlState}
                onRequestVoteConfirm={initiateVote}
                onOpenProfile={(id) => setViewingContestantId(id)}
              />
            )}
          </div>
        )}
      </div>

      {/* Confirm Vote Modal */}
      {confirmVoteFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border-subtle w-full max-w-md rounded shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-serif text-xl font-bold tracking-tight">Confirm Your Vote</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Are you sure you want to cast your daily vote for <strong className="text-foreground">{confirmVoteFor.contestantName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmVoteFor(null)}
                className="border border-border-subtle hover:bg-surface text-foreground font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmVoteFor.onConfirm();
                  setConfirmVoteFor(null);
                }}
                className="bg-accent hover:bg-accent/90 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors shadow-md"
              >
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}

      {popup && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 20 }} 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white border border-zinc-800 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl z-50 font-mono text-sm uppercase tracking-wider"
        >
          <span className="text-accent">❤️</span> {popup}
        </motion.div>
      )}

      {/* Full details Contestant Profile Modal */}
      <AnimatePresence>
        {viewingContestantId && selectedCountryId && selectedStageKey && activeCountry && (
          <ContestantStageProfileModal
            contestantId={viewingContestantId}
            countryId={selectedCountryId}
            countryName={activeCountry.name}
            year={activeCountry.year}
            stageKey={selectedStageKey}
            controlState={controlState}
            onRequestVoteConfirm={initiateVote}
            onClose={() => setViewingContestantId(null)}
          />
        )}
      </AnimatePresence>
    </PublicLayout>
  );
}

/* ============================================================
 * STAGE LAYOUT BATTLE VIEWS
 * ============================================================ */
function StageLayoutView({
  countryId, countryName, year, stageKey, cfg, controlState, onRequestVoteConfirm, onOpenProfile
}: {
  countryId: string;
  countryName: string;
  year: string;
  stageKey: StageKey;
  cfg: StageConfig;
  controlState: Record<string, { voting: "active" | "stopped"; rating: "active" | "stopped" }>;
  onRequestVoteConfirm: (cId: string, cName: string, battleId: string) => void;
  onOpenProfile: (id: string) => void;
}) {
  const { state } = useAppStore();
  const slots = STAGES.find(s => s.key === stageKey)!.slots;
  const isWinner = stageKey === "WINNER";

  // Build the list of battle couples
  const battles = useMemo(() => {
    if (isWinner) return [];
    const arr = [];
    const half = slots / 2;
    for (let i = 0; i < half; i++) {
      arr.push({
        id: `battle-${stageKey}-${i}`,
        leftId: cfg.lineup[i],
        rightId: cfg.lineup[half + i],
      });
    }
    return arr;
  }, [cfg.lineup, slots, stageKey, isWinner]);

  const [dbSponsors, setDbSponsors] = useState<any[]>([]);
  const [publishedMappings, setPublishedMappings] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/sponsors?action=get-sponsors")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDbSponsors(data);
      })
      .catch(err => console.error("Error fetching db sponsors:", err));

    fetch("/api/sponsors?action=get-published-sponsors")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPublishedMappings(data);
      })
      .catch(err => console.error("Error fetching published mappings:", err));
  }, []);

  // Sponsor parsing
  const stageSponsors = useMemo(() => {
    const mapping = publishedMappings.find(
      (m: any) =>
        m.publishedSectionId === `live-contest-${countryId}-${stageKey}` ||
        (m.countryId === countryId && m.stageName === stageKey)
    );
    if (!mapping || !Array.isArray(mapping.selectedSponsorIds)) {
      return (cfg.sponsors || [])
        .map(s => {
          const original = dbSponsors.find(x => x.id === s.sponsorId);
          return original ? { ...original, ...s } : null;
        })
        .filter(Boolean);
    }
    return mapping.selectedSponsorIds
      .map((spId: string) => {
        const original = dbSponsors.find(x => x.id === spId);
        return original ? { ...original } : null;
      })
      .filter(Boolean);
  }, [publishedMappings, dbSponsors, countryId, stageKey, cfg.sponsors]);

  // Date countdown state or formatting
  const formattedDates = useMemo(() => {
    if (!cfg.startDate) return null;
    const startStr = `${cfg.startDate} ${cfg.startTime || "00:00"}`;
    const endStr = `${cfg.endDate} ${cfg.endTime || "23:59"}`;
    return {
      start: new Date(startStr).toLocaleString(),
      end: new Date(endStr).toLocaleString(),
    };
  }, [cfg.startDate, cfg.startTime, cfg.endDate, cfg.endTime]);

  return (
    <div className="space-y-12">
      {/* Date metadata bar */}
      {formattedDates && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <span>Broadcast Window: <strong className="text-zinc-200">{formattedDates.start}</strong> to <strong className="text-zinc-200">{formattedDates.end}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-accent bg-accent/5 px-2.5 py-1 border border-accent/20 rounded uppercase font-semibold">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> Reset daily @ 12:30 AM
          </div>
        </div>
      )}

      {isWinner ? (
        <WinnerCoronationView
          winnerId={cfg.lineup[0]}
          customPhoto={cfg.customPhotos[cfg.lineup[0]]}
          onOpenProfile={onOpenProfile}
        />
      ) : (
        <div className="space-y-6">
          {battles.map((b, idx) => (
            <BattlePairCard
              key={b.id}
              battleId={b.id}
              leftId={b.leftId}
              rightId={b.rightId}
              customPhotos={cfg.customPhotos}
              countryId={countryId}
              countryName={countryName}
              year={year}
              stageKey={stageKey}
              index={idx}
              controlState={controlState}
              onRequestVoteConfirm={onRequestVoteConfirm}
              onOpenProfile={onOpenProfile}
            />
          ))}
        </div>
      )}

      {/* Sponsors section */}
      {stageSponsors.length > 0 && (
        <section className="pt-8 border-t border-zinc-900 overflow-hidden">
          <div className="editorial-label text-zinc-500 mb-6 text-center">Stage Presented By</div>
          {stageSponsors.length > 5 ? (
            <div className="max-w-4xl mx-auto">
              <Marquee speed={35}>
                {stageSponsors.map((s: any, idx: number) => (
                  <PublicSponsorLogoFrame key={`${s.id}-${idx}`} s={s} />
                ))}
              </Marquee>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-6">
              {stageSponsors.map((s: any) => (
                <PublicSponsorLogoFrame key={s.id} s={s} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function PublicSponsorLogoFrame({ s }: { s: any }) {
  const isLink = !!s.url;
  const content = (
    <div
      className="relative overflow-hidden bg-white border border-border-subtle rounded transition-transform hover:scale-[1.02] flex items-center justify-center shrink-0 shadow-sm"
      style={{ width: "120px", height: "72px", aspectRatio: "5/3", padding: "8px" }}
    >
      {s.logo ? (
        <img
          src={s.logo}
          alt={s.name}
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          style={{
            transform: `translate(${s.logoX || 0}%, ${s.logoY || 0}%) scale(${s.logoZoom || 1})`,
            transformOrigin: "center"
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400 font-serif font-bold bg-neutral-100 uppercase">
          {s.name ? s.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("") : "SP"}
        </div>
      )}
    </div>
  );

  if (isLink) {
    return (
      <a href={s.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer block">
        {content}
      </a>
    );
  }

  return content;
}

/* ============================================================
 * WINNER CORONATION VIEW
 * ============================================================ */
function WinnerCoronationView({
  winnerId, customPhoto, onOpenProfile
}: {
  winnerId: string;
  customPhoto?: string;
  onOpenProfile: (id: string) => void;
}) {
  const { state } = useAppStore();
  const c = useMemo(() => {
    return state.applications.find(a => a.contestantId === winnerId) || null;
  }, [state, winnerId]);

  if (!c) {
    return (
      <div className="border border-dashed border-zinc-800 p-12 text-center rounded">
        <Award className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
        <div className="font-serif text-zinc-500">Coronation pending release.</div>
      </div>
    );
  }

  const image = customPhoto || c.photos?.portrait || c.photos?.fullBody || "";

  return (
    <div className="max-w-md mx-auto border border-zinc-800 bg-zinc-900/40 p-6 rounded shadow-xl text-center space-y-6">
      <div className="editorial-label text-accent flex items-center justify-center gap-1.5">
        <Crown className="w-4 h-4 animate-bounce" /> Coronation Winner
      </div>
      <button onClick={() => onOpenProfile(c.contestantId)} className="block w-full group">
        <div className="aspect-[3/4] overflow-hidden border border-zinc-800 rounded relative">
          <img src={image} alt={c.fullName} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1500ms]" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-0 right-0">
            <span className="bg-accent text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest shadow-md">
              Winner
            </span>
          </div>
        </div>
      </button>
      <div>
        <h3 className="font-serif text-3xl font-bold">{c.fullName}</h3>
        <p className="text-sm text-zinc-400 font-mono mt-1 uppercase tracking-wider">{c.country}</p>
      </div>
    </div>
  );
}

/* ============================================================
 * BATTLE PAIR CARD
 * ============================================================ */
function BattlePairCard({
  battleId, leftId, rightId, customPhotos, countryId, countryName, year, stageKey, index, controlState, onRequestVoteConfirm, onOpenProfile
}: {
  battleId: string;
  leftId: string;
  rightId: string;
  customPhotos: Record<string, string>;
  countryId: string;
  countryName: string;
  year: string;
  stageKey: StageKey;
  index: number;
  controlState: Record<string, { voting: "active" | "stopped"; rating: "active" | "stopped" }>;
  onRequestVoteConfirm: (cId: string, cName: string, battleId: string) => void;
  onOpenProfile: (id: string) => void;
}) {
  const { state } = useAppStore();
  const { theme } = useTheme();
  const [votes, setVotes] = useState<Record<string, string>>({}); // battleId -> contestantId voted today

  const getVoteCycleKey = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    const resetTimeInMinutes = 0 * 60 + 30; // 12:30 AM
    
    if (currentTimeInMinutes < resetTimeInMinutes) {
      const prev = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return prev.toISOString().slice(0, 10);
    }
    return now.toISOString().slice(0, 10);
  };

  const dateCycle = getVoteCycleKey();
  const user = state.user;

  // Load vote mapping from localStorage
  useEffect(() => {
    const loadState = () => {
      try {
        const raw = window.localStorage.getItem("reevibes:votes");
        if (raw) {
          const list: VoteRecord[] = JSON.parse(raw);
          const map: Record<string, string> = {};
          list.forEach(v => {
            if (v.dateCycle === dateCycle && (user ? v.userId === user.id : v.userId === "guest")) {
              map[v.battleId] = v.contestantId;
            }
          });
          setVotes(map);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadState();
    window.addEventListener("storage", loadState);
    window.addEventListener("reevibes:vote-cast", loadState);
    const interval = setInterval(loadState, 1000);
    return () => {
      window.removeEventListener("storage", loadState);
      window.removeEventListener("reevibes:vote-cast", loadState);
      clearInterval(interval);
    };
  }, [dateCycle, user]);

  const left = useMemo(() => state.applications.find(a => a.contestantId === leftId) || null, [state.applications, leftId]);
  const right = useMemo(() => state.applications.find(a => a.contestantId === rightId) || null, [state.applications, rightId]);

  if (!left && !right) return null;

  const handleVote = (cId: string, cName: string, isBlocked: boolean) => {
    if (isBlocked) {
      alert("Voting has been stopped by admin.");
      return;
    }
    onRequestVoteConfirm(cId, cName, battleId);
  };

  const currentVotedId = votes[battleId];

  // Load voting status from controlState
  const leftKey = `${countryId}:${countryName}:${year}:${stageKey}:${battleId}:${leftId}`;
  const rightKey = `${countryId}:${countryName}:${year}:${stageKey}:${battleId}:${rightId}`;
  const leftControls = controlState[leftKey] || { voting: "active", rating: "active" };
  const rightControls = controlState[rightKey] || { voting: "active", rating: "active" };

  // Static mock stats for votes
  const leftVotes = 8240 + (index * 420);
  const rightVotes = 7410 + (index * 580);
  const total = leftVotes + rightVotes;
  const pctLeft = (leftVotes / total) * 100;
  const pctRight = 100 - pctLeft;

  return (
    <div className={`border rounded overflow-hidden shadow-lg transition-colors ${
      theme === "light"
        ? "border-zinc-400 bg-white"
        : "border-border-subtle bg-surface/30"
    }`}>
      <div className={`flex items-center justify-between px-5 py-2.5 border-b transition-colors ${
        theme === "light"
          ? "border-zinc-400 bg-zinc-200 text-zinc-900"
          : "border-border-subtle bg-surface/80 text-foreground"
      }`}>
        <span className="text-[10px] tracking-widest uppercase font-semibold font-mono">
          Battle Row #{index + 1}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-accent flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> Live Vote
        </span>
      </div>

      <div className="grid grid-cols-2 relative">
        {/* Left contestant block */}
        {left ? (
          <div className="relative aspect-[3/4] overflow-hidden group">
            <button onClick={() => onOpenProfile(left.contestantId)} className="absolute inset-0 block w-full h-full text-left">
              <img
                src={customPhotos[leftId] || left.photos?.portrait || left.photos?.fullBody || ""}
                alt={left.fullName}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms]"
              />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-left pointer-events-none z-10">
              <h4 className="font-serif text-xl md:text-2xl font-bold leading-tight text-white">{left.fullName}</h4>
              <p className="text-xs text-zinc-400 mt-1 uppercase font-mono">{left.country}</p>
              
              <div className="mt-3 flex items-center gap-3 text-xs pointer-events-auto">
                {leftControls.voting === "stopped" ? (
                  <div 
                    className="relative border border-red-500/30 bg-red-950/20 px-3.5 py-2 rounded text-left overflow-hidden select-none max-w-[190px]"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, rgba(220,38,38,0.15), rgba(220,38,38,0.15) 5px, rgba(0,0,0,0.5) 5px, rgba(0,0,0,0.5) 10px)"
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[9px] uppercase tracking-wider font-bold">
                      <Lock className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
                      Voting Stopped
                    </div>
                    <div className="text-[9px] text-zinc-400 font-sans mt-0.5 leading-tight">Voting stopped by admin.</div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVote(left.contestantId, left.fullName, false)}
                    disabled={!!currentVotedId}
                    className={`px-4 py-2 font-mono uppercase tracking-wider text-[10px] rounded transition-colors ${
                      currentVotedId === left.contestantId
                        ? "bg-accent text-white"
                        : currentVotedId
                        ? "border border-border text-muted-foreground/35 cursor-not-allowed"
                        : "border border-border-subtle text-zinc-200 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 inline mr-1.5 ${currentVotedId === left.contestantId ? "fill-current" : ""}`} />
                    {currentVotedId === left.contestantId ? "Voted" : "Vote"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-[3/4] bg-surface-2 border-r border-border-subtle flex items-center justify-center text-xs text-muted-foreground font-mono uppercase tracking-widest">
            Unassigned Slot
          </div>
        )}

        {/* VS separator */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-10">
          <span className={`font-serif italic text-2xl md:text-3xl text-accent font-bold select-none w-12 h-12 flex items-center justify-center bg-background border-4 rounded-full shadow-lg drop-shadow-[0_2px_8px_rgba(255,90,140,0.35)] ${
            theme === "light" ? "border-zinc-400" : "border-zinc-800"
          }`}>
            vs
          </span>
        </div>

        {/* Right contestant block */}
        {right ? (
          <div className="relative aspect-[3/4] overflow-hidden group">
            <button onClick={() => onOpenProfile(right.contestantId)} className="absolute inset-0 block w-full h-full text-left">
              <img
                src={customPhotos[rightId] || right.photos?.portrait || right.photos?.fullBody || ""}
                alt={right.fullName}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms]"
              />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-right pointer-events-none z-10">
              <h4 className="font-serif text-xl md:text-2xl font-bold leading-tight text-white">{right.fullName}</h4>
              <p className="text-xs text-zinc-400 mt-1 uppercase font-mono">{right.country}</p>
              
              <div className="mt-3 flex items-center gap-3 text-xs justify-end pointer-events-auto">
                {rightControls.voting === "stopped" ? (
                  <div 
                    className="relative border border-red-500/30 bg-red-950/20 px-3.5 py-2 rounded text-right overflow-hidden select-none max-w-[190px] ml-auto"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, rgba(220,38,38,0.15), rgba(220,38,38,0.15) 5px, rgba(0,0,0,0.5) 5px, rgba(0,0,0,0.5) 10px)"
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[9px] uppercase tracking-wider font-bold justify-end">
                      <Lock className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
                      Voting Stopped
                    </div>
                    <div className="text-[9px] text-zinc-400 font-sans mt-0.5 leading-tight">Voting stopped by admin.</div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVote(right.contestantId, right.fullName, false)}
                    disabled={!!currentVotedId}
                    className={`px-4 py-2 font-mono uppercase tracking-wider text-[10px] rounded transition-colors ${
                      currentVotedId === right.contestantId
                        ? "bg-accent text-white"
                        : currentVotedId
                        ? "border border-border text-muted-foreground/35 cursor-not-allowed"
                        : "border border-border-subtle text-zinc-200 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 inline mr-1.5 ${currentVotedId === right.contestantId ? "fill-current" : ""}`} />
                    {currentVotedId === right.contestantId ? "Voted" : "Vote"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-[3/4] bg-surface-2 flex items-center justify-center text-xs text-muted-foreground font-mono uppercase tracking-widest">
            Unassigned Slot
          </div>
        )}
      </div>

      {/* Progress poll statistics bar */}
      <div className="h-1.5 bg-border relative w-full flex">
        <div style={{ width: `${pctLeft}%` }} className="bg-accent h-full transition-all duration-1000" />
      </div>
      <div className={`flex items-center justify-between px-5 py-2 text-[10px] font-mono font-bold transition-colors ${
        theme === "light"
          ? "bg-zinc-100 text-zinc-700 border-t border-zinc-400"
          : "bg-surface/50 text-muted-foreground"
      }`}>
        <span>{pctLeft.toFixed(1)}% ({leftVotes.toLocaleString()} votes)</span>
        <span>{pctRight.toFixed(1)}% ({rightVotes.toLocaleString()} votes)</span>
      </div>
    </div>
  );
}

/* ============================================================
 * CONTESTANT PROFILE MODAL WITH FAVORITES & RATINGS
 * ============================================================ */
function ContestantStageProfileModal({
  contestantId, countryId, countryName, year, stageKey, controlState, onRequestVoteConfirm, onClose
}: {
  contestantId: string;
  countryId: string;
  countryName: string;
  year: string;
  stageKey: StageKey;
  controlState: Record<string, { voting: "active" | "stopped"; rating: "active" | "stopped" }>;
  onRequestVoteConfirm: (cId: string, cName: string, battleId: string) => void;
  onClose: () => void;
}) {
  const { state } = useAppStore();
  const user = state.user;

  // Retrieve contestant details
  const c = useMemo(() => {
    return state.applications.find(a => a.contestantId === contestantId) || null;
  }, [state.applications, contestantId]);

  // Load favorites & ratings database from localStorage
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [ratings, setRatings] = useState<RatingRecord[]>([]);
  const [votedForThisBattle, setVotedForThisBattle] = useState<string | null>(null);

  // Resolve the battleId dynamically to correctly match the control key
  const battleId = useMemo(() => {
    if (stageKey === "WINNER") return "winner";
    
    try {
      const rawConfig = window.localStorage.getItem("reevibes:live-contest:by-country");
      if (rawConfig) {
        const byCountry = JSON.parse(rawConfig);
        const cfg = byCountry[countryId]?.[stageKey];
        if (cfg && Array.isArray(cfg.lineup)) {
          const idx = cfg.lineup.indexOf(contestantId);
          if (idx !== -1) {
            const slots = STAGES.find(s => s.key === stageKey)!.slots;
            const half = slots / 2;
            const i = idx >= half ? idx - half : idx;
            return `battle-${stageKey}-${i}`;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return "";
  }, [countryId, stageKey, contestantId]);

  const getVoteCycleKey = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    const resetTimeInMinutes = 0 * 60 + 30; // 12:30 AM
    
    if (currentTimeInMinutes < resetTimeInMinutes) {
      const prev = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return prev.toISOString().slice(0, 10);
    }
    return now.toISOString().slice(0, 10);
  };

  const dateCycle = getVoteCycleKey();

  useEffect(() => {
    const loadState = () => {
      try {
        const rawFavs = window.localStorage.getItem("reevibes:favorites");
        if (rawFavs) setFavorites(JSON.parse(rawFavs));

        const rawRatings = window.localStorage.getItem("reevibes:ratings");
        if (rawRatings) setRatings(JSON.parse(rawRatings));

        const rawVotes = window.localStorage.getItem("reevibes:votes");
        if (rawVotes && battleId) {
          const list: VoteRecord[] = JSON.parse(rawVotes);
          const uId = user ? user.id : "guest";
          const found = list.find(v => v.battleId === battleId && v.dateCycle === dateCycle && v.userId === uId);
          if (found) {
            setVotedForThisBattle(found.contestantId);
          } else {
            setVotedForThisBattle(null);
          }
        } else {
          setVotedForThisBattle(null);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadState();
    window.addEventListener("storage", loadState);
    window.addEventListener("reevibes:vote-cast", loadState);
    const interval = setInterval(loadState, 1000);
    return () => {
      window.removeEventListener("storage", loadState);
      window.removeEventListener("reevibes:vote-cast", loadState);
      clearInterval(interval);
    };
  }, [battleId, dateCycle, user]);

  if (!c) return null;

  const controlKey = `${countryId}:${countryName}:${year}:${stageKey}:${battleId}:${contestantId}`;
  const controls = controlState[controlKey] || { voting: "active", rating: "active" };
  const ratingStopped = controls.rating === "stopped";

  // Filter contestant media items matching the current stage position tag (e.g. TOP 16)
  const stageTag = STAGE_TAGS[stageKey];
  const stageMedia = useMemo(() => {
    let list: any[] = [];
    try {
      const rawMedia = window.localStorage.getItem(`reevibes:top16:media:${contestantId}`);
      if (rawMedia) {
        list = JSON.parse(rawMedia);
      }
    } catch (e) {
      console.error(e);
    }

    // Fallback: If no custom media tags configured, portrait gets TOP 16 by default
    if (list.length === 0 && stageKey === "TOP_16") {
      list = [
        {
          id: `${contestantId}-m-portrait`,
          image: c.photos?.portrait || "",
          positions: ["TOP 16"],
        }
      ];
    }

    return list.filter((m: any) => m.positions && m.positions.includes(stageTag));
  }, [contestantId, stageKey, c]);

  // Helper functions for Favorites
  const isFavorite = (mediaId: string) => {
    const uId = user ? user.id : "guest";
    return favorites.some(f => f.mediaId === mediaId && f.userId === uId);
  };

  const toggleFavorite = (mediaId: string) => {
    const uId = user ? user.id : "guest";
    let next: FavoriteRecord[] = [];
    if (isFavorite(mediaId)) {
      next = favorites.filter(f => !(f.mediaId === mediaId && f.userId === uId));
    } else {
      next = [
        ...favorites,
        {
          userId: uId,
          mediaId,
          contestantId,
          countryId,
          stageKey
        }
      ];
    }
    setFavorites(next);
    window.localStorage.setItem("reevibes:favorites", JSON.stringify(next));
  };

  // Helper functions for Ratings
  const getRatingValue = (mediaId: string) => {
    const uId = user ? user.id : "guest";
    const record = ratings.find(r => r.mediaId === mediaId && r.userId === uId);
    return record ? record.ratingValue : 0;
  };

  const handleRatingChange = (mediaId: string, value: number) => {
    if (ratingStopped) return;
    const uId = user ? user.id : "guest";
    const dateStr = new Date().toISOString();
    let next: RatingRecord[] = [];
    const exists = ratings.some(r => r.mediaId === mediaId && r.userId === uId);

    if (exists) {
      if (value === 0) {
        // Remove rating
        next = ratings.filter(r => !(r.mediaId === mediaId && r.userId === uId));
      } else {
        // Update rating
        next = ratings.map(r => 
          (r.mediaId === mediaId && r.userId === uId)
            ? { ...r, ratingValue: value, updatedDate: dateStr }
            : r
        );
      }
    } else {
      if (value > 0) {
        // Add rating
        next = [
          ...ratings,
          {
            mediaId,
            contestantId,
            countryId,
            stageKey,
            userId: uId,
            ratingValue: value,
            createdDate: dateStr,
            updatedDate: dateStr
          }
        ];
      } else {
        next = [...ratings];
      }
    }
    setRatings(next);
    window.localStorage.setItem("reevibes:ratings", JSON.stringify(next));
  };

  const handleVoteInModal = (cId: string) => {
    if (controls.voting === "stopped") {
      alert("Voting has been stopped by admin.");
      return;
    }
    if (!user) {
      window.location.href = "/login";
      return;
    }
    onRequestVoteConfirm(cId, c.fullName, battleId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-background border border-border-subtle w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh] text-foreground">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface/50">
          <div>
            <span className="editorial-label text-accent">{STAGE_LABELS[stageKey]} Stage · Profile</span>
            <h3 className="font-serif text-2xl mt-0.5">{c.fullName}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded border border-transparent hover:border-border-subtle transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left featured image & voting panel */}
            <div className="md:col-span-5 space-y-4">
              <div className="aspect-[3/4] border border-border-subtle bg-surface overflow-hidden rounded relative">
                <img src={stageMedia[0]?.image || c.photos?.portrait || ""} alt={c.fullName} className="w-full h-full object-cover" />
              </div>

              {/* Vote Option inside Modal */}
              <div className="border border-border-subtle bg-surface/30 p-4 rounded text-center">
                <div className="editorial-label text-muted-foreground/60 mb-2 font-mono uppercase tracking-wider text-[10px]">Cast Your Vote</div>
                {controls.voting === "stopped" ? (
                  <div 
                    className="relative border border-red-500/30 bg-red-950/20 px-3.5 py-2 rounded text-center overflow-hidden select-none"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, rgba(220,38,38,0.15), rgba(220,38,38,0.15) 5px, rgba(0,0,0,0.5) 5px, rgba(0,0,0,0.5) 10px)"
                    }}
                  >
                    <div className="flex items-center justify-center gap-1.5 text-rose-400 font-mono text-[9px] uppercase tracking-wider font-bold">
                      <Lock className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
                      Voting Stopped
                    </div>
                    <div className="text-[10px] text-zinc-400 font-sans mt-0.5 leading-tight">Voting stopped by admin.</div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVoteInModal(c.contestantId)}
                    disabled={!!votedForThisBattle}
                    className={`w-full py-2.5 font-mono uppercase tracking-wider text-xs rounded transition-colors flex items-center justify-center gap-2 ${
                      votedForThisBattle === c.contestantId
                        ? "bg-accent text-white"
                        : votedForThisBattle
                        ? "border border-border-subtle text-muted-foreground/50 cursor-not-allowed"
                        : "border border-border text-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${votedForThisBattle === c.contestantId ? "fill-current" : ""}`} />
                    {votedForThisBattle === c.contestantId ? "Already Voted" : "Cast Vote"}
                  </button>
                )}
              </div>
            </div>

            {/* Profile specifications */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <h4 className="editorial-label text-accent border-b border-border-subtle pb-1 flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Personal Metrics
                </h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm font-mono text-muted-foreground">
                  <div><span className="text-muted-foreground/60 uppercase text-[10px]">Age:</span> {c.age} years</div>
                  <div><span className="text-muted-foreground/60 uppercase text-[10px]">Height:</span> {c.height || "—"}</div>
                  <div><span className="text-muted-foreground/60 uppercase text-[10px]">Hair Color:</span> {c.hairColour || "—"}</div>
                  <div><span className="text-muted-foreground/60 uppercase text-[10px]">Eye Color:</span> {c.eyeColour || "—"}</div>
                  <div><span className="text-muted-foreground/60 uppercase text-[10px]">Bust-Waist-Hips:</span> {c.bust ? `${c.bust}-${c.waist}-${c.hips}` : ""}</div>
                  <div><span className="text-muted-foreground/60 uppercase text-[10px]">Birth Date:</span> {c.dob || "—"}</div>
                </div>
              </div>

              <div>
                <h4 className="editorial-label text-accent border-b border-border-subtle pb-1 flex items-center gap-1.5">
                  <Radio className="w-4 h-4" /> Representation
                </h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm font-mono text-muted-foreground">
                  <div><span className="text-muted-foreground/60 uppercase text-[10px]">Channel Country:</span> {c.country}</div>
                  <div><span className="text-muted-foreground/60 uppercase text-[10px]">City:</span> {c.city || "—"}</div>
                </div>
              </div>

              {c.biography && (
                <div>
                  <h4 className="editorial-label text-accent border-b border-border-subtle pb-1">Biography</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-serif italic">{c.biography}</p>
                </div>
              )}
            </div>
          </div>

          {/* Photo gallery with love & rating */}
          <div className="space-y-6 pt-6 border-t border-border-subtle">
            <h4 className="editorial-label text-accent flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-accent text-accent animate-pulse" /> Stage Campaign Gallery ({stageMedia.length})
            </h4>

            <div className="grid sm:grid-cols-2 gap-6">
              {stageMedia.map((m: any) => {
                const isFav = isFavorite(m.id);
                const currentRating = getRatingValue(m.id);
                return (
                  <div key={m.id} className="border border-border-subtle bg-surface/30 p-4 rounded space-y-3">
                    <div className="relative aspect-[3/4] border border-border-subtle/50 overflow-hidden bg-surface rounded">
                      <img src={m.image} alt={m.caption || "Contestant photo"} className="w-full h-full object-cover" />
                      
                      {/* Love icon toggle */}
                      <button
                        onClick={() => toggleFavorite(m.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                          isFav ? "bg-accent text-white" : "bg-black/60 text-zinc-300 hover:text-accent"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {m.caption && <p className="text-xs text-muted-foreground truncate">{m.caption}</p>}

                    {/* 5-Star rating bar */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-subtle/60">
                      {ratingStopped ? (
                        <span className="text-[10px] text-rose-400 uppercase tracking-widest font-mono font-semibold">
                          Rating stopped by admin.
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono">Rate Photo</span>
                      )}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleRatingChange(m.id, currentRating === val ? 0 : val)}
                            disabled={ratingStopped}
                            className={`p-1 transition-transform ${ratingStopped ? "cursor-not-allowed opacity-40" : "hover:scale-110"}`}
                          >
                            <Star className={`w-4 h-4 ${
                              val <= currentRating ? "fill-accent text-accent" : "text-muted-foreground/30 hover:text-muted-foreground/60"
                            }`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              {stageMedia.length === 0 && (
                <div className="col-span-full border border-dashed border-border-subtle py-12 text-center text-xs text-muted-foreground/60 rounded font-mono">
                  No published campaign media tags found for this stage.
                </div>
              )}
            </div>
          </div>

          {/* Videos segment with 5-star rating */}
          {c.videos && (c.videos.intro || (Array.isArray(c.videos.additional) && c.videos.additional.length > 0)) && (
            <div className="space-y-6 pt-6 border-t border-border-subtle">
              <h4 className="editorial-label text-accent flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-accent" /> Stage Video Portfolios
              </h4>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { id: `${contestantId}-v-intro`, url: c.videos.intro, title: "Introduction Reel" },
                  ...(Array.isArray(c.videos.additional) ? c.videos.additional.map((url: string, i: number) => ({
                    id: `${contestantId}-v-add-${i}`,
                    url,
                    title: `Additional Reel ${i + 1}`
                  })) : [])
                ].filter(v => !!v.url).map((v) => {
                  const currentRating = getRatingValue(v.id);
                  return (
                    <div key={v.id} className="border border-border-subtle bg-surface/30 p-4 rounded space-y-3">
                      <div className="relative aspect-video bg-muted rounded overflow-hidden flex items-center justify-center border border-border-subtle">
                        <span className="text-muted-foreground/60 text-xs font-mono">{v.title}</span>
                      </div>
                      <h5 className="font-serif text-sm font-semibold">{v.title}</h5>

                      {/* 5-Star rating bar */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-subtle/60">
                        {ratingStopped ? (
                          <span className="text-[10px] text-rose-400 uppercase tracking-widest font-mono font-semibold">
                            Rating stopped by admin.
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono">Rate Video</span>
                        )}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleRatingChange(v.id, currentRating === val ? 0 : val)}
                              disabled={ratingStopped}
                              className={`p-1 transition-transform ${ratingStopped ? "cursor-not-allowed opacity-40" : "hover:scale-110"}`}
                            >
                              <Star className={`w-4 h-4 ${
                                val <= currentRating ? "fill-accent text-accent" : "text-muted-foreground/30 hover:text-muted-foreground/60"
                              }`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * UTILITY ICON HELPERS
 * ============================================================ */
function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14m-7-7 7 7-7 7"/></svg>;
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>;
}


