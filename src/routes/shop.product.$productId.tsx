import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { usePortal } from "@/lib/portal-state";
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Star,
  Check,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { FadeUp } from "@/components/motion/Reveal";

export const Route = createFileRoute("/shop/product/$productId")({
  component: ProductDetail,
});

function ProductDetail() {
  const { productId } = Route.useParams();
  const { state, toggleShopWishlist, addToShopCart, recordProductView, addReview } = usePortal();
  const navigate = useNavigate();

  // Find product in catalog
  const products = state.products || [];
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-3xl">Product Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The requested statement piece is not in our current catalog.
        </p>
        <Link
          to="/shop"
          className="mt-6 border border-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Gallery of photos
  const mediaGallery = [
    product.image,
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&h=800&q=80",
    "https://images.unsplash.com/photo-1496360166961-10a51d5f367a?auto=format&fit=crop&w=600&h=800&q=80",
  ];

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", backgroundPosition: "0% 0%" });

  // Record view on render
  useEffect(() => {
    recordProductView(product.id);
  }, [product.id]);

  // Size details & stocks
  const availableSizes = product.sizes || ["S", "M", "L", "XL"];
  const stockPerSize = product.stockPerSize || { S: 5, M: 8, L: 4, XL: 2 };

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryEstimation, setDeliveryEstimation] = useState("");

  const handlePincodeCheck = () => {
    if (/^\d{6}$/.test(pincode.trim())) {
      setDeliveryEstimation("Estimated Delivery: 2-3 Business Days via Shiprocket Express");
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
      alert("Please sign in to write a review.");
      return;
    }
    if (!commentInput.trim()) return;

    addReview(product.id, {
      userName: `${state.user.firstName} ${state.user.lastName}`,
      rating: ratingInput,
      comment: commentInput,
    });
    setCommentInput("");
    alert("Thank you! Your review has been added.");
  };

  // Magnifying Zoom Viewer on Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", backgroundPosition: "0% 0%" });
  };

  // Actions
  const userId = state.user?.id;
  const isFavorite = userId ? (state.shopWishlist[userId] || []).includes(product.id) : false;

  const handleWishlistToggle = () => {
    if (!userId) {
      alert("Please sign in to manage your wishlist.");
      return;
    }
    toggleShopWishlist(userId, product.id);
  };

  const handleAddToCart = () => {
    addToShopCart({
      productId: product.id,
      name: product.name,
      house: product.house,
      price: product.price,
      image: product.image,
      qty: quantity,
      selectedSize,
    });
    alert(`${product.name} (${selectedSize}) added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate({ to: "/shop/cart" });
  };

  // Related products recommendation
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 space-y-16">
      {/* Back Button */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold">
        <Link
          to="/shop"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Side: Images sliders & Zoom */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className="relative bg-zinc-950 aspect-[3/4] overflow-hidden rounded-3xl border border-border-subtle cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={mediaGallery[activeMediaIdx]}
              className="w-full h-full object-cover select-none pointer-events-none"
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

            {/* Slider arrows */}
            <button
              onClick={() =>
                setActiveMediaIdx((prev) => (prev === 0 ? mediaGallery.length - 1 : prev - 1))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2.5 rounded-full hover:bg-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setActiveMediaIdx((prev) => (prev === mediaGallery.length - 1 ? 0 : prev + 1))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2.5 rounded-full hover:bg-black transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slider Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {mediaGallery.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMediaIdx(idx)}
                className={`w-20 aspect-[3/4] border overflow-hidden shrink-0 rounded-xl transition-all duration-300 ${
                  activeMediaIdx === idx
                    ? "border-accent scale-95 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <img src={m} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="lg:col-span-5 space-y-6">
          <FadeUp>
            <div className="text-xs uppercase tracking-widest text-accent font-bold">
              {product.house}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl mt-2 text-foreground">{product.name}</h1>

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

            <div className="text-2xl font-serif text-accent font-semibold mt-4">
              {product.price}
            </div>
          </FadeUp>

          <hr className="border-border-subtle" />

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold">
              <span>Select Size</span>
              <span className="text-muted-foreground font-mono text-[10px]">
                {stockPerSize[selectedSize] > 0
                  ? `Stock: ${stockPerSize[selectedSize]} left`
                  : "OUT OF STOCK"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const hasStock = (stockPerSize[size] ?? 0) > 0;
                return (
                  <button
                    key={size}
                    disabled={!hasStock}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                    }}
                    className={`text-xs py-2 px-5 font-semibold rounded-full transition-all duration-300 ${
                      !hasStock
                        ? "opacity-35 cursor-not-allowed bg-zinc-800 line-through text-muted-foreground"
                        : selectedSize === size
                          ? "bg-accent text-white shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                          : "bg-white/5 dark:bg-white/5 border border-white/10 hover:bg-white/10 text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-wider font-semibold">Quantity</label>
            <div className="flex items-center bg-white/5 dark:bg-white/5 border border-white/10 w-32 rounded-full overflow-hidden p-0.5 backdrop-blur-md">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex-1 py-1.5 text-center hover:bg-white/10 dark:hover:bg-white/10 rounded-full transition-colors font-bold text-sm text-foreground"
              >
                -
              </button>
              <span className="flex-1 text-center font-semibold text-xs text-foreground">
                {quantity}
              </span>
              <button
                onClick={() => {
                  const maxStock = stockPerSize[selectedSize] ?? 0;
                  setQuantity((q) => (q < maxStock ? q + 1 : q));
                }}
                className="flex-1 py-1.5 text-center hover:bg-white/10 dark:hover:bg-white/10 rounded-full transition-colors font-bold text-sm text-foreground"
              >
                +
              </button>
            </div>
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
              className="w-full bg-white/10 dark:bg-white/5 hover:bg-white/20 border border-white/15 py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full text-foreground transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md"
            >
              Buy It Now
            </button>
          </div>

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
            <div className="text-xs text-muted-foreground italic">
              Please{" "}
              <Link to="/shop/login" className="text-accent underline">
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
        <div className="space-y-8 border-t border-border-subtle pt-12">
          <FadeUp>
            <h3 className="font-serif text-2xl">You May Also Like</h3>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="group liquid-glass liquid-glass-card-hover flex flex-col justify-between overflow-hidden"
              >
                <Link
                  to="/shop/product/$productId"
                  params={{ productId: p.id }}
                  className="block relative aspect-[3/4] overflow-hidden"
                >
                  <img
                    src={p.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="p-4 space-y-2">
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
                    {p.house}
                  </div>
                  <Link
                    to="/shop/product/$productId"
                    params={{ productId: p.id }}
                    className="hover:text-accent font-serif text-sm block font-medium truncate"
                  >
                    {p.name}
                  </Link>
                  <div className="text-xs font-semibold text-accent">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
