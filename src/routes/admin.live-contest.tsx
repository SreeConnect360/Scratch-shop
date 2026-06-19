import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, GripVertical, Plus, Trash2, Calendar, Save, Radio,
  Crown, Sparkles, X, Check, ArrowRight, Image as ImageIcon, ExternalLink, Clock,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminLayout, AdminCard, AdminButton, StatusChip } from "@/components/layout/AdminLayout";
import { CONTESTANTS, type Contestant } from "@/lib/data";
import { useAppStore } from "@/lib/portal-state";

export const Route = createFileRoute("/admin/live-contest")({
  head: () => ({ meta: [{ title: "Live Contest — Battle Studio" }] }),
  component: LiveContestAdmin,
});

/* ───────── Types ───────── */
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
  lineup: string[]; // contestant ids — left half then right half (or single winner for WINNER)
  customPhotos: Record<string, string>; // contestantId -> selected photo url for this stage
  sponsors: StageSponsor[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: "draft" | "published";
};

type Country = { id: string; name: string; year: string };

const ALL_COUNTRIES_MAP: Record<string, Country> = {
  global: { id: "global", name: "Global", year: "2026" },
  india: { id: "india", name: "India", year: "2026" },
  usa: { id: "usa", name: "United States", year: "2026" },
  uk: { id: "uk", name: "United Kingdom", year: "2026" },
  france: { id: "france", name: "France", year: "2026" },
  brazil: { id: "brazil", name: "Brazil", year: "2026" },
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

function makeDefaultConfig(slots: number): StageConfig {
  return {
    lineup: Array(slots).fill(""),
    customPhotos: {},
    sponsors: [],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    status: "draft",
  };
}

function makeInitialCountryConfig(): Record<StageKey, StageConfig> {
  return {
    TOP_16: makeDefaultConfig(16),
    TOP_8: makeDefaultConfig(8),
    TOP_4: makeDefaultConfig(4),
    FINALS: makeDefaultConfig(2),
    WINNER: makeDefaultConfig(1),
  };
}

/* ============================================================
 * ROOT
 * ============================================================ */
function LiveContestAdmin() {
  const { state } = useAppStore();
  const [countryId, setCountryId] = useState<string | null>(null);

  // Load published countries from Top 16 Dashboard published lineup
  const [publishedIds, setPublishedIds] = useState<string[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("reevibes:published-lineups");
        if (raw) setPublishedIds(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }

      const handleStorage = (e: StorageEvent) => {
        if (e.key === "reevibes:published-lineups") {
          try {
            const raw = window.localStorage.getItem("reevibes:published-lineups");
            if (raw) setPublishedIds(JSON.parse(raw));
          } catch {}
        }
        if (e.key === "reevibes:live-contest:by-country") {
          try {
            const raw = window.localStorage.getItem("reevibes:live-contest:by-country");
            if (raw) setByCountry(JSON.parse(raw));
          } catch {}
        }
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, []);

  const countries = useMemo<Country[]>(() => {
    try {
      const rawMeta = window.localStorage.getItem("reevibes:published-countries-meta");
      const meta = rawMeta ? JSON.parse(rawMeta) : {};
      return publishedIds.map(id => {
        return meta[id] || ALL_COUNTRIES_MAP[id] || { id, name: id.charAt(0).toUpperCase() + id.slice(1), year: "2026" };
      });
    } catch {
      return [];
    }
  }, [publishedIds]);

  const [byCountry, setByCountry] = useState<Record<string, Record<StageKey, StageConfig>>>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("reevibes:live-contest:by-country");
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  const saveToLocalStorage = (next: Record<string, Record<StageKey, StageConfig>>) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("reevibes:live-contest:by-country", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleStageConfigChange = (cId: string, stage: StageKey, cfg: StageConfig) => {
    setByCountry(prev => {
      const countryConfig = prev[cId] || makeInitialCountryConfig();
      const updated = {
        ...prev,
        [cId]: {
          ...countryConfig,
          [stage]: cfg
        }
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const country = countries.find(c => c.id === countryId) || null;
  const currentCountryConfig = country ? (byCountry[country.id] || makeInitialCountryConfig()) : null;

  return (
    <AdminLayout
      eyebrow="Module · Live Contest Studio"
      title={country ? `${country.name} ${country.year}` : "Live Contest"}
      actions={
        country ? (
          <AdminButton variant="outline" onClick={() => setCountryId(null)}>
            <ChevronLeft className="w-3.5 h-3.5 inline mr-2" />All Countries
          </AdminButton>
        ) : null
      }
    >
      {!country ? (
        <CountrySelector countries={countries} onPick={setCountryId} />
      ) : (
        <CountryStudio
          country={country}
          data={currentCountryConfig!}
          onChange={(stage, cfg) => handleStageConfigChange(country.id, stage, cfg)}
        />
      )}
    </AdminLayout>
  );
}

/* ============================================================
 * COUNTRY SELECTOR
 * ============================================================ */
function CountrySelector({ countries, onPick }: { countries: Country[]; onPick: (id: string) => void }) {
  if (countries.length === 0) {
    return (
      <div className="border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto my-8">
        <Radio className="w-8 h-8 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-serif text-xl mb-2">No Published Lineups</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          To configure the Live Contest, you must first publish a lineup for a country in the Top 16 Dashboard.
        </p>
        <a href="/admin/top-16">
          <AdminButton variant="accent">Go to Top 16 Dashboard</AdminButton>
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="editorial-label text-muted-foreground mb-6">Published Live Countries · Season 2026</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map(c => (
          <button
            key={c.id}
            onClick={() => onPick(c.id)}
            className="group text-left border border-border-subtle hover:border-accent transition-all duration-300 p-8 bg-surface flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="editorial-label text-muted-foreground">Live · {c.year}</div>
              <div className="h-16 flex items-center justify-center my-4">
                <CountryLogo countryName={c.name} className="max-h-12 w-auto max-w-[80%] object-contain" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border-subtle/30 flex items-center justify-between text-xs text-accent">
              <span className="flex items-center gap-2">
                <Radio className="w-3 h-3 animate-pulse" /> Enter Studio
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * COUNTRY STUDIO
 * ============================================================ */
function CountryStudio({
  country, data, onChange,
}: {
  country: Country;
  data: Record<StageKey, StageConfig>;
  onChange: (stage: StageKey, cfg: StageConfig) => void;
}) {
  const { state } = useAppStore();
  const [stage, setStage] = useState<StageKey>("TOP_16");
  const cfg = data[stage] || makeDefaultConfig(STAGES.find(s => s.key === stage)!.slots);

  // Load published contestants for the country
  const publishedContestants = useMemo(() => {
    const selectedYear = 2026;
    const proceededApps = state.applications.filter((a: any) => {
      const matchCountryName = (aName: string, bName: string) => {
        const norm = (s: string) => {
          let low = s.toLowerCase().trim();
          if (low === "uk") return "united kingdom";
          if (low === "usa") return "united states";
          return low;
        };
        return norm(aName) === norm(bName);
      };
      const matchCountry = matchCountryName(a.country || a.contestCountry || "", country.name) || matchCountryName(a.country || a.contestCountry || "", country.id);
      const inTop16 = state.positions[a.contestantId] === "Top16";
      const matchYear = a.contestYear === selectedYear;
      return matchCountry && inTop16 && matchYear;
    });

    let savedStatuses: Record<string, string> = {};
    try {
      const raw = window.localStorage.getItem("reevibes:top16:statuses");
      if (raw) savedStatuses = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }

    return proceededApps.map((app: any, idx: number) => {
      const status = savedStatuses[app.contestantId] || (idx < 16 ? "Enabled" : "Reserve");
      
      // Load photo tagged items
      let mediaItems: any[] = [];
      try {
        const rawMedia = window.localStorage.getItem(`reevibes:top16:media:${app.contestantId}`);
        if (rawMedia) mediaItems = JSON.parse(rawMedia);
      } catch (e) {
        console.error(e);
      }

      return {
        id: app.contestantId,
        name: app.fullName,
        image: app.photos?.portrait || app.photos?.fullBody || "",
        country: app.country,
        status,
        media: mediaItems
      };
    }).filter(c => c.status === "Enabled");
  }, [state, country]);

  return (
    <div className="space-y-10">
      {/* Stage Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle overflow-x-auto">
        {STAGES.map(s => {
          const active = s.key === stage;
          const published = data[s.key]?.status === "published";
          return (
            <button
              key={s.key}
              onClick={() => setStage(s.key)}
              className={`relative px-5 py-3 editorial-label transition-colors shrink-0 ${
                active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                {s.label}
                {published && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
              </span>
              {active && <motion.span layoutId="live-stage-tab-indicator" className="absolute -bottom-px left-0 right-0 h-0.5 bg-accent" />}
            </button>
          );
        })}
      </div>

      <StageStudio
        country={country}
        stageKey={stage}
        cfg={cfg}
        contestants={publishedContestants}
        onChange={(next) => onChange(stage, next)}
      />
    </div>
  );
}

/* ============================================================
 * STAGE STUDIO
 * ============================================================ */
function StageStudio({
  country, stageKey, cfg, contestants, onChange
}: {
  country: Country;
  stageKey: StageKey;
  cfg: StageConfig;
  contestants: any[];
  onChange: (cfg: StageConfig) => void;
}) {
  const slots = STAGES.find(s => s.key === stageKey)!.slots;
  const [photoPicker, setPhotoPicker] = useState<{ contestantId: string; index: number } | null>(null);
  const [showConfirmPublish, setShowConfirmPublish] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [showDraftSuccess, setShowDraftSuccess] = useState(false);
  const [showAngelsSuccess, setShowAngelsSuccess] = useState(false);
  const [isPostingToAngels, setIsPostingToAngels] = useState(false);

  const handlePostToAngels = async () => {
    const winnerId = cfg.lineup[0];
    if (!winnerId) return;
    const contestant = getContestant(winnerId);
    if (!contestant) return;

    setIsPostingToAngels(true);
    try {
      let logoUrl = "";
      try {
        const logoRes = await fetch(`/api/countries-logos?country=${encodeURIComponent(country.name)}`);
        if (logoRes.ok) {
          const logoData = await logoRes.json();
          logoUrl = logoData.whiteLogo || logoData.blackLogo || "";
        }
      } catch (err) {
        console.error("Error fetching country logo:", err);
      }

      const photoUrl = cfg.customPhotos[winnerId] || contestant.image;
      const res = await fetch("/api/angels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryId: country.id,
          countryName: country.name,
          year: country.year,
          logoUrl,
          winnerContestantId: winnerId,
          winnerName: contestant.name,
          winnerPhotoUrl: photoUrl,
        }),
      });

      if (res.ok) {
        setShowAngelsSuccess(true);
      } else {
        const errData = await res.json();
        alert(`Error posting to Angels: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error posting to Angels:", err);
      alert("An error occurred while posting to Angels dashboard.");
    } finally {
      setIsPostingToAngels(false);
    }
  };

  const syncPublishedSponsors = async (status: "draft" | "published", sponsorsList: StageSponsor[]) => {
    try {
      await fetch("/api/sponsors?action=save-published-sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishedSectionId: `live-contest-${country.id}-${stageKey}`,
          countryId: country.id,
          countryName: country.name,
          stageName: stageKey,
          selectedSponsorIds: sponsorsList.map(s => s.sponsorId),
          publishStatus: status,
        })
      });
    } catch (err) {
      console.error("Error saving published sponsors mapping:", err);
    }
  };

  // Update contestant in lineup slot
  const setSlot = (index: number, id: string) => {
    const lineup = [...cfg.lineup];
    // Remove previous custom photo mapping if replacing
    const customPhotos = { ...cfg.customPhotos };
    const oldId = lineup[index];
    if (oldId && oldId !== id) {
      delete customPhotos[oldId];
    }
    lineup[index] = id;
    onChange({ ...cfg, lineup, customPhotos });
  };

  // Replace custom photo for stage
  const setContestantPhoto = (contestantId: string, url: string) => {
    onChange({
      ...cfg,
      customPhotos: {
        ...cfg.customPhotos,
        [contestantId]: url
      }
    });
    setPhotoPicker(null);
  };

  // Get options for dropdown: filter out already assigned contestants, except the one in the current slot
  const getDropdownOptions = (currentIndex: number) => {
    const assigned = new Set(cfg.lineup.filter((_, idx) => idx !== currentIndex));
    return contestants.filter(c => !assigned.has(c.id));
  };

  // Find contestant details
  const getContestant = (id: string) => {
    return contestants.find(c => c.id === id) || null;
  };

  // Stage-wise tag representation
  const stageTagMap: Record<StageKey, string> = {
    TOP_16: "TOP 16",
    TOP_8: "TOP 8",
    TOP_4: "TOP 4",
    FINALS: "FINALS",
    WINNER: "WINNER"
  };

  const currentStageTag = stageTagMap[stageKey];

  return (
    <div className="space-y-10">
      {/* VS layout frame bars */}
      {stageKey === "WINNER" ? (
        <section className="bg-surface border border-border-subtle p-8 max-w-xl mx-auto rounded">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-5 h-5 text-accent" />
            <h3 className="font-serif text-2xl">Winner Coronation Selection</h3>
          </div>
          <div className="space-y-4">
            <label className="editorial-label text-muted-foreground block">Select Final Winner</label>
            <ContestantDropdown
              value={cfg.lineup[0] || ""}
              options={getDropdownOptions(0)}
              onChange={(val) => setSlot(0, val)}
            />

            {cfg.lineup[0] && (
              <div className="mt-6 space-y-4">
                <ContestantStageCard
                  contestant={getContestant(cfg.lineup[0])!}
                  stagePhoto={cfg.customPhotos[cfg.lineup[0]]}
                  stageTag={currentStageTag}
                  onChangePhoto={() => setPhotoPicker({ contestantId: cfg.lineup[0], index: 0 })}
                  onClear={() => setSlot(0, "")}
                />

                <div className="pt-2">
                  <AdminButton
                    onClick={handlePostToAngels}
                    disabled={isPostingToAngels}
                    className="w-full justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 border-none"
                  >
                    {isPostingToAngels ? "Posting..." : "Post in Angels"}
                  </AdminButton>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="editorial-label text-accent">Faceoff Grid</div>
              <h3 className="font-serif text-2xl mt-1">{stageKey.replace("_", " ")} Matches</h3>
            </div>
            <StatusChip status={cfg.status === "published" ? "Published" : "Draft"} tone={cfg.status === "published" ? "accent" : "warn"} />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center border border-border-subtle bg-surface p-6 rounded">
            {/* Left side frame bars */}
            <div className="space-y-4">
              <div className="editorial-label text-muted-foreground border-b border-border-subtle/30 pb-2">Left Side</div>
              {Array.from({ length: slots / 2 }).map((_, i) => {
                const cId = cfg.lineup[i];
                const c = getContestant(cId);
                return (
                  <div key={`left-${i}`} className="space-y-2 border border-border-subtle/50 bg-background/50 p-3 rounded">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Frame Bar #{i + 1}</span>
                    </div>
                    <ContestantDropdown
                      value={cId || ""}
                      options={getDropdownOptions(i)}
                      onChange={(val) => setSlot(i, val)}
                    />
                    {c && (
                      <ContestantStageCard
                        contestant={c}
                        stagePhoto={cfg.customPhotos[cId]}
                        stageTag={currentStageTag}
                        onChangePhoto={() => setPhotoPicker({ contestantId: cId, index: i })}
                        onClear={() => setSlot(i, "")}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* VS separator */}
            <div className="flex flex-col items-center justify-center px-4 self-stretch border-r border-l border-border-subtle/30 bg-surface-2/20">
              <div className="font-serif italic text-4xl md:text-5xl text-accent/80 font-bold select-none">vs</div>
            </div>

            {/* Right side frame bars */}
            <div className="space-y-4">
              <div className="editorial-label text-muted-foreground border-b border-border-subtle/30 pb-2 text-right">Right Side</div>
              {Array.from({ length: slots / 2 }).map((_, i) => {
                const idx = slots / 2 + i;
                const cId = cfg.lineup[idx];
                const c = getContestant(cId);
                return (
                  <div key={`right-${i}`} className="space-y-2 border border-border-subtle/50 bg-background/50 p-3 rounded text-right">
                    <div className="flex items-center justify-between text-xs text-muted-foreground flex-row-reverse">
                      <span>Frame Bar #{slots / 2 + i + 1}</span>
                    </div>
                    <ContestantDropdown
                      value={cId || ""}
                      options={getDropdownOptions(idx)}
                      onChange={(val) => setSlot(idx, val)}
                    />
                    {c && (
                      <ContestantStageCard
                        contestant={c}
                        stagePhoto={cfg.customPhotos[cId]}
                        stageTag={currentStageTag}
                        onChangePhoto={() => setPhotoPicker({ contestantId: cId, index: idx })}
                        onClear={() => setSlot(idx, "")}
                        reverse
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Photo selector dialog */}
      <Dialog open={photoPicker !== null} onOpenChange={(open) => !open && setPhotoPicker(null)}>
        {photoPicker && (
          <StagePhotoSelectorModal
            contestant={getContestant(photoPicker.contestantId)!}
            stageTag={currentStageTag}
            currentSelection={cfg.customPhotos[photoPicker.contestantId]}
            onSelect={(url) => setContestantPhoto(photoPicker.contestantId, url)}
            onClose={() => setPhotoPicker(null)}
          />
        )}
      </Dialog>

      {/* Sponsor Management */}
      <SponsorManagementSection cfg={cfg} countryName={country.name} onChange={onChange} />

      {/* Stage Dates Section */}
      <StageDatesSection cfg={cfg} onChange={onChange} />

      {/* Draft and Publish actions */}
      <div className="sticky bottom-0 -mx-6 lg:-mx-10 px-6 lg:px-10 py-4 bg-background/95 backdrop-blur border-t border-border-subtle flex items-center justify-between z-30">
        <div className="text-xs text-muted-foreground">
          Stage Status · <span className="font-semibold uppercase tracking-wider">{cfg.status}</span>
        </div>
        <div className="flex gap-3">
          <AdminButton
            variant="outline"
            onClick={() => {
              const updated = { ...cfg, status: "draft" as const };
              onChange(updated);
              syncPublishedSponsors("draft", updated.sponsors);
              setShowDraftSuccess(true);
            }}
          >
            <Save className="w-3.5 h-3.5 inline mr-2" />Save Draft
          </AdminButton>
          <AdminButton
            variant="accent"
            onClick={() => {
              setShowConfirmPublish(true);
            }}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-2" />Publish Stage
          </AdminButton>
        </div>
      </div>

      {/* Draft Saved Success Popup */}
      {showDraftSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold tracking-tight">Draft Saved</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Stage configuration saved as draft successfully.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDraftSuccess(false)}
                className="bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Publish Stage Popup */}
      {showConfirmPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold tracking-tight">Confirm Publish Stage</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Are you sure you want to publish this stage to live?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmPublish(false)}
                className="border border-border-subtle dark:border-zinc-800 hover:bg-surface text-foreground font-semibold text-sm px-6 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmPublish(false);
                  onChange({ ...cfg, status: "published" });
                  setShowPublishSuccess(true);
                }}
                className="bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md"
              >
                OK / Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage Published Success Popup */}
      {showPublishSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold tracking-tight">Stage Published</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Stage published to User Public Live Contest successfully.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPublishSuccess(false)}
                className="bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Posted to Angels Success Popup */}
      {showAngelsSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold tracking-tight">Posted in Angels</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Winner image has been posted to Angels Dashboard successfully.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAngelsSuccess(false)}
                className="bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * CONTESTANT SELECTOR DROPDOWN
 * ============================================================ */
function ContestantDropdown({
  value, options, onChange
}: {
  value: string;
  options: any[];
  onChange: (val: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-surface border border-border-subtle px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent [color-scheme:dark]"
    >
      <option value="">— Select Contestant —</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name} ({o.country})
        </option>
      ))}
    </select>
  );
}

/* ============================================================
 * CONTESTANT CARD FOR VS FRAME
 * ============================================================ */
function ContestantStageCard({
  contestant, stagePhoto, stageTag, onChangePhoto, onClear, reverse = false
}: {
  contestant: any;
  stagePhoto?: string;
  stageTag: string;
  onChangePhoto: () => void;
  onClear: () => void;
  reverse?: boolean;
}) {
  const photo = stagePhoto || contestant.image;
  return (
    <div className={`flex items-center gap-3 p-2 bg-surface border border-border-subtle/80 ${reverse ? "flex-row-reverse text-right" : ""}`}>
      <div className="relative w-12 h-16 bg-surface-2 overflow-hidden shrink-0 border border-border-subtle/40">
        <img src={photo} alt={contestant.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-sm truncate font-medium">{contestant.name}</h4>
        <p className="text-xs text-muted-foreground">{contestant.country}</p>
        <div className={`flex items-center gap-2 mt-1.5 ${reverse ? "justify-end" : ""}`}>
          <button
            onClick={onChangePhoto}
            className="text-[10px] uppercase tracking-wider text-accent border border-accent/20 px-2 py-0.5 hover:bg-accent/5 transition-colors flex items-center gap-1"
          >
            <ImageIcon className="w-2.5 h-2.5" /> Photo
          </button>
          <button
            onClick={onClear}
            className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border-subtle px-2 py-0.5 hover:text-foreground hover:bg-surface-2 transition-colors flex items-center gap-1"
          >
            <X className="w-2.5 h-2.5" /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * STAGE PHOTO SELECTOR MODAL
 * ============================================================ */
function StagePhotoSelectorModal({
  contestant, stageTag, currentSelection, onSelect, onClose
}: {
  contestant: any;
  stageTag: string;
  currentSelection?: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  // Filter contestant photos that are tagged with the selected stage key
  const filteredPhotos = useMemo(() => {
    if (!contestant || !Array.isArray(contestant.media)) return [];
    return contestant.media.filter((m: any) => m.positions && m.positions.includes(stageTag));
  }, [contestant, stageTag]);

  return (
    <DialogContent className="max-w-2xl bg-background border border-border-subtle [color-scheme:dark]">
      <DialogHeader>
        <DialogTitle className="font-serif text-xl">Select {stageTag} Photo</DialogTitle>
        <p className="text-xs text-muted-foreground">
          Showing only campaign images of <span className="text-foreground font-semibold">{contestant.name}</span> tagged as <span className="text-accent font-semibold">{stageTag}</span>.
        </p>
      </DialogHeader>

      <div className="grid grid-cols-3 gap-3 my-4 max-h-[50vh] overflow-y-auto p-1">
        {filteredPhotos.map((m: any) => {
          const isSelected = currentSelection === m.image || (!currentSelection && contestant.image === m.image);
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.image)}
              className={`relative aspect-[3/4] border overflow-hidden transition-all hover:scale-[1.02] ${
                isSelected ? "border-accent ring-1 ring-accent" : "border-border-subtle hover:border-foreground/50"
              }`}
            >
              <img src={m.image} alt={m.alt || "Campaign frame"} className="w-full h-full object-cover" />
              {isSelected && (
                <div className="absolute top-2 right-2 bg-accent text-white p-1 rounded-full">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
        {filteredPhotos.length === 0 && (
          <div className="col-span-full border border-dashed border-border-subtle p-8 text-center text-sm text-muted-foreground">
            No photos found for <span className="font-semibold">{contestant.name}</span> tagged with <span className="text-accent font-semibold">{stageTag}</span>. Please assign tags in the Top 16 Dashboard first.
          </div>
        )}
      </div>

      <DialogFooter>
        <AdminButton variant="outline" onClick={onClose}>Close</AdminButton>
      </DialogFooter>
    </DialogContent>
  );
}

/* ============================================================
 * SPONSOR MANAGEMENT (STAGE-WISE)
 * ============================================================ */
function SponsorManagementSection({
  cfg, countryName, onChange
}: {
  cfg: StageConfig;
  countryName: string;
  onChange: (cfg: StageConfig) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/sponsors?action=get-sponsors-by-country&country=${encodeURIComponent(countryName)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSponsors(data);
        }
      })
      .catch(err => console.error("Error loading country sponsors:", err));
  }, [countryName]);

  const openPicker = () => {
    setPicked(new Set(cfg.sponsors.map(s => s.sponsorId)));
    setPickerOpen(true);
  };

  const togglePick = (id: string) => {
    setPicked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const confirmPicks = () => {
    const existing = new Map(cfg.sponsors.map(s => [s.sponsorId, s]));
    const next: StageSponsor[] = Array.from(picked).map((spId, idx) => {
      const original = existing.get(spId);
      const sp = sponsors.find(x => x.id === spId);
      return original ?? {
        id: `sp-${spId}-${Date.now()}`,
        sponsorId: spId,
        url: sp?.url || "",
        order: idx + 1
      };
    });
    onChange({ ...cfg, sponsors: next.sort((a, b) => a.order - b.order) });
    setPickerOpen(false);
  };

  const updateSponsor = (id: string, patch: Partial<StageSponsor>) => {
    const next = cfg.sponsors.map(s => s.id === id ? { ...s, ...patch } : s);
    if (patch.order !== undefined) {
      next.sort((a, b) => a.order - b.order);
    }
    onChange({ ...cfg, sponsors: next });
  };

  const removeSponsor = (id: string) => {
    onChange({ ...cfg, sponsors: cfg.sponsors.filter(s => s.id !== id) });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div>
          <div className="editorial-label text-accent">Stage Sponsors</div>
          <h3 className="font-serif text-xl mt-1">Sponsor Management</h3>
        </div>
        <AdminButton variant="outline" onClick={openPicker}>
          <Plus className="w-3.5 h-3.5 inline mr-1.5" /> Add Sponsor
        </AdminButton>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {cfg.sponsors.map((s, i) => {
          const sp = sponsors.find(x => x.id === s.sponsorId);
          return (
            <div
              key={s.id}
              className="border border-border-subtle bg-surface p-4 flex items-center gap-3 rounded"
            >
              <div className="relative overflow-hidden bg-white border border-border-subtle rounded shrink-0" style={{ width: "48px", height: "32px", aspectRatio: "5/3" }}>
                {sp?.logo ? (
                  <img
                    src={sp.logo}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                    style={{
                      transform: `translate(${sp.logoX || 0}%, ${sp.logoY || 0}%) scale(${sp.logoZoom || 1})`,
                      transformOrigin: "center"
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-neutral-400 font-serif font-bold bg-neutral-100 uppercase">
                    {sp?.name ? sp.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("") : "SP"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-serif text-sm truncate font-medium">{sp?.name ?? "Sponsor"}</div>
                  <span className="text-[10px] text-muted-foreground uppercase">{sp?.type ?? "Sponsor"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={s.url}
                    onChange={e => updateSponsor(s.id, { url: e.target.value })}
                    placeholder="https://sponsor.com"
                    className="flex-1 bg-background border border-border-subtle px-2 py-1 text-xs outline-none focus:border-accent rounded [color-scheme:dark]"
                  />
                  <input
                    type="number"
                    value={s.order}
                    onChange={e => updateSponsor(s.id, { order: parseInt(e.target.value) || 0 })}
                    placeholder="Order"
                    title="Order"
                    className="w-16 bg-background border border-border-subtle px-2 py-1 text-xs outline-none focus:border-accent text-center rounded [color-scheme:dark]"
                  />
                </div>
              </div>
              <button
                onClick={() => removeSponsor(s.id)}
                className="text-muted-foreground hover:text-rose-400 p-2 border border-transparent hover:border-border-subtle rounded transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        {cfg.sponsors.length === 0 && (
          <div className="md:col-span-2 border border-dashed border-border-subtle p-6 text-center text-sm text-muted-foreground">
            No sponsors assigned to this stage. Click Add Sponsor to select sponsors.
          </div>
        )}
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-lg bg-background border border-border-subtle [color-scheme:dark]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Select Stage Sponsors</DialogTitle>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-y-auto divide-y divide-border-subtle border border-border-subtle rounded">
            {sponsors.map(sp => {
              const isOn = picked.has(sp.id);
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => togglePick(sp.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 transition ${isOn ? "bg-surface-2/45" : ""}`}
                >
                  <div className={`w-5 h-5 border flex items-center justify-center rounded ${isOn ? "bg-accent border-accent text-white" : "border-border-subtle"}`}>
                    {isOn && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div className="relative overflow-hidden bg-white border border-border-subtle rounded shrink-0" style={{ width: "40px", height: "26px", aspectRatio: "5/3" }}>
                    {sp.logo ? (
                      <img
                        src={sp.logo}
                        alt=""
                        className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                        style={{
                          transform: `translate(${sp.logoX || 0}%, ${sp.logoY || 0}%) scale(${sp.logoZoom || 1})`,
                          transformOrigin: "center"
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[9px] text-neutral-400 font-serif font-bold bg-neutral-100 uppercase">
                        {sp.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-serif text-sm font-medium">{sp.name}</div>
                    <div className="editorial-label text-muted-foreground text-xs">{sp.type}</div>
                  </div>
                </button>
              );
            })}
            {sponsors.length === 0 && (
              <div className="p-6 text-center text-xs text-muted-foreground italic">
                No sponsors assigned to {countryName} or Global in Sponsors Dashboard.
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <AdminButton variant="outline" onClick={() => setPickerOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="accent" onClick={confirmPicks} disabled={sponsors.length === 0}>
              Add Selected ({picked.size})
            </AdminButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ============================================================
 * STAGE DATES SECTION
 * ============================================================ */
function StageDatesSection({
  cfg, onChange
}: {
  cfg: StageConfig;
  onChange: (cfg: StageConfig) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="border-b border-border-subtle pb-3">
        <div className="editorial-label text-accent">Stage Timeline</div>
        <h3 className="font-serif text-xl mt-1">Stage Date & Time Range</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <PremiumDateTimeField
          label="Start Parameters"
          dateValue={cfg.startDate}
          timeValue={cfg.startTime}
          onDateChange={(v) => onChange({ ...cfg, startDate: v })}
          onTimeChange={(v) => onChange({ ...cfg, startTime: v })}
          icon={<Calendar className="w-4 h-4 text-accent" />}
        />

        <PremiumDateTimeField
          label="End Parameters"
          dateValue={cfg.endDate}
          timeValue={cfg.endTime}
          onDateChange={(v) => onChange({ ...cfg, endDate: v })}
          onTimeChange={(v) => onChange({ ...cfg, endTime: v })}
          icon={<Calendar className="w-4 h-4 text-accent" />}
        />
      </div>
    </section>
  );
}

function PremiumDateTimeField({
  label, dateValue, timeValue, onDateChange, onTimeChange, icon
}: {
  label: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  icon: ReactNode;
}) {
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border border-border-subtle bg-surface p-5 rounded space-y-4 hover:border-accent/40 transition-colors">
      <h4 className="editorial-label text-muted-foreground flex items-center gap-2">
        {icon} {label}
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {/* Date picker block */}
        <div 
          onClick={() => {
            dateRef.current?.focus();
            (dateRef.current as any)?.showPicker?.();
          }}
          className="border border-border-subtle bg-surface-2 hover:border-accent/40 transition-colors p-3 flex items-center gap-3 cursor-pointer rounded"
        >
          <Calendar className="w-4 h-4 text-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Select Date</div>
            <input
              ref={dateRef}
              type="date"
              value={dateValue}
              onChange={e => onDateChange(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="bg-transparent outline-none w-full mt-1 text-sm cursor-pointer font-serif [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Time picker block */}
        <div 
          onClick={() => {
            timeRef.current?.focus();
            (timeRef.current as any)?.showPicker?.();
          }}
          className="border border-border-subtle bg-surface-2 hover:border-accent/40 transition-colors p-3 flex items-center gap-3 cursor-pointer rounded"
        >
          <Clock className="w-4 h-4 text-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Select Time</div>
            <input
              ref={timeRef}
              type="time"
              value={timeValue}
              onChange={e => onTimeChange(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="bg-transparent outline-none w-full mt-1 text-sm cursor-pointer font-serif [color-scheme:dark]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
