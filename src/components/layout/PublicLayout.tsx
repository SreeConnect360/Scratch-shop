import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, ShoppingBag, Instagram, User, Heart, LogOut, ChevronDown,
  Globe, Trash2, Plus, Minus, Menu, Calendar, Eye, EyeOff, Search
} from "lucide-react";
import { BrandLogo, ThemeToggle } from "@/components/theme/ThemeToggle";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { useTheme } from "@/hooks/use-theme";
import captionBlack from "@/assets/caption-beauty-black.png";
import captionWhite from "@/assets/caption-beauty-white.png";

const UKFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" className="w-5 h-3 inline-block">
    <clipPath id="t">
      <path d="M0 0v30h50V0z"/>
    </clipPath>
    <path d="M0 0v30h50V0z" fill="#012169"/>
    <path d="M0 0l50 30M50 0L0 30" stroke="#fff" strokeWidth="6"/>
    <path d="M0 0l50 30M50 0L0 30" stroke="#c8102e" strokeWidth="4"/>
    <path d="M0 15h50M25 0v30" stroke="#fff" strokeWidth="10"/>
    <path d="M0 15h50M25 0v30" stroke="#c8102e" strokeWidth="6"/>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);


/* ─────────────────── nav config ─────────────────── */
const MAIN_NAV = [
  { to: "/FashionBattle", label: "Home" },
  { to: "/FashionBattle/live-contest", label: "Live Contest" },
  { to: "/FashionBattle/angels", label: "Angels" },
  { to: "/FashionBattle/best-photography", label: "Photography" },
  { to: "/FashionBattle/house-of-fashion", label: "House of Fashion" },
  { to: "/FashionBattle/about", label: "About" },
] as const;

const ACCOUNT_NAV = [
  { to: "/FashionBattle/account", label: "My Dashboard" },
  { to: "/FashionBattle/account/profile", label: "Account Information" },
  { to: "/FashionBattle/apply", label: "Apply To Contest" },
  { to: "/FashionBattle/account/applications", label: "Applications" },
  { to: "/FashionBattle/account/applications", label: "Ratings" },
  { to: "/FashionBattle/account/applications", label: "Casting Call" },
  { to: "/FashionBattle/account/applications", label: "Judgements" },
  { to: "/FashionBattle/account/notifications", label: "My Contest Status" },
] as const;

const COUNTRIES = ["Global", "France", "Italy", "Japan", "Nigeria", "Brazil", "USA"];

/* ─────────────────── helpers ─────────────────── */
function VerticalCaption() {
  return (
    <div className="flex items-center justify-center h-48 w-6">
      <div
        className="whitespace-nowrap font-serif tracking-[0.35em] uppercase text-[10px] text-foreground/80"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      >
        Beauty of Finest <span className="text-accent">Curves.</span>
      </div>
    </div>
  );
}

function IconButton({
  icon: Icon, label, onClick, active, badge,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string; onClick: () => void; active?: boolean; badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
        active ? "text-accent" : "text-foreground/80 hover:text-accent"
      }`}
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={1.4} />
      {badge && badge > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] leading-none w-4 h-4 rounded-full flex items-center justify-center">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

/* ─────────────────── slide panels ─────────────────── */
function SidePanel({
  open, onClose, title, eyebrow, offset, children,
}: {
  open: boolean; onClose: () => void; title: string; eyebrow?: string; offset: number; children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -420 }} animate={{ x: 0 }} exit={{ x: -420 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="fixed inset-y-0 z-50 w-[88vw] max-w-[420px] text-sidebar-foreground border-r border-border-subtle flex flex-col liquid-glass rounded-none"
            style={{ left: offset }}
          >
            <div className="flex items-start justify-between px-8 pt-10 pb-6 border-b border-border-subtle">
              <div>
                {eyebrow && <div className="editorial-label text-muted-foreground mb-2">{eyebrow}</div>}
                <h2 className="font-serif text-2xl tracking-tight">{title}</h2>
              </div>
              <button onClick={onClose} className="p-2 -mt-2 -mr-2 hover:text-accent" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
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
  { name: "Turkey", code: "+90" },
];

const REG_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", 
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", 
  "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "BurkinaFaso", "Burma-Myanmar", 
  "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Catalonia", "Central African", "Chad", "Chile", "China", 
  "Colombia", "Comoros", "Congo DR", "Congo Republic", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", 
  "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "England", "Equatorial Guinea", "Eritra", 
  "Estonia", "Ethiopia", "European Union", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", 
  "Ghana", "Gibrlatar", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea-Bissau", "Guinea", "Guyana", "Haiti", 
  "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
  "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea-North", "Korea-South", 
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", 
  "Luxembourg", "Lybia", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", 
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
  "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts", "Saint Lucia", "Saint Vincen", "Samoa", "San Marino", 
  "Sao tome and principe", "Saudi Arabia", "Scot Land", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
  "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", 
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad", "Tunisia", "Turkey", "Turkmenistan", 
  "Tuvalu", "UK", "US", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City Holy See", 
  "Venezuela", "Vietnam", "Wales", "Westren Sahara", "Yemen", "Zambia", "Zimbabwe", "srilanka", "syria"
];

function AccountPanelBody({ onClose }: { onClose: () => void }) {
  const { state, signIn, signOut, registerUser } = usePortal();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>("dash");

  const phoneSearchRef = useRef<HTMLInputElement>(null);
  const countrySearchRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phoneDropdownOpen && phoneSearchRef.current) {
      phoneSearchRef.current.focus();
    }
  }, [phoneDropdownOpen]);

  useEffect(() => {
    if (countryDropdownOpen && countrySearchRef.current) {
      countrySearchRef.current.focus();
    }
  }, [countryDropdownOpen]);

  const handlePhoneSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const matches = COUNTRY_CODES.filter(
        c => c.name.toLowerCase().includes(phoneSearch.toLowerCase()) || c.code.includes(phoneSearch)
      );
      if (matches.length > 0) {
        e.preventDefault();
        setPhoneCode(matches[0].code);
        setPhoneDropdownOpen(false);
        setPhoneSearch("");
      }
    }
  };

  const handleCountrySearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const matches = REG_COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));
      if (matches.length > 0) {
        e.preventDefault();
        setCountry(matches[0]);
        setCountryDropdownOpen(false);
        setCountrySearch("");
      }
    }
  };

  if (state.user) {
    const groups: { id: string; title: string; items: { label: string; to: string }[] }[] = [
      { id: "dash", title: "My Dashboard", items: [
        { label: "Overview", to: "/FashionBattle/account" },
        { label: "Notifications", to: "/FashionBattle/account/notifications" },
      ]},
      { id: "info", title: "Account Information", items: [
        { label: "Profile", to: "/FashionBattle/account/profile" },
      ]},
      { id: "apply", title: "Apply To Contest", items: [
        { label: "Start Application", to: "/FashionBattle/apply" },
      ]},
      { id: "apps", title: "My Applications", items: [
        { label: "In Progress & Submitted", to: "/FashionBattle/account/applications" },
      ]},
      ...(state.user.roles.includes("Applications") ? [
        { id: "rat-apps", title: "Applications", items: [{ label: "Process Applications", to: "/FashionBattle/account/role-applications" }] }
      ] : []),
      ...(state.user.roles.includes("Ratings") ? [
        { id: "rat", title: "Ratings", items: [{ label: "Casting Ratings", to: "/FashionBattle/account/role-ratings" }] }
      ] : []),
      ...(state.user.roles.includes("Casting Call") ? [
        { id: "cast", title: "Casting Call", items: [{ label: "Invitations", to: "/FashionBattle/account/role-casting" }] }
      ] : []),
      ...(state.user.roles.includes("Judgements") ? [
        { id: "judge", title: "Judgements", items: [{ label: "Judge Notes", to: "/FashionBattle/account/role-judgements" }] }
      ] : []),
      { id: "status", title: "My Contest Status", items: [{ label: "Track Progress", to: "/FashionBattle/account/notifications" }] },
    ];
    return (
      <div className="px-8 py-6">
        <div className="flex items-center gap-3 pb-6 mb-4 border-b border-border-subtle">
          <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-sm font-medium">
            {state.user.firstName[0]}{state.user.lastName[0]}
          </div>
          <div className="flex-1">
            <div className="text-sm">{state.user.firstName} {state.user.lastName}</div>
            <div className="text-xs text-muted-foreground">{state.user.email}</div>
          </div>
        </div>
        <div className="divide-y divide-border-subtle">
          {groups.map(g => (
            <div key={g.id}>
              <button
                onClick={() => setOpenItem(openItem === g.id ? null : g.id)}
                className="w-full flex items-center justify-between py-4 editorial-eyebrow text-foreground/80 hover:text-accent"
              >
                <span>{g.title}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openItem === g.id ? "rotate-180 text-accent" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {openItem === g.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 pl-2 space-y-2">
                      {g.items.map(it => (
                        <Link
                          key={it.label} to={it.to} onClick={onClose}
                          className="block text-xs text-foreground/70 hover:text-accent py-1"
                        >
                          → {it.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <button
          onClick={() => { signOut(); onClose(); }}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-accent text-white py-3 editorial-label hover:bg-accent/90 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="flex gap-6 mb-8 border-b border-border-subtle">
        {(["signin", "register"] as const).map(m => (
          <button
            key={m} onClick={() => setMode(m)}
            className={`pb-3 editorial-eyebrow transition-colors ${mode === m ? "text-accent border-b border-accent -mb-px" : "text-muted-foreground hover:text-foreground"}`}
          >
            {m === "signin" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          if (mode === "signin") {
            const success = signIn(email, `${firstName} ${lastName}`.trim() || undefined);
            if (!success) {
              setError("This email address is not registered. Please create an account first.");
            } else {
              onClose();
              navigate({ to: "/FashionBattle/account", search: { tab: "dashboard" } });
            }
          } else {
            // Mandatory checks
            if (
              !firstName.trim() ||
              !lastName.trim() ||
              !email.trim() ||
              !phoneCode ||
              !phoneNumber.trim() ||
              !gender ||
              !dob ||
              !country ||
              !password ||
              !confirmPassword
            ) {
              setError("All fields are mandatory to fill.");
              return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
              setError("Please enter a valid email address.");
              return;
            }

            // Phone validations
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

            // DOB age validation (Must be 18+)
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
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
              country,
            });
            onClose();
            navigate({ to: "/FashionBattle/account", search: { tab: "dashboard" } });
          }
        }}
        className="space-y-5"
      >
        {mode === "register" && (
          <>
            {/* First and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name *" value={firstName} onChange={setFirstName} required />
              <Field label="Last Name *" value={lastName} onChange={setLastName} required />
            </div>

            {/* Custom Phone Code & Number Selector */}
            <div className="block">
              <span className="editorial-label text-muted-foreground/80 text-[10px] block mb-1">Phone Number *</span>
              <div className="flex gap-2 relative">
                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                  className="flex items-center gap-1.5 border-b border-foreground/25 py-2 px-1.5 focus:border-accent outline-none text-xs bg-transparent"
                  style={{ minWidth: "75px" }}
                >
                  {phoneCode ? (
                    <span>{phoneCode}</span>
                  ) : (
                    <span className="text-muted-foreground/60">Code</span>
                  )}
                  <ChevronDown className="w-3 h-3 ml-auto text-muted-foreground" />
                </button>

                {/* Number input */}
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="6 0000 0000"
                  required
                  className="flex-1 bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent placeholder:text-muted-foreground/50 text-xs"
                />

                {/* Code selector popup */}
                {phoneDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 mt-1 bg-background border border-border-subtle shadow-xl z-50 rounded p-2.5 space-y-2 max-h-48 overflow-y-auto">
                    <div className="flex items-center gap-1.5 bg-surface-2 px-1.5 py-1 border border-border-subtle rounded">
                      <Search className="w-3 h-3 text-muted-foreground" />
                      <input
                        type="text"
                        ref={phoneSearchRef}
                        value={phoneSearch}
                        onChange={e => setPhoneSearch(e.target.value)}
                        onKeyDown={handlePhoneSearchKeyDown}
                        placeholder="Search code..."
                        className="bg-transparent text-[10px] outline-none w-full"
                      />
                    </div>
                    <div className="space-y-0.5">
                      {COUNTRY_CODES.filter(
                        c =>
                          c.name.toLowerCase().includes(phoneSearch.toLowerCase()) ||
                          c.code.includes(phoneSearch)
                      ).map(item => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            setPhoneCode(item.code);
                            setPhoneDropdownOpen(false);
                            setPhoneSearch("");
                          }}
                          className="flex items-center w-full text-left p-1.5 hover:bg-surface-2 transition-colors text-[10px]"
                        >
                          <span className="font-semibold">{item.code}</span>
                          <span className="text-muted-foreground ml-auto">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gender and DOB */}
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="editorial-label text-muted-foreground/80 text-[10px]">Gender *</span>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  required
                  className="mt-2 w-full bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent text-xs"
                >
                  <option value="" className="bg-background text-muted-foreground">Select</option>
                  <option value="Female" className="bg-background text-foreground">Female</option>
                  <option value="Male" className="bg-background text-foreground">Male</option>
                  <option value="Other" className="bg-background text-foreground">Other</option>
                </select>
              </label>

              <label className="block relative">
                <span className="editorial-label text-muted-foreground/80 text-[10px]">Date of Birth *</span>
                <div className="relative">
                  <input
                    ref={dobRef}
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    required
                    className="mt-2 w-full bg-transparent border-b border-foreground/25 py-2 pr-6 outline-none focus:border-accent text-xs transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        dobRef.current?.showPicker();
                      } catch (err) {
                        dobRef.current?.focus();
                      }
                    }}
                    className="absolute right-1 bottom-2 text-muted-foreground hover:text-foreground"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </button>
                </div>
              </label>
            </div>

            {/* Custom Country Selector */}
            <div className="block relative">
              <span className="editorial-label text-muted-foreground/80 text-[10px] block mb-1">Country *</span>
              <button
                type="button"
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="flex items-center gap-1.5 border-b border-foreground/25 py-2 w-full text-left focus:border-accent outline-none text-xs bg-transparent"
              >
                {country ? (
                  <>
                    <img
                      src={`/api/flags?country=${encodeURIComponent(country)}`}
                      className="w-3.5 h-3.5 rounded-full object-cover"
                      alt=""
                    />
                    <span>{country}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground/60">Select Country</span>
                )}
                <ChevronDown className="w-3 h-3 ml-auto text-muted-foreground" />
              </button>

              {countryDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-background border border-border-subtle shadow-xl z-50 rounded p-2.5 space-y-2 max-h-48 overflow-y-auto">
                  <div className="flex items-center gap-1.5 bg-surface-2 px-1.5 py-1 border border-border-subtle rounded">
                    <Search className="w-3 h-3 text-muted-foreground" />
                    <input
                      type="text"
                      ref={countrySearchRef}
                      value={countrySearch}
                      onChange={e => setCountrySearch(e.target.value)}
                      onKeyDown={handleCountrySearchKeyDown}
                      placeholder="Search country..."
                      className="bg-transparent text-[10px] outline-none w-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    {REG_COUNTRIES.filter(c =>
                      c.toLowerCase().includes(countrySearch.toLowerCase())
                    ).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCountry(c);
                          setCountryDropdownOpen(false);
                          setCountrySearch("");
                        }}
                        className="flex items-center gap-2.5 w-full text-left p-1.5 hover:bg-surface-2 transition-colors text-[10px]"
                      >
                        <img
                          src={`/api/flags?country=${encodeURIComponent(c)}`}
                          className="w-3.5 h-3.5 rounded-full object-cover"
                          alt=""
                        />
                        <span>{c}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <Field label="Email *" type="email" value={email} onChange={setEmail} required />

        {/* Password eye field */}
        <label className="block relative">
          <span className="editorial-label text-muted-foreground/80 text-[10px]">Password *</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-2 w-full bg-transparent border-b border-foreground/25 py-2 pr-6 outline-none focus:border-accent text-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 bottom-2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </label>

        {/* Confirm password eye field */}
        {mode === "register" && (
          <label className="block relative">
            <span className="editorial-label text-muted-foreground/80 text-[10px]">Confirm Password *</span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-2 w-full bg-transparent border-b border-foreground/25 py-2 pr-6 outline-none focus:border-accent text-xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-1 bottom-2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </label>
        )}

        {error && <p className="text-[11px] text-rose-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-accent text-white py-3 editorial-label hover:bg-accent/90 transition-colors"
        >
          {mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-xs text-muted-foreground text-center">
        By continuing you agree to the ReeVibes Maison terms &amp; editorial code.
      </p>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="editorial-label text-muted-foreground/80 text-[10px]">{label}</span>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="mt-2 w-full bg-transparent border-b border-foreground/25 py-2 outline-none focus:border-accent text-sm"
      />
    </label>
  );
}

function FavoritesPanelBody({ onClose }: { onClose: () => void }) {
  const { state } = usePortal();
  const sections = [
    { title: "Saved Contestants", items: state.favorites },
    { title: "Saved Photography", items: [] as string[] },
    { title: "Saved Angels", items: [] as string[] },
    { title: "Saved Fashion Items", items: [] as string[] },
  ];
  const empty = sections.every(s => s.items.length === 0);
  if (empty) {
    return (
      <div className="px-8 py-20 text-center">
        <Heart className="w-8 h-8 mx-auto text-muted-foreground/50" strokeWidth={1.2} />
        <div className="mt-4 editorial-label text-muted-foreground">No Favorites Yet</div>
        <p className="text-xs text-muted-foreground/70 mt-3 max-w-xs mx-auto">
          Tap the heart on any contestant, photograph or fashion piece to curate your private maison.
        </p>
        <Link to="/FashionBattle/angels" onClick={onClose} className="inline-block mt-6 editorial-label text-accent border-b border-accent pb-0.5">
          Explore Angels
        </Link>
      </div>
    );
  }
  return (
    <div className="px-8 py-6 space-y-8">
      {sections.map(s => (
        <div key={s.title}>
          <div className="editorial-label text-muted-foreground mb-3">{s.title} · {s.items.length}</div>
          <div className="grid grid-cols-3 gap-2">
            {s.items.map(id => (
              <Link key={id} to="/FashionBattle/angels" onClick={onClose} className="aspect-[3/4] bg-surface-2 border border-border-subtle" />
            ))}
            {s.items.length === 0 && <div className="col-span-3 text-xs text-muted-foreground/60 italic">Empty</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function CartPanelBody({ onClose }: { onClose: () => void }) {
  const { state, removeFromCart, addToCart } = usePortal();
  const { total } = useCartTotal();
  if (state.cart.length === 0) {
    return (
      <div className="px-8 py-20 text-center">
        <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground/50" strokeWidth={1.2} />
        <div className="mt-4 editorial-label text-muted-foreground">Your Bag Is Empty</div>
        <Link to="/FashionBattle/house-of-fashion" onClick={onClose} className="inline-block mt-6 editorial-label text-accent border-b border-accent pb-0.5">
          Discover House of Fashion
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 divide-y divide-border-subtle">
        {state.cart.map(c => (
          <div key={c.productId} className="flex gap-4 pt-6 first:pt-0">
            <div className="w-20 h-24 bg-surface-2 border border-border-subtle overflow-hidden flex-shrink-0">
              {c.image && <img src={c.image} alt={c.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="editorial-label text-muted-foreground text-[10px]">{c.house}</div>
              <div className="text-sm mt-1 truncate">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.price}</div>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={() => addToCart({ ...c, qty: -1 })} className="p-1 border border-border-subtle hover:border-accent"><Minus className="w-3 h-3" /></button>
                <span className="text-xs w-6 text-center">{c.qty}</span>
                <button onClick={() => addToCart({ ...c, qty: 1 })} className="p-1 border border-border-subtle hover:border-accent"><Plus className="w-3 h-3" /></button>
                <button onClick={() => removeFromCart(c.productId)} className="ml-auto p-1 text-muted-foreground hover:text-accent" aria-label="Remove">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-8 py-6 border-t border-border-subtle space-y-4">
        <div className="flex items-center justify-between">
          <span className="editorial-label text-muted-foreground">Subtotal</span>
          <span className="font-serif text-xl">€{total.toFixed(2)}</span>
        </div>
        <Link to="/FashionBattle/cart" onClick={onClose} className="block text-center bg-accent text-white py-3 editorial-label hover:bg-accent/90">
          Checkout
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────── sidebar ─────────────────── */
function CountrySelect({ compact }: { compact?: boolean }) {
  const [country, setCountry] = useState(COUNTRIES[0]);
  return (
    <label className={`relative inline-flex items-center ${compact ? "" : "w-full"}`}>
      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="appearance-none bg-transparent text-[10px] tracking-[0.18em] uppercase pl-2 pr-4 py-1 outline-none cursor-pointer"
      >
        {COUNTRIES.map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
      </select>
    </label>
  );
}

function ExpandedNav({ onNavigate }: { onNavigate: () => void }) {
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
    ...(state.user
      ? [
          { to: "/FashionBattle/account", label: "My Account" },
          { onClick: handleLogout, label: "Sign Out" },
        ]
      : [
          { to: "/FashionBattle/register", label: "Register" },
          { to: "/FashionBattle/login", label: "Sign In" },
        ]),
    { to: "/FashionBattle/apply", label: "Apply To Contest" },
  ];

  return (
    <div className={`flex flex-col flex-1 min-h-0 justify-between transition-colors duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-surface text-foreground"}`}>
      {/* Navigation Links */}
      <nav className="px-8 py-4 flex-1 overflow-y-auto">
        <ul className="space-y-4">
          {navItems.map((item, idx) => {
            const active = item.to ? (item.to === "/" ? path === "/" : path.startsWith(item.to)) : false;
            const content = (
              <span className="uppercase text-[11px] tracking-[0.2em] font-medium flex items-center justify-between w-full">
                <span>{item.label}</span>
                {item.hasPlus && <span className={`text-xs font-light ${theme === "dark" ? "text-white/60" : "text-muted-foreground/60"}`}>+</span>}
              </span>
            );

            return (
              <li key={idx} className="relative">
                {item.to ? (
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={`flex items-center py-2 transition-colors relative ${
                      active ? "text-accent" : theme === "dark" ? "text-white/80 hover:text-accent" : "text-foreground/80 hover:text-accent"
                    }`}
                  >
                    {content}
                    {active && (
                      <span className="absolute -right-8 w-1.5 h-6 bg-accent" />
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className={`w-full text-left flex items-center py-2 transition-colors ${theme === "dark" ? "text-white/80 hover:text-accent" : "text-foreground/80 hover:text-accent"}`}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
          {/* Light/Dark Mode Switch below Apply To Contest */}
          <li className="pt-4 border-t border-border-subtle flex items-center justify-between">
            <span className="uppercase text-[11px] tracking-[0.2em] font-medium opacity-80">Theme</span>
            <ThemeToggle className={`transition-all ${theme === "dark" ? "text-white border-white/20 hover:bg-white/10" : "text-foreground border-foreground/20 hover:bg-foreground/5"}`} />
          </li>
        </ul>
      </nav>

      {/* Footer Area */}
      <div className="flex flex-col">
        {/* Social Icons */}
        <div className={`flex items-center justify-center gap-6 pb-6 ${theme === "dark" ? "text-white/85" : "text-foreground/80"}`}>
          <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-4.5 h-4.5" /></a>
          <a href="#" className="hover:text-accent transition-colors"><FacebookIcon className="w-4.5 h-4.5" /></a>
          <a href="#" className="hover:text-accent transition-colors"><XIcon className="w-4.5 h-4.5" /></a>
        </div>

        {/* Discover House of Fashion Banner */}
        <Link
          to="/FashionBattle/house-of-fashion"
          onClick={onNavigate}
          className={`py-4 text-center block hover:opacity-90 transition-opacity border-t ${
            theme === "dark" ? "bg-[#1C1C1E] border-white/5 text-white" : "bg-surface-2 border-border-subtle text-foreground"
          }`}
        >
          <div className={`text-[8px] uppercase tracking-[0.3em] mb-0.5 ${theme === "dark" ? "text-white/50" : "text-muted-foreground/50"}`}>Discover</div>
          <div className="text-xs uppercase tracking-[0.2em] font-serif font-semibold">
            House of <span className="text-accent">Fashion.</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────── layout ─────────────────── */
export function PublicLayout({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [panel, setPanel] = useState<null | "account" | "favorites" | "cart">(null);
  const { state } = usePortal();
  const { count } = useCartTotal();
  const { theme } = useTheme();
  const unread = state.notifications.filter(n => n.unread).length;
  const favCount = state.favorites.length;

  const sidebarW = expanded ? 280 : 72;

  return (
    <div className="min-h-screen bg-background text-foreground public-layout">
      {/* Sidebar backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Sidebar — same on all viewports */}
      <aside
        className={`fixed inset-y-0 left-0 flex flex-col border-r border-border-subtle transition-all duration-300 z-40 overflow-y-auto scrollbar-none liquid-glass rounded-none`}
        style={{ width: sidebarW }}
      >
        {/* Collapsed rail */}
        {!expanded && (
          <div className={`flex flex-col items-center pt-6 pb-6 min-h-full justify-between w-[72px] flex-shrink-0 transition-colors duration-300 ${
            theme === "dark" ? "bg-black" : "bg-surface"
          }`}>
            {/* Top section: Menu and Icon buttons */}
            <div className="flex flex-col items-center w-full gap-5 flex-shrink-0">
              <button
                onClick={() => setExpanded(true)}
                aria-label="Expand menu"
                className="flex flex-col items-center justify-center p-2 text-accent hover:opacity-85 transition-opacity"
              >
                <Menu className="w-6 h-6 mb-1" strokeWidth={2.5} />
                <span className="text-[8px] font-bold tracking-[0.2em] uppercase">Menu</span>
              </button>

              <div className="flex flex-col gap-4 mt-2">
                <Link
                  to={state.user ? "/FashionBattle/account" : "/FashionBattle/login"}
                  className={`transition-colors relative flex items-center justify-center w-10 h-10 ${
                    theme === "dark" ? "text-white hover:text-accent" : "text-foreground hover:text-accent"
                  }`}
                  title="Account"
                >
                  <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 bg-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setPanel("favorites")}
                  className={`transition-colors relative flex items-center justify-center w-10 h-10 ${
                    panel === "favorites" ? "text-accent" : theme === "dark" ? "text-white hover:text-accent" : "text-foreground hover:text-accent"
                  }`}
                  title="Favorites"
                >
                  <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  {favCount > 0 && (
                    <span className="absolute top-1 right-1 bg-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {favCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setPanel("cart")}
                  className={`transition-colors relative flex items-center justify-center w-10 h-10 ${
                    panel === "cart" ? "text-accent" : theme === "dark" ? "text-white hover:text-accent" : "text-foreground hover:text-accent"
                  }`}
                  title="Shopping Bag"
                >
                  <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  {count > 0 && (
                    <span className="absolute top-1 right-1 bg-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Middle section: Logo at top/middle, Rotated vertical caption below settled downward */}
            <div className="flex flex-col items-center flex-shrink-0 justify-between py-6 gap-12">
              <div className="w-14 flex justify-center opacity-95 mt-8">
                <BrandLogo className="w-full h-auto" />
              </div>
              <div className="h-60 flex items-center justify-center mb-6">
                <div
                  className={`whitespace-nowrap font-serif tracking-[0.22em] uppercase text-[15px] md:text-[16px] font-medium transition-colors duration-300 ${
                    theme === "dark" ? "text-white/95" : "text-foreground"
                  }`}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                >
                  Beauty of Finest <span className="text-accent">Curves.</span>
                </div>
              </div>
            </div>

            {/* Bottom section: UK Flag */}
            <div className="pb-2 flex-shrink-0">
              <UKFlag />
            </div>
          </div>
        )}

        {/* Expanded content */}
        {expanded && (
          <div
            className={`absolute inset-0 flex flex-col transition-all duration-300 overflow-y-auto scrollbar-none ${
              theme === "dark" ? "bg-black text-white" : "bg-surface text-foreground"
            }`}
          >
            {/* Header: Logo + Horizontal Caption (Centered) */}
            <div className="px-8 pt-8 pb-4 flex flex-col items-center justify-center relative border-b border-white/5 flex-shrink-0">
              <div className="absolute top-8 right-8 flex items-center gap-2">
                <button
                  onClick={() => setExpanded(false)}
                  className={`p-1.5 transition-colors ${theme === "dark" ? "text-white/60 hover:text-accent" : "text-muted-foreground/60 hover:text-accent"}`}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Link to="/FashionBattle" onClick={() => setExpanded(false)} className="block mt-6">
                <BrandLogo className="w-36 h-auto" />
              </Link>
              <div className={`mt-4 uppercase text-[12px] md:text-[13px] tracking-[0.25em] font-serif text-center ${theme === "dark" ? "text-white/90" : "text-foreground/90"}`}>
                Beauty of Finest <span className="text-accent">Curves.</span>
              </div>
            </div>

            {/* Scrollable Nav Area */}
            <ExpandedNav onNavigate={() => setExpanded(false)} />
          </div>
        )}
      </aside>

      {/* Slide panels */}
      <SidePanel open={panel === "account"} onClose={() => setPanel(null)} title={state.user ? "My Account" : "Welcome"} eyebrow="Maison" offset={72}>
        <AccountPanelBody onClose={() => setPanel(null)} />
      </SidePanel>
      <SidePanel open={panel === "favorites"} onClose={() => setPanel(null)} title="Favorites" eyebrow="Curation" offset={72}>
        <FavoritesPanelBody onClose={() => setPanel(null)} />
      </SidePanel>
      <SidePanel open={panel === "cart"} onClose={() => setPanel(null)} title="Shopping Bag" eyebrow="House of Fashion" offset={72}>
        <CartPanelBody onClose={() => setPanel(null)} />
      </SidePanel>

      {/* Main */}
      <main className="min-h-screen pl-[72px]">
        {children}
      </main>

      <footer className="pl-[72px] border-t border-border-subtle mt-24">
        <div className="px-6 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <BrandLogo className="h-12 w-auto" />
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              A cinematic luxury platform celebrating women through fashion contests, editorial storytelling and runway culture.
            </p>
          </div>
          <div>
            <div className="editorial-label text-muted-foreground mb-4">Explore</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/FashionBattle/angels" className="hover:text-accent">Angels</Link></li>
              <li><Link to="/FashionBattle/live-contest" className="hover:text-accent">Live Contest</Link></li>
              <li><Link to="/FashionBattle/best-photography" className="hover:text-accent">Photography</Link></li>
              <li><Link to="/FashionBattle/house-of-fashion" className="hover:text-accent">House of Fashion</Link></li>
            </ul>
          </div>
          <div>
            <div className="editorial-label text-muted-foreground mb-4">House</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/FashionBattle/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/FashionBattle/apply" className="hover:text-accent">Apply</Link></li>
              <li><Link to="/FashionBattle/login" className="hover:text-accent">Sign In</Link></li>
              <li><Link to="/FashionBattle/account" search={{ tab: "dashboard" }} className="hover:text-accent">My Account</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border-subtle px-6 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} ReeVibes · Maison du Style</span>
          <span className="editorial-label">Paris · Milan · Lagos · Tokyo</span>
        </div>
      </footer>
      
      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 h-16 z-50 liquid-glass flex items-center justify-around px-4 shadow-2xl rounded-full">
        <Link to="/" className="flex flex-col items-center justify-center text-muted-foreground hover:text-accent transition-colors">
          <Menu className="w-5 h-5" />
          <span className="text-[8px] uppercase tracking-widest mt-1">Shop</span>
        </Link>
        <button onClick={() => setPanel("favorites")} className={`flex flex-col items-center justify-center transition-colors relative ${panel === "favorites" ? "text-accent" : "text-muted-foreground"}`}>
          <Heart className="w-5 h-5" />
          {favCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{favCount}</span>}
          <span className="text-[8px] uppercase tracking-widest mt-1">Wishlist</span>
        </button>
        <Link to="/FashionBattle/account" search={{ tab: "dashboard" }} className="flex flex-col items-center justify-center text-muted-foreground hover:text-accent transition-colors">
          <User className="w-5 h-5" />
          <span className="text-[8px] uppercase tracking-widest mt-1">Account</span>
        </Link>
        <button onClick={() => setPanel("cart")} className={`flex flex-col items-center justify-center transition-colors relative ${panel === "cart" ? "text-accent" : "text-muted-foreground"}`}>
          <ShoppingBag className="w-5 h-5" />
          {count > 0 && <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{count}</span>}
          <span className="text-[8px] uppercase tracking-widest mt-1">Cart</span>
        </button>
      </div>
    </div>
  );
}
