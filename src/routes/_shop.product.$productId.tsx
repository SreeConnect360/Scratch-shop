import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
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
  Layers,
  Crown,
  Wallet,
  ShoppingCart,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Copy,
  Mail,
  MessageCircle,
  Ticket,
  Tag,
  Clock
} from "lucide-react";
import { ProductCard } from "@/components/public/ProductCard";
import { parseProductInfoMarkup, type ProductSection, PRODUCTS, type Product } from "@/lib/data";
import { getEligibleCouponsForProduct } from "@/lib/supabase-coupons";
import { fetchSingleProductFromSupabase } from "@/lib/supabase-catalog";

function CouponExpiryBadge({ expiryDate }: { expiryDate?: string }) {
  const [timeLeft, setTimeLeft] = useState<{ text: string; isLive: boolean }>({ text: "", isLive: false });

  useEffect(() => {
    if (!expiryDate || expiryDate === "unlimited") {
      setTimeLeft({ text: "No Expiration", isLive: false });
      return;
    }

    const calc = () => {
      const target = new Date(expiryDate).getTime();
      if (isNaN(target)) return { text: `Exp: ${expiryDate}`, isLive: false };
      const now = Date.now();
      const diffMs = target - now;
      if (diffMs <= 0) return { text: "Expired", isLive: false };

      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      if (days > 30) {
        const months = Math.floor(days / 30);
        return { text: `${months} month${months > 1 ? "s" : ""} left`, isLive: false };
      }
      if (days > 2) {
        return { text: `${days} days left`, isLive: false };
      }
      const totalHours = Math.floor(totalSec / 3600);
      const hStr = String(totalHours).padStart(2, "0");
      const mStr = String(minutes).padStart(2, "0");
      const sStr = String(seconds).padStart(2, "0");
      return { text: `${hStr}:${mStr}:${sStr}`, isLive: true };
    };

    const initial = calc();
    setTimeLeft(initial);

    if (initial.isLive) {
      const timer = setInterval(() => {
        const next = calc();
        setTimeLeft(next);
        if (!next.isLive) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [expiryDate]);

  if (!timeLeft.text) return null;

  return (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-500 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
      <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />
      <span>{timeLeft.isLive ? `Ends in ${timeLeft.text}` : timeLeft.text}</span>
    </span>
  );
}

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
  const { state, isProductsLoading, reloadProducts, toggleShopWishlist, addToShopCart, removeFromShopCart, recordProductView, addReview } = usePortal();
  const { triggerPopup } = useShopNotification();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  // Product Lookup
  const products = state.products || [];
  const contextProduct = useMemo(() => {
    return products.find(
      (p) =>
        p.id === productId ||
        p.id.replace("-catalog", "") === productId ||
        (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === productId) ||
        (p.sku && p.sku.toLowerCase() === productId.toLowerCase())
    );
  }, [products, productId]);

  // Fast direct Supabase fetch fallback for direct link / new tab visits
  const [directProduct, setDirectProduct] = useState<any | null>(null);
  const [isDirectFetching, setIsDirectFetching] = useState<boolean>(!contextProduct);
  const [directFetchAttempted, setDirectFetchAttempted] = useState<boolean>(false);

  useEffect(() => {
    let isCurrent = true;
    if (!contextProduct && productId) {
      setIsDirectFetching(true);
      fetchSingleProductFromSupabase(productId)
        .then((p) => {
          if (isCurrent) {
            if (p) {
              setDirectProduct(p);
            }
            setIsDirectFetching(false);
            setDirectFetchAttempted(true);
          }
        })
        .catch(() => {
          if (isCurrent) {
            setIsDirectFetching(false);
            setDirectFetchAttempted(true);
          }
        });
    } else if (contextProduct) {
      setIsDirectFetching(false);
      setDirectFetchAttempted(true);
    }
    return () => {
      isCurrent = false;
    };
  }, [productId, contextProduct]);

  // Ensure full catalog is loaded for suggestions if state.products has few items
  useEffect(() => {
    if (!products || products.length < 4) {
      reloadProducts(true);
    }
  }, [products?.length, reloadProducts]);

  const product = contextProduct || directProduct;
  const isPublished = product && (!product.status || product.status === "PUBLISHED" || product.status === "published");
  const isStillLoading = !product && (isProductsLoading || isDirectFetching || !directFetchAttempted);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — ReeVibes`;
      recordProductView(product.id);
    }
  }, [product?.id]);

  // Gallery of photos
  const mediaGallery = useMemo(() => {
    return (product as any)?.images && (product as any).images.length > 0
      ? (product as any).images
      : product?.image
      ? [product.image]
      : [];
  }, [product]);

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
  const [isMultiSizeMode, setIsMultiSizeMode] = useState(false);
  const [multiSizeQuantities, setMultiSizeQuantities] = useState<Record<string, number>>({});

  const handleUpdateMultiSizeQty = (size: string, delta: number) => {
    const maxStock = stockPerSize[size] ?? 0;
    setMultiSizeQuantities(prev => {
      const current = prev[size] || 0;
      const next = Math.max(0, Math.min(maxStock, current + delta));
      if (next === 0) {
        const copy = { ...prev };
        delete copy[size];
        return copy;
      }
      return { ...prev, [size]: next };
    });
  };

  const totalMultiSizeQty = useMemo(() => {
    return Object.values(multiSizeQuantities).reduce((a, b) => a + (Number(b) || 0), 0);
  }, [multiSizeQuantities]);

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

  // Coupon state on product detail page
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);

  // Eligible coupons for this product based on Product Type and/or Brand targeting
  const eligibleCoupons = useMemo(() => {
    return getEligibleCouponsForProduct(product, state.coupons || []);
  }, [product, state.coupons]);

  const userId = state.user?.id;
  const isFavorite = userId ? (state.shopWishlist[userId] || []).includes(product?.id || "") : false;

  // Reviews and Verified Buyer State
  const [productReviewRating, setProductReviewRating] = useState<number>(5);
  const [productReviewComment, setProductReviewComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const userOrders = useMemo(() => {
    if (!userId) return [];
    return state.orders[userId] || [];
  }, [userId, state.orders]);

  const verifiedOrderForProduct = useMemo(() => {
    if (!userId || !userOrders.length || !product?.id) return null;
    return userOrders.find((ord: any) =>
      (ord.items || []).some((it: any) => it.productId === product.id || it.id === product.id)
    ) || null;
  }, [userId, userOrders, product?.id]);

  const hasOrderedProduct = Boolean(verifiedOrderForProduct);

  if (isStillLoading) {
    return (
      <div className={cn("min-h-[85vh] flex flex-col items-center justify-center p-6 text-center space-y-6 transition-colors duration-300", isDark ? "bg-[#0A0A0A] text-white" : "bg-[#F9FAFB] text-slate-900")}>
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
          <ShoppingBag className="w-8 h-8 text-[#D4AF37] absolute" />
        </div>
        <div className="space-y-2 max-w-sm">
          <span className="text-[10px] uppercase font-mono font-bold tracking-[0.3em] text-[#D4AF37]">
            ReeVibes Atelier
          </span>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Curating Statement Piece...
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Retrieving master craftsmanship details, atelier sizing, and inventory availability.
          </p>
        </div>
      </div>
    );
  }

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

  // If coupon is applied, calculate coupon discount (unless wallet cashback)
  if (appliedCoupon && appliedCoupon.type !== "wallet") {
    try {
      const baseNum = Number(String(finalPrice).replace(/[^0-9]/g, "")) || Number(String(origPrice).replace(/[^0-9]/g, ""));
      if (baseNum > 0) {
        if (appliedCoupon.type === "percentage") {
          const couponDiscount = Math.round(baseNum * (Number(appliedCoupon.discount) / 100));
          origPrice = origPrice || finalPrice;
          finalPrice = `₹${Math.max(0, baseNum - couponDiscount).toLocaleString()}`;
        } else if (appliedCoupon.type === "fixed") {
          const couponDiscount = Math.min(baseNum, Number(appliedCoupon.discount));
          origPrice = origPrice || finalPrice;
          finalPrice = `₹${Math.max(0, baseNum - couponDiscount).toLocaleString()}`;
        }
      }
    } catch { /* ignore */ }
  }

  const hasDiscount = !!(pct || product.originalPrice || (appliedCoupon && appliedCoupon.type !== "wallet"));

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
      displayPct = Math.round(((origNum - finalNum) / origNum) * 100);
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
    
    // Auto copy link to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      toast.success(`Copied product link to clipboard!`);
    } catch {
      toast.success(`Copied product link to clipboard!`);
    }

    // Always open the share apps modal
    setShowShareModal(true);

    // Optionally trigger native OS share sheet if supported
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on ReeVibes Atelier!`,
          url: shareUrl,
        });
      } catch (err) {
        /* ignore cancel */
      }
    }
  };

  const handleAddToCart = () => {
    if (!userId) {
      setShowAuthModal(true);
      return;
    }
    if (isMultiSizeMode) {
      const cleanBreakdown = Object.fromEntries(
        Object.entries(multiSizeQuantities).filter(([_, q]) => Number(q) > 0)
      );
      const totalQty = Object.values(cleanBreakdown).reduce((a, b) => a + b, 0);
      if (totalQty <= 0) {
        toast.error("Please select at least 1 unit across available sizes.");
        return;
      }
      const sizeLabel = "Multi-Size (" + Object.entries(cleanBreakdown).map(([s, q]) => `${s}: ${q}`).join(", ") + ")";
      const item: any = {
        productId: product.id,
        name: product.name,
        house: product.house,
        price: displayFinalPrice,
        image: product.image,
        qty: totalQty,
        selectedSize: sizeLabel,
        sizeBreakdown: cleanBreakdown,
      };
      if (appliedCoupon) {
        item.appliedCoupon = appliedCoupon.code;
        if (appliedCoupon.type === "wallet") {
          item.cashbackAmount = appliedCoupon.discount;
        }
      }
      addToShopCart(item);
      triggerPopup(
        `${product.name} (Bulk: ${totalQty} units) added to bag!`,
        () => removeFromShopCart(product.id, sizeLabel),
        `${product.name} removed from bag.`,
        () => addToShopCart(item),
        `${product.name} added to bag!`
      );
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size before adding to bag.");
      return;
    }
    const item: any = {
      productId: product.id,
      name: product.name,
      house: product.house,
      price: displayFinalPrice,
      image: product.image,
      qty: quantity,
      selectedSize,
    };
    if (appliedCoupon) {
      item.appliedCoupon = appliedCoupon.code;
      if (appliedCoupon.type === "wallet") {
        item.cashbackAmount = appliedCoupon.discount;
      }
    }
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
    if (isMultiSizeMode) {
      const cleanBreakdown = Object.fromEntries(
        Object.entries(multiSizeQuantities).filter(([_, q]) => Number(q) > 0)
      );
      const totalQty = Object.values(cleanBreakdown).reduce((a, b) => a + b, 0);
      if (totalQty <= 0) {
        toast.error("Please select at least 1 unit across available sizes.");
        return;
      }
      const sizeLabel = "Multi-Size (" + Object.entries(cleanBreakdown).map(([s, q]) => `${s}: ${q}`).join(", ") + ")";
      const item: any = {
        productId: product.id,
        name: product.name,
        house: product.house,
        price: displayFinalPrice,
        image: product.image,
        qty: totalQty,
        selectedSize: sizeLabel,
        sizeBreakdown: cleanBreakdown,
      };
      if (appliedCoupon) {
        item.appliedCoupon = appliedCoupon.code;
        if (appliedCoupon.type === "wallet") {
          item.cashbackAmount = appliedCoupon.discount;
        }
      }
      addToShopCart(item);
      navigate({
        to: "/cart",
        search: {
          buyNow: "true",
          productId: product.id,
          size: sizeLabel,
          coupon: appliedCoupon ? appliedCoupon.code : undefined
        } as any,
      });
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size before proceeding.");
      return;
    }
    const item: any = {
      productId: product.id,
      name: product.name,
      house: product.house,
      price: displayFinalPrice,
      image: product.image,
      qty: quantity,
      selectedSize,
    };
    if (appliedCoupon) {
      item.appliedCoupon = appliedCoupon.code;
      if (appliedCoupon.type === "wallet") {
        item.cashbackAmount = appliedCoupon.discount;
      }
    }
    addToShopCart(item);
    navigate({
      to: "/cart",
      search: {
        buyNow: "true",
        productId: product.id,
        size: selectedSize,
        coupon: appliedCoupon ? appliedCoupon.code : undefined
      } as any,
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

  // Related products calculation with robust multi-layer fallback
  const relatedProducts = useMemo(() => {
    const catalogSource = (products && products.length > 0) ? products : (PRODUCTS || []);
    if (!catalogSource || catalogSource.length === 0) return [];
    
    // 1. Same category, type, gender, or house/brand matches
    let matches = catalogSource.filter((p) =>
      p.id !== product?.id &&
      (!p.status || p.status === "PUBLISHED" || p.status === "published") &&
      (
        (p.category && product?.category && p.category.toLowerCase() === product?.category.toLowerCase()) ||
        (p.type && product?.type && p.type.toLowerCase() === product?.type.toLowerCase()) ||
        (p.gender && product?.gender && p.gender.toLowerCase() === product?.gender.toLowerCase()) ||
        (p.house && product?.house && p.house.toLowerCase() === product?.house.toLowerCase())
      )
    );

    // 2. If fewer than 4 matches, fill with other published products from catalogSource
    if (matches.length < 4) {
      const remaining = catalogSource.filter((p) =>
        p.id !== product?.id &&
        (!p.status || p.status === "PUBLISHED" || p.status === "published") &&
        !matches.some((m) => m.id === p.id)
      );
      matches = [...matches, ...remaining];
    }

    // 3. If still fewer than 4, fill from baseline PRODUCTS
    if (matches.length < 4 && PRODUCTS && PRODUCTS.length > 0) {
      const baseline = PRODUCTS.filter((p) =>
        p.id !== product?.id &&
        !matches.some((m) => m.id === p.id)
      );
      matches = [...matches, ...baseline];
    }

    return matches.slice(0, 4);
  }, [products, product?.id, product?.category, product?.type, product?.gender, product?.house]);

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

              {/* Desktop top-right overlay (Share button only) */}
              <div className="hidden md:flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-black/40 dark:bg-black/60 text-white backdrop-blur-md hover:scale-105 transition-all border border-white/20 shadow-lg cursor-pointer"
                  title="Share product link"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile top-right overlay (Wishlist icon first, Share icon below) */}
              <div className="flex md:hidden flex-col gap-2 pointer-events-auto items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle();
                  }}
                  className={cn(
                    "p-2.5 rounded-full backdrop-blur-md hover:scale-105 transition-all border shadow-lg cursor-pointer",
                    isFavorite
                      ? "bg-red-500/80 text-white border-red-400"
                      : "bg-black/40 dark:bg-black/60 text-white border-white/20"
                  )}
                  title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={cn("w-5 h-5", isFavorite && "fill-current text-white")} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
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
              <Link
                to="/categories"
                search={{ brand: product.house || product.brand } as any}
                className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] hover:underline hover:text-gold cursor-pointer transition-colors"
                title={`Explore all pieces by ${product.house || product.brand || "brand"}`}
              >
                {product.house || product.brand || "REEVIBES ATELIER"}
              </Link>
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

            {/* ─── ELIGIBLE COUPON OFFERS & CASHBACK CARD ─── */}
            {eligibleCoupons.length > 0 && (
              <div className="flex flex-col gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-background to-amber-500/5 border border-[#D4AF37]/30 shadow-[0_4px_20px_-4px_rgba(212,175,55,0.15)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    <Ticket className="w-4 h-4" /> Available Offers & Coupons
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {eligibleCoupons.length} offer{eligibleCoupons.length > 1 ? "s" : ""} available
                  </span>
                </div>

                <div className="space-y-2">
                  {eligibleCoupons.map((coupon) => {
                    const isApplied = appliedCoupon?.code === coupon.code;
                    const isCashback = coupon.type === "wallet";

                    return (
                      <div
                        key={coupon.code}
                        className={cn(
                          "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border transition-all",
                          isApplied
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                            : "bg-white/5 border-white/10 hover:border-[#D4AF37]/40"
                        )}
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-extrabold text-sm tracking-wider text-accent bg-accent/15 px-2 py-0.5 rounded border border-accent/30">
                                {coupon.code}
                              </span>
                              <span className="text-xs font-bold text-foreground">
                                {coupon.type === "percentage"
                                  ? `${coupon.discount}% OFF`
                                  : coupon.type === "fixed"
                                  ? `₹${coupon.discount.toLocaleString()} FLAT OFF`
                                  : `₹${coupon.discount.toLocaleString()} Wallet Cashback`}
                              </span>
                              {coupon.productType && (
                                <span className="text-[9px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-medium">
                                  {coupon.productType}
                                </span>
                              )}
                              {coupon.brand && (
                                <span className="text-[9px] bg-blue-500/15 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-medium">
                                  {coupon.brand}
                                </span>
                              )}
                            </div>
                            <CouponExpiryBadge expiryDate={coupon.expiryDate} />
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {isCashback
                              ? `Receive ₹${coupon.discount.toLocaleString()} cashback directly in your ReeVibes wallet when this piece is delivered.`
                              : coupon.productType && coupon.brand
                              ? `Exclusive offer valid on ${coupon.brand} ${coupon.productType}.`
                              : coupon.productType
                              ? `Applicable on all ${coupon.productType}.`
                              : coupon.brand
                              ? `Exclusive brand coupon for ${coupon.brand}.`
                              : "Storewide offer applicable on this item."}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (isApplied) {
                              setAppliedCoupon(null);
                              toast.info(`Coupon ${coupon.code} removed.`);
                            } else {
                              setAppliedCoupon(coupon);
                              if (isCashback) {
                                toast.success(`🎉 Cashback offer applied! You will receive ₹${coupon.discount.toLocaleString()} in your ReeVibes wallet upon delivery.`);
                              } else {
                                toast.success(`🎉 Coupon ${coupon.code} applied! Price reduced.`);
                              }
                            }
                          }}
                          className={cn(
                            "self-start sm:self-auto text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full cursor-pointer transition-all shrink-0",
                            isApplied
                              ? "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 shadow-md font-extrabold"
                              : "bg-white/10 text-foreground hover:bg-white/20 border border-white/10"
                          )}
                        >
                          {isApplied ? "Applied ✓" : "Apply Coupon"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Live Applied Cashback Banner */}
                {appliedCoupon && appliedCoupon.type === "wallet" && (
                  <div className="flex items-center gap-2 mt-1 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <Wallet className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>
                      ReeVibes Wallet Cashback: <strong>₹{appliedCoupon.discount.toLocaleString()}</strong> will be credited to your account upon successful delivery.
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="h-px w-full bg-border/40" />

            {/* Size Selector */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold uppercase tracking-widest text-[#D4AF37]">
                  {isMultiSizeMode ? "MULTI-SIZE / BULK SELECTION" : "SELECT SIZE"}
                </span>

                {/* Multi-Size / Bulk Selection Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMultiSizeMode(prev => !prev);
                    if (!isMultiSizeMode) {
                      setMultiSizeQuantities(selectedSize ? { [selectedSize]: quantity } : {});
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[11px] font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isMultiSizeMode ? "Single Size Mode" : "Multi-Size / Bulk Order"}</span>
                </button>
              </div>

              {isMultiSizeMode ? (
                /* Multi-Size Rows Layout */
                <div className="space-y-2.5 pt-1">
                  <div className="text-[11px] text-muted-foreground flex justify-between px-1">
                    <span>Select multiple sizes & set quantities for each:</span>
                    <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                      {totalStock > 0 ? `${totalStock} pieces in stock` : "Out of Stock"}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {availableSizes.map((size: string) => {
                      const stock = stockPerSize[size] ?? 0;
                      const isOutOfStock = stock <= 0;
                      const qtyForSize = multiSizeQuantities[size] || 0;

                      return (
                        <div
                          key={size}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-2xl border transition-all duration-200",
                            qtyForSize > 0
                              ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-sm"
                              : isDark
                              ? "border-zinc-800 bg-zinc-900/60"
                              : "border-slate-200 bg-slate-50/70",
                            isOutOfStock && "opacity-50 pointer-events-none"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center font-extrabold text-base text-foreground">
                              {size}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-foreground">
                                Size {size}
                              </div>
                              <div className="text-[10px]">
                                {isOutOfStock ? (
                                  <span className="text-rose-500 font-semibold">Out of Stock</span>
                                ) : (
                                  <span className="text-emerald-500 dark:text-emerald-400 font-medium">
                                    {stock} available
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Stepper for this size */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-border/70 rounded-xl overflow-hidden bg-background">
                              <button
                                type="button"
                                disabled={qtyForSize <= 0}
                                onClick={() => handleUpdateMultiSizeQty(size, -1)}
                                className="p-2 hover:bg-accent/10 transition-colors text-foreground disabled:opacity-30 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-9 text-center font-bold text-xs text-foreground">
                                {qtyForSize}
                              </span>
                              <button
                                type="button"
                                disabled={qtyForSize >= stock}
                                onClick={() => handleUpdateMultiSizeQty(size, 1)}
                                className="p-2 hover:bg-accent/10 transition-colors text-foreground disabled:opacity-30 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {qtyForSize >= stock && stock > 0 && (
                              <span className="text-[9px] font-semibold text-amber-500 uppercase tracking-wider">
                                Max
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Live Bulk Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted-foreground">Total Selected: </span>
                      <span className="font-bold text-foreground">
                        {totalMultiSizeQty} {totalMultiSizeQty === 1 ? "unit" : "units"}
                      </span>
                      {totalMultiSizeQty > 0 && (
                        <span className="text-[10px] text-accent block font-medium">
                          ({Object.entries(multiSizeQuantities).filter(([_, q]) => q > 0).map(([s, q]) => `${s}: ${q}`).join(", ")})
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground">Subtotal: </span>
                      <span className="font-serif font-bold text-sm text-[#D4AF37]">
                        ₹{((Number(String(displayFinalPrice).replace(/[^0-9.]/g, "")) || 0) * (totalMultiSizeQty || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Single Size Grid */
                <>
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

                  {/* Single Size Quantity Selector */}
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
                </>
              )}
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
                <ShoppingCart className="w-4 h-4" />
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
                          <Layers className="w-4 h-4 text-[#D4AF37]" />
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

        {/* ─── CUSTOMER RATINGS & VERIFIED BUYER REVIEWS ────────────────────── */}
        <div className="mt-16 pt-10 border-t border-border/40 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                AUTHENTIC EXPERIENCES
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground mt-0.5">
                Customer Ratings & Reviews
              </h3>
            </div>
            
            {/* Aggregate Score Pill */}
            {effectiveRating && (
              <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-border/40 px-4 py-2 rounded-2xl w-fit">
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
                <span className="font-bold text-sm text-foreground">{effectiveRating} / 5</span>
                {effectiveReviewCount && (
                  <span className="text-xs text-muted-foreground">({effectiveReviewCount} {effectiveReviewCount === 1 ? "Review" : "Reviews"})</span>
                )}
              </div>
            )}
          </div>

          {/* Rate & Write Review Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-border/40 space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-foreground">Share Your Experience</h4>
                  <p className="text-xs text-muted-foreground">Exclusive to verified purchasers who ordered this piece</p>
                </div>
              </div>

              {hasOrderedProduct && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Buyer</span>
                </span>
              )}
            </div>

            {hasOrderedProduct ? (
              <div className="space-y-5">
                {/* Star Rating Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setProductReviewRating(starVal)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={cn(
                            "w-7 h-7 transition-colors",
                            starVal <= productReviewRating
                              ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_6px_rgba(251,191,36,0.4)]"
                              : "text-zinc-500 fill-transparent hover:text-amber-300"
                          )}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#D4AF37] ml-2">
                      {productReviewRating === 5 && "Outstanding — 5 Stars"}
                      {productReviewRating === 4 && "Very Good — 4 Stars"}
                      {productReviewRating === 3 && "Average — 3 Stars"}
                      {productReviewRating === 2 && "Below Expectations — 2 Stars"}
                      {productReviewRating === 1 && "Poor — 1 Star"}
                    </span>
                  </div>
                </div>

                {/* Comment Textarea */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      Write Review
                    </label>
                    <span className="text-[10px] font-mono text-muted-foreground">{productReviewComment.length} / 500</span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={productReviewComment}
                    onChange={(e) => setProductReviewComment(e.target.value)}
                    placeholder="Tell us about the fit, texture, drape, and styling of this creation..."
                    className="w-full p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/60 border border-border/50 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#D4AF37] resize-none transition-colors"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={!productReviewComment.trim() || isSubmittingReview}
                    onClick={async () => {
                      if (!productReviewComment.trim()) {
                        toast.error("Please provide a written review.");
                        return;
                      }
                      setIsSubmittingReview(true);
                      try {
                        addReview(product.id, {
                          userId,
                          userEmail: state.user?.email,
                          userName: `${state.user?.firstName || ''} ${state.user?.lastName || ''}`.trim() || "Verified Buyer",
                          orderId: verifiedOrderForProduct?.id,
                          productName: product.name,
                          productImage: product.image,
                          rating: productReviewRating,
                          comment: productReviewComment.trim(),
                        });
                        toast.success("Thank you! Your verified review and rating have been recorded.");
                        setProductReviewComment("");
                        setProductReviewRating(5);
                      } catch {
                        toast.error("Failed to submit review. Please try again.");
                      } finally {
                        setIsSubmittingReview(false);
                      }
                    }}
                    className={cn(
                      "px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md",
                      productReviewComment.trim() && !isSubmittingReview
                        ? "bg-[#D4AF37] hover:bg-[#c49f2f] text-black hover:scale-105 active:scale-95"
                        : "bg-black/10 dark:bg-white/10 text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Verified Review"}
                  </button>
                </div>
              </div>
            ) : !userId ? (
              /* Not Signed In Notice */
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-foreground">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Only verified purchasers who have ordered this piece can share their rating and review. Please sign in with the account used for purchasing.
                  </p>
                </div>
                <Link
                  to="/login"
                  search={{ redirect: typeof window !== "undefined" ? window.location.pathname : "" } as any}
                  className="px-5 py-2 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#c49f2f] transition-all shrink-0 cursor-pointer shadow-md"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              /* Signed In but Has Not Ordered Notice */
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/40 text-foreground">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Reviews on ReeVibes are reserved exclusively for members who have purchased this creation. Once your order is placed, you can share your feedback and rating anytime.
                  </p>
                </div>
                <Link
                  to="/orders"
                  search={{ tab: "history" }}
                  className="px-5 py-2 rounded-full border border-accent/40 bg-accent/10 text-accent font-extrabold text-xs uppercase tracking-wider hover:bg-accent hover:text-white transition-all shrink-0 cursor-pointer shadow-sm"
                >
                  My Orders
                </Link>
              </div>
            )}
          </div>

          {/* Approved Reviews Feed */}
          <div className="space-y-4">
            {approvedReviews.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-black/5 dark:bg-white/5 border border-border/40 space-y-2">
                <p className="font-serif text-lg font-bold text-foreground">No Customer Reviews Yet</p>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Be the first verified purchaser to share feedback and styling impressions on this creation.
                </p>
              </div>
            ) : (
              approvedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 sm:p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-border/40 space-y-3 transition-colors hover:border-[#D4AF37]/30"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-serif font-bold text-sm text-foreground">
                        {rev.userName || "Verified Buyer"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-mono font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Verified Buyer</span>
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {rev.date}
                    </span>
                  </div>

                  <div className="flex items-center text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < (rev.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-transparent text-zinc-600"
                        )}
                      />
                    ))}
                    <span className="text-xs font-bold text-foreground ml-1">{rev.rating || 5}.0</span>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  {((rev.images && rev.images.length > 0) || (rev.videos && rev.videos.length > 0)) && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(rev.images || []).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Review attachment"
                          className="w-16 h-16 object-cover rounded-xl border border-border/40"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
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

      {/* ─── ELEGANT SHARE APPS MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "relative w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-5 overflow-hidden",
                isDark ? "bg-[#121212] border-white/15 text-white" : "bg-white border-slate-200 text-slate-900"
              )}
            >
              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg leading-tight">Share Product</h3>
                    <p className="text-xs text-muted-foreground">Link auto-copied! Select an app to share</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Snippet Preview */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/30">
                <img src={mediaGallery[0]} alt="" className="w-14 h-16 rounded-xl object-cover border border-border/40" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">{product.house || "REEVIBES"}</div>
                  <div className="text-xs font-serif font-bold truncate">{product.name}</div>
                  <div className="text-xs font-mono font-extrabold text-foreground mt-0.5">{displayFinalPrice}</div>
                </div>
              </div>

              {/* Share Apps Grid */}
              <div className="grid grid-cols-4 gap-3 py-1">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.name} on ReeVibes: https://reevibes.com/product/${product.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-all border border-emerald-500/20 hover:scale-105 cursor-pointer group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[11px] font-bold text-foreground">WhatsApp</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} on ReeVibes Atelier!`)}&url=${encodeURIComponent(`https://reevibes.com/product/${product.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 transition-all border border-sky-500/20 hover:scale-105 cursor-pointer group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform font-black text-sm">
                    𝕏
                  </div>
                  <span className="text-[11px] font-bold text-foreground">X (Twitter)</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://reevibes.com/product/${product.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 transition-all border border-blue-600/20 hover:scale-105 cursor-pointer group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform font-extrabold text-lg">
                    f
                  </div>
                  <span className="text-[11px] font-bold text-foreground">Facebook</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(`ReeVibes: ${product.name}`)}&body=${encodeURIComponent(`I thought you'd love this product on ReeVibes Atelier!\n\n${product.name}\nhttps://reevibes.com/product/${product.id}`)}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-all border border-amber-500/20 hover:scale-105 cursor-pointer group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-foreground">Email</span>
                </a>
              </div>

              {/* Direct Copy Link Bar */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground block">
                  Product Link (Auto-Copied)
                </label>
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/40">
                  <input
                    type="text"
                    readOnly
                    value={`https://reevibes.com/product/${product.id}`}
                    className="flex-1 bg-transparent px-3 text-xs font-mono text-foreground outline-none select-all truncate"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(`https://reevibes.com/product/${product.id}`);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 3000);
                        toast.success("Link copied to clipboard!");
                      } catch {}
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            <ShoppingCart className="w-4 h-4" />
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
