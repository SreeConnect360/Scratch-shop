import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link, d as useRouterState, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as usePortal, a as useCartTotal, b as useTheme, t as BrandLogo, T as ThemeToggle } from "./router-BFsnZUKW.mjs";
import { M as Menu, a7 as User, a6 as Heart, f as ShoppingBag, X, aw as Instagram, c as ChevronDown, at as LogOut, S as Search, ap as Calendar, I as EyeOff, G as Eye, a8 as Minus, P as Plus, T as Trash2 } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
const UKFlag = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 50 30", className: "w-5 h-3 inline-block", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: "t", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0 0v30h50V0z" }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0 0v30h50V0z", fill: "#012169" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0 0l50 30M50 0L0 30", stroke: "#fff", strokeWidth: "6" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0 0l50 30M50 0L0 30", stroke: "#c8102e", strokeWidth: "4" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0 15h50M25 0v30", stroke: "#fff", strokeWidth: "10" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0 15h50M25 0v30", stroke: "#c8102e", strokeWidth: "6" })
] });
const FacebookIcon = (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-4 h-4", ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" }) });
const XIcon = (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-4 h-4", ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }) });
function SidePanel({
  open,
  onClose,
  title,
  eyebrow,
  offset,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25 },
        className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.aside,
      {
        initial: { x: -420 },
        animate: { x: 0 },
        exit: { x: -420 },
        transition: { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] },
        className: "fixed inset-y-0 z-50 w-[88vw] max-w-[420px] text-sidebar-foreground border-r border-border-subtle flex flex-col liquid-glass rounded-none",
        style: { left: offset },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between px-8 pt-10 pb-6 border-b border-border-subtle", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-2", children: eyebrow }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl tracking-tight", children: title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 -mt-2 -mr-2 hover:text-accent", "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children })
        ]
      }
    )
  ] }) });
}
const COUNTRY_CODES = [
  { name: "France", code: "+33" },
  { name: "Italy", code: "+39" },
  { name: "Japan", code: "+81" },
  { name: "Nigeria", code: "+234" },
  { name: "Brazil", code: "+55" },
  { name: "USA", code: "+1" },
  { name: "South Korea", code: "+82" },
  { name: "Mexico", code: "+52" },
  { name: "Sweden", code: "+46" },
  { name: "India", code: "+91" },
  { name: "UK", code: "+44" },
  { name: "Spain", code: "+34" },
  { name: "Serbia", code: "+381" },
  { name: "Argentina", code: "+54" },
  { name: "Germany", code: "+49" },
  { name: "Canada", code: "+1" },
  { name: "China", code: "+86" },
  { name: "Russia", code: "+7" },
  { name: "South Africa", code: "+27" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "Australia", code: "+61" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Egypt", code: "+20" },
  { name: "Turkey", code: "+90" }
];
const REG_COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "BurkinaFaso",
  "Burma-Myanmar",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Catalonia",
  "Central African",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo DR",
  "Congo Republic",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "England",
  "Equatorial Guinea",
  "Eritra",
  "Estonia",
  "Ethiopia",
  "European Union",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibrlatar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guatemala",
  "Guinea-Bissau",
  "Guinea",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea-North",
  "Korea-South",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Lybia",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts",
  "Saint Lucia",
  "Saint Vincen",
  "Samoa",
  "San Marino",
  "Sao tome and principe",
  "Saudi Arabia",
  "Scot Land",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "UK",
  "US",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City Holy See",
  "Venezuela",
  "Vietnam",
  "Wales",
  "Westren Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "srilanka",
  "syria"
];
function AccountPanelBody({ onClose }) {
  const { state, signIn, signOut, registerUser } = usePortal();
  const navigate = useNavigate();
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [firstName, setFirstName] = reactExports.useState("");
  const [lastName, setLastName] = reactExports.useState("");
  const [phoneCode, setPhoneCode] = reactExports.useState("");
  const [phoneNumber, setPhoneNumber] = reactExports.useState("");
  const [gender, setGender] = reactExports.useState("");
  const [dob, setDob] = reactExports.useState("");
  const [country, setCountry] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = reactExports.useState(false);
  const [phoneSearch, setPhoneSearch] = reactExports.useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = reactExports.useState(false);
  const [countrySearch, setCountrySearch] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [openItem, setOpenItem] = reactExports.useState("dash");
  const phoneSearchRef = reactExports.useRef(null);
  const countrySearchRef = reactExports.useRef(null);
  const dobRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (phoneDropdownOpen && phoneSearchRef.current) {
      phoneSearchRef.current.focus();
    }
  }, [phoneDropdownOpen]);
  reactExports.useEffect(() => {
    if (countryDropdownOpen && countrySearchRef.current) {
      countrySearchRef.current.focus();
    }
  }, [countryDropdownOpen]);
  const handlePhoneSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const matches = COUNTRY_CODES.filter(
        (c) => c.name.toLowerCase().includes(phoneSearch.toLowerCase()) || c.code.includes(phoneSearch)
      );
      if (matches.length > 0) {
        e.preventDefault();
        setPhoneCode(matches[0].code);
        setPhoneDropdownOpen(false);
        setPhoneSearch("");
      }
    }
  };
  const handleCountrySearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const matches = REG_COUNTRIES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase()));
      if (matches.length > 0) {
        e.preventDefault();
        setCountry(matches[0]);
        setCountryDropdownOpen(false);
        setCountrySearch("");
      }
    }
  };
  if (state.user) {
    const groups = [
      { id: "dash", title: "My Dashboard", items: [
        { label: "Overview", to: "/FashionBattle/account" },
        { label: "Notifications", to: "/FashionBattle/account/notifications" }
      ] },
      { id: "info", title: "Account Information", items: [
        { label: "Profile", to: "/FashionBattle/account/profile" }
      ] },
      { id: "apply", title: "Apply To Contest", items: [
        { label: "Start Application", to: "/FashionBattle/apply" }
      ] },
      { id: "apps", title: "My Applications", items: [
        { label: "In Progress & Submitted", to: "/FashionBattle/account/applications" }
      ] },
      ...state.user.roles.includes("Applications") ? [
        { id: "rat-apps", title: "Applications", items: [{ label: "Process Applications", to: "/FashionBattle/account/role-applications" }] }
      ] : [],
      ...state.user.roles.includes("Ratings") ? [
        { id: "rat", title: "Ratings", items: [{ label: "Casting Ratings", to: "/FashionBattle/account/role-ratings" }] }
      ] : [],
      ...state.user.roles.includes("Casting Call") ? [
        { id: "cast", title: "Casting Call", items: [{ label: "Invitations", to: "/FashionBattle/account/role-casting" }] }
      ] : [],
      ...state.user.roles.includes("Judgements") ? [
        { id: "judge", title: "Judgements", items: [{ label: "Judge Notes", to: "/FashionBattle/account/role-judgements" }] }
      ] : [],
      { id: "status", title: "My Contest Status", items: [{ label: "Track Progress", to: "/FashionBattle/account/notifications" }] }
    ];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pb-6 mb-4 border-b border-border-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-sm font-medium", children: [
          state.user.firstName[0],
          state.user.lastName[0]
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
            state.user.firstName,
            " ",
            state.user.lastName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: state.user.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border-subtle", children: groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setOpenItem(openItem === g.id ? null : g.id),
            className: "w-full flex items-center justify-between py-4 editorial-eyebrow text-foreground/80 hover:text-accent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: g.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `w-3.5 h-3.5 transition-transform ${openItem === g.id ? "rotate-180 text-accent" : ""}` })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: openItem === g.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.25 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-4 pl-2 space-y-2", children: g.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: it.to,
                onClick: onClose,
                className: "block text-xs text-foreground/70 hover:text-accent py-1",
                children: [
                  "→ ",
                  it.label
                ]
              },
              it.label
            )) })
          }
        ) })
      ] }, g.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            signOut();
            onClose();
          },
          className: "mt-8 w-full flex items-center justify-center gap-2 bg-accent text-white py-3 editorial-label hover:bg-accent/90 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-3.5 h-3.5" }),
            " Logout"
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-6 mb-8 border-b border-border-subtle", children: ["signin", "register"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setMode(m),
        className: `pb-3 editorial-eyebrow transition-colors ${mode === m ? "text-accent border-b border-accent -mb-px" : "text-muted-foreground hover:text-foreground"}`,
        children: m === "signin" ? "Sign In" : "Register"
      },
      m
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          setError(null);
          if (mode === "signin") {
            const success = signIn(email, `${firstName} ${lastName}`.trim() || void 0);
            if (!success) {
              setError("This email address is not registered. Please create an account first.");
            } else {
              onClose();
              navigate({ to: "/FashionBattle/account", search: { tab: "dashboard" } });
            }
          } else {
            if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneCode || !phoneNumber.trim() || !gender || !dob || !country || !password || !confirmPassword) {
              setError("All fields are mandatory to fill.");
              return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
              setError("Please enter a valid email address.");
              return;
            }
            const phoneDigits = phoneNumber.replace(/\D/g, "");
            if (phoneCode === "+91") {
              if (phoneDigits.length !== 10) {
                setError("For India (+91), the phone number must be exactly 10 digits.");
                return;
              }
            } else {
              if (phoneDigits.length < 7 || phoneDigits.length > 15) {
                setError("Please enter a valid phone number (7 to 15 digits).");
                return;
              }
            }
            const birthDate = new Date(dob);
            const today = /* @__PURE__ */ new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
              age--;
            }
            if (isNaN(age) || age < 18 || birthDate.getFullYear() < 1900) {
              setError("You must be 18 years or older to register.");
              return;
            }
            if (password !== confirmPassword) {
              setError("Passwords do not match.");
              return;
            }
            registerUser({
              email: email.trim(),
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              phone: `${phoneCode} ${phoneNumber.trim()}`,
              gender,
              dob,
              country
            });
            onClose();
            navigate({ to: "/FashionBattle/account", search: { tab: "dashboard" } });
          }
        },
        className: "space-y-5",
        children: [
          mode === "register" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "First Name *", value: firstName, onChange: setFirstName, required: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last Name *", value: lastName, onChange: setLastName, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground/80 text-[10px] block mb-1", children: "Phone Number *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPhoneDropdownOpen(!phoneDropdownOpen),
                    className: "flex items-center gap-1.5 border-b border-foreground/25 py-2 px-1.5 focus:border-accent outline-none text-xs bg-transparent",
                    style: { minWidth: "75px" },
                    children: [
                      phoneCode ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: phoneCode }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Code" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3 ml-auto text-muted-foreground" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "tel",
                    value: phoneNumber,
                    onChange: (e) => setPhoneNumber(e.target.value),
                    placeholder: "6 0000 0000",
                    required: true,
                    className: "flex-1 bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent placeholder:text-muted-foreground/50 text-xs"
                  }
                ),
                phoneDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 w-64 mt-1 bg-background border border-border-subtle shadow-xl z-50 rounded p-2.5 space-y-2 max-h-48 overflow-y-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-surface-2 px-1.5 py-1 border border-border-subtle rounded", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3 h-3 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        ref: phoneSearchRef,
                        value: phoneSearch,
                        onChange: (e) => setPhoneSearch(e.target.value),
                        onKeyDown: handlePhoneSearchKeyDown,
                        placeholder: "Search code...",
                        className: "bg-transparent text-[10px] outline-none w-full"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: COUNTRY_CODES.filter(
                    (c) => c.name.toLowerCase().includes(phoneSearch.toLowerCase()) || c.code.includes(phoneSearch)
                  ).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setPhoneCode(item.code);
                        setPhoneDropdownOpen(false);
                        setPhoneSearch("");
                      },
                      className: "flex items-center w-full text-left p-1.5 hover:bg-surface-2 transition-colors text-[10px]",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: item.code }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground ml-auto", children: item.name })
                      ]
                    },
                    item.name
                  )) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground/80 text-[10px]", children: "Gender *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: gender,
                    onChange: (e) => setGender(e.target.value),
                    required: true,
                    className: "mt-2 w-full bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-background text-muted-foreground", children: "Select" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Female", className: "bg-background text-foreground", children: "Female" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Male", className: "bg-background text-foreground", children: "Male" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Other", className: "bg-background text-foreground", children: "Other" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground/80 text-[10px]", children: "Date of Birth *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: dobRef,
                      type: "date",
                      value: dob,
                      onChange: (e) => setDob(e.target.value),
                      required: true,
                      className: "mt-2 w-full bg-transparent border-b border-foreground/25 py-2 pr-6 outline-none focus:border-accent text-xs transition-colors"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        try {
                          dobRef.current?.showPicker();
                        } catch (err) {
                          dobRef.current?.focus();
                        }
                      },
                      className: "absolute right-1 bottom-2 text-muted-foreground hover:text-foreground",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground/80 text-[10px] block mb-1", children: "Country *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setCountryDropdownOpen(!countryDropdownOpen),
                  className: "flex items-center gap-1.5 border-b border-foreground/25 py-2 w-full text-left focus:border-accent outline-none text-xs bg-transparent",
                  children: [
                    country ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: `/api/flags?country=${encodeURIComponent(country)}`,
                          className: "w-3.5 h-3.5 rounded-full object-cover",
                          alt: ""
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: country })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Select Country" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3 ml-auto text-muted-foreground" })
                  ]
                }
              ),
              countryDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 w-full mt-1 bg-background border border-border-subtle shadow-xl z-50 rounded p-2.5 space-y-2 max-h-48 overflow-y-auto", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-surface-2 px-1.5 py-1 border border-border-subtle rounded", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3 h-3 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      ref: countrySearchRef,
                      value: countrySearch,
                      onChange: (e) => setCountrySearch(e.target.value),
                      onKeyDown: handleCountrySearchKeyDown,
                      placeholder: "Search country...",
                      className: "bg-transparent text-[10px] outline-none w-full"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: REG_COUNTRIES.filter(
                  (c) => c.toLowerCase().includes(countrySearch.toLowerCase())
                ).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setCountry(c);
                      setCountryDropdownOpen(false);
                      setCountrySearch("");
                    },
                    className: "flex items-center gap-2.5 w-full text-left p-1.5 hover:bg-surface-2 transition-colors text-[10px]",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: `/api/flags?country=${encodeURIComponent(c)}`,
                          className: "w-3.5 h-3.5 rounded-full object-cover",
                          alt: ""
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c })
                    ]
                  },
                  c
                )) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email *", type: "email", value: email, onChange: setEmail, required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground/80 text-[10px]", children: "Password *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: showPassword ? "text" : "password",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  placeholder: "••••••••",
                  required: true,
                  className: "mt-2 w-full bg-transparent border-b border-foreground/25 py-2 pr-6 outline-none focus:border-accent text-xs"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute right-1 bottom-2 text-muted-foreground hover:text-foreground",
                  children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] }),
          mode === "register" && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground/80 text-[10px]", children: "Confirm Password *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: showConfirmPassword ? "text" : "password",
                  value: confirmPassword,
                  onChange: (e) => setConfirmPassword(e.target.value),
                  placeholder: "••••••••",
                  required: true,
                  className: "mt-2 w-full bg-transparent border-b border-foreground/25 py-2 pr-6 outline-none focus:border-accent text-xs"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowConfirmPassword(!showConfirmPassword),
                  className: "absolute right-1 bottom-2 text-muted-foreground hover:text-foreground",
                  children: showConfirmPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-rose-500", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              className: "w-full bg-accent text-white py-3 editorial-label hover:bg-accent/90 transition-colors",
              children: mode === "signin" ? "Sign In" : "Create Account"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-xs text-muted-foreground text-center", children: "By continuing you agree to the ReeVibes Maison terms & editorial code." })
  ] });
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  required
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground/80 text-[10px]", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        value,
        onChange: (e) => onChange(e.target.value),
        required,
        className: "mt-2 w-full bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent text-sm"
      }
    )
  ] });
}
function FavoritesPanelBody({ onClose }) {
  const { state } = usePortal();
  const sections = [
    { title: "Saved Contestants", items: state.favorites },
    { title: "Saved Photography", items: [] },
    { title: "Saved Angels", items: [] },
    { title: "Saved Fashion Items", items: [] }
  ];
  const empty = sections.every((s) => s.items.length === 0);
  if (empty) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-8 h-8 mx-auto text-muted-foreground/50", strokeWidth: 1.2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 editorial-label text-muted-foreground", children: "No Favorites Yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-3 max-w-xs mx-auto", children: "Tap the heart on any contestant, photograph or fashion piece to curate your private maison." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/angels", onClick: onClose, className: "inline-block mt-6 editorial-label text-accent border-b border-accent pb-0.5", children: "Explore Angels" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-8 py-6 space-y-8", children: sections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground mb-3", children: [
      s.title,
      " · ",
      s.items.length
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      s.items.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/angels", onClick: onClose, className: "aspect-[3/4] bg-surface-2 border border-border-subtle" }, id)),
      s.items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-xs text-muted-foreground/60 italic", children: "Empty" })
    ] })
  ] }, s.title)) });
}
function CartPanelBody({ onClose }) {
  const { state, removeFromCart, addToCart } = usePortal();
  const { total } = useCartTotal();
  if (state.cart.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8 mx-auto text-muted-foreground/50", strokeWidth: 1.2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 editorial-label text-muted-foreground", children: "Your Bag Is Empty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/house-of-fashion", onClick: onClose, className: "inline-block mt-6 editorial-label text-accent border-b border-accent pb-0.5", children: "Discover House of Fashion" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-8 py-6 space-y-6 divide-y divide-border-subtle", children: state.cart.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 pt-6 first:pt-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-24 bg-surface-2 border border-border-subtle overflow-hidden flex-shrink-0", children: c.image && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.image, alt: c.name, className: "w-full h-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground text-[10px]", children: c.house }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm mt-1 truncate", children: c.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: c.price }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addToCart({ ...c, qty: -1 }), className: "p-1 border border-border-subtle hover:border-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs w-6 text-center", children: c.qty }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addToCart({ ...c, qty: 1 }), className: "p-1 border border-border-subtle hover:border-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeFromCart(c.productId), className: "ml-auto p-1 text-muted-foreground hover:text-accent", "aria-label": "Remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
        ] })
      ] })
    ] }, c.productId)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-6 border-t border-border-subtle space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Subtotal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif text-xl", children: [
          "€",
          total.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/cart", onClick: onClose, className: "block text-center bg-accent text-white py-3 editorial-label hover:bg-accent/90", children: "Checkout" })
    ] })
  ] });
}
function ExpandedNav({ onNavigate }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { state, signOut } = usePortal();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const handleLogout = () => {
    signOut();
    onNavigate();
    navigate({ to: "/FashionBattle" });
  };
  const navItems = [
    { to: "/FashionBattle", label: "Homepage" },
    { to: "/FashionBattle/live-contest", label: "Live-Contest" },
    { to: "/FashionBattle/angels", label: "Angels" },
    { to: "/FashionBattle/best-photography", label: "Best Photography" },
    { to: "/FashionBattle/about", label: "About Us", hasPlus: true },
    ...state.user ? [
      { to: "/FashionBattle/account", label: "My Account" },
      { onClick: handleLogout, label: "Sign Out" }
    ] : [
      { to: "/FashionBattle/register", label: "Register" },
      { to: "/FashionBattle/login", label: "Sign In" }
    ],
    { to: "/FashionBattle/apply", label: "Apply To Contest" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col flex-1 min-h-0 justify-between transition-colors duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-surface text-foreground"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "px-8 py-4 flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-4", children: [
      navItems.map((item, idx) => {
        const active = item.to ? item.to === "/" ? path === "/" : path.startsWith(item.to) : false;
        const content = /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "uppercase text-[11px] tracking-[0.2em] font-medium flex items-center justify-between w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }),
          item.hasPlus && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-light ${theme === "dark" ? "text-white/60" : "text-muted-foreground/60"}`, children: "+" })
        ] });
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "relative", children: item.to ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            onClick: onNavigate,
            className: `flex items-center py-2 transition-colors relative ${active ? "text-accent" : theme === "dark" ? "text-white/80 hover:text-accent" : "text-foreground/80 hover:text-accent"}`,
            children: [
              content,
              active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-8 w-1.5 h-6 bg-accent" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: item.onClick,
            className: `w-full text-left flex items-center py-2 transition-colors ${theme === "dark" ? "text-white/80 hover:text-accent" : "text-foreground/80 hover:text-accent"}`,
            children: content
          }
        ) }, idx);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "pt-4 border-t border-border-subtle flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "uppercase text-[11px] tracking-[0.2em] font-medium opacity-80", children: "Theme" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, { className: `transition-all ${theme === "dark" ? "text-white border-white/20 hover:bg-white/10" : "text-foreground border-foreground/20 hover:bg-foreground/5"}` })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-center gap-6 pb-6 ${theme === "dark" ? "text-white/85" : "text-foreground/80"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-accent transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "w-4.5 h-4.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-accent transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FacebookIcon, { className: "w-4.5 h-4.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "hover:text-accent transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(XIcon, { className: "w-4.5 h-4.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/FashionBattle/house-of-fashion",
          onClick: onNavigate,
          className: `py-4 text-center block hover:opacity-90 transition-opacity border-t ${theme === "dark" ? "bg-[#1C1C1E] border-white/5 text-white" : "bg-surface-2 border-border-subtle text-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[8px] uppercase tracking-[0.3em] mb-0.5 ${theme === "dark" ? "text-white/50" : "text-muted-foreground/50"}`, children: "Discover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-[0.2em] font-serif font-semibold", children: [
              "House of ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Fashion." })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function PublicLayout({ children }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [panel, setPanel] = reactExports.useState(null);
  const { state } = usePortal();
  const { count } = useCartTotal();
  const { theme } = useTheme();
  const unread = state.notifications.filter((n) => n.unread).length;
  const favCount = state.favorites.length;
  const sidebarW = expanded ? 280 : 72;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground public-layout", children: [
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity",
        onClick: () => setExpanded(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: `fixed inset-y-0 left-0 flex flex-col border-r border-border-subtle transition-all duration-300 z-40 overflow-y-auto scrollbar-none liquid-glass rounded-none`,
        style: { width: sidebarW },
        children: [
          !expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col items-center pt-6 pb-6 min-h-full justify-between w-[72px] flex-shrink-0 transition-colors duration-300 ${theme === "dark" ? "bg-black" : "bg-surface"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center w-full gap-5 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setExpanded(true),
                  "aria-label": "Expand menu",
                  className: "flex flex-col items-center justify-center p-2 text-accent hover:opacity-85 transition-opacity",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-6 h-6 mb-1", strokeWidth: 2.5 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-bold tracking-[0.2em] uppercase", children: "Menu" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: state.user ? "/FashionBattle/account" : "/FashionBattle/login",
                    className: `transition-colors relative flex items-center justify-center w-10 h-10 ${theme === "dark" ? "text-white hover:text-accent" : "text-foreground hover:text-accent"}`,
                    title: "Account",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-[18px] h-[18px]", strokeWidth: 1.5 }),
                      unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-1 bg-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center", children: unread })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setPanel("favorites"),
                    className: `transition-colors relative flex items-center justify-center w-10 h-10 ${panel === "favorites" ? "text-accent" : theme === "dark" ? "text-white hover:text-accent" : "text-foreground hover:text-accent"}`,
                    title: "Favorites",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-[18px] h-[18px]", strokeWidth: 1.5 }),
                      favCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-1 bg-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center", children: favCount })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setPanel("cart"),
                    className: `transition-colors relative flex items-center justify-center w-10 h-10 ${panel === "cart" ? "text-accent" : theme === "dark" ? "text-white hover:text-accent" : "text-foreground hover:text-accent"}`,
                    title: "Shopping Bag",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-[18px] h-[18px]", strokeWidth: 1.5 }),
                      count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-1 bg-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center", children: count })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center flex-shrink-0 justify-between py-6 gap-12", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 flex justify-center opacity-95 mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { className: "w-full h-auto" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-60 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `whitespace-nowrap font-serif tracking-[0.22em] uppercase text-[15px] md:text-[16px] font-medium transition-colors duration-300 ${theme === "dark" ? "text-white/95" : "text-foreground"}`,
                  style: { transform: "rotate(-90deg)", transformOrigin: "center" },
                  children: [
                    "Beauty of Finest ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Curves." })
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-2 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UKFlag, {}) })
          ] }),
          expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `absolute inset-0 flex flex-col transition-all duration-300 overflow-y-auto scrollbar-none ${theme === "dark" ? "bg-black text-white" : "bg-surface text-foreground"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 pt-8 pb-4 flex flex-col items-center justify-center relative border-b border-white/5 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-8 right-8 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => setExpanded(false),
                      className: `p-1.5 transition-colors ${theme === "dark" ? "text-white/60 hover:text-accent" : "text-muted-foreground/60 hover:text-accent"}`,
                      "aria-label": "Close menu",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle", onClick: () => setExpanded(false), className: "block mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { className: "w-36 h-auto" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-4 uppercase text-[12px] md:text-[13px] tracking-[0.25em] font-serif text-center ${theme === "dark" ? "text-white/90" : "text-foreground/90"}`, children: [
                    "Beauty of Finest ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Curves." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExpandedNav, { onNavigate: () => setExpanded(false) })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidePanel, { open: panel === "account", onClose: () => setPanel(null), title: state.user ? "My Account" : "Welcome", eyebrow: "Maison", offset: 72, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccountPanelBody, { onClose: () => setPanel(null) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidePanel, { open: panel === "favorites", onClose: () => setPanel(null), title: "Favorites", eyebrow: "Curation", offset: 72, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FavoritesPanelBody, { onClose: () => setPanel(null) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidePanel, { open: panel === "cart", onClose: () => setPanel(null), title: "Shopping Bag", eyebrow: "House of Fashion", offset: 72, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CartPanelBody, { onClose: () => setPanel(null) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen pl-[72px]", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "pl-[72px] border-t border-border-subtle mt-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-4 gap-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { className: "h-12 w-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground max-w-sm", children: "A cinematic luxury platform celebrating women through fashion contests, editorial storytelling and runway culture." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-4", children: "Explore" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/angels", className: "hover:text-accent", children: "Angels" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/live-contest", className: "hover:text-accent", children: "Live Contest" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/best-photography", className: "hover:text-accent", children: "Photography" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/house-of-fashion", className: "hover:text-accent", children: "House of Fashion" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-4", children: "House" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/about", className: "hover:text-accent", children: "About" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/apply", className: "hover:text-accent", children: "Apply" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/login", className: "hover:text-accent", children: "Sign In" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/account", search: { tab: "dashboard" }, className: "hover:text-accent", children: "My Account" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border-subtle px-6 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " ReeVibes · Maison du Style"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label", children: "Paris · Milan · Lagos · Tokyo" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:hidden fixed bottom-6 left-4 right-4 h-16 z-50 liquid-glass flex items-center justify-around px-4 shadow-2xl rounded-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex flex-col items-center justify-center text-muted-foreground hover:text-accent transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] uppercase tracking-widest mt-1", children: "Shop" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPanel("favorites"), className: `flex flex-col items-center justify-center transition-colors relative ${panel === "favorites" ? "text-accent" : "text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5" }),
        favCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center", children: favCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] uppercase tracking-widest mt-1", children: "Wishlist" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/FashionBattle/account", search: { tab: "dashboard" }, className: "flex flex-col items-center justify-center text-muted-foreground hover:text-accent transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] uppercase tracking-widest mt-1", children: "Account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPanel("cart"), className: `flex flex-col items-center justify-center transition-colors relative ${panel === "cart" ? "text-accent" : "text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5" }),
        count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center", children: count }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] uppercase tracking-widest mt-1", children: "Cart" })
      ] })
    ] })
  ] });
}
export {
  PublicLayout as P
};
