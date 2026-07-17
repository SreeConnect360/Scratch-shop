import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { usePortal } from "@/lib/portal-state";
import { FadeUp } from "@/components/motion/Reveal";
import { toast } from "sonner";
import { QuickAddContext, useShopNotification } from "./_shop";
import {
  Play, ArrowUpRight, ShoppingCart, Heart, Flame, ShieldCheck,
  HelpCircle, ArrowRight, Star, Mail, Phone, MapPin, Eye, Timer,
  ChevronLeft, ChevronRight, Home, Grid, Diamond, Zap, MessageSquare, ShoppingBag
} from "lucide-react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn, prefersReducedMotion } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/_shop/")({
  head: () => ({
    meta: [
      { title: "Maison ReeVibes — Luxury Fashion E-Commerce" },
      { name: "description", content: "Curated collections and luxury editorial statements celebrating beauty in diversity." },
    ],
  }),
  component: ShopHome,
});

function ShopHome() {
  const { state, toggleShopWishlist, addToShopCart } = usePortal();
  const products = (state.products || []).filter(p => !p.status || p.status === "PUBLISHED" || p.status === "published");
  
  // Check preview mode query param
  const isPreview = typeof window !== "undefined" && window.location.search.includes("preview=true");
  const layout = isPreview ? state.homepageLayoutDraft : state.homepageLayout;

  // Golden glow mouse coordinates springs
  const glowX = useSpring(0, { damping: 50, stiffness: 180 });
  const glowY = useSpring(0, { damping: 50, stiffness: 180 });

  useEffect(() => {
    const handleGlowMouseMove = (e: MouseEvent) => {
      glowX.set(e.clientX - 250); // half of w-[500px]
      glowY.set(e.clientY - 250);
    };
    window.addEventListener("mousemove", handleGlowMouseMove);
    return () => window.removeEventListener("mousemove", handleGlowMouseMove);
  }, []);

  // Spline Robot visibility — controlled from Admin Homepage Dashboard → AI Robot Assistant toggle
  const showRobot = layout?.assistant?.enabled !== false;
  const splineContainerRef = useRef<HTMLDivElement>(null);

  // Forward global mousemove events to the Spline canvas to ensure tracking from far left, top, bottom, and chatbots
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!showRobot) return;
      const container = splineContainerRef.current;
      if (!container) return;
      const canvas = container.querySelector("canvas");
      if (!canvas) return;

      const clonedEvent = new MouseEvent("mousemove", {
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        bubbles: true,
        cancelable: true,
      });
      canvas.dispatchEvent(clonedEvent);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [showRobot]);

  // Active Hero Slide Index
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [hoveringHero, setHoveringHero] = useState(false);
  const [heroCycle, setHeroCycle] = useState(0);

  const goHero = useCallback(
    (dir: number, bannersLength: number) => {
      setActiveHeroIdx((prev) => (prev + dir + bannersLength) % bannersLength);
    },
    []
  );

  const onHeroProgressEnd = useCallback(() => {
    const banners = layout.hero?.banners || [];
    if (banners.length <= 1) return;
    if (document.hidden) {
      setHeroCycle((c) => c + 1);
    } else {
      goHero(1, banners.length);
    }
  }, [goHero, layout.hero?.banners]);

  // Live Purchase Alert Simulation
  const [activeFeedIdx, setActiveFeedIdx] = useState(0);
  const demoPurchases = [
    { name: "Priya", item: "Oversized Hoodie", time: "2 minutes ago" },
    { name: "Rahul", item: "Black Maxi Dress", time: "5 minutes ago" },
    { name: "Ananya", item: "Tailored Linen Blazer", time: "12 minutes ago" },
    { name: "Kabir", item: "Cashmere Cape", time: "15 minutes ago" }
  ];

  useEffect(() => {
    if (layout?.liveFeed?.enabled) {
      const feedInterval = setInterval(() => {
        setActiveFeedIdx(prev => (prev + 1) % demoPurchases.length);
      }, 5000);
      return () => clearInterval(feedInterval);
    }
  }, [layout]);

  // Flash Sale Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 22, seconds: 30 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (t: typeof timeLeft) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(t.hours)}h ${pad(t.minutes)}m ${pad(t.seconds)}s`;
  };

  // Newsletter Success State
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Lookbook Tooltip Product State
  const [lookbookSelectedProduct, setLookbookSelectedProduct] = useState<any | null>(null);

  // Recently Viewed State
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("reevibes:recently_viewed");
        if (stored) {
          setRecentlyViewedIds(JSON.parse(stored).slice(0, 4));
        }
      } catch { /* ignore */ }
    }
  }, []);

  // Track active section for left-side navigation
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero", "categories", "collections", "flashSale", 
        "trending", "bestSellers", "reviews", "brandStory", 
        "newsletter", "footer"
      ];
      
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const brandStoryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !brandStoryRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".story-img", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: brandStoryRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, brandStoryRef);
    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sideNavItems = [
    { id: "hero", label: "Hero", icon: Home },
    { id: "categories", label: "Categories", icon: Grid },
    { id: "collections", label: "Collections", icon: Diamond },
    { id: "flashSale", label: "Flash Sale", icon: Zap },
    { id: "trending", label: "Trending", icon: Flame },
    { id: "bestSellers", label: "Best Sellers", icon: Star },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "brandStory", label: "Brand Story", icon: Heart },
    { id: "newsletter", label: "Newsletter", icon: Mail },
  ];

  // Hero Parallax mouse coordinates
  const [heroMousePos, setHeroMousePos] = useState({ x: 0, y: 0 });
  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setHeroMousePos({ x, y });
  };
  const handleHeroMouseLeave = () => {
    setHeroMousePos({ x: 0, y: 0 });
  };

  if (!layout) {
    return <div className="text-center py-20 text-muted-foreground">Initializing layout...</div>;
  }

  // Helper renderers for sections
  const renderSection = (sectionId: string) => {
    const sec = layout[sectionId];
    if (!sec || !sec.enabled) return null;

    switch (sectionId) {
      case "hero":
        const heroData = layout.hero;
        if (!heroData.banners || heroData.banners.length === 0) return null;
        const currentBanner = heroData.banners[activeHeroIdx % heroData.banners.length];

        return (
          <section
            id="hero"
            key={sectionId}
            aria-label="Featured stories"
            className="relative flex flex-col items-center justify-center overflow-hidden pb-0 pt-0 w-full"
          >
            {/* ambient gold light */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[16%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px]"
            />

            <div className="relative z-10 w-full">
              <div
                role="region"
                aria-roledescription="carousel"
                aria-label="Seasonal highlights"
                onMouseEnter={() => setHoveringHero(true)}
                onMouseLeave={() => setHoveringHero(false)}
                className="group relative aspect-[16/10] md:aspect-[21/9] max-h-[360px] md:max-h-[450px] w-full overflow-hidden rounded-none border-none"
              >
                <AnimatePresence mode="sync">
                  <motion.div
                    key={activeHeroIdx}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    {currentBanner.type === "Video Banner" && currentBanner.videoUrl ? (
                      <motion.video
                        src={currentBanner.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.08 }}
                        transition={{ duration: 6.2, ease: "linear" }}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <motion.img
                        src={currentBanner.desktopImage}
                        alt={currentBanner.title}
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.08 }}
                        transition={{ duration: 6.2, ease: "linear" }}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                    {/* slide copy */}
                    <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-14 z-20">
                      <motion.p
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.6 }}
                        className="mb-3 text-[10.5px] tracking-[0.34em] uppercase text-gold-soft"
                      >
                        {currentBanner.subtitle || "The Curation Édition"}
                      </motion.p>
                      <motion.h1
                        initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.35, duration: 0.7 }}
                        className="max-w-2xl text-balance text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl"
                      >
                        {currentBanner.title || "Wear the Extraordinary"}
                      </motion.h1>
                      {currentBanner.description && (
                        <motion.p
                          initial={{ opacity: 0, y: 22 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.48, duration: 0.6 }}
                          className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base"
                        >
                          {currentBanner.description}
                        </motion.p>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="mt-6 flex flex-wrap gap-4"
                      >
                        {currentBanner.redirectUrl && (
                          <Link to={currentBanner.redirectUrl}>
                            <MagneticButton variant="gold">
                              {currentBanner.buttonText || "Discover Now"} <ArrowRight size={15} aria-hidden="true" />
                            </MagneticButton>
                          </Link>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Left/Right Arrows */}
                <button
                  type="button"
                  aria-label="Previous banner"
                  onClick={() => goHero(-1, heroData.banners.length)}
                  className="glass absolute left-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white opacity-0 transition-all duration-300 hover:border-gold/40 hover:text-gold-soft group-hover:opacity-100 focus-visible:opacity-100 sm:flex cursor-pointer"
                  style={{ position: "absolute", left: "1rem" }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next banner"
                  onClick={() => goHero(1, heroData.banners.length)}
                  className="glass absolute right-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white opacity-0 transition-all duration-300 hover:border-gold/40 hover:text-gold-soft group-hover:opacity-100 focus-visible:opacity-100 sm:flex cursor-pointer"
                  style={{ position: "absolute", right: "1rem" }}
                >
                  <ChevronRight size={18} />
                </button>

                {/* dots */}
                {heroData.banners.length > 1 && (
                  <div
                    className="absolute bottom-5 right-6 z-35 flex items-center gap-2 sm:bottom-7 sm:right-9"
                    role="tablist"
                    aria-label="Choose banner"
                  >
                    {heroData.banners.map((_: any, idx: number) => {
                      const isActive = idx === activeHeroIdx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => {
                            setActiveHeroIdx(idx);
                            setHeroCycle((c) => c + 1);
                          }}
                          className="group/dot relative flex h-6 items-center cursor-pointer"
                        >
                          <span
                            className={`block h-1.5 overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                              isActive
                                ? "w-9 bg-white/25 shadow-[0_0_12px_rgba(200,169,106,0.45)]"
                                : "w-1.5 bg-white/40 opacity-80 group-hover/dot:bg-white/70 group-hover/dot:opacity-100"
                            }`}
                          >
                            {isActive && (
                              <span
                                key={`${idx}-${heroCycle}`}
                                onAnimationEnd={onHeroProgressEnd}
                                className="block h-full w-full origin-left rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-soft"
                                style={{
                                  animation: `hero-progress 5200ms linear forwards`,
                                  animationPlayState: hoveringHero ? "paused" : "running",
                                }}
                              />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case "categories":
        const catData = layout.categories;
        return (
          <section id="categories" aria-labelledby="categories-title" className="relative py-16 md:py-20">
            <div className="section-shell">
              <motion.div
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mb-10 text-center"
              >
                <p className="mb-3 flex items-center justify-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold">
                  <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
                  Curated Departments
                  <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
                </p>
                <h2 id="categories-title" className="text-3xl text-ink sm:text-4xl">
                  Shop by Category
                </h2>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {catData.items.map((cat: any, i: number) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      to={cat.redirectUrl}
                      className="glass glass-reflect glass-edge group cursor-pointer overflow-hidden rounded-2xl block w-full text-left aspect-[3/4]"
                    >
                      <div className="relative h-full w-full overflow-hidden">
                        <img
                          src={cat.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3.5">
                          <span>
                            <span className="block text-[15px] text-white">
                              {cat.name}
                            </span>
                          </span>
                          <ArrowUpRight
                            size={15}
                            aria-hidden="true"
                            className="mb-1 text-gold-soft opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case "flashSale":
        const fs = layout.flashSale;
        const fsProducts = products.filter(p => fs.products.includes(p.id));
        if (fsProducts.length === 0) return null;

        return (
          <section key={sectionId} className="max-w-7xl mx-auto px-3 sm:px-5 space-y-8">
            <FadeUp>
              <div className="glass glass-reflect glass-edge p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10 rounded-3xl">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-red-500 animate-pulse" />
                  <div>
                    <h3 className="text-lg font-serif text-white">Limited Flash Sale</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Exclusive {fs.discount}% discount live right now</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Ends In</div>
                    <div className="font-mono text-sm font-bold text-red-400 mt-1">{formatTime(timeLeft)}</div>
                  </div>
                  <Link to="/categories">
                    <MagneticButton variant="gold">
                      Shop Flash Sale
                    </MagneticButton>
                  </Link>
                </div>
              </div>
            </FadeUp>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">
              {fsProducts.map(p => (
                <ProductCard
                  key={p.id}
                  p={p}
                  toggleShopWishlist={toggleShopWishlist}
                  addToShopCart={addToShopCart}
                  wishlist={state.shopWishlist[state.user?.id || ""]}
                  discountPercent={fs.discount}
                />
              ))}
            </div>
          </section>
        );

      case "trending":
        const trendingCuration = layout.trending;
        let trendingProductsList = [];
        if (trendingCuration.autoMode) {
          trendingProductsList = [...products].sort((a, b) => {
            const scoreA = (state.productViews[a.id] ?? 0) + (state.productCartAdditions[a.id] ?? 0) * 3 + (state.productPurchases[a.id] ?? 0) * 5;
            const scoreB = (state.productViews[b.id] ?? 0) + (state.productCartAdditions[b.id] ?? 0) * 3 + (state.productPurchases[b.id] ?? 0) * 5;
            return scoreB - scoreA;
          }).slice(0, 3);
        } else {
          trendingProductsList = products.filter(p => trendingCuration.manualProducts.includes(p.id));
        }

        return (
          <section key={sectionId} className="max-w-7xl mx-auto px-3 sm:px-5 space-y-8">
            <FadeUp>
              <div className="flex justify-between items-end border-b border-border-subtle pb-4">
                <div>
                  <p className="editorial-eyebrow text-accent">Trending Curation</p>
                  <h2 className="font-serif text-3xl mt-1">High-Fidelity Statements</h2>
                </div>
              </div>
            </FadeUp>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">
              {trendingProductsList.map(p => (
                <ProductCard
                  key={p.id}
                  p={p}
                  toggleShopWishlist={toggleShopWishlist}
                  addToShopCart={addToShopCart}
                  wishlist={state.shopWishlist[state.user?.id || ""]}
                />
              ))}
            </div>
          </section>
        );

      case "newArrivals":
        const naConfig = layout.newArrival || { productCount: 3, layoutStyle: "grid" };
        const naProducts = products.slice(0, naConfig.productCount || 3);

        return (
          <section key={sectionId} className="max-w-7xl mx-auto px-3 sm:px-5 space-y-8">
            <FadeUp>
              <div className="flex justify-between items-end border-b border-border-subtle pb-4">
                <div>
                  <p className="editorial-eyebrow text-accent">New Arrivals</p>
                  <h2 className="font-serif text-3xl mt-1">Season Statement Curation</h2>
                </div>
                <Link to="/categories" className="text-xs uppercase tracking-widest font-semibold hover:text-accent flex items-center gap-1.5 transition-colors">
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeUp>

            <div className={naConfig.layoutStyle === "carousel" ? "grid grid-cols-2 gap-3 md:flex md:gap-8 md:overflow-x-auto md:pb-4 scrollbar-thin items-start" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start"}>
              {naProducts.map(p => (
                <div key={p.id} className={naConfig.layoutStyle === "carousel" ? "w-full md:w-80 md:shrink-0" : "w-full"}>
                  <ProductCard
                    p={p}
                    toggleShopWishlist={toggleShopWishlist}
                    addToShopCart={addToShopCart}
                    wishlist={state.shopWishlist[state.user?.id || ""]}
                  />
                </div>
              ))}
            </div>
          </section>
        );

      case "campaign":
        const camp = layout.campaign;
        return (
          <section key={sectionId} className="max-w-7xl mx-auto px-3 sm:px-5">
            <FadeUp>
              <div className="relative aspect-[16/10] lg:aspect-[21/9] min-h-[220px] sm:min-h-[300px] overflow-hidden bg-zinc-950 group rounded-3xl border border-border-subtle">
                <img src={camp.image} className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center space-y-4 max-w-xl">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Editorial Fashion Campaign</span>
                  <h3 className="font-serif text-3xl md:text-4xl text-white leading-tight">{camp.heading}</h3>
                  <Link
                    to={camp.redirectUrl || "/categories"}
                    className="liquid-glass-btn bg-white text-zinc-950 font-bold px-6 py-2.5 text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-full w-fit"
                  >
                    {camp.ctaText || "Explore Curation"}
                  </Link>
                </div>
              </div>
            </FadeUp>
          </section>
        );

      case "collections":
        const colData = layout.collections;
        const colProducts = products.slice(0, 3); // Fallback subset
        return (
          <section key={sectionId} className="max-w-7xl mx-auto px-3 sm:px-5 space-y-8">
            <FadeUp>
              <div className="relative aspect-[16/10] lg:aspect-[3/1] min-h-[160px] sm:min-h-[220px] rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-xl">
                <img src={colData.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                  <h2 className="font-serif text-3xl md:text-5xl italic tracking-widest text-white uppercase font-bold">{colData.collectionId}</h2>
                </div>
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">
              {colProducts.map(p => (
                <ProductCard
                  key={p.id}
                  p={p}
                  toggleShopWishlist={toggleShopWishlist}
                  addToShopCart={addToShopCart}
                  wishlist={state.shopWishlist[state.user?.id || ""]}
                />
              ))}
            </div>
          </section>
        );

      case "liveFeed":
        const activeFeed = demoPurchases[activeFeedIdx];
        return (
          <div key={sectionId} className="fixed bottom-6 left-6 z-40 animate-in slide-in-from-bottom-5 duration-300">
            <div className="liquid-glass border border-white/20 px-4 py-3 rounded-full flex items-center gap-3 bg-black/85 shadow-2xl max-w-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="text-[10px] text-muted-foreground leading-normal pr-2">
                <span className="font-bold text-foreground">{activeFeed.name}</span> from Mumbai purchased <span className="font-semibold text-accent">{activeFeed.item}</span> <span className="italic">{activeFeed.time}</span>
              </div>
            </div>
          </div>
        );

      case "bestSellers":
        const bsConfig = layout.bestSellers;
        let bsProducts = [];
        if (bsConfig.autoMode) {
          bsProducts = products.slice(1, 4); // Simulated best sellers
        } else {
          bsProducts = products.filter(p => bsConfig.manualProducts.includes(p.id));
        }

        return (
          <section key={sectionId} className="max-w-7xl mx-auto px-3 sm:px-5 space-y-8">
            <FadeUp>
              <div className="border-b border-border-subtle pb-4">
                <p className="editorial-eyebrow text-accent">Best Sellers</p>
                <h2 className="font-serif text-3xl mt-1">Most Coveted Curation</h2>
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">
              {bsProducts.map(p => (
                <ProductCard
                  key={p.id}
                  p={p}
                  toggleShopWishlist={toggleShopWishlist}
                  addToShopCart={addToShopCart}
                  wishlist={state.shopWishlist[state.user?.id || ""]}
                />
              ))}
            </div>
          </section>
        );

      case "limitedStock":
        const lim = layout.limitedStock;
        const limProducts = products.filter(p => {
          const totalStock = p.stockPerSize ? Object.values(p.stockPerSize).reduce((a, b) => a + b, 0) : 0;
          return totalStock > 0 && totalStock <= (lim.threshold || 5);
        }).slice(0, 3);
        
        if (limProducts.length === 0) return null;

        return (
          <section key={sectionId} className="max-w-7xl mx-auto px-3 sm:px-5 space-y-6">
            <FadeUp>
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-3xl text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-400">High Conversion Alert</p>
                <h3 className="font-serif text-lg mt-1">Couture Pieces Selling Fast</h3>
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">
              {limProducts.map(p => (
                <ProductCard
                  key={p.id}
                  p={p}
                  toggleShopWishlist={toggleShopWishlist}
                  addToShopCart={addToShopCart}
                  wishlist={state.shopWishlist[state.user?.id || ""]}
                  stockWarningText={`Only ${Object.values(p.stockPerSize || {}).reduce((a, b) => a + b, 0)} left`}
                />
              ))}
            </div>
          </section>
        );

      case "influencerPicks":
        const inf = layout.influencerPicks;
        const infProducts = products.filter(p => inf.products.includes(p.id));
        if (infProducts.length === 0) return null;

        return (
          <section key={sectionId} className="max-w-7xl mx-auto px-3 sm:px-5 space-y-8">
            <FadeUp>
              <div className="border-b border-border-subtle pb-4">
                <p className="editorial-eyebrow text-accent">Influencer Picks</p>
                <h2 className="font-serif text-3xl mt-1">Editor's & Stylist Favorites</h2>
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">
              {infProducts.map(p => (
                <ProductCard
                  key={p.id}
                  p={p}
                  toggleShopWishlist={toggleShopWishlist}
                  addToShopCart={addToShopCart}
                  wishlist={state.shopWishlist[state.user?.id || ""]}
                />
              ))}
            </div>
          </section>
        );

      case "reviews":
        return null;

      case "lookbook":
        return null;

      case "recentlyViewed":
        const recentProducts = products.filter(p => recentlyViewedIds.includes(p.id));
        if (recentProducts.length === 0) return null;

        return (
          <section key={sectionId} className="max-w-7xl mx-auto px-3 sm:px-5 space-y-6">
            <div className="border-b border-white/10 pb-2">
              <h3 className="font-serif text-lg tracking-wider">Recently Viewed</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentProducts.map(p => (
                <div key={p.id} className="space-y-2">
                  <Link to="/product/$productId" params={{ productId: p.id }}>
                    <img src={p.image} className="aspect-[3/4] object-cover rounded-2xl w-full" alt="" />
                  </Link>
                  <div className="text-xs font-semibold truncate">{p.name}</div>
                  <div className="text-[10px] text-accent font-bold">{p.price}</div>
                </div>
              ))}
            </div>
          </section>
        );

      case "recommended":
        const rec = layout.recommended;
        const recProducts = products.slice(0, 3); // Cured list

        return (
          <section key={sectionId} className="max-w-7xl mx-auto px-3 sm:px-5 space-y-6">
            <div className="border-b border-white/10 pb-2">
              <h3 className="font-serif text-lg tracking-wider">Recommended For You</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-8 items-start">
              {recProducts.map(p => (
                <ProductCard
                  key={p.id}
                  p={p}
                  toggleShopWishlist={toggleShopWishlist}
                  addToShopCart={addToShopCart}
                  wishlist={state.shopWishlist[state.user?.id || ""]}
                />
              ))}
            </div>
          </section>
        );

      case "brandStory":
        const story = layout.brandStory;
        return (
          <section key={sectionId} ref={brandStoryRef} id="brand-story" className="relative py-16 md:py-20">
            <div className="section-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* imagery */}
              <motion.div
                initial={{ opacity: 0, x: -36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="glass overflow-hidden rounded-3xl border border-white/10">
                  <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                    <img
                      src={story.image1 || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop"}
                      className="story-img h-[112%] w-full object-cover"
                      alt="Inside the maison atelier"
                      loading="lazy"
                    />
                  </div>
                </div>
                {/* floating glass caption */}
                <motion.figure
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="glass glass-strong glass-edge absolute -bottom-6 -right-3 max-w-[15rem] rounded-2xl p-4 sm:-right-6 motion-reduce:animate-none z-10"
                >
                  <p className="text-[10px] tracking-[0.26em] uppercase text-gold font-bold">
                    Maison ReeVibes
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-ink">
                    Every seam placed by hand, every fabric traced to origin.
                  </p>
                </motion.figure>
              </motion.div>

              {/* story text */}
              <motion.div
                initial={{ opacity: 0, x: 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <p className="mb-3 flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold">
                  <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
                  The Maison
                </p>
                <h2 className="text-balance text-3xl leading-[1.15] text-ink sm:text-4xl lg:text-[2.6rem]">
                  Quiet luxury, <span className="gold-text">loudly crafted.</span>
                </h2>
                <p className="text-[15px] leading-relaxed text-ink-muted">{story.text}</p>
                
                <dl className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { value: "2026", label: "Maison founded" },
                    { value: "42", label: "Ateliers worldwide" },
                    { value: "100%", label: "Ethically sourced" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="glass glass-edge rounded-2xl p-4 text-center border border-white/5"
                    >
                      <dt className="order-2 mt-1 block text-[9px] leading-tight tracking-[0.12em] uppercase text-ink-muted font-semibold">
                        {s.label}
                      </dt>
                      <dd className="text-xl text-gold sm:text-2xl font-bold">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="pt-4">
                  <Link to="/categories">
                    <MagneticButton variant="glass">
                      Discover Collection <ArrowRight size={14} aria-hidden="true" />
                    </MagneticButton>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        );

      case "newsletter":
        const news = layout.newsletter;
        return (
          <section key={sectionId} id="newsletter" aria-labelledby="newsletter-heading" className="relative py-16 md:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[22rem] w-[44rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[110px]"
            />
            <div className="section-shell max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="glass glass-strong rounded-3xl p-8 text-center sm:p-12 border border-white/10 shadow-[var(--glass-shadow)]">
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold shadow-[var(--gold-glow)]"
                  >
                    <Mail size={22} strokeWidth={1.6} />
                  </span>
                  <h2
                    id="newsletter-heading"
                    className="text-balance text-2xl text-ink sm:text-3xl font-serif"
                  >
                    {news.heading || "Join the Private List"}
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                    {news.subheading || "Seasonal previews, atelier stories, and first access to the Flash Édit — a few beautiful letters a year."}
                  </p>

                  <AnimatePresence mode="wait">
                    {newsletterSent ? (
                      <motion.p
                        key="done"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mx-auto mt-7 flex max-w-md items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/10 py-3.5 text-sm text-gold"
                        role="status"
                      >
                        ✓ Congratulations! Your ₹{news.rewardAmount} Coupon code [FESTIVE{news.rewardAmount}] has been sent to your email.
                      </motion.p>
                    ) : (
                      <motion.form
                        key="form"
                        exit={{ opacity: 0, scale: 0.96 }}
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (emailInput.trim()) setNewsletterSent(true);
                        }}
                        noValidate
                        className="mx-auto mt-7 max-w-md"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <label htmlFor="newsletter-email" className="sr-only">
                            Email address
                          </label>
                          <input
                            id="newsletter-email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="glass min-h-[48px] flex-1 rounded-full border-[var(--glass-border)] bg-transparent px-6 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold/50 focus:outline-none text-foreground"
                          />
                          <MagneticButton variant="gold" type="submit">
                            Send Credits
                          </MagneticButton>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </section>
        );

      default:
        if (sectionId.startsWith("banner-") || sectionId.startsWith("subbanner-")) {
          const banner = layout[sectionId];
          if (!banner) return null;
          return <RotatableBanner key={sectionId} banner={banner} sectionId={sectionId} />;
        } else if (sectionId.startsWith("bucket-")) {
          const bucketSection = layout[sectionId];
          if (!bucketSection) return null;
          const bucket = state.buckets?.find(b => b.id === bucketSection.id);
          if (!bucket) return null;
          
          const starProd = products.find((p) => p.id === bucket.starProductId) || products.find((p) => bucket.productIds.includes(p.id));
          const thumbnail = starProd?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&h=500&q=80";
          const bucketProducts = products.filter(p => bucket.productIds.includes(p.id));

          return (
            <section key={sectionId} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 space-y-8">
              <FadeUp>
                <div className="relative aspect-[16/10] lg:aspect-[21/9] min-h-[160px] sm:min-h-[220px] rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-xl">
                  <img src={thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-8 md:p-12">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Curated Set Selection</p>
                    <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mt-1 uppercase tracking-wider">{bucket.name}</h2>
                  </div>
                </div>
              </FadeUp>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">
                {bucketProducts.map(p => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    toggleShopWishlist={toggleShopWishlist}
                    addToShopCart={addToShopCart}
                    wishlist={state.shopWishlist[state.user?.id || ""]}
                  />
                ))}
              </div>
            </section>
          );
        } else if (sectionId.startsWith("section-")) {
          const sec = layout[sectionId];
          if (!sec) return null;

          const sectionBuckets = (sec.bucketIds || []).map((bid: string) => state.buckets?.find(b => b.id === bid)).filter(Boolean);
          const sectionProducts = (sec.productIds || []).map((pid: string) => products.find(p => p.id === pid)).filter(Boolean);

          if (sectionBuckets.length === 0 && sectionProducts.length === 0) return null;

          return (
            <section key={sectionId} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 space-y-12 animate-in fade-in duration-300 relative z-10">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-serif text-3xl text-foreground tracking-wide">{sec.name || "Curated Section"}</h2>
                {sec.subname && (
                  <p className="text-xs uppercase tracking-[0.2em] text-accent mt-1.5 font-sans font-semibold">{sec.subname}</p>
                )}
              </div>

              {/* Render Buckets as Curated Collection Thumbnails */}
              {sectionBuckets.length > 0 && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-accent border-l-2 border-accent pl-3">Curated Collections</h3>
                  <div className="relative px-0 md:px-12 group/carousel">
                    <button
                      type="button"
                      onClick={(e) => {
                        const container = e.currentTarget.nextElementSibling;
                        if (container) {
                          container.scrollBy({ left: -320, behavior: "smooth" });
                        }
                      }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-surface-3 hover:bg-accent border border-border-subtle hover:border-accent text-foreground hover:text-white w-10 h-10 hidden md:flex items-center justify-center rounded-full shadow-md transition-all cursor-pointer text-sm font-bold"
                      title="Scroll Left"
                    >
                      &larr;
                    </button>
                    <div className="grid grid-cols-2 gap-3 md:flex md:gap-5 md:overflow-x-auto md:snap-x md:scroll-smooth scrollbar-none md:pb-4 md:px-1">
                      {sectionBuckets.map((bkt: any) => {
                        const starProd = products.find((p) => p.id === bkt.starProductId) || products.find((p) => bkt.productIds?.includes(p.id));
                        const thumbnail = starProd?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&h=500&q=80";
                        return (
                          <div key={bkt.id} className="w-full md:w-[280px] md:shrink-0 md:snap-start">
                            <Link
                              to="/categories"
                              search={{ bucketId: bkt.id } as any}
                              className="liquid-glass liquid-glass-card-hover relative flex flex-col group overflow-hidden bg-transparent border border-white/10 rounded-3xl block"
                            >
                              <div className="aspect-[3/4] overflow-hidden bg-zinc-950 relative">
                                <img src={thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-6 flex justify-between items-center z-10">
                                  <div className="min-w-0">
                                    <span className="text-[9px] uppercase tracking-widest text-accent font-bold">Curation Set</span>
                                    <h4 className="font-serif text-sm md:text-lg mt-1 text-white font-bold truncate max-w-[170px]">{bkt.name}</h4>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-white group-hover:text-accent transition-colors shrink-0" />
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        const container = e.currentTarget.previousElementSibling;
                        if (container) {
                          container.scrollBy({ left: 320, behavior: "smooth" });
                        }
                      }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-surface-3 hover:bg-accent border border-border-subtle hover:border-accent text-foreground hover:text-white w-10 h-10 hidden md:flex items-center justify-center rounded-full shadow-md transition-all cursor-pointer text-sm font-bold"
                      title="Scroll Right"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Render Individual Products */}
              {sectionProducts.length > 0 && (
                <div className="space-y-6 relative">
                  <h3 className="font-serif text-xl text-foreground/80 border-l-2 border-emerald-400 pl-3">Featured Curation</h3>
                  <div className="relative px-0 md:px-12 group/carousel">
                    <button
                      type="button"
                      onClick={(e) => {
                        const container = e.currentTarget.nextElementSibling;
                        if (container) {
                          container.scrollBy({ left: -320, behavior: "smooth" });
                        }
                      }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-surface-3 hover:bg-accent border border-border-subtle hover:border-accent text-foreground hover:text-white w-10 h-10 hidden md:flex items-center justify-center rounded-full shadow-md transition-all cursor-pointer text-sm font-bold"
                      title="Scroll Left"
                    >
                      &larr;
                    </button>
                    <div className="grid grid-cols-2 gap-3 md:flex md:gap-5 md:overflow-x-auto md:snap-x md:scroll-smooth scrollbar-none md:pb-4 md:px-1 items-start">
                      {sectionProducts.map((p: any) => (
                        <div key={p.id} className="w-full md:w-[280px] md:shrink-0 md:snap-start">
                          <ProductCard
                            key={p.id}
                            p={p}
                            toggleShopWishlist={toggleShopWishlist}
                            addToShopCart={addToShopCart}
                            wishlist={state.shopWishlist[state.user?.id || ""]}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        const container = e.currentTarget.previousElementSibling;
                        if (container) {
                          container.scrollBy({ left: 320, behavior: "smooth" });
                        }
                      }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-surface-3 hover:bg-accent border border-border-subtle hover:border-accent text-foreground hover:text-white w-10 h-10 hidden md:flex items-center justify-center rounded-full shadow-md transition-all cursor-pointer text-sm font-bold"
                      title="Scroll Right"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              )}
            </section>
          );
        }
        return null;
    }
  };

  return (
    <div className="space-y-16 pb-16 relative overflow-hidden">
      {/* Interactive Golden Glow Background */}
      <motion.div
        className="hidden lg:block fixed pointer-events-none z-0 w-[500px] h-[500px] rounded-full blur-[140px] mix-blend-screen opacity-[0.25]"
        style={{
          x: glowX,
          y: glowY,
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.45) 0%, transparent 70%)",
        }}
      />
      {showRobot && (
        <div 
          ref={splineContainerRef}
          className="hidden lg:block fixed right-2 bottom-[-70px] w-[220px] h-[220px] pointer-events-auto z-30 select-none"
        >
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      )}

      {layout.sectionOrder
        .filter((sectionId: string) => ["hero", "recentlyViewed"].includes(sectionId) || sectionId.startsWith("section-") || sectionId.startsWith("subbanner-"))
        .map((sectionId: string) => {
          return (
            <div key={sectionId} id={sectionId} className="relative z-10">
              {renderSection(sectionId)}
            </div>
          );
        })}
    </div>
  );
}

function RotatableBanner({ banner, sectionId }: { banner: any; sectionId: string }) {
  const slides = banner.banners || [
    {
      id: "root",
      desktopImage: banner.desktopImage,
      mobileImage: banner.mobileImage || banner.desktopImage,
      redirectUrl: banner.redirectUrl || "/shop",
      scale: banner.scale || 1.0,
      xOffset: banner.xOffset || 0,
      yOffset: banner.yOffset || 0,
      title: banner.title || banner.name || "Showcase Collection",
      subtitle: banner.subtitle || "",
      buttonText: banner.buttonText || "Discover Collection"
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlide = slides[activeIdx % slides.length] || slides[0];

  return (
    <section key={sectionId} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative">
      <FadeUp>
        <div className="relative aspect-[16/10] lg:aspect-[21/9] min-h-[180px] sm:min-h-[260px] overflow-hidden bg-zinc-950 group rounded-3xl border border-border-subtle">
          <Link
            to={currentSlide.redirectUrl || "/shop"}
            className="absolute inset-0 block w-full h-full z-20"
          >
            <div
              className="absolute inset-0 w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-[1.05]"
              style={{
                backgroundImage: `url(${currentSlide.desktopImage})`,
                transform: `scale(${currentSlide.scale || 1.0}) translate(${currentSlide.xOffset || 0}%, ${currentSlide.yOffset || 0}%)`,
                transformOrigin: "center center"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center space-y-3 max-w-xl z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Featured Showcase</span>
              <h3 className="font-serif text-3xl md:text-4xl text-white leading-tight">
                {currentSlide.title || "Showcase Collection"}
              </h3>
              {currentSlide.subtitle && <p className="text-xs text-zinc-300 font-sans">{currentSlide.subtitle}</p>}
              <span className="text-[10px] uppercase tracking-widest text-white hover:text-accent font-bold transition-colors">
                {currentSlide.buttonText || "Discover Collection"} &rarr;
              </span>
            </div>
          </Link>

          {/* Slider Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
              {slides.map((_: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === activeIdx ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </FadeUp>
    </section>
  );
}

function ProductCard({
  p,
  toggleShopWishlist,
  addToShopCart,
  wishlist,
  discountPercent,
  stockWarningText,
}: {
  p: any;
  toggleShopWishlist: (uid: string, pid: string) => void;
  addToShopCart: (p: any) => void;
  wishlist: string[] | undefined;
  discountPercent?: number;
  stockWarningText?: string;
}) {
  const { state } = usePortal();
  const { triggerPopup } = useShopNotification();
  const userId = state.user?.id;
  const isFavorite = wishlist ? wishlist.includes(p.id) : false;
  const quickAdd = useContext(QuickAddContext);

  const gallery = (p.images && p.images.length > 0) ? p.images : [p.image];
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = useCallback((e: React.MouseEvent) => {
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
  }, []);

  const handleLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
    }
  }, []);

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
    if (quickAdd) {
      quickAdd.openQuickAdd(p);
    }
  };

  // Calculate discounted price if applicable
  const pct = discountPercent || p.discount || 0;
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
      onMouseMove={(e) => {
        setIsHovered(true);
        handleMove(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleLeave();
      }}
      className="group glass glass-reflect glass-edge relative flex h-full flex-col overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)] cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* image */}
      <div className="relative aspect-[4/5] shrink-0 overflow-hidden bg-charcoal/5">
        <Link to="/product/$productId" params={{ productId: p.id }} className="block w-full h-full">
          <img
            src={gallery[activeImgIdx]}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block" />

        {displayPct > 0 && (
          <span className="glass-strong glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-ink z-10">
            {displayPct}% OFF
          </span>
        )}

        {stockWarningText && (
          <span className="glass absolute bottom-3 left-3 rounded-full bg-amber-500/20 border border-amber-500/35 px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] font-bold text-amber-300 z-10">
            {stockWarningText}
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
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* wishlist */}
        <motion.button
          type="button"
          onClick={handleWishlistClick}
          whileTap={{ scale: 0.8 }}
          className={cn(
            "glass glass-strong absolute right-2 top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full transition-shadow duration-300 sm:right-3 sm:top-3 sm:h-11 sm:w-11 cursor-pointer",
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

        {/* Add to Bag slides up - desktop only */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-[130%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 md:block">
          <button
            type="button"
            onClick={handleAddToCartClick}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter,transform] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105 active:scale-[0.97] cursor-pointer"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Add to Bag
          </button>
        </div>
      </div>

      {/* details */}
      <div className="relative z-[2] flex flex-1 flex-col gap-2 p-2.5 sm:gap-3 sm:p-4 bg-black/25">
        <div className="flex flex-1 items-start justify-between gap-2 sm:gap-2.5">
          <div className="min-w-0">
            <Link
              to="/product/$productId"
              params={{ productId: p.id }}
              className="hover:text-accent transition-colors block"
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
            >
              <h3 className="truncate text-[13px] text-ink sm:text-[15px] font-sans font-medium leading-tight">
                {p.name}
              </h3>
            </Link>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-muted sm:text-xs">
              <Star size={11} className="fill-gold text-gold" />
              {(p.rating || 4.8).toFixed(1)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="block text-[13px] text-gold sm:text-[15px] font-bold">
              {displayFinalPrice}
            </span>
            {hasDiscount && (
              <span className="block text-[11px] text-ink-muted line-through sm:text-xs">
                {displayOrigPrice}
              </span>
            )}
          </div>
        </div>

        {/* Sizes Row */}
        <div
          className="transition-all duration-350 ease-in-out overflow-hidden"
          style={{
            maxHeight: isTitleHovered ? "24px" : "0px",
            opacity: isTitleHovered ? 1 : 0,
            marginTop: isTitleHovered ? "4px" : "0px",
          }}
        >
          <div className="flex items-center gap-1.5 w-full">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground shrink-0 font-bold">Sizes:</span>
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

        {/* add to bag — mobile/tablet: always visible, no hover needed */}
        <button
          type="button"
          onClick={handleAddToCartClick}
          className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2 text-[10px] tracking-[0.16em] sm:min-h-[44px] sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] md:hidden cursor-pointer shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter,transform] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105 active:scale-[0.97]"
        >
          <ShoppingBag size={13} strokeWidth={2} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}
