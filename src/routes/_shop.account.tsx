import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePortal, useCartTotal } from "@/lib/portal-state";
import { BACKEND_URL } from "@/lib/config";
import { FadeUp } from "@/components/motion/Reveal";
import { PRODUCTS } from "@/lib/data";
import { useState, useEffect } from "react";
import { z } from "zod";
import { MapPin, Tag, Heart, ShoppingBag, ListOrdered, User, Save, Trash2, Plus, Check, RotateCcw, Wallet as WalletIcon, Settings as SettingsIcon, ShieldCheck, Star, X, ArrowLeft, AlertTriangle, LogOut } from "lucide-react";
import { StatusChip } from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { useShopNotification } from "./_shop";

const accountSearchSchema = z.object({
  tab: z.enum(["dashboard", "profile", "addresses", "coupons", "wishlist", "orders", "returns", "wallet", "settings", "ai-analytics"]).catch("profile"),
});

export const Route = createFileRoute("/_shop/account")({
  validateSearch: (search) => accountSearchSchema.parse(search),
  component: ShopDashboard,
});

function ShopDashboard() {
  const { state, updateUser, addAddress, removeAddress, updateAddress, setMajorAddress, toggleShopWishlist, createOrder, addToShopCart, requestReturn, markNotificationsRead, addReview, signOut } = usePortal();
  const { triggerPopup } = useShopNotification();
  const { shopCount, shopTotal } = useCartTotal();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const user = state.user;

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
    if (user.firstName) score += 15;
    if (user.lastName) score += 15;
    if (user.email) score += 15;
    if (user.phone) score += 15;
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
    }
  }, [user]);

  // Saved Addresses State
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrDistrict, setAddrDistrict] = useState("");
  const [addrState, setAddrState] = useState("");
  const [isFetchingPin, setIsFetchingPin] = useState(false);

  // Autofill name and phone from profile
  useEffect(() => {
    if (user) {
      setAddrName(prev => prev || `${user.firstName} ${user.lastName}`.trim());
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
  const wishlistItems = (state.products || PRODUCTS).filter(p =>
    wishlistIds.map(String).includes(String(p.id))
  );

  // Orders List
  const userOrders = user ? (state.orders?.[user.id] || []) : [];

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
    updateUser(user.id, profileForm as any);
    setShowSaveSuccessPopup(true);
    setIsEditing(false);
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
  };

  const parseSingleAddress = (addrStr: string) => {
    try {
      if (addrStr.trim().startsWith("{")) {
        return JSON.parse(addrStr);
      }
    } catch (e) {}
    return {
      name: `${user.firstName} ${user.lastName}`,
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
    toast.info("Address loaded into edit form. Scroll down to edit.");

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
    <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 space-y-10">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <p className="editorial-eyebrow text-accent">Maison Shop Membership</p>
          <h1 className="mt-2 font-serif text-3xl md:text-5xl">Welcome, {user.firstName}.</h1>
        </div>
        <Link to="/" className="text-xs uppercase tracking-widest font-bold text-accent hover:underline">
          Return to Curation
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="liquid-glass border border-white/10 rounded-3xl p-6 space-y-6 bg-white/5 shadow-lg">
            <div className="border-b border-white/10 pb-4">
              <p className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold">Maison Member</p>
              <h2 className="font-serif text-xl text-foreground font-semibold mt-1 truncate">
                {user.firstName} {user.lastName}
              </h2>
            </div>
            
            <nav className="flex flex-col gap-1.5">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "orders", label: "My Orders", icon: ListOrdered, count: userOrders.length },
                { id: "wishlist", label: "Wishlist Curation", icon: Heart, count: wishlistIds.length },
                { id: "coupons", label: "Maison Coupons", icon: Tag, count: state.coupons.length },
                { id: "addresses", label: "Address", icon: MapPin, count: userAddresses.length },
                { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
                { id: "wallet", label: "Wallet", icon: WalletIcon },
              ].map((t) => {
                const isActive = t.id === "profile" ? (activeTab === "profile" || activeTab === "dashboard") : activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => navigate({ to: "/account", search: { tab: t.id as any } })}
                    className={`flex items-center justify-between w-full text-left text-[10px] uppercase tracking-wider font-bold py-3.5 px-5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                      isActive 
                        ? "bg-accent/15 border-accent text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                        : "border-transparent hover:bg-white/5 hover:border-white/5 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <t.icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-muted-foreground'}`} />
                      <span>{t.label}</span>
                    </div>
                    {t.count !== undefined && t.count > 0 && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive ? 'bg-accent text-white' : 'bg-white/10 text-muted-foreground'}`}>
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
              {/* Profile Completeness Ring Card */}
              <div className="liquid-glass border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
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

              {!isEditing ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="liquid-glass border border-white/10 p-6 rounded-3xl space-y-4">
                    <h4 className="font-serif text-lg text-accent">Personal Dossier</h4>
                    <div className="space-y-2 text-xs leading-normal">
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">First Name:</span> <span className="font-medium text-foreground">{user.firstName}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Last Name:</span> <span className="font-medium text-foreground">{user.lastName}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Email:</span> <span className="font-mono text-foreground">{user.email}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{user.phone || "—"}</span></div>
                    </div>
                  </div>

                  <div className="liquid-glass border border-white/10 p-6 rounded-3xl space-y-4">
                    <h4 className="font-serif text-lg text-accent">Maison Details</h4>
                    <div className="space-y-2 text-xs leading-normal">
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Gender:</span> <span className="text-foreground">{user.gender || "—"}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">DOB:</span> <span className="font-mono text-foreground">{user.dob || "—"}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Country:</span> <span className="text-foreground">{user.country || "—"}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Rank/Status:</span> <span className="text-accent font-bold uppercase tracking-wider text-[9px]">{user.roles?.join(" / ") || "GENERAL"}</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h2 className="font-serif text-2xl">Edit Curation Profile</h2>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-xs uppercase font-bold text-muted-foreground hover:text-foreground transition-colors border border-white/10 hover:border-white/20 px-4 py-1.5 rounded-full cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">First Name</span>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                          required
                        />
                      </label>
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Last Name</span>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                          required
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Email Address</span>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Phone Number</span>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Gender</span>
                        <select
                          value={profileForm.gender}
                          onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                        >
                          <option className="bg-zinc-950" value="" disabled>— Select Gender —</option>
                          <option className="bg-zinc-950" value="Female">Female</option>
                          <option className="bg-zinc-950" value="Male">Male</option>
                          <option className="bg-zinc-950" value="Other">Other</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Date of Birth</span>
                        <input
                          type="date"
                          value={profileForm.dob}
                          onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Country</span>
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={e => setProfileForm({ ...profileForm, country: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2"
                      />
                    </label>
                    <button
                      type="submit"
                      className="bg-accent hover:bg-accent/90 text-white rounded-full px-6 py-3 w-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-4 cursor-pointer"
                    >
                      Save Profile Details
                    </button>
                  </form>
                </div>
              )}
              {/* Logout Section */}
              <div className="liquid-glass border border-rose-500/15 p-6 rounded-3xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                      <LogOut className="w-4.5 h-4.5 text-rose-400" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base">Sign Out</h4>
                      <p className="text-[11px] text-muted-foreground">Log out of your account on this device.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-xs uppercase font-bold tracking-widest px-6 py-2.5 rounded-full border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Logout Confirmation Modal */}
              {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="liquid-glass bg-background/95 border border-rose-500/20 max-w-sm w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 rounded-3xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg">Confirm Logout</h3>
                        <p className="text-[11px] text-muted-foreground">You will be signed out of your account.</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Are you sure you want to log out? You'll need to sign in again to access your orders, wishlist, and wallet.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="text-xs uppercase font-bold tracking-wider px-5 py-2 rounded-full border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-all cursor-pointer"
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
            </div>
          )}

          {/* Tab: Addresses */}
          {activeTab === "addresses" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Multiple Delivery Destinations</h2>
              <div className="space-y-3">
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
              <form onSubmit={handleAddAddress} className="pt-6 border-t border-white/10 space-y-4">
                <h4 className="font-serif text-lg text-accent">{editingAddrIndex !== null ? "Edit Delivery Destination" : "Add New Delivery Destination"}</h4>
                
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
                      
                      {/* Detect Location Button with Liquid Glass Theme */}
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isLocating}
                        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-accent border border-accent/30 hover:border-accent px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold backdrop-blur-md transition-all cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce text-accent' : 'text-accent'}`} />
                        {isLocating ? "Locating..." : "Detect Location"}
                      </button>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleGeocodeAddress}
                      className="w-full bg-white/5 hover:bg-white/10 text-accent border border-accent/20 hover:border-accent/40 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                    >
                      Locate Entered Address on Map
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
                          {isFetchingPin && <span className="text-[9px] text-accent animate-pulse">Fetching details...</span>}
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

                      <label className="block">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">State</span>
                        <input
                          required
                          type="text"
                          placeholder="State Name"
                          className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5"
                          value={addrState}
                          onChange={e => setAddrState(e.target.value)}
                        />
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
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="bg-accent text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-accent/90 cursor-pointer">
                    {editingAddrIndex !== null ? "Save Changes" : "Add Destination"}
                  </button>
                  {editingAddrIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddrIndex(null);
                        setAddrPincode("");
                        setAddrStreet("");
                        setAddrCity("");
                        setAddrDistrict("");
                        setAddrState("");
                        setMarkerPos(null);
                        toast.info("Edit cancelled.");
                      }}
                      className="border border-white/10 hover:bg-white/10 text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Tab: Coupons */}
          {activeTab === "coupons" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Available Maison Coupons</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {state.coupons.map((c) => (
                  <div key={c.code} className="border border-dashed border-accent/40 bg-accent/5 p-5 flex flex-col justify-between rounded-2xl">
                    <div>
                      <div className="font-mono text-lg font-bold tracking-widest text-accent">{c.code}</div>
                      <div className="text-xs mt-1 font-semibold">{c.discount}% Discount for Curation Carts</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-4">Expiry: {c.expiryDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Wishlist */}
          {activeTab === "wishlist" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Isolated Shop Wishlist</h2>
              {wishlistItems.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Your shop wishlist is empty.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {wishlistItems.map((p) => (
                    <WishlistItemCard
                      key={p.id}
                      p={p}
                      user={user}
                      toggleShopWishlist={toggleShopWishlist}
                      addToShopCart={addToShopCart}
                      triggerPopup={triggerPopup}
                    />
                  ))}
                </div>
              )}
            </div>
          )}



          {/* Tab: Orders */}
          {activeTab === "orders" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-6">
              <h2 className="font-serif text-2xl">Maison Orders Tracker</h2>
              {userOrders.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No orders found.</p>
              ) : (
                <div className="space-y-6">
                  {userOrders.map(order => {
                    // Group order items by productId to show different sizes under the same product
                    const groupedItems: any[] = [];
                    (order.items || []).forEach((item: any) => {
                      const existing = groupedItems.find(x => x.productId === item.productId);
                      if (existing) {
                        existing.variants.push({
                          size: item.selectedSize || "M",
                          qty: item.qty,
                          price: item.price
                        });
                      } else {
                        groupedItems.push({
                          ...item,
                          variants: [{
                            size: item.selectedSize || "M",
                            qty: item.qty,
                            price: item.price
                          }]
                        });
                      }
                    });

                    return (
                      <div key={order.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4 shadow-sm">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="font-mono text-xs font-semibold text-accent">{order.id} · {order.date}</span>
                          <StatusChip status={order.status} tone={order.status === "Delivered" ? "success" : "warn"} />
                        </div>
                        <div className="space-y-4">
                          {groupedItems.map(groupedItem => (
                            <div key={groupedItem.productId} className="flex flex-col md:flex-row justify-between items-start gap-4 text-xs border-b border-white/[0.03] pb-4 last:border-0 last:pb-0 w-full">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <Link to="/product/$productId" params={{ productId: groupedItem.productId }} className="block shrink-0">
                                  <img src={groupedItem.image} className="w-12 h-15 object-cover rounded-md border border-white/10 hover:opacity-85 transition-opacity" />
                                </Link>
                                <div className="flex-1 min-w-0">
                                  <Link
                                    to="/product/$productId"
                                    params={{ productId: groupedItem.productId }}
                                    className="font-semibold text-white hover:text-accent transition-colors block text-sm font-serif truncate"
                                  >
                                    {groupedItem.name}
                                  </Link>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">{groupedItem.house}</div>
                                  
                                  {/* Same size bar list with correct alignment */}
                                  <div className="mt-2 space-y-1.5 max-w-xl">
                                    {groupedItem.variants.map((v: any, vIdx: number) => {
                                      const hasBeenReturned = state.returns?.some(
                                        r => r.orderId === order.id && r.productId === groupedItem.productId && r.selectedSize === v.size
                                      );
                                      return (
                                        <div key={vIdx} className="flex flex-wrap items-center justify-between gap-2 bg-white/5 p-2 rounded-xl border border-white/5 w-full">
                                          <div className="flex items-center gap-3">
                                            <span className="text-[9px] uppercase tracking-widest font-bold bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/10">
                                              Size: {v.size}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                              Qty: {v.qty}
                                            </span>
                                          </div>
                                          
                                          <div className="flex items-center gap-3 ml-auto">
                                            <span className="font-semibold font-mono text-xs text-foreground">{v.price}</span>
                                            {order.status === "Delivered" && (
                                              <div className="flex gap-1.5">
                                                <button
                                                  onClick={() => {
                                                    setReviewFormItem({ productId: groupedItem.productId, orderId: order.id });
                                                    setReviewText("");
                                                    setReviewRating(5);
                                                  }}
                                                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-full transition-all"
                                                >
                                                  Review
                                                </button>
                                                {!hasBeenReturned ? (
                                                  <button
                                                    onClick={() => {
                                                      setReturnFormItem({
                                                        orderId: order.id,
                                                        productId: groupedItem.productId,
                                                        productName: groupedItem.name,
                                                        price: v.price,
                                                        selectedSize: v.size,
                                                        qty: v.qty
                                                      });
                                                      setReturnStep(1);
                                                      setReturnReason("Product arrived damaged");
                                                      setReturnDesc("");
                                                      setReturnPhotos([]);
                                                      setReturnVideo("");
                                                      setReturnRefundMethod("Original Payment Method");
                                                    }}
                                                    className="bg-accent/20 hover:bg-accent hover:text-white border border-accent/20 text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-accent transition-colors cursor-pointer"
                                                  >
                                                    Return
                                                  </button>
                                                ) : (
                                                  <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                                    Returned
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Courier and Shipment Tracker details */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/5 text-[11px]">
                            <div>
                              <span className="font-semibold text-white uppercase tracking-wider text-[9px] block">Courier Partner</span>
                              <span className="text-accent font-medium">{order.courierPartner || "Delhivery Express"}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-white uppercase tracking-wider text-[9px] block text-right md:text-left">Tracking ID</span>
                              <span className="font-mono text-white">{order.trackingNumber || `TRK-${order.id.replace("ORD-", "")}`}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-white uppercase tracking-wider text-[9px] block text-right">Est. Delivery Date</span>
                              <span className="text-white font-medium">{order.estimatedDeliveryDate || "July 24, 2026"}</span>
                            </div>
                          </div>

                          {/* Visual Delivery Status Progress Timeline */}
                          <div className="py-2">
                            <span className="font-bold text-white uppercase tracking-widest text-[8px] block mb-3">Live Curation Transit Roadmap</span>
                            {(() => {
                              const steps = ["Order Placed", "Preparing Order", "Shipped", "In Transit", "Delivered"];
                              const status = order.status || "Order Placed";
                              
                              // Helper to determine active index
                              let activeIdx = 0;
                              if (status.includes("Confirmed") || status.includes("Accept") || status.includes("Prepare") || status.includes("Pack")) {
                                activeIdx = 1;
                              } else if (status.includes("Ship") || status.includes("Ready")) {
                                activeIdx = 2;
                              } else if (status.includes("Transit") || status.includes("Delivery") || status.includes("Today")) {
                                activeIdx = 3;
                              } else if (status.includes("Deliver")) {
                                activeIdx = 4;
                              }
                              
                              return (
                                <div className="relative flex items-center justify-between w-full mt-4 pb-1.5">
                                  {/* Progress Line Bar */}
                                  <div className="absolute left-0 right-0 top-1.5 h-0.5 bg-white/10 -z-10" />
                                  <div
                                    className="absolute left-0 top-1.5 h-0.5 bg-accent transition-all duration-500 -z-10"
                                    style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
                                  />
                                  
                                  {steps.map((st, sIdx) => {
                                    const isCompleted = sIdx <= activeIdx;
                                    const isActive = sIdx === activeIdx;
                                    return (
                                      <div key={sIdx} className="flex flex-col items-center">
                                        <div
                                          className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                                            isCompleted
                                              ? "bg-accent border-accent shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                                              : "bg-zinc-950 border-white/20"
                                          }`}
                                        >
                                          {isCompleted && (
                                            <div className="w-1 h-1 rounded-full bg-white" />
                                          )}
                                        </div>
                                        <span
                                          className={`text-[8px] uppercase tracking-wider mt-2.5 font-bold transition-colors ${
                                            isActive
                                              ? "text-accent"
                                              : isCompleted
                                              ? "text-white"
                                              : "text-muted-foreground"
                                          }`}
                                        >
                                          {st}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                          <span className="text-muted-foreground">Total Paid:</span>
                          <span className="font-bold text-accent">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Write Review Dialog Modal */}
              {reviewFormItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="liquid-glass max-w-md w-full p-6 md:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <h3 className="font-serif text-xl">Write verified Review</h3>
                      <button onClick={() => setReviewFormItem(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex gap-2 justify-center py-2">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setReviewRating(stars)}
                          className="text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${stars <= reviewRating ? "fill-current" : "text-zinc-600"}`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      required
                      placeholder="Share your experience styling this piece..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs outline-none focus:border-accent h-28 text-white placeholder:text-muted-foreground/50 transition-colors"
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                    />
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          if (!reviewText.trim()) {
                            toast.error("Please explain your review in detail.");
                            return;
                          }
                          addReview(reviewFormItem.productId, {
                            userName: `${user.firstName} ${user.lastName}`,
                            rating: reviewRating,
                            comment: reviewText.trim()
                          });
                          toast.success("Thank you! Review submitted successfully.");
                          setReviewFormItem(null);
                        }}
                        className="flex-1 bg-accent text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent/90 transition-transform hover:scale-105 active:scale-95 shadow-lg"
                      >
                        Submit Review
                      </button>
                      <button
                        onClick={() => setReviewFormItem(null)}
                        className="bg-white/10 text-foreground px-5 py-2.5 rounded-full text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4-Step Return Form Wizard Modal */}
              {returnFormItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="liquid-glass max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Maison Returns desk</span>
                        <h3 className="font-serif text-xl mt-1">Return: {returnFormItem.productName}</h3>
                      </div>
                      <button onClick={() => setReturnFormItem(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Step Indicators */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[9px] uppercase tracking-widest font-bold text-muted-foreground pb-2 border-b border-white/5">
                      <span className={returnStep >= 1 ? "text-accent" : ""}>Step 1: Details</span>
                      <span className={returnStep >= 2 ? "text-accent" : ""}>Step 2: Evidence</span>
                      <span className={returnStep >= 3 ? "text-accent" : ""}>Step 3: Refund</span>
                    </div>

                    <div className="space-y-4 min-h-[160px]">
                      {/* Step 1: Select Reason & Description */}
                      {returnStep === 1 && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Select Return Reason</label>
                            <select
                              value={returnReason}
                              onChange={e => setReturnReason(e.target.value)}
                              className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl text-xs outline-none text-white focus:border-accent"
                            >
                              <option value="Product arrived damaged">Product arrived damaged</option>
                              <option value="Wrong item delivered">Wrong item delivered</option>
                              <option value="Wrong size delivered">Wrong size delivered</option>
                              <option value="Too small">Too small</option>
                              <option value="Too large">Too large</option>
                              <option value="Product color different from website">Product color different from website</option>
                              <option value="Poor quality material">Poor quality material</option>
                              <option value="No longer needed">No longer needed</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Description (Optional)</label>
                              <span className="text-[10px] font-mono text-muted-foreground">{returnDesc.length} / 500 characters</span>
                            </div>
                            <textarea
                              maxLength={500}
                              placeholder="Please explain the issue in detail..."
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs outline-none focus:border-accent h-24 text-white resize-none"
                              value={returnDesc}
                              onChange={e => setReturnDesc(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 2: Evidence uploads */}
                      {returnStep === 2 && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Evidence photos (up to 5 - Optional)</label>
                            <div className="flex gap-2 flex-wrap items-center">
                              {returnPhotos.map((pUrl, idx) => (
                                <div key={idx} className="relative w-12 h-16 border border-white/10 rounded-lg overflow-hidden bg-zinc-900">
                                  <img src={pUrl} className="w-full h-full object-cover" />
                                  <button
                                    onClick={() => setReturnPhotos(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-400 hover:text-rose-500 transition-opacity opacity-0 hover:opacity-100"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              {returnPhotos.length < 5 && (
                                <button
                                  onClick={() => {
                                    setReturnFileLoading(true);
                                    setTimeout(() => {
                                      const mockPhotos = [
                                        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=150&h=200&q=80",
                                        "https://images.unsplash.com/photo-1496360166961-10a51d5f367a?auto=format&fit=crop&w=150&h=200&q=80",
                                        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=150&h=200&q=80",
                                        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=150&h=200&q=80"
                                      ];
                                      const randomMock = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
                                      setReturnPhotos(prev => [...prev, randomMock]);
                                      setReturnFileLoading(false);
                                      toast.success("Simulated image evidence added successfully.");
                                    }, 800);
                                  }}
                                  className="w-12 h-16 border-2 border-dashed border-white/20 hover:border-accent hover:bg-white/5 rounded-lg flex items-center justify-center text-muted-foreground text-xs transition-all"
                                >
                                  {returnFileLoading ? "..." : "+"}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Evidence Video (1 video max - Optional)</label>
                            {returnVideo ? (
                              <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                <span className="text-[10px] text-accent font-mono truncate max-w-[200px]">{returnVideo}</span>
                                <button onClick={() => setReturnVideo("")} className="text-rose-400 hover:text-rose-500">Remove</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setReturnVideo(`curation_evidence_${Date.now()}.mp4`);
                                  toast.success("Simulated video evidence added successfully.");
                                }}
                                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-foreground text-center"
                              >
                                Simulate Video Evidence Upload
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Step 3: Refund Method */}
                      {returnStep === 3 && (
                        <div className="space-y-4">
                          <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">Choose Refund Settlement Method</label>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {[
                              "Original Payment Method",
                              "ReeVibes Wallet",
                              "Exchange Product",
                              "Store Credit"
                            ].map((method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setReturnRefundMethod(method)}
                                className={`p-4 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center ${
                                  returnRefundMethod === method
                                    ? "border-accent bg-accent/15 text-white"
                                    : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"
                                }`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      {returnStep > 1 && (
                        <button
                          onClick={() => setReturnStep(prev => prev - 1)}
                          className="bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 rounded-full text-xs text-foreground font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                      )}
                      {returnStep < 3 ? (
                        <button
                          onClick={() => setReturnStep(prev => prev + 1)}
                          className="flex-1 bg-white text-black py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all text-center"
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            requestReturn({
                              orderId: returnFormItem.orderId,
                              productId: returnFormItem.productId,
                              productName: returnFormItem.productName,
                              customerId: user.id,
                              customerName: `${user.firstName} ${user.lastName}`,
                              reason: returnReason,
                              comment: returnDesc.trim(),
                              images: returnPhotos,
                              videos: returnVideo ? [returnVideo] : [],
                              refundAmount: Number(String(returnFormItem.price).replace(/[^0-9.]/g, "")) * returnFormItem.qty,
                              selectedSize: returnFormItem.selectedSize,
                              qty: returnFormItem.qty,
                              refundMethod: returnRefundMethod
                            });
                            toast.success("Return request logged with Maison operations team!");
                            setReturnFormItem(null);
                            navigate({ to: "/account", search: { tab: "returns" } });
                          }}
                          className="flex-1 bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95"
                        >
                          Submit Return Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Returns & Refund status section */}
          {activeTab === "returns" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-8">
              <h2 className="font-serif text-2xl border-b border-white/10 pb-4">Returns Tracker & Refund Status</h2>
              
              <div className="space-y-8">
                {state.returns.filter(r => r.customerId === user.id).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center py-6">No returns logged or in progress.</p>
                ) : (
                  state.returns.filter(r => r.customerId === user.id).map(r => {
                    const RETURN_TIMELINE_STEPS = [
                      "Return Requested",
                      "Under Review",
                      "Return Approved",
                      "Pickup Scheduled",
                      "Item Received",
                      "Refund Processed",
                      "Refund Completed"
                    ];
                    
                    const isRejected = r.status === "Rejected";
                    const currentStepIndex = RETURN_TIMELINE_STEPS.indexOf(r.status);
                    
                    return (
                      <div key={r.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6 shadow-md">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
                          <div>
                            <span className="font-mono text-xs font-bold text-accent">{r.id}</span>
                            <span className="text-[10px] text-muted-foreground ml-3 font-mono">Order: {r.orderId}</span>
                          </div>
                          <StatusChip
                            status={r.status}
                            tone={isRejected ? "danger" : r.status === "Refund Completed" ? "success" : "warn"}
                          />
                        </div>

                        <div className="text-xs space-y-1 text-muted-foreground leading-relaxed">
                          <div><span className="font-bold text-foreground">Item:</span> {r.productName} ({r.selectedSize || "M"})</div>
                          <div><span className="font-bold text-foreground">Refund Method:</span> {r.refundMethod || "Original Payment Method"}</div>
                          <div><span className="font-bold text-foreground">Reason:</span> {r.reason}</div>
                          <div><span className="font-bold text-foreground">Comments:</span> {r.comment}</div>
                        </div>

                        {/* Return Timeline Step Chart */}
                        {!isRejected ? (
                          <div className="space-y-4">
                            <h4 className="text-[10px] uppercase tracking-widest text-accent font-bold">Return Status Timeline</h4>
                            
                            {/* Horizontal visual progress bars */}
                            <div className="relative pt-2 pb-6">
                              <div className="absolute top-4 left-1 right-1 h-0.5 bg-white/10 z-0 rounded-full" />
                              <div
                                className="absolute top-4 left-1 h-0.5 bg-accent transition-all duration-500 z-0 rounded-full"
                                style={{
                                  width: `${Math.max(0, (currentStepIndex / (RETURN_TIMELINE_STEPS.length - 1)) * 100)}%`
                                }}
                              />
                              <div className="relative z-10 flex justify-between gap-1">
                                {RETURN_TIMELINE_STEPS.map((step, idx) => {
                                  const isCompleted = idx <= currentStepIndex;
                                  const isCurrent = idx === currentStepIndex;
                                  return (
                                    <div key={step} className="flex flex-col items-center flex-1 max-w-[80px]">
                                      <div
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                          isCurrent
                                            ? "border-accent bg-accent text-white scale-110 shadow-[0_0_10px_rgba(212,175,55,0.5)] animate-pulse"
                                            : isCompleted
                                              ? "border-accent bg-accent text-white"
                                              : "border-white/20 bg-zinc-950 text-muted-foreground"
                                        }`}
                                      >
                                        {isCompleted && !isCurrent ? (
                                          <Check className="w-2.5 h-2.5" />
                                        ) : (
                                          <span className="text-[7px] font-mono">{idx + 1}</span>
                                        )}
                                      </div>
                                      <span
                                        className={`text-[7px] text-center mt-2 font-semibold uppercase tracking-wider block transition-colors leading-tight ${
                                          isCurrent ? "text-accent" : isCompleted ? "text-white" : "text-muted-foreground"
                                        }`}
                                      >
                                        {step}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-xs text-rose-300">
                            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                            <div>
                              <div className="font-bold uppercase tracking-wider">Return Request Rejected</div>
                              <p className="mt-1 text-rose-400 font-medium">Rejection Reason: {r.rejectionReason || "Insufficient evidence"}</p>
                            </div>
                          </div>
                        )}

                        {/* Detailed Refund Status Section */}
                        <div className="pt-4 border-t border-white/5 text-xs space-y-3">
                          <h4 className="font-bold text-accent uppercase tracking-wider text-[10px]">Detailed Refund Statement</h4>
                          <div className="grid grid-cols-2 gap-4 border border-white/5 bg-white/[0.02] p-4 rounded-2xl">
                            <div className="space-y-2">
                              <div>
                                <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Refund Amount</span>
                                <span className="font-bold text-white text-sm">₹{r.refundAmount.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Expected Settlement Date</span>
                                <span className="font-semibold text-white">
                                  {r.status === "Refund Completed" ? "Completed" : r.expectedCreditDate || "Expected 3-5 days after approval"}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Ref Transaction ID</span>
                                <span className="font-mono text-white text-[10px] break-all">{r.refundTransactionId || "N/A"}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Settlement Date</span>
                                <span className="font-semibold text-white">{r.refundDate || "Pending Payout"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Tab: Wallet */}
          {activeTab === "wallet" && (
            <div className="liquid-glass border border-white/15 p-8 rounded-3xl space-y-4">
              <h2 className="font-serif text-2xl">My Luxury Wallet</h2>
              <div className="bg-gradient-to-br from-accent/20 to-black/40 border border-accent/20 p-6 rounded-2xl max-w-sm space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Available Credits</div>
                <div className="font-serif text-3xl font-bold text-accent">₹{(state.wallets[user.id] ?? 0).toLocaleString()}</div>
              </div>
            </div>
          )}



        </main>
      </div>

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

function WishlistItemCard({
  p,
  user,
  toggleShopWishlist,
  addToShopCart,
  triggerPopup
}: {
  p: any;
  user: any;
  toggleShopWishlist: any;
  addToShopCart: any;
  triggerPopup: any;
}) {
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  const ensureRupees = (val: any) => {
    if (val === undefined || val === null) return "";
    const clean = String(val).trim();
    return clean.startsWith("₹") ? clean : `₹${clean}`;
  };

  const handleRemove = () => {
    toggleShopWishlist(user.id, p.id);
    triggerPopup(
      `${p.name} removed from wishlist.`,
      () => toggleShopWishlist(user.id, p.id),
      `${p.name} added to wishlist!`,
      () => toggleShopWishlist(user.id, p.id),
      `${p.name} removed from wishlist.`
    );
  };

  const availableSizes = p.sizes || ["S", "M", "L", "XL"];

  return (
    <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl relative group overflow-hidden">
      <Link to="/product/$productId" params={{ productId: p.id }} className="block shrink-0">
        <img src={p.image} className="w-20 h-24 object-cover rounded-xl border border-white/10 hover:opacity-85 transition-opacity" />
      </Link>
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="relative pr-8">
          <div className="text-[10px] text-muted-foreground">{p.house}</div>
          <Link
            to="/product/$productId"
            params={{ productId: p.id }}
            className="hover:text-accent transition-colors block mt-0.5"
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            <h3 className="font-serif text-sm font-semibold truncate">{p.name}</h3>
          </Link>
          
          {/* Price Row */}
          <div className="text-accent text-xs font-bold mt-1">{ensureRupees(p.price)}</div>

          {/* Sizes Row (Slides down on title hover, static) */}
          <div className={`transition-all duration-300 overflow-hidden ${isTitleHovered ? "h-6 opacity-100 mt-1" : "h-0 opacity-0"}`}>
            <div className="flex items-center gap-1.5 w-full">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground shrink-0">Sizes:</span>
              <div className="flex gap-1.5 flex-wrap">
                {availableSizes.map((sz: string, idx: number) => (
                  <span key={idx} className="text-[9px] bg-white/10 text-white border border-white/5 px-1.5 py-0.5 rounded font-mono">
                    {sz}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              addToShopCart({ productId: p.id, name: p.name, house: p.house, price: p.price, image: p.image, selectedSize: "M" });
              triggerPopup(
                `${p.name} (M) added to cart!`,
                () => {},
                `${p.name} removed from cart.`,
                () => {},
                `${p.name} added to cart!`
              );
            }}
            className="bg-accent text-white px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider hover:bg-accent/90 transition-all cursor-pointer"
          >
            Add Cart
          </button>
        </div>
      </div>

      {/* Heart Icon at Top Right */}
      <button
        onClick={handleRemove}
        className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-accent/20 rounded-full transition-colors group/btn cursor-pointer"
        title="Remove from Wishlist"
      >
        <Heart className="w-4 h-4 fill-rose-500 text-rose-500 group-hover/btn:scale-110 transition-transform" />
      </button>
    </div>
  );
}
