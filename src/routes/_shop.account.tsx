import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { BACKEND_URL } from "@/lib/config";
import { FadeUp } from "@/components/motion/Reveal";
import { PRODUCTS } from "@/lib/data";
import { useState, useEffect } from "react";
import { z } from "zod";
import { MapPin, Tag, Heart, ShoppingBag, ListOrdered, User, Save, Trash2, Plus, Check, RotateCcw, Wallet as WalletIcon, Settings as SettingsIcon, ShieldCheck, Star, X, ArrowLeft, ArrowRight, AlertTriangle, LogOut, Search, ChevronDown, CheckCircle2, RefreshCw, KeyRound, Lock } from "lucide-react";
import { StatusChip } from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { useShopNotification } from "./_shop";

const accountSearchSchema = z.object({
  tab: z.enum(["dashboard", "profile", "addresses", "coupons", "wishlist", "orders", "returns", "wallet", "settings", "ai-analytics"]).catch("profile"),
});

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const WORLD_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon",
  "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

interface CountryCodeItem {
  country: string;
  code: string;
  flag: string;
  digits: number;
}

const COUNTRY_CODES: CountryCodeItem[] = [
  { country: "India", code: "+91", flag: "🇮🇳", digits: 10 },
  { country: "United States", code: "+1", flag: "🇺🇸", digits: 10 },
  { country: "United Kingdom", code: "+44", flag: "🇬🇧", digits: 10 },
  { country: "Canada", code: "+1", flag: "🇨🇦", digits: 10 },
  { country: "Australia", code: "+61", flag: "🇦🇺", digits: 9 },
  { country: "United Arab Emirates", code: "+971", flag: "🇦🇪", digits: 9 },
  { country: "Singapore", code: "+65", flag: "🇸🇬", digits: 8 },
  { country: "Germany", code: "+49", flag: "🇩🇪", digits: 10 },
  { country: "France", code: "+33", flag: "🇫🇷", digits: 9 },
  { country: "Italy", code: "+39", flag: "🇮🇹", digits: 10 },
  { country: "Japan", code: "+81", flag: "🇯🇵", digits: 10 },
  { country: "China", code: "+86", flag: "🇨🇳", digits: 11 },
  { country: "Saudi Arabia", code: "+966", flag: "🇸🇦", digits: 9 },
  { country: "Brazil", code: "+55", flag: "🇧🇷", digits: 11 },
  { country: "South Korea", code: "+82", flag: "🇰🇷", digits: 10 },
  { country: "Spain", code: "+34", flag: "🇪🇸", digits: 9 },
  { country: "Netherlands", code: "+31", flag: "🇳🇱", digits: 9 },
  { country: "Switzerland", code: "+41", flag: "🇨🇭", digits: 9 },
  { country: "Sweden", code: "+46", flag: "🇸🇪", digits: 9 },
  { country: "Mexico", code: "+52", flag: "🇲🇽", digits: 10 },
  { country: "Russia", code: "+7", flag: "🇷🇺", digits: 10 },
  { country: "Turkey", code: "+90", flag: "🇹🇷", digits: 10 },
  { country: "Indonesia", code: "+62", flag: "🇮🇩", digits: 11 },
  { country: "Malaysia", code: "+60", flag: "🇲🇾", digits: 9 },
  { country: "Thailand", code: "+66", flag: "🇹🇭", digits: 9 },
  { country: "Vietnam", code: "+84", flag: "🇻🇳", digits: 9 },
  { country: "Philippines", code: "+63", flag: "🇵🇭", digits: 10 },
  { country: "South Africa", code: "+27", flag: "🇿🇦", digits: 9 },
  { country: "Nigeria", code: "+234", flag: "🇳🇬", digits: 10 },
  { country: "Kenya", code: "+254", flag: "🇰🇪", digits: 9 },
];

export const Route = createFileRoute("/_shop/account")({
  validateSearch: (search) => accountSearchSchema.parse(search),
  component: ShopDashboard,
});

function ShopDashboard() {
  const { state, updateUser, addAddress, removeAddress, updateAddress, setMajorAddress, toggleShopWishlist, createOrder, addToShopCart, requestReturn, markNotificationsRead, addReview, signOut, redeemWalletGiftCard } = usePortal();
  const { triggerPopup } = useShopNotification();
  const { shopCount, shopTotal } = useCartTotal();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const user = state.user;

  useEffect(() => {
    if (tab === "orders") {
      navigate({ to: "/orders", replace: true });
    } else if (tab === "wishlist") {
      navigate({ to: "/wishlist", replace: true });
    } else if (tab === "returns") {
      navigate({ to: "/orders", search: { tab: "returns" } as any, replace: true });
    }
  }, [tab, navigate]);

  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false);
  const [editingAddrIndex, setEditingAddrIndex] = useState<number | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Map and Geolocation states
  const [mapCenter, setMapCenter] = useState<[number, number]>([77.5946, 12.9716]); // Bangalore default
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Reverse Geocoding
  const handleReverseGeocode = async (lng: number, lat: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { "User-Agent": "ReeVibes-Shop-Portal" }
      });
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const street = addr.road || addr.suburb || addr.neighbourhood || addr.amenity || addr.industrial || "";
        const city = addr.city || addr.town || addr.village || addr.municipality || "";
        const district = addr.county || addr.district || "";
        const stateVal = addr.state || "";
        const pincode = addr.postcode || "";

        setAddrStreet(street);
        setAddrCity(city);
        setAddrDistrict(district);
        setAddrState(stateVal);
        setAddrPincode(pincode ? pincode.replace(/\D/g, "").slice(0, 6) : "");
        toast.success("Location address resolved!");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  // Detect location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setMapCenter([longitude, latitude]);
        setMarkerPos([longitude, latitude]);
        setIsLocating(false);
        handleReverseGeocode(longitude, latitude);
      },
      (error) => {
        setIsLocating(false);
        toast.error("Failed to detect location. Please search or point manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Forward Geocoding
  const handleGeocodeAddress = async () => {
    const query = [addrStreet, addrCity, addrDistrict, addrState, addrPincode].filter(Boolean).join(", ");
    if (!query) {
      toast.error("Please enter some address details first.");
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: { "User-Agent": "ReeVibes-Shop-Portal" }
      });
      const data = await res.json();
      if (data && data[0]) {
        const { lon, lat } = data[0];
        const lngNum = parseFloat(lon);
        const latNum = parseFloat(lat);
        setMapCenter([lngNum, latNum]);
        setMarkerPos([lngNum, latNum]);
        toast.success("Address located on map!");
      } else {
        toast.error("Entered location is invalid!");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      toast.error("Entered location is invalid!");
    }
  };

  // Calculate profile completeness percentage
  const profileCompletionPercentage = (() => {
    if (!user) return 0;
    let score = 0;
    if (user.firstName) score += 20;
    if (user.email) score += 20;
    if (user.phone) score += 20;
    if (user.dob) score += 15;
    if (user.gender && user.gender !== "-") score += 15;
    if (user.country) score += 10;
    return score;
  })();

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    dob: user?.dob || "",
    country: user?.country || "",
  });

  // Country & Dialing Code States
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phoneNumberOnly, setPhoneNumberOnly] = useState("");
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // Active Phone Country & Digits Target
  const activePhoneCountry = COUNTRY_CODES.find(c => c.code === phoneCountryCode);
  const targetPhoneDigits = activePhoneCountry?.digits || 10;
  const activeCountryName = activePhoneCountry?.country || "Selected Country";

  // Change Email Feature States
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [emailChangeStep, setEmailChangeStep] = useState<1 | 2>(1);
  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [emailChangeError, setEmailChangeError] = useState("");

  // Delete Account Feature States
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Gift Card / Wallet Redemption States
  const [giftCardInput, setGiftCardInput] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Order & Return Detail Modal States
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [selectedReturnDetails, setSelectedReturnDetails] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        dob: user.dob || "",
        country: user.country || "",
      });

      // Parse existing phone for dialing code
      const rawPhone = (user.phone || "").trim();
      const matchedCode = COUNTRY_CODES.find(c => rawPhone.startsWith(c.code));
      if (matchedCode) {
        setPhoneCountryCode(matchedCode.code);
        setPhoneNumberOnly(rawPhone.slice(matchedCode.code.length).trim());
      } else {
        setPhoneCountryCode("+91");
        setPhoneNumberOnly(rawPhone);
      }
    }
  }, [user]);

  // Filtered lists
  const filteredCountries = WORLD_COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.trim().toLowerCase())
  );

  const filteredCountryCodes = COUNTRY_CODES.filter(c =>
    c.country.toLowerCase().includes(codeSearch.trim().toLowerCase()) ||
    c.code.toLowerCase().includes(codeSearch.trim().toLowerCase())
  );

  // Email Change Logic
  const handleInitiateEmailChange = () => {
    setEmailChangeError("");
    const trimmed = newEmailInput.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailChangeError("Please enter a valid email address.");
      return;
    }

    if (user && trimmed === user.email.toLowerCase()) {
      setEmailChangeError("New email must be different from your current email.");
      return;
    }

    // Validate that email is not already registered by another account
    const existing = state.users.find(u => u.email.toLowerCase() === trimmed && u.id !== user?.id);
    if (existing) {
      setEmailChangeError("This email address is already registered to another account.");
      return;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setEmailChangeStep(2);
    toast.success(`Verification OTP sent to ${trimmed}! (OTP: ${otp})`, { duration: 10000 });
  };

  const handleVerifyEmailOtp = () => {
    if (!user) return;
    setEmailChangeError("");
    if (emailOtpInput.trim() !== generatedOtp) {
      setEmailChangeError("Invalid OTP code. Please check and try again.");
      return;
    }

    const newEmail = newEmailInput.trim();
    // Update account with new verified email address
    updateUser(user.id, {
      email: newEmail,
      emailVerified: true,
    } as any);

    setProfileForm(prev => ({ ...prev, email: newEmail }));
    setShowChangeEmailModal(false);
    setNewEmailInput("");
    setEmailOtpInput("");
    setEmailChangeStep(1);
    toast.success("Email address updated and verified successfully! Your account and history have been preserved.");
  };

  // Delete Account Logic
  const handleDeleteAccountConfirm = () => {
    if (!user) return;
    if (deleteConfirmText.trim() !== "DELETE") {
      toast.error("Please type DELETE exactly to confirm.");
      return;
    }

    deleteUser(user.id);
    setShowDeleteAccountModal(false);
    toast.success("Your account and all associated data have been permanently deleted.");
    navigate({ to: "/" });
  };

  // Gift Card Redemption Logic
  const handleRedeemGiftCard = () => {
    if (!user) return;
    const code = giftCardInput.trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a gift card or voucher code.");
      return;
    }

    setIsRedeeming(true);
    const res = redeemWalletGiftCard(user.id, code);

    if (res.success) {
      toast.success(res.message);
      setGiftCardInput("");
    } else {
      toast.error(res.message);
    }
    setIsRedeeming(false);
  };

  // Saved Addresses State
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrDistrict, setAddrDistrict] = useState("");
  const [addrState, setAddrState] = useState("");
  const [isFetchingPin, setIsFetchingPin] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  // Autofill name and phone from profile
  useEffect(() => {
    if (user) {
      setAddrName(prev => prev || user.firstName);
      setAddrPhone(prev => prev || user.phone || "");
    }
  }, [user]);

  // Fetch pin code details when pin code reaches 6 digits
  useEffect(() => {
    if (addrPincode.trim().length === 6 && /^\d+$/.test(addrPincode.trim())) {
      setIsFetchingPin(true);
      fetch(`https://api.postalpincode.in/pincode/${addrPincode.trim()}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
            const office = data[0].PostOffice[0];
            setAddrCity(office.Name || office.Block || "");
            
            // Map reorganized Andhra Pradesh districts like Kakinada & Konaseema
            let district = office.District || "";
            if (addrPincode.trim() === "533001" || office.Name?.toLowerCase().includes("kakinada") || office.District?.toLowerCase().includes("kakinada")) {
              district = "Kakinada";
            } else if (office.District === "East Godavari") {
              if (addrPincode.trim().startsWith("5330") || addrPincode.trim().startsWith("5334")) {
                district = "Kakinada";
              } else if (addrPincode.trim().startsWith("5332")) {
                district = "Konaseema";
              }
            }
            
            setAddrDistrict(district);
            setAddrState(office.State || "");
            toast.success("India Pincode details retrieved!");
            // Auto geocode when pincode matches
            const query = `${office.Name || ""}, ${office.District || ""}, ${office.State || ""} - ${addrPincode.trim()}`;
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
              headers: { "User-Agent": "ReeVibes-Shop-Portal" }
            })
              .then(res => res.json())
              .then(d => {
                if (d && d[0]) {
                  const lngNum = parseFloat(d[0].lon);
                  const latNum = parseFloat(d[0].lat);
                  setMapCenter([lngNum, latNum]);
                  setMarkerPos([lngNum, latNum]);
                }
              });
          } else {
            toast.error("Invalid India pincode or not found.");
          }
        })
        .catch(err => {
          console.error(err);
          toast.error("Error fetching pincode details. Please fill manually.");
        })
        .finally(() => {
          setIsFetchingPin(false);
        });
    }
  }, [addrPincode]);
  const userAddresses = user ? (state.addresses?.[user.id] || []) : [];

  // Wishlist Items
  const wishlistIds = user
    ? (state.shopWishlist?.[user.id] ||
       state.shopWishlist?.[user.id.toLowerCase()] ||
       state.shopWishlist?.[user.id.toUpperCase()] ||
       [])
    : [];
  const allProducts = state.products || PRODUCTS;
  const wishlistItems = wishlistIds
    .map(id => allProducts.find(p => String(p.id) === String(id)))
    .filter((p): p is typeof allProducts[number] => Boolean(p));

  // Orders List (Latest first)
  const userOrders = useMemo(() => {
    if (!user) return [];
    const list = state.orders?.[user.id] || [];
    return [...list].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      return timeB - timeA;
    });
  }, [user, state.orders]);

  // Checkout Form State
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Review Form States
  const [reviewFormItem, setReviewFormItem] = useState<{ productId: string; orderId: string } | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // Auto select major address for checkout if available
  useEffect(() => {
    if (user && state.majorAddresses?.[user.id]) {
      const major = state.majorAddresses[user.id];
      if (userAddresses.includes(major)) {
        setCheckoutAddress(major);
      }
    } else if (userAddresses.length > 0 && !checkoutAddress) {
      setCheckoutAddress(userAddresses[0]);
    }
  }, [user, state.majorAddresses, userAddresses]);

  // Return Wizard States
  const [returnFormItem, setReturnFormItem] = useState<{ orderId: string; productId: string; productName: string; price: string; selectedSize: string; qty: number } | null>(null);
  const [returnStep, setReturnStep] = useState(1);
  const [returnReason, setReturnReason] = useState("Product arrived damaged");
  const [returnDesc, setReturnDesc] = useState("");
  const [returnPhotos, setReturnPhotos] = useState<string[]>([]);
  const [returnVideo, setReturnVideo] = useState("");
  const [returnRefundMethod, setReturnRefundMethod] = useState("Original Payment Method");
  const [returnFileLoading, setReturnFileLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
        <div className="liquid-glass p-8 max-w-md w-full border border-white/20 rounded-3xl">
          <p className="editorial-eyebrow text-accent">Shop Members Only</p>
          <h1 className="mt-4 font-serif text-3xl">Sign in to continue.</h1>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">Your shopping account is reserved for registered members of the maison.</p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/login" className="bg-foreground text-background px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="border border-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-foreground hover:text-background transition-colors">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number length based on selected country code
    if (phoneNumberOnly.trim()) {
      if (phoneNumberOnly.trim().length !== targetPhoneDigits) {
        toast.error(`${activeCountryName} (${phoneCountryCode}) phone number must be exactly ${targetPhoneDigits} digits.`);
        return;
      }
    }

    const fullPhone = phoneNumberOnly.trim() ? `${phoneCountryCode} ${phoneNumberOnly.trim()}` : "";
    const updatedForm = {
      ...profileForm,
      phone: fullPhone,
    };

    updateUser(user.id, updatedForm as any);
    setShowSaveSuccessPopup(true);
    setIsEditing(false);
    toast.success("Profile details updated successfully!");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName.trim() || !addrPincode.trim() || !addrStreet.trim() || !addrCity.trim() || !addrState.trim()) {
      toast.error("Please fill in all address details.");
      return;
    }
    const fullAddressText = `${addrStreet.trim()}, ${addrCity.trim()}, ${addrDistrict.trim() ? addrDistrict.trim() + ", " : ""}${addrState.trim()} - ${addrPincode.trim()}`;
    const newStr = JSON.stringify({
      name: addrName.trim(),
      address: fullAddressText.trim(),
      phone: addrPhone.trim()
    });
    
    if (editingAddrIndex !== null) {
      updateAddress(user.id, editingAddrIndex, newStr);
      setEditingAddrIndex(null);
      toast.success("Shipping address updated successfully!");
    } else {
      addAddress(user.id, newStr);
      toast.success("New shipping address added successfully!");
    }
    
    // Reset form states
    setAddrPincode("");
    setAddrStreet("");
    setAddrCity("");
    setAddrDistrict("");
    setAddrState("");
    setMarkerPos(null);
    setShowAddressForm(false);
  };

  const parseSingleAddress = (addrStr: string) => {
    try {
      if (addrStr.trim().startsWith("{")) {
        return JSON.parse(addrStr);
      }
    } catch (e) {}
    return {
      name: user.firstName,
      address: addrStr,
      phone: user.phone || ""
    };
  };

  const handleEditAddressClick = (addr: string, index: number) => {
    const parsed = parseSingleAddress(addr);
    setAddrName(parsed.name);
    setAddrPhone(parsed.phone);
    
    const parts = parsed.address.split(", ");
    let street = "";
    let city = "";
    let district = "";
    let stateVal = "";
    let pincode = "";

    if (parts.length >= 4) {
      street = parts[0];
      city = parts[1];
      if (parts.length === 5) {
        district = parts[2];
        const stateAndPin = parts[3].split(" - ");
        stateVal = stateAndPin[0] || "";
        pincode = stateAndPin[1] || "";
      } else {
        district = "";
        const stateAndPin = parts[2].split(" - ");
        stateVal = stateAndPin[0] || "";
        pincode = stateAndPin[1] || "";
      }
    } else {
      street = parsed.address;
    }

    setAddrStreet(street);
    setAddrCity(city);
    setAddrDistrict(district);
    setAddrState(stateVal);
    setAddrPincode(pincode);
    setEditingAddrIndex(index);
    setShowAddressForm(true);
    toast.info("Address loaded into edit form.");

    // Geocode edited address to show it on map
    const query = [street, city, district, stateVal, pincode].filter(Boolean).join(", ");
    if (query) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: { "User-Agent": "ReeVibes-Shop-Portal" }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data[0]) {
            const lngNum = parseFloat(data[0].lon);
            const latNum = parseFloat(data[0].lat);
            setMapCenter([lngNum, latNum]);
            setMarkerPos([lngNum, latNum]);
          }
        })
        .catch(console.error);
    }
  };

  const handlePlaceOrder = () => {
    if (state.shopCart.length === 0) return;
    if (!checkoutAddress) {
      toast.error("Please select or add a shipping address first!");
      return;
    }
    const orderTotal = Math.max(0, shopTotal - discountAmount);
    createOrder(user.id, {
      items: state.shopCart,
      total: orderTotal,
      address: checkoutAddress,
      appliedCoupon: appliedCoupon || undefined
    });
    toast.success("Order placed successfully!");
    navigate({ to: "/account", search: { tab: "orders" } });
  };

  const applyCouponCode = (code: string) => {
    const coupon = state.coupons.find(c => c.code === code.toUpperCase() && c.active);
    if (!coupon) {
      toast.error("Invalid coupon code.");
      return;
    }

    // Check Expiry Date
    if (coupon.expiryDate && coupon.expiryDate !== "unlimited") {
      const todayStr = new Date().toISOString().slice(0, 10);
      if (todayStr > coupon.expiryDate) {
        toast.error("This coupon has expired.");
        return;
      }
    }

    // Check Usage Limit
    if (coupon.usageLimit !== undefined && coupon.usageLimit !== -1) {
      if ((coupon.usedCount || 0) >= coupon.usageLimit) {
        toast.error("Coupon usage limit has been reached.");
        return;
      }
    }

    const discount = Math.round((shopTotal * coupon.discount) / 100);
    setDiscountAmount(discount);
    setAppliedCoupon(coupon.code);
    toast.success(`Coupon applied successfully! You got a ₹${discount.toLocaleString()} discount.`);
  };

  const activeTab = tab || "profile";
  const isProfileTab = activeTab === "dashboard" || activeTab === "profile";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 md:py-12 space-y-8 md:space-y-10">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/10 pb-6">
        <div>
          <p className="editorial-eyebrow text-accent">Maison Shop Membership</p>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl md:text-5xl">Welcome, {user.firstName}.</h1>
        </div>
        <Link to="/" className="text-xs uppercase tracking-widest font-bold text-accent hover:underline">
          Return to Curation
        </Link>
      </div>

      {/* Mobile User Information Header (Above all navigation options) */}
      <div className="lg:hidden liquid-glass border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 rounded-3xl space-y-3 shadow-sm dark:shadow-none text-foreground">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center font-serif text-lg font-bold text-accent shrink-0 uppercase shadow-md">
            {user.firstName ? user.firstName.charAt(0) : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold">Maison Member</p>
            <h2 className="font-serif text-lg text-foreground font-bold truncate">
              {user.firstName} {user.lastName || ""}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-[11px] text-muted-foreground truncate">{user.email}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" title="Email Verified via OTP" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile 2x2 Dashboard Navigation Grid */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        {[
          { id: "profile", label: "Profile", icon: User, subtitle: "Dossier & Settings" },
          { id: "orders", label: "My Orders", icon: ListOrdered, count: userOrders.length, subtitle: "Track & History" },
          { id: "addresses", label: "Address", icon: MapPin, count: userAddresses.length, subtitle: "Destinations" },
          { id: "coupons", label: "Maison Coupons", icon: Tag, count: state.coupons.length, subtitle: "Coupons & Wallet" },
        ].map((t) => {
          const isActive = t.id === "profile" ? (activeTab === "profile" || activeTab === "dashboard") : activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                navigate({ to: "/account", search: { tab: t.id as any } });
              }}
              className={`flex flex-col justify-between p-4 rounded-2xl transition-all duration-300 cursor-pointer text-left border ${
                isActive
                  ? "bg-accent/15 border-accent text-accent shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                  : "bg-white/60 dark:bg-white/5 border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-black/20 dark:hover:border-white/20 shadow-sm dark:shadow-none"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`p-2.5 rounded-xl border transition-colors ${
                  isActive ? "bg-accent text-white border-accent" : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-accent"
                }`}>
                  <t.icon className="w-4.5 h-4.5" />
                </div>
                {t.count !== undefined && t.count > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? "bg-accent text-white" : "bg-black/10 dark:bg-white/10 text-muted-foreground"
                  }`}>
                    {t.count}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <h3 className={`text-xs uppercase tracking-wider font-bold ${isActive ? 'text-accent' : 'text-foreground'}`}>
                  {t.label}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Desktop Left Sidebar (hidden on mobile) */}
        <aside className="hidden lg:block w-full lg:w-72 shrink-0">
          <div className="liquid-glass border border-black/10 dark:border-white/10 rounded-3xl p-6 space-y-6 bg-white/60 dark:bg-white/5 shadow-lg lg:h-full text-foreground">
            <div className="border-b border-black/10 dark:border-white/10 pb-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold">Maison Member</p>
              <h2 className="font-serif text-xl text-foreground font-bold mt-1 truncate">
                {user.firstName}
              </h2>
            </div>

            <nav className="flex flex-col gap-1.5">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "orders", label: "My Orders", icon: ListOrdered, count: userOrders.length },
                { id: "coupons", label: "Maison Coupons", icon: Tag, count: state.coupons.length },
                { id: "addresses", label: "Address", icon: MapPin, count: userAddresses.length },
              ].map((t) => {
                const isActive = t.id === "profile" ? (activeTab === "profile" || activeTab === "dashboard") : activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (t.id === "orders") {
                        navigate({ to: "/orders" });
                      } else {
                        navigate({ to: "/account", search: { tab: t.id as any } });
                      }
                    }}
                    className={`flex items-center justify-between w-full text-left text-[10px] uppercase tracking-wider font-bold py-3.5 px-5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                      isActive 
                        ? "bg-accent/15 border-accent text-accent shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                        : "border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <t.icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-muted-foreground'}`} />
                      <span>{t.label}</span>
                    </div>
                    {t.count !== undefined && t.count > 0 && (
                      <span className={`ml-2 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-accent text-white' : 'bg-black/10 dark:bg-white/10 text-muted-foreground'}`}>
                        {t.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Right Content Pane */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {/* Tab: Profile */}
          {isProfileTab && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Profile Completeness Ring Card (Hidden automatically when profile reaches 100%) */}
              {profileCompletionPercentage < 100 && (
                <div className="liquid-glass border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-none">
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="font-serif text-xl md:text-2xl">Curation Completeness</h3>
                    <p className="text-xs text-muted-foreground max-w-md">
                      Complete your personal styling information to receive curated collections and customized seasonal sizing recommendation updates.
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {/* SVG Progress Circle */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="34" className="stroke-white/10 fill-none" strokeWidth="6" />
                        <circle cx="40" cy="40" r="34" className="stroke-accent fill-none transition-all duration-1000" strokeWidth="6" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * profileCompletionPercentage) / 100} />
                      </svg>
                      <span className="absolute text-sm font-bold">{profileCompletionPercentage}%</span>
                    </div>
                    {!isEditing && (
                      <button onClick={() => setIsEditing(true)} className="text-xs uppercase bg-accent text-white px-5 py-2.5 rounded-full font-bold tracking-wider hover:bg-accent/90 transition-all cursor-pointer">
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!isEditing ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="liquid-glass border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 rounded-3xl space-y-4 shadow-sm dark:shadow-none">
                    <h4 className="font-serif text-lg text-accent">Personal Dossier</h4>
                    <div className="space-y-3 text-xs leading-normal">
                      <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-muted-foreground font-medium">Name:</span>
                        <span className="font-semibold text-foreground">{user.firstName} {user.lastName || ""}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-muted-foreground font-medium">Email:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-foreground font-medium">{user.email}</span>
                          <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" title="Email verified via OTP" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-muted-foreground font-medium">Phone:</span>
                        <span className="text-foreground font-medium">{user.phone || "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="liquid-glass border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 rounded-3xl space-y-4 shadow-sm dark:shadow-none">
                    <h4 className="font-serif text-lg text-accent">Maison Details</h4>
                    <div className="space-y-3 text-xs leading-normal">
                      <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-muted-foreground font-medium">Gender:</span>
                        <span className="text-foreground font-medium">{user.gender || "—"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-muted-foreground font-medium">DOB:</span>
                        <span className="font-mono text-foreground font-medium">{user.dob || "—"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-muted-foreground font-medium">Country:</span>
                        <span className="text-foreground font-medium">{user.country || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="liquid-glass border border-black/15 dark:border-white/15 bg-white/70 dark:bg-black/40 p-6 sm:p-8 rounded-3xl space-y-6 text-foreground backdrop-blur-xl shadow-xl dark:shadow-none">
                  <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Edit Curation Profile</h2>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Update your personal account dossier & communication preferences</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-xs uppercase font-bold text-muted-foreground hover:text-foreground transition-colors border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 px-4 py-1.5 rounded-full cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    {/* Name */}
                    <label className="block space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Name</span>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 focus:border-accent px-4 py-2.5 text-xs outline-none rounded-full text-foreground"
                        required
                      />
                    </label>

                    {/* Email with Verified Icon (Clean, no outline border) & Change Email Button */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Email Address</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewEmailInput("");
                            setEmailChangeError("");
                            setEmailChangeStep(1);
                            setShowChangeEmailModal(true);
                          }}
                          className="text-[10px] uppercase tracking-wider text-accent hover:underline font-bold cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Change Email
                        </button>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          value={profileForm.email}
                          readOnly
                          className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 px-4 py-2.5 text-xs outline-none rounded-full text-foreground/80 cursor-not-allowed pr-10 font-mono"
                        />
                        <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" title="Email verified via OTP" />
                      </div>
                    </div>

                    {/* Phone Number with Country Code Dropdown & Strict Digit Length Validation */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Phone Number</span>
                      <div className="flex gap-2 relative">
                        {/* Country Code Selector */}
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => setShowCodeDropdown(!showCodeDropdown)}
                            className="bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 px-3.5 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground flex items-center gap-1.5 cursor-pointer hover:border-accent transition-all font-mono font-medium"
                          >
                            <span>{COUNTRY_CODES.find(c => c.code === phoneCountryCode)?.flag || "🌐"}</span>
                            <span>{phoneCountryCode}</span>
                            <ChevronDown className="w-3 h-3 text-muted-foreground ml-0.5" />
                          </button>

                          {showCodeDropdown && (
                            <div className="absolute left-0 top-full mt-2 z-50 w-64 bg-white dark:bg-zinc-950 border border-black/15 dark:border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl p-2.5 space-y-2 animate-in fade-in duration-150 text-foreground">
                              <div className="relative">
                                <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                  type="text"
                                  value={codeSearch}
                                  onChange={(e) => setCodeSearch(e.target.value)}
                                  placeholder="Search code or country..."
                                  className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 pl-7 pr-2.5 py-1 text-[11px] rounded-xl outline-none focus:border-accent text-foreground"
                                  autoFocus
                                />
                              </div>
                              <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
                                {filteredCountryCodes.length === 0 ? (
                                  <div className="text-[10px] text-muted-foreground p-2 text-center">No match found</div>
                                ) : (
                                  filteredCountryCodes.map((item) => (
                                    <button
                                      key={item.country + item.code}
                                      type="button"
                                      onClick={() => {
                                        setPhoneCountryCode(item.code);
                                        setPhoneNumberOnly(prev => prev.slice(0, item.digits));
                                        setShowCodeDropdown(false);
                                        setCodeSearch("");
                                      }}
                                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl transition-colors flex justify-between items-center ${
                                        phoneCountryCode === item.code ? "bg-accent/20 text-accent font-semibold" : "hover:bg-black/5 dark:hover:bg-white/10 text-foreground"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-sm">{item.flag}</span>
                                        <span className="truncate text-[11px]">{item.country}</span>
                                      </div>
                                      <span className="font-mono text-[10px] font-bold text-muted-foreground shrink-0 ml-2">{item.code} ({item.digits}d)</span>
                                    </button>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Number input with digit limitation & numeric restriction */}
                        <div className="flex-1 min-w-0">
                          <input
                            type="tel"
                            value={phoneNumberOnly}
                            onChange={e => {
                              const digitsOnly = e.target.value.replace(/\D/g, "");
                              setPhoneNumberOnly(digitsOnly.slice(0, targetPhoneDigits));
                            }}
                            placeholder={`${targetPhoneDigits} digits (e.g. 9876543210)`}
                            className={`w-full bg-black/5 dark:bg-white/5 border ${
                              phoneNumberOnly.length > 0 && phoneNumberOnly.length < targetPhoneDigits
                                ? "border-rose-500 focus:border-rose-500"
                                : "border-black/15 dark:border-white/10 focus:border-accent"
                            } px-4 py-2.5 text-xs outline-none rounded-full text-foreground font-mono`}
                          />
                        </div>
                      </div>

                      {/* Live Validation Feedback */}
                      {phoneNumberOnly.length > 0 && phoneNumberOnly.length < targetPhoneDigits && (
                        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1 pl-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{activeCountryName} ({phoneCountryCode}) phone number must be exactly {targetPhoneDigits} digits ({phoneNumberOnly.length}/{targetPhoneDigits})</span>
                        </p>
                      )}
                      {phoneNumberOnly.length === targetPhoneDigits && (
                        <p className="text-[11px] text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1 pl-1">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>Valid {activeCountryName} phone number ({targetPhoneDigits} digits)</span>
                        </p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Gender Selector: Male / Female Radio buttons */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Gender</span>
                        <div className="flex gap-3 items-center pt-0.5">
                          {[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                          ].map((option) => {
                            const isSelected = profileForm.gender === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setProfileForm({ ...profileForm, gender: "" });
                                  } else {
                                    setProfileForm({ ...profileForm, gender: option.value });
                                  }
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer border ${
                                  isSelected
                                    ? "bg-accent/20 border-accent text-accent shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                                    : "bg-black/5 dark:bg-white/5 border-black/15 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-black/30 dark:hover:border-white/20"
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                                  isSelected ? "border-accent bg-accent" : "border-muted-foreground/60"
                                }`}>
                                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-obsidian" />}
                                </span>
                                <span>{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <label className="block space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Date of Birth</span>
                        <input
                          type="date"
                          value={profileForm.dob}
                          onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })}
                          className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 focus:border-accent px-4 py-2 text-xs outline-none rounded-full text-foreground"
                        />
                      </label>
                    </div>

                    {/* Country Searchable Dropdown */}
                    <div className="space-y-1.5 relative">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Country</span>
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground flex justify-between items-center cursor-pointer hover:border-accent transition-all text-left"
                      >
                        <span className={profileForm.country ? "text-foreground font-medium" : "text-muted-foreground"}>
                          {profileForm.country || "— Select Country —"}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>

                      {showCountryDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-zinc-950 border border-black/15 dark:border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl p-2.5 space-y-2 animate-in fade-in duration-150 text-foreground">
                          <div className="relative">
                            <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search country..."
                              className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 pl-8 pr-3 py-1.5 text-xs rounded-xl outline-none focus:border-accent text-foreground"
                              autoFocus
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
                            {filteredCountries.length === 0 ? (
                              <div className="text-[11px] text-muted-foreground p-2 text-center">No countries match "{countrySearch}"</div>
                            ) : (
                              filteredCountries.map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => {
                                    setProfileForm({ ...profileForm, country: c });
                                    setShowCountryDropdown(false);
                                    setCountrySearch("");
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex justify-between items-center ${
                                    profileForm.country === c ? "bg-accent/20 text-accent font-semibold" : "hover:bg-black/5 dark:hover:bg-white/10 text-foreground"
                                  }`}
                                >
                                  <span>{c}</span>
                                  {profileForm.country === c && <Check className="w-3.5 h-3.5 text-accent" />}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 py-3 w-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-md mt-4 cursor-pointer"
                    >
                      Save Profile Details
                    </button>
                  </form>
                </div>
              )}

              {/* Logout & Delete Account Section */}
              <div className="space-y-4">
                {/* Logout Card */}
                <div className="liquid-glass border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 p-6 rounded-3xl">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                        <LogOut className="w-4.5 h-4.5 text-rose-500 dark:text-rose-400" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-foreground">Sign Out</h4>
                        <p className="text-[11px] text-muted-foreground">Log out of your account session on this device.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="text-xs uppercase font-bold tracking-widest px-6 py-2.5 rounded-full border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer shrink-0"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                {/* Delete Account Option (Positioned below Logout) */}
                <div className="liquid-glass border border-rose-600/30 bg-rose-500/5 dark:bg-rose-950/20 p-6 rounded-3xl">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <div className="w-10 h-10 rounded-full bg-rose-600/20 border border-rose-500/40 flex items-center justify-center shrink-0 text-rose-500 dark:text-rose-400">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-rose-600 dark:text-rose-400">Delete Account</h4>
                        <p className="text-[11px] text-muted-foreground">Permanently delete your profile, order history, addresses & data.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setDeleteConfirmText("");
                        setShowDeleteAccountModal(true);
                      }}
                      className="text-xs uppercase font-bold tracking-widest px-6 py-2.5 rounded-full bg-rose-600/20 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white border border-rose-500/40 transition-all cursor-pointer shrink-0 shadow-md"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>

              {/* Change Email Modal */}
              {showChangeEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
                  <div className="liquid-glass bg-white dark:bg-zinc-950 border border-black/15 dark:border-accent/30 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 rounded-3xl relative text-foreground">
                    <button
                      onClick={() => {
                        setShowChangeEmailModal(false);
                        setEmailChangeStep(1);
                        setNewEmailInput("");
                        setEmailOtpInput("");
                        setEmailChangeError("");
                      }}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-2 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
                      <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0 text-accent">
                        <RefreshCw className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold">Change Email Address</h3>
                        <p className="text-[11px] text-muted-foreground">Secure Email Update & Verification</p>
                      </div>
                    </div>

                    {emailChangeError && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-500 dark:text-rose-400 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{emailChangeError}</span>
                      </div>
                    )}

                    {emailChangeStep === 1 ? (
                      <div className="space-y-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Enter your new email address. A 6-digit verification code (OTP) will be sent to verify ownership.
                        </p>
                        <label className="block space-y-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">New Email Address</span>
                          <input
                            type="email"
                            value={newEmailInput}
                            onChange={(e) => setNewEmailInput(e.target.value)}
                            placeholder="enter.new.email@example.com"
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 focus:border-accent px-4 py-3 text-xs outline-none rounded-xl text-foreground font-mono"
                          />
                        </label>
                        <div className="flex gap-3 justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => setShowChangeEmailModal(false)}
                            className="text-xs uppercase font-bold tracking-wider px-5 py-2.5 rounded-full border border-black/15 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-black/30 dark:hover:border-white/20 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleInitiateEmailChange}
                            className="bg-accent hover:bg-accent/90 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all shadow-md cursor-pointer"
                          >
                            Verify Email
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs leading-relaxed">
                          An OTP code was sent to <strong className="font-mono text-foreground">{newEmailInput}</strong>. Enter the 6-digit code below to verify your new email address.
                        </div>
                        <label className="block space-y-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">6-Digit Verification Code (OTP)</span>
                          <input
                            type="text"
                            maxLength={6}
                            value={emailOtpInput}
                            onChange={(e) => setEmailOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="123456"
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 focus:border-accent px-4 py-3 text-center text-lg font-mono tracking-[0.5em] outline-none rounded-xl text-foreground"
                          />
                        </label>
                        <div className="flex gap-3 justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => setEmailChangeStep(1)}
                            className="text-xs uppercase font-bold tracking-wider px-5 py-2.5 rounded-full border border-black/15 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-black/30 dark:hover:border-white/20 transition-all cursor-pointer"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handleVerifyEmailOtp}
                            className="bg-accent hover:bg-accent/90 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all shadow-md cursor-pointer"
                          >
                            Confirm & Verify
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Logout Confirmation Modal */}
              {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="liquid-glass bg-white dark:bg-zinc-950 border border-rose-500/20 max-w-sm w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 rounded-3xl text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold">Confirm Logout</h3>
                        <p className="text-[11px] text-muted-foreground">You will be signed out of your account.</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Are you sure you want to log out? You'll need to sign in again to access your orders, wishlist, and wallet.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="text-xs uppercase font-bold tracking-wider px-5 py-2 rounded-full border border-black/15 dark:border-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          setShowLogoutConfirm(false);
                          toast.success("You have been logged out successfully.");
                          navigate({ to: "/login" });
                        }}
                        className="text-xs uppercase font-bold tracking-wider px-5 py-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md cursor-pointer"
                      >
                        Yes, Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Account Confirmation Modal */}
              {showDeleteAccountModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
                  <div className="liquid-glass bg-white dark:bg-zinc-950 border border-rose-500/30 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 rounded-3xl relative text-foreground">
                    <button
                      onClick={() => {
                        setShowDeleteAccountModal(false);
                        setDeleteConfirmText("");
                      }}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-2 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 border-b border-rose-500/20 pb-4">
                      <div className="w-11 h-11 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-500 dark:text-rose-400">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-rose-600 dark:text-rose-500">Delete Your Account</h3>
                        <p className="text-[11px] text-muted-foreground">Permanent Account Removal</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
                      <p className="font-semibold text-foreground">
                        You are about to permanently delete your ReeVibes account.
                      </p>
                      <p className="text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider text-[11px]">
                        This action cannot be undone.
                      </p>
                      <p>Deleting your account will permanently remove:</p>
                      <ul className="list-disc pl-5 space-y-1 text-foreground/90 font-medium">
                        <li>Your profile information</li>
                        <li>Wishlist</li>
                        <li>Shopping cart</li>
                        <li>Order history</li>
                        <li>Saved addresses</li>
                        <li>Account preferences</li>
                        <li>Any other personal data associated with your account</li>
                      </ul>
                      <p className="pt-2 text-foreground font-medium">
                        If you wish to continue, type <strong className="text-rose-600 dark:text-rose-400 font-mono">DELETE</strong> below to confirm.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="w-full bg-black/5 dark:bg-white/5 border border-rose-500/30 focus:border-rose-500 px-4 py-3 text-xs outline-none rounded-xl text-foreground font-mono tracking-widest uppercase placeholder:text-muted-foreground/50 text-center"
                      />

                      <div className="flex gap-3 justify-end pt-2">
                        <button
                          onClick={() => {
                            setShowDeleteAccountModal(false);
                            setDeleteConfirmText("");
                          }}
                          className="text-xs uppercase font-bold tracking-wider px-5 py-2.5 rounded-full border border-black/15 dark:border-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={deleteConfirmText.trim() !== "DELETE"}
                          onClick={handleDeleteAccountConfirm}
                          className={`text-xs uppercase font-bold tracking-wider px-6 py-2.5 rounded-full transition-all shadow-md ${
                            deleteConfirmText.trim() === "DELETE"
                              ? "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-rose-600/30"
                              : "bg-rose-950/40 text-rose-400/40 border border-rose-900/30 cursor-not-allowed opacity-60"
                          }`}
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6 lg:h-full">
              <h2 className="font-serif text-2xl">Multiple Delivery Destinations</h2>
              
              {/* Add Address Bar / Button */}
              {!showAddressForm && editingAddrIndex === null && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(true);
                    setAddrName(user.firstName);
                    setAddrPhone(user.phone || "");
                    setAddrPincode("");
                    setAddrStreet("");
                    setAddrCity("");
                    setAddrDistrict("");
                    setAddrState("");
                    setMarkerPos(null);
                  }}
                  className="w-full bg-white/5 border border-dashed border-white/20 hover:border-accent/40 p-5 rounded-2xl flex items-center justify-center gap-2 text-accent font-bold hover:bg-white/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all cursor-pointer text-xs uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4 text-accent" /> Add Address
                </button>
              )}

              {/* Toggleable Add/Edit Form */}
              {(showAddressForm || editingAddrIndex !== null) && (
                <form onSubmit={handleAddAddress} className="pt-6 border-b border-white/10 pb-6 space-y-4">
                  <div className="grid lg:grid-cols-12 gap-6">
                    {/* Left Column: Interactive Map */}
                    <div className="lg:col-span-5 flex flex-col gap-3">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Pin Location on Map</span>
                        <span className="text-accent/80 font-mono text-[9px]">Drag pin to refine</span>
                      </span>
                      <div className="relative h-[280px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_4px_24px_rgba(212,175,55,0.05)] bg-white/5 backdrop-blur-md">
                        <Map center={mapCenter} zoom={14}>
                          {markerPos && (
                            <MapMarker
                              draggable
                              longitude={markerPos[0]}
                              latitude={markerPos[1]}
                              onDrag={(lngLat) => {
                                setMarkerPos([lngLat.lng, lngLat.lat]);
                                handleReverseGeocode(lngLat.lng, lngLat.lat);
                              }}
                            >
                              <MarkerContent>
                                <div className="relative flex items-center justify-center">
                                  <div className="absolute w-8 h-8 rounded-full bg-accent/20 border border-accent animate-ping" />
                                  <div className="relative w-5 h-5 rounded-full bg-accent border-2 border-white shadow-[0_0_10px_rgba(212,175,55,0.8)] flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  </div>
                                </div>
                              </MarkerContent>
                            </MapMarker>
                          )}
                        </Map>
                      </div>

                      {/* Detect Location Button below Map */}
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isLocating}
                        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-accent border border-white/10 px-4 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce text-accent' : 'text-accent'}`} />
                        {isLocating ? "Locating..." : "Use my current location"}
                      </button>
                    </div>

                    {/* Right Column: Address Form Fields */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Recipient Name</span>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Sree Connect"
                            className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5"
                            value={addrName}
                            onChange={e => setAddrName(e.target.value)}
                          />
                        </label>
                        
                        <label className="block">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Contact Phone</span>
                          <input
                            required
                            type="text"
                            placeholder="e.g. +91 98765 43210"
                            className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5"
                            value={addrPhone}
                            onChange={e => setAddrPhone(e.target.value)}
                          />
                        </label>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span>India Pin Code</span>
                            {isFetchingPin && <span className="text-[9px] text-accent animate-pulse">Fetching...</span>}
                          </span>
                          <input
                            required
                            type="text"
                            maxLength={6}
                            placeholder="e.g. 560038"
                            className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5"
                            value={addrPincode}
                            onChange={e => setAddrPincode(e.target.value.replace(/\D/g, ''))}
                          />
                        </label>

                        <label className="block">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">City / Town</span>
                          <input
                            required
                            type="text"
                            placeholder="City Name"
                            className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5"
                            value={addrCity}
                            onChange={e => setAddrCity(e.target.value)}
                          />
                        </label>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">District</span>
                          <input
                            type="text"
                            placeholder="District"
                            className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5"
                            value={addrDistrict}
                            onChange={e => setAddrDistrict(e.target.value)}
                          />
                        </label>

                        {/* Searchable State Dropdown */}
                        <label className="block relative">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">State</span>
                          <div className="relative mt-1.5">
                            <button
                              type="button"
                              onClick={() => setShowStateDropdown(!showStateDropdown)}
                              className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-left outline-none focus:border-accent rounded-full text-foreground flex justify-between items-center cursor-pointer"
                            >
                              <span>{addrState || "Select State"}</span>
                              <span className="text-muted-foreground text-[8px]">▼</span>
                            </button>
                            
                            {showStateDropdown && (
                              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-white/15 rounded-2xl overflow-hidden shadow-2xl z-50 p-3 space-y-2 max-h-60 flex flex-col">
                                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1">
                                  <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  <input
                                    type="text"
                                    placeholder="Search state..."
                                    className="w-full bg-transparent border-0 px-2 py-1 text-xs text-white outline-none focus:ring-0 placeholder:text-muted-foreground/50"
                                    value={stateSearch}
                                    onChange={e => setStateSearch(e.target.value)}
                                    onClick={e => e.stopPropagation()}
                                  />
                                  {stateSearch && (
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setStateSearch(""); }} className="text-muted-foreground hover:text-white">
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                
                                <div className="overflow-y-auto flex-1 space-y-0.5 scrollbar-thin pr-1">
                                  {(() => {
                                    const filtered = INDIAN_STATES.filter(st =>
                                      st.toLowerCase().includes(stateSearch.toLowerCase())
                                    );
                                    if (filtered.length === 0) {
                                      return <div className="text-[10px] text-muted-foreground italic text-center py-2">No matching states</div>;
                                    }
                                    return filtered.map(st => (
                                      <button
                                        key={st}
                                        type="button"
                                        onClick={() => {
                                          setAddrState(st);
                                          setShowStateDropdown(false);
                                          setStateSearch("");
                                        }}
                                        className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors hover:bg-white/10 cursor-pointer ${
                                          addrState === st ? "text-accent font-bold bg-white/5" : "text-white/80"
                                        }`}
                                      >
                                        {st}
                                      </button>
                                    ));
                                  })()}
                                </div>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>

                      <label className="block">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Street / Detailed Address</span>
                        <input
                          required
                          type="text"
                          placeholder="Apartment/Flat No, Area, Street Name"
                          className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5"
                          value={addrStreet}
                          onChange={e => setAddrStreet(e.target.value)}
                        />
                      </label>

                      {/* Add Destination / Cancel options below street address */}
                      <div className="flex gap-3 pt-4">
                        <button type="submit" className="bg-accent text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-accent/90 cursor-pointer">
                          {editingAddrIndex !== null ? "Save Changes" : "Add Destination"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddrIndex(null);
                            setShowAddressForm(false);
                            setAddrPincode("");
                            setAddrStreet("");
                            setAddrCity("");
                            setAddrDistrict("");
                            setAddrState("");
                            setMarkerPos(null);
                            toast.info("Action cancelled.");
                          }}
                          className="border border-white/10 hover:bg-white/10 text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Added Destinations List */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg text-foreground pb-2 border-b border-white/5">Saved Delivery Destinations</h3>
                {userAddresses.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No addresses saved yet.</p>
                ) : (
                  userAddresses.map((addr, idx) => {
                    const isMajor = state.majorAddresses?.[user.id] === addr;
                    const parsed = parseSingleAddress(addr);
                    return (
                      <div key={idx} className={`flex justify-between items-center p-4 rounded-2xl bg-white/5 border transition-all ${isMajor ? 'border-accent/50 shadow-[0_0_12px_rgba(212,175,55,0.15)] bg-accent/5' : 'border-white/10'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs leading-relaxed flex-1">
                          <div className="flex gap-2 items-start">
                            <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isMajor ? 'text-accent' : 'text-muted-foreground'}`} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{parsed.name}</span>
                                {isMajor && (
                                  <span className="inline-flex items-center gap-1 bg-accent/20 text-accent text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold ml-2">
                                    <Check className="w-2.5 h-2.5" /> Major Address
                                  </span>
                                )}
                              </div>
                              <p className="text-muted-foreground mt-1">{parsed.address}</p>
                              <div className="text-[10px] text-accent/80 font-mono mt-1">Phone: {parsed.phone}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditAddressClick(addr, idx)}
                            className="text-[10px] uppercase tracking-widest font-bold text-accent hover:text-white transition-colors px-3 py-1.5 rounded-full border border-accent/20 hover:border-accent cursor-pointer"
                          >
                            Edit
                          </button>
                          {!isMajor && (
                            <button
                              type="button"
                              onClick={() => {
                                setMajorAddress(user.id, addr);
                                toast.success("Marked as primary shipping destination!");
                              }}
                              className="text-[10px] uppercase tracking-widest font-bold text-accent hover:text-white transition-colors px-3 py-1.5 rounded-full border border-accent/20 hover:border-accent cursor-pointer"
                            >
                              Mark as Major
                            </button>
                          )}
                          <button onClick={() => removeAddress(user.id, idx)} className="text-rose-400 hover:text-rose-500 p-2 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Tab: My Orders (Inline View for Mobile & Tab Navigation) */}
          {activeTab === "orders" && (
            <div className="liquid-glass border border-black/15 dark:border-white/15 bg-white/70 dark:bg-black/40 p-6 sm:p-8 rounded-3xl space-y-6 text-foreground backdrop-blur-xl shadow-xl dark:shadow-none">
              <div className="flex flex-wrap justify-between items-center gap-4 border-b border-black/10 dark:border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold">My Curation Orders</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Click product name for details, or click card to expand order ledger</p>
                </div>
                <Link
                  to="/orders"
                  className="text-xs uppercase font-bold text-accent hover:underline flex items-center gap-1"
                >
                  View Full Orders Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {userOrders.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 mx-auto flex items-center justify-center text-accent">
                    <ListOrdered className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold">No Orders Placed Yet</h3>
                    <p className="text-xs text-muted-foreground">Explore our curated collections and place your first order.</p>
                  </div>
                  <Link
                    to="/"
                    className="inline-block bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow-md mt-2"
                  >
                    Explore Catalog
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((ord: any) => {
                    const firstItem = ord.items?.[0];
                    return (
                      <div
                        key={ord.id}
                        className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-accent/50 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md text-foreground group"
                        onClick={() => setSelectedOrderDetails(ord)}
                      >
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                          {/* Left: Product Image & Info */}
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            {firstItem?.image ? (
                              <img src={firstItem.image} alt={firstItem.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-black/10 dark:border-white/10 shrink-0 group-hover:scale-105 transition-transform" />
                            ) : (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-accent shrink-0">
                                <ListOrdered className="w-8 h-8" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold text-accent">#{ord.id}</span>
                                <span className="text-[10px] text-muted-foreground font-mono">({ord.date || ord.createdAt || "Recent"})</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate({ to: "/product/$productId", params: { productId: firstItem?.productId || "vnd-1" } });
                                }}
                                className="font-serif font-bold text-sm sm:text-base text-foreground hover:text-accent transition-colors truncate block text-left cursor-pointer"
                              >
                                {firstItem?.name || "Curation Apparel"}
                                {(ord.items || []).length > 1 && (
                                  <span className="text-xs font-mono text-accent ml-2 font-semibold">+{(ord.items || []).length - 1} more items</span>
                                )}
                              </button>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span>Size: <strong className="text-foreground font-mono">{firstItem?.selectedSize || "M"}</strong></span>
                                <span>•</span>
                                <span>Qty: <strong className="text-foreground font-mono">{firstItem?.qty || 1}</strong></span>
                                <span>•</span>
                                <span>Est. Delivery: <strong className="text-foreground">{ord.estimatedDeliveryDate || "3-5 Business Days"}</strong></span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Status Badge & Total Amount */}
                          <div className="flex sm:flex-col justify-between sm:justify-center items-end gap-2 shrink-0 border-t sm:border-t-0 border-black/5 dark:border-white/5 pt-2 sm:pt-0">
                            <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                              ord.status === "Delivered"
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                : ord.status === "Cancelled"
                                ? "bg-rose-500/15 border-rose-500/30 text-rose-500"
                                : "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
                            }`}>
                              {ord.status || "Processing"}
                            </span>
                            <div className="text-right">
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">Total Amount</span>
                              <span className="font-mono text-sm sm:text-base font-bold text-accent">₹{(ord.totalAmount || ord.total || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab: Maison Coupons (Merged with Wallet) */}
          {(activeTab === "coupons" || activeTab === "wallet") && (
            <div className="liquid-glass border border-black/15 dark:border-white/15 bg-white/70 dark:bg-black/40 p-6 sm:p-8 rounded-3xl space-y-8 text-foreground backdrop-blur-xl shadow-xl dark:shadow-none">
              {/* Wallet Section (Top) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                      <WalletIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold">My Maison Luxury Wallet</h3>
                      <p className="text-[11px] text-muted-foreground">Digital balance for instant checkout & refunds</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-accent/25 via-accent/10 to-black/40 dark:to-black/60 border border-accent/30 p-6 rounded-2xl space-y-4 shadow-lg text-foreground">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Available Balance</div>
                      <div className="font-serif text-3xl sm:text-4xl font-bold text-accent mt-1">
                        ₹{(state.wallets[user.id] ?? 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-[10px] uppercase font-bold tracking-wider">
                      Active Ledger
                    </div>
                  </div>

                  {/* Add Gift Card Option */}
                  <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                      Redeem Gift Card / Voucher
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={giftCardInput}
                        onChange={(e) => setGiftCardInput(e.target.value.toUpperCase())}
                        placeholder="Enter gift card code (e.g. WELCOME500)"
                        className="flex-1 bg-white dark:bg-black/50 border border-black/15 dark:border-white/15 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground font-mono tracking-wider uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleRedeemGiftCard}
                        disabled={isRedeeming}
                        className="bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {isRedeeming ? "Redeeming..." : "Redeem"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupons Section (Bottom) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2.5 border-b border-black/10 dark:border-white/10 pb-3">
                  <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold">Available Maison Coupons</h3>
                    <p className="text-[11px] text-muted-foreground">Exclusive promotional offers for your curation orders</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {state.coupons.map((c) => (
                    <div key={c.code} className="border border-dashed border-accent/40 bg-white/60 dark:bg-white/5 p-5 flex flex-col justify-between rounded-2xl shadow-sm dark:shadow-none space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-lg font-bold tracking-widest text-accent">{c.code}</div>
                          <div className="text-xs font-semibold text-foreground mt-0.5">{c.discount}% Discount on all curation orders</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(c.code);
                            toast.success(`Coupon code ${c.code} copied to clipboard!`);
                          }}
                          className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all cursor-pointer"
                        >
                          Copy Code
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider pt-2 border-t border-black/5 dark:border-white/5">
                        <span>Status: <strong className="text-emerald-500 font-bold">Active</strong></span>
                        <span>Expires: {c.expiryDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}



        </main>
      </div>

        {/* Comprehensive Order Details Modal */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="liquid-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-black/15 dark:border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 text-foreground shadow-2xl animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-black/10 dark:border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Maison Order Ledger</span>
                  <h3 className="font-serif text-2xl font-bold mt-0.5">Order #{selectedOrderDetails.id}</h3>
                  <p className="text-[11px] text-muted-foreground font-mono">Placed on {selectedOrderDetails.date || "Recent"}</p>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Transit Timeline Progress Bar */}
              <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                  <span>Shipment Delivery Status</span>
                  <span className={`px-3 py-1 rounded-full border text-[10px] ${
                    selectedOrderDetails.status === "Delivered"
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
                  }`}>
                    {selectedOrderDetails.status || "Processing"}
                  </span>
                </div>

                {(() => {
                  const steps = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
                  const status = selectedOrderDetails.status || "Order Placed";
                  let activeIdx = 0;
                  if (status.includes("Confirmed") || status.includes("Accept") || status.includes("Prepare") || status.includes("Processing")) activeIdx = 1;
                  else if (status.includes("Ship") || status.includes("Ready")) activeIdx = 2;
                  else if (status.includes("Transit") || status.includes("Delivery") || status.includes("Out")) activeIdx = 3;
                  else if (status.includes("Deliver")) activeIdx = 4;

                  return (
                    <div className="py-2">
                      <div className="relative flex items-center justify-between w-full mt-2">
                        <div className="absolute left-0 right-0 top-2.5 h-1 bg-black/10 dark:bg-white/10 -z-10 rounded-full" />
                        <div
                          className="absolute left-0 top-2.5 h-1 bg-accent transition-all duration-500 -z-10 rounded-full"
                          style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
                        />
                        {steps.map((st, sIdx) => {
                          const isCompleted = sIdx <= activeIdx;
                          const isActive = sIdx === activeIdx;
                          return (
                            <div key={sIdx} className="flex flex-col items-center">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? "bg-accent border-accent text-white shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                                    : "bg-white dark:bg-zinc-950 border-black/20 dark:border-white/20"
                                }`}
                              >
                                {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span
                                className={`text-[9px] uppercase tracking-wider mt-2 font-bold text-center leading-tight transition-colors ${
                                  isActive ? "text-accent" : isCompleted ? "text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-black/10 dark:border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">Courier Partner</span>
                    <span className="font-medium text-foreground">{selectedOrderDetails.courierPartner || "Delhivery Express"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">Tracking ID</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-accent font-bold">{selectedOrderDetails.trackingNumber || `TRK-${selectedOrderDetails.id.replace("ORD-", "")}`}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedOrderDetails.trackingNumber || `TRK-${selectedOrderDetails.id.replace("ORD-", "")}`);
                          toast.success("Tracking ID copied!");
                        }}
                        className="text-[9px] text-muted-foreground hover:text-accent underline cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">Estimated Delivery</span>
                    <span className="font-medium text-foreground">{selectedOrderDetails.estimatedDeliveryDate || "3-5 Business Days"}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-wider text-accent border-b border-black/10 dark:border-white/10 pb-2">Purchased Curation Items</h4>
                {(selectedOrderDetails.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded-xl border border-black/10 dark:border-white/10 shrink-0" />
                      <div className="min-w-0">
                        <Link
                          to="/product/$productId"
                          params={{ productId: item.productId }}
                          className="font-serif font-bold text-sm text-foreground hover:text-accent truncate block"
                        >
                          {item.name}
                        </Link>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          Size: <strong className="text-foreground">{item.selectedSize || "M"}</strong> • Qty: <strong className="text-foreground">{item.qty || 1}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-sm text-foreground">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address & Payment Breakdown Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Shipping Address Card */}
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-accent block">Shipping Address</span>
                  <div className="font-semibold text-foreground">{selectedOrderDetails.shippingAddress?.name || user.firstName}</div>
                  <p className="text-muted-foreground leading-relaxed">{selectedOrderDetails.shippingAddress?.street || selectedOrderDetails.shippingAddress || "Primary Delivery Address"}</p>
                  <div className="text-[11px] font-mono text-muted-foreground pt-1">Phone: {selectedOrderDetails.shippingAddress?.phone || user.phone || "N/A"}</div>
                </div>

                {/* Payment Breakdown Card */}
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-accent block">Payment Breakdown</span>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-foreground uppercase">{selectedOrderDetails.paymentMethod || "Prepaid"}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Payment Status:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase">{selectedOrderDetails.paymentStatus || "Paid"}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground pt-1 border-t border-black/5 dark:border-white/5">
                    <span>Subtotal:</span>
                    <span className="font-mono text-foreground">₹{(selectedOrderDetails.subtotal || selectedOrderDetails.total || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground font-bold text-sm pt-1 border-t border-black/10 dark:border-white/10">
                    <span>Total Paid:</span>
                    <span className="font-mono text-accent">₹{(selectedOrderDetails.totalAmount || selectedOrderDetails.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Save Success Popup Modal */}
        {showSaveSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm overflow-hidden liquid-glass bg-background/90 border border-accent/40 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.25)] p-8 text-foreground animate-in zoom-in-95 duration-200 text-center space-y-6">
              <div className="mx-auto w-12 h-12 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center text-accent">
                <Check className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold">
                  Maison Registry updated
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-wide">
                  Couture Profile Saved
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your curation details and sizing preferences have been successfully updated in our secure ledger.
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowSaveSuccessPopup(false)}
                  className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(212,175,55,0.3)] border border-accent/20 cursor-pointer"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

function AIAnalyticsView() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/ai/analytics`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("AI Analytics backend offline, loading sandbox mockup:", err);
        setStats({
          totalCommands: 145,
          geminiCalls: 32,
          commandsLearned: 113,
          unknownCommands: 4,
          successRate: 98.4,
          topIntents: [
            { intent: "SHOW_CART", count: 48 },
            { intent: "SHOW_WISHLIST", count: 32 },
            { intent: "SEARCH_PRODUCTS", count: 28 },
            { intent: "CHECKOUT_MENS_PRODUCTS", count: 18 },
            { intent: "CHANGE_THEME", count: 12 },
            { intent: "APPLY_BEST_COUPON", count: 7 }
          ],
          unknownCommandsList: [
            { id: 1, commandText: "get me something for a spaceship flight", geminiResponse: "UNKNOWN", confidenceScore: 0.2, createdAt: "2026-06-24T23:50:00" },
            { id: 2, commandText: "how is the weather in Delhi", geminiResponse: "UNKNOWN", confidenceScore: 0.12, createdAt: "2026-06-24T23:51:00" }
          ]
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground text-xs animate-pulse">Loading Maison AI Registry logs...</div>;
  }

  return (
    <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl">AI Assistant Intent Registry</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Hybrid Self-Learning Analytics</p>
        </div>
        <span className="bg-accent/15 border border-accent/30 text-accent text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
          PostgreSQL Active
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Queries", val: stats.totalCommands },
          { label: "Gemini AI Calls", val: stats.geminiCalls },
          { label: "Commands Learned", val: stats.commandsLearned },
          { label: "Success Rate", val: `${stats.successRate.toFixed(1)}%` },
        ].map((item, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center space-y-1 shadow-sm">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{item.label}</div>
            <div className="font-serif text-2xl font-bold text-accent">{item.val}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-3 bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-serif text-base text-accent">Top Intent Hits</h3>
          <div className="space-y-2">
            {stats.topIntents && stats.topIntents.length > 0 ? (
              stats.topIntents.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 pb-2 last:border-0">
                  <span className="font-mono text-white">{item.intent}</span>
                  <span className="bg-accent/15 text-accent font-bold px-2 py-0.5 rounded-md">{item.count} hits</span>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-xs italic">No intent logs captured yet.</div>
            )}
          </div>
        </div>

        <div className="space-y-3 bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-serif text-base text-rose-400">Unknown Queries (Awaiting Curation)</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
            {stats.unknownCommandsList && stats.unknownCommandsList.length > 0 ? (
              stats.unknownCommandsList.map((item: any) => (
                <div key={item.id} className="text-[11px] bg-rose-500/5 border border-rose-500/10 p-2 rounded-xl space-y-1">
                  <div className="font-semibold text-white">"{item.commandText}"</div>
                  <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>Confidence: {item.confidenceScore ? item.confidenceScore.toFixed(2) : "0.0"}</span>
                    <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-xs italic">No unknown queries flagged. AI maps 100% of inputs!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
