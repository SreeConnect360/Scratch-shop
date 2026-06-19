import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus, Search, Filter, MapPin, Users as UsersIcon,
  ChevronRight, Sparkles, AlertTriangle, RotateCcw, Trash2,
  Star, Image as ImageIcon, X, Globe, Clock,
} from "lucide-react";
import { AdminLayout, AdminCard, AdminButton, StatusChip } from "@/components/layout/AdminLayout";
import { useAppStore } from "@/lib/portal-state";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/admin/open-contest")({
  head: () => ({ meta: [{ title: "Open Contest — Admin" }] }),
  component: OpenContestPage,
});

/* ============================================================
 * Types & Mock Data
 * ============================================================ */
type Stage = "Application" | "Agency" | "Ratings" | "Casting" | "Judgement" | "Live" | "Winner";
type ContestStatus = "Draft" | "Open" | "Agency" | "Ratings" | "Casting" | "Judgement" | "Live" | "Closed" | "Deleted";
type Scope = "Global" | "Country";

type StageWindow = { stage: Stage; start: string; end: string };
type Contest = {
  id: string;
  scope: Scope;
  country: string;
  year: number;
  month: number; // 1-12, edition month
  logo?: string;
  logoBlack?: string;
  logoWhite?: string;
  currentStage: Stage;
  status: ContestStatus;
  contestants: number;
  updated: string;
  timeline: StageWindow[];
  castingVenue?: string;
  featured: boolean;
  voting: boolean;
  publicVisible: boolean;
  deleted?: boolean;
};

const STAGES: Stage[] = ["Application", "Agency", "Ratings", "Casting", "Judgement"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const seed = (offsetDays = 0): StageWindow[] => {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const out: StageWindow[] = [];
  let cursor = new Date(today.getTime() + offsetDays * 86400000);
  const spans = [10, 7, 7, 10, 7, 14, 1];
  STAGES.forEach((s, i) => {
    const start = new Date(cursor);
    const end = new Date(cursor.getTime() + spans[i] * 86400000);
    out.push({ stage: s, start: fmt(start), end: fmt(end) });
    cursor = new Date(end.getTime() + 86400000);
  });
  return out;
};

const INITIAL_CONTESTS: Contest[] = [
  { id: "ct1", scope: "Global", country: "Global", year: 2025, month: 3, currentStage: "Casting", status: "Casting", contestants: 248, updated: "2h ago", timeline: seed(-20), featured: true, voting: true, publicVisible: true },
  { id: "ct2", scope: "Country", country: "Maharashtra", year: 2025, month: 4, currentStage: "Judgement", status: "Judgement", contestants: 64, updated: "1d ago", timeline: seed(-40), featured: false, voting: true, publicVisible: true },
  { id: "ct3", scope: "Country", country: "Karnataka", year: 2025, month: 5, currentStage: "Live", status: "Live", contestants: 32, updated: "12 min ago", timeline: seed(-55), featured: true, voting: true, publicVisible: true },
  { id: "ct4", scope: "Country", country: "Delhi", year: 2025, month: 6, currentStage: "Application", status: "Open", contestants: 412, updated: "5h ago", timeline: seed(2), featured: false, voting: false, publicVisible: true },
  { id: "ct5", scope: "Country", country: "Tamil Nadu", year: 2024, month: 11, currentStage: "Winner", status: "Closed", contestants: 184, updated: "3 mo ago", timeline: seed(-180), featured: false, voting: false, publicVisible: true },
  { id: "ct6", scope: "Country", country: "Telangana", year: 2024, month: 9, currentStage: "Ratings", status: "Deleted", contestants: 96, updated: "2 mo ago", timeline: seed(-90), featured: false, voting: false, publicVisible: false, deleted: true },
];

const stageStatusMap: Record<Stage, ContestStatus> = {
  Application: "Open", Agency: "Agency", Ratings: "Ratings",
  Casting: "Casting", Judgement: "Judgement", Live: "Live", Winner: "Closed",
};

const statusTone = (s: ContestStatus): "neutral" | "accent" | "success" | "warn" | "danger" => {
  if (s === "Live") return "accent";
  if (s === "Closed") return "success";
  if (s === "Deleted") return "danger";
  if (s === "Draft") return "warn";
  if (s === "Judgement" || s === "Casting") return "warn";
  return "neutral";
};

const contestTitle = (c: Contest) =>
  `${c.scope === "Global" ? "Global" : c.country} · ${c.year}`;

const stagePurpose = (s: Stage): string => ({
  Application: "Public applications open",
  Agency: "Internal agency review",
  Ratings: "Internal scoring",
  Casting: "Shortlist review & interview",
  Judgement: "Judge evaluation",
  Live: "Public voting battle",
  Winner: "Contest closure & announcement",
}[s]);

/* ============================================================
 * Page
 * ============================================================ */
function OpenContestPage() {
  const { replaceContests } = useAppStore();
  const [contests, setContests] = useState<Contest[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("opencontest:contests");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading contests from sessionStorage:", e);
        }
      }
    }
    return INITIAL_CONTESTS;
  });
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterYear, setFilterYear] = useState<string>("All");
  const [filterMonth, setFilterMonth] = useState<string>("All");
  const [editing, setEditing] = useState<Contest | null>(null);
  const [creating, setCreating] = useState(false);

  // Sync admin contest list → central store → public portal (apply, live, etc.)
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("opencontest:contests", JSON.stringify(contests));
      window.dispatchEvent(new Event("opencontest:contests:updated"));
    }
    replaceContests(
      contests
        .filter(c => !c.deleted)
        .map(c => ({
          id: c.id,
          country: c.country,
          year: c.year,
          stage: c.currentStage,
          published: c.publicVisible && c.status !== "Draft" && c.status !== "Deleted",
          logo: c.logo,
          logoWhite: c.logoWhite,
          logoBlack: c.logoBlack,
        }))
    );
    // Sync to backend for sponsors country assignment
    fetch("/api/sponsors?action=sync-contests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contests)
    }).catch(err => console.error("Error syncing contests to backend:", err));
  }, [contests, replaceContests]);


  const years = useMemo(() => ["All", ...Array.from(new Set(contests.map(c => String(c.year)))).sort()], [contests]);

  const filtered = contests.filter(c => {
    const title = contestTitle(c).toLowerCase();
    if (query && !title.includes(query.toLowerCase()) && !c.country.toLowerCase().includes(query.toLowerCase())) return false;
    if (filterStatus !== "All" && c.status !== filterStatus) return false;
    if (filterYear !== "All" && String(c.year) !== filterYear) return false;
    if (filterMonth !== "All" && String(c.month) !== filterMonth) return false;
    return true;
  });

  const handleSoftDelete = (id: string) =>
    setContests(prev => prev.map(c => c.id === id ? { ...c, deleted: true, status: "Deleted" } : c));
  const handleRestore = (id: string) =>
    setContests(prev => prev.map(c => c.id === id ? { ...c, deleted: false, status: stageStatusMap[c.currentStage] } : c));

  return (
    <AdminLayout
      eyebrow="Module · Contest Editions"
      title="Open Contest"
      actions={
        <>
          <AdminButton variant="outline">Export Schedule</AdminButton>
          <AdminButton variant="accent" onClick={() => setCreating(true)}>
            <Plus className="w-3.5 h-3.5 inline -mt-0.5 mr-1.5" /> Create Contest
          </AdminButton>
        </>
      }
    >
      {/* FILTERS */}
      <AdminCard className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 flex items-center gap-3 border-b border-foreground/20 pb-2">
            <Search className="w-4 h-4 text-foreground/40" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by state or edition…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect label="Status" value={filterStatus} onChange={setFilterStatus}
              options={["All", "Draft", "Open", "Agency", "Ratings", "Casting", "Judgement", "Closed", "Deleted"]} />
            <FilterSelect label="Year" value={filterYear} onChange={setFilterYear} options={years} />
            <FilterSelect
              label="Month"
              value={filterMonth}
              onChange={setFilterMonth}
              options={["All", ...MONTHS.map((_, i) => String(i + 1))]}
              renderOption={(v) => v === "All" ? "All" : MONTHS[Number(v) - 1]}
            />
            <button className="editorial-label text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-2">
              <Filter className="w-3 h-3" /> More
            </button>
          </div>
        </div>
      </AdminCard>

      {/* CONTEST LIST */}
      <AdminCard className="mb-6 p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div>
            <div className="editorial-label text-muted-foreground">Maison · Roster</div>
            <h3 className="text-xl mt-1" style={{ fontFamily: "var(--font-display, 'Playfair Display'), serif" }}>Contest Operations</h3>
          </div>
          <div className="text-xs text-muted-foreground">{filtered.length} of {contests.length}</div>
        </div>

        <div className="divide-y divide-border-subtle">
          {filtered.length === 0 && (
            <div className="px-6 py-16 text-center text-sm text-muted-foreground">No contests match the current filters.</div>
          )}
          {filtered.map(c => (
            <ContestRow
              key={c.id}
              contest={c}
              onEdit={() => setEditing(c)}
              onDelete={() => handleSoftDelete(c.id)}
              onRestore={() => handleRestore(c.id)}
              onStageTransition={(id, stage) => {
                setContests(prev => prev.map(x => x.id === id ? { ...x, currentStage: stage, status: stageStatusMap[stage] } : x));
              }}
            />
          ))}
        </div>
      </AdminCard>

      {/* CREATE / EDIT */}
      <AnimatePresence>
        {(creating || editing) && (
          <ContestFormModal
            contest={editing}
            onClose={() => { setCreating(false); setEditing(null); }}
            onSave={(c) => {
              setContests(prev => editing ? prev.map(x => x.id === c.id ? c : x) : [c, ...prev]);
              setCreating(false); setEditing(null);
            }}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

/* ============================================================
 * Subcomponents
 * ============================================================ */

function FilterSelect({ label, value, onChange, options, renderOption }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
  renderOption?: (v: string) => string;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="editorial-label text-muted-foreground/70 mr-2">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none bg-transparent border border-foreground/20 hover:border-foreground/40 focus:border-accent transition-colors px-3 py-1.5 pr-7 text-xs cursor-pointer outline-none"
      >
        {options.map(o => <option key={o} value={o} className="bg-background">{renderOption ? renderOption(o) : o}</option>)}
      </select>
      <ChevronRight className="w-3 h-3 absolute right-2 rotate-90 pointer-events-none text-foreground/50" />
    </label>
  );
}

function ContestRowCountdown({ contest, onUpdate }: { contest: Contest; onUpdate: () => void }) {
  const [countdownText, setCountdownText] = useState("");
  const [activeStage, setActiveStage] = useState("");

  useEffect(() => {
    const calculateCountdown = () => {
      try {
        if (contest.status === "Draft" || contest.status === "Deleted" || contest.deleted) {
          setCountdownText("");
          return;
        }

        const timeline = contest.timeline || [];
        // Sort timeline chronologically by start date
        const sortedTimeline = [...timeline].sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime());

        const now = Date.now();
        // Find the active stage: first stage whose end time is in the future
        const currentActive = sortedTimeline.find((t: any) => new Date(t.end).getTime() > now);

        if (!currentActive) {
          setCountdownText("Ended");
          setActiveStage("");
          return;
        }

        setActiveStage(currentActive.stage);

        const endTime = new Date(currentActive.end).getTime();
        const diff = endTime - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdownText(`${days}d ${hours}h ${minutes}m ${seconds}s`);

        // If the dynamically calculated stage is different from contest.currentStage,
        // we trigger an automatic transition!
        if (contest.currentStage !== currentActive.stage) {
          onUpdate();
        }
      } catch (e) {
        console.error(e);
        setCountdownText("");
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [contest, onUpdate]);

  if (!countdownText) return null;

  return (
    <span className="inline-flex items-center gap-1.5 ml-2.5 font-mono text-[10px] text-accent bg-accent/10 px-2 py-0.5 border border-accent/20 rounded-sm">
      <span className="font-sans font-semibold uppercase tracking-wider text-[9px]">{activeStage}:</span>
      <span className="tabular-nums font-semibold">{countdownText}</span>
    </span>
  );
}

function ContestRow({ contest, onEdit, onDelete, onRestore, onStageTransition }: {
  contest: Contest; onEdit: () => void; onDelete: () => void; onRestore: () => void;
  onStageTransition: (id: string, stage: Stage) => void;
}) {
  const completed = contest.timeline.filter(t => new Date(t.end) < new Date()).length;
  const progress = Math.round((completed / STAGES.length) * 100);
  const title = contestTitle(contest);
  const { theme } = useTheme();
  const displayLogo = theme === "dark" 
    ? (contest.logoWhite || contest.logo) 
    : (contest.logoBlack || contest.logo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: contest.deleted ? 0.45 : 1, y: 0 }}
      whileHover={{ backgroundColor: "var(--surface-2)" }}
      transition={{ duration: 0.3 }}
      className="group px-6 py-5 grid grid-cols-12 items-center gap-4 cursor-default"
    >
      <div className="col-span-12 md:col-span-5">
        <div className="flex items-center gap-3">
          <img 
            src={`/api/flags?country=${encodeURIComponent(contest.country)}`} 
            alt={contest.country} 
            className="w-10 h-10 object-contain"
          />
          <div>
            <div className="text-sm leading-tight flex items-center flex-wrap gap-2">
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-base">{title}</span>
              {contest.status === "Draft" ? (
                <span className="editorial-label text-[9px] tracking-[0.18em] uppercase border border-accent/50 text-accent px-1.5 py-0.5 leading-none">
                  Draft
                </span>
              ) : (
                <ContestRowCountdown
                  contest={contest}
                  onUpdate={() => {
                    const timeline = contest.timeline || [];
                    const sortedTimeline = [...timeline].sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime());
                    const now = Date.now();
                    const currentActive = sortedTimeline.find((t: any) => new Date(t.end).getTime() > now);
                    if (currentActive && contest.currentStage !== currentActive.stage) {
                      onStageTransition(contest.id, currentActive.stage);
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block col-span-2">
        <div className="editorial-label text-muted-foreground/70 mb-1">Stage</div>
        <div className="text-xs">{contest.currentStage}</div>
      </div>

      <div className="hidden md:block col-span-3">
        <StatusChip status={contest.status} tone={statusTone(contest.status)} />
        <div className="mt-2 h-px bg-surface-3 relative overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-accent"
          />
        </div>
      </div>

      <div className="hidden md:block col-span-1 text-xs text-muted-foreground">{contest.updated}</div>

      <div className="col-span-12 md:col-span-1 flex md:justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 hover:text-accent text-foreground/60" title="Edit">
          <Sparkles className="w-3.5 h-3.5" />
        </button>
        {contest.deleted ? (
          <button onClick={onRestore} className="p-1.5 hover:text-accent text-foreground/60" title="Restore">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button onClick={onDelete} className="p-1.5 hover:text-accent text-foreground/60" title="Soft Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ===== Country Search Select Component ===== */
function CountrySearchSelect({
  value,
  onChange,
  disabled,
  countries
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  countries: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return countries;
    return countries.filter(c => c.toLowerCase().includes(search.toLowerCase()));
  }, [countries, search]);

  if (disabled) {
    return (
      <div className="w-full border-b border-foreground/15 py-2 text-sm text-foreground/40 font-mono">
        Global
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border-b border-foreground/25 py-2 text-sm outline-none focus:border-accent cursor-pointer flex justify-between items-center bg-transparent select-none"
      >
        <span className="text-foreground">{value || "Select State..."}</span>
        <span className="text-[10px] text-muted-foreground/60 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 z-[100] max-h-64 overflow-y-auto bg-background/95 backdrop-blur-md border border-border-subtle shadow-2xl p-2 space-y-2 rounded">
          <div className="flex items-center gap-2 border-b border-border-subtle/50 pb-1.5 mb-1">
            <Search className="w-3.5 h-3.5 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search state..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground/45"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="p-3 text-xs text-muted-foreground text-center">No states found</div>
            ) : (
              filtered.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-all duration-150 rounded ${
                    value === c 
                      ? "text-accent font-semibold bg-accent/10 border-l-2 border-accent" 
                      : "text-foreground/80 hover:bg-foreground/5"
                  }`}
                >
                  {c}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Custom DateTimePicker Component ===== */
const formatDisplayDateTime = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const toIsoString = (d: Date) => {
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function DateTimePicker({
  value,
  onChange,
  label
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const date = useMemo(() => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [value]);

  const [currentYear, setCurrentYear] = useState(date.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());

  useEffect(() => {
    setInputValue(formatDisplayDateTime(value));
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
    }
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayIndex = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);

  const handleDaySelect = (day: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(currentYear);
    newDate.setMonth(currentMonth);
    newDate.setDate(day);
    onChange(toIsoString(newDate));
  };

  const handleTimeChange = (type: "hours" | "minutes", val: number) => {
    const newDate = new Date(date);
    if (type === "hours") {
      newDate.setHours(val);
    } else {
      newDate.setMinutes(val);
    }
    onChange(toIsoString(newDate));
  };

  const changeMonth = (offset: number) => {
    let nextMonth = currentMonth + offset;
    let nextYear = currentYear;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };

  const parseDisplayDateTime = (str: string): Date | null => {
    const match = str.trim().match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, day, month, year, hours, minutes] = match;
    const d = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
    return isNaN(d.getTime()) ? null : d;
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    const parsed = parseDisplayDateTime(val);
    if (parsed) {
      onChange(toIsoString(parsed));
    }
  };

  const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const yearsRange = useMemo(() => {
    const startYear = new Date().getFullYear() - 10;
    return Array.from({ length: 26 }, (_, i) => startYear + i);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="w-full border-b border-foreground/25 py-1.5 flex justify-between items-center bg-transparent group">
        <input
          type="text"
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="dd-mm-yyyy hh:mm"
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/45"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:text-accent text-muted-foreground/60 transition-colors"
        >
          <Clock className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 p-4 bg-background/95 backdrop-blur-md border border-border-subtle shadow-2xl rounded w-72 flex flex-col gap-3">
          <div className="flex justify-between items-center pb-2 border-b border-border-subtle/50">
            <button 
              type="button" 
              onClick={() => changeMonth(-1)}
              className="text-xs hover:text-accent font-semibold p-1 text-foreground"
            >
              ◀
            </button>
            <div className="flex gap-1.5 items-center">
              <select
                value={currentMonth}
                onChange={e => setCurrentMonth(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-foreground outline-none border-b border-transparent focus:border-accent cursor-pointer"
              >
                {MONTH_NAMES.map((m, i) => (
                  <option key={m} value={i} className="bg-background">
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={currentYear}
                onChange={e => setCurrentYear(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-foreground outline-none border-b border-transparent focus:border-accent cursor-pointer"
              >
                {yearsRange.map(y => (
                  <option key={y} value={y} className="bg-background">
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button 
              type="button" 
              onClick={() => changeMonth(1)}
              className="text-xs hover:text-accent font-semibold p-1 text-foreground"
            >
              ▶
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground font-semibold">
            {WEEK_DAYS.map(d => <span key={d}>{d}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = date.getDate() === day && 
                                 date.getMonth() === currentMonth && 
                                 date.getFullYear() === currentYear;
              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleDaySelect(day)}
                  className={`w-7 h-7 flex items-center justify-center rounded transition-all ${
                    isSelected 
                      ? "bg-accent text-accent-foreground font-semibold" 
                      : "text-foreground/80 hover:bg-foreground/5"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="border-t border-border-subtle/50 pt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Time:</span>
            </div>
            <div className="flex items-center gap-1">
              <select
                value={date.getHours()}
                onChange={e => handleTimeChange("hours", Number(e.target.value))}
                className="bg-surface-2 border border-border-subtle/80 rounded px-1.5 py-1 text-xs text-foreground outline-none focus:border-accent"
              >
                {Array.from({ length: 24 }).map((_, h) => (
                  <option key={h} value={h} className="bg-background">
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="text-foreground">{":"}</span>
              <select
                value={date.getMinutes()}
                onChange={e => handleTimeChange("minutes", Number(e.target.value))}
                className="bg-surface-2 border border-border-subtle/80 rounded px-1.5 py-1 text-xs text-foreground outline-none focus:border-accent"
              >
                {Array.from({ length: 60 }).map((_, m) => (
                  <option key={m} value={m} className="bg-background">
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Contest Form Modal (fullscreen blur) ===== */
const DEFAULT_COUNTRIES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Puducherry", "Chandigarh"
];

function ContestFormModal({ contest, onClose, onSave }: {
  contest: Contest | null; onClose: () => void; onSave: (c: Contest) => void;
}) {
  const { theme } = useTheme();
  const [countries, setCountries] = useState<string[]>(DEFAULT_COUNTRIES);
  const [form, setForm] = useState<Contest>(contest ?? {
    id: `ct-${Date.now()}`, scope: "Global", country: "Global",
    year: new Date().getFullYear(), month: new Date().getMonth() + 1,
    currentStage: "Application", status: "Open", contestants: 0, updated: "just now",
    timeline: seed(0), featured: false, voting: false, publicVisible: true,
  });
  
  useEffect(() => {
    fetch("/api/countries-logos")
      .then(res => res.json())
      .then(data => {
        if (data && data.countries) {
          setCountries(data.countries);
        }
      })
      .catch(err => console.error("Error loading dynamic country list:", err));
  }, []);

  const set = <K extends keyof Contest>(k: K, v: Contest[K]) => setForm(p => ({ ...p, [k]: v }));

  const handleCountryChange = async (countryName: string) => {
    set("country", countryName);
    if (form.scope === "Country" && countryName) {
      try {
        const response = await fetch(`/api/countries-logos?country=${encodeURIComponent(countryName)}`);
        const data = await response.json();
        if (data && !data.error) {
          setForm(p => ({
            ...p,
            country: countryName,
            logoWhite: data.whiteLogo || undefined,
            logoBlack: data.blackLogo || undefined,
            logo: (theme === "dark" ? data.whiteLogo : data.blackLogo) || data.whiteLogo || data.blackLogo || undefined
          }));
        }
      } catch (err) {
        console.error("Error auto-loading country logos:", err);
      }
    }
  };

  const handleLogo = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setForm(p => ({
        ...p,
        logo: result,
        logoWhite: undefined, // Clear auto-loaded theme logos on manual upload
        logoBlack: undefined
      }));
    };
    reader.readAsDataURL(file);
  };

  const title = contestTitle(form);
  const displayLogo = theme === "dark" 
    ? (form.logoWhite || form.logo) 
    : (form.logoBlack || form.logo);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/70 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.97, opacity: 0, y: 12 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full h-full max-w-6xl max-h-[95vh] bg-background border border-border-subtle overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border-subtle">
          <div>
            <div className="editorial-label text-muted-foreground">{contest ? "Edit Contest" : "New Contest"}</div>
            <div className="text-3xl mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:text-accent border border-border-subtle"><X className="w-4 h-4" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-10 max-w-4xl mx-auto space-y-12">
            {/* Scope */}
            <Section title="Edition Scope">
              <div className="grid grid-cols-2 gap-3">
                {(["Global", "Country"] as Scope[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      set("scope", s);
                      if (s === "Global") set("country", "Global");
                      else if (form.country === "Global") set("country", countries[0] || "Maharashtra");
                    }}
                    className={`p-5 border text-left transition-colors ${
                      form.scope === s ? "border-accent bg-accent/5" : "border-border-subtle hover:border-foreground/40"
                    }`}
                  >
                    <Globe className={`w-4 h-4 mb-2 ${form.scope === s ? "text-accent" : "text-foreground/50"}`} />
                    <div className="text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>{s === "Global" ? "Global" : "State"} Edition</div>
                    <div className="editorial-label text-muted-foreground mt-1">
                      {s === "Global" ? "Worldwide edition" : "Single-state edition (India)"}
                    </div>
                  </button>
                ))}
              </div>
            </Section>

            {/* Country + Year + Month */}
            <Section title="Edition Details">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormField label="State">
                  <CountrySearchSelect
                    value={form.country}
                    onChange={handleCountryChange}
                    disabled={form.scope === "Global"}
                    countries={countries}
                  />
                </FormField>
                <FormField label="Year">
                  <input
                    type="number"
                    value={form.year}
                    onChange={e => set("year", Number(e.target.value))}
                    className="w-full bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent text-sm"
                  />
                </FormField>
                <FormField label="Month">
                  <select
                    value={form.month}
                    onChange={e => set("month", Number(e.target.value))}
                    className="w-full bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent text-sm"
                  >
                    {MONTHS.map((m, i) => <option key={m} value={i + 1} className="bg-background">{m}</option>)}
                  </select>
                </FormField>
              </div>
            </Section>

            {/* Logo Upload */}
            <Section title={form.scope === "Global" ? "Global Edition Logo" : `${form.country} Logo`}>
              <label className="block">
                <div className="border border-dashed border-foreground/20 hover:border-accent transition-colors p-10 text-center cursor-pointer group relative">
                  {(form.logoWhite || form.logoBlack) && (
                    <span className="absolute top-2 right-2 text-[9px] editorial-label border border-accent/35 text-accent px-1.5 py-0.5 rounded-sm">
                      Auto-loaded Logo Folder
                    </span>
                  )}
                  {displayLogo ? (
                    <div className="flex flex-col items-center gap-3">
                      <img src={displayLogo} alt="logo" className="w-32 h-32 object-contain" />
                      <div className="editorial-label text-muted-foreground">Click to replace manually</div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-foreground/40 group-hover:text-accent mx-auto" />
                      <div className="text-sm text-foreground/80 mt-3">Upload {form.scope === "Global" ? "global" : form.country} logo</div>
                      <div className="editorial-label text-muted-foreground/60 mt-1">SVG / PNG · transparent preferred</div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleLogo(e.target.files?.[0] ?? null)}
                  />
                </div>
              </label>
            </Section>

            {/* Contest Lifecycle Timeline */}
            <Section title="Contest Lifecycle Timeline">
              <div className="text-xs text-muted-foreground -mt-3 mb-4">
                Configure start &amp; end dates for every stage of this edition. Casting Call also requires a venue.
              </div>
              <div className="space-y-3">
                {STAGES.map((stage) => {
                  const win = form.timeline.find(t => t.stage === stage) ?? { stage, start: "", end: "" };
                  const updateWin = (patch: Partial<StageWindow>) => {
                    const next = form.timeline.some(t => t.stage === stage)
                      ? form.timeline.map(t => t.stage === stage ? { ...t, ...patch } : t)
                      : [...form.timeline, { ...win, ...patch }];
                    set("timeline", next);
                  };
                  const isWinner = stage === "Winner";
                  const isCasting = stage === "Casting";
                  return (
                    <div key={stage} className="border border-border-subtle p-4 hover:border-foreground/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>{stage} Stage</div>
                          <div className="editorial-label text-muted-foreground/70 mt-0.5">{stagePurpose(stage)}</div>
                        </div>
                        {form.currentStage === stage && (
                          <span className="editorial-label text-accent border border-accent/40 px-2 py-0.5">Current</span>
                        )}
                      </div>
                      <div className={`grid grid-cols-1 ${isCasting ? "md:grid-cols-3" : isWinner ? "md:grid-cols-1" : "md:grid-cols-2"} gap-4`}>
                        <FormField label={isWinner ? "Announcement Date & Time" : "Start Date & Time"}>
                          <DateTimePicker
                            value={win.start}
                            onChange={val => updateWin({ start: val, ...(isWinner ? { end: val } : {}) })}
                            label={isWinner ? "Announcement" : "Start"}
                          />
                        </FormField>
                        {!isWinner && (
                          <FormField label="End Date & Time">
                            <DateTimePicker
                              value={win.end}
                              onChange={val => updateWin({ end: val })}
                              label="End"
                            />
                          </FormField>
                        )}
                        {isCasting && (
                          <FormField label="Venue">
                            <input
                              type="text"
                              value={form.castingVenue ?? ""}
                              onChange={e => set("castingVenue", e.target.value)}
                              placeholder="e.g. Studio Maison, Paris"
                              className="w-full bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent text-sm placeholder:text-muted-foreground/40"
                            />
                          </FormField>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-border-subtle bg-background flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground">
            Edition will be saved as <span className="text-foreground">{title}</span>
            {form.status === "Draft" && <span className="ml-2 text-accent">· Draft</span>}.
          </div>
          <div className="flex gap-2">
            <AdminButton variant="ghost" onClick={onClose}>Cancel</AdminButton>
            <AdminButton
              variant="outline"
              onClick={() => onSave({ ...form, status: "Draft" })}
            >
              Save Draft
            </AdminButton>
            <AdminButton
              variant="accent"
              onClick={() => onSave({ ...form, status: stageStatusMap[form.currentStage] })}
            >
              {contest ? "Save Edition" : "Publish Contest"}
            </AdminButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <div className="editorial-label text-muted-foreground mb-5">{title}</div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="editorial-label text-muted-foreground/70 text-[10px]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

