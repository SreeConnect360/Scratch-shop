import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePortal } from "@/lib/portal-state";
import { useShopNotification } from "./_shop";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Star,
  Check,
  Truck,
  Shield,
  RotateCcw,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { FadeUp } from "@/components/motion/Reveal";

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

    // Check if it's a heading
    const isMarkdownHeading = trimmed.startsWith("#");
    const isBracketHeading = trimmed.startsWith("[") && trimmed.endsWith("]");
    
    // A plain heading: short (<45 chars), no tabs, no colons, no bullet indicators, and not just a number
    const isPlainHeading = trimmed.length < 45 && 
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

  // Filter out any sections that ended up with no lines
  return sections.filter(s => s.lines.length > 0);
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
  } else {
    const knownPrefixes = [
      "Material composition", "Country of Origin", "Fit type", "Sleeve type",
      "Collar style", "Fitting type", "Style Name", "Neck Style", "Sleeve Type",
      "Shirt Form Type", "Sport Type", "Apparel Closure Type", "Cuff Style",
      "Apparel Occasion and Lifestyle", "Occasion description", "Brand Name",
      "Model Name", "Style Number", "Unit Count", "Manufacturer Part Number",
      "Age Range Description", "Item Type Name", "Best Sellers Rank"
    ];
    
    for (const prefix of knownPrefixes) {
      if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
        key = prefix;
        value = trimmed.substring(prefix.length).trim();
        break;
      }
    }
  }

  if (key && value) {
    return (
      <div className="grid grid-cols-3 py-2 border-b border-white/5 last:border-0 text-xs">
        <span className="font-semibold text-muted-foreground col-span-1 pr-2">{key}</span>
        <span className="text-foreground/90 col-span-2">{value}</span>
      </div>
    );
  }

  return (
    <div className="py-1 text-xs text-foreground/80 leading-relaxed list-item list-inside ml-1">
      {trimmed}
    </div>
  );
}

function ProductDetail() {
  const productId = Route.useParams().productId;
  const { state, toggleShopWishlist, addToShopCart, removeFromShopCart, recordProductView, addReview } = usePortal();
  const { triggerPopup } = useShopNotification();
  const navigate = useNavigate();
  const infoEndRef = useRef<HTMLDivElement>(null);
  const [showRelated, setShowRelated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowRelated(true);
        }
      },
      { threshold: 0.05 }
    );

    const el = infoEndRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  const userId = state.user?.id;
  const userOrders = state.user ? (state.orders[state.user.id] || []) : [];
  const hasOrdered = userOrders.some(order =>
    order.items.some(item => item.productId === productId)
  );

  // Find product in catalog (support friendly slugs, SKUs, and IDs)
  const products = state.products || [];
  const product = products.find((p) => 
    p.id === productId || 
    p.id.replace("-catalog", "") === productId || 
    (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === productId) ||
    (p.sku && p.sku.toLowerCase() === productId.toLowerCase())
  );
  const isPublished = product && (!product.status || product.status === "PUBLISHED" || product.status === "published");

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — ReeVibes`;
    }
  }, [product]);

  if (!product || !isPublished) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl">Product Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The requested statement piece is not in our current catalog.
        </p>
        <Link
          to="/"
          className="mt-6 border border-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Calculate discounted price if applicable
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
    } catch { /* ignore */ }
  }

  const ensureRupees = (val: any) => {
    if (val === undefined || val === null) return "";
    const clean = String(val).trim();
    return clean.startsWith("₹") ? clean : `₹${clean}`;
  };

  const displayFinalPrice = ensureRupees(finalPrice);
  const displayOrigPrice = ensureRupees(origPrice);

  // Calculate final discount percentage if we have both prices
  let displayPct = pct;
  if (hasDiscount && !displayPct) {
    try {
      const origNumeric = Number(String(origPrice).replace(/[^0-9]/g, ""));
      const finalNumeric = Number(String(finalPrice).replace(/[^0-9]/g, ""));
      if (origNumeric && finalNumeric && origNumeric > finalNumeric) {
        displayPct = Math.round(((origNumeric - finalNumeric) / origNumeric) * 100);
      }
    } catch { /* ignore */ }
  }

  // Gallery of photos
  const mediaGallery = ((product as any).images && (product as any).images.length > 0) ? (product as any).images : [product.image];

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", backgroundPosition: "0% 0%" });
  const [openInfoSections, setOpenInfoSections] = useState<Record<number, boolean>>({ 0: true });

  // Record view on render
  useEffect(() => {
    recordProductView(product.id);
  }, [product.id]);

  // Size details & stocks
  const availableSizes = product.sizes || ["S", "M", "L", "XL"];
  const stockPerSize = product.stockPerSize || { S: 5, M: 8, L: 4, XL: 2 };

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [bulkSelection, setBulkSelection] = useState<Record<string, number>>({}); // maps size -> quantity
  const [pincode, setPincode] = useState("");
  const [deliveryEstimation, setDeliveryEstimation] = useState("");
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(0);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [postSizeAction, setPostSizeAction] = useState<"cart" | "buy" | null>(null);

  const userAddresses = userId ? (state.addresses[userId] || []) : [];

  // Auto select major address initially
  useEffect(() => {
    if (userId && state.majorAddresses?.[userId]) {
      const major = state.majorAddresses[userId];
      const idx = userAddresses.indexOf(major);
      if (idx !== -1) {
        setSelectedAddrIdx(idx);
      }
    }
  }, [userId, state.majorAddresses, userAddresses]);

  const parseSingleAddress = (addrStr: string) => {
    try {
      if (addrStr.trim().startsWith("{")) {
        return JSON.parse(addrStr);
      }
    } catch (e) {}
    return {
      name: state.user ? `${state.user.firstName} ${state.user.lastName}` : "Customer",
      address: addrStr,
      phone: state.user?.phone || ""
    };
  };

  const handlePincodeCheck = () => {
    const pin = pincode.trim();
    if (/^\d{6}$/.test(pin)) {
      const firstDigit = pin[0];
      let days = 3;
      if (firstDigit === '5') {
        days = 2; // Southern region (AP, Telangana, Karnataka)
      } else if (firstDigit === '6') {
        days = 3; // Deep South (TN, Kerala)
      } else if (['1', '2', '3', '4', '7', '8'].includes(firstDigit)) {
        days = 4; // Northern, Western, Eastern regions
      } else {
        days = 6; // Far regions/NE/Military
      }
      
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + days);
      
      // If delivery lands on a Sunday, push to Monday
      if (deliveryDate.getDay() === 0) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
      }
      
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      const dateStr = deliveryDate.toLocaleDateString('en-IN', options);
      
      setDeliveryEstimation(`Estimated Delivery: ${dateStr} via Shiprocket Express`);
    } else {
      setDeliveryEstimation("Please enter a valid 6-digit Pincode.");
    }
  };

  // Reviews & ratings
  const reviews = state.productReviews[product.id] || [];
  const approvedReviews = reviews.filter((r) => r.status === "Approved");
  const averageRating =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : "5.0";

  // New review form states
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user) {
      toast.error("Please sign in to write a review.");
      return;
    }
    if (!commentInput.trim()) return;

    addReview(product.id, {
      userName: `${state.user.firstName} ${state.user.lastName}`,
      rating: ratingInput,
      comment: commentInput,
    });
    setCommentInput("");
    toast.success("Thank you! Your review has been added.");
  };

  // Magnifying Zoom Viewer on Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", backgroundPosition: "0% 0%" });
  };

  // Actions
  const isFavorite = userId ? (state.shopWishlist[userId] || []).includes(product.id) : false;

  const handleWishlistToggle = () => {
    if (!userId) {
      toast.error("Please sign in to manage your wishlist.");
      return;
    }
    toggleShopWishlist(userId, product.id);
    triggerPopup(
      !isFavorite ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist.`,
      () => toggleShopWishlist(userId, product.id),
      !isFavorite ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist!`,
      () => toggleShopWishlist(userId, product.id),
      !isFavorite ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist.`
    );
  };

  const handleAddToCart = () => {
    if (isMultiSelect) {
      const selectedSizes = Object.keys(bulkSelection).filter(sz => bulkSelection[sz] > 0);
      if (selectedSizes.length === 0) {
        toast.error("Please select at least one size and quantity.");
        return;
      }
      selectedSizes.forEach(sz => {
        const item = {
          productId: product.id,
          name: product.name,
          house: product.house,
          price: product.price,
          image: product.image,
          qty: bulkSelection[sz],
          selectedSize: sz,
        };
        addToShopCart(item);
      });
      triggerPopup(
        `Added ${selectedSizes.length} variants to cart!`,
        () => {
          selectedSizes.forEach(sz => removeFromShopCart(product.id, sz));
        },
        `Removed ${selectedSizes.length} variants from cart.`,
        () => {
          selectedSizes.forEach(sz => {
            addToShopCart({
              productId: product.id,
              name: product.name,
              house: product.house,
              price: product.price,
              image: product.image,
              qty: bulkSelection[sz],
              selectedSize: sz,
            });
          });
        },
        `Added ${selectedSizes.length} variants to cart!`
      );
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
        selectedSize,
      };
      addToShopCart(item);
      triggerPopup(
        `${product.name} (${selectedSize}) added to cart!`,
        () => removeFromShopCart(product.id, selectedSize),
        `${product.name} (${selectedSize}) removed from cart.`,
        () => addToShopCart(item),
        `${product.name} (${selectedSize}) added to cart!`
      );
    }
  };

  const handleBuyNow = () => {
    if (isMultiSelect) {
      const selectedSizes = Object.keys(bulkSelection).filter(sz => bulkSelection[sz] > 0);
      if (selectedSizes.length === 0) {
        toast.error("Please select at least one size and quantity.");
        return;
      }
      selectedSizes.forEach(sz => {
        addToShopCart({
          productId: product.id,
          name: product.name,
          house: product.house,
          price: product.price,
          image: product.image,
          qty: bulkSelection[sz],
          selectedSize: sz,
        });
      });
      toast.success(`Proceeding to checkout with ${selectedSizes.length} variants!`);
      navigate({
        to: "/cart",
        search: { buyNow: "true" } as any
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
        selectedSize,
      });
      toast.success(`${product.name} (${selectedSize}) added to cart!`);
      navigate({
        to: "/cart",
        search: { buyNow: "true", productId: product.id, size: selectedSize } as any
      });
    }
  };

  // Related products recommendation (only published products)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category && (!p.status || p.status === "PUBLISHED" || p.status === "published"))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 md:py-12 space-y-12 md:space-y-16">
      {/* Back Button */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Side: Images sliders & Zoom */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 self-start flex gap-4 w-full max-h-[70vh] lg:max-h-[calc(100vh-140px)]">
          {/* Vertical Thumbnail Gallery on the left side */}
          {mediaGallery.length > 1 && (
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 shrink-0 scrollbar-none justify-start max-h-[70vh] lg:max-h-full">
              {mediaGallery.map((m: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveMediaIdx(idx)}
                  className={`w-16 h-20 border overflow-hidden shrink-0 rounded-xl transition-all duration-300 ${
                    activeMediaIdx === idx
                      ? "border-accent scale-95 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <img src={m} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Image on the right side */}
          <div
            className="relative bg-zinc-950 aspect-[3/4] lg:aspect-auto lg:flex-1 lg:min-h-0 overflow-hidden rounded-3xl border border-border-subtle cursor-zoom-in flex items-center justify-center flex-1"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={mediaGallery[activeMediaIdx]}
              className="max-w-full max-h-full object-contain select-none pointer-events-none"
            />
            {/* Magnifier zoom portal */}
            <div
              className="absolute inset-0 hidden pointer-events-none transition-shadow bg-no-repeat duration-100"
              style={{
                ...zoomStyle,
                backgroundImage: `url(${mediaGallery[activeMediaIdx]})`,
                backgroundSize: "200%",
              }}
            />

            {/* Carousel Left/Right Buttons */}
            {mediaGallery.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveMediaIdx((prev) => (prev === 0 ? mediaGallery.length - 1 : prev - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2.5 rounded-full hover:bg-black transition-colors z-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveMediaIdx((prev) => (prev === mediaGallery.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2.5 rounded-full hover:bg-black transition-colors z-10"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="lg:col-span-5 space-y-6">
          <FadeUp>
            <div className="text-xs uppercase tracking-widest text-accent font-bold">
              {product.house}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl mt-2 text-foreground">{product.name}</h1>
            
            {(product as any).description && (
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed border-l-2 border-accent/30 pl-3 italic">
                {(product as any).description}
              </p>
            )}

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-3 text-sm">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 fill-current ${i < Math.floor(Number(averageRating)) ? "text-amber-400" : "text-zinc-600"}`}
                  />
                ))}
              </div>
              <span className="font-semibold">{averageRating}</span>
              <span className="text-muted-foreground text-xs">
                ({approvedReviews.length} reviews)
              </span>
            </div>

            <div className="space-y-1.5 mt-4">
              {hasDiscount ? (
                <>
                  <div className="text-3xl md:text-4xl font-serif text-accent font-semibold">
                    {displayFinalPrice}
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <span>M.R.P.</span>
                    <span className="line-through">{displayOrigPrice}</span>
                    <span className="font-bold text-red-500 ml-1">({displayPct}% OFF)</span>
                  </div>
                </>
              ) : (
                <div className="text-3xl md:text-4xl font-serif text-accent font-semibold">
                  {displayFinalPrice}
                </div>
              )}
            </div>
          </FadeUp>


          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold">
              <div className="flex items-center gap-2">
                <span>Select Size</span>
                {isMultiSelect && (
                  <span className="bg-accent/20 text-accent text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                    Bulk Mode
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMultiSelect(!isMultiSelect);
                  setSelectedSize(null);
                  setBulkSelection({});
                }}
                className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  isMultiSelect
                    ? "bg-accent text-white border-accent animate-pulse"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
                }`}
              >
                {isMultiSelect ? "✓ Multi Select On" : "＋ Multi Size Select"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const hasStock = (stockPerSize[size] ?? 0) > 0;
                const isSelected = isMultiSelect
                  ? bulkSelection[size] !== undefined
                  : selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={!hasStock}
                    onClick={() => {
                      if (isMultiSelect) {
                        setBulkSelection(prev => {
                          const next = { ...prev };
                          if (next[size] !== undefined) {
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
                    }}
                    className={`text-xs py-2 px-5 font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                      !hasStock
                        ? "opacity-35 cursor-not-allowed bg-zinc-800 line-through text-muted-foreground"
                        : isSelected
                          ? "bg-accent text-white shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                          : "bg-white/5 dark:bg-white/5 border border-white/10 hover:bg-white/10 text-foreground"
                    }`}
                  >
                    {size}
                    {isMultiSelect && isSelected && (
                      <span className="ml-1.5 text-[9px] font-mono bg-white/20 px-1.5 py-0.5 rounded-full">
                        x{bulkSelection[size]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          {!isMultiSelect ? (
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider font-semibold">Quantity</label>
              <div className="flex items-center bg-white/5 dark:bg-white/5 border border-white/10 w-32 rounded-full overflow-hidden p-0.5 backdrop-blur-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex-1 py-1.5 text-center hover:bg-white/10 dark:hover:bg-white/10 rounded-full transition-colors font-bold text-sm text-foreground cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-semibold text-xs text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => {
                    const maxStock = selectedSize ? (stockPerSize[selectedSize] ?? 0) : 10;
                    setQuantity((q) => (q < maxStock ? q + 1 : q));
                  }}
                  className="flex-1 py-1.5 text-center hover:bg-white/10 dark:hover:bg-white/10 rounded-full transition-colors font-bold text-sm text-foreground cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 bg-white/5 p-4 border border-white/10 rounded-2xl backdrop-blur-md">
              <label className="block text-xs uppercase tracking-wider font-semibold">Selected Quantities</label>
              {Object.keys(bulkSelection).length === 0 ? (
                <p className="text-[11px] text-muted-foreground italic text-center py-2">Click on sizes above to select them and set quantities.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {Object.keys(bulkSelection).map(sz => (
                    <div key={sz} className="flex justify-between items-center bg-zinc-950/50 p-2.5 border border-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-sm text-white">{sz}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">(Stock: {stockPerSize[sz]} available)</span>
                      </div>
                      <div className="flex items-center bg-white/5 border border-white/10 w-28 rounded-full overflow-hidden p-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setBulkSelection(prev => {
                              const next = { ...prev };
                              if (next[sz] > 1) {
                                next[sz]--;
                              }
                              return next;
                            });
                          }}
                          className="flex-1 py-1 text-center hover:bg-white/10 rounded-full transition-colors font-bold text-xs text-foreground cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-semibold text-xs text-foreground">
                          {bulkSelection[sz]}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const maxStock = stockPerSize[sz] ?? 10;
                            setBulkSelection(prev => {
                              const next = { ...prev };
                              if (next[sz] < maxStock) {
                                next[sz]++;
                              }
                              return next;
                            });
                          }}
                          className="flex-1 py-1 text-center hover:bg-white/10 rounded-full transition-colors font-bold text-xs text-foreground cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-4 rounded-full transition-all flex items-center justify-center border backdrop-blur-md transform hover:scale-105 active:scale-95 ${
                  isFavorite
                    ? "border-accent bg-accent/20 text-accent fill-accent"
                    : "border-white/10 bg-white/5 dark:bg-white/5 hover:border-white/20 text-foreground"
                }`}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              className="w-full bg-foreground text-background hover:bg-accent hover:text-white border border-border-subtle py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full transform hover:scale-[1.02] active:scale-[0.98] shadow-md font-semibold"
            >
              Buy It Now
            </button>
          </div>

          {/* Delivery Check Section */}
          <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <label className="block text-xs uppercase tracking-wider font-semibold">
              Delivery Estimator
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit pincode"
                className="bg-transparent border border-white/10 rounded-full px-4 py-2 text-xs outline-none focus:border-accent text-foreground flex-1"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button
                type="button"
                onClick={handlePincodeCheck}
                className="bg-accent text-white rounded-full px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-accent/90 transition-colors"
              >
                Check
              </button>
            </div>
            {deliveryEstimation && (
              <p className="text-[10px] text-accent font-semibold tracking-wider mt-1">
                {deliveryEstimation}
              </p>
            )}
          </div>

          {/* Shipping Address Section */}
          {state.user ? (
            <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold">
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-accent" /> Shipping Destination</span>
                {userAddresses.length > 0 && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {selectedAddrIdx + 1} of {userAddresses.length}
                  </span>
                )}
              </div>

              {userAddresses.length === 0 ? (
                <div className="text-center py-2 space-y-2">
                  <p className="text-[11px] text-muted-foreground italic">No shipping address added yet.</p>
                  <Link
                    to="/account"
                    search={{ tab: "addresses" }}
                    className="inline-block text-[10px] uppercase tracking-widest font-bold text-accent hover:underline"
                  >
                    + Add Shipping Address
                  </Link>
                </div>
              ) : (
                <div className="relative p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                  {userAddresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSelectedAddrIdx(prev => prev === 0 ? userAddresses.length - 1 : prev - 1)}
                      className="p-1 rounded-full bg-white/5 border border-white/10 text-accent hover:bg-accent hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  )}

                  <div className="flex-1 text-left text-xs space-y-1">
                    {(() => {
                      const parsed = parseSingleAddress(userAddresses[selectedAddrIdx]);
                      const isMajor = state.majorAddresses?.[state.user.id] === userAddresses[selectedAddrIdx];
                      return (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{parsed.name}</span>
                            {isMajor && (
                              <span className="bg-accent/20 text-accent text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded font-bold">
                                Major
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-[11px] leading-relaxed">{parsed.address}</p>
                          <div className="text-[10px] text-muted-foreground">Phone: {parsed.phone}</div>
                        </>
                      );
                    })()}
                  </div>

                  {userAddresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSelectedAddrIdx(prev => prev === userAddresses.length - 1 ? 0 : prev + 1)}
                      className="p-1 rounded-full bg-white/5 border border-white/10 text-accent hover:bg-accent hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-muted-foreground italic">
              Please <Link to="/login" className="text-accent underline">sign in</Link> to view shipping address details.
            </div>
          )}

          {/* Product trust policies */}
          <div className="space-y-4 pt-6 border-t border-border-subtle text-xs text-muted-foreground">
            <div className="space-y-4 p-5 rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 text-xs text-muted-foreground backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-accent" />
                <span>Free express delivery across India. Delivery by next 3 days.</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-accent" />
                <span>Easy 14-day hassle-free returns with Razorpay automated refunds.</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-accent" />
                <span>100% Authentic designer luxury direct from certified ateliers.</span>
              </div>
            </div>
          </div>

          {/* Product information Accordion */}
          {product.productInfo && (
            <div className="space-y-3 pt-6 border-t border-border-subtle">
              <h3 className="font-serif text-sm uppercase tracking-wider text-foreground font-semibold">Product Information</h3>
              <div className="space-y-2">
                {parseProductInfo(product.productInfo).map((section, idx) => {
                  const isOpen = !!openInfoSections[idx];
                  return (
                    <div key={idx} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md">
                      <button
                        onClick={() => setOpenInfoSections(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="w-full flex items-center justify-between p-4 text-xs font-semibold text-foreground hover:bg-white/5 transition-all text-left uppercase tracking-wider"
                      >
                        <span>{section.heading}</span>
                        <span className="text-muted-foreground">
                          {isOpen ? <Minus className="w-3.5 h-3.5 text-accent" /> : <Plus className="w-3.5 h-3.5 text-accent" />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-2 bg-black/10">
                          {section.lines.map((line, lIdx) => (
                            <div key={lIdx}>{renderLine(line)}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Scroll trigger to reveal related products */}
          <div ref={infoEndRef} className="h-1 w-full" />
        </div>
      </div>

      {/* Product reviews list & write reviews */}
      <div className="grid lg:grid-cols-3 gap-12 border-t border-border-subtle pt-12">
        <div className="space-y-6">
          <h3 className="font-serif text-2xl">Verified Customer Reviews</h3>
          <div className="liquid-glass p-6 space-y-4">
            <div className="text-3xl font-serif font-bold text-accent">{averageRating}</div>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 fill-current ${i < Math.floor(Number(averageRating)) ? "text-amber-400" : "text-zinc-600"}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {approvedReviews.length} verified ratings
            </p>
          </div>

          {/* Review input */}
          {state.user ? (
            hasOrdered ? (
              <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                <h4 className="font-serif text-lg">Write a Review</h4>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setRatingInput(stars)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${stars <= ratingInput ? "fill-current" : "text-zinc-600"}`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  required
                  className="w-full bg-white/5 dark:bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-accent rounded-xl h-24 placeholder:text-muted-foreground/50 transition-colors backdrop-blur-md"
                  placeholder="Share your experience styling this piece…"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 rounded-full text-xs uppercase font-bold tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400 font-medium tracking-wide flex items-center gap-2">
                <span>Only customers who have purchased this statement piece are eligible to write a review.</span>
              </div>
            )
          ) : (
            <div className="text-xs text-muted-foreground italic">
              Please{" "}
              <Link to="/login" className="text-accent underline">
                sign in
              </Link>{" "}
              to write a review.
            </div>
          )}
        </div>

        {/* Reviews Lists */}
        <div className="lg:col-span-2 space-y-6">
          {approvedReviews.length > 0 ? (
            <div className="divide-y divide-border-subtle/50 space-y-6">
              {approvedReviews.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 space-y-2 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-serif font-bold text-sm text-foreground">
                        {r.userName}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-3 font-mono">
                        {r.date}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 fill-current ${i < r.rating ? "text-amber-400" : "text-zinc-600"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs italic leading-relaxed text-foreground/90">"{r.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground italic py-6">
              Be the first to write a review for this statement piece.
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className={cn(
          "space-y-8 border-t border-border-subtle pt-12 transition-all duration-1000 ease-out transform",
          showRelated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
        )}>
          <FadeUp>
            <h3 className="font-serif text-2xl">You May Also Like</h3>
          </FadeUp>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => {
              const wishlist = state.shopWishlist[state.user?.id || ""] || [];
              return (
                <RelatedProductCard
                  key={p.id}
                  p={p}
                  toggleShopWishlist={toggleShopWishlist}
                  addToShopCart={addToShopCart}
                  wishlist={wishlist}
                />
              );
             })}
          </div>
        </div>
      )}

      {/* Size Selection Popup Modal */}
      {showSizePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass w-[92%] sm:w-[95%] max-w-md max-h-[90vh] md:max-h-none p-5 sm:p-6 md:p-8 shadow-[0_0_50px_rgba(212,175,55,0.25)] animate-in zoom-in-95 duration-200 border border-accent/40 rounded-3xl relative bg-background/90 text-foreground flex flex-col">
            <button
              onClick={() => {
                setShowSizePopup(false);
                setPostSizeAction(null);
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-accent p-2 transition-colors rounded-full bg-foreground/5 hover:bg-foreground/10 border border-accent/20 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5 min-h-0">
              <div className="flex gap-4">
                <img src={product.image} className="w-20 aspect-[3/4] object-cover rounded-xl border border-border-subtle shrink-0" />
                <div className="flex-1 space-y-1 min-w-0 pr-6">
                  <span className="text-[10px] uppercase tracking-widest text-accent font-bold block">{product.house}</span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-foreground leading-tight">{product.name}</h3>
                  <div className="text-sm font-semibold text-accent mt-1">{product.price}</div>
                </div>
              </div>

              <hr className="border-border-subtle" />

              {/* Size Selector in popup */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold">
                  <span>Select Size</span>
                  <span className="text-red-500 font-semibold tracking-wider text-[10px] animate-pulse">
                    {selectedSize ? `Stock: ${stockPerSize[selectedSize]} left` : "Please select a size"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {availableSizes.map((size) => {
                    const hasStock = (stockPerSize[size] ?? 0) > 0;
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        disabled={!hasStock}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSize(null);
                          } else {
                            setSelectedSize(size);
                            setQuantity(1);
                          }
                        }}
                        className={`text-xs min-w-[42px] h-9 font-semibold rounded-full transition-all duration-300 flex items-center justify-center px-3.5 ${
                          !hasStock
                            ? "opacity-35 cursor-not-allowed bg-foreground/5 line-through text-muted-foreground border border-transparent"
                            : isSelected
                              ? "bg-accent text-white shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105 border border-accent"
                              : "bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border-subtle"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector in popup */}
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider font-semibold text-center">Quantity</label>
                <div className="flex items-center bg-foreground/5 border border-border-subtle w-32 mx-auto rounded-full overflow-hidden p-0.5 backdrop-blur-md">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex-1 h-8 flex items-center justify-center hover:bg-foreground/5 rounded-full transition-colors font-bold text-sm text-foreground"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-semibold text-xs text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      const maxStock = selectedSize ? (stockPerSize[selectedSize] ?? 0) : 10;
                      setQuantity((q) => (q < maxStock ? q + 1 : q));
                    }}
                    className="flex-1 h-8 flex items-center justify-center hover:bg-foreground/5 rounded-full transition-colors font-bold text-sm text-foreground"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Footer button fixed at the bottom */}
            <div className="mt-5 pt-4 border-t border-border-subtle shrink-0">
              <button
                onClick={() => {
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
                    selectedSize,
                  });
                  toast.success(`${product.name} (${selectedSize}) added to cart!`);
                  setShowSizePopup(false);
                  if (postSizeAction === "buy") {
                    navigate({
                      to: "/cart",
                      search: { buyNow: "true", productId: product.id, size: selectedSize } as any
                    });
                  }
                  setPostSizeAction(null);
                }}
                className="w-full bg-foreground text-background hover:bg-accent hover:text-white border border-border-subtle py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-full flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-[0.99] shadow-md font-semibold"
              >
                <ShoppingBag className="w-4 h-4" /> {postSizeAction === "buy" ? "Buy It Now" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RelatedProductCard({
  p,
  toggleShopWishlist,
  addToShopCart,
  wishlist,
}: {
  p: any;
  toggleShopWishlist: (uid: string, pid: string) => void;
  addToShopCart: (p: any) => void;
  wishlist: string[] | undefined;
}) {
  const { state } = usePortal();
  const { triggerPopup } = useShopNotification();
  const userId = state.user?.id;
  const isFavorite = wishlist ? wishlist.includes(p.id) : false;

  const gallery = (p.images && p.images.length > 0) ? p.images : [p.image];
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-6px)`;
    });
  };

  const handleLeave = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      toast.error("Please login to manage your wishlist.");
      return;
    }
    toggleShopWishlist(userId, p.id);
    triggerPopup(
      !isFavorite ? `${p.name} added to wishlist!` : `${p.name} removed from wishlist.`,
      () => toggleShopWishlist(userId, p.id),
      !isFavorite ? `${p.name} removed from wishlist.` : `${p.name} added to wishlist!`,
      () => toggleShopWishlist(userId, p.id),
      !isFavorite ? `${p.name} added to wishlist!` : `${p.name} removed from wishlist.`
    );
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToShopCart({
      productId: p.id,
      name: p.name,
      house: p.house,
      price: p.price,
      image: p.image,
      selectedSize: "M",
      qty: 1
    });
    toast.success(`${p.name} added to cart!`);
  };

  // Calculate discounted price if applicable
  const pct = p.discount || 0;
  const hasDiscount = !!(pct || p.originalPrice);
  let origPrice = p.price;
  let finalPrice = p.price;

  if (p.originalPrice && p.originalPrice !== p.price) {
    origPrice = p.originalPrice;
    finalPrice = p.price;
  } else if (pct) {
    try {
      const numeric = Number(String(p.price).replace(/[^0-9]/g, ""));
      if (!isNaN(numeric)) {
        const discounted = Math.round(numeric * (1 - pct / 100));
        finalPrice = `₹${discounted.toLocaleString()}`;
        origPrice = p.price;
      }
    } catch { /* ignore */ }
  }

  const ensureRupees = (val: any) => {
    if (val === undefined || val === null) return "";
    const clean = String(val).trim();
    return clean.startsWith("₹") ? clean : `₹${clean}`;
  };

  const displayFinalPrice = ensureRupees(finalPrice);
  const displayOrigPrice = ensureRupees(origPrice);

  // Calculate final discount percentage if we have both prices
  let displayPct = pct;
  if (hasDiscount && !displayPct) {
    try {
      const origNumeric = Number(String(origPrice).replace(/[^0-9]/g, ""));
      const finalNumeric = Number(String(finalPrice).replace(/[^0-9]/g, ""));
      if (origNumeric && finalNumeric && origNumeric > finalNumeric) {
        displayPct = Math.round(((origNumeric - finalNumeric) / origNumeric) * 100);
      }
    } catch { /* ignore */ }
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group glass glass-reflect glass-edge relative overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)] flex flex-col justify-between h-full cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5">
        <Link to="/product/$productId" params={{ productId: p.id }} className="block w-full h-full">
          <img
            src={gallery[activeImgIdx]}
            alt={p.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {displayPct > 0 && (
          <span className="glass-strong glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-ink z-10">
            {displayPct}% OFF
          </span>
        )}

        {/* Carousel Toggles */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImgIdx((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImgIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* wishlist */}
        <motion.button
          type="button"
          onClick={handleWishlistClick}
          whileTap={{ scale: 0.8 }}
          className={cn(
            "glass glass-strong absolute right-2 top-2 z-[3] flex h-9 w-9 items-center justify-center rounded-full transition-shadow duration-300 sm:right-3 sm:top-3 sm:h-11 sm:w-11",
            isFavorite && "shadow-[0_0_20px_-2px_rgba(200,169,106,0.6)]"
          )}
        >
          <motion.span
            key={String(isFavorite)}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 480, damping: 15 }}
            className="flex"
          >
            <Heart
              size={15}
              strokeWidth={1.8}
              className={cn(
                "transition-colors duration-300",
                isFavorite ? "fill-gold text-gold" : "text-ink"
              )}
            />
          </motion.span>
        </motion.button>

        {/* Add to Bag slides up */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 z-10">
          <button
            type="button"
            onClick={handleAddToCartClick}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Add to Bag
          </button>
        </div>
      </div>

      {/* details */}
      <div className="relative z-[2] flex flex-col justify-between p-5 bg-black/25 flex-1 space-y-4">
        <div>
          <div className="editorial-label text-muted-foreground text-[9px]">{p.house}</div>
          <Link
            to="/product/$productId"
            params={{ productId: p.id }}
            className="hover:text-accent transition-colors block mt-1"
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            <h3 className="truncate font-serif text-sm font-medium text-ink leading-tight">{p.name}</h3>
          </Link>

          <div className="flex gap-2 items-baseline flex-wrap mt-2">
            <span className="text-base font-bold text-accent">{displayFinalPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-xs line-through text-muted-foreground">{displayOrigPrice}</span>
                <span className="text-xs font-bold text-red-500">-{displayPct}% off</span>
              </>
            )}
          </div>

          {/* Sizes Row */}
          <div className={`transition-all duration-300 overflow-hidden ${isTitleHovered ? "h-6 opacity-100 mt-1.5" : "h-0 opacity-0"}`}>
            <div className="flex items-center gap-1.5 w-full">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground shrink-0">Sizes:</span>
              <div className="overflow-hidden w-full relative">
                <style>{`
                  @keyframes marquee-pingpong {
                    0%, 15% { transform: translateX(0%); }
                    85%, 100% { transform: translateX(-45%); }
                  }
                `}</style>
                <div
                  className="flex gap-1.5"
                  style={
                    isTitleHovered && (p.sizes || ["S", "M", "L", "XL"]).length > 3
                      ? { animation: 'marquee-pingpong 4s ease-in-out infinite alternate', animationDelay: '1s', width: 'max-content' }
                      : { width: 'max-content' }
                  }
                >
                  {(p.sizes || ["S", "M", "L", "XL"]).map((sz: string, idx: number) => (
                    <span key={sz + "-" + idx} className="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded border border-white/5 text-foreground whitespace-nowrap">
                      {sz}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* add to bag — mobile/tablet: always visible, no hover needed */}
        <button
          type="button"
          onClick={handleAddToCartClick}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105 md:hidden mt-2 cursor-pointer"
        >
          <ShoppingBag size={14} strokeWidth={2} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}
