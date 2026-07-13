import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AdminLayout, i as AdminButton, e as AdminCard, l as useAppStore, b as useTheme, D as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, q as DialogFooter } from "./router-BFsnZUKW.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { b as ChevronLeft, u as Radio, C as Crown, af as Vote, n as Sparkles, _ as Play, a4 as Square, s as Star, e as Shield, ag as Image, ah as Film } from "../_libs/lucide-react.mjs";
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
function VoteRatedAdmin() {
  const [countryId, setCountryId] = reactExports.useState(null);
  const [publishedIds, setPublishedIds] = reactExports.useState([]);
  const [publishedCountryMeta, setPublishedCountryMeta] = reactExports.useState({});
  const [byCountryConfig, setByCountryConfig] = reactExports.useState({});
  const [votesList, setVotesList] = reactExports.useState([]);
  const [ratingsList, setRatingsList] = reactExports.useState([]);
  const [controlState, setControlState] = reactExports.useState({});
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
  reactExports.useEffect(() => {
    reloadData();
    const handleStorage = (e) => {
      if (e.key === "reevibes:published-lineups" || e.key === "reevibes:live-contest:by-country" || e.key === "reevibes:votes" || e.key === "reevibes:ratings" || e.key === "reevibes:vote-rate-controls") {
        reloadData();
      }
    };
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(reloadData, 1e3);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);
  const countries = reactExports.useMemo(() => {
    return publishedIds.map((id) => {
      const config = byCountryConfig[id];
      if (!config) return null;
      const hasPublishedStage = Object.values(config).some((stageCfg) => stageCfg.status === "published");
      if (!hasPublishedStage) return null;
      return publishedCountryMeta[id] || {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        year: "2026"
      };
    }).filter(Boolean);
  }, [publishedIds, byCountryConfig, publishedCountryMeta]);
  const country = countries.find((c) => c.id === countryId) || null;
  const handleUpdateControl = (updatedControls) => {
    setControlState(updatedControls);
    window.localStorage.setItem("reevibes:vote-rate-controls", JSON.stringify(updatedControls));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { eyebrow: "Module · Vote & Rated Control", title: country ? `${country.name} ${country.year}` : "Vote & Rated", actions: country ? /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminButton, { variant: "outline", onClick: () => setCountryId(null), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5 inline mr-2" }),
    "All Contests"
  ] }) : null, children: !country ? /* @__PURE__ */ jsxRuntimeExports.jsx(CountrySelector, { countries, configs: byCountryConfig, onPick: setCountryId }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CountryControl, { country, config: byCountryConfig[country.id] || {}, votesList, ratingsList, controlState, onUpdateControls: handleUpdateControl }) });
}
function CountrySelector({
  countries,
  configs,
  onPick
}) {
  if (countries.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto my-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-8 h-8 mx-auto text-muted-foreground mb-4 opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl mb-2", children: "No Published Stages" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: "To manage votes and ratings, you must first publish a stage in the Live Contest Dashboard." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/admin/live-contest", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", children: "Go to Live Contest Studio" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-4 font-mono", children: "Published Live Contests" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: countries.map((c, i) => {
      const countryConfig = configs[c.id];
      const publishedCount = countryConfig ? Object.values(countryConfig).filter((cfg) => cfg.status === "published").length : 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.button, { onClick: () => onPick(c.id), initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: i * 0.04
      }, className: "group text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "relative overflow-hidden hover:border-accent transition-all duration-500 bg-surface min-h-[220px] flex flex-col justify-between p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 right-4 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-emerald-500", children: "Live" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-3 h-3" }),
            " ReeVibes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 flex items-center justify-start my-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CountryLogo, { countryName: c.name, className: "max-h-12 w-auto max-w-[80%] object-contain" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-border-subtle/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
            publishedCount,
            " Stage",
            publishedCount > 1 ? "s" : "",
            " Published"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent group-hover:translate-x-1 transition-transform", children: "Enter Control →" })
        ] }) })
      ] }) }, c.id);
    }) })
  ] });
}
function CountryControl({
  country,
  config,
  votesList,
  ratingsList,
  controlState,
  onUpdateControls
}) {
  const {
    state
  } = useAppStore();
  const {
    theme
  } = useTheme();
  const [selectedContestantId, setSelectedContestantId] = reactExports.useState(null);
  const publishedStages = reactExports.useMemo(() => {
    return STAGES.filter((s) => config[s.key]?.status === "published");
  }, [config]);
  const [stage, setStage] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (publishedStages.length > 0) {
      if (!stage || !publishedStages.some((s) => s.key === stage)) {
        setStage(publishedStages[0].key);
      }
    } else {
      setStage(null);
    }
  }, [publishedStages]);
  const stageConfig = stage ? config[stage] : null;
  const battles = reactExports.useMemo(() => {
    if (!stage || !stageConfig || stage === "WINNER") return [];
    const slots = STAGES.find((s) => s.key === stage).slots;
    const arr = [];
    const half = slots / 2;
    for (let i = 0; i < half; i++) {
      arr.push({
        id: `battle-${stage}-${i}`,
        leftId: stageConfig.lineup[i],
        rightId: stageConfig.lineup[half + i]
      });
    }
    return arr;
  }, [stageConfig, stage]);
  const handleBulkControl = (kind, value) => {
    if (!stage || !stageConfig) return;
    const nextControls = {
      ...controlState
    };
    if (stage === "WINNER") {
      const winnerId = stageConfig.lineup[0];
      if (winnerId) {
        const key = `${country.id}:${country.name}:${country.year}:${stage}:winner:${winnerId}`;
        const prev = nextControls[key] || {
          voting: "active",
          rating: "active"
        };
        nextControls[key] = {
          ...prev,
          [kind]: value
        };
      }
    } else {
      battles.forEach((b) => {
        if (b.leftId) {
          const key = `${country.id}:${country.name}:${country.year}:${stage}:${b.id}:${b.leftId}`;
          const prev = nextControls[key] || {
            voting: "active",
            rating: "active"
          };
          nextControls[key] = {
            ...prev,
            [kind]: value
          };
        }
        if (b.rightId) {
          const key = `${country.id}:${country.name}:${country.year}:${stage}:${b.id}:${b.rightId}`;
          const prev = nextControls[key] || {
            voting: "active",
            rating: "active"
          };
          nextControls[key] = {
            ...prev,
            [kind]: value
          };
        }
      });
    }
    onUpdateControls(nextControls);
  };
  const getContestantStatus = (contestantId, battleId) => {
    if (!stage) return {
      voting: "active",
      rating: "active"
    };
    const key = `${country.id}:${country.name}:${country.year}:${stage}:${battleId}:${contestantId}`;
    return controlState[key] || {
      voting: "active",
      rating: "active"
    };
  };
  const handleToggleIndividual = (contestantId, battleId, kind) => {
    if (!stage) return;
    const key = `${country.id}:${country.name}:${country.year}:${stage}:${battleId}:${contestantId}`;
    const nextControls = {
      ...controlState
    };
    const prev = nextControls[key] || {
      voting: "active",
      rating: "active"
    };
    nextControls[key] = {
      ...prev,
      [kind]: prev[kind] === "active" ? "stopped" : "active"
    };
    onUpdateControls(nextControls);
  };
  const getVoteCount = (contestantId, battleId) => {
    if (!stage) return 0;
    return votesList.filter((v) => v.countryId === country.id && v.stageKey === stage && v.battleId === battleId && v.contestantId === contestantId).length;
  };
  const selectedContestantData = reactExports.useMemo(() => {
    if (!selectedContestantId) return null;
    return state.applications.find((a) => a.contestantId === selectedContestantId) || null;
  }, [selectedContestantId, state.applications]);
  const activeStageLabel = stage ? STAGES.find((s) => s.key === stage)?.label : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 border-b border-border-subtle overflow-x-auto", children: publishedStages.map((s) => {
      const active = stage === s.key;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setStage(s.key), className: `relative px-5 py-3 editorial-label transition-colors shrink-0 ${active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          s.key === "WINNER" && /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3 h-3" }),
          s.label
        ] }),
        active && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layoutId: "vr-stage-underline", className: "absolute left-0 right-0 -bottom-px h-0.5 bg-accent" })
      ] }, s.key);
    }) }),
    stage && stageConfig && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 p-6 bg-surface border border-border-subtle rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground font-mono", children: [
            activeStageLabel,
            " Stage · ",
            country.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl mt-1", children: "Global Broadcast Controls" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `editorial-label px-5 py-2.5 font-semibold transition-colors cursor-pointer rounded ${theme === "light" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300" : "bg-emerald-600 text-white hover:bg-emerald-700"}`, onClick: () => handleBulkControl("voting", "active"), children: "Start All Voting" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `editorial-label px-5 py-2.5 font-semibold transition-colors cursor-pointer rounded ${theme === "light" ? "bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300" : "bg-rose-600 text-white hover:bg-rose-700"}`, onClick: () => handleBulkControl("voting", "stopped"), children: "Stop All Voting" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `editorial-label px-5 py-2.5 font-semibold transition-colors cursor-pointer rounded ${theme === "light" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300" : "bg-emerald-600 text-white hover:bg-emerald-700"}`, onClick: () => handleBulkControl("rating", "active"), children: "Start All Rating" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `editorial-label px-5 py-2.5 font-semibold transition-colors cursor-pointer rounded ${theme === "light" ? "bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300" : "bg-rose-600 text-white hover:bg-rose-700"}`, onClick: () => handleBulkControl("rating", "stopped"), children: "Stop All Rating" })
        ] })
      ] }),
      stage === "WINNER" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-center text-muted-foreground mb-4", children: "Coronation Winner Card" }),
        stageConfig.lineup[0] ? (() => {
          const cId = stageConfig.lineup[0];
          const contestant = state.applications.find((a) => a.contestantId === cId);
          const eng = getContestantStatus(cId, "winner");
          const votes = getVoteCount(cId, "winner");
          if (!contestant) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantCard, { contestant: {
            id: contestant.contestantId,
            name: contestant.fullName,
            country: contestant.country || "Global",
            image: stageConfig.customPhotos[cId] || contestant.photos?.portrait || ""
          }, eng: {
            voting: eng.voting,
            rating: eng.rating,
            votes
          }, isWinner: true, onToggleVoting: () => handleToggleIndividual(cId, "winner", "voting"), onToggleRating: () => handleToggleIndividual(cId, "winner", "rating"), onOpenDetails: () => setSelectedContestantId(cId) });
        })() : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-dashed border-border-subtle p-8 text-center text-sm text-muted-foreground rounded", children: "No Winner Coronation set in Live Contest Dashboard." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: battles.map((b, idx) => {
        const leftContestant = state.applications.find((a) => a.contestantId === b.leftId);
        const rightContestant = state.applications.find((a) => a.contestantId === b.rightId);
        const leftEng = b.leftId ? getContestantStatus(b.leftId, b.id) : null;
        const rightEng = b.rightId ? getContestantStatus(b.rightId, b.id) : null;
        const leftVotes = b.leftId ? getVoteCount(b.leftId, b.id) : 0;
        const rightVotes = b.rightId ? getVoteCount(b.rightId, b.id) : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle bg-surface p-6 rounded relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase font-mono tracking-widest text-muted-foreground mb-4", children: [
            "Matchup Row #",
            idx + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-10", children: [
            leftContestant && leftEng ? /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantCard, { contestant: {
              id: leftContestant.contestantId,
              name: leftContestant.fullName,
              country: leftContestant.country || "Global",
              image: stageConfig.customPhotos[b.leftId] || leftContestant.photos?.portrait || ""
            }, eng: {
              voting: leftEng.voting,
              rating: leftEng.rating,
              votes: leftVotes
            }, onToggleVoting: () => handleToggleIndividual(b.leftId, b.id, "voting"), onToggleRating: () => handleToggleIndividual(b.leftId, b.id, "rating"), onOpenDetails: () => setSelectedContestantId(b.leftId) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-dashed border-border-subtle py-24 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest rounded bg-background/30", children: "Unassigned Slot" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-2 md:py-0 self-stretch px-4 border-y md:border-y-0 md:border-x border-border-subtle/30 bg-surface-2/20 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif italic text-4xl md:text-5xl text-accent/80 font-bold select-none", children: "vs" }) }),
            rightContestant && rightEng ? /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantCard, { contestant: {
              id: rightContestant.contestantId,
              name: rightContestant.fullName,
              country: rightContestant.country || "Global",
              image: stageConfig.customPhotos[b.rightId] || rightContestant.photos?.portrait || ""
            }, eng: {
              voting: rightEng.voting,
              rating: rightEng.rating,
              votes: rightVotes
            }, onToggleVoting: () => handleToggleIndividual(b.rightId, b.id, "voting"), onToggleRating: () => handleToggleIndividual(b.rightId, b.id, "rating"), onOpenDetails: () => setSelectedContestantId(b.rightId) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-dashed border-border-subtle py-24 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest rounded bg-background/30", children: "Unassigned Slot" })
          ] })
        ] }, b.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: selectedContestantId !== null, onOpenChange: (open) => !open && setSelectedContestantId(null), children: selectedContestantId && selectedContestantData && stage && /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantDetailsModal, { contestant: selectedContestantData, stageKey: stage, country, battleId: stage === "WINNER" ? "winner" : battles.find((b) => b.leftId === selectedContestantId || b.rightId === selectedContestantId)?.id || "", votes: getVoteCount(selectedContestantId, stage === "WINNER" ? "winner" : battles.find((b) => b.leftId === selectedContestantId || b.rightId === selectedContestantId)?.id || ""), status: getContestantStatus(selectedContestantId, stage === "WINNER" ? "winner" : battles.find((b) => b.leftId === selectedContestantId || b.rightId === selectedContestantId)?.id || ""), ratingsList, onClose: () => setSelectedContestantId(null) }) })
  ] });
}
function ContestantCard({
  contestant,
  eng,
  isWinner = false,
  onToggleVoting,
  onToggleRating,
  onOpenDetails
}) {
  const vOn = eng.voting === "active";
  const rOn = eng.rating === "active";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "overflow-hidden p-0 bg-background/40 hover:border-accent transition-all duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-surface-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onOpenDetails, className: "w-full h-full block text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.image, alt: contestant.name, className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700", loading: "lazy" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { on: vOn, label: vOn ? "Voting Active" : "Voting Stopped" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { on: rOn, label: rOn ? "Rating Active" : "Rating Stopped" })
        ] }),
        isWinner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-accent text-white px-2 py-1 editorial-label flex items-center gap-1 shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3 h-3" }),
          "Winner"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-white/70", children: contestant.country }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-xl leading-tight mt-0.5", children: contestant.name })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 border-b border-border-subtle/50 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Vote, { className: "w-3.5 h-3.5 text-accent" }),
            "Votes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg mt-0.5 font-bold", children: eng.votes.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-accent" }),
            "Engagement"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1 uppercase tracking-wider font-mono", children: "Live stats" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleButton, { active: vOn, onClick: onToggleVoting, activeLabel: "Stop Voting", inactiveLabel: "Start Voting", activeIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-3 h-3" }), inactiveIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleButton, { active: rOn, onClick: onToggleRating, activeLabel: "Stop Rating", inactiveLabel: "Start Rating", activeIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-3 h-3" }), inactiveIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3" }) })
      ] })
    ] })
  ] });
}
function StatusPill({
  on,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 px-2 py-0.5 backdrop-blur-md text-[9px] tracking-[0.15em] uppercase font-bold ${on ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40" : "bg-red-500/25 text-red-300 border border-red-500/40"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1 h-1 rounded-full ${on ? "bg-emerald-400 animate-pulse" : "bg-red-400"}` }),
    label
  ] });
}
function ToggleButton({
  active,
  onClick,
  activeLabel,
  inactiveLabel,
  activeIcon,
  inactiveIcon
}) {
  const {
    theme
  } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: `relative flex-1 flex items-center justify-center gap-1 px-2 py-2.5 text-[9px] tracking-[0.12em] uppercase font-bold transition-all duration-300 cursor-pointer rounded border ${active ? theme === "light" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300" : "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-750 shadow-md" : theme === "light" ? "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-300" : "bg-rose-600 text-white hover:bg-rose-700 border-rose-750 shadow-md"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
    active ? activeIcon : inactiveIcon,
    active ? activeLabel : inactiveLabel
  ] }) });
}
function ContestantDetailsModal({
  contestant,
  stageKey,
  country,
  battleId,
  votes,
  status,
  ratingsList,
  onClose
}) {
  const stageMedia = reactExports.useMemo(() => {
    let list = [];
    try {
      const rawMedia = window.localStorage.getItem(`reevibes:top16:media:${contestant.contestantId}`);
      if (rawMedia) {
        list = JSON.parse(rawMedia);
      }
    } catch (e) {
      console.error(e);
    }
    const stageTagMap = {
      TOP_16: "TOP 16",
      TOP_8: "TOP 8",
      TOP_4: "TOP 4",
      FINALS: "FINALS",
      WINNER: "WINNER"
    };
    const currentStageTag = stageTagMap[stageKey];
    if (list.length === 0 && stageKey === "TOP_16") {
      list = [{
        id: `${contestant.contestantId}-m-portrait`,
        image: contestant.photos?.portrait || "",
        positions: ["TOP 16"]
      }];
    }
    return list.filter((m) => m.positions && m.positions.includes(currentStageTag));
  }, [contestant, stageKey]);
  const getAverageRating = (mediaId) => {
    const mediaRatings = ratingsList.filter((r) => r.mediaId === mediaId);
    if (mediaRatings.length === 0) {
      return {
        average: "0.0",
        count: 0
      };
    }
    const sum = mediaRatings.reduce((acc, r) => acc + r.ratingValue, 0);
    const avg = sum / mediaRatings.length;
    return {
      average: avg.toFixed(1),
      count: mediaRatings.length
    };
  };
  const videoList = reactExports.useMemo(() => {
    if (!contestant.videos) return [];
    return [{
      id: `${contestant.contestantId}-v-intro`,
      url: contestant.videos.intro,
      title: "Introduction Reel"
    }, ...Array.isArray(contestant.videos.additional) ? contestant.videos.additional.map((url, i) => ({
      id: `${contestant.contestantId}-v-add-${i}`,
      url,
      title: `Additional Reel ${i + 1}`
    })) : []].filter((v) => !!v.url);
  }, [contestant]);
  const activeStageLabel = STAGES.find((s) => s.key === stageKey)?.label || "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl bg-zinc-950 border border-zinc-800 text-zinc-100 [color-scheme:dark] max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-zinc-800 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "editorial-label text-accent font-mono", children: [
        activeStageLabel,
        " Stage · Details View"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-serif text-3xl mt-1", children: contestant.fullName })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-12 gap-8 my-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-zinc-800 bg-zinc-900 overflow-hidden rounded relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos?.portrait || "", alt: contestant.fullName, className: "w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-zinc-500 font-mono uppercase tracking-wider block", children: "Voting Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded mt-1 w-full justify-center ${status.voting === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`, children: status.voting === "active" ? "Active" : "Stopped" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-zinc-500 font-mono uppercase tracking-wider block", children: "Rating Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded mt-1 w-full justify-center ${status.rating === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`, children: status.rating === "active" ? "Active" : "Stopped" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-7 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "editorial-label text-accent border-b border-zinc-800 pb-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
            " Metrics & Identification"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm font-mono text-zinc-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500 uppercase text-[10px]", children: "Contestant ID:" }),
              " ",
              contestant.contestantId
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500 uppercase text-[10px]", children: "Battle ID:" }),
              " ",
              battleId
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500 uppercase text-[10px]", children: "Country Name:" }),
              " ",
              country.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500 uppercase text-[10px]", children: "Year:" }),
              " ",
              country.year
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500 uppercase text-[10px]", children: "Stage:" }),
              " ",
              activeStageLabel
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500 uppercase text-[10px]", children: "Total Votes:" }),
              " ",
              votes.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500 uppercase text-[10px]", children: "Age:" }),
              " ",
              contestant.age,
              " years"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500 uppercase text-[10px]", children: "Height:" }),
              " ",
              contestant.height || "—"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-zinc-800 pb-1", children: "Representation Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm font-mono text-zinc-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500 uppercase text-[10px]", children: "Representing:" }),
              " ",
              contestant.country
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500 uppercase text-[10px]", children: "Home City:" }),
              " ",
              contestant.city || "—"
            ] })
          ] })
        ] }),
        contestant.biography && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-zinc-800 pb-1", children: "Biography" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-zinc-400 leading-relaxed font-serif italic", children: contestant.biography })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pt-6 border-t border-zinc-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "editorial-label text-accent flex items-center gap-1.5 font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4 text-accent" }),
        " Campaign Photos Average Ratings (",
        stageMedia.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        stageMedia.map((m) => {
          const ratingsObj = getAverageRating(m.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-zinc-800 bg-zinc-900/40 p-4 rounded flex gap-4 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-16 h-20 bg-zinc-900 rounded overflow-hidden shrink-0 border border-zinc-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.image, alt: "Campaign frame", className: "w-full h-full object-cover" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-zinc-500 font-mono uppercase tracking-wider", children: "Photo Media" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-sm font-semibold truncate max-w-[200px] mt-0.5", children: m.caption || "Campaign Image" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-amber-400 font-bold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 fill-current" }),
                  " ",
                  ratingsObj.average,
                  " / 5"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-zinc-500 font-mono text-[10px]", children: [
                  ratingsObj.count,
                  " ratings"
                ] })
              ] })
            ] })
          ] }, m.id);
        }),
        stageMedia.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full border border-dashed border-zinc-800 py-8 text-center text-xs text-zinc-500 font-mono", children: "No campaign photo files found for this stage." })
      ] })
    ] }),
    videoList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pt-6 border-t border-zinc-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "editorial-label text-accent flex items-center gap-1.5 font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-4 h-4 text-accent" }),
        " Campaign Videos Average Ratings (",
        videoList.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: videoList.map((v) => {
        const ratingsObj = getAverageRating(v.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-zinc-800 bg-zinc-900/40 p-4 rounded flex gap-4 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-16 h-12 bg-zinc-950 rounded flex items-center justify-center shrink-0 border border-zinc-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-5 h-5 text-zinc-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-zinc-500 font-mono uppercase tracking-wider", children: "Video Reel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-sm font-semibold truncate max-w-[200px] mt-0.5", children: v.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-amber-400 font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 fill-current" }),
                " ",
                ratingsObj.average,
                " / 5"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-zinc-500 font-mono text-[10px]", children: [
                ratingsObj.count,
                " ratings"
              ] })
            ] })
          ] })
        ] }, v.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "border-t border-zinc-800 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: onClose, children: "Close Detail View" }) })
  ] });
}
export {
  VoteRatedAdmin as component
};
