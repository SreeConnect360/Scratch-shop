import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode, useEffect, useRef, useMemo } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";
import {
  Lock, Search, Filter, Star, ShoppingBag,
  Upload, X, ChevronRight, Play, ChevronLeft,
  Shield, Link as LinkIcon, Globe2, Radio, Users2, Crown,
  Trash2, Plus, GripVertical, Video, CheckCircle,
} from "lucide-react";
import { AdminLayout, AdminCard, AdminButton, StatusChip } from "@/components/layout/AdminLayout";
import { CONTESTANTS, PHOTOGRAPHERS, PRODUCTS, HERO_IMAGES, type Contestant, type ContestantApplication } from "@/lib/data";
import { useAppStore } from "@/lib/portal-state";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/top-16")({
  head: () => ({ meta: [{ title: "Top 16 — Admin" }] }),
  component: Top16Page,
});

/* ============================================================
 * TYPES
 * ============================================================ */
type FinalistStatus = "Enabled" | "Reserve" | "Disabled";
type MediaCompletion = "Submitted" | "Draft" | "Empty";
type PositionTag = "TOP 16" | "TOP 8" | "TOP 4" | "FINALS" | "WINNER" | "BEST PHOTOGRAPHY";

type ShopItem = {
  id: string;
  name: string;
  url: string;
  productId?: string;
};

type MediaItem = {
  id: string;
  image: string;
  caption: string;
  alt: string;
  photographerId?: string;
  positions: PositionTag[];
  sponsorId?: string;
  shopItems: ShopItem[];
  isFeatured: boolean;
};

type VideoItem = {
  id: string;
  url: string;
  title: string;
  duration: string;
};

type Finalist = {
  contestant: Contestant;
  rank: number;
  score: number;
  status: FinalistStatus;
  completion: MediaCompletion;
  media: MediaItem[];
  videos: VideoItem[];
};

type LiveCountry = {
  id: string;
  name: string;
  edition: string;
  banner: string;
  stage: string;
  isLive: boolean;
  finalists: Finalist[];
};function CountryLogo({ countryName, className }: { countryName: string; className?: string }) {
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
      <div className="font-serif text-xl tracking-wider text-foreground select-none opacity-80 uppercase">
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

/* ============================================================
 * MOCK STATE
 * ============================================================ */
const COUNTRY_DEFS: Array<{ id: string; name: string; edition: string; banner: string; stage: string; isLive: boolean }> = [
  { id: "global", name: "Global", edition: "Season 2026", banner: HERO_IMAGES[0], stage: "Top 16 · Composition", isLive: true },
  { id: "india", name: "India", edition: "Edition 2026", banner: HERO_IMAGES[1], stage: "Top 16 · Composition", isLive: true },
  { id: "usa", name: "United States", edition: "Edition 2026", banner: HERO_IMAGES[2], stage: "Reserve Review", isLive: true },
  { id: "uk", name: "United Kingdom", edition: "Edition 2026", banner: HERO_IMAGES[3], stage: "Top 16 · Composition", isLive: true },
  { id: "france", name: "France", edition: "Edition 2026", banner: HERO_IMAGES[0], stage: "Pre-Live", isLive: false },
  { id: "brazil", name: "Brazil", edition: "Edition 2026", banner: HERO_IMAGES[1], stage: "Pre-Live", isLive: false },
];

function buildFinalists(seed: number): Finalist[] {
  const pool = CONTESTANTS.map((c, i) => ({ c, i: (i + seed * 3) % CONTESTANTS.length }));
  const arr: Finalist[] = [];
  for (let r = 0; r < 20; r++) {
    const base = pool[r % pool.length].c;
    const c: Contestant = { ...base, id: `${base.id}-s${seed}-r${r}` };
    const completion: MediaCompletion =
      r % 4 === 0 ? "Draft" : r % 5 === 0 ? "Empty" : "Submitted";
    arr.push({
      contestant: c,
      rank: r + 1,
      score: 9.84 - r * 0.11,
      status: r < 16 ? "Enabled" : "Reserve",
      completion,
      videos: [
        { id: `${c.id}-v0`, url: "", title: "Introduction Reel", duration: "00:32" },
      ],
      media: c.gallery.slice(0, 3).map((g, j) => ({
        id: `${c.id}-m${j}`,
        image: g,
        caption: ["Editorial portrait — North light.", "Campaign moment · Maison Lumière.", "Studio composition · monochrome series."][j] ?? "",
        alt: `${c.name} — editorial frame ${j + 1}`,
        photographerId: j === 0 ? PHOTOGRAPHERS[r % PHOTOGRAPHERS.length].id : undefined,
        positions: j === 0 ? (["TOP 16"] as PositionTag[]) : [],
        sponsorId: j === 1 ? `s${(r % 6) + 1}` : undefined,
        isFeatured: j === 0,
        shopItems: j === 1
          ? [{
              id: `${c.id}-m${j}-s0`,
              name: PRODUCTS[r % PRODUCTS.length].name,
              url: "https://reevibes.shop/look/" + c.slug,
              productId: PRODUCTS[r % PRODUCTS.length].id,
            }]
          : [],
      })),
    });
  }
  return arr;
}

function buildCountries(): LiveCountry[] {
  const nonGlobal = COUNTRY_DEFS.filter((d) => d.id !== "global").map((d, i) => ({
    ...d,
    finalists: buildFinalists(i + 2),
  }));
  const allEnabled = nonGlobal.flatMap((c) => c.finalists.filter((f) => f.status === "Enabled"));
  const allReserves = nonGlobal.flatMap((c) => c.finalists.filter((f) => f.status === "Reserve"));
  const globalFinalists: Finalist[] = [
    ...allEnabled.slice(0, 16).map((f, i) => ({ ...f, rank: i + 1, status: "Enabled" as FinalistStatus })),
    ...allReserves.slice(0, 4).map((f, i) => ({ ...f, rank: 17 + i, status: "Reserve" as FinalistStatus })),
  ];
  const globalDef = COUNTRY_DEFS.find((d) => d.id === "global")!;
  return [{ ...globalDef, finalists: globalFinalists }, ...nonGlobal];
}

function featuredImage(f: Finalist): string {
  return f.media.find((m) => m.isFeatured)?.image ?? f.media[0]?.image ?? f.contestant.image;
}

function applicationToFinalist(app: ContestantApplication, rank: number, score: number, status: FinalistStatus): Finalist {
  let mediaItems: MediaItem[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(`reevibes:top16:media:${app.contestantId}`);
      if (raw) mediaItems = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
  }
  if (mediaItems.length === 0) {
    if (app.photos?.portrait) {
    mediaItems.push({
      id: `${app.contestantId}-m-portrait`,
      image: app.photos.portrait,
      caption: "Editorial portrait — North light.",
      alt: `${app.fullName} — portrait`,
      positions: ["TOP 16"],
      isFeatured: true,
      shopItems: [],
    });
  }
  if (app.photos?.fullBody) {
    mediaItems.push({
      id: `${app.contestantId}-m-fullBody`,
      image: app.photos.fullBody,
      caption: "Campaign moment · Maison Lumière.",
      alt: `${app.fullName} — full body`,
      positions: [],
      isFeatured: !app.photos?.portrait,
      shopItems: [],
    });
  }
  if (app.photos?.sideProfile) {
    mediaItems.push({
      id: `${app.contestantId}-m-side`,
      image: app.photos.sideProfile,
      caption: "Studio composition · side profile.",
      alt: `${app.fullName} — side profile`,
      positions: [],
      isFeatured: false,
      shopItems: [],
    });
  }
  if (app.photos?.candid) {
    mediaItems.push({
      id: `${app.contestantId}-m-candid`,
      image: app.photos.candid,
      caption: "Candid moment.",
      alt: `${app.fullName} — candid`,
      positions: [],
      isFeatured: false,
      shopItems: [],
    });
  }
  if (Array.isArray(app.photos?.additional)) {
    app.photos.additional.forEach((img: string, idx: number) => {
      if (img) {
        mediaItems.push({
          id: `${app.contestantId}-m-add-${idx}`,
          image: img,
          caption: `Additional frame ${idx + 1}.`,
          alt: `${app.fullName} — additional frame`,
          positions: [],
          isFeatured: false,
          shopItems: [],
        });
      }
    });
  }
  }

  const videoItems: VideoItem[] = [];
  if (app.videos?.intro) {
    videoItems.push({
      id: `${app.contestantId}-v-intro`,
      url: app.videos.intro,
      title: "Introduction Reel",
      duration: "00:32",
    });
  }
  if (Array.isArray(app.videos?.additional)) {
    app.videos.additional.forEach((vUrl: string, idx: number) => {
      if (vUrl) {
        videoItems.push({
          id: `${app.contestantId}-v-add-${idx}`,
          url: vUrl,
          title: `Reel ${idx + 2}`,
          duration: "01:00",
        });
      }
    });
  }
  if (videoItems.length === 0) {
    videoItems.push({
      id: `${app.contestantId}-v0`,
      url: "",
      title: "Introduction Reel",
      duration: "00:32",
    });
  }

  return {
    contestant: {
      id: app.contestantId,
      slug: app.fullName.toLowerCase().replace(/[^a-z]+/g, "-"),
      name: app.fullName,
      country: app.country,
      city: app.city || "—",
      age: app.age,
      height: app.height || "—",
      measurements: app.bust ? `${app.bust}-${app.waist}-${app.hips}` : "—",
      status: "Top16",
      rank: rank,
      votes: Math.floor(15000 + Math.random() * 5000),
      image: app.photos?.portrait || app.photos?.fullBody || "",
      gallery: [app.photos?.portrait, app.photos?.fullBody, app.photos?.sideProfile, app.photos?.candid].filter(Boolean),
      bio: app.biography || "A vision of modern femininity.",
      campaigns: ["Resort 25", "Atelier Noir"],
      social: { instagram: app.social?.instagram, tiktok: app.social?.tiktok },
      hairColour: app.hairColour || "—",
      eyeColour: app.eyeColour || "—",
      dob: app.dob || "—",
      bust: app.bust || "",
      waist: app.waist || "",
      hips: app.hips || "",
    },
    rank,
    score,
    status,
    completion: "Submitted",
    videos: videoItems,
    media: mediaItems,
  };
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

function buildCountriesFromStore(state: any, selectedYear: number, selectedMonth: string): LiveCountry[] {
  const ratingUsers = state.users.filter((u: any) => u.roles.includes("Ratings"));
  const judgementUsers = state.users.filter((u: any) => u.roles.includes("Judgements"));

  let savedStatuses: Record<string, FinalistStatus> = {};
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("reevibes:top16:statuses");
      if (raw) savedStatuses = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
  }

  // Scan the store for any country that has proceeded contestants for the selected year
  const proceededCountries = Array.from(new Set(state.applications
    .filter((a: any) => state.positions[a.contestantId] === "Top16" && a.contestYear === selectedYear)
    .map((a: any) => a.country || a.contestCountry)
    .filter(Boolean)
  )) as string[];

  // Dynamically build the definitions list, ONLY adding countries that have proceeded contestants
  const dynamicDefs: Array<{ id: string; name: string; edition: string; banner: string; stage: string; isLive: boolean }> = [];
  
  const hasGlobalProceeded = proceededCountries.some(cName => matchCountryName(cName, "Global") || matchCountryName(cName, "Globe"));
  if (hasGlobalProceeded) {
    dynamicDefs.push({
      id: "global",
      name: "Global",
      edition: `Season ${selectedYear}`,
      banner: HERO_IMAGES[0],
      stage: "Top 16 · Composition",
      isLive: true,
    });
  }

  proceededCountries.forEach((cName) => {
    const isGlobal = matchCountryName(cName, "Global") || matchCountryName(cName, "Globe");
    if (isGlobal) return;
    
    dynamicDefs.push({
      id: cName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: cName,
      edition: `Edition ${selectedYear}`,
      banner: HERO_IMAGES[0],
      stage: "Top 16 · Composition",
      isLive: true,
    });
  });

  const nonGlobal = dynamicDefs.filter((d) => d.id !== "global").map((d, i) => {
    const proceededApps = state.applications.filter((a: any) => {
      const matchCountry = matchCountryName(a.country, d.name) || matchCountryName(a.country, d.id);
      const inTop16 = state.positions[a.contestantId] === "Top16";
      const matchYear = a.contestYear === selectedYear;
      return matchCountry && inTop16 && matchYear;
    });

    const finalists: Finalist[] = proceededApps.map((app: any, idx: number) => {
      const ratingScores = ratingUsers
        .map((u: any) => state.rateScores[u.id]?.[app.contestantId])
        .filter((s: any): s is number => typeof s === "number");
      const rateAvg = ratingScores.length ? ratingScores.reduce((a: number, b: number) => a + b, 0) / ratingScores.length : 0;
      
      const judgeAvgScores = judgementUsers
        .map((u: any) => {
          const m = state.judgeRatings[u.id]?.[app.contestantId];
          return m ? Object.values(m).filter((n): n is number => typeof n === "number").reduce((a: number, b: number) => a + b, 0) / Object.values(m).length : NaN;
        }).filter((n: any) => !Number.isNaN(n));
      const intlAvg = judgeAvgScores.length ? judgeAvgScores.reduce((a: number, b: number) => a + b, 0) / judgeAvgScores.length : 0;
      const totalScore = rateAvg + intlAvg || 9.5 - idx * 0.1;

      const savedStatus = savedStatuses[app.contestantId];
      const status = savedStatus || (idx < 16 ? "Enabled" : "Reserve");

      return applicationToFinalist(app, idx + 1, totalScore, status);
    });

    return {
      ...d,
      finalists,
    };
  });

  const proceededGlobalApps = state.applications.filter((a: any) => {
    const matchCountry = matchCountryName(a.country, "Global") || matchCountryName(a.country, "Globe");
    const inTop16 = state.positions[a.contestantId] === "Top16";
    const matchYear = a.contestYear === selectedYear;
    return matchCountry && inTop16 && matchYear;
  });

  let globalFinalists: Finalist[] = [];
  if (proceededGlobalApps.length > 0) {
    globalFinalists = proceededGlobalApps.map((app: any, idx: number) => {
      const ratingScores = ratingUsers
        .map((u: any) => state.rateScores[u.id]?.[app.contestantId])
        .filter((s: any): s is number => typeof s === "number");
      const rateAvg = ratingScores.length ? ratingScores.reduce((a: number, b: number) => a + b, 0) / ratingScores.length : 0;
      
      const judgeAvgScores = judgementUsers
        .map((u: any) => {
          const m = state.judgeRatings[u.id]?.[app.contestantId];
          return m ? Object.values(m).filter((n): n is number => typeof n === "number").reduce((a: number, b: number) => a + b, 0) / Object.values(m).length : NaN;
        }).filter((n: any) => !Number.isNaN(n));
      const intlAvg = judgeAvgScores.length ? judgeAvgScores.reduce((a: number, b: number) => a + b, 0) / judgeAvgScores.length : 0;
      const totalScore = rateAvg + intlAvg || 9.5 - idx * 0.1;

      const savedStatus = savedStatuses[app.contestantId];
      const status = savedStatus || (idx < 16 ? "Enabled" : "Reserve");

      return applicationToFinalist(app, idx + 1, totalScore, status);
    });
  }

  const globalDef = hasGlobalProceeded
    ? {
        id: "global",
        name: "Global",
        edition: `Season ${selectedYear}`,
        banner: HERO_IMAGES[0],
        stage: "Top 16 · Composition",
        isLive: true,
      }
    : null;

  return globalDef ? [{ ...globalDef, finalists: globalFinalists }, ...nonGlobal] : nonGlobal;
}

/* ============================================================
 * PAGE
 * ============================================================ */
const YEARS = [2026, 2025, 2024];
const MONTHS = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function Top16Page() {
  const { state, updateApplication } = useAppStore();
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  const [countries, setCountries] = useState<LiveCountry[]>(() => buildCountriesFromStore(state, 2026, "All"));

  useEffect(() => {
    setCountries(buildCountriesFromStore(state, selectedYear, selectedMonth));
  }, [state, selectedYear, selectedMonth]);

  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusF, setStatusF] = useState<"All" | FinalistStatus>("All");
  const [active, setActive] = useState<Finalist | null>(null);
  const [promote, setPromote] = useState<{ vacant: Finalist; candidate: Finalist } | null>(null);
  const [showPublishPopup, setShowPublishPopup] = useState(false);

  const activeCountry = countries.find((c) => c.id === activeCountryId) ?? null;

  function patchCountry(id: string, mut: (c: LiveCountry) => LiveCountry) {
    setCountries((arr) => arr.map((c) => (c.id === id ? mut(c) : c)));
  }

  function updateFinalist(countryId: string, fid: string, patch: Partial<Finalist>) {
    if (patch.status !== undefined) {
      try {
        const raw = window.localStorage.getItem("reevibes:top16:statuses");
        const savedStatuses = raw ? JSON.parse(raw) : {};
        savedStatuses[fid] = patch.status;
        window.localStorage.setItem("reevibes:top16:statuses", JSON.stringify(savedStatuses));
      } catch (e) {
        console.error(e);
      }
    }
    patchCountry(countryId, (c) => ({
      ...c,
      finalists: c.finalists.map((f) => {
        if (f.contestant.id === fid) {
          const next = { ...f, ...patch };
          const appPatch: any = {};
          if (patch.contestant) {
            if (patch.contestant.name !== undefined) appPatch.fullName = patch.contestant.name;
            if (patch.contestant.country !== undefined) {
              appPatch.country = patch.contestant.country;
              appPatch.contestCountry = patch.contestant.country;
            }
            if (patch.contestant.city !== undefined) appPatch.city = patch.contestant.city;
            if (patch.contestant.bio !== undefined) appPatch.biography = patch.contestant.bio;
          }
          if (patch.media !== undefined) {
            const featured = next.media.find(m => m.isFeatured)?.image || next.media[0]?.image || "";
            appPatch.photos = {
              portrait: featured,
              fullBody: next.media[1]?.image || "",
              sideProfile: next.media[2]?.image || "",
              candid: next.media[3]?.image || "",
              additional: next.media.slice(4).map(m => m.image),
            };
          }
          if (patch.videos !== undefined) {
            appPatch.videos = {
              intro: next.videos[0]?.url || "",
              additional: next.videos.slice(1).map(v => v.url),
            };
          }
          if (Object.keys(appPatch).length > 0) {
            updateApplication(fid, appPatch);
          }
          return next;
        }
        return f;
      }),
    }));
    setActive((a) => (a && a.contestant.id === fid ? { ...a, ...patch } : a));
  }

  function mutateMedia(countryId: string, fid: string, fn: (media: MediaItem[]) => MediaItem[]) {
    patchCountry(countryId, (c) => ({
      ...c,
      finalists: c.finalists.map((f) => {
        if (f.contestant.id === fid) {
          const nextMedia = fn(f.media);
          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem(`reevibes:top16:media:${fid}`, JSON.stringify(nextMedia));
            } catch (e) {
              console.error(e);
            }
          }
          const next = { ...f, media: nextMedia };
          const featured = nextMedia.find(m => m.isFeatured)?.image || nextMedia[0]?.image || "";
          updateApplication(fid, {
            photos: {
              portrait: featured,
              fullBody: nextMedia[1]?.image || "",
              sideProfile: nextMedia[2]?.image || "",
              candid: nextMedia[3]?.image || "",
              additional: nextMedia.slice(4).map(m => m.image),
            }
          });
          return next;
        }
        return f;
      }),
    }));
    setActive((a) => {
      if (a && a.contestant.id === fid) {
        const nextMedia = fn(a.media);
        return { ...a, media: nextMedia };
      }
      return a;
    });
  }

  function updateMedia(countryId: string, fid: string, mediaId: string, patch: Partial<MediaItem>) {
    mutateMedia(countryId, fid, (media) =>
      media.map((m) => (m.id === mediaId ? { ...m, ...patch } : m))
    );
  }

  function deleteMedia(countryId: string, fid: string, mediaId: string) {
    mutateMedia(countryId, fid, (media) => media.filter((m) => m.id !== mediaId));
  }

  function setFeatured(countryId: string, fid: string, mediaId: string) {
    mutateMedia(countryId, fid, (media) =>
      media.map((m) => ({ ...m, isFeatured: m.id === mediaId }))
    );
  }

  function reorderMedia(countryId: string, fid: string, from: number, to: number) {
    mutateMedia(countryId, fid, (media) => {
      const next = [...media];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function mutateVideos(countryId: string, fid: string, fn: (v: VideoItem[]) => VideoItem[]) {
    patchCountry(countryId, (c) => ({
      ...c,
      finalists: c.finalists.map((f) => {
        if (f.contestant.id === fid) {
          const nextVideos = fn(f.videos);
          const next = { ...f, videos: nextVideos };
          updateApplication(fid, {
            videos: {
              intro: nextVideos[0]?.url || "",
              additional: nextVideos.slice(1).map(v => v.url),
            }
          });
          return next;
        }
        return f;
      }),
    }));
    setActive((a) => {
      if (a && a.contestant.id === fid) {
        const nextVideos = fn(a.videos);
        return { ...a, videos: nextVideos };
      }
      return a;
    });
  }

  function toggleStatus(country: LiveCountry, f: Finalist) {
    if (f.status === "Enabled") {
      const candidate = country.finalists.find((x) => x.status === "Reserve");
      if (candidate) { setPromote({ vacant: f, candidate }); return; }
      updateFinalist(country.id, f.contestant.id, { status: "Disabled" });
    } else if (f.status === "Reserve") {
      updateFinalist(country.id, f.contestant.id, { status: "Enabled" });
    } else {
      updateFinalist(country.id, f.contestant.id, { status: "Reserve" });
    }
  }

  function confirmPromote() {
    if (!promote || !activeCountry) return;
    updateFinalist(activeCountry.id, promote.vacant.contestant.id, { status: "Reserve" });
    updateFinalist(activeCountry.id, promote.candidate.contestant.id, { status: "Enabled" });
    setPromote(null);
  }

  if (!activeCountry) {
    return (
      <AdminLayout
        eyebrow="Module · Global Finalist Orchestration"
        title="Live Countries · Top 16 Studio"
        actions={<><AdminButton variant="outline">Export Lineups</AdminButton></>}
      >
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
        </div>

        <div className="grid lg:grid-cols-12 gap-4 mb-8">
          <AdminCard className="lg:col-span-8">
            <div className="flex items-center gap-8">
              <Metric label="Live Editions" value={countries.filter((c) => c.isLive).length} accent />
              <div className="hairline-v h-10" />
              <Metric label="Finalists in Composition" value={countries.reduce((n, c) => n + c.finalists.filter((f) => f.status === "Enabled").length, 0)} />
              <div className="hairline-v h-10" />
              <Metric label="Reserve Bench" value={countries.reduce((n, c) => n + c.finalists.filter((f) => f.status === "Reserve").length, 0)} small />
            </div>
          </AdminCard>
          <AdminCard className="lg:col-span-4">
            <div className="editorial-label text-muted-foreground mb-3 flex items-center gap-2">
              <Globe2 className="w-3 h-3" /> Global Orchestration
            </div>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              Select a country to enter its editorial finalist studio. Each lineup runs in isolation with its own campaign media, sponsors and reserve bench.
            </p>
          </AdminCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {countries.map((c) => (
            <LiveCountryCard key={c.id} country={c} onOpen={() => setActiveCountryId(c.id)} />
          ))}
        </div>
      </AdminLayout>
    );
  }

  /* ----- Country finalist screen ----- */
  const enabled = activeCountry.finalists.filter((f) => f.status === "Enabled");
  const reserves = activeCountry.finalists.filter((f) => f.status === "Reserve");
  const disabled = activeCountry.finalists.filter((f) => f.status === "Disabled");

  const filterList = (list: Finalist[]) =>
    list.filter((f) => {
      if (statusF !== "All" && f.status !== statusF) return false;
      if (query && !f.contestant.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });

  return (
    <AdminLayout
      eyebrow={`Module · ${activeCountry.name}`}
      title="Top 16 · Editorial Studio"
      actions={
        <>
          <AdminButton variant="ghost" onClick={() => setActiveCountryId(null)}>
            <span className="inline-flex items-center gap-1.5"><ChevronLeft className="w-3 h-3" /> All Countries</span>
          </AdminButton>
          <AdminButton variant="outline">Save Draft</AdminButton>
          <AdminButton variant="accent" onClick={() => {
            if (!activeCountry) return;
            try {
              const raw = window.localStorage.getItem("reevibes:published-lineups");
              const list = raw ? JSON.parse(raw) : [];
              if (!list.includes(activeCountry.id)) {
                list.push(activeCountry.id);
                window.localStorage.setItem("reevibes:published-lineups", JSON.stringify(list));
              }
              const rawMeta = window.localStorage.getItem("reevibes:published-countries-meta");
              const meta = rawMeta ? JSON.parse(rawMeta) : {};
              meta[activeCountry.id] = {
                id: activeCountry.id,
                name: activeCountry.name,
                year: "2026",
              };
              window.localStorage.setItem("reevibes:published-countries-meta", JSON.stringify(meta));
              setShowPublishPopup(true);
            } catch (e) {
              console.error(e);
            }
          }}>Publish Line Up</AdminButton>
        </>
      }
    >
      <div className="relative">
        <div className="border border-border-subtle bg-surface mb-6 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl lg:text-5xl">{activeCountry.name}</h2>
          </div>
          <div className="flex items-center gap-8">
            <Metric label="Top 16" value={enabled.length} accent />
            <div className="hairline-v h-10" />
            <Metric label="Reserves" value={reserves.length} />
            <div className="hairline-v h-10" />
            <Metric label="Stage" value={activeCountry.isLive ? "Live" : "Off"} small />
          </div>
        </div>

        <AdminCard className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1 flex items-center gap-2 border-b border-border-subtle pb-2">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search finalist by name…"
                className="w-full bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </div>
            <Selector
              value={statusF}
              onChange={(v) => setStatusF(v as "All" | FinalistStatus)}
              options={["All", "Enabled", "Reserve", "Disabled"]}
            />
          </div>
        </AdminCard>

        <SectionHeader icon={<Crown className="w-3 h-3" />} title="Top 16 · Live Lineup" subtitle="Editorial finalists composing the live broadcast lineup." />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-12">
          {filterList(enabled).map((f) => (
            <FinalistCard key={f.contestant.id} finalist={f} onOpen={() => setActive(f)} onToggle={() => toggleStatus(activeCountry, f)} />
          ))}
          {filterList(enabled).length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-16 border border-dashed border-border-subtle">
              No active finalists match your filters.
            </div>
          )}
        </div>

        <SectionHeader icon={<Users2 className="w-3 h-3" />} title={`Reserve Bench · ${reserves.length} Stand-By`} subtitle="Editorial reserves on stand-by — promote into the live lineup at any moment." accent />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 p-4 border border-dashed border-accent/30 bg-accent/[0.02]">
          {filterList(reserves).map((f) => (
            <FinalistCard key={f.contestant.id} finalist={f} onOpen={() => setActive(f)} onToggle={() => toggleStatus(activeCountry, f)} />
          ))}
          {filterList(reserves).length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-10">
              No reserves match your filters.
            </div>
          )}
        </div>

        {filterList(disabled).length > 0 && (
          <>
            <SectionHeader icon={<Lock className="w-3 h-3" />} title="Disabled" subtitle="Archived from the live lineup." />
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {filterList(disabled).map((f) => (
                <FinalistCard key={f.contestant.id} finalist={f} onOpen={() => setActive(f)} onToggle={() => toggleStatus(activeCountry, f)} />
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          className="max-w-none w-screen h-screen p-0 m-0 rounded-none border-0 bg-background/95 backdrop-blur-2xl overflow-y-auto sm:rounded-none translate-x-0 translate-y-0 top-0 left-0"
          style={{ transform: "none", left: 0, top: 0 }}
        >
          {active && (
            <FinalistDetail
              finalist={active}
              selectedYear={selectedYear}
              activeCountry={activeCountry}
              onUpdate={(patch) => updateFinalist(activeCountry.id, active.contestant.id, patch)}
              onUpdateMedia={(mid, patch) => updateMedia(activeCountry.id, active.contestant.id, mid, patch)}
              onDeleteMedia={(mid) => deleteMedia(activeCountry.id, active.contestant.id, mid)}
              onSetFeatured={(mid) => setFeatured(activeCountry.id, active.contestant.id, mid)}
              onReorderMedia={(from, to) => reorderMedia(activeCountry.id, active.contestant.id, from, to)}
              onMutateVideos={(fn) => mutateVideos(activeCountry.id, active.contestant.id, fn)}
              onAddMedia={(url) => {
                const nextMedia: MediaItem = {
                  id: `m-${Date.now()}`,
                  image: url,
                  caption: "Editorial frame",
                  alt: "Contestant photo",
                  positions: ["TOP 16"],
                  isFeatured: false,
                  shopItems: [],
                };
                mutateMedia(activeCountry.id, active.contestant.id, (arr) => [...arr, nextMedia]);
              }}
              onClose={() => setActive(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!promote} onOpenChange={(o) => !o && setPromote(null)}>
        <DialogContent className="max-w-2xl bg-background border border-border-subtle p-0">
          {promote && (
            <ReservePromotionPanel
              vacant={promote.vacant}
              candidate={promote.candidate}
              onCancel={() => setPromote(null)}
              onConfirm={confirmPromote}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Publish Line Up Success Popup */}
      {showPublishPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold tracking-tight">Line Up Published</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Line up published to Live Contest Dashboard successfully.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPublishPopup(false)}
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

/* ============================================================
 * LIVE COUNTRY CARD
 * ============================================================ */
function LiveCountryCard({ country, onOpen }: { country: LiveCountry; onOpen: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={onOpen}
      className="group relative border border-border-subtle cursor-pointer bg-surface p-6 flex flex-col justify-between min-h-[200px] hover:border-accent transition-all duration-300 animate-in fade-in zoom-in-95"
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          {country.isLive ? "LIVE" : "PRE-LIVE"} · 2026
        </span>
        <ChevronRight className="w-4 h-4 text-foreground/40 group-hover:text-accent transition-colors" />
      </div>
      
      <div className="flex-1 flex items-center justify-center py-4">
        <CountryLogo countryName={country.name} className="max-h-12 w-auto max-w-[80%] object-contain filter brightness-100 group-hover:scale-105 transition-transform duration-300" />
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border-subtle/30 pt-3">
        <span>{country.finalists.filter(f => f.status === "Enabled").length} Finalists</span>
        <span>{country.finalists.filter(f => f.status === "Reserve").length} Reserves</span>
      </div>
    </motion.div>
  );
}

function CountryMetric({ label, value, small }: { label: string; value: ReactNode; small?: boolean }) {
  return (
    <div className="bg-surface-2 px-3 py-2">
      <div className="editorial-label text-muted-foreground">{label}</div>
      <div className={`font-serif ${small ? "text-base" : "text-xl"} mt-0.5`}>{value}</div>
    </div>
  );
}

/* ============================================================
 * SHARED
 * ============================================================ */
function Metric({ label, value, accent, small }: { label: string; value: ReactNode; accent?: boolean; small?: boolean }) {
  return (
    <div>
      <div className="editorial-label text-muted-foreground mb-1">{label}</div>
      <div className={`font-serif ${small ? "text-xl" : "text-3xl"} ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, accent }: { icon: ReactNode; title: string; subtitle?: string; accent?: boolean }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <div className={`editorial-label flex items-center gap-2 mb-2 ${accent ? "text-accent" : "text-foreground/60"}`}>
          {icon} Section
        </div>
        <h3 className="font-serif text-2xl">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-1.5 max-w-xl">{subtitle}</p>}
      </div>
    </div>
  );
}

function Selector({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative md:w-48">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-surface-2 border border-border-subtle px-3 py-2 text-xs text-foreground/80 hover:border-accent/40 transition-colors focus:outline-none"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function completionTone(c: MediaCompletion) {
  if (c === "Submitted") return "border-accent/50 bg-accent/[0.04]";
  if (c === "Draft") return "border-amber-400/30 bg-amber-400/[0.03]";
  return "border-border-subtle";
}
function completionLabel(c: MediaCompletion) {
  return c === "Submitted" ? "Profile Submitted" : c === "Draft" ? "Saved Draft" : "No Data";
}

function FinalistCard({ finalist, onOpen, onToggle }: { finalist: Finalist; onOpen: () => void; onToggle: () => void }) {
  const { contestant: c, rank, score, status, completion } = finalist;
  const dim = status === "Disabled";
  const hero = featuredImage(finalist);
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`group relative border ${completionTone(completion)} ${dim ? "opacity-40" : ""} cursor-pointer transition-all`}
      onClick={onOpen}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
        <motion.img
          src={hero} alt={c.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.05 }} whileHover={{ scale: 1.1 }} transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3 font-serif text-white text-2xl leading-none">
          {status === "Reserve" ? "R" : ""}{String(rank).padStart(2, "0")}
        </div>

        <div className="absolute top-3 right-3">
          <StatusChip status={status} tone={status === "Enabled" ? "accent" : status === "Reserve" ? "warn" : "neutral"} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <div className="font-serif text-base leading-tight">{c.name}</div>
          <div className="editorial-label text-white/60 mt-0.5">{c.country}</div>
          <div className="flex items-center justify-between mt-3 text-[10px] uppercase tracking-[0.2em]">
            <span className="text-white/70">Score · {score.toFixed(2)}</span>
            <span className="text-white/70">{completionLabel(completion)}</span>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className="editorial-label text-white border border-white/40 px-3 py-1 hover:border-accent hover:text-accent transition-colors"
          >
            {status === "Enabled" ? "Disable" : status === "Reserve" ? "Promote" : "Reserve"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
 * FINALIST DETAIL
 * ============================================================ */
function FinalistDetail({
  finalist, selectedYear, activeCountry, onUpdate, onUpdateMedia, onDeleteMedia, onSetFeatured, onReorderMedia, onMutateVideos, onClose, onAddMedia,
}: {
  finalist: Finalist;
  selectedYear: number;
  activeCountry: LiveCountry;
  onUpdate: (p: Partial<Finalist>) => void;
  onUpdateMedia: (mid: string, p: Partial<MediaItem>) => void;
  onDeleteMedia: (mid: string) => void;
  onSetFeatured: (mid: string) => void;
  onReorderMedia: (from: number, to: number) => void;
  onMutateVideos: (fn: (v: VideoItem[]) => VideoItem[]) => void;
  onClose: () => void;
  onAddMedia: (url: string) => void;
}) {
  const { contestant: c } = finalist;
  const hero = featuredImage(finalist);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Editorial hero — portrait, fully visible */}
      <div className="relative bg-black overflow-hidden flex items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="absolute inset-0 opacity-30">
          <img src={hero} alt="" className="w-full h-full object-cover blur-2xl scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
        <img
          src={hero}
          alt={c.name}
          className="relative z-10 max-h-[60vh] w-auto object-contain shadow-2xl"
        />
        <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-black/60 text-white hover:bg-accent transition-colors z-20">
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-6 left-8 right-8 text-white z-20">
          <div className="editorial-label text-accent">Finalist · Rank {String(finalist.rank).padStart(2, "0")} · {finalist.status}</div>
          <h2 className="font-serif text-4xl lg:text-5xl mt-2">{c.name}</h2>
          <div className="editorial-label text-white/70 mt-2">{c.country} · {c.city} · Score {finalist.score.toFixed(2)}</div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-subtle">
          {[
            ["Status", finalist.status],
            ["Media", completionLabel(finalist.completion)],
            ["Photographer", finalist.media.find((m) => m.photographerId) ? "Assigned" : "Pending"],
            ["Live-Ready", finalist.completion === "Submitted" ? "Yes" : "No"],
          ].map(([k, v]) => (
            <div key={k} className="bg-background p-4">
              <div className="editorial-label text-muted-foreground">{k}</div>
              <div className="text-sm mt-1.5 text-foreground">{v}</div>
            </div>
          ))}
        </div>

        {/* Profile Settings Section */}
        <Section title="Contestant Profile Settings" subtitle="Edit base name, country, city, and biography/description details.">
          <div className="grid md:grid-cols-2 gap-6 bg-surface p-6 border border-border-subtle">
            <div className="space-y-4">
              <div>
                <label className="editorial-label text-muted-foreground block mb-1">Contestant Name</label>
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => {
                    onUpdate({
                      contestant: { ...c, name: e.target.value }
                    });
                  }}
                  className="w-full bg-surface-2 border border-border-subtle px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="editorial-label text-muted-foreground block mb-1">Country</label>
                <input
                  type="text"
                  value={c.country}
                  onChange={(e) => {
                    onUpdate({
                      contestant: { ...c, country: e.target.value }
                    });
                  }}
                  className="w-full bg-surface-2 border border-border-subtle px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="editorial-label text-muted-foreground block mb-1">City</label>
                <input
                  type="text"
                  value={c.city}
                  onChange={(e) => {
                    onUpdate({
                      contestant: { ...c, city: e.target.value }
                    });
                  }}
                  className="w-full bg-surface-2 border border-border-subtle px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div>
              <label className="editorial-label text-muted-foreground block mb-1">Biography / Description</label>
              <textarea
                value={c.bio}
                onChange={(e) => {
                  onUpdate({
                    contestant: { ...c, bio: e.target.value }
                  });
                }}
                rows={6}
                className="w-full bg-surface-2 border border-border-subtle px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>
          </div>
        </Section>

        {/* Introduction Films — multiple */}
        <Section
          title="Introduction Films"
          subtitle="Multiple editorial reels — drag to sequence playback order."
          action={
            <button
              onClick={() => onMutateVideos((arr) => [...arr, {
                id: `vid-${Date.now()}`, url: "", title: `Reel ${arr.length + 1}`, duration: "00:00",
              }])}
              className="editorial-label text-accent border border-accent/30 px-3 py-1.5 hover:bg-accent/5 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" /> Add Film
            </button>
          }
        >
          <VideoList
            videos={finalist.videos}
            onMutate={onMutateVideos}
          />
        </Section>

        {/* Campaign Media Studio */}
        <Section
          title="Campaign Media Studio"
          subtitle="Editorial frames · photographer credits · position tags · sponsors · shoppable looks. Drag to reorder · star to feature."
        >
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {finalist.media.map((m, idx) => (
              <div
                key={m.id}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null && dragIndex !== idx) onReorderMedia(dragIndex, idx);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                className={`transition-opacity ${dragIndex === idx ? "opacity-40" : ""}`}
              >
                <CampaignMediaCard
                  media={m}
                  onChange={(p) => onUpdateMedia(m.id, p)}
                  onDelete={() => onDeleteMedia(m.id)}
                  onSetFeatured={() => onSetFeatured(m.id)}
                  contestant={c}
                  selectedYear={selectedYear}
                  activeCountry={activeCountry}
                />
              </div>
            ))}
            <UploadZone onUpload={onAddMedia} />
          </div>
        </Section>

        <div className="sticky bottom-0 -mx-8 px-8 py-5 bg-background/95 backdrop-blur border-t border-border-subtle flex flex-col sm:flex-row gap-3 justify-between">
          <AdminButton variant="ghost" onClick={() => onUpdate({ media: [] })}>Delete All Media</AdminButton>
          <div className="flex gap-3">
            <AdminButton variant="outline" onClick={() => onUpdate({ completion: "Draft" })}>Save Draft</AdminButton>
            <AdminButton variant="accent" onClick={() => onUpdate({ completion: "Submitted" })}>Publish Portfolio</AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="editorial-label text-accent mb-1.5">Module</div>
          <h3 className="font-serif text-2xl">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-1.5 max-w-lg">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ============================================================
 * VIDEO LIST
 * ============================================================ */
function VideoList({ videos, onMutate }: { videos: VideoItem[]; onMutate: (fn: (v: VideoItem[]) => VideoItem[]) => void }) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function update(id: string, patch: Partial<VideoItem>) {
    onMutate((arr) => arr.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }
  function remove(id: string) {
    onMutate((arr) => arr.filter((v) => v.id !== id));
  }
  function reorder(from: number, to: number) {
    onMutate((arr) => {
      const next = [...arr];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
  }

  if (videos.length === 0) {
    return (
      <div className="border border-dashed border-border-subtle aspect-video flex flex-col items-center justify-center text-center text-muted-foreground">
        <Video className="w-6 h-6 mb-2" />
        <div className="editorial-label">No films yet · add an introduction reel</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {videos.map((v, idx) => (
          <div
            key={v.id}
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIdx !== null && dragIdx !== idx) reorder(dragIdx, idx);
              setDragIdx(null);
            }}
            onDragEnd={() => setDragIdx(null)}
            className={`group border border-border-subtle bg-surface transition-all hover:border-accent ${dragIdx === idx ? "opacity-40" : ""}`}
          >
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <div className="w-14 h-14 border border-white/40 rounded-full flex items-center justify-center text-white group-hover:border-accent group-hover:text-accent transition-colors">
                <Play className="w-5 h-5 ml-0.5" />
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-black/60 backdrop-blur p-1.5 text-white/80 cursor-grab">
                  <GripVertical className="w-3 h-3" />
                </span>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-black/60 backdrop-blur p-1.5 text-white/80 hover:text-accent transition-colors" title="Replace">
                  <Upload className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setConfirmId(v.id)}
                  className="bg-black/60 backdrop-blur p-1.5 text-white/80 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 editorial-label text-white/60 bg-black/40 px-1.5 py-0.5">
                {v.duration}
              </div>
              <div className="absolute bottom-2 left-2 editorial-label text-white/80 bg-black/40 px-1.5 py-0.5">
                #{idx + 1}
              </div>
            </div>
            <div className="p-3 space-y-2">
              <input
                value={v.title}
                onChange={(e) => update(v.id, { title: e.target.value })}
                placeholder="Film title…"
                className="w-full bg-transparent border-b border-border-subtle text-sm py-1.5 focus:outline-none focus:border-accent"
              />
              <input
                value={v.url}
                onChange={(e) => update(v.id, { url: e.target.value })}
                placeholder="Video URL (e.g. YouTube/Vimeo)…"
                className="w-full bg-transparent border-b border-border-subtle text-xs py-1 focus:outline-none focus:border-accent text-muted-foreground"
              />
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this film?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the introduction film from the contestant's portfolio. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (confirmId) remove(confirmId); setConfirmId(null); }}>
              Delete Film
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ============================================================
 * MEDIA CARD
 * ============================================================ */
function CampaignMediaCard({
  media, onChange, onDelete, onSetFeatured, contestant, selectedYear, activeCountry,
}: {
  media: MediaItem;
  onChange: (p: Partial<MediaItem>) => void;
  onDelete: () => void;
  onSetFeatured: () => void;
  contestant: Contestant;
  selectedYear: number;
  activeCountry: LiveCountry;
}) {
  const { theme } = useTheme();
  const positions: PositionTag[] = ["TOP 16", "TOP 8", "TOP 4", "FINALS", "WINNER", "BEST PHOTOGRAPHY"];
  const [tab, setTab] = useState<"details" | "shop">("details");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dbPhotographers, setDbPhotographers] = useState<any[]>([]);
  const [showPublishPopup, setShowPublishPopup] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("reevibes:photographers");
      if (raw) {
        setDbPhotographers(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    const country = activeCountry?.name || contestant.country;
    if (!country) return;
    fetch(`/api/sponsors?action=get-sponsors-by-country&country=${encodeURIComponent(country)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSponsors(data);
        }
      })
      .catch(err => console.error("Error loading country sponsors:", err));
  }, [activeCountry, contestant.country]);

  const filteredPhotographers = useMemo(() => {
    return dbPhotographers.filter((p: any) => {
      const isActive = p.status === "Active";
      const matchCountry = p.assignedCountries.some((cName: string) => {
        const norm = (s: string) => {
          let low = s.toLowerCase().trim();
          if (low === "uk") return "united kingdom";
          if (low === "usa") return "united states";
          return low;
        };
        return norm(cName) === norm(contestant.country);
      });
      return isActive && matchCountry;
    });
  }, [dbPhotographers, contestant.country]);

  function togglePosition(p: PositionTag) {
    const has = media.positions.includes(p);
    const nextPositions = has ? media.positions.filter((x) => x !== p) : [...media.positions, p];

    // If removing BEST PHOTOGRAPHY, also clean it from the published portfolio
    if (p === "BEST PHOTOGRAPHY" && has) {
      try {
        const raw = window.localStorage.getItem("reevibes:best-photography:portfolio");
        if (raw) {
          const list: any[] = JSON.parse(raw);
          const portfolioId = `portfolio-${contestant.id}-${media.id}`;
          const filtered = list.filter((x) => x.portfolioId !== portfolioId);
          window.localStorage.setItem("reevibes:best-photography:portfolio", JSON.stringify(filtered));
        }
      } catch (e) {
        console.error(e);
      }
    }

    onChange({ positions: nextPositions });
  }

  const handlePublishPortfolio = () => {
    if (!media.photographerId) return;
    const photographer = filteredPhotographers.find((p: any) => p.id === media.photographerId);
    if (!photographer) return;

    try {
      const raw = window.localStorage.getItem("reevibes:best-photography:portfolio");
      const list: any[] = raw ? JSON.parse(raw) : [];

      const portfolioId = `portfolio-${contestant.id}-${media.id}`;
      const existingIdx = list.findIndex((x) => x.portfolioId === portfolioId);

      const record = {
        portfolioId,
        contestantId: contestant.id,
        contestantName: contestant.name,
        countryId: activeCountry ? activeCountry.id : contestant.country.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        countryName: contestant.country,
        year: selectedYear || 2026,
        photoId: media.id,
        photoUrl: media.image,
        photographerId: photographer.id,
        photographerName: photographer.name,
        positionTag: "BEST PHOTOGRAPHY",
        publishStatus: "published",
        createdDate: existingIdx !== -1 ? list[existingIdx].createdDate : new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      if (existingIdx !== -1) {
        list[existingIdx] = record;
      } else {
        list.push(record);
      }

      window.localStorage.setItem("reevibes:best-photography:portfolio", JSON.stringify(list));
      setShowPublishPopup(true);
    } catch (e) {
      console.error(e);
    }
  };

  function addShopItem() {
    onChange({
      shopItems: [
        ...media.shopItems,
        { id: `si-${Date.now()}`, name: "", url: "" },
      ],
    });
  }
  function updateShopItem(id: string, patch: Partial<ShopItem>) {
    onChange({ shopItems: media.shopItems.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }
  function removeShopItem(id: string) {
    onChange({ shopItems: media.shopItems.filter((s) => s.id !== id) });
  }

  return (
    <div className={`border ${media.isFeatured ? "border-accent shadow-[0_0_24px_-6px_rgba(255,90,140,0.35)]" : "border-border-subtle"} bg-surface group transition-all`}>
      {/* Portrait-first image — fully visible */}
      <div className="relative aspect-[3/4] overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute inset-0 opacity-25">
          <img src={media.image} alt="" className="w-full h-full object-cover blur-xl scale-110" />
        </div>
        <img
          src={media.image}
          alt={media.alt}
          className="relative z-10 max-h-full max-w-full object-contain"
        />

        {/* Position tags — minimal, no professional/best frame stamps */}
        {media.positions.length > 0 && (
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 items-start opacity-0 group-hover:opacity-100 transition-opacity">
            {media.positions.map((p) => (
              <span key={p} className="border border-white/40 text-white px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] bg-black/50 backdrop-blur">
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Drag handle — hover */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/60 backdrop-blur p-1.5 text-white/80 inline-flex cursor-grab">
            <GripVertical className="w-3 h-3" />
          </span>
        </div>

        {/* Hover actions — bottom */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onSetFeatured}
            title={media.isFeatured ? "Featured image" : "Set as featured"}
            className={`p-1.5 backdrop-blur transition-colors ${
              media.isFeatured
                ? "bg-accent text-white"
                : "bg-black/60 text-white/80 hover:text-accent"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${media.isFeatured ? "fill-current" : ""}`} />
          </button>
          <div className="flex items-center gap-1.5">
            <button className="bg-black/60 backdrop-blur p-1.5 text-white/80 hover:text-accent transition-colors" title="Replace">
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="bg-black/60 backdrop-blur p-1.5 text-white/80 hover:text-rose-400 transition-colors"
              title="Delete photo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Always-on featured indicator (subtle) */}
        {media.isFeatured && (
          <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 bg-accent text-white px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] group-hover:opacity-0 transition-opacity">
            <Star className="w-2.5 h-2.5 fill-current" /> Featured
          </div>
        )}
      </div>

      <div className="flex border-b border-border-subtle">
        {(["details", "shop"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 editorial-label transition-colors ${tab === t ? "text-accent border-b border-accent" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t === "details" ? "Details & Credits" : `Shop · ${media.shopItems.length}`}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {tab === "details" && (
          <>
            <Field label="Caption">
              <textarea
                value={media.caption}
                onChange={(e) => onChange({ caption: e.target.value })}
                rows={2}
                className="w-full bg-transparent border-b border-border-subtle text-sm py-1.5 focus:outline-none focus:border-accent resize-none"
              />
            </Field>
            <Field label="Alt Text">
              <input
                value={media.alt}
                onChange={(e) => onChange({ alt: e.target.value })}
                className="w-full bg-transparent border-b border-border-subtle text-sm py-1.5 focus:outline-none focus:border-accent"
              />
            </Field>
            <Field label="Position Tags · Stage Visibility">
              <div className="flex flex-wrap gap-1.5">
                {positions.map((p) => {
                  const active = media.positions.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => togglePosition(p)}
                      className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] border transition-colors ${
                        active
                          ? "border-accent text-accent bg-accent/5"
                          : "border-border-subtle text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </Field>
            {media.positions.includes("BEST PHOTOGRAPHY") && (
              <>
                <Field label="Photographer">
                  <select
                    value={media.photographerId ?? ""}
                    onChange={(e) => onChange({ photographerId: e.target.value || undefined })}
                    className="w-full bg-surface-2 border border-border-subtle px-2.5 py-2 text-xs focus:outline-none focus:border-accent"
                  >
                    <option value="">— Select photographer —</option>
                    {filteredPhotographers.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </Field>
                <div className="pt-1">
                  <AdminButton
                    variant="accent"
                    onClick={handlePublishPortfolio}
                    disabled={!media.photographerId}
                    className="w-full py-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    Publish Portfolio
                  </AdminButton>
                </div>
              </>
            )}
            <Field label="Sponsor">
              <select
                value={media.sponsorId ?? ""}
                onChange={(e) => onChange({ sponsorId: e.target.value || undefined })}
                className="w-full bg-surface-2 border border-border-subtle px-2.5 py-2 text-xs focus:outline-none focus:border-accent"
              >
                <option value="">— No sponsor —</option>
                {sponsors.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} · {s.type}</option>
                ))}
              </select>
            </Field>
          </>
        )}

        {/* Portfolio Updated Popup Modal */}
        {showPublishPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background border border-border-subtle w-full max-w-md rounded shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold tracking-tight">Portfolio Updated</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Best Photography portfolio has been updated successfully.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPublishPopup(false)}
                  className="bg-accent hover:bg-accent/90 text-white font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded transition-colors shadow-md"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "shop" && (
          <>
            <div className="flex items-center justify-between">
              <div className="editorial-label text-muted-foreground">Shoppable Looks</div>
              <button
                onClick={addShopItem}
                className="editorial-label text-accent border border-accent/30 px-2.5 py-1 hover:bg-accent/5 transition-colors inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            {media.shopItems.length === 0 && (
              <div className="border border-dashed border-border-subtle text-center py-6 text-xs text-muted-foreground">
                No shoppable items yet. Add a dress, heels, handbag, earrings…
              </div>
            )}

            <div className="space-y-2">
              {media.shopItems.map((item) => {
                const preset = PRODUCTS.find((p) => p.id === item.productId);
                return (
                  <div key={item.id} className="border border-border-subtle bg-surface-2 p-3 space-y-2 group/item">
                    <div className="flex items-start gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-accent mt-1" />
                      <div className="flex-1 space-y-2">
                        <select
                          value={item.productId ?? ""}
                          onChange={(e) => {
                            const pid = e.target.value || undefined;
                            const p = PRODUCTS.find((x) => x.id === pid);
                            updateShopItem(item.id, {
                              productId: pid,
                              name: p ? p.name : item.name,
                            });
                          }}
                          className="w-full bg-background border border-border-subtle px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
                        >
                          <option value="">— Custom item —</option>
                          {PRODUCTS.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} · {p.price}</option>
                          ))}
                        </select>
                        <input
                          value={item.name}
                          onChange={(e) => updateShopItem(item.id, { name: e.target.value })}
                          placeholder="Item name · e.g. Silk Slip Dress"
                          className="w-full bg-transparent border-b border-border-subtle text-sm py-1 focus:outline-none focus:border-accent"
                        />
                        <div className="flex items-center gap-2 border-b border-border-subtle">
                          <LinkIcon className="w-3 h-3 text-muted-foreground" />
                          <input
                            value={item.url}
                            onChange={(e) => updateShopItem(item.id, { url: e.target.value })}
                            placeholder="https://…"
                            className="w-full bg-transparent text-xs py-1 focus:outline-none"
                          />
                        </div>
                        {preset && (
                          <div className="flex items-center gap-2 pt-1">
                            <img src={preset.image} alt={preset.name} className="w-10 h-12 object-cover" />
                            <div className="editorial-label text-muted-foreground">
                              {preset.house} · {preset.price}
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeShopItem(item.id)}
                        className="p-1 text-muted-foreground hover:text-rose-400 transition-colors opacity-50 group-hover/item:opacity-100"
                        title="Remove item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the photo and all its credits, tags and shoppable items from the contestant's portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { onDelete(); setConfirmDelete(false); }}>
              Delete Photo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="editorial-label text-muted-foreground mb-1.5">{label}</div>
      {children}
    </div>
  );
}

/* ============================================================
 * UPLOAD ZONE
 * ============================================================ */
function UploadZone({ onUpload }: { onUpload: (url: string) => void }) {
  const [drag, setDrag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
          const url = URL.createObjectURL(file);
          onUpload(url);
        }
      }}
      className={`border border-dashed ${drag ? "border-accent bg-accent/[0.04]" : "border-border-subtle"} aspect-[3/4] flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:border-accent transition-colors`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="w-12 h-12 border border-foreground/30 rounded-full flex items-center justify-center mb-4">
        <Upload className="w-4 h-4" />
      </div>
      <div className="editorial-label text-foreground/80">Upload / Drop Editorial Frame</div>
      <div className="text-[11px] text-muted-foreground mt-2 max-w-[200px]">
        JPG · PNG · TIFF up to 30MB. Portrait 3:4 recommended.
      </div>
    </div>
  );
}

/* ============================================================
 * RESERVE PROMOTION
 * ============================================================ */
function ReservePromotionPanel({
  vacant, candidate, onCancel, onConfirm,
}: { vacant: Finalist; candidate: Finalist; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="p-8">
      <div className="editorial-label text-accent mb-2">Reserve Promotion Workflow</div>
      <h3 className="font-serif text-2xl mb-2">Confirm lineup replacement</h3>
      <p className="text-xs text-muted-foreground max-w-md">
        Disabling an enabled finalist promotes the highest-ranked reserve into the live lineup. The operation is recorded in audit history.
      </p>

      <div className="grid grid-cols-2 gap-px bg-border-subtle mt-8">
        <PromoteSide title="Vacating Rank" finalist={vacant} tone="danger" />
        <PromoteSide title="Promoting" finalist={candidate} tone="accent" />
      </div>

      <div className="mt-6 p-4 bg-surface-2 border border-border-subtle flex items-center gap-3 text-xs">
        <Shield className="w-4 h-4 text-accent" />
        <span className="text-muted-foreground">
          Rank <span className="text-foreground">{String(vacant.rank).padStart(2, "0")}</span> will be filled by <span className="text-foreground">{candidate.contestant.name}</span>.
        </span>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <AdminButton variant="ghost" onClick={onCancel}>Cancel</AdminButton>
        <AdminButton variant="accent" onClick={onConfirm}>Confirm Promotion</AdminButton>
      </div>
    </div>
  );
}

function PromoteSide({ title, finalist, tone }: { title: string; finalist: Finalist; tone: "danger" | "accent" }) {
  return (
    <div className="bg-background p-5">
      <div className={`editorial-label mb-3 ${tone === "accent" ? "text-accent" : "text-rose-300"}`}>{title}</div>
      <div className="flex items-center gap-3">
        <img src={featuredImage(finalist)} alt="" className="w-16 h-20 object-cover" />
        <div>
          <div className="font-serif text-lg leading-tight">{finalist.contestant.name}</div>
          <div className="editorial-label text-muted-foreground mt-1">
            {finalist.contestant.country} · Score {finalist.score.toFixed(2)}
          </div>
          <div className="editorial-label text-muted-foreground mt-0.5">
            Current rank · {String(finalist.rank).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}
