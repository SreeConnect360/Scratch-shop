import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortal } from "@/lib/portal-state";
import { useShopNotification } from "./_shop";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Share2,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  X,
  Plus,
  Minus,
  ChevronDown,
  Maximize2,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock
} from "lucide-react";
import { ProductCard } from "@/components/public/ProductCard";
import { parseProductInfoMarkup, type ProductSection } from "@/lib/data";

export const Route = createFileRoute("/_shop/product/$productId")({
  component: ProductDetail,
});

function parseProductInfo(text: string) {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const sections: { heading: string; lines: string[] }[] = [];
  let currentSection: { heading: string; lines: string[] } | null = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isMarkdownHeading = trimmed.startsWith("#");
    const isBracketHeading = trimmed.startsWith("[") && trimmed.endsWith("]");
    const isPlainHeading =
      trimmed.length < 45 &&
      !trimmed.includes("\t") &&
      !trimmed.includes(":") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("•") &&
      isNaN(Number(trimmed));

    let headingName = "";
    if (isMarkdownHeading) {
      headingName = trimmed.replace(/^#+\s*/, "");
    } else if (isBracketHeading) {
      headingName = trimmed.substring(1, trimmed.length - 1);
    } else if (isPlainHeading) {
      headingName = trimmed;
    }

    if (headingName) {
      currentSection = { heading: headingName, lines: [] };
      sections.push(currentSection);
    } else {
      if (!currentSection) {
        currentSection = { heading: "Product details", lines: [] };
        sections.push(currentSection);
      }
      currentSection.lines.push(trimmed);
    }
  }

  return sections.filter((s) => s.lines.length > 0);
}

function getProductDisplaySections(product: any): ProductSection[] {
  if (product?.productInfo && typeof product.productInfo === "string" && product.productInfo.trim()) {
    const parsed = parseProductInfoMarkup(product.productInfo);
    if (parsed.length > 0) return parsed;
  }
  if (product?.productSections && Array.isArray(product.productSections) && product.productSections.length > 0) {
    return product.productSections;
  }
  return [];
}

function renderKeyValueRow(key: string, value: string) {
  return (
    <div key={key} className="grid grid-cols-3 py-2 border-b border-border/40 last:border-0 text-xs sm:text-sm">
      <span className="font-semibold text-muted-foreground col-span-1 pr-2">{key}</span>
      <span className="text-foreground font-medium col-span-2">{value}</span>
    </div>
  );
}

function renderLine(line: string) {
  const trimmed = line.trim();
  let key = "";
  let value = "";

  if (trimmed.includes("\t")) {
    const parts = trimmed.split("\t");
    key = parts[0].trim();
    value = parts.slice(1).join("\t").trim();
  } else if (trimmed.includes(" : ")) {
    const parts = trimmed.split(" : ");
    key = parts[0].trim();
    value = parts.slice(1).join(" : ").trim();
  } else if (trimmed.includes(":")) {
    const firstColonIdx = trimmed.indexOf(":");
    if (firstColonIdx > 0 && !trimmed.startsWith("http") && firstColonIdx < 30) {
      key = trimmed.substring(0, firstColonIdx).trim();
      value = trimmed.substring(firstColonIdx + 1).trim();
    }
  }

  if (key && value) {
    return renderKeyValueRow(key, value);
  }

  return (
    <div key={trimmed} className="py-1 text-xs sm:text-sm text-foreground/80 leading-relaxed flex items-start gap-2">
      <span className="text-[#D4AF37] mt-1">•</span>
      <span>{trimmed}</span>
    </div>
  );
}

function ProductDetail() {
  const productId = Route.useParams().productId;
  const { state, toggleShopWishlist, addToShopCart, removeFromShopCart, recordProductView } = usePortal();
  const { triggerPopup } = useShopNotification();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  // Product Lookup
  const products = state.products || [];
  const product = products.find(
    (p) =>
      p.id === productId ||
      p.id.replace("-catalog", "") === productId ||
      (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === productId) ||
      (p.sku && p.sku.toLowerCase() === productId.toLowerCase())
  );

  const isPublished = product && (!product.status || product.status === "PUBLISHED" || product.status === "published");

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — ReeVibes`;
      recordProductView(product.id);
    }
  }, [product]);

  // Gallery of photos
  const mediaGallery =
    (product as any)?.images && (product as any).images.length > 0
      ? (product as any).images
      : product?.image
      ? [product.image]
      : [];

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Size details & stocks
  const availableSizes = product?.sizes || ["S", "M", "L", "XL"];
  const stockPerSize = (product as any)?.stockPerSize || { S: 12, M: 5, L: 10, XL: 4 };

  const displaySections = useMemo(
    () => getProductDisplaySections(product),
    [product?.id, product?.productInfo, product?.productSections]
  );

  const [openSectionIds, setOpenSectionIds] = useState<string[]>([]);

  useEffect(() => {
    if (displaySections && displaySections.length > 0) {
      setOpenSectionIds([displaySections[0].id || "sec-0"]);
    } else {
      setOpenSectionIds([]);
    }
  }, [displaySections]);

  const toggleSectionOpen = (id: string) => {
    setOpenSectionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [selectedSize, setSelectedSize] = useState<string>(() => availableSizes[0] || "S");
  const [quantity, setQuantity] = useState(1);
  const [isProductInfoOpen, setIsProductInfoOpen] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (availableSizes && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [product?.id]);

  // Delivery Pincode state
  const [pincode, setPincode] = useState("");
  const [deliveryEstimation, setDeliveryEstimation] = useState("");

  const userId = state.user?.id;
  const isFavorite = userId ? (state.shopWishlist[userId] || []).includes(product?.id || "") : false;

  if (!product || !isPublished) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl font-bold">Statement Piece Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          The requested couture piece is currently unavailable or has been unlisted from our atelier catalog.
        </p>
        <Link
          to="/"
          className="mt-6 border border-[#D4AF37] text-[#D4AF37] px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all rounded-full"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Price calculations
  const pct = product.discount || 0;
  const hasDiscount = !!(pct || product.originalPrice);
  let origPrice = product.price;
  let finalPrice = product.price;

  if (product.originalPrice && product.originalPrice !== product.price) {
    origPrice = product.originalPrice;
    finalPrice = product.price;
  } else if (pct) {
    try {
      const numeric = Number(String(product.price).replace(/[^0-9]/g, ""));
      if (!isNaN(numeric)) {
        const discounted = Math.round(numeric * (1 - pct / 100));
        finalPrice = `₹${discounted.toLocaleString()}`;
        origPrice = product.price;
      }
    } catch {
      /* ignore */
    }
  }

  const ensureRupees = (val: any) => {
    if (val === undefined || val === null) return "";
    const clean = String(val).trim();
    return clean.startsWith("₹") ? clean : `₹${clean}`;
  };

  const displayFinalPrice = ensureRupees(finalPrice);
  const displayOrigPrice = ensureRupees(origPrice);

  let displayPct = pct;
  let saveAmount = "";
  try {
    const origNum = Number(String(origPrice).replace(/[^0-9]/g, ""));
    const finalNum = Number(String(finalPrice).replace(/[^0-9]/g, ""));
    if (origNum && finalNum && origNum > finalNum) {
      if (!displayPct) displayPct = Math.round(((origNum - finalNum) / origNum) * 100);
      saveAmount = `₹${(origNum - finalNum).toLocaleString()}`;
    }
  } catch {}

  // Total stock calculated
  const currentSizeStock = stockPerSize[selectedSize] ?? 8;
  const totalStock = Object.values(stockPerSize).reduce((acc: number, cur: any) => acc + (Number(cur) || 0), 0);

  // Reviews & Rating overrides
  const reviews = state.productReviews[product.id] || [];
  const approvedReviews = reviews.filter((r) => r.status === "Approved");

  const effectiveRating = product.customRating !== undefined && product.customRating !== null && product.customRating > 0
    ? Number(product.customRating).toFixed(1)
    : (approvedReviews.length > 0
        ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
        : null);

  const effectiveReviewCount = product.customReviewCount !== undefined && product.customReviewCount !== null && product.customReviewCount > 0
    ? Number(product.customReviewCount)
    : (approvedReviews.length > 0 ? approvedReviews.length : null);

  // Actions
  const handleWishlistToggle = () => {
    if (!userId) {
      setShowAuthModal(true);
      return;
    }
    toggleShopWishlist(userId, product.id);
    toast.success(!isFavorite ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist.`);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}/product/${product.id}`
      : `https://reevibes.com/product/${product.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(`Copied product link: ${shareUrl}`);
    } catch {
      toast.success(`Copied product link: ${shareUrl}`);
    }
  };

  const handleAddToCart = () => {
    if (!userId) {
      setShowAuthModal(true);
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size before adding to bag.");
      return;
    }
    const item = {
      productId: product.id,
      name: product.name,
      house: product.house,
      price: displayFinalPrice,
      image: product.image,
      qty: quantity,
      selectedSize,
    };
    addToShopCart(item);
    triggerPopup(
      `${product.name} (${selectedSize}) added to bag!`,
      () => removeFromShopCart(product.id, selectedSize),
      `${product.name} (${selectedSize}) removed from bag.`,
      () => addToShopCart(item),
      `${product.name} (${selectedSize}) added to bag!`
    );
  };

  const handleBuyNow = () => {
    if (!userId) {
      setShowAuthModal(true);
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size before proceeding.");
      return;
    }
    addToShopCart({
      productId: product.id,
      name: product.name,
      house: product.house,
      price: displayFinalPrice,
      image: product.image,
      qty: quantity,
      selectedSize,
    });
    navigate({
      to: "/cart",
      search: { buyNow: "true", productId: product.id, size: selectedSize } as any,
    });
  };

  const handlePincodeCheck = () => {
    const pin = pincode.trim();
    if (/^\d{6}$/.test(pin)) {
      const firstDigit = pin[0];
      let days = 3;
      if (firstDigit === "5") days = 2;
      else if (firstDigit === "6") days = 3;
      else if (["1", "2", "3", "4", "7", "8"].includes(firstDigit)) days = 4;
      else days = 5;

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + days);
      if (deliveryDate.getDay() === 0) deliveryDate.setDate(deliveryDate.getDate() + 1);

      const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "short", day: "numeric" };
      setDeliveryEstimation(`Express Delivery by ${deliveryDate.toLocaleDateString("en-IN", options)}`);
    } else {
      setDeliveryEstimation("Please enter a valid 6-digit Pincode.");
    }
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category && (!p.status || p.status === "PUBLISHED" || p.status === "published"))
    .slice(0, 4);

  return (
    <div className={cn("min-h-screen pb-28 pt-2 sm:pt-6 transition-colors duration-300", isDark ? "bg-[#0A0A0A] text-white" : "bg-[#F9FAFB] text-slate-900")}>
      
      {/* ─── FULL SCREEN IMAGE LIGHTBOX VIEWER ──────────────────────────────── */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6"
          >
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between z-10 text-white">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">
                {activeMediaIdx + 1} / {mediaGallery.length}
              </span>
              <button
                onClick={() => {
                  setViewerOpen(false);
                  setZoomScale(1);
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Fullscreen Image with Pinch & Drag */}
            <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden my-4">
              <motion.img
                key={activeMediaIdx}
                src={mediaGallery[activeMediaIdx]}
                alt={product.name}
                animate={{ scale: zoomScale }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="max-h-[82vh] max-w-full object-contain cursor-zoom-in rounded-lg"
                onClick={() => setZoomScale((prev) => (prev === 1 ? 2.2 : 1))}
              />

              {/* Lightbox Navigation Arrows (Only if mediaGallery.length > 1) */}
              {mediaGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMediaIdx((prev) => (prev - 1 + mediaGallery.length) % mediaGallery.length);
                      setZoomScale(1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer z-20"
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMediaIdx((prev) => (prev + 1) % mediaGallery.length);
                      setZoomScale(1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer z-20"
                    title="Next Image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row in Lightbox */}
            {mediaGallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 z-10 scrollbar-none">
                {mediaGallery.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveMediaIdx(idx);
                      setZoomScale(1);
                    }}
                    className={cn(
                      "w-12 h-16 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer",
                      activeMediaIdx === idx ? "border-[#D4AF37] scale-105" : "border-white/20 opacity-60"
                    )}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* ─── LEFT: HERO IMAGE GALLERY (MOBILE & DESKTOP) ────────────────── */}
          <div className="lg:col-span-6 relative w-full lg:sticky lg:top-24 lg:self-start">
            
            {/* Top Overlay Buttons (Back, Share) */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && window.history.length > 1) {
                    window.history.back();
                  } else {
                    navigate({ to: "/search" });
                  }
                }}
                className="pointer-events-auto p-2.5 rounded-full bg-black/40 dark:bg-black/60 text-white backdrop-blur-md hover:scale-105 transition-all border border-white/20 shadow-lg cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-black/40 dark:bg-black/60 text-white backdrop-blur-md hover:scale-105 transition-all border border-white/20 shadow-lg cursor-pointer"
                  title="Share product link"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              {/* Desktop Vertical Thumbnails Strip (Left of Main Image) */}
              {mediaGallery.length > 1 && (
                <div className="hidden md:flex flex-col gap-2.5 max-h-[480px] overflow-y-auto scrollbar-none shrink-0 pr-1">
                  {mediaGallery.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIdx(idx)}
                      className={cn(
                        "w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer",
                        activeMediaIdx === idx
                          ? "border-[#D4AF37] scale-95 shadow-[0_0_12px_rgba(212,175,55,0.35)]"
                          : "border-border/40 opacity-70 hover:opacity-100"
                      )}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Swiper Container */}
              <div
                onClick={() => setViewerOpen(true)}
                className="relative flex-1 aspect-[3/4] sm:aspect-[4/5] bg-black/5 dark:bg-black/40 rounded-2xl sm:rounded-3xl overflow-hidden border border-border/40 shadow-xl cursor-pointer group"
              >
                <img
                  src={mediaGallery[activeMediaIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Main Image Navigation Arrows (Only if mediaGallery.length > 1) */}
                {mediaGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMediaIdx((prev) => (prev - 1 + mediaGallery.length) % mediaGallery.length);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 opacity-80 group-hover:opacity-100 transition-all cursor-pointer z-10"
                      title="Previous Image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMediaIdx((prev) => (prev + 1) % mediaGallery.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 opacity-80 group-hover:opacity-100 transition-all cursor-pointer z-10"
                      title="Next Image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Gallery Dots Indicator */}
                {mediaGallery.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                    {mediaGallery.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMediaIdx(idx);
                        }}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                          activeMediaIdx === idx ? "w-5 bg-[#D4AF37]" : "w-1.5 bg-white/40"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Horizontal Thumbnails Strip (hidden on desktop) */}
            {mediaGallery.length > 1 && (
              <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-1 mt-3 scrollbar-none">
                {mediaGallery.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIdx(idx)}
                    className={cn(
                      "w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer",
                      activeMediaIdx === idx
                        ? "border-[#D4AF37] scale-95 shadow-[0_0_12px_rgba(212,175,55,0.35)]"
                        : "border-border/40 opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── RIGHT: PRODUCT INFORMATION & ACTIONS ────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6">
            
            {/* Brand Name & Category Tag */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                {product.house || "REEVIBES ATELIER"}
              </span>
              {(product.type || product.category) && (
                <span className={cn("px-3 py-1 rounded-full text-[11px] font-semibold border tracking-wide", isDark ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700")}>
                  {product.type || product.category}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Customer Reviews (Auto-hidden if empty/unconfigured) */}
            {(effectiveRating || effectiveReviewCount) && (
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => {
                    const score = Number(effectiveRating || 5);
                    const fill = i + 1 <= score ? 1 : (i < score ? 0.5 : 0);
                    return (
                      <Star
                        key={i}
                        className={cn("w-4 h-4 text-amber-400", fill > 0 ? "fill-amber-400" : "fill-transparent")}
                      />
                    );
                  })}
                </div>
                {effectiveRating && <span className="font-bold text-foreground">{effectiveRating}</span>}
                {effectiveReviewCount && <span className="text-muted-foreground">({effectiveReviewCount} Customer Reviews)</span>}
              </div>
            )}

            {/* Pricing Box */}
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {displayFinalPrice}
                </span>
                {hasDiscount && (
                  <span className="text-base sm:text-lg text-muted-foreground line-through font-medium">
                    {displayOrigPrice}
                  </span>
                )}
                {displayPct > 0 && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-extrabold uppercase bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                    {displayPct}% OFF
                  </span>
                )}
              </div>
              {saveAmount && (
                <span className="text-xs sm:text-sm font-semibold text-emerald-500 dark:text-emerald-400">
                  You Save {saveAmount}
                </span>
              )}
            </div>

            <div className="h-px w-full bg-border/40" />

            {/* Size Selector */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold uppercase tracking-widest text-[#D4AF37]">
                  SELECT SIZE
                </span>
                <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                  In Stock ({totalStock > 0 ? totalStock : 12} left)
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {availableSizes.map((size: string) => {
                  const isSelected = selectedSize === size;
                  const stock = stockPerSize[size] ?? 8;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer active:scale-95",
                        isSelected
                          ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-md shadow-[#D4AF37]/20"
                          : isDark
                          ? "bg-zinc-900/80 text-white border-zinc-800 hover:border-zinc-700"
                          : "bg-white text-slate-900 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {/* Checkmark Icon top-left when selected */}
                      {isSelected && (
                        <div className="absolute top-1.5 left-1.5">
                          <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                        </div>
                      )}
                      <span className="text-base sm:text-lg font-extrabold">{size}</span>
                      <span
                        className={cn(
                          "text-[10px] font-medium mt-0.5",
                          isSelected ? "text-black/80" : "text-muted-foreground"
                        )}
                      >
                        {stock} left
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                QUANTITY
              </span>
              <div className="flex items-center border border-border/60 rounded-xl overflow-hidden bg-background">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-accent/10 transition-colors text-foreground cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-foreground">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(currentSizeStock, q + 1))}
                  className="p-2.5 hover:bg-accent/10 transition-colors text-foreground cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop Action Buttons (Positioned directly below Quantity Selector) */}
            <div className="hidden lg:flex flex-col gap-3 pt-1">
              {/* Row 1: Add to Bag + Wishlist Icon in one line */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={cn(
                    "flex-1 py-3.5 px-4 rounded-xl border-2 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2",
                    isDark
                      ? "border-[#D4AF37] text-white hover:bg-[#D4AF37]/10"
                      : "border-[#D4AF37] text-slate-900 hover:bg-[#D4AF37]/10"
                  )}
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>ADD TO BAG</span>
                </button>

                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={cn(
                    "p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center shrink-0",
                    isFavorite
                      ? "bg-red-500/20 text-red-500 border-red-500/40"
                      : isDark
                      ? "border-[#D4AF37]/40 text-white hover:border-[#D4AF37]"
                      : "border-slate-300 text-slate-900 hover:border-[#D4AF37]"
                  )}
                  title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                </button>
              </div>

              {/* Row 2: Buy Now Button below */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/25 hover:bg-[#c49f2f] transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>BUY NOW</span>
              </button>
            </div>

            <div className="h-px w-full bg-border/40" />

            {/* Atelier Overview Section */}
            {(product.overviewTitle || product.description) && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {product.overviewTitle || "ATELIER OVERVIEW"}
                </span>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
                  {product.description ||
                    "A premium quality daily-wear classic cotton t-shirt with breathable fabric. Crafted for elegant drape and luxury everyday comfort."}
                </p>
              </div>
            )}

            {/* Dynamic Expandable Product Information Accordions */}
            {displaySections.length > 0 && (
              <div className="space-y-3">
                {displaySections.map((sec, idx) => {
                  const secId = sec.id || `sec-${idx}`;
                  const isOpen = openSectionIds.includes(secId);

                  return (
                    <div key={secId} className="border border-border/60 rounded-2xl overflow-hidden bg-card/40 transition-colors">
                      <button
                        type="button"
                        onClick={() => toggleSectionOpen(secId)}
                        className="w-full p-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-foreground cursor-pointer hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                          <span>{sec.title}</span>
                        </div>
                        <ChevronDown
                          className={cn("w-5 h-5 text-[#D4AF37] transition-transform duration-300", isOpen && "rotate-180")}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden border-t border-border/40 p-4 space-y-3 text-xs sm:text-sm"
                          >
                            {sec.subtitle && (
                              <p className="text-xs text-muted-foreground italic font-medium">
                                {sec.subtitle}
                              </p>
                            )}

                            <div className="space-y-1">
                              {sec.rows && sec.rows.map((row, rIdx) => (
                                <div key={rIdx} className="grid grid-cols-3 py-2 border-b border-border/40 last:border-0 text-xs sm:text-sm">
                                  <span className="font-semibold text-muted-foreground col-span-1 pr-2">{row.label}</span>
                                  <span className="text-foreground font-medium col-span-2">{row.value}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Delivery Pincode Checker */}
            <div className="border border-border/60 rounded-2xl p-4 space-y-3 bg-card/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                <Truck className="w-4 h-4" />
                <span>Delivery & Services</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-border/60 bg-background text-foreground focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={handlePincodeCheck}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#c49f2f] transition-all cursor-pointer"
                >
                  Check
                </button>
              </div>
              {deliveryEstimation && (
                <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{deliveryEstimation}</span>
                </p>
              )}
            </div>

            {/* Authenticity & Protection Trust Cards */}
            <div className="grid grid-cols-3 gap-2 py-2 text-center text-[11px] sm:text-xs text-muted-foreground">
              <div className="p-3 rounded-xl border border-border/40 flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold text-foreground">100% Authentic</span>
              </div>
              <div className="p-3 rounded-xl border border-border/40 flex flex-col items-center gap-1.5">
                <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold text-foreground">7 Days Return</span>
              </div>
              <div className="p-3 rounded-xl border border-border/40 flex flex-col items-center gap-1.5">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-semibold text-foreground">Free Shipping</span>
              </div>
            </div>

          </div>
        </div>

        {/* ─── RELATED PRODUCTS / YOU MAY ALSO LIKE SECTION ──────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border/40 space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                CURATED SELECTION
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                You May Also Admire
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel: any) => (
                <ProductCard
                  key={rel.id}
                  p={rel}
                  toggleShopWishlist={toggleShopWishlist}
                  addToShopCart={addToShopCart}
                  wishlist={userId ? state.shopWishlist[userId] : []}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── STICKY BOTTOM ACTION BAR (MOBILE EXCLUSIVE - REPLACES BOTTOM NAV BAR) ───────── */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden p-3 border-t shadow-2xl backdrop-blur-xl transition-colors pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        isDark ? "bg-[#0A0A0A]/95 border-white/10 text-white" : "bg-white/95 border-slate-200 text-slate-900"
      )}>
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
          
          {/* Add To Bag Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "flex-1 py-3.5 sm:py-4 px-4 rounded-xl border-2 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2",
              isDark
                ? "border-[#D4AF37] text-white hover:bg-[#D4AF37]/10"
                : "border-[#D4AF37] text-slate-900 hover:bg-[#D4AF37]/10"
            )}
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>ADD TO BAG</span>
          </button>

          {/* Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 py-3.5 sm:py-4 px-4 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#D4AF37]/25 hover:bg-[#c49f2f] transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>BUY NOW</span>
          </button>

        </div>
      </div>

      {/* Sign in required Modal Popup */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#18181B] border border-white/10 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl"
            >
              {/* Lock Icon inside Gold Circle */}
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
                <Lock className="w-8 h-8" />
              </div>

              {/* Title & Body Description */}
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                  Sign in required
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xs mx-auto font-sans">
                  Please sign in or create an account to save items to your cart and continue shopping.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    navigate({
                      to: "/login",
                      search: { redirect: typeof window !== "undefined" ? window.location.pathname : "" } as any
                    });
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#D4AF37] text-black font-extrabold text-sm uppercase tracking-wider hover:bg-[#c49f2f] transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20 active:scale-95"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    navigate({
                      to: "/register",
                      search: { redirect: typeof window !== "undefined" ? window.location.pathname : "" } as any
                    });
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#D4AF37] text-[#D4AF37] font-extrabold text-sm uppercase tracking-wider hover:bg-[#D4AF37]/10 transition-all cursor-pointer bg-transparent active:scale-95"
                >
                  Register
                </button>

                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="w-full pt-2 text-sm text-zinc-400 font-semibold hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
