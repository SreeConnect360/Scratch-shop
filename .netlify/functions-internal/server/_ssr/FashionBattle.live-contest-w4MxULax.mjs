import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PublicLayout } from "./PublicLayout-u1w3O0qP.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { M as Marquee } from "./Marquee-D1BJev5N.mjs";
import { l as useAppStore, b as useTheme } from "./router-C0nupAs3.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { u as Radio, a6 as Heart, ap as Calendar, ao as Clock, X, L as Lock, a7 as User, s as Star, av as Volume2, aa as Award, C as Crown } from "../_libs/lucide-react.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
const STAGE_LABELS = {
  TOP_16: "Top 16",
  TOP_8: "Top 8",
  TOP_4: "Top 4",
  FINALS: "Finals",
  WINNER: "Winner"
};
const STAGE_TAGS = {
  TOP_16: "TOP 16",
  TOP_8: "TOP 8",
  TOP_4: "TOP 4",
  FINALS: "FINALS",
  WINNER: "WINNER"
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
function LiveContest() {
  const {
    state
  } = useAppStore();
  const [selectedCountryId, setSelectedCountryId] = reactExports.useState(null);
  const [selectedStageKey, setSelectedStageKey] = reactExports.useState(null);
  const [viewingContestantId, setViewingContestantId] = reactExports.useState(null);
  const [byCountryConfig, setByCountryConfig] = reactExports.useState({});
  const [publishedCountryIds, setPublishedCountryIds] = reactExports.useState([]);
  const [publishedCountryMeta, setPublishedCountryMeta] = reactExports.useState({});
  const [controlState, setControlState] = reactExports.useState({});
  const [confirmVoteFor, setConfirmVoteFor] = reactExports.useState(null);
  const [popup, setPopup] = reactExports.useState(null);
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
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
    const interval = setInterval(loadControls, 1e3);
    return () => {
      window.removeEventListener("storage", loadControls);
      clearInterval(interval);
    };
  }, []);
  const publishedCountries = reactExports.useMemo(() => {
    return publishedCountryIds.map((id) => {
      const config = byCountryConfig[id];
      const meta = publishedCountryMeta[id] || {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        year: "2026"
      };
      if (!config) return null;
      const hasPublishedStage = Object.values(config).some((stageCfg) => stageCfg.status === "published");
      if (!hasPublishedStage) return null;
      const publishedStagesCount = Object.values(config).filter((stageCfg) => stageCfg.status === "published").length;
      return {
        ...meta,
        stagesCount: publishedStagesCount,
        config
      };
    }).filter(Boolean);
  }, [publishedCountryIds, byCountryConfig, publishedCountryMeta]);
  const activeCountry = reactExports.useMemo(() => {
    return publishedCountries.find((c) => c.id === selectedCountryId) || null;
  }, [publishedCountries, selectedCountryId]);
  reactExports.useEffect(() => {
    if (activeCountry) {
      const publishedStages = Object.keys(activeCountry.config).filter((key) => activeCountry.config[key]?.status === "published");
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
    const now = /* @__PURE__ */ new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    const resetTimeInMinutes = 0 * 60 + 30;
    if (currentTimeInMinutes < resetTimeInMinutes) {
      const prev = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
      return prev.toISOString().slice(0, 10);
    }
    return now.toISOString().slice(0, 10);
  };
  const dateCycle = getVoteCycleKey();
  const user = state.user;
  const initiateVote = (cId, cName, battleId) => {
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
          const list = raw ? JSON.parse(raw) : [];
          const nextVote = {
            userId: user.id,
            countryId: activeCountry.id,
            stageKey: selectedStageKey,
            battleId,
            contestantId: cId,
            dateCycle
          };
          list.push(nextVote);
          window.localStorage.setItem("reevibes:votes", JSON.stringify(list));
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("reevibes:vote-cast"));
          setPopup("Vote submitted");
          setTimeout(() => setPopup(null), 2e3);
        } catch (e) {
          console.error(e);
        }
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground", children: !activeCountry ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-12 border-b border-border-subtle pb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "editorial-eyebrow text-accent flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 bg-accent rounded-full animate-pulse" }),
          " Live Competition Arena"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-5xl lg:text-7xl", children: "Broadcasting Battles" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-4 max-w-xl", children: "The pageant runway is active. Select a live country channel to review published stages and cast your daily votes." }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [
        publishedCountries.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: i * 0.05, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedCountryId(c.id), className: "group w-full text-left border border-border-subtle hover:border-accent transition-all duration-500 p-8 bg-surface rounded flex flex-col justify-between min-h-[220px] shadow-lg hover:shadow-accent/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground/60", children: [
              "Edition · ",
              c.year
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 flex items-center justify-center my-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CountryLogo, { countryName: c.name, className: "max-h-12 w-auto max-w-[80%] object-contain" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border-subtle flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-mono", children: [
              c.stagesCount,
              " Published Stage",
              c.stagesCount > 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent group-hover:translate-x-1.5 transition-transform flex items-center gap-1 font-semibold uppercase tracking-wider", children: [
              "Enter Live ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightIcon, { className: "w-3.5 h-3.5" })
            ] })
          ] })
        ] }) }, c.id)),
        publishedCountries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full border border-dashed border-border-subtle py-24 text-center rounded max-w-md mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-8 h-8 mx-auto text-muted-foreground/50 mb-4 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl text-foreground/80 mb-2", children: "No Active Broadcasts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mx-auto", children: "There are currently no published stage lineups in progress. Check back later once the administrators release the live frames." })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-16 pt-24 pb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedCountryId(null), className: "text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeftIcon, { className: "w-4 h-4" }),
        " Back to Channels"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "border-b border-border-subtle pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-auto max-w-[200px] flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CountryLogo, { countryName: activeCountry.name, className: "max-h-10 object-contain text-left" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl mt-3 text-foreground/85", children: "Live Stage Orchestration" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 border-b border-border-subtle self-start md:self-auto overflow-x-auto pb-px", children: Object.keys(activeCountry.config).map((key) => {
          const stageCfg = activeCountry.config[key];
          if (stageCfg.status !== "published") return null;
          const active = selectedStageKey === key;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedStageKey(key), className: `relative px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${active ? "text-accent" : "text-muted-foreground hover:text-foreground"}`, children: [
            STAGE_LABELS[key],
            active && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layoutId: "user-stage-indicator", className: "absolute -bottom-px left-0 right-0 h-0.5 bg-accent" })
          ] }, key);
        }) })
      ] }),
      selectedStageKey && /* @__PURE__ */ jsxRuntimeExports.jsx(StageLayoutView, { countryId: activeCountry.id, countryName: activeCountry.name, year: activeCountry.year, stageKey: selectedStageKey, cfg: activeCountry.config[selectedStageKey], controlState, onRequestVoteConfirm: initiateVote, onOpenProfile: (id) => setViewingContestantId(id) })
    ] }) }),
    confirmVoteFor && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-md rounded shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5 fill-current" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl font-bold tracking-tight", children: "Confirm Your Vote" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: [
        "Are you sure you want to cast your daily vote for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: confirmVoteFor.contestantName }),
        "? This action cannot be undone."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmVoteFor(null), className: "border border-border-subtle hover:bg-surface text-foreground font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          confirmVoteFor.onConfirm();
          setConfirmVoteFor(null);
        }, className: "bg-accent hover:bg-accent/90 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors shadow-md", children: "Confirm Vote" })
      ] })
    ] }) }),
    popup && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, exit: {
      opacity: 0,
      y: 20
    }, className: "fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white border border-zinc-800 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl z-50 font-mono text-sm uppercase tracking-wider", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "❤️" }),
      " ",
      popup
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: viewingContestantId && selectedCountryId && selectedStageKey && activeCountry && /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantStageProfileModal, { contestantId: viewingContestantId, countryId: selectedCountryId, countryName: activeCountry.name, year: activeCountry.year, stageKey: selectedStageKey, controlState, onRequestVoteConfirm: initiateVote, onClose: () => setViewingContestantId(null) }) })
  ] });
}
function StageLayoutView({
  countryId,
  countryName,
  year,
  stageKey,
  cfg,
  controlState,
  onRequestVoteConfirm,
  onOpenProfile
}) {
  const {
    state
  } = useAppStore();
  const slots = STAGES.find((s) => s.key === stageKey).slots;
  const isWinner = stageKey === "WINNER";
  const battles = reactExports.useMemo(() => {
    if (isWinner) return [];
    const arr = [];
    const half = slots / 2;
    for (let i = 0; i < half; i++) {
      arr.push({
        id: `battle-${stageKey}-${i}`,
        leftId: cfg.lineup[i],
        rightId: cfg.lineup[half + i]
      });
    }
    return arr;
  }, [cfg.lineup, slots, stageKey, isWinner]);
  const [dbSponsors, setDbSponsors] = reactExports.useState([]);
  const [publishedMappings, setPublishedMappings] = reactExports.useState([]);
  reactExports.useEffect(() => {
    fetch("/api/sponsors?action=get-sponsors").then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) setDbSponsors(data);
    }).catch((err) => console.error("Error fetching db sponsors:", err));
    fetch("/api/sponsors?action=get-published-sponsors").then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) setPublishedMappings(data);
    }).catch((err) => console.error("Error fetching published mappings:", err));
  }, []);
  const stageSponsors = reactExports.useMemo(() => {
    const mapping = publishedMappings.find((m) => m.publishedSectionId === `live-contest-${countryId}-${stageKey}` || m.countryId === countryId && m.stageName === stageKey);
    if (!mapping || !Array.isArray(mapping.selectedSponsorIds)) {
      return (cfg.sponsors || []).map((s) => {
        const original = dbSponsors.find((x) => x.id === s.sponsorId);
        return original ? {
          ...original,
          ...s
        } : null;
      }).filter(Boolean);
    }
    return mapping.selectedSponsorIds.map((spId) => {
      const original = dbSponsors.find((x) => x.id === spId);
      return original ? {
        ...original
      } : null;
    }).filter(Boolean);
  }, [publishedMappings, dbSponsors, countryId, stageKey, cfg.sponsors]);
  const formattedDates = reactExports.useMemo(() => {
    if (!cfg.startDate) return null;
    const startStr = `${cfg.startDate} ${cfg.startTime || "00:00"}`;
    const endStr = `${cfg.endDate} ${cfg.endTime || "23:59"}`;
    return {
      start: new Date(startStr).toLocaleString(),
      end: new Date(endStr).toLocaleString()
    };
  }, [cfg.startDate, cfg.startTime, cfg.endDate, cfg.endTime]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-12", children: [
    formattedDates && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-zinc-900 border border-zinc-800 p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Broadcast Window: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-zinc-200", children: formattedDates.start }),
          " to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-zinc-200", children: formattedDates.end })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-accent bg-accent/5 px-2.5 py-1 border border-accent/20 rounded uppercase font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 animate-pulse" }),
        " Reset daily @ 12:30 AM"
      ] })
    ] }),
    isWinner ? /* @__PURE__ */ jsxRuntimeExports.jsx(WinnerCoronationView, { winnerId: cfg.lineup[0], customPhoto: cfg.customPhotos[cfg.lineup[0]], onOpenProfile }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: battles.map((b, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(BattlePairCard, { battleId: b.id, leftId: b.leftId, rightId: b.rightId, customPhotos: cfg.customPhotos, countryId, countryName, year, stageKey, index: idx, controlState, onRequestVoteConfirm, onOpenProfile }, b.id)) }),
    stageSponsors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-8 border-t border-zinc-900 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-zinc-500 mb-6 text-center", children: "Stage Presented By" }),
      stageSponsors.length > 5 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Marquee, { speed: 35, children: stageSponsors.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(PublicSponsorLogoFrame, { s }, `${s.id}-${idx}`)) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-center gap-6", children: stageSponsors.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(PublicSponsorLogoFrame, { s }, s.id)) })
    ] })
  ] });
}
function PublicSponsorLogoFrame({
  s
}) {
  const isLink = !!s.url;
  const content = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden bg-white border border-border-subtle rounded transition-transform hover:scale-[1.02] flex items-center justify-center shrink-0 shadow-sm", style: {
    width: "120px",
    height: "72px",
    aspectRatio: "5/3",
    padding: "8px"
  }, children: s.logo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.logo, alt: s.name, className: "absolute inset-0 w-full h-full object-contain select-none pointer-events-none", style: {
    transform: `translate(${s.logoX || 0}%, ${s.logoY || 0}%) scale(${s.logoZoom || 1})`,
    transformOrigin: "center"
  } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center text-sm text-neutral-400 font-serif font-bold bg-neutral-100 uppercase", children: s.name ? s.name.split(" ").map((w) => w[0]).slice(0, 2).join("") : "SP" }) });
  if (isLink) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: s.url, target: "_blank", rel: "noopener noreferrer", className: "cursor-pointer block", children: content });
  }
  return content;
}
function WinnerCoronationView({
  winnerId,
  customPhoto,
  onOpenProfile
}) {
  const {
    state
  } = useAppStore();
  const c = reactExports.useMemo(() => {
    return state.applications.find((a) => a.contestantId === winnerId) || null;
  }, [state, winnerId]);
  if (!c) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-zinc-800 p-12 text-center rounded", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-8 h-8 text-zinc-700 mx-auto mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-zinc-500", children: "Coronation pending release." })
    ] });
  }
  const image = customPhoto || c.photos?.portrait || c.photos?.fullBody || "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto border border-zinc-800 bg-zinc-900/40 p-6 rounded shadow-xl text-center space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-accent flex items-center justify-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-4 h-4 animate-bounce" }),
      " Coronation Winner"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onOpenProfile(c.contestantId), className: "block w-full group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[3/4] overflow-hidden border border-zinc-800 rounded relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: image, alt: c.fullName, className: "w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1500ms]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-0 right-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-accent text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest shadow-md", children: "Winner" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-3xl font-bold", children: c.fullName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-zinc-400 font-mono mt-1 uppercase tracking-wider", children: c.country })
    ] })
  ] });
}
function BattlePairCard({
  battleId,
  leftId,
  rightId,
  customPhotos,
  countryId,
  countryName,
  year,
  stageKey,
  index,
  controlState,
  onRequestVoteConfirm,
  onOpenProfile
}) {
  const {
    state
  } = useAppStore();
  const {
    theme
  } = useTheme();
  const [votes, setVotes] = reactExports.useState({});
  const getVoteCycleKey = () => {
    const now = /* @__PURE__ */ new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    const resetTimeInMinutes = 0 * 60 + 30;
    if (currentTimeInMinutes < resetTimeInMinutes) {
      const prev = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
      return prev.toISOString().slice(0, 10);
    }
    return now.toISOString().slice(0, 10);
  };
  const dateCycle = getVoteCycleKey();
  const user = state.user;
  reactExports.useEffect(() => {
    const loadState = () => {
      try {
        const raw = window.localStorage.getItem("reevibes:votes");
        if (raw) {
          const list = JSON.parse(raw);
          const map = {};
          list.forEach((v) => {
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
    const interval = setInterval(loadState, 1e3);
    return () => {
      window.removeEventListener("storage", loadState);
      window.removeEventListener("reevibes:vote-cast", loadState);
      clearInterval(interval);
    };
  }, [dateCycle, user]);
  const left = reactExports.useMemo(() => state.applications.find((a) => a.contestantId === leftId) || null, [state.applications, leftId]);
  const right = reactExports.useMemo(() => state.applications.find((a) => a.contestantId === rightId) || null, [state.applications, rightId]);
  if (!left && !right) return null;
  const handleVote = (cId, cName, isBlocked) => {
    onRequestVoteConfirm(cId, cName, battleId);
  };
  const currentVotedId = votes[battleId];
  const leftKey = `${countryId}:${countryName}:${year}:${stageKey}:${battleId}:${leftId}`;
  const rightKey = `${countryId}:${countryName}:${year}:${stageKey}:${battleId}:${rightId}`;
  const leftControls = controlState[leftKey] || {
    voting: "active"
  };
  const rightControls = controlState[rightKey] || {
    voting: "active"
  };
  const leftVotes = 8240 + index * 420;
  const rightVotes = 7410 + index * 580;
  const total = leftVotes + rightVotes;
  const pctLeft = leftVotes / total * 100;
  const pctRight = 100 - pctLeft;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `border rounded overflow-hidden shadow-lg transition-colors ${theme === "light" ? "border-zinc-400 bg-white" : "border-border-subtle bg-surface/30"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between px-5 py-2.5 border-b transition-colors ${theme === "light" ? "border-zinc-400 bg-zinc-200 text-zinc-900" : "border-border-subtle bg-surface/80 text-foreground"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] tracking-widest uppercase font-semibold font-mono", children: [
        "Battle Row #",
        index + 1
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] uppercase tracking-widest text-accent flex items-center gap-1 font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 bg-accent rounded-full animate-pulse" }),
        " Live Vote"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 relative", children: [
      left ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onOpenProfile(left.contestantId), className: "absolute inset-0 block w-full h-full text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: customPhotos[leftId] || left.photos?.portrait || left.photos?.fullBody || "", alt: left.fullName, className: "w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 text-left pointer-events-none z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-xl md:text-2xl font-bold leading-tight text-white", children: left.fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-400 mt-1 uppercase font-mono", children: left.country }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex items-center gap-3 text-xs pointer-events-auto", children: leftControls.voting === "stopped" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative border border-red-500/30 bg-red-950/20 px-3.5 py-2 rounded text-left overflow-hidden select-none max-w-[190px]", style: {
            backgroundImage: "repeating-linear-gradient(45deg, rgba(220,38,38,0.15), rgba(220,38,38,0.15) 5px, rgba(0,0,0,0.5) 5px, rgba(0,0,0,0.5) 10px)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-rose-400 font-mono text-[9px] uppercase tracking-wider font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" }),
              "Voting Stopped"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-zinc-400 font-sans mt-0.5 leading-tight", children: "Voting stopped by admin." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleVote(left.contestantId, left.fullName), disabled: !!currentVotedId, className: `px-4 py-2 font-mono uppercase tracking-wider text-[10px] rounded transition-colors ${currentVotedId === left.contestantId ? "bg-accent text-white" : currentVotedId ? "border border-border text-muted-foreground/35 cursor-not-allowed" : "border border-border-subtle text-zinc-200 hover:bg-zinc-100 hover:text-zinc-950"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-3.5 h-3.5 inline mr-1.5 ${currentVotedId === left.contestantId ? "fill-current" : ""}` }),
            currentVotedId === left.contestantId ? "Voted" : "Vote"
          ] }) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] bg-surface-2 border-r border-border-subtle flex items-center justify-center text-xs text-muted-foreground font-mono uppercase tracking-widest", children: "Unassigned Slot" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-serif italic text-2xl md:text-3xl text-accent font-bold select-none w-12 h-12 flex items-center justify-center bg-background border-4 rounded-full shadow-lg drop-shadow-[0_2px_8px_rgba(255,90,140,0.35)] ${theme === "light" ? "border-zinc-400" : "border-zinc-800"}`, children: "vs" }) }),
      right ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onOpenProfile(right.contestantId), className: "absolute inset-0 block w-full h-full text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: customPhotos[rightId] || right.photos?.portrait || right.photos?.fullBody || "", alt: right.fullName, className: "w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 text-right pointer-events-none z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-xl md:text-2xl font-bold leading-tight text-white", children: right.fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-400 mt-1 uppercase font-mono", children: right.country }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex items-center gap-3 text-xs justify-end pointer-events-auto", children: rightControls.voting === "stopped" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative border border-red-500/30 bg-red-950/20 px-3.5 py-2 rounded text-right overflow-hidden select-none max-w-[190px] ml-auto", style: {
            backgroundImage: "repeating-linear-gradient(45deg, rgba(220,38,38,0.15), rgba(220,38,38,0.15) 5px, rgba(0,0,0,0.5) 5px, rgba(0,0,0,0.5) 10px)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-rose-400 font-mono text-[9px] uppercase tracking-wider font-bold justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" }),
              "Voting Stopped"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-zinc-400 font-sans mt-0.5 leading-tight", children: "Voting stopped by admin." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleVote(right.contestantId, right.fullName), disabled: !!currentVotedId, className: `px-4 py-2 font-mono uppercase tracking-wider text-[10px] rounded transition-colors ${currentVotedId === right.contestantId ? "bg-accent text-white" : currentVotedId ? "border border-border text-muted-foreground/35 cursor-not-allowed" : "border border-border-subtle text-zinc-200 hover:bg-zinc-100 hover:text-zinc-950"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-3.5 h-3.5 inline mr-1.5 ${currentVotedId === right.contestantId ? "fill-current" : ""}` }),
            currentVotedId === right.contestantId ? "Voted" : "Vote"
          ] }) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] bg-surface-2 flex items-center justify-center text-xs text-muted-foreground font-mono uppercase tracking-widest", children: "Unassigned Slot" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-border relative w-full flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: `${pctLeft}%`
    }, className: "bg-accent h-full transition-all duration-1000" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between px-5 py-2 text-[10px] font-mono font-bold transition-colors ${theme === "light" ? "bg-zinc-100 text-zinc-700 border-t border-zinc-400" : "bg-surface/50 text-muted-foreground"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        pctLeft.toFixed(1),
        "% (",
        leftVotes.toLocaleString(),
        " votes)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        pctRight.toFixed(1),
        "% (",
        rightVotes.toLocaleString(),
        " votes)"
      ] })
    ] })
  ] });
}
function ContestantStageProfileModal({
  contestantId,
  countryId,
  countryName,
  year,
  stageKey,
  controlState,
  onRequestVoteConfirm,
  onClose
}) {
  const {
    state
  } = useAppStore();
  const user = state.user;
  const c = reactExports.useMemo(() => {
    return state.applications.find((a) => a.contestantId === contestantId) || null;
  }, [state.applications, contestantId]);
  const [favorites, setFavorites] = reactExports.useState([]);
  const [ratings, setRatings] = reactExports.useState([]);
  const [votedForThisBattle, setVotedForThisBattle] = reactExports.useState(null);
  const battleId = reactExports.useMemo(() => {
    if (stageKey === "WINNER") return "winner";
    try {
      const rawConfig = window.localStorage.getItem("reevibes:live-contest:by-country");
      if (rawConfig) {
        const byCountry = JSON.parse(rawConfig);
        const cfg = byCountry[countryId]?.[stageKey];
        if (cfg && Array.isArray(cfg.lineup)) {
          const idx = cfg.lineup.indexOf(contestantId);
          if (idx !== -1) {
            const slots = STAGES.find((s) => s.key === stageKey).slots;
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
    const now = /* @__PURE__ */ new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    const resetTimeInMinutes = 0 * 60 + 30;
    if (currentTimeInMinutes < resetTimeInMinutes) {
      const prev = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
      return prev.toISOString().slice(0, 10);
    }
    return now.toISOString().slice(0, 10);
  };
  const dateCycle = getVoteCycleKey();
  reactExports.useEffect(() => {
    const loadState = () => {
      try {
        const rawFavs = window.localStorage.getItem("reevibes:favorites");
        if (rawFavs) setFavorites(JSON.parse(rawFavs));
        const rawRatings = window.localStorage.getItem("reevibes:ratings");
        if (rawRatings) setRatings(JSON.parse(rawRatings));
        const rawVotes = window.localStorage.getItem("reevibes:votes");
        if (rawVotes && battleId) {
          const list = JSON.parse(rawVotes);
          const uId = user ? user.id : "guest";
          const found = list.find((v) => v.battleId === battleId && v.dateCycle === dateCycle && v.userId === uId);
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
    const interval = setInterval(loadState, 1e3);
    return () => {
      window.removeEventListener("storage", loadState);
      window.removeEventListener("reevibes:vote-cast", loadState);
      clearInterval(interval);
    };
  }, [battleId, dateCycle, user]);
  if (!c) return null;
  const controlKey = `${countryId}:${countryName}:${year}:${stageKey}:${battleId}:${contestantId}`;
  const controls = controlState[controlKey] || {
    voting: "active",
    rating: "active"
  };
  const ratingStopped = controls.rating === "stopped";
  const stageTag = STAGE_TAGS[stageKey];
  const stageMedia = reactExports.useMemo(() => {
    let list = [];
    try {
      const rawMedia = window.localStorage.getItem(`reevibes:top16:media:${contestantId}`);
      if (rawMedia) {
        list = JSON.parse(rawMedia);
      }
    } catch (e) {
      console.error(e);
    }
    if (list.length === 0 && stageKey === "TOP_16") {
      list = [{
        id: `${contestantId}-m-portrait`,
        image: c.photos?.portrait || "",
        positions: ["TOP 16"]
      }];
    }
    return list.filter((m) => m.positions && m.positions.includes(stageTag));
  }, [contestantId, stageKey, c]);
  const isFavorite = (mediaId) => {
    const uId = user ? user.id : "guest";
    return favorites.some((f) => f.mediaId === mediaId && f.userId === uId);
  };
  const toggleFavorite = (mediaId) => {
    const uId = user ? user.id : "guest";
    let next = [];
    if (isFavorite(mediaId)) {
      next = favorites.filter((f) => !(f.mediaId === mediaId && f.userId === uId));
    } else {
      next = [...favorites, {
        userId: uId,
        mediaId,
        contestantId,
        countryId,
        stageKey
      }];
    }
    setFavorites(next);
    window.localStorage.setItem("reevibes:favorites", JSON.stringify(next));
  };
  const getRatingValue = (mediaId) => {
    const uId = user ? user.id : "guest";
    const record = ratings.find((r) => r.mediaId === mediaId && r.userId === uId);
    return record ? record.ratingValue : 0;
  };
  const handleRatingChange = (mediaId, value) => {
    if (ratingStopped) return;
    const uId = user ? user.id : "guest";
    const dateStr = (/* @__PURE__ */ new Date()).toISOString();
    let next = [];
    const exists = ratings.some((r) => r.mediaId === mediaId && r.userId === uId);
    if (exists) {
      if (value === 0) {
        next = ratings.filter((r) => !(r.mediaId === mediaId && r.userId === uId));
      } else {
        next = ratings.map((r) => r.mediaId === mediaId && r.userId === uId ? {
          ...r,
          ratingValue: value,
          updatedDate: dateStr
        } : r);
      }
    } else {
      if (value > 0) {
        next = [...ratings, {
          mediaId,
          contestantId,
          countryId,
          stageKey,
          userId: uId,
          ratingValue: value,
          createdDate: dateStr,
          updatedDate: dateStr
        }];
      } else {
        next = [...ratings];
      }
    }
    setRatings(next);
    window.localStorage.setItem("reevibes:ratings", JSON.stringify(next));
  };
  const handleVoteInModal = (cId) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh] text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "editorial-label text-accent", children: [
          STAGE_LABELS[stageKey],
          " Stage · Profile"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl mt-0.5", children: c.fullName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 text-muted-foreground hover:text-foreground rounded border border-transparent hover:border-border-subtle transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 overflow-y-auto space-y-8 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-12 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface overflow-hidden rounded relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: stageMedia[0]?.image || c.photos?.portrait || "", alt: c.fullName, className: "w-full h-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle bg-surface/30 p-4 rounded text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground/60 mb-2 font-mono uppercase tracking-wider text-[10px]", children: "Cast Your Vote" }),
            controls.voting === "stopped" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative border border-red-500/30 bg-red-950/20 px-3.5 py-2 rounded text-center overflow-hidden select-none", style: {
              backgroundImage: "repeating-linear-gradient(45deg, rgba(220,38,38,0.15), rgba(220,38,38,0.15) 5px, rgba(0,0,0,0.5) 5px, rgba(0,0,0,0.5) 10px)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 text-rose-400 font-mono text-[9px] uppercase tracking-wider font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" }),
                "Voting Stopped"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-zinc-400 font-sans mt-0.5 leading-tight", children: "Voting stopped by admin." })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleVoteInModal(c.contestantId), disabled: !!votedForThisBattle, className: `w-full py-2.5 font-mono uppercase tracking-wider text-xs rounded transition-colors flex items-center justify-center gap-2 ${votedForThisBattle === c.contestantId ? "bg-accent text-white" : votedForThisBattle ? "border border-border-subtle text-muted-foreground/50 cursor-not-allowed" : "border border-border text-foreground hover:bg-foreground hover:text-background"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-4 h-4 ${votedForThisBattle === c.contestantId ? "fill-current" : ""}` }),
              votedForThisBattle === c.contestantId ? "Already Voted" : "Cast Vote"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-7 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
              " Personal Metrics"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm font-mono text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 uppercase text-[10px]", children: "Age:" }),
                " ",
                c.age,
                " years"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 uppercase text-[10px]", children: "Height:" }),
                " ",
                c.height || "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 uppercase text-[10px]", children: "Hair Color:" }),
                " ",
                c.hairColour || "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 uppercase text-[10px]", children: "Eye Color:" }),
                " ",
                c.eyeColour || "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 uppercase text-[10px]", children: "Bust-Waist-Hips:" }),
                " ",
                c.bust ? `${c.bust}-${c.waist}-${c.hips}` : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 uppercase text-[10px]", children: "Birth Date:" }),
                " ",
                c.dob || "—"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-4 h-4" }),
              " Representation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm font-mono text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 uppercase text-[10px]", children: "Channel Country:" }),
                " ",
                c.country
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 uppercase text-[10px]", children: "City:" }),
                " ",
                c.city || "—"
              ] })
            ] })
          ] }),
          c.biography && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Biography" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-serif italic", children: c.biography })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pt-6 border-t border-border-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "editorial-label text-accent flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 fill-accent text-accent animate-pulse" }),
          " Stage Campaign Gallery (",
          stageMedia.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-6", children: [
          stageMedia.map((m) => {
            const isFav = isFavorite(m.id);
            const currentRating = getRatingValue(m.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle bg-surface/30 p-4 rounded space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] border border-border-subtle/50 overflow-hidden bg-surface rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.image, alt: m.caption || "Contestant photo", className: "w-full h-full object-cover" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleFavorite(m.id), className: `absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${isFav ? "bg-accent text-white" : "bg-black/60 text-zinc-300 hover:text-accent"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-4 h-4 ${isFav ? "fill-current" : ""}` }) })
              ] }),
              m.caption && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: m.caption }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-border-subtle/60", children: [
                ratingStopped ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-rose-400 uppercase tracking-widest font-mono font-semibold", children: "Rating stopped by admin." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono", children: "Rate Photo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: [1, 2, 3, 4, 5].map((val) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRatingChange(m.id, currentRating === val ? 0 : val), disabled: ratingStopped, className: `p-1 transition-transform ${ratingStopped ? "cursor-not-allowed opacity-40" : "hover:scale-110"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-4 h-4 ${val <= currentRating ? "fill-accent text-accent" : "text-muted-foreground/30 hover:text-muted-foreground/60"}` }) }, val)) })
              ] })
            ] }, m.id);
          }),
          stageMedia.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full border border-dashed border-border-subtle py-12 text-center text-xs text-muted-foreground/60 rounded font-mono", children: "No published campaign media tags found for this stage." })
        ] })
      ] }),
      c.videos && (c.videos.intro || Array.isArray(c.videos.additional) && c.videos.additional.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pt-6 border-t border-border-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "editorial-label text-accent flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-4 h-4 text-accent" }),
          " Stage Video Portfolios"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-6", children: [{
          id: `${contestantId}-v-intro`,
          url: c.videos.intro,
          title: "Introduction Reel"
        }, ...Array.isArray(c.videos.additional) ? c.videos.additional.map((url, i) => ({
          id: `${contestantId}-v-add-${i}`,
          url,
          title: `Additional Reel ${i + 1}`
        })) : []].filter((v) => !!v.url).map((v) => {
          const currentRating = getRatingValue(v.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle bg-surface/30 p-4 rounded space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-video bg-muted rounded overflow-hidden flex items-center justify-center border border-border-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 text-xs font-mono", children: v.title }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-serif text-sm font-semibold", children: v.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-border-subtle/60", children: [
              ratingStopped ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-rose-400 uppercase tracking-widest font-mono font-semibold", children: "Rating stopped by admin." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono", children: "Rate Video" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: [1, 2, 3, 4, 5].map((val) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRatingChange(v.id, currentRating === val ? 0 : val), disabled: ratingStopped, className: `p-1 transition-transform ${ratingStopped ? "cursor-not-allowed opacity-40" : "hover:scale-110"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-4 h-4 ${val <= currentRating ? "fill-accent text-accent" : "text-muted-foreground/30 hover:text-muted-foreground/60"}` }) }, val)) })
            ] })
          ] }, v.id);
        }) })
      ] })
    ] })
  ] }) });
}
function ArrowRightIcon(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 12h14m-7-7 7 7-7 7" }) });
}
function ChevronLeftIcon(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m15 18-6-6 6-6" }) });
}
export {
  LiveContest as component
};
