import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as useAppStore, A as AdminLayout, i as AdminButton, g as StatusChip, D as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, q as DialogFooter } from "./router-C0nupAs3.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { b as ChevronLeft, u as Radio, A as ArrowRight, C as Crown, h as Save, n as Sparkles, V as Check, ag as Image, X, P as Plus, T as Trash2, ap as Calendar, ao as Clock } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "node:fs";
import "node:path";
import "../_libs/xlsx.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const STAGES = [{
  key: "TOP_16",
  label: "Top 16",
  slots: 16
}, {
  key: "TOP_8",
  label: "Top 8",
  slots: 8
}, {
  key: "TOP_4",
  label: "Top 4",
  slots: 4
}, {
  key: "FINALS",
  label: "Finals",
  slots: 2
}, {
  key: "WINNER",
  label: "Winner",
  slots: 1
}];
const ALL_COUNTRIES_MAP = {
  global: {
    id: "global",
    name: "Global",
    year: "2026"
  },
  india: {
    id: "india",
    name: "India",
    year: "2026"
  },
  usa: {
    id: "usa",
    name: "United States",
    year: "2026"
  },
  uk: {
    id: "uk",
    name: "United Kingdom",
    year: "2026"
  },
  france: {
    id: "france",
    name: "France",
    year: "2026"
  },
  brazil: {
    id: "brazil",
    name: "Brazil",
    year: "2026"
  }
};
function CountryLogo({
  countryName,
  className
}) {
  const [whiteLogo, setWhiteLogo] = reactExports.useState(null);
  const [blackLogo, setBlackLogo] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let activeName = countryName;
    if (activeName.toLowerCase() === "global") {
      activeName = "Globe";
    }
    fetch(`/api/countries-logos?country=${encodeURIComponent(activeName)}`).then((res) => res.json()).then((data) => {
      if (data.whiteLogo) setWhiteLogo(data.whiteLogo);
      if (data.blackLogo) setBlackLogo(data.blackLogo);
    }).catch((err) => console.error("Error loading country logo:", err));
  }, [countryName]);
  if (!whiteLogo && !blackLogo) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-xl tracking-wider text-foreground select-none opacity-80 uppercase text-center", children: countryName });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [
    whiteLogo && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: whiteLogo, alt: countryName, className: `${className} dark:block hidden` }),
    blackLogo && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: blackLogo, alt: countryName, className: `${className} dark:hidden block` }),
    !blackLogo && whiteLogo && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: whiteLogo, alt: countryName, className })
  ] });
}
function makeDefaultConfig(slots) {
  return {
    lineup: Array(slots).fill(""),
    customPhotos: {},
    sponsors: [],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    status: "draft"
  };
}
function makeInitialCountryConfig() {
  return {
    TOP_16: makeDefaultConfig(16),
    TOP_8: makeDefaultConfig(8),
    TOP_4: makeDefaultConfig(4),
    FINALS: makeDefaultConfig(2),
    WINNER: makeDefaultConfig(1)
  };
}
function LiveContestAdmin() {
  const {
    state
  } = useAppStore();
  const [countryId, setCountryId] = reactExports.useState(null);
  const [publishedIds, setPublishedIds] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("reevibes:published-lineups");
        if (raw) setPublishedIds(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
      const handleStorage = (e) => {
        if (e.key === "reevibes:published-lineups") {
          try {
            const raw = window.localStorage.getItem("reevibes:published-lineups");
            if (raw) setPublishedIds(JSON.parse(raw));
          } catch {
          }
        }
        if (e.key === "reevibes:live-contest:by-country") {
          try {
            const raw = window.localStorage.getItem("reevibes:live-contest:by-country");
            if (raw) setByCountry(JSON.parse(raw));
          } catch {
          }
        }
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, []);
  const countries = reactExports.useMemo(() => {
    try {
      const rawMeta = window.localStorage.getItem("reevibes:published-countries-meta");
      const meta = rawMeta ? JSON.parse(rawMeta) : {};
      return publishedIds.map((id) => {
        return meta[id] || ALL_COUNTRIES_MAP[id] || {
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          year: "2026"
        };
      });
    } catch {
      return [];
    }
  }, [publishedIds]);
  const [byCountry, setByCountry] = reactExports.useState(() => {
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
  const saveToLocalStorage = (next) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("reevibes:live-contest:by-country", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
    }
  };
  const handleStageConfigChange = (cId, stage, cfg) => {
    setByCountry((prev) => {
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
  const country = countries.find((c) => c.id === countryId) || null;
  const currentCountryConfig = country ? byCountry[country.id] || makeInitialCountryConfig() : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { eyebrow: "Module · Live Contest Studio", title: country ? `${country.name} ${country.year}` : "Live Contest", actions: country ? /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminButton, { variant: "outline", onClick: () => setCountryId(null), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5 inline mr-2" }),
    "All Countries"
  ] }) : null, children: !country ? /* @__PURE__ */ jsxRuntimeExports.jsx(CountrySelector, { countries, onPick: setCountryId }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CountryStudio, { country, data: currentCountryConfig, onChange: (stage, cfg) => handleStageConfigChange(country.id, stage, cfg) }) });
}
function CountrySelector({
  countries,
  onPick
}) {
  if (countries.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto my-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-8 h-8 mx-auto text-muted-foreground mb-4 opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl mb-2", children: "No Published Lineups" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: "To configure the Live Contest, you must first publish a lineup for a country in the Top 16 Dashboard." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/admin/top-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", children: "Go to Top 16 Dashboard" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-6", children: "Published Live Countries · Season 2026" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: countries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onPick(c.id), className: "group text-left border border-border-subtle hover:border-accent transition-all duration-300 p-8 bg-surface flex flex-col justify-between min-h-[220px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground", children: [
          "Live · ",
          c.year
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 flex items-center justify-center my-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CountryLogo, { countryName: c.name, className: "max-h-12 w-auto max-w-[80%] object-contain" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border-subtle/30 flex items-center justify-between text-xs text-accent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-3 h-3 animate-pulse" }),
          " Enter Studio"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })
      ] })
    ] }, c.id)) })
  ] });
}
function CountryStudio({
  country,
  data,
  onChange
}) {
  const {
    state
  } = useAppStore();
  const [stage, setStage] = reactExports.useState("TOP_16");
  const cfg = data[stage] || makeDefaultConfig(STAGES.find((s) => s.key === stage).slots);
  const publishedContestants = reactExports.useMemo(() => {
    const selectedYear = 2026;
    const proceededApps = state.applications.filter((a) => {
      const matchCountryName = (aName, bName) => {
        const norm = (s) => {
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
    let savedStatuses = {};
    try {
      const raw = window.localStorage.getItem("reevibes:top16:statuses");
      if (raw) savedStatuses = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return proceededApps.map((app, idx) => {
      const status = savedStatuses[app.contestantId] || (idx < 16 ? "Enabled" : "Reserve");
      let mediaItems = [];
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
    }).filter((c) => c.status === "Enabled");
  }, [state, country]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 border-b border-border-subtle overflow-x-auto", children: STAGES.map((s) => {
      const active = s.key === stage;
      const published = data[s.key]?.status === "published";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setStage(s.key), className: `relative px-5 py-3 editorial-label transition-colors shrink-0 ${active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          s.label,
          published && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent" })
        ] }),
        active && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { layoutId: "live-stage-tab-indicator", className: "absolute -bottom-px left-0 right-0 h-0.5 bg-accent" })
      ] }, s.key);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StageStudio, { country, stageKey: stage, cfg, contestants: publishedContestants, onChange: (next) => onChange(stage, next) })
  ] });
}
function StageStudio({
  country,
  stageKey,
  cfg,
  contestants,
  onChange
}) {
  const slots = STAGES.find((s) => s.key === stageKey).slots;
  const [photoPicker, setPhotoPicker] = reactExports.useState(null);
  const [showConfirmPublish, setShowConfirmPublish] = reactExports.useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = reactExports.useState(false);
  const [showDraftSuccess, setShowDraftSuccess] = reactExports.useState(false);
  const [showAngelsSuccess, setShowAngelsSuccess] = reactExports.useState(false);
  const [isPostingToAngels, setIsPostingToAngels] = reactExports.useState(false);
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          countryId: country.id,
          countryName: country.name,
          year: country.year,
          logoUrl,
          winnerContestantId: winnerId,
          winnerName: contestant.name,
          winnerPhotoUrl: photoUrl
        })
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
  const syncPublishedSponsors = async (status, sponsorsList) => {
    try {
      await fetch("/api/sponsors?action=save-published-sponsors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publishedSectionId: `live-contest-${country.id}-${stageKey}`,
          countryId: country.id,
          countryName: country.name,
          stageName: stageKey,
          selectedSponsorIds: sponsorsList.map((s) => s.sponsorId),
          publishStatus: status
        })
      });
    } catch (err) {
      console.error("Error saving published sponsors mapping:", err);
    }
  };
  const setSlot = (index, id) => {
    const lineup = [...cfg.lineup];
    const customPhotos = {
      ...cfg.customPhotos
    };
    const oldId = lineup[index];
    if (oldId && oldId !== id) {
      delete customPhotos[oldId];
    }
    lineup[index] = id;
    onChange({
      ...cfg,
      lineup,
      customPhotos
    });
  };
  const setContestantPhoto = (contestantId, url) => {
    onChange({
      ...cfg,
      customPhotos: {
        ...cfg.customPhotos,
        [contestantId]: url
      }
    });
    setPhotoPicker(null);
  };
  const getDropdownOptions = (currentIndex) => {
    const assigned = new Set(cfg.lineup.filter((_, idx) => idx !== currentIndex));
    return contestants.filter((c) => !assigned.has(c.id));
  };
  const getContestant = (id) => {
    return contestants.find((c) => c.id === id) || null;
  };
  const stageTagMap = {
    TOP_16: "TOP 16",
    TOP_8: "TOP 8",
    TOP_4: "TOP 4",
    FINALS: "FINALS",
    WINNER: "WINNER"
  };
  const currentStageTag = stageTagMap[stageKey];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
    stageKey === "WINNER" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-surface border border-border-subtle p-8 max-w-xl mx-auto rounded", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-5 h-5 text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: "Winner Coronation Selection" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground block", children: "Select Final Winner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantDropdown, { value: cfg.lineup[0] || "", options: getDropdownOptions(0), onChange: (val) => setSlot(0, val) }),
        cfg.lineup[0] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantStageCard, { contestant: getContestant(cfg.lineup[0]), stagePhoto: cfg.customPhotos[cfg.lineup[0]], stageTag: currentStageTag, onChangePhoto: () => setPhotoPicker({
            contestantId: cfg.lineup[0],
            index: 0
          }), onClear: () => setSlot(0, "") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { onClick: handlePostToAngels, disabled: isPostingToAngels, className: "w-full justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 border-none", children: isPostingToAngels ? "Posting..." : "Post in Angels" }) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent", children: "Faceoff Grid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-serif text-2xl mt-1", children: [
            stageKey.replace("_", " "),
            " Matches"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: cfg.status === "published" ? "Published" : "Draft", tone: cfg.status === "published" ? "accent" : "warn" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center border border-border-subtle bg-surface p-6 rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground border-b border-border-subtle/30 pb-2", children: "Left Side" }),
          Array.from({
            length: slots / 2
          }).map((_, i) => {
            const cId = cfg.lineup[i];
            const c = getContestant(cId);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border border-border-subtle/50 bg-background/50 p-3 rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Frame Bar #",
                i + 1
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantDropdown, { value: cId || "", options: getDropdownOptions(i), onChange: (val) => setSlot(i, val) }),
              c && /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantStageCard, { contestant: c, stagePhoto: cfg.customPhotos[cId], stageTag: currentStageTag, onChangePhoto: () => setPhotoPicker({
                contestantId: cId,
                index: i
              }), onClear: () => setSlot(i, "") })
            ] }, `left-${i}`);
          })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center px-4 self-stretch border-r border-l border-border-subtle/30 bg-surface-2/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif italic text-4xl md:text-5xl text-accent/80 font-bold select-none", children: "vs" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground border-b border-border-subtle/30 pb-2 text-right", children: "Right Side" }),
          Array.from({
            length: slots / 2
          }).map((_, i) => {
            const idx = slots / 2 + i;
            const cId = cfg.lineup[idx];
            const c = getContestant(cId);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border border-border-subtle/50 bg-background/50 p-3 rounded text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between text-xs text-muted-foreground flex-row-reverse", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Frame Bar #",
                slots / 2 + i + 1
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantDropdown, { value: cId || "", options: getDropdownOptions(idx), onChange: (val) => setSlot(idx, val) }),
              c && /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantStageCard, { contestant: c, stagePhoto: cfg.customPhotos[cId], stageTag: currentStageTag, onChangePhoto: () => setPhotoPicker({
                contestantId: cId,
                index: idx
              }), onClear: () => setSlot(idx, ""), reverse: true })
            ] }, `right-${i}`);
          })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: photoPicker !== null, onOpenChange: (open) => !open && setPhotoPicker(null), children: photoPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(StagePhotoSelectorModal, { contestant: getContestant(photoPicker.contestantId), stageTag: currentStageTag, currentSelection: cfg.customPhotos[photoPicker.contestantId], onSelect: (url) => setContestantPhoto(photoPicker.contestantId, url), onClose: () => setPhotoPicker(null) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SponsorManagementSection, { cfg, countryName: country.name, onChange }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StageDatesSection, { cfg, onChange }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-0 -mx-6 lg:-mx-10 px-6 lg:px-10 py-4 bg-background/95 backdrop-blur border-t border-border-subtle flex items-center justify-between z-30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        "Stage Status · ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-wider", children: cfg.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminButton, { variant: "outline", onClick: () => {
          const updated = {
            ...cfg,
            status: "draft"
          };
          onChange(updated);
          syncPublishedSponsors("draft", updated.sponsors);
          setShowDraftSuccess(true);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5 inline mr-2" }),
          "Save Draft"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminButton, { variant: "accent", onClick: () => {
          setShowConfirmPublish(true);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 inline mr-2" }),
          "Publish Stage"
        ] })
      ] })
    ] }),
    showDraftSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl font-bold tracking-tight", children: "Draft Saved" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: "Stage configuration saved as draft successfully." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowDraftSuccess(false), className: "bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md", children: "OK" }) })
    ] }) }),
    showConfirmPublish && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl font-bold tracking-tight", children: "Confirm Publish Stage" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: "Are you sure you want to publish this stage to live?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowConfirmPublish(false), className: "border border-border-subtle dark:border-zinc-800 hover:bg-surface text-foreground font-semibold text-sm px-6 py-2 rounded transition-colors", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setShowConfirmPublish(false);
          onChange({
            ...cfg,
            status: "published"
          });
          setShowPublishSuccess(true);
        }, className: "bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md", children: "OK / Publish" })
      ] })
    ] }) }),
    showPublishSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl font-bold tracking-tight", children: "Stage Published" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: "Stage published to User Public Live Contest successfully." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowPublishSuccess(false), className: "bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md", children: "OK" }) })
    ] }) }),
    showAngelsSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl font-bold tracking-tight", children: "Posted in Angels" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: "Winner image has been posted to Angels Dashboard successfully." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAngelsSuccess(false), className: "bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md", children: "OK" }) })
    ] }) })
  ] });
}
function ContestantDropdown({
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value, onChange: (e) => onChange(e.target.value), className: "w-full bg-surface border border-border-subtle px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent [color-scheme:dark]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select Contestant —" }),
    options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: o.id, children: [
      o.name,
      " (",
      o.country,
      ")"
    ] }, o.id))
  ] });
}
function ContestantStageCard({
  contestant,
  stagePhoto,
  stageTag,
  onChangePhoto,
  onClear,
  reverse = false
}) {
  const photo = stagePhoto || contestant.image;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 p-2 bg-surface border border-border-subtle/80 ${reverse ? "flex-row-reverse text-right" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-12 h-16 bg-surface-2 overflow-hidden shrink-0 border border-border-subtle/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photo, alt: contestant.name, className: "w-full h-full object-cover" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-sm truncate font-medium", children: contestant.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: contestant.country }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 mt-1.5 ${reverse ? "justify-end" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onChangePhoto, className: "text-[10px] uppercase tracking-wider text-accent border border-accent/20 px-2 py-0.5 hover:bg-accent/5 transition-colors flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-2.5 h-2.5" }),
          " Photo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onClear, className: "text-[10px] uppercase tracking-wider text-muted-foreground border border-border-subtle px-2 py-0.5 hover:text-foreground hover:bg-surface-2 transition-colors flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-2.5 h-2.5" }),
          " Clear"
        ] })
      ] })
    ] })
  ] });
}
function StagePhotoSelectorModal({
  contestant,
  stageTag,
  currentSelection,
  onSelect,
  onClose
}) {
  const filteredPhotos = reactExports.useMemo(() => {
    if (!contestant || !Array.isArray(contestant.media)) return [];
    return contestant.media.filter((m) => m.positions && m.positions.includes(stageTag));
  }, [contestant, stageTag]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl bg-background border border-border-subtle [color-scheme:dark]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-serif text-xl", children: [
        "Select ",
        stageTag,
        " Photo"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Showing only campaign images of ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: contestant.name }),
        " tagged as ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-semibold", children: stageTag }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 my-4 max-h-[50vh] overflow-y-auto p-1", children: [
      filteredPhotos.map((m) => {
        const isSelected = currentSelection === m.image || !currentSelection && contestant.image === m.image;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onSelect(m.image), className: `relative aspect-[3/4] border overflow-hidden transition-all hover:scale-[1.02] ${isSelected ? "border-accent ring-1 ring-accent" : "border-border-subtle hover:border-foreground/50"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.image, alt: m.alt || "Campaign frame", className: "w-full h-full object-cover" }),
          isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 bg-accent text-white p-1 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }) })
        ] }, m.id);
      }),
      filteredPhotos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full border border-dashed border-border-subtle p-8 text-center text-sm text-muted-foreground", children: [
        "No photos found for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: contestant.name }),
        " tagged with ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-semibold", children: stageTag }),
        ". Please assign tags in the Top 16 Dashboard first."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: onClose, children: "Close" }) })
  ] });
}
function SponsorManagementSection({
  cfg,
  countryName,
  onChange
}) {
  const [pickerOpen, setPickerOpen] = reactExports.useState(false);
  const [picked, setPicked] = reactExports.useState(/* @__PURE__ */ new Set());
  const [sponsors, setSponsors] = reactExports.useState([]);
  reactExports.useEffect(() => {
    fetch(`/api/sponsors?action=get-sponsors-by-country&country=${encodeURIComponent(countryName)}`).then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) {
        setSponsors(data);
      }
    }).catch((err) => console.error("Error loading country sponsors:", err));
  }, [countryName]);
  const openPicker = () => {
    setPicked(new Set(cfg.sponsors.map((s) => s.sponsorId)));
    setPickerOpen(true);
  };
  const togglePick = (id) => {
    setPicked((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const confirmPicks = () => {
    const existing = new Map(cfg.sponsors.map((s) => [s.sponsorId, s]));
    const next = Array.from(picked).map((spId, idx) => {
      const original = existing.get(spId);
      const sp = sponsors.find((x) => x.id === spId);
      return original ?? {
        id: `sp-${spId}-${Date.now()}`,
        sponsorId: spId,
        url: sp?.url || "",
        order: idx + 1
      };
    });
    onChange({
      ...cfg,
      sponsors: next.sort((a, b) => a.order - b.order)
    });
    setPickerOpen(false);
  };
  const updateSponsor = (id, patch) => {
    const next = cfg.sponsors.map((s) => s.id === id ? {
      ...s,
      ...patch
    } : s);
    if (patch.order !== void 0) {
      next.sort((a, b) => a.order - b.order);
    }
    onChange({
      ...cfg,
      sponsors: next
    });
  };
  const removeSponsor = (id) => {
    onChange({
      ...cfg,
      sponsors: cfg.sponsors.filter((s) => s.id !== id)
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border-subtle pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent", children: "Stage Sponsors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl mt-1", children: "Sponsor Management" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminButton, { variant: "outline", onClick: openPicker, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 inline mr-1.5" }),
        " Add Sponsor"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [
      cfg.sponsors.map((s, i) => {
        const sp = sponsors.find((x) => x.id === s.sponsorId);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle bg-surface p-4 flex items-center gap-3 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden bg-white border border-border-subtle rounded shrink-0", style: {
            width: "48px",
            height: "32px",
            aspectRatio: "5/3"
          }, children: sp?.logo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sp.logo, alt: "", className: "absolute inset-0 w-full h-full object-contain select-none pointer-events-none", style: {
            transform: `translate(${sp.logoX || 0}%, ${sp.logoY || 0}%) scale(${sp.logoZoom || 1})`,
            transformOrigin: "center"
          } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center text-[10px] text-neutral-400 font-serif font-bold bg-neutral-100 uppercase", children: sp?.name ? sp.name.split(" ").map((w) => w[0]).slice(0, 2).join("") : "SP" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-sm truncate font-medium", children: sp?.name ?? "Sponsor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase", children: sp?.type ?? "Sponsor" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: s.url, onChange: (e) => updateSponsor(s.id, {
                url: e.target.value
              }), placeholder: "https://sponsor.com", className: "flex-1 bg-background border border-border-subtle px-2 py-1 text-xs outline-none focus:border-accent rounded [color-scheme:dark]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: s.order, onChange: (e) => updateSponsor(s.id, {
                order: parseInt(e.target.value) || 0
              }), placeholder: "Order", title: "Order", className: "w-16 bg-background border border-border-subtle px-2 py-1 text-xs outline-none focus:border-accent text-center rounded [color-scheme:dark]" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeSponsor(s.id), className: "text-muted-foreground hover:text-rose-400 p-2 border border-transparent hover:border-border-subtle rounded transition-colors shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
        ] }, s.id);
      }),
      cfg.sponsors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2 border border-dashed border-border-subtle p-6 text-center text-sm text-muted-foreground", children: "No sponsors assigned to this stage. Click Add Sponsor to select sponsors." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: pickerOpen, onOpenChange: setPickerOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg bg-background border border-border-subtle [color-scheme:dark]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-serif text-xl", children: "Select Stage Sponsors" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[50vh] overflow-y-auto divide-y divide-border-subtle border border-border-subtle rounded", children: [
        sponsors.map((sp) => {
          const isOn = picked.has(sp.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => togglePick(sp.id), className: `w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 transition ${isOn ? "bg-surface-2/45" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-5 h-5 border flex items-center justify-center rounded ${isOn ? "bg-accent border-accent text-white" : "border-border-subtle"}`, children: isOn && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden bg-white border border-border-subtle rounded shrink-0", style: {
              width: "40px",
              height: "26px",
              aspectRatio: "5/3"
            }, children: sp.logo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: sp.logo, alt: "", className: "absolute inset-0 w-full h-full object-contain select-none pointer-events-none", style: {
              transform: `translate(${sp.logoX || 0}%, ${sp.logoY || 0}%) scale(${sp.logoZoom || 1})`,
              transformOrigin: "center"
            } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center text-[9px] text-neutral-400 font-serif font-bold bg-neutral-100 uppercase", children: sp.name.split(" ").map((w) => w[0]).slice(0, 2).join("") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-sm font-medium", children: sp.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground text-xs", children: sp.type })
            ] })
          ] }, sp.id);
        }),
        sponsors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center text-xs text-muted-foreground italic", children: [
          "No sponsors assigned to ",
          countryName,
          " or Global in Sponsors Dashboard."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => setPickerOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminButton, { variant: "accent", onClick: confirmPicks, disabled: sponsors.length === 0, children: [
          "Add Selected (",
          picked.size,
          ")"
        ] })
      ] })
    ] }) })
  ] });
}
function StageDatesSection({
  cfg,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border-subtle pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent", children: "Stage Timeline" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl mt-1", children: "Stage Date & Time Range" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PremiumDateTimeField, { label: "Start Parameters", dateValue: cfg.startDate, timeValue: cfg.startTime, onDateChange: (v) => onChange({
        ...cfg,
        startDate: v
      }), onTimeChange: (v) => onChange({
        ...cfg,
        startTime: v
      }), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PremiumDateTimeField, { label: "End Parameters", dateValue: cfg.endDate, timeValue: cfg.endTime, onDateChange: (v) => onChange({
        ...cfg,
        endDate: v
      }), onTimeChange: (v) => onChange({
        ...cfg,
        endTime: v
      }), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-accent" }) })
    ] })
  ] });
}
function PremiumDateTimeField({
  label,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  icon
}) {
  const dateRef = reactExports.useRef(null);
  const timeRef = reactExports.useRef(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle bg-surface p-5 rounded space-y-4 hover:border-accent/40 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "editorial-label text-muted-foreground flex items-center gap-2", children: [
      icon,
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => {
        dateRef.current?.focus();
        dateRef.current?.showPicker?.();
      }, className: "border border-border-subtle bg-surface-2 hover:border-accent/40 transition-colors p-3 flex items-center gap-3 cursor-pointer rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-accent shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-wider text-muted-foreground", children: "Select Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: dateRef, type: "date", value: dateValue, onChange: (e) => onDateChange(e.target.value), onClick: (e) => e.stopPropagation(), className: "bg-transparent outline-none w-full mt-1 text-sm cursor-pointer font-serif [color-scheme:dark]" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => {
        timeRef.current?.focus();
        timeRef.current?.showPicker?.();
      }, className: "border border-border-subtle bg-surface-2 hover:border-accent/40 transition-colors p-3 flex items-center gap-3 cursor-pointer rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-accent shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-wider text-muted-foreground", children: "Select Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: timeRef, type: "time", value: timeValue, onChange: (e) => onTimeChange(e.target.value), onClick: (e) => e.stopPropagation(), className: "bg-transparent outline-none w-full mt-1 text-sm cursor-pointer font-serif [color-scheme:dark]" })
        ] })
      ] })
    ] })
  ] });
}
export {
  LiveContestAdmin as component
};
