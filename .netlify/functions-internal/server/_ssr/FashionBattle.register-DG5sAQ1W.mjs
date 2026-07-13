import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PublicLayout } from "./PublicLayout-DsBdhFEV.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { l as useAppStore, H as HERO_IMAGES } from "./router-BFsnZUKW.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { c as ChevronDown, S as Search, ap as Calendar, I as EyeOff, G as Eye } from "../_libs/lucide-react.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
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
const COUNTRY_CODES = [{
  name: "France",
  code: "+33"
}, {
  name: "Italy",
  code: "+39"
}, {
  name: "Japan",
  code: "+81"
}, {
  name: "Nigeria",
  code: "+234"
}, {
  name: "Brazil",
  code: "+55"
}, {
  name: "USA",
  code: "+1"
}, {
  name: "South Korea",
  code: "+82"
}, {
  name: "Mexico",
  code: "+52"
}, {
  name: "Sweden",
  code: "+46"
}, {
  name: "India",
  code: "+91"
}, {
  name: "UK",
  code: "+44"
}, {
  name: "Spain",
  code: "+34"
}, {
  name: "Serbia",
  code: "+381"
}, {
  name: "Argentina",
  code: "+54"
}, {
  name: "Germany",
  code: "+49"
}, {
  name: "Canada",
  code: "+1"
}, {
  name: "China",
  code: "+86"
}, {
  name: "Russia",
  code: "+7"
}, {
  name: "South Africa",
  code: "+27"
}, {
  name: "United Arab Emirates",
  code: "+971"
}, {
  name: "Australia",
  code: "+61"
}, {
  name: "Saudi Arabia",
  code: "+966"
}, {
  name: "Egypt",
  code: "+20"
}, {
  name: "Turkey",
  code: "+90"
}];
const ALL_COUNTRIES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh"];
function RegisterPage() {
  const {
    registerUser
  } = useAppStore();
  const navigate = useNavigate();
  const [form, setForm] = reactExports.useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    country: "",
    password: "",
    confirmPassword: ""
  });
  const [agreed, setAgreed] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = reactExports.useState(false);
  const [phoneSearch, setPhoneSearch] = reactExports.useState("");
  const phoneRef = reactExports.useRef(null);
  const phoneSearchRef = reactExports.useRef(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = reactExports.useState(false);
  const [countrySearch, setCountrySearch] = reactExports.useState("");
  const countryRef = reactExports.useRef(null);
  const countrySearchRef = reactExports.useRef(null);
  const dobRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function handleClickOutside(event) {
      if (phoneRef.current && !phoneRef.current.contains(event.target)) {
        setPhoneDropdownOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
  const filteredCodes = COUNTRY_CODES.filter((item) => item.name.toLowerCase().includes(phoneSearch.toLowerCase()) || item.code.includes(phoneSearch));
  const filteredCountries = ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase()));
  const handlePhoneSearchKeyDown = (e) => {
    if (e.key === "Enter" && filteredCodes.length > 0) {
      e.preventDefault();
      setForm({
        ...form,
        phoneCode: filteredCodes[0].code
      });
      setPhoneDropdownOpen(false);
      setPhoneSearch("");
    }
  };
  const handleCountrySearchKeyDown = (e) => {
    if (e.key === "Enter" && filteredCountries.length > 0) {
      e.preventDefault();
      setForm({
        ...form,
        country: filteredCountries[0]
      });
      setCountryDropdownOpen(false);
      setCountrySearch("");
    }
  };
  const submit = (e) => {
    e.preventDefault();
    setError(null);
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phoneCode || !form.phoneNumber.trim() || !form.gender || !form.dob || !form.country || !form.password || !form.confirmPassword) {
      setError("All fields are mandatory to fill.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    const phoneDigits = form.phoneNumber.replace(/\D/g, "");
    if (form.phoneCode === "+91") {
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
    const birthDate = new Date(form.dob);
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
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please accept the terms to create an account.");
      return;
    }
    const fullPhone = `${form.phoneCode} ${form.phoneNumber.trim()}`;
    registerUser({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: fullPhone,
      gender: form.gender,
      dob: form.dob,
      country: form.country
    });
    const redirectContestId = sessionStorage.getItem("apply:redirectContestId");
    if (redirectContestId) {
      sessionStorage.removeItem("apply:redirectContestId");
      navigate({
        to: `/apply/${redirectContestId}`
      });
    } else {
      navigate({
        to: "/FashionBattle/account",
        search: {
          tab: "dashboard"
        }
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid lg:grid-cols-2 min-h-[88vh]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Register" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-5xl", children: "Join the maison." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-10 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "First Name *", value: form.firstName, onChange: (e) => setForm({
            ...form,
            firstName: e.target.value
          }), placeholder: "Anaïs", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last Name *", value: form.lastName, onChange: (e) => setForm({
            ...form,
            lastName: e.target.value
          }), placeholder: "Laurent", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email *", type: "email", value: form.email, onChange: (e) => setForm({
          ...form,
          email: e.target.value
        }), placeholder: "your@address.com", required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block", ref: phoneRef, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground block mb-2", children: "Phone Number *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setPhoneDropdownOpen(!phoneDropdownOpen), className: "flex items-center gap-2 border-b border-foreground/30 py-3 px-2 focus:border-accent outline-none text-sm bg-transparent font-medium", style: {
              minWidth: "80px"
            }, children: [
              form.phoneCode ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: form.phoneCode }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 ml-auto text-muted-foreground" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", value: form.phoneNumber, onChange: (e) => setForm({
              ...form,
              phoneNumber: e.target.value
            }), placeholder: "6 0000 0000", required: true, className: "flex-1 bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50 text-sm" }),
            phoneDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 w-72 mt-1 bg-background border border-border-subtle shadow-lg z-50 rounded p-3 space-y-2 max-h-60 overflow-y-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-surface-2 px-2 py-1.5 border border-border-subtle rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", ref: phoneSearchRef, value: phoneSearch, onChange: (e) => setPhoneSearch(e.target.value), onKeyDown: handlePhoneSearchKeyDown, placeholder: "Search country or code...", className: "bg-transparent text-xs outline-none w-full" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                filteredCodes.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setForm({
                    ...form,
                    phoneCode: item.code
                  });
                  setPhoneDropdownOpen(false);
                  setPhoneSearch("");
                }, className: "flex items-center w-full text-left p-2 hover:bg-surface-2 transition-colors text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: item.code }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground ml-auto", children: item.name })
                ] }, item.name)),
                filteredCodes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground p-2 text-center", children: "No matches" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Gender *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.gender, onChange: (e) => setForm({
              ...form,
              gender: e.target.value
            }), required: true, className: "mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-background text-muted-foreground", children: "Select Gender" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Female", className: "bg-background text-foreground", children: "Female" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Male", className: "bg-background text-foreground", children: "Male" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Other", className: "bg-background text-foreground", children: "Other" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Date of Birth *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: dobRef, type: "date", value: form.dob, onChange: (e) => setForm({
                ...form,
                dob: e.target.value
              }), required: true, className: "mt-2 w-full bg-transparent border-b border-foreground/30 py-3 pr-8 outline-none focus:border-accent text-sm transition-colors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                try {
                  dobRef.current?.showPicker();
                } catch (err) {
                  dobRef.current?.focus();
                }
              }, className: "absolute right-2 bottom-3 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block relative", ref: countryRef, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground block mb-2", children: "State *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setCountryDropdownOpen(!countryDropdownOpen), className: "flex items-center gap-2 border-b border-foreground/30 py-3 w-full text-left focus:border-accent outline-none text-sm bg-transparent", children: [
              form.country ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: `/api/flags?country=${encodeURIComponent(form.country)}`, className: "w-4 h-4 rounded-full object-cover", alt: "" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: form.country })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Select State" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 ml-auto text-muted-foreground" })
            ] }),
            countryDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 w-full mt-1 bg-background border border-border-subtle shadow-lg z-50 rounded p-3 space-y-2 max-h-60 overflow-y-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-surface-2 px-2 py-1.5 border border-border-subtle rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", ref: countrySearchRef, value: countrySearch, onChange: (e) => setCountrySearch(e.target.value), onKeyDown: handleCountrySearchKeyDown, placeholder: "Search state...", className: "bg-transparent text-xs outline-none w-full" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                filteredCountries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setForm({
                    ...form,
                    country: c
                  });
                  setCountryDropdownOpen(false);
                  setCountrySearch("");
                }, className: "flex items-center gap-3 w-full text-left p-2 hover:bg-surface-2 transition-colors text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: `/api/flags?country=${encodeURIComponent(c)}`, className: "w-4 h-4 rounded-full object-cover", alt: "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: c })
                ] }, c)),
                filteredCountries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground p-2 text-center", children: "No matches" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Password *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", value: form.password, onChange: (e) => setForm({
                ...form,
                password: e.target.value
              }), placeholder: "••••••••", required: true, className: "mt-2 w-full bg-transparent border-b border-foreground/30 py-3 pr-8 outline-none focus:border-accent text-sm" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-2 bottom-3 text-muted-foreground hover:text-foreground", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Confirm Password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showConfirmPassword ? "text" : "password", value: form.confirmPassword, onChange: (e) => setForm({
              ...form,
              confirmPassword: e.target.value
            }), placeholder: "••••••••", required: true, className: "mt-2 w-full bg-transparent border-b border-foreground/30 py-3 pr-8 outline-none focus:border-accent text-sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-2 bottom-3 text-muted-foreground hover:text-foreground", children: showConfirmPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-3 text-xs text-muted-foreground mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: agreed, onChange: (e) => setAgreed(e.target.checked), className: "mt-0.5 accent-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "I agree to the ReeVibes editorial terms and confirm I am 18 or older." })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-500", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full bg-foreground text-background py-4 editorial-label hover:bg-accent hover:text-white transition-colors", children: "Create Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
          "Already a member? ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/login", className: "hover:text-accent", children: "Sign in" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:block relative overflow-hidden order-1 lg:order-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: HERO_IMAGES[1], alt: "", className: "absolute inset-0 w-full h-full object-cover img-cinematic" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-bl from-black/70 via-black/20 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-12 left-12 right-12 text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Maison Membership" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-serif text-5xl", children: "A new chapter begins with a name." })
      ] })
    ] })
  ] }) });
}
function Field({
  label,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...props, className: "mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50 text-sm" })
  ] });
}
export {
  RegisterPage as component
};
