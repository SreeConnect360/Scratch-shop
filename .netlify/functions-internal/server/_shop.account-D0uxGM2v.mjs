import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as usePortal, k as useShopNotification, a as useCartTotal, w as Route$s, P as PRODUCTS, M as Map, x as MapMarker, y as MarkerContent, g as StatusChip } from "./_ssr/router-C0nupAs3.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/react-oauth__google.mjs";
import "./_libs/maplibre-gl.mjs";
import { a7 as User, as as ListOrdered, a6 as Heart, l as Tag, g as MapPin, an as RotateCcw, W as Wallet, at as LogOut, V as Check, T as Trash2, X, s as Star, Q as ArrowLeft, au as TriangleAlert } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "node:fs";
import "node:path";
import "./_libs/xlsx.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-alert-dialog.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/framer-motion.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
import "./_libs/zod.mjs";
function ShopDashboard() {
  const {
    state,
    updateUser,
    addAddress,
    removeAddress,
    updateAddress,
    setMajorAddress,
    toggleShopWishlist,
    createOrder,
    addToShopCart,
    requestReturn,
    markNotificationsRead,
    addReview,
    signOut
  } = usePortal();
  const {
    triggerPopup
  } = useShopNotification();
  useCartTotal();
  const {
    tab
  } = Route$s.useSearch();
  const navigate = useNavigate();
  const user = state.user;
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [showSaveSuccessPopup, setShowSaveSuccessPopup] = reactExports.useState(false);
  const [editingAddrIndex, setEditingAddrIndex] = reactExports.useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = reactExports.useState(false);
  const [mapCenter, setMapCenter] = reactExports.useState([77.5946, 12.9716]);
  const [markerPos, setMarkerPos] = reactExports.useState(null);
  const [isLocating, setIsLocating] = reactExports.useState(false);
  const handleReverseGeocode = async (lng, lat) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: {
          "User-Agent": "ReeVibes-Shop-Portal"
        }
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
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const {
        longitude,
        latitude
      } = position.coords;
      setMapCenter([longitude, latitude]);
      setMarkerPos([longitude, latitude]);
      setIsLocating(false);
      handleReverseGeocode(longitude, latitude);
    }, (error) => {
      setIsLocating(false);
      toast.error("Failed to detect location. Please search or point manually.");
    }, {
      enableHighAccuracy: true,
      timeout: 1e4
    });
  };
  const handleGeocodeAddress = async () => {
    const query = [addrStreet, addrCity, addrDistrict, addrState, addrPincode].filter(Boolean).join(", ");
    if (!query) {
      toast.error("Please enter some address details first.");
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: {
          "User-Agent": "ReeVibes-Shop-Portal"
        }
      });
      const data = await res.json();
      if (data && data[0]) {
        const {
          lon,
          lat
        } = data[0];
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
  const [profileForm, setProfileForm] = reactExports.useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    dob: user?.dob || "",
    country: user?.country || ""
  });
  reactExports.useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        dob: user.dob || "",
        country: user.country || ""
      });
    }
  }, [user]);
  const [addrName, setAddrName] = reactExports.useState("");
  const [addrPhone, setAddrPhone] = reactExports.useState("");
  const [addrPincode, setAddrPincode] = reactExports.useState("");
  const [addrStreet, setAddrStreet] = reactExports.useState("");
  const [addrCity, setAddrCity] = reactExports.useState("");
  const [addrDistrict, setAddrDistrict] = reactExports.useState("");
  const [addrState, setAddrState] = reactExports.useState("");
  const [isFetchingPin, setIsFetchingPin] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user) {
      setAddrName((prev) => prev || `${user.firstName} ${user.lastName}`.trim());
      setAddrPhone((prev) => prev || user.phone || "");
    }
  }, [user]);
  reactExports.useEffect(() => {
    if (addrPincode.trim().length === 6 && /^\d+$/.test(addrPincode.trim())) {
      setIsFetchingPin(true);
      fetch(`https://api.postalpincode.in/pincode/${addrPincode.trim()}`).then((res) => res.json()).then((data) => {
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
          const office = data[0].PostOffice[0];
          setAddrCity(office.Name || office.Block || "");
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
          const query = `${office.Name || ""}, ${office.District || ""}, ${office.State || ""} - ${addrPincode.trim()}`;
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
            headers: {
              "User-Agent": "ReeVibes-Shop-Portal"
            }
          }).then((res) => res.json()).then((d) => {
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
      }).catch((err) => {
        console.error(err);
        toast.error("Error fetching pincode details. Please fill manually.");
      }).finally(() => {
        setIsFetchingPin(false);
      });
    }
  }, [addrPincode]);
  const userAddresses = user ? state.addresses?.[user.id] || [] : [];
  const wishlistIds = user ? state.shopWishlist?.[user.id] || state.shopWishlist?.[user.id.toLowerCase()] || state.shopWishlist?.[user.id.toUpperCase()] || [] : [];
  const wishlistItems = (state.products || PRODUCTS).filter((p) => wishlistIds.map(String).includes(String(p.id)));
  const userOrders = user ? state.orders?.[user.id] || [] : [];
  const [checkoutAddress, setCheckoutAddress] = reactExports.useState("");
  const [appliedCoupon, setAppliedCoupon] = reactExports.useState("");
  const [discountAmount, setDiscountAmount] = reactExports.useState(0);
  const [reviewFormItem, setReviewFormItem] = reactExports.useState(null);
  const [reviewText, setReviewText] = reactExports.useState("");
  const [reviewRating, setReviewRating] = reactExports.useState(5);
  reactExports.useEffect(() => {
    if (user && state.majorAddresses?.[user.id]) {
      const major = state.majorAddresses[user.id];
      if (userAddresses.includes(major)) {
        setCheckoutAddress(major);
      }
    } else if (userAddresses.length > 0 && !checkoutAddress) {
      setCheckoutAddress(userAddresses[0]);
    }
  }, [user, state.majorAddresses, userAddresses]);
  const [returnFormItem, setReturnFormItem] = reactExports.useState(null);
  const [returnStep, setReturnStep] = reactExports.useState(1);
  const [returnReason, setReturnReason] = reactExports.useState("Product arrived damaged");
  const [returnDesc, setReturnDesc] = reactExports.useState("");
  const [returnPhotos, setReturnPhotos] = reactExports.useState([]);
  const [returnVideo, setReturnVideo] = reactExports.useState("");
  const [returnRefundMethod, setReturnRefundMethod] = reactExports.useState("Original Payment Method");
  const [returnFileLoading, setReturnFileLoading] = reactExports.useState(false);
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[70vh] flex items-center justify-center px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass p-8 max-w-md w-full border border-white/20 rounded-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Shop Members Only" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-serif text-3xl", children: "Sign in to continue." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs text-muted-foreground leading-relaxed", children: "Your shopping account is reserved for registered members of the maison." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex gap-4 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "bg-foreground text-background px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-colors", children: "Sign In" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "border border-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-foreground hover:text-background transition-colors", children: "Register" })
      ] })
    ] }) });
  }
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateUser(user.id, profileForm);
    setShowSaveSuccessPopup(true);
    setIsEditing(false);
  };
  const handleAddAddress = (e) => {
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
    setAddrPincode("");
    setAddrStreet("");
    setAddrCity("");
    setAddrDistrict("");
    setAddrState("");
    setMarkerPos(null);
  };
  const parseSingleAddress = (addrStr) => {
    try {
      if (addrStr.trim().startsWith("{")) {
        return JSON.parse(addrStr);
      }
    } catch (e) {
    }
    return {
      name: `${user.firstName} ${user.lastName}`,
      address: addrStr,
      phone: user.phone || ""
    };
  };
  const handleEditAddressClick = (addr, index) => {
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
    const query = [street, city, district, stateVal, pincode].filter(Boolean).join(", ");
    if (query) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: {
          "User-Agent": "ReeVibes-Shop-Portal"
        }
      }).then((res) => res.json()).then((data) => {
        if (data && data[0]) {
          const lngNum = parseFloat(data[0].lon);
          const latNum = parseFloat(data[0].lat);
          setMapCenter([lngNum, latNum]);
          setMarkerPos([lngNum, latNum]);
        }
      }).catch(console.error);
    }
  };
  const activeTab = tab || "profile";
  const isProfileTab = activeTab === "dashboard" || activeTab === "profile";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-16 py-12 space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Maison Shop Membership" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-2 font-serif text-3xl md:text-5xl", children: [
          "Welcome, ",
          user.firstName,
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-xs uppercase tracking-widest font-bold text-accent hover:underline", children: "Return to Curation" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-8 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "w-full lg:w-72 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/10 rounded-3xl p-6 space-y-6 bg-white/5 shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-white/10 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase tracking-[0.2em] text-accent font-bold", children: "Maison Member" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-serif text-xl text-foreground font-semibold mt-1 truncate", children: [
            user.firstName,
            " ",
            user.lastName
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col gap-1.5", children: [{
          id: "profile",
          label: "Profile",
          icon: User
        }, {
          id: "orders",
          label: "My Orders",
          icon: ListOrdered,
          count: userOrders.length
        }, {
          id: "wishlist",
          label: "Wishlist Curation",
          icon: Heart,
          count: wishlistIds.length
        }, {
          id: "coupons",
          label: "Maison Coupons",
          icon: Tag,
          count: state.coupons.length
        }, {
          id: "addresses",
          label: "Address",
          icon: MapPin,
          count: userAddresses.length
        }, {
          id: "returns",
          label: "Returns & Refunds",
          icon: RotateCcw
        }, {
          id: "wallet",
          label: "Wallet",
          icon: Wallet
        }].map((t) => {
          const isActive = t.id === "profile" ? activeTab === "profile" || activeTab === "dashboard" : activeTab === t.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
            to: "/account",
            search: {
              tab: t.id
            }
          }), className: `flex items-center justify-between w-full text-left text-[10px] uppercase tracking-wider font-bold py-3.5 px-5 rounded-2xl transition-all duration-300 cursor-pointer border ${isActive ? "bg-accent/15 border-accent text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]" : "border-transparent hover:bg-white/5 hover:border-white/5 text-muted-foreground hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: `w-4 h-4 ${isActive ? "text-accent" : "text-muted-foreground"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.label })
            ] }),
            t.count !== void 0 && t.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive ? "bg-accent text-white" : "bg-white/10 text-muted-foreground"}`, children: t.count })
          ] }, t.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 w-full space-y-6", children: [
        isProfileTab && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-center md:text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl md:text-2xl", children: "Curation Completeness" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-md", children: "Complete your personal styling information to receive curated collections and customized seasonal sizing recommendation updates." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-20 h-20 flex items-center justify-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-full h-full transform -rotate-90", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "40", cy: "40", r: "34", className: "stroke-white/10 fill-none", strokeWidth: "6" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "40", cy: "40", r: "34", className: "stroke-accent fill-none transition-all duration-1000", strokeWidth: "6", strokeDasharray: "213.6", strokeDashoffset: 213.6 - 213.6 * profileCompletionPercentage / 100 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute text-sm font-bold", children: [
                  profileCompletionPercentage,
                  "%"
                ] })
              ] }),
              !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsEditing(true), className: "text-xs uppercase bg-accent text-white px-5 py-2.5 rounded-full font-bold tracking-wider hover:bg-accent/90 transition-all cursor-pointer", children: "Edit Profile" })
            ] })
          ] }),
          !isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/10 p-6 rounded-3xl space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg text-accent", children: "Personal Dossier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs leading-normal", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-white/5 pb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "First Name:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: user.firstName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-white/5 pb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Last Name:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: user.lastName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-white/5 pb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Email:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: user.email })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-white/5 pb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Phone:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: user.phone || "—" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/10 p-6 rounded-3xl space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg text-accent", children: "Maison Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs leading-normal", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-white/5 pb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Gender:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: user.gender || "—" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-white/5 pb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "DOB:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: user.dob || "—" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-white/5 pb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Country:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: user.country || "—" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-white/5 pb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Rank/Status:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-bold uppercase tracking-wider text-[9px]", children: user.roles?.join(" / ") || "GENERAL" })
                ] })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/15 p-8 rounded-3xl space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Edit Curation Profile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setIsEditing(false), className: "text-xs uppercase font-bold text-muted-foreground hover:text-foreground transition-colors border border-white/10 hover:border-white/20 px-4 py-1.5 rounded-full cursor-pointer", children: "Cancel" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdateProfile, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "First Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: profileForm.firstName, onChange: (e) => setProfileForm({
                    ...profileForm,
                    firstName: e.target.value
                  }), className: "w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2", required: true })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Last Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: profileForm.lastName, onChange: (e) => setProfileForm({
                    ...profileForm,
                    lastName: e.target.value
                  }), className: "w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2", required: true })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Email Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: profileForm.email, onChange: (e) => setProfileForm({
                  ...profileForm,
                  email: e.target.value
                }), className: "w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2", required: true })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Phone Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: profileForm.phone, onChange: (e) => setProfileForm({
                  ...profileForm,
                  phone: e.target.value
                }), className: "w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Gender" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: profileForm.gender, onChange: (e) => setProfileForm({
                    ...profileForm,
                    gender: e.target.value
                  }), className: "w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-zinc-950", value: "", disabled: true, children: "— Select Gender —" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-zinc-950", value: "Female", children: "Female" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-zinc-950", value: "Male", children: "Male" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-zinc-950", value: "Other", children: "Other" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Date of Birth" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: profileForm.dob, onChange: (e) => setProfileForm({
                    ...profileForm,
                    dob: e.target.value
                  }), className: "w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Country" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: profileForm.country, onChange: (e) => setProfileForm({
                  ...profileForm,
                  country: e.target.value
                }), className: "w-full bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none focus:border-accent rounded-full text-foreground mt-2" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "bg-accent hover:bg-accent/90 text-white rounded-full px-6 py-3 w-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-md mt-4 cursor-pointer", children: "Save Profile Details" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass border border-rose-500/15 p-6 rounded-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-center sm:text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4.5 h-4.5 text-rose-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-base", children: "Sign Out" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Log out of your account on this device." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowLogoutConfirm(true), className: "text-xs uppercase font-bold tracking-widest px-6 py-2.5 rounded-full border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer", children: "Logout" })
          ] }) }),
          showLogoutConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass bg-background/95 border border-rose-500/20 max-w-sm w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 rounded-3xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-5 h-5 text-rose-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg", children: "Confirm Logout" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "You will be signed out of your account." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Are you sure you want to log out? You'll need to sign in again to access your orders, wishlist, and wallet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowLogoutConfirm(false), className: "text-xs uppercase font-bold tracking-wider px-5 py-2 rounded-full border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-all cursor-pointer", children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                signOut();
                setShowLogoutConfirm(false);
                toast.success("You have been logged out successfully.");
                navigate({
                  to: "/login"
                });
              }, className: "text-xs uppercase font-bold tracking-wider px-5 py-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md cursor-pointer", children: "Yes, Logout" })
            ] })
          ] }) })
        ] }),
        activeTab === "addresses" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/15 p-8 rounded-3xl space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Multiple Delivery Destinations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: userAddresses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "No addresses saved yet." }) : userAddresses.map((addr, idx) => {
            const isMajor = state.majorAddresses?.[user.id] === addr;
            const parsed = parseSingleAddress(addr);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex justify-between items-center p-4 rounded-2xl bg-white/5 border transition-all ${isMajor ? "border-accent/50 shadow-[0_0_12px_rgba(212,175,55,0.15)] bg-accent/5" : "border-white/10"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 text-xs leading-relaxed flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-start", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: `w-4 h-4 shrink-0 mt-0.5 ${isMajor ? "text-accent" : "text-muted-foreground"}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: parsed.name }),
                    isMajor && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-accent/20 text-accent text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold ml-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-2.5 h-2.5" }),
                      " Major Address"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: parsed.address }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-accent/80 font-mono mt-1", children: [
                    "Phone: ",
                    parsed.phone
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleEditAddressClick(addr, idx), className: "text-[10px] uppercase tracking-widest font-bold text-accent hover:text-white transition-colors px-3 py-1.5 rounded-full border border-accent/20 hover:border-accent cursor-pointer", children: "Edit" }),
                !isMajor && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                  setMajorAddress(user.id, addr);
                  toast.success("Marked as primary shipping destination!");
                }, className: "text-[10px] uppercase tracking-widest font-bold text-accent hover:text-white transition-colors px-3 py-1.5 rounded-full border border-accent/20 hover:border-accent cursor-pointer", children: "Mark as Major" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeAddress(user.id, idx), className: "text-rose-400 hover:text-rose-500 p-2 cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
              ] })
            ] }, idx);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddAddress, className: "pt-6 border-t border-white/10 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg text-accent", children: editingAddrIndex !== null ? "Edit Delivery Destination" : "Add New Delivery Destination" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 flex flex-col gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pin Location on Map" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent/80 font-mono text-[9px]", children: "Drag pin to refine" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[280px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_4px_24px_rgba(212,175,55,0.05)] bg-white/5 backdrop-blur-md", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { center: mapCenter, zoom: 14, children: markerPos && /* @__PURE__ */ jsxRuntimeExports.jsx(MapMarker, { draggable: true, longitude: markerPos[0], latitude: markerPos[1], onDrag: (lngLat) => {
                    setMarkerPos([lngLat.lng, lngLat.lat]);
                    handleReverseGeocode(lngLat.lng, lngLat.lat);
                  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkerContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute w-8 h-8 rounded-full bg-accent/20 border border-accent animate-ping" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-5 h-5 rounded-full bg-accent border-2 border-white shadow-[0_0_10px_rgba(212,175,55,0.8)] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-white" }) })
                  ] }) }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleDetectLocation, disabled: isLocating, className: "absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-accent border border-accent/30 hover:border-accent px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold backdrop-blur-md transition-all cursor-pointer shadow-lg disabled:opacity-50", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: `w-3.5 h-3.5 ${isLocating ? "animate-bounce text-accent" : "text-accent"}` }),
                    isLocating ? "Locating..." : "Detect Location"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleGeocodeAddress, className: "w-full bg-white/5 hover:bg-white/10 text-accent border border-accent/20 hover:border-accent/40 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer", children: "Locate Entered Address on Map" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Recipient Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "text", placeholder: "e.g. Sree Connect", className: "w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5", value: addrName, onChange: (e) => setAddrName(e.target.value) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Contact Phone" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "text", placeholder: "e.g. +91 98765 43210", className: "w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5", value: addrPhone, onChange: (e) => setAddrPhone(e.target.value) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "India Pin Code" }),
                      isFetchingPin && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-accent animate-pulse", children: "Fetching details..." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "text", maxLength: 6, placeholder: "e.g. 560038", className: "w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5", value: addrPincode, onChange: (e) => setAddrPincode(e.target.value.replace(/\D/g, "")) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "City / Town" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "text", placeholder: "City Name", className: "w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5", value: addrCity, onChange: (e) => setAddrCity(e.target.value) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "District" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "District", className: "w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5", value: addrDistrict, onChange: (e) => setAddrDistrict(e.target.value) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "State" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "text", placeholder: "State Name", className: "w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5", value: addrState, onChange: (e) => setAddrState(e.target.value) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Street / Detailed Address" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "text", placeholder: "Apartment/Flat No, Area, Street Name", className: "w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs outline-none focus:border-accent rounded-full text-foreground mt-1.5", value: addrStreet, onChange: (e) => setAddrStreet(e.target.value) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "bg-accent text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-accent/90 cursor-pointer", children: editingAddrIndex !== null ? "Save Changes" : "Add Destination" }),
              editingAddrIndex !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setEditingAddrIndex(null);
                setAddrPincode("");
                setAddrStreet("");
                setAddrCity("");
                setAddrDistrict("");
                setAddrState("");
                setMarkerPos(null);
                toast.info("Edit cancelled.");
              }, className: "border border-white/10 hover:bg-white/10 text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer", children: "Cancel Edit" })
            ] })
          ] })
        ] }),
        activeTab === "coupons" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/15 p-8 rounded-3xl space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Available Maison Coupons" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: state.coupons.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-accent/40 bg-accent/5 p-5 flex flex-col justify-between rounded-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-lg font-bold tracking-widest text-accent", children: c.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs mt-1 font-semibold", children: [
                c.discount,
                "% Discount for Curation Carts"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground uppercase tracking-widest mt-4", children: [
              "Expiry: ",
              c.expiryDate
            ] })
          ] }, c.code)) })
        ] }),
        activeTab === "wishlist" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/15 p-8 rounded-3xl space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Isolated Shop Wishlist" }),
          wishlistItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "Your shop wishlist is empty." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: wishlistItems.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(WishlistItemCard, { p, user, toggleShopWishlist, addToShopCart, triggerPopup }, p.id)) })
        ] }),
        activeTab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/15 p-8 rounded-3xl space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "Maison Orders Tracker" }),
          userOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "No orders found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: userOrders.map((order) => {
            const groupedItems = [];
            (order.items || []).forEach((item) => {
              const existing = groupedItems.find((x) => x.productId === item.productId);
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
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-semibold text-accent", children: [
                  order.id,
                  " · ",
                  order.date
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: order.status, tone: order.status === "Delivered" ? "success" : "warn" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: groupedItems.map((groupedItem) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row justify-between items-start gap-4 text-xs border-b border-white/[0.03] pb-4 last:border-0 last:pb-0 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
                  productId: groupedItem.productId
                }, className: "block shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: groupedItem.image, className: "w-12 h-15 object-cover rounded-md border border-white/10 hover:opacity-85 transition-opacity" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
                    productId: groupedItem.productId
                  }, className: "font-semibold text-white hover:text-accent transition-colors block text-sm font-serif truncate", children: groupedItem.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: groupedItem.house }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-1.5 max-w-xl", children: groupedItem.variants.map((v, vIdx) => {
                    const hasBeenReturned = state.returns?.some((r) => r.orderId === order.id && r.productId === groupedItem.productId && r.selectedSize === v.size);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 bg-white/5 p-2 rounded-xl border border-white/5 w-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] uppercase tracking-widest font-bold bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/10", children: [
                          "Size: ",
                          v.size
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                          "Qty: ",
                          v.qty
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 ml-auto", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold font-mono text-xs text-foreground", children: v.price }),
                        order.status === "Delivered" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                            setReviewFormItem({
                              productId: groupedItem.productId,
                              orderId: order.id
                            });
                            setReviewText("");
                            setReviewRating(5);
                          }, className: "bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-full transition-all", children: "Review" }),
                          !hasBeenReturned ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
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
                          }, className: "bg-accent/20 hover:bg-accent hover:text-white border border-accent/20 text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-accent transition-colors cursor-pointer", children: "Return" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full", children: "Returned" })
                        ] })
                      ] })
                    ] }, vIdx);
                  }) })
                ] })
              ] }) }, groupedItem.productId)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-2 border-t border-white/10 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Paid:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-accent", children: [
                  "₹",
                  order.total.toLocaleString()
                ] })
              ] })
            ] }, order.id);
          }) }),
          reviewFormItem && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass max-w-md w-full p-6 md:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Write verified Review" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReviewFormItem(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 justify-center py-2", children: [1, 2, 3, 4, 5].map((stars) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setReviewRating(stars), className: "text-amber-400 hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-6 h-6 ${stars <= reviewRating ? "fill-current" : "text-zinc-600"}` }) }, stars)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, placeholder: "Share your experience styling this piece...", className: "w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs outline-none focus:border-accent h-28 text-white placeholder:text-muted-foreground/50 transition-colors", value: reviewText, onChange: (e) => setReviewText(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
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
              }, className: "flex-1 bg-accent text-white py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent/90 transition-transform hover:scale-105 active:scale-95 shadow-lg", children: "Submit Review" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReviewFormItem(null), className: "bg-white/10 text-foreground px-5 py-2.5 rounded-full text-xs", children: "Cancel" })
            ] })
          ] }) }),
          returnFormItem && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest text-accent font-bold", children: "Maison Returns desk" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-serif text-xl mt-1", children: [
                  "Return: ",
                  returnFormItem.productName
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReturnFormItem(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-[9px] uppercase tracking-widest font-bold text-muted-foreground pb-2 border-b border-white/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: returnStep >= 1 ? "text-accent" : "", children: "Step 1: Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: returnStep >= 2 ? "text-accent" : "", children: "Step 2: Evidence" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: returnStep >= 3 ? "text-accent" : "", children: "Step 3: Refund" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 min-h-[160px]", children: [
              returnStep === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Select Return Reason" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: returnReason, onChange: (e) => setReturnReason(e.target.value), className: "w-full bg-zinc-900 border border-white/10 p-3 rounded-xl text-xs outline-none text-white focus:border-accent", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Product arrived damaged", children: "Product arrived damaged" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Wrong item delivered", children: "Wrong item delivered" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Wrong size delivered", children: "Wrong size delivered" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Too small", children: "Too small" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Too large", children: "Too large" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Product color different from website", children: "Product color different from website" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Poor quality material", children: "Poor quality material" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "No longer needed", children: "No longer needed" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Other", children: "Other" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Description (Optional)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-muted-foreground", children: [
                      returnDesc.length,
                      " / 500 characters"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { maxLength: 500, placeholder: "Please explain the issue in detail...", className: "w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs outline-none focus:border-accent h-24 text-white resize-none", value: returnDesc, onChange: (e) => setReturnDesc(e.target.value) })
                ] })
              ] }),
              returnStep === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Evidence photos (up to 5 - Optional)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap items-center", children: [
                    returnPhotos.map((pUrl, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-12 h-16 border border-white/10 rounded-lg overflow-hidden bg-zinc-900", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: pUrl, className: "w-full h-full object-cover" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReturnPhotos((prev) => prev.filter((_, i) => i !== idx)), className: "absolute inset-0 bg-black/60 flex items-center justify-center text-rose-400 hover:text-rose-500 transition-opacity opacity-0 hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
                    ] }, idx)),
                    returnPhotos.length < 5 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                      setReturnFileLoading(true);
                      setTimeout(() => {
                        const mockPhotos = ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=150&h=200&q=80", "https://images.unsplash.com/photo-1496360166961-10a51d5f367a?auto=format&fit=crop&w=150&h=200&q=80", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=150&h=200&q=80", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=150&h=200&q=80"];
                        const randomMock = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
                        setReturnPhotos((prev) => [...prev, randomMock]);
                        setReturnFileLoading(false);
                        toast.success("Simulated image evidence added successfully.");
                      }, 800);
                    }, className: "w-12 h-16 border-2 border-dashed border-white/20 hover:border-accent hover:bg-white/5 rounded-lg flex items-center justify-center text-muted-foreground text-xs transition-all", children: returnFileLoading ? "..." : "+" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Evidence Video (1 video max - Optional)" }),
                  returnVideo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-accent font-mono truncate max-w-[200px]", children: returnVideo }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReturnVideo(""), className: "text-rose-400 hover:text-rose-500", children: "Remove" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                    setReturnVideo(`curation_evidence_${Date.now()}.mp4`);
                    toast.success("Simulated video evidence added successfully.");
                  }, className: "w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-foreground text-center", children: "Simulate Video Evidence Upload" })
                ] })
              ] }),
              returnStep === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Choose Refund Settlement Method" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: ["Original Payment Method", "ReeVibes Wallet", "Exchange Product", "Store Credit"].map((method) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setReturnRefundMethod(method), className: `p-4 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center ${returnRefundMethod === method ? "border-accent bg-accent/15 text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"}`, children: method }, method)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-4 border-t border-white/10", children: [
              returnStep > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setReturnStep((prev) => prev - 1), className: "bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 rounded-full text-xs text-foreground font-semibold flex items-center gap-1.5 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                " Back"
              ] }),
              returnStep < 3 ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReturnStep((prev) => prev + 1), className: "flex-1 bg-white text-black py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all text-center", children: "Continue" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
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
                navigate({
                  to: "/account",
                  search: {
                    tab: "returns"
                  }
                });
              }, className: "flex-1 bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95", children: "Submit Return Request" })
            ] })
          ] }) })
        ] }),
        activeTab === "returns" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/15 p-8 rounded-3xl space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl border-b border-white/10 pb-4", children: "Returns Tracker & Refund Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: state.returns.filter((r) => r.customerId === user.id).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic text-center py-6", children: "No returns logged or in progress." }) : state.returns.filter((r) => r.customerId === user.id).map((r) => {
            const RETURN_TIMELINE_STEPS = ["Return Requested", "Under Review", "Return Approved", "Pickup Scheduled", "Item Received", "Refund Processed", "Refund Completed"];
            const isRejected = r.status === "Rejected";
            const currentStepIndex = RETURN_TIMELINE_STEPS.indexOf(r.status);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6 shadow-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-accent", children: r.id }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground ml-3 font-mono", children: [
                    "Order: ",
                    r.orderId
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: r.status, tone: isRejected ? "danger" : r.status === "Refund Completed" ? "success" : "warn" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-1 text-muted-foreground leading-relaxed", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "Item:" }),
                  " ",
                  r.productName,
                  " (",
                  r.selectedSize || "M",
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "Refund Method:" }),
                  " ",
                  r.refundMethod || "Original Payment Method"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "Reason:" }),
                  " ",
                  r.reason
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "Comments:" }),
                  " ",
                  r.comment
                ] })
              ] }),
              !isRejected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] uppercase tracking-widest text-accent font-bold", children: "Return Status Timeline" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pt-2 pb-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-1 right-1 h-0.5 bg-white/10 z-0 rounded-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-1 h-0.5 bg-accent transition-all duration-500 z-0 rounded-full", style: {
                    width: `${Math.max(0, currentStepIndex / (RETURN_TIMELINE_STEPS.length - 1) * 100)}%`
                  } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 flex justify-between gap-1", children: RETURN_TIMELINE_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center flex-1 max-w-[80px]", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isCurrent ? "border-accent bg-accent text-white scale-110 shadow-[0_0_10px_rgba(212,175,55,0.5)] animate-pulse" : isCompleted ? "border-accent bg-accent text-white" : "border-white/20 bg-zinc-950 text-muted-foreground"}`, children: isCompleted && !isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] font-mono", children: idx + 1 }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[7px] text-center mt-2 font-semibold uppercase tracking-wider block transition-colors leading-tight ${isCurrent ? "text-accent" : isCompleted ? "text-white" : "text-muted-foreground"}`, children: step })
                    ] }, step);
                  }) })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-xs text-rose-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold uppercase tracking-wider", children: "Return Request Rejected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-rose-400 font-medium", children: [
                    "Rejection Reason: ",
                    r.rejectionReason || "Insufficient evidence"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-white/5 text-xs space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px]", children: "Detailed Refund Statement" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 border border-white/5 bg-white/[0.02] p-4 rounded-2xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase tracking-wider", children: "Refund Amount" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-white text-sm", children: [
                        "₹",
                        r.refundAmount.toLocaleString()
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase tracking-wider", children: "Expected Settlement Date" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: r.status === "Refund Completed" ? "Completed" : r.expectedCreditDate || "Expected 3-5 days after approval" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase tracking-wider", children: "Ref Transaction ID" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-white text-[10px] break-all", children: r.refundTransactionId || "N/A" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase tracking-wider", children: "Settlement Date" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: r.refundDate || "Pending Payout" })
                    ] })
                  ] })
                ] })
              ] })
            ] }, r.id);
          }) })
        ] }),
        activeTab === "wallet" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/15 p-8 rounded-3xl space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl", children: "My Luxury Wallet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-accent/20 to-black/40 border border-accent/20 p-6 rounded-2xl max-w-sm space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Available Credits" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif text-3xl font-bold text-accent", children: [
              "₹",
              (state.wallets[user.id] ?? 0).toLocaleString()
            ] })
          ] })
        ] })
      ] })
    ] }),
    showSaveSuccessPopup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm overflow-hidden liquid-glass bg-background/90 border border-accent/40 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.25)] p-8 text-foreground animate-in zoom-in-95 duration-200 text-center space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-12 h-12 bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center text-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-[0.2em] text-accent font-bold", children: "Maison Registry updated" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl font-bold tracking-wide", children: "Couture Profile Saved" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Your curation details and sizing preferences have been successfully updated in our secure ledger." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSaveSuccessPopup(false), className: "w-full py-3 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(212,175,55,0.3)] border border-accent/20 cursor-pointer", children: "Acknowledge" }) })
    ] }) })
  ] });
}
function WishlistItemCard({
  p,
  user,
  toggleShopWishlist,
  addToShopCart,
  triggerPopup
}) {
  const [isTitleHovered, setIsTitleHovered] = reactExports.useState(false);
  const ensureRupees = (val) => {
    if (val === void 0 || val === null) return "";
    const clean = String(val).trim();
    return clean.startsWith("₹") ? clean : `₹${clean}`;
  };
  const handleRemove = () => {
    toggleShopWishlist(user.id, p.id);
    triggerPopup(`${p.name} removed from wishlist.`, () => toggleShopWishlist(user.id, p.id), `${p.name} added to wishlist!`, () => toggleShopWishlist(user.id, p.id), `${p.name} removed from wishlist.`);
  };
  const availableSizes = p.sizes || ["S", "M", "L", "XL"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl relative group overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
      productId: p.id
    }, className: "block shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, className: "w-20 h-24 object-cover rounded-xl border border-white/10 hover:opacity-85 transition-opacity" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col justify-between min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pr-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: p.house }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
          productId: p.id
        }, className: "hover:text-accent transition-colors block mt-0.5", onMouseEnter: () => setIsTitleHovered(true), onMouseLeave: () => setIsTitleHovered(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-sm font-semibold truncate", children: p.name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-accent text-xs font-bold mt-1", children: ensureRupees(p.price) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `transition-all duration-300 overflow-hidden ${isTitleHovered ? "h-6 opacity-100 mt-1" : "h-0 opacity-0"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-muted-foreground shrink-0", children: "Sizes:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: availableSizes.map((sz, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] bg-white/10 text-white border border-white/5 px-1.5 py-0.5 rounded font-mono", children: sz }, idx)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        addToShopCart({
          productId: p.id,
          name: p.name,
          house: p.house,
          price: p.price,
          image: p.image,
          selectedSize: "M"
        });
        triggerPopup(`${p.name} (M) added to cart!`, () => {
        }, `${p.name} removed from cart.`, () => {
        }, `${p.name} added to cart!`);
      }, className: "bg-accent text-white px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider hover:bg-accent/90 transition-all cursor-pointer", children: "Add Cart" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRemove, className: "absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-accent/20 rounded-full transition-colors group/btn cursor-pointer", title: "Remove from Wishlist", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 fill-rose-500 text-rose-500 group-hover/btn:scale-110 transition-transform" }) })
  ] });
}
export {
  ShopDashboard as component
};
