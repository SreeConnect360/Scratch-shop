import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp } from "@/components/motion/Reveal";
import { HERO_IMAGES } from "@/lib/data";
import { useAppStore } from "@/lib/portal-state";
import { Calendar, Eye, EyeOff, Search, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/FashionBattle/register")({
  head: () => ({ meta: [{ title: "Register — ReeVibes" }] }),
  component: RegisterPage,
});

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

const ALL_COUNTRIES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Puducherry", "Chandigarh"
];

function RegisterPage() {
  const { registerUser } = useAppStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Custom Phone Code Dropdown States
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState("");
  const phoneRef = useRef<HTMLDivElement>(null);
  const phoneSearchRef = useRef<HTMLInputElement>(null);

  // Custom Country Dropdown States
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryRef = useRef<HTMLDivElement>(null);
  const countrySearchRef = useRef<HTMLInputElement>(null);

  // DOB input Ref for opening showPicker
  const dobRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (phoneRef.current && !phoneRef.current.contains(event.target as Node)) {
        setPhoneDropdownOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus search fields on dropdown open
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

  const filteredCodes = COUNTRY_CODES.filter(
    item =>
      item.name.toLowerCase().includes(phoneSearch.toLowerCase()) ||
      item.code.includes(phoneSearch)
  );

  const filteredCountries = ALL_COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Handle Enter key auto-selection
  const handlePhoneSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredCodes.length > 0) {
      e.preventDefault();
      setForm({ ...form, phoneCode: filteredCodes[0].code });
      setPhoneDropdownOpen(false);
      setPhoneSearch("");
    }
  };

  const handleCountrySearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredCountries.length > 0) {
      e.preventDefault();
      setForm({ ...form, country: filteredCountries[0] });
      setCountryDropdownOpen(false);
      setCountrySearch("");
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Mandatory checks
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phoneCode ||
      !form.phoneNumber.trim() ||
      !form.gender ||
      !form.dob ||
      !form.country ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are mandatory to fill.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Phone number validations
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

    // DOB age validation (Must be 18+)
    const birthDate = new Date(form.dob);
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
      country: form.country,
    });

    const redirectContestId = sessionStorage.getItem("apply:redirectContestId");
    if (redirectContestId) {
      sessionStorage.removeItem("apply:redirectContestId");
      navigate({ to: `/apply/${redirectContestId}` });
    } else {
      navigate({ to: "/FashionBattle/account", search: { tab: "dashboard" } });
    }
  };

  return (
    <PublicLayout>
      <section className="grid lg:grid-cols-2 min-h-[88vh]">
        <div className="flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1">
          <div className="w-full max-w-md">
            <FadeUp><p className="editorial-eyebrow text-accent">Register</p></FadeUp>
            <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-5xl">Join the maison.</h1></FadeUp>
            
            <form onSubmit={submit} className="mt-10 space-y-6">
              {/* Names */}
              <div className="grid grid-cols-2 gap-5">
                <Field label="First Name *" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Anaïs" required />
                <Field label="Last Name *" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Laurent" required />
              </div>

              {/* Email */}
              <Field label="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@address.com" required />

              {/* Phone with Custom Country Code Selector (No Logos) */}
              <div className="block" ref={phoneRef}>
                <span className="editorial-label text-muted-foreground block mb-2">Phone Number *</span>
                <div className="flex gap-2 relative">
                  {/* Dropdown trigger */}
                  <button
                    type="button"
                    onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                    className="flex items-center gap-2 border-b border-foreground/30 py-3 px-2 focus:border-accent outline-none text-sm bg-transparent font-medium"
                    style={{ minWidth: "80px" }}
                  >
                    {form.phoneCode ? (
                      <span>{form.phoneCode}</span>
                    ) : (
                      <span className="text-muted-foreground/60">Code</span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
                  </button>

                  {/* Phone input */}
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                    placeholder="6 0000 0000"
                    required
                    className="flex-1 bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50 text-sm"
                  />

                  {/* Dropdown Options overlay */}
                  {phoneDropdownOpen && (
                    <div className="absolute top-full left-0 w-72 mt-1 bg-background border border-border-subtle shadow-lg z-50 rounded p-3 space-y-2 max-h-60 overflow-y-auto">
                      <div className="flex items-center gap-2 bg-surface-2 px-2 py-1.5 border border-border-subtle rounded">
                        <Search className="w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          ref={phoneSearchRef}
                          value={phoneSearch}
                          onChange={e => setPhoneSearch(e.target.value)}
                          onKeyDown={handlePhoneSearchKeyDown}
                          placeholder="Search country or code..."
                          className="bg-transparent text-xs outline-none w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        {filteredCodes.map(item => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => {
                              setForm({ ...form, phoneCode: item.code });
                              setPhoneDropdownOpen(false);
                              setPhoneSearch("");
                            }}
                            className="flex items-center w-full text-left p-2 hover:bg-surface-2 transition-colors text-xs"
                          >
                            <span className="font-semibold text-foreground">{item.code}</span>
                            <span className="text-muted-foreground ml-auto">{item.name}</span>
                          </button>
                        ))}
                        {filteredCodes.length === 0 && (
                          <div className="text-xs text-muted-foreground p-2 text-center">No matches</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gender and DOB */}
              <div className="grid grid-cols-2 gap-5">
                <label className="block">
                  <span className="editorial-label text-muted-foreground">Gender *</span>
                  <select
                    value={form.gender}
                    onChange={e => setForm({ ...form, gender: e.target.value })}
                    required
                    className="mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent text-sm"
                  >
                    <option value="" className="bg-background text-muted-foreground">Select Gender</option>
                    <option value="Female" className="bg-background text-foreground">Female</option>
                    <option value="Male" className="bg-background text-foreground">Male</option>
                    <option value="Other" className="bg-background text-foreground">Other</option>
                  </select>
                </label>

                <label className="block relative">
                  <span className="editorial-label text-muted-foreground">Date of Birth *</span>
                  <div className="relative">
                    <input
                      ref={dobRef}
                      type="date"
                      value={form.dob}
                      onChange={e => setForm({ ...form, dob: e.target.value })}
                      required
                      className="mt-2 w-full bg-transparent border-b border-foreground/30 py-3 pr-8 outline-none focus:border-accent text-sm transition-colors"
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
                      className="absolute right-2 bottom-3 text-muted-foreground hover:text-foreground"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </label>
              </div>

              {/* Country & Password */}
              <div className="grid grid-cols-2 gap-5">
                {/* Custom Country Selector */}
                <div className="block relative" ref={countryRef}>
                  <span className="editorial-label text-muted-foreground block mb-2">State *</span>
                  <button
                    type="button"
                    onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                    className="flex items-center gap-2 border-b border-foreground/30 py-3 w-full text-left focus:border-accent outline-none text-sm bg-transparent"
                  >
                    {form.country ? (
                      <>
                        <img
                          src={`/api/flags?country=${encodeURIComponent(form.country)}`}
                          className="w-4 h-4 rounded-full object-cover"
                          alt=""
                        />
                        <span>{form.country}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground/60">Select State</span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
                  </button>

                  {countryDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-background border border-border-subtle shadow-lg z-50 rounded p-3 space-y-2 max-h-60 overflow-y-auto">
                      <div className="flex items-center gap-2 bg-surface-2 px-2 py-1.5 border border-border-subtle rounded">
                        <Search className="w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          ref={countrySearchRef}
                          value={countrySearch}
                          onChange={e => setCountrySearch(e.target.value)}
                          onKeyDown={handleCountrySearchKeyDown}
                          placeholder="Search state..."
                          className="bg-transparent text-xs outline-none w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        {filteredCountries.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setForm({ ...form, country: c });
                              setCountryDropdownOpen(false);
                              setCountrySearch("");
                            }}
                            className="flex items-center gap-3 w-full text-left p-2 hover:bg-surface-2 transition-colors text-xs"
                          >
                            <img
                              src={`/api/flags?country=${encodeURIComponent(c)}`}
                              className="w-4 h-4 rounded-full object-cover"
                              alt=""
                            />
                            <span className="text-foreground">{c}</span>
                          </button>
                        ))}
                        {filteredCountries.length === 0 && (
                          <div className="text-xs text-muted-foreground p-2 text-center">No matches</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Password field with Reveal Icon */}
                <label className="block relative">
                  <span className="editorial-label text-muted-foreground">Password *</span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="mt-2 w-full bg-transparent border-b border-foreground/30 py-3 pr-8 outline-none focus:border-accent text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 bottom-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </label>
              </div>

              {/* Confirm Password */}
              <label className="block relative">
                <span className="editorial-label text-muted-foreground">Confirm Password *</span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="mt-2 w-full bg-transparent border-b border-foreground/30 py-3 pr-8 outline-none focus:border-accent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 bottom-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              {/* Terms */}
              <label className="flex items-start gap-3 text-xs text-muted-foreground mt-4">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 accent-accent" />
                <span>I agree to the ReeVibes editorial terms and confirm I am 18 or older.</span>
              </label>

              {error && <p className="text-xs text-rose-500">{error}</p>}
              
              <button type="submit" className="w-full bg-foreground text-background py-4 editorial-label hover:bg-accent hover:text-white transition-colors">Create Account</button>
              
              <p className="text-xs text-muted-foreground text-center">Already a member? <Link to="/FashionBattle/login" className="hover:text-accent">Sign in</Link></p>
            </form>
          </div>
        </div>
        <div className="hidden lg:block relative overflow-hidden order-1 lg:order-2">
          <img src={HERO_IMAGES[1]} alt="" className="absolute inset-0 w-full h-full object-cover img-cinematic" />
          <div className="absolute inset-0 bg-gradient-to-bl from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <p className="editorial-eyebrow text-accent">Maison Membership</p>
            <h2 className="mt-4 font-serif text-5xl">A new chapter begins with a name.</h2>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="editorial-label text-muted-foreground">{label}</span>
      <input {...props} className="mt-2 w-full bg-transparent border-b border-foreground/30 py-3 outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/50 text-sm" />
    </label>
  );
}
