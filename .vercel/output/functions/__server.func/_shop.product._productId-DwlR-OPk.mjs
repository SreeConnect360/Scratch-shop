import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { y as Route$f, u as usePortal, i as useShopNotification } from "./_ssr/router-CgqY8r00.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { F as FadeUp } from "./_ssr/Reveal-DABDixyV.mjs";
import "./_libs/maplibre-gl.mjs";
import { ap as ArrowLeft, b as ChevronLeft, A as ArrowRight, s as Star, p as Truck, f as ShoppingBag, a9 as Heart, ak as RotateCcw, e as Shield, X } from "./_libs/lucide-react.mjs";
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
function ProductDetail() {
  const productId = Route$f.useParams().productId;
  const {
    state,
    toggleShopWishlist,
    addToShopCart,
    removeFromShopCart,
    recordProductView,
    addReview
  } = usePortal();
  const {
    triggerPopup
  } = useShopNotification();
  const navigate = useNavigate();
  const userId = state.user?.id;
  const userOrders = state.user ? state.orders[state.user.id] || [] : [];
  const hasOrdered = userOrders.some((order) => order.items.some((item) => item.productId === productId));
  const products = state.products || [];
  const product = products.find((p) => p.id === productId);
  const isPublished = product && (!product.status || product.status === "PUBLISHED" || product.status === "published");
  if (!product || !isPublished) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[60vh] flex flex-col items-center justify-center p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "Product Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "The requested statement piece is not in our current catalog." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-6 border border-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors", children: "Return to Shop" })
    ] });
  }
  const mediaGallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeMediaIdx, setActiveMediaIdx] = reactExports.useState(0);
  const [zoomStyle, setZoomStyle] = reactExports.useState({
    display: "none",
    backgroundPosition: "0% 0%"
  });
  reactExports.useEffect(() => {
    recordProductView(product.id);
  }, [product.id]);
  const availableSizes = product.sizes || ["S", "M", "L", "XL"];
  const stockPerSize = product.stockPerSize || {
    S: 5,
    M: 8,
    L: 4,
    XL: 2
  };
  const [selectedSize, setSelectedSize] = reactExports.useState(null);
  const [quantity, setQuantity] = reactExports.useState(1);
  const [isMultiSelect, setIsMultiSelect] = reactExports.useState(false);
  const [bulkSelection, setBulkSelection] = reactExports.useState({});
  const [pincode, setPincode] = reactExports.useState("");
  const [deliveryEstimation, setDeliveryEstimation] = reactExports.useState("");
  const [selectedAddrIdx, setSelectedAddrIdx] = reactExports.useState(0);
  const [showSizePopup, setShowSizePopup] = reactExports.useState(false);
  const [postSizeAction, setPostSizeAction] = reactExports.useState(null);
  const userAddresses = userId ? state.addresses[userId] || [] : [];
  reactExports.useEffect(() => {
    if (userId && state.majorAddresses?.[userId]) {
      const major = state.majorAddresses[userId];
      const idx = userAddresses.indexOf(major);
      if (idx !== -1) {
        setSelectedAddrIdx(idx);
      }
    }
  }, [userId, state.majorAddresses, userAddresses]);
  const parseSingleAddress = (addrStr) => {
    try {
      if (addrStr.trim().startsWith("{")) {
        return JSON.parse(addrStr);
      }
    } catch (e) {
    }
    return {
      name: state.user ? `${state.user.firstName} ${state.user.lastName}` : "Customer",
      address: addrStr,
      phone: state.user?.phone || ""
    };
  };
  const handlePincodeCheck = () => {
    if (/^\d{6}$/.test(pincode.trim())) {
      setDeliveryEstimation("Estimated Delivery: 2-3 Business Days via Shiprocket Express");
    } else {
      setDeliveryEstimation("Please enter a valid 6-digit Pincode.");
    }
  };
  const reviews = state.productReviews[product.id] || [];
  const approvedReviews = reviews.filter((r) => r.status === "Approved");
  const averageRating = approvedReviews.length > 0 ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1) : "5.0";
  const [ratingInput, setRatingInput] = reactExports.useState(5);
  const [commentInput, setCommentInput] = reactExports.useState("");
  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!state.user) {
      toast.error("Please sign in to write a review.");
      return;
    }
    if (!commentInput.trim()) return;
    addReview(product.id, {
      userName: `${state.user.firstName} ${state.user.lastName}`,
      rating: ratingInput,
      comment: commentInput
    });
    setCommentInput("");
    toast.success("Thank you! Your review has been added.");
  };
  const handleMouseMove = (e) => {
    const {
      left,
      top,
      width,
      height
    } = e.currentTarget.getBoundingClientRect();
    const x = (e.pageX - left - window.scrollX) / width * 100;
    const y = (e.pageY - top - window.scrollY) / height * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`
    });
  };
  const handleMouseLeave = () => {
    setZoomStyle({
      display: "none",
      backgroundPosition: "0% 0%"
    });
  };
  const isFavorite = userId ? (state.shopWishlist[userId] || []).includes(product.id) : false;
  const handleWishlistToggle = () => {
    if (!userId) {
      toast.error("Please sign in to manage your wishlist.");
      return;
    }
    toggleShopWishlist(userId, product.id);
    triggerPopup(!isFavorite ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist.`, () => toggleShopWishlist(userId, product.id), !isFavorite ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist!`, () => toggleShopWishlist(userId, product.id), !isFavorite ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist.`);
  };
  const handleAddToCart = () => {
    if (isMultiSelect) {
      const selectedSizes = Object.keys(bulkSelection).filter((sz) => bulkSelection[sz] > 0);
      if (selectedSizes.length === 0) {
        toast.error("Please select at least one size and quantity.");
        return;
      }
      selectedSizes.forEach((sz) => {
        const item = {
          productId: product.id,
          name: product.name,
          house: product.house,
          price: product.price,
          image: product.image,
          qty: bulkSelection[sz],
          selectedSize: sz
        };
        addToShopCart(item);
      });
      triggerPopup(`Added ${selectedSizes.length} variants to cart!`, () => {
        selectedSizes.forEach((sz) => removeFromShopCart(product.id, sz));
      }, `Removed ${selectedSizes.length} variants from cart.`, () => {
        selectedSizes.forEach((sz) => {
          addToShopCart({
            productId: product.id,
            name: product.name,
            house: product.house,
            price: product.price,
            image: product.image,
            qty: bulkSelection[sz],
            selectedSize: sz
          });
        });
      }, `Added ${selectedSizes.length} variants to cart!`);
    } else {
      if (!selectedSize) {
        setPostSizeAction("cart");
        setShowSizePopup(true);
        return;
      }
      const item = {
        productId: product.id,
        name: product.name,
        house: product.house,
        price: product.price,
        image: product.image,
        qty: quantity,
        selectedSize
      };
      addToShopCart(item);
      triggerPopup(`${product.name} (${selectedSize}) added to cart!`, () => removeFromShopCart(product.id, selectedSize), `${product.name} (${selectedSize}) removed from cart.`, () => addToShopCart(item), `${product.name} (${selectedSize}) added to cart!`);
    }
  };
  const handleBuyNow = () => {
    if (isMultiSelect) {
      const selectedSizes = Object.keys(bulkSelection).filter((sz) => bulkSelection[sz] > 0);
      if (selectedSizes.length === 0) {
        toast.error("Please select at least one size and quantity.");
        return;
      }
      selectedSizes.forEach((sz) => {
        addToShopCart({
          productId: product.id,
          name: product.name,
          house: product.house,
          price: product.price,
          image: product.image,
          qty: bulkSelection[sz],
          selectedSize: sz
        });
      });
      toast.success(`Proceeding to checkout with ${selectedSizes.length} variants!`);
      navigate({
        to: "/cart",
        search: {
          buyNow: "true"
        }
      });
    } else {
      if (!selectedSize) {
        setPostSizeAction("buy");
        setShowSizePopup(true);
        return;
      }
      addToShopCart({
        productId: product.id,
        name: product.name,
        house: product.house,
        price: product.price,
        image: product.image,
        qty: quantity,
        selectedSize
      });
      toast.success(`${product.name} (${selectedSize}) added to cart!`);
      navigate({
        to: "/cart",
        search: {
          buyNow: "true",
          productId: product.id,
          size: selectedSize
        }
      });
    }
  };
  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category && (!p.status || p.status === "PUBLISHED" || p.status === "published")).slice(0, 4);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-16 py-12 space-y-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-xs uppercase tracking-widest font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
      " Back to Shop"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-zinc-950 aspect-[3/4] overflow-hidden rounded-3xl border border-border-subtle cursor-zoom-in", onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: mediaGallery[activeMediaIdx], className: "w-full h-full object-cover select-none pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 hidden pointer-events-none transition-shadow bg-no-repeat duration-100", style: {
            ...zoomStyle,
            backgroundImage: `url(${mediaGallery[activeMediaIdx]})`,
            backgroundSize: "200%"
          } }),
          mediaGallery.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveMediaIdx((prev) => prev === 0 ? mediaGallery.length - 1 : prev - 1), className: "absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2.5 rounded-full hover:bg-black transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveMediaIdx((prev) => prev === mediaGallery.length - 1 ? 0 : prev + 1), className: "absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2.5 rounded-full hover:bg-black transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" }) })
          ] })
        ] }),
        mediaGallery.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-x-auto pb-2 scrollbar-none", children: mediaGallery.map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveMediaIdx(idx), className: `w-20 aspect-[3/4] border overflow-hidden shrink-0 rounded-xl transition-all duration-300 ${activeMediaIdx === idx ? "border-accent scale-95 shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "border-white/10 hover:border-white/30"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m, className: "w-full h-full object-cover" }) }, idx)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(FadeUp, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-accent font-bold", children: product.house }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl md:text-4xl mt-2 text-foreground", children: product.name }),
          product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-3 leading-relaxed border-l-2 border-accent/30 pl-3 italic", children: product.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center text-amber-400", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-3.5 h-3.5 fill-current ${i < Math.floor(Number(averageRating)) ? "text-amber-400" : "text-zinc-600"}` }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: averageRating }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
              "(",
              approvedReviews.length,
              " reviews)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-serif text-accent font-semibold mt-4", children: product.price })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 backdrop-blur-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xs font-bold text-accent uppercase tracking-wider", children: "Product Specifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-xs", children: [
            product.name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold tracking-wider", children: "Product Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: product.name })
            ] }),
            product.house && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold tracking-wider", children: "Brand / House" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: product.house })
            ] }),
            product.category && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold tracking-wider", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: product.category })
            ] }),
            product.gender && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold tracking-wider", children: "Gender" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: product.gender })
            ] }),
            product.color && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold tracking-wider", children: "Colour" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: product.color })
            ] }),
            product.material && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold tracking-wider", children: "Fabric Material" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: product.material })
            ] }),
            product.type && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold tracking-wider", children: "Product Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: product.type })
            ] }),
            (() => {
              const tagsVal = product.tags || product.tag;
              if (!tagsVal) return null;
              const tagsArr = Array.isArray(tagsVal) ? tagsVal : String(tagsVal).split(",").map((t) => t.trim()).filter(Boolean);
              if (tagsArr.length === 0) return null;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold tracking-wider mb-1", children: "Product Tags" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: tagsArr.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-accent/15 border border-accent/30 text-accent text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full", children: t }, i)) })
              ] });
            })()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-border-subtle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs uppercase tracking-wider font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Select Size" }),
              isMultiSelect && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-accent/20 text-accent text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest", children: "Bulk Mode" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              setIsMultiSelect(!isMultiSelect);
              setSelectedSize(null);
              setBulkSelection({});
            }, className: `text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all cursor-pointer ${isMultiSelect ? "bg-accent text-white border-accent animate-pulse" : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"}`, children: isMultiSelect ? "✓ Multi Select On" : "＋ Multi Size Select" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: availableSizes.map((size) => {
            const hasStock = (stockPerSize[size] ?? 0) > 0;
            const isSelected = isMultiSelect ? bulkSelection[size] !== void 0 : selectedSize === size;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: !hasStock, onClick: () => {
              if (isMultiSelect) {
                setBulkSelection((prev) => {
                  const next = {
                    ...prev
                  };
                  if (next[size] !== void 0) {
                    delete next[size];
                  } else {
                    next[size] = 1;
                  }
                  return next;
                });
              } else {
                if (isSelected) {
                  setSelectedSize(null);
                } else {
                  setSelectedSize(size);
                  setQuantity(1);
                }
              }
            }, className: `text-xs py-2 px-5 font-semibold rounded-full transition-all duration-300 cursor-pointer ${!hasStock ? "opacity-35 cursor-not-allowed bg-zinc-800 line-through text-muted-foreground" : isSelected ? "bg-accent text-white shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105" : "bg-white/5 dark:bg-white/5 border border-white/10 hover:bg-white/10 text-foreground"}`, children: [
              size,
              isMultiSelect && isSelected && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-[9px] font-mono bg-white/20 px-1.5 py-0.5 rounded-full", children: [
                "x",
                bulkSelection[size]
              ] })
            ] }, size);
          }) })
        ] }),
        !isMultiSelect ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase tracking-wider font-semibold", children: "Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-white/5 dark:bg-white/5 border border-white/10 w-32 rounded-full overflow-hidden p-0.5 backdrop-blur-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQuantity((q) => Math.max(1, q - 1)), className: "flex-1 py-1.5 text-center hover:bg-white/10 dark:hover:bg-white/10 rounded-full transition-colors font-bold text-sm text-foreground cursor-pointer", children: "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-center font-semibold text-xs text-foreground", children: quantity }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              const maxStock = selectedSize ? stockPerSize[selectedSize] ?? 0 : 10;
              setQuantity((q) => q < maxStock ? q + 1 : q);
            }, className: "flex-1 py-1.5 text-center hover:bg-white/10 dark:hover:bg-white/10 rounded-full transition-colors font-bold text-sm text-foreground cursor-pointer", children: "+" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 bg-white/5 p-4 border border-white/10 rounded-2xl backdrop-blur-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase tracking-wider font-semibold", children: "Selected Quantities" }),
          Object.keys(bulkSelection).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground italic text-center py-2", children: "Click on sizes above to select them and set quantities." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin", children: Object.keys(bulkSelection).map((sz) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center bg-zinc-950/50 p-2.5 border border-white/5 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold font-mono text-sm text-white", children: sz }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground font-mono", children: [
                "(Stock: ",
                stockPerSize[sz],
                " available)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-white/5 border border-white/10 w-28 rounded-full overflow-hidden p-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setBulkSelection((prev) => {
                  const next = {
                    ...prev
                  };
                  if (next[sz] > 1) {
                    next[sz]--;
                  }
                  return next;
                });
              }, className: "flex-1 py-1 text-center hover:bg-white/10 rounded-full transition-colors font-bold text-xs text-foreground cursor-pointer", children: "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-center font-semibold text-xs text-foreground", children: bulkSelection[sz] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                const maxStock = stockPerSize[sz] ?? 10;
                setBulkSelection((prev) => {
                  const next = {
                    ...prev
                  };
                  if (next[sz] < maxStock) {
                    next[sz]++;
                  }
                  return next;
                });
              }, className: "flex-1 py-1 text-center hover:bg-white/10 rounded-full transition-colors font-bold text-xs text-foreground cursor-pointer", children: "+" })
            ] })
          ] }, sz)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase tracking-wider font-semibold", children: "Delivery Estimator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Enter 6-digit pincode", className: "bg-transparent border border-white/10 rounded-full px-4 py-2 text-xs outline-none focus:border-accent text-foreground flex-1", value: pincode, onChange: (e) => setPincode(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handlePincodeCheck, className: "bg-accent text-white rounded-full px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-accent/90 transition-colors", children: "Check" })
          ] }),
          deliveryEstimation && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-accent font-semibold tracking-wider mt-1", children: deliveryEstimation })
        ] }),
        state.user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs uppercase tracking-wider font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-3.5 h-3.5 text-accent" }),
              " Shipping Destination"
            ] }),
            userAddresses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-mono", children: [
              selectedAddrIdx + 1,
              " of ",
              userAddresses.length
            ] })
          ] }),
          userAddresses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-2 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground italic", children: "No shipping address added yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", search: {
              tab: "addresses"
            }, className: "inline-block text-[10px] uppercase tracking-widest font-bold text-accent hover:underline", children: "+ Add Shipping Address" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4", children: [
            userAddresses.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelectedAddrIdx((prev) => prev === 0 ? userAddresses.length - 1 : prev - 1), className: "p-1 rounded-full bg-white/5 border border-white/10 text-accent hover:bg-accent hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3 h-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-left text-xs space-y-1", children: (() => {
              const parsed = parseSingleAddress(userAddresses[selectedAddrIdx]);
              const isMajor = state.majorAddresses?.[state.user.id] === userAddresses[selectedAddrIdx];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: parsed.name }),
                  isMajor && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-accent/20 text-accent text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded font-bold", children: "Major" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[11px] leading-relaxed", children: parsed.address }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                  "Phone: ",
                  parsed.phone
                ] })
              ] });
            })() }),
            userAddresses.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSelectedAddrIdx((prev) => prev === userAddresses.length - 1 ? 0 : prev + 1), className: "p-1 rounded-full bg-white/5 border border-white/10 text-accent hover:bg-accent hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" }) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-muted-foreground italic", children: [
          "Please ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-accent underline", children: "sign in" }),
          " to view shipping address details."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAddToCart, className: "flex-1 bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4" }),
              " Add to Cart"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleWishlistToggle, className: `p-4 rounded-full transition-all flex items-center justify-center border backdrop-blur-md transform hover:scale-105 active:scale-95 ${isFavorite ? "border-accent bg-accent/20 text-accent fill-accent" : "border-white/10 bg-white/5 dark:bg-white/5 hover:border-white/20 text-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleBuyNow, className: "w-full bg-foreground text-background hover:bg-accent hover:text-white border border-border-subtle py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full transform hover:scale-[1.02] active:scale-[0.98] shadow-md font-semibold", children: "Buy It Now" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 pt-6 border-t border-border-subtle text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-5 rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 text-xs text-muted-foreground backdrop-blur-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-4 h-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Free express delivery across India. Delivery by next 3 days." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Easy 14-day hassle-free returns with Razorpay automated refunds." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100% Authentic designer luxury direct from certified ateliers." })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-12 border-t border-border-subtle pt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: "Verified Customer Reviews" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-serif font-bold text-accent", children: averageRating }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center text-amber-400", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-3.5 h-3.5 fill-current ${i < Math.floor(Number(averageRating)) ? "text-amber-400" : "text-zinc-600"}` }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Based on ",
            approvedReviews.length,
            " verified ratings"
          ] })
        ] }),
        state.user ? hasOrdered ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddReviewSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg", children: "Write a Review" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((stars) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setRatingInput(stars), className: "text-amber-400 hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-5 h-5 ${stars <= ratingInput ? "fill-current" : "text-zinc-600"}` }) }, stars)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, className: "w-full bg-white/5 dark:bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-accent rounded-xl h-24 placeholder:text-muted-foreground/50 transition-colors backdrop-blur-md", placeholder: "Share your experience styling this piece…", value: commentInput, onChange: (e) => setCommentInput(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 rounded-full text-xs uppercase font-bold tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-lg", children: "Submit Review" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400 font-medium tracking-wide flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Only customers who have purchased this statement piece are eligible to write a review." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground italic", children: [
          "Please",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-accent underline", children: "sign in" }),
          " ",
          "to write a review."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-6", children: approvedReviews.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border-subtle/50 space-y-6", children: approvedReviews.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 space-y-2 backdrop-blur-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif font-bold text-sm text-foreground", children: r.userName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground ml-3 font-mono", children: r.date })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center text-amber-400", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-3 h-3 fill-current ${i < r.rating ? "text-amber-400" : "text-zinc-600"}` }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs italic leading-relaxed text-foreground/90", children: [
          '"',
          r.comment,
          '"'
        ] })
      ] }, r.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground italic py-6", children: "Be the first to write a review for this statement piece." }) })
    ] }),
    relatedProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 border-t border-border-subtle pt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: "You May Also Like" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: relatedProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group liquid-glass liquid-glass-card-hover flex flex-col justify-between overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
          productId: p.id
        }, className: "block relative aspect-[3/4] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground", children: p.house }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
            productId: p.id
          }, className: "hover:text-accent font-serif text-sm block font-medium truncate", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-accent", children: p.price })
        ] })
      ] }, p.id)) })
    ] }),
    showSizePopup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass max-w-md w-full p-6 md:p-8 space-y-6 shadow-[0_0_50px_rgba(212,175,55,0.25)] animate-in zoom-in-95 duration-200 border border-accent/40 rounded-3xl relative bg-background/90 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setShowSizePopup(false);
        setPostSizeAction(null);
      }, className: "absolute top-4 right-4 text-muted-foreground hover:text-accent p-2 transition-colors rounded-full bg-foreground/5 hover:bg-foreground/10 border border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, className: "w-20 aspect-[3/4] object-cover rounded-xl border border-border-subtle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest text-accent font-bold", children: product.house }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg font-bold text-foreground leading-tight", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-accent mt-1", children: product.price })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-border-subtle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs uppercase tracking-wider font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Select Size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 font-semibold tracking-wider text-[10px] animate-pulse", children: selectedSize ? `Stock: ${stockPerSize[selectedSize]} left` : "Please select a size" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: availableSizes.map((size) => {
          const hasStock = (stockPerSize[size] ?? 0) > 0;
          const isSelected = selectedSize === size;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !hasStock, onClick: () => {
            if (isSelected) {
              setSelectedSize(null);
            } else {
              setSelectedSize(size);
              setQuantity(1);
            }
          }, className: `text-xs py-2 px-5 font-semibold rounded-full transition-all duration-300 ${!hasStock ? "opacity-35 cursor-not-allowed bg-foreground/5 line-through text-muted-foreground border border-transparent" : isSelected ? "bg-accent text-white shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105 border border-accent" : "bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border-subtle"}`, children: size }, size);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase tracking-wider font-semibold text-center", children: "Quantity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-foreground/5 border border-border-subtle w-32 mx-auto rounded-full overflow-hidden p-0.5 backdrop-blur-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQuantity((q) => Math.max(1, q - 1)), className: "flex-1 py-1.5 text-center hover:bg-foreground/5 rounded-full transition-colors font-bold text-sm text-foreground", children: "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-center font-semibold text-xs text-foreground", children: quantity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            const maxStock = selectedSize ? stockPerSize[selectedSize] ?? 0 : 10;
            setQuantity((q) => q < maxStock ? q + 1 : q);
          }, className: "flex-1 py-1.5 text-center hover:bg-foreground/5 rounded-full transition-colors font-bold text-sm text-foreground", children: "+" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        if (!selectedSize) {
          toast.error("Please select a size first.");
          return;
        }
        addToShopCart({
          productId: product.id,
          name: product.name,
          house: product.house,
          price: product.price,
          image: product.image,
          qty: quantity,
          selectedSize
        });
        toast.success(`${product.name} (${selectedSize}) added to cart!`);
        setShowSizePopup(false);
        if (postSizeAction === "buy") {
          navigate({
            to: "/cart",
            search: {
              buyNow: "true",
              productId: product.id,
              size: selectedSize
            }
          });
        }
        setPostSizeAction(null);
      }, className: "w-full bg-foreground text-background hover:bg-accent hover:text-white border border-border-subtle py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-md font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4" }),
        " ",
        postSizeAction === "buy" ? "Buy It Now" : "Add to Cart"
      ] })
    ] }) })
  ] });
}
export {
  ProductDetail as component
};
