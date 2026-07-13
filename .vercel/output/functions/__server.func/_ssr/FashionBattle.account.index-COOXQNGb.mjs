import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as usePortal, a as useCartTotal, x as Route$g, P as PRODUCTS, f as StatusChip } from "./router-CgqY8r00.mjs";
import { F as FadeUp } from "./Reveal-DABDixyV.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { a1 as User, g as MapPin, l as Tag, a9 as Heart, f as ShoppingBag, aq as ListOrdered, ak as RotateCcw, W as Wallet, B as Bell, Y as Settings, h as Save, T as Trash2, P as Plus } from "../_libs/lucide-react.mjs";
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
function Dashboard() {
  const {
    state,
    updateUser,
    addAddress,
    removeAddress,
    toggleWishlist,
    createOrder,
    addToCart,
    requestReturn,
    markNotificationsRead
  } = usePortal();
  const {
    count,
    total
  } = useCartTotal();
  const {
    tab
  } = Route$g.useSearch();
  const navigate = useNavigate();
  const user = state.user;
  const [profileForm, setProfileForm] = reactExports.useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "Female",
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
        gender: user.gender || "Female",
        dob: user.dob || "",
        country: user.country || ""
      });
    }
  }, [user]);
  const [newAddress, setNewAddress] = reactExports.useState("");
  const userAddresses = user ? state.addresses[user.id] || [] : [];
  const wishlistIds = user ? state.wishlist[user.id] || [] : [];
  const wishlistItems = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const userOrders = user ? state.orders[user.id] || [] : [];
  const [checkoutAddress, setCheckoutAddress] = reactExports.useState("");
  const [appliedCoupon, setAppliedCoupon] = reactExports.useState("");
  const [discountAmount, setDiscountAmount] = reactExports.useState(0);
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!user) return;
    updateUser(user.id, profileForm);
    alert("Profile updated successfully!");
  };
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!user || !newAddress.trim()) return;
    addAddress(user.id, newAddress.trim());
    setNewAddress("");
  };
  const handlePlaceOrder = () => {
    if (!user || state.cart.length === 0) return;
    if (!checkoutAddress) {
      toast.error("Please select or add a shipping address first!");
      return;
    }
    const orderTotal = Math.max(0, total - discountAmount);
    createOrder(user.id, {
      items: state.cart,
      total: orderTotal,
      address: checkoutAddress,
      appliedCoupon: appliedCoupon || void 0
    });
    toast.success("Order placed successfully!");
    navigate({
      to: "/FashionBattle/account",
      search: {
        tab: "orders"
      }
    });
  };
  const applyCouponCode = (code) => {
    const coupon = state.coupons.find((c) => c.code === code.toUpperCase() && c.active);
    if (!coupon) {
      toast.error("Invalid coupon code.");
      return;
    }
    if (coupon.expiryDate && coupon.expiryDate !== "unlimited") {
      const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      if (todayStr > coupon.expiryDate) {
        toast.error("This coupon has expired.");
        return;
      }
    }
    if (coupon.usageLimit !== void 0 && coupon.usageLimit !== -1) {
      if ((coupon.usedCount || 0) >= coupon.usageLimit) {
        toast.error("Coupon usage limit has been reached.");
        return;
      }
    }
    const discount = Math.round(total * coupon.discount / 100);
    setDiscountAmount(discount);
    setAppliedCoupon(coupon.code);
    toast.success(`Coupon applied successfully! You got a ₹${discount.toLocaleString()} discount.`);
  };
  const activeTab = tab || "dashboard";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border-subtle overflow-x-auto gap-6 pb-2 text-xs uppercase tracking-widest font-semibold", children: [{
      id: "dashboard",
      label: "Overview",
      icon: User
    }, {
      id: "profile",
      label: "Edit Profile",
      icon: User
    }, {
      id: "addresses",
      label: "Addresses",
      icon: MapPin
    }, {
      id: "coupons",
      label: "Coupons",
      icon: Tag
    }, {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart
    }, {
      id: "cart",
      label: "Cart",
      icon: ShoppingBag
    }, {
      id: "orders",
      label: "My Orders",
      icon: ListOrdered
    }, {
      id: "returns",
      label: "Returns & Refunds",
      icon: RotateCcw
    }, {
      id: "wallet",
      label: "Wallet Balance",
      icon: Wallet
    }, {
      id: "notifications",
      label: "Notifications",
      icon: Bell
    }, {
      id: "settings",
      label: "Settings",
      icon: Settings
    }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
      to: "/FashionBattle/account",
      search: {
        tab: t.id
      }
    }), className: `flex items-center gap-2 pb-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === t.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "w-3.5 h-3.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.label })
    ] }, t.id)) }),
    activeTab === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-12 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [{
        label: "Wishlist Items",
        value: wishlistIds.length,
        sub: "Saved Products",
        tabId: "wishlist"
      }, {
        label: "Saved Addresses",
        value: userAddresses.length,
        sub: "Shipping destinations",
        tabId: "addresses"
      }, {
        label: "Available Coupons",
        value: state.coupons.length,
        sub: "Active offers",
        tabId: "coupons"
      }, {
        label: "Cart Total",
        value: count,
        sub: total ? `₹${total.toLocaleString()}` : "Empty",
        tabId: "cart"
      }].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: i * 0.05, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
        to: "/FashionBattle/account",
        search: {
          tab: t.tabId
        }
      }), className: "w-full text-left block border border-border-subtle p-6 hover:border-accent transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: t.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-5xl mt-3", children: t.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mt-2", children: t.sub })
      ] }) }, t.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface-2 rounded-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Edit Profile Quick Link" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-serif text-3xl", children: "Keep your details fresh." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Keep your email, phone, state, and other settings up to date for smooth deliveries." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
            to: "/FashionBattle/account",
            search: {
              tab: "profile"
            }
          }), className: "mt-6 inline-block bg-foreground text-background px-6 py-3 editorial-label hover:bg-accent hover:text-white transition-colors", children: "Edit Profile Now →" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.05, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface rounded-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Recent Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 divide-y divide-border-subtle", children: state.notifications.slice(0, 3).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: n.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              n.body,
              " · ",
              n.time
            ] })
          ] }, n.id)) })
        ] }) })
      ] })
    ] }),
    activeTab === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mb-6", children: "Edit Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdateProfile, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground text-[10px]", children: "First Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: profileForm.firstName, onChange: (e) => setProfileForm({
              ...profileForm,
              firstName: e.target.value
            }), className: "w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground text-[10px]", children: "Last Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: profileForm.lastName, onChange: (e) => setProfileForm({
              ...profileForm,
              lastName: e.target.value
            }), className: "w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground text-[10px]", children: "Email Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: profileForm.email, onChange: (e) => setProfileForm({
            ...profileForm,
            email: e.target.value
          }), className: "w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground text-[10px]", children: "Phone Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: profileForm.phone, onChange: (e) => setProfileForm({
            ...profileForm,
            phone: e.target.value
          }), className: "w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground text-[10px]", children: "Gender" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: profileForm.gender, onChange: (e) => setProfileForm({
              ...profileForm,
              gender: e.target.value
            }), className: "w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-background", children: "Female" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-background", children: "Male" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { className: "bg-background", children: "Other" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground text-[10px]", children: "Date of Birth" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: profileForm.dob, onChange: (e) => setProfileForm({
              ...profileForm,
              dob: e.target.value
            }), className: "w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground text-[10px]", children: "State" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: profileForm.country, onChange: (e) => setProfileForm({
            ...profileForm,
            country: e.target.value
          }), className: "w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-accent text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "mt-6 flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3.5 w-full editorial-label hover:bg-accent hover:text-white transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
          " Save Profile Details"
        ] })
      ] })
    ] }),
    activeTab === "addresses" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mb-6", children: "Saved Shipping Addresses" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 mb-8", children: userAddresses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No addresses saved yet." }) : userAddresses.map((addr, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-4 border border-border-subtle bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-accent shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: addr })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (user) removeAddress(user.id, idx);
        }, className: "p-1 hover:text-rose-500 text-muted-foreground transition-colors", title: "Delete address", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
      ] }, idx)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddAddress, className: "border-t border-border-subtle pt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm uppercase tracking-wider font-semibold", children: "Add New Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newAddress, onChange: (e) => setNewAddress(e.target.value), placeholder: "Enter full shipping address (street, city, state, pincode)...", className: "flex-1 bg-transparent border-b border-foreground/30 py-2.5 outline-none focus:border-accent text-sm", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "bg-foreground text-background px-6 py-2.5 flex items-center gap-1.5 hover:bg-accent hover:text-white transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            " Add"
          ] })
        ] })
      ] })
    ] }),
    activeTab === "coupons" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mb-6", children: "Active Promotional Coupons" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Apply these coupon codes during checkout in your Cart tab to receive discounts." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: state.coupons.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-accent/40 bg-accent/5 p-5 flex flex-col justify-between rounded-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xl font-bold tracking-wider text-accent", children: c.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm mt-2 font-medium", children: [
            c.discount,
            "% discount on all fashion pieces"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-[10px] uppercase tracking-wider text-muted-foreground", children: [
          "Status: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-500 font-semibold", children: c.active ? "Active" : "Inactive" })
        ] })
      ] }, c.code)) })
    ] }),
    activeTab === "wishlist" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mb-6", children: "My Wishlist" }),
      wishlistItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-8 h-8 mx-auto text-muted-foreground/40 mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "Your wishlist is empty." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop/categories", className: "mt-4 inline-block bg-foreground text-background px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-accent transition-colors", children: "Browse Collection" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-6", children: wishlistItems.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group border border-border-subtle bg-background p-3 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] overflow-hidden bg-surface relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, alt: p.name, className: "w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground text-[10px]", children: p.house }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-base mt-0.5 line-clamp-1", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-sm mt-1", children: p.price })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            addToCart({
              productId: p.id,
              name: p.name,
              house: p.house,
              price: p.price,
              image: p.image
            });
            toast.success(`${p.name} added to cart!`);
          }, className: "flex-1 bg-foreground text-background py-2 text-[10px] uppercase font-semibold hover:bg-accent hover:text-white transition-colors", children: "Add to Cart" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            if (user) toggleWishlist(user.id, p.id);
          }, className: "p-2 border border-border-subtle hover:text-rose-500 transition-colors", title: "Remove from Wishlist", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
        ] })
      ] }, p.id)) })
    ] }),
    activeTab === "cart" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mb-6", children: "Shopping Cart" }),
      state.cart.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8 mx-auto text-muted-foreground/40 mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "Your cart is empty." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop/categories", className: "mt-4 inline-block bg-foreground text-background px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-accent transition-colors", children: "Go Shopping" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-8 space-y-4", children: state.cart.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 p-3 border border-border-subtle bg-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.image, alt: item.name, className: "w-16 h-20 object-cover bg-surface-2 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: item.house }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-sm font-semibold", children: item.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground", children: [
                "Qty: ",
                item.qty
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif font-bold", children: item.price })
            ] })
          ] })
        ] }, item.productId)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-4 border border-border-subtle p-5 bg-background space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest font-bold border-b border-border-subtle pb-2", children: "Checkout Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground", children: "Promo Coupon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: appliedCoupon, onChange: (e) => setAppliedCoupon(e.target.value), placeholder: "e.g. FESTIVE20", className: "flex-1 bg-surface border border-border-subtle px-2.5 py-1 text-xs outline-none focus:border-accent font-mono uppercase" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => applyCouponCode(appliedCoupon), className: "bg-foreground text-background px-3 py-1 text-xs font-semibold hover:bg-accent hover:text-white transition-colors", children: "Apply" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground", children: "Shipping Address" }),
            userAddresses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-rose-500 font-semibold", children: 'Please add a shipping address in the "Addresses" tab first.' }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: checkoutAddress, onChange: (e) => setCheckoutAddress(e.target.value), className: "w-full bg-surface border border-border-subtle p-2 text-xs outline-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Shipping Address" }),
              userAddresses.map((addr, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: addr, children: addr }, idx))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border-subtle pt-4 space-y-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif", children: [
                "₹",
                total.toLocaleString()
              ] })
            ] }),
            discountAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-accent font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif", children: [
                "-₹",
                discountAmount.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-bold border-t border-border-subtle pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Order Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif", children: [
                "₹",
                Math.max(0, total - discountAmount).toLocaleString()
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handlePlaceOrder, className: "w-full bg-foreground text-background py-3 text-xs uppercase tracking-widest font-bold hover:bg-accent hover:text-white transition-colors", children: "Place Order" })
        ] })
      ] })
    ] }),
    activeTab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mb-6", children: "My Order History" }),
      userOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "You haven't placed any orders yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: userOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle bg-background p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-3 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-accent", children: order.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-3", children: [
              "Placed on: ",
              order.date
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Status: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold uppercase ${order.status === "Delivered" ? "text-emerald-500" : "text-amber-500"}`, children: order.status })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-xs items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.image, alt: item.name, className: "w-10 h-12 object-cover bg-surface-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif font-bold", children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
              item.house,
              " (Qty: ",
              item.qty,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto font-serif", children: item.price }),
          order.status === "Delivered" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            const reason = prompt("Enter return reason:", "Size issue");
            const comment = prompt("Enter comments:", "Cape was too large.");
            if (reason && user) {
              requestReturn({
                orderId: order.id,
                productId: item.productId,
                productName: item.name,
                customerId: user.id,
                customerName: `${user.firstName} ${user.lastName}`,
                reason,
                comment: comment || "",
                images: [item.image],
                videos: [],
                refundAmount: order.total
              });
              alert("Return request submitted!");
            }
          }, className: "ml-4 border border-accent hover:bg-accent hover:text-white px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-accent", children: "Return" })
        ] }, item.productId)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between border-t border-border-subtle pt-3 gap-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-1", children: "Shipping Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: order.address })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Total Paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif text-base font-bold mt-1", children: [
              "₹",
              order.total.toLocaleString()
            ] })
          ] })
        ] })
      ] }, order.id)) })
    ] }),
    activeTab === "returns" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface animate-in fade-in duration-300 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "Returns & Refund Progress" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Monitor return requests and automated Razorpay payout logs." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: state.returns.filter((r) => r.customerId === user?.id).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No return requests found." }) : state.returns.filter((r) => r.customerId === user?.id).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-5 bg-surface-2 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-border-subtle pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-bold", children: [
            r.id,
            " (Order: ",
            r.orderId,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: r.status, tone: r.status === "Approved" ? "success" : r.status === "Pending" ? "warn" : "neutral" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Item: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: r.productName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Reason: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: r.reason })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Refund Amount: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif font-bold text-accent", children: [
              "₹",
              r.refundAmount.toLocaleString()
            ] })
          ] }),
          r.refundTransactionId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-emerald-400 font-mono mt-2 bg-emerald-500/5 p-2 border border-emerald-500/10 rounded", children: [
            "Razorpay Payout ID: ",
            r.refundTransactionId,
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Refund Date: ",
            r.refundDate
          ] })
        ] })
      ] }, r.id)) })
    ] }),
    activeTab === "wallet" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "My Luxury Wallet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-accent/15 via-surface-3 to-zinc-950/20 border border-accent/20 p-8 rounded-xl max-w-sm space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Available Credits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif text-4xl font-bold text-accent", children: [
          "₹",
          (state.wallets[user?.id || ""] || 0).toLocaleString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Use wallet credits to place instant shopping orders." })
      ] })
    ] }),
    activeTab === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface animate-in fade-in duration-300 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-border-subtle pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "Alerts & Notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => markNotificationsRead(), className: "text-xs uppercase tracking-widest font-bold text-accent hover:underline", children: "Mark all read" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: state.notifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-4 border rounded flex gap-4 ${n.unread ? "bg-accent/5 border-accent/20" : "bg-surface-2 border-border-subtle"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: n.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: n.body }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-muted-foreground/60 mt-2 font-mono", children: n.time })
        ] }),
        n.unread && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" })
      ] }, n.id)) })
    ] }),
    activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle p-8 bg-surface-2 animate-in fade-in duration-300 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "Account Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true, className: "accent-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subscribe to seasonal Maison catalogs & lookbooks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true, className: "accent-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Enable WhatsApp delivery and shipping logs notifications" })
        ] })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
