import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as useAppStore, A as AdminLayout, e as AdminCard } from "./router-BFsnZUKW.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { a as CircleCheckBig, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
function ContestantDetailModal({
  contestant,
  onClose
}) {
  if (!contestant) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent", children: "Contestant Profile (Admin Review)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl mt-0.5", children: contestant.fullName || contestant.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto space-y-8 flex-1 text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-12 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos?.portrait || contestant.image, alt: "", className: "w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          contestant.photos?.fullBody && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos.fullBody, alt: "", className: "w-full h-full object-cover" }) }),
          contestant.photos?.sideProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos.sideProfile, alt: "", className: "w-full h-full object-cover" }) }),
          contestant.photos?.candid && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] border border-border-subtle bg-surface-2 overflow-hidden rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: contestant.photos.candid, alt: "", className: "w-full h-full object-cover" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-7 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Personal Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Age:" }),
              " ",
              contestant.age,
              " years"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Height:" }),
              " ",
              contestant.height || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Hair:" }),
              " ",
              contestant.hairColour || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Eyes:" }),
              " ",
              contestant.eyeColour || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Measurements:" }),
              " ",
              contestant.bust ? `${contestant.bust} - ${contestant.waist} - ${contestant.hips}` : contestant.measurements || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Date of Birth:" }),
              " ",
              contestant.dob || "—"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Country:" }),
              " ",
              contestant.country || contestant.contestCountry
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "City:" }),
              " ",
              contestant.city || "—"
            ] })
          ] })
        ] }),
        (contestant.biography || contestant.bio) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "editorial-label text-accent border-b border-border-subtle pb-1", children: "Biography" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap", children: contestant.biography || contestant.bio })
        ] })
      ] })
    ] }) })
  ] }) });
}
const TABS = ["Agency", "Rating", "Casting Call", "Judgement", "Top 16", "Top 8", "Top 4", "Finals", "Winner"];
const YEARS = [2026, 2025, 2024];
const COUNTRIES = ["Global", "Adygea", "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Bermuda", "Bhutan", "Bolivia", "Bosnia-Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Catalonia", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Cote D'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "England", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "European Union", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "Gabon", "Georgia", "Germany", "Ghana", "Gibrlatar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Liechtenstein", "Luxembourg", "Lybia", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Island", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "North Korea", "Northern Ireland", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Principality of Sealand", "Puerto Rico", "Qatar", "Republic of the Congo", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Scotland", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Vincent", "St. Helena", "St. Kitts and Nevis", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "The Gambia", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "U.S. Virgin Islands", "Uganda", "Ukraine", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"];
const MONTHS = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const JUDGE_PARTICULARS = [{
  key: "catwalk",
  label: "Catwalk & Pose"
}, {
  key: "personality",
  label: "Personality & Vitality"
}, {
  key: "communication",
  label: "Communication Skill"
}, {
  key: "q1",
  label: "Question 1"
}, {
  key: "q2",
  label: "Question 2"
}, {
  key: "appearance",
  label: "Appearance"
}, {
  key: "friendliness",
  label: "Friendliness"
}, {
  key: "interaction",
  label: "Interaction with Judges"
}, {
  key: "q3",
  label: "Question 3"
}, {
  key: "q4",
  label: "Question 4"
}];
function avg(nums) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}
function matchCountryName(a, b) {
  const norm = (s) => {
    let low = s.toLowerCase().trim();
    if (low === "uk") return "united kingdom";
    if (low === "usa") return "united states";
    return low;
  };
  return norm(a) === norm(b);
}
function ReportsPage() {
  const {
    state,
    setMultiplePositions,
    setPosition,
    updateApplication
  } = useAppStore();
  const [activeTab, setActiveTab] = reactExports.useState("Agency");
  const [selectedYear, setSelectedYear] = reactExports.useState(2026);
  const [selectedMonth, setSelectedMonth] = reactExports.useState("All");
  const [selectedCountry, setSelectedCountry] = reactExports.useState("Global");
  const [selectedContestantIds, setSelectedContestantIds] = reactExports.useState([]);
  const [viewingContestant, setViewingContestant] = reactExports.useState(null);
  const [showAgencyModal, setShowAgencyModal] = reactExports.useState(null);
  const [showRatingModal, setShowRatingModal] = reactExports.useState(null);
  const [showCastingModal, setShowCastingModal] = reactExports.useState(null);
  const [showJudgementModal, setShowJudgementModal] = reactExports.useState(null);
  const [showJudgeRatingsDetail, setShowJudgeRatingsDetail] = reactExports.useState(null);
  const [successPopup, setSuccessPopup] = reactExports.useState(null);
  const filteredContestants = reactExports.useMemo(() => {
    return state.applications.filter((a) => {
      const matchYear = a.contestYear === selectedYear;
      const matchCountry = selectedCountry === "Global" || a.country === selectedCountry;
      return matchYear && matchCountry;
    });
  }, [state.applications, selectedYear, selectedCountry]);
  const agencyUsers = reactExports.useMemo(() => state.users.filter((u) => u.roles.includes("Applications")), [state.users]);
  const ratingUsers = reactExports.useMemo(() => state.users.filter((u) => u.roles.includes("Ratings")), [state.users]);
  const castingUsers = reactExports.useMemo(() => state.users.filter((u) => u.roles.includes("Casting Call")), [state.users]);
  const judgementUsers = reactExports.useMemo(() => state.users.filter((u) => u.roles.includes("Judgements")), [state.users]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { eyebrow: "Module · Analytics", title: "Moderation & Contest Reports", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 mb-6 bg-surface p-4 border border-border-subtle rounded", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground text-xs", children: "Year" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: selectedYear, onChange: (e) => setSelectedYear(Number(e.target.value)), className: "bg-transparent border border-border-subtle px-3 py-1.5 text-sm rounded bg-background text-foreground", children: YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, className: "bg-background", children: y }, y)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground text-xs", children: "Month" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: selectedMonth, onChange: (e) => setSelectedMonth(e.target.value), className: "bg-transparent border border-border-subtle px-3 py-1.5 text-sm rounded bg-background text-foreground", children: MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, className: "bg-background", children: m }, m)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground text-xs", children: "Country" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: selectedCountry, onChange: (e) => setSelectedCountry(e.target.value), className: "bg-transparent border border-border-subtle px-3 py-1.5 text-sm rounded bg-background text-foreground", children: COUNTRIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, className: "bg-background", children: c }, c)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start gap-1.5 border-b border-border-subtle pb-3 mb-6 flex-wrap", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab(t), className: `px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-all duration-200 rounded-sm ${activeTab === t ? "border-accent text-accent bg-accent/5 font-bold" : "border-border-subtle text-muted-foreground hover:text-foreground hover:bg-surface"}`, children: t }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
      activeTab === "Agency" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl border-b border-border-subtle pb-2", children: "Agency Applications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "S.no" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Applied Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Start Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "End Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            filteredContestants.map((c, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle/60 hover:bg-surface-2/50 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4 font-mono text-xs", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-xs text-accent font-semibold", children: c.contestantId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: c.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: c.applicationDate || "2026-01-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
                selectedYear,
                "-01-01"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
                selectedYear,
                "-02-28"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "text-right px-4 space-x-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAgencyModal(c), className: "text-xs uppercase tracking-wider font-semibold text-accent hover:underline", children: "Application Details" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewingContestant(c), className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground hover:underline", children: "Details" })
              ] })
            ] }, c.contestantId)),
            filteredContestants.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "py-12 text-center text-muted-foreground", children: "No contestant records found for selected filters." }) })
          ] })
        ] }) })
      ] }),
      activeTab === "Rating" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl border-b border-border-subtle pb-2", children: "Ratings Analytics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "S.no" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Start Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "End Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Total Ratings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            filteredContestants.map((c, idx) => {
              const scores = ratingUsers.map((u) => state.rateScores[u.id]?.[c.contestantId]).filter((s) => typeof s === "number");
              const avgRating = scores.length ? avg(scores).toFixed(1) : "—";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle/60 hover:bg-surface-2/50 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4 font-mono text-xs", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-xs text-accent font-semibold", children: c.contestantId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: c.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
                  selectedYear,
                  "-03-01"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
                  selectedYear,
                  "-04-15"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-serif font-bold text-accent", children: avgRating }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "text-right px-4 space-x-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowRatingModal(c), className: "text-xs uppercase tracking-wider font-semibold text-accent hover:underline", children: "Rating Details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewingContestant(c), className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground hover:underline", children: "Details" })
                ] })
              ] }, c.contestantId);
            }),
            filteredContestants.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "py-12 text-center text-muted-foreground", children: "No contestant records found for selected filters." }) })
          ] })
        ] }) })
      ] }),
      activeTab === "Casting Call" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl border-b border-border-subtle pb-2", children: "Casting Decisions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "S.no" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Applied Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Start Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "End Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            filteredContestants.map((c, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle/60 hover:bg-surface-2/50 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4 font-mono text-xs", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-xs text-accent font-semibold", children: c.contestantId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: c.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: c.applicationDate || "2026-01-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
                selectedYear,
                "-04-16"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
                selectedYear,
                "-05-31"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "text-right px-4 space-x-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCastingModal(c), className: "text-xs uppercase tracking-wider font-semibold text-accent hover:underline", children: "Application Details" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewingContestant(c), className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground hover:underline", children: "Details" })
              ] })
            ] }, c.contestantId)),
            filteredContestants.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "py-12 text-center text-muted-foreground", children: "No contestant records found for selected filters." }) })
          ] })
        ] }) })
      ] }),
      activeTab === "Judgement" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-border-subtle pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Judgement Summary" }),
          selectedContestantIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-accent font-mono font-bold", children: [
              selectedContestantIds.length,
              " Selected"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              const existingTop16Ids = state.applications.filter((a) => {
                const isGlobalSelect = selectedCountry === "Global" || selectedCountry === "Globe";
                const matchCountry = isGlobalSelect ? matchCountryName(a.country, "Global") || matchCountryName(a.country, "Globe") : matchCountryName(a.country, selectedCountry);
                return matchCountry && state.positions[a.contestantId] === "Top16";
              }).map((a) => a.contestantId);
              if (existingTop16Ids.length > 0) {
                setMultiplePositions(existingTop16Ids, null);
              }
              selectedContestantIds.forEach((id) => {
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
            }, className: "bg-accent hover:bg-accent/90 text-white text-xs uppercase tracking-wider font-semibold px-4 py-1.5 rounded transition-all shadow-md flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5" }),
              " Proceed Top 16"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4 w-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: filteredContestants.length > 0 && selectedContestantIds.length === filteredContestants.length, onChange: (e) => {
              if (e.target.checked) {
                setSelectedContestantIds(filteredContestants.map((c) => c.contestantId));
              } else {
                setSelectedContestantIds([]);
              }
            }, className: "rounded border-border-subtle text-accent focus:ring-accent bg-transparent w-4 h-4 cursor-pointer" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "S.no" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Start Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "End Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Total Avg Rating" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Int.Rating" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            filteredContestants.map((c, idx) => {
              const cId = c.contestantId;
              const ratingScores = ratingUsers.map((u) => state.rateScores[u.id]?.[cId]).filter((s) => typeof s === "number");
              const rateAvg = ratingScores.length ? avg(ratingScores) : 0;
              const judgeAvgScores = judgementUsers.map((u) => {
                const m = state.judgeRatings[u.id]?.[cId];
                return m ? avg(Object.values(m).filter((n) => typeof n === "number")) : NaN;
              }).filter((n) => !Number.isNaN(n));
              const intlAvg = judgeAvgScores.length ? avg(judgeAvgScores) : 0;
              const total = rateAvg + intlAvg;
              const status = state.castingWorkflow[cId] ?? "Approved";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle/60 hover:bg-surface-2/50 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4 w-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedContestantIds.includes(cId), onChange: (e) => {
                  if (e.target.checked) {
                    setSelectedContestantIds((prev) => [...prev, cId]);
                  } else {
                    setSelectedContestantIds((prev) => prev.filter((id) => id !== cId));
                  }
                }, className: "rounded border-border-subtle text-accent focus:ring-accent bg-transparent w-4 h-4 cursor-pointer" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4 font-mono text-xs", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-xs text-accent font-semibold", children: cId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: c.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
                  selectedYear,
                  "-06-01"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
                  selectedYear,
                  "-07-31"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "editorial-label text-xs", children: status }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono", children: rateAvg.toFixed(1) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono", children: intlAvg.toFixed(1) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-serif font-bold text-accent text-base", children: total.toFixed(1) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "text-right px-4 space-x-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowJudgementModal(c), className: "text-xs uppercase tracking-wider font-semibold text-accent hover:underline", children: "Judgement Details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewingContestant(c), className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground hover:underline", children: "Details" })
                ] })
              ] }, cId);
            }),
            filteredContestants.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 11, className: "py-12 text-center text-muted-foreground", children: "No contestant records found for selected filters." }) })
          ] })
        ] }) })
      ] }),
      ["Winner", "Finals", "Top 4", "Top 8", "Top 16"].includes(activeTab) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-serif text-xl mb-2", children: [
          activeTab,
          " Details"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Stage data holds placeholder config and will be populated in subsequent contest stages." })
      ] })
    ] }),
    showAgencyModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-6xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent", children: "Agency Reviews" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-serif text-xl mt-0.5", children: [
            showAgencyModal.fullName,
            " (",
            showAgencyModal.contestantId,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAgencyModal(null), className: "p-2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "S.no" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "First name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Last Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Country" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: agencyUsers.map((u, i) => {
          const status = state.applicationsWorkflow[showAgencyModal.contestantId] ?? showAgencyModal.status;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle/40 hover:bg-surface-2/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-mono text-xs", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-medium", children: u.firstName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: u.lastName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 editorial-label text-xs", children: u.roles.filter((r) => ["Applications", "Ratings", "Casting Call", "Judgements"].includes(r)).join(", ") || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: u.country }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-muted-foreground", children: u.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${status === "Approved" ? "bg-emerald-500/10 text-emerald-500" : status === "Hold" ? "bg-amber-500/10 text-amber-500" : status === "Block" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"}`, children: status }) })
          ] }, u.id);
        }) })
      ] }) })
    ] }) }),
    showRatingModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-6xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent", children: "Ratings Panel Logs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-serif text-xl mt-0.5", children: [
            showRatingModal.fullName,
            " (",
            showRatingModal.contestantId,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowRatingModal(null), className: "p-2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "S.no" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "First name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Last Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Country" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Total ratings" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: ratingUsers.map((u, i) => {
          const score = state.rateScores[u.id]?.[showRatingModal.contestantId] ?? "—";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle/40 hover:bg-surface-2/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-mono text-xs", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-medium", children: u.firstName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: u.lastName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 editorial-label text-xs", children: u.roles.filter((r) => ["Applications", "Ratings", "Casting Call", "Judgements"].includes(r)).join(", ") || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: u.country }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-muted-foreground", children: u.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-serif font-bold text-accent text-base", children: score })
          ] }, u.id);
        }) })
      ] }) })
    ] }) }),
    showCastingModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-6xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent", children: "Casting Call Decisions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-serif text-xl mt-0.5", children: [
            showCastingModal.fullName,
            " (",
            showCastingModal.contestantId,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCastingModal(null), className: "p-2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "S.no" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "First name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Last Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Country" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: castingUsers.map((u, i) => {
          const status = state.castingWorkflow[showCastingModal.contestantId] ?? "Approved";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle/40 hover:bg-surface-2/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-mono text-xs", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-medium", children: u.firstName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: u.lastName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 editorial-label text-xs", children: u.roles.filter((r) => ["Applications", "Ratings", "Casting Call", "Judgements"].includes(r)).join(", ") || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: u.country }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-muted-foreground", children: u.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${status === "Selected" ? "bg-emerald-500/10 text-emerald-500" : status === "Hold" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"}`, children: status }) })
          ] }, u.id);
        }) })
      ] }) })
    ] }) }),
    showJudgementModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-6xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[85vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent", children: "Panel Judges Scores" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-serif text-xl mt-0.5", children: [
            showJudgementModal.fullName,
            " (",
            showJudgementModal.contestantId,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowJudgementModal(null), className: "p-2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left editorial-label text-muted-foreground border-b border-border-subtle bg-surface-2/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "S.no" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "First name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Last Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Country" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Status (Rating)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4 text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: judgementUsers.map((u, i) => {
          const scoresMap = state.judgeRatings[u.id]?.[showJudgementModal.contestantId] ?? {};
          const scoresList = Object.values(scoresMap).filter((s) => typeof s === "number");
          const finalAvg = scoresList.length ? avg(scoresList).toFixed(1) : "0.0";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle/40 hover:bg-surface-2/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-mono text-xs", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-medium", children: u.firstName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: u.lastName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 editorial-label text-xs", children: u.roles.filter((r) => ["Applications", "Ratings", "Casting Call", "Judgements"].includes(r)).join(", ") || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: u.country }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-muted-foreground", children: u.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-serif font-bold text-accent text-base", children: finalAvg }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowJudgeRatingsDetail({
              contestant: showJudgementModal,
              judge: u
            }), className: "text-xs uppercase tracking-wider font-semibold text-accent hover:underline", children: "Complete Details" }) })
          ] }, u.id);
        }) })
      ] }) })
    ] }) }),
    showJudgeRatingsDetail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-lg rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[80vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-accent", children: "Score Breakdown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-serif text-lg mt-0.5", children: [
            showJudgeRatingsDetail.judge.firstName,
            "'s Ratings for ",
            showJudgeRatingsDetail.contestant.fullName
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowJudgeRatingsDetail(null), className: "p-2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto flex-1 space-y-4", children: JUDGE_PARTICULARS.map((p) => {
        const score = state.judgeRatings[showJudgeRatingsDetail.judge.id]?.[showJudgeRatingsDetail.contestant.contestantId]?.[p.key] ?? 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-border-subtle/50 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: p.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-lg text-accent bg-accent/5 border border-accent/20 px-2 py-0.5 rounded-sm", children: score })
        ] }, p.key);
      }) })
    ] }) }),
    viewingContestant && /* @__PURE__ */ jsxRuntimeExports.jsx(ContestantDetailModal, { contestant: viewingContestant, onClose: () => setViewingContestant(null) }),
    successPopup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl font-bold tracking-tight", children: successPopup.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: successPopup.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSuccessPopup(null), className: "bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md", children: "OK" }) })
    ] }) })
  ] });
}
export {
  ReportsPage as component
};
