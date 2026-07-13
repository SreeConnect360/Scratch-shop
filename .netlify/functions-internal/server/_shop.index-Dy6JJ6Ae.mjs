import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as usePortal, k as useShopNotification, Q as QuickAddContext, c as cn, j as isDesktopPointer, p as prefersReducedMotion } from "./_ssr/router-BFsnZUKW.mjs";
import { F as FadeUp } from "./_ssr/Reveal-DABDixyV.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/react-oauth__google.mjs";
import "./_libs/maplibre-gl.mjs";
import { a as useSpring, m as motion, A as AnimatePresence, u as useMotionValue } from "./_libs/framer-motion.mjs";
import { A as ArrowRight, ad as Mail, J as ArrowUpRight, ae as Flame, b as ChevronLeft, d as ChevronRight, a6 as Heart, f as ShoppingBag } from "./_libs/lucide-react.mjs";
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
import "./_libs/zod.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
const Spline = reactExports.lazy(() => import("./_libs/splinetool__react-spline.mjs"));
function SplineScene({ scene, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    reactExports.Suspense,
    {
      fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loader" }) }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Spline,
        {
          scene,
          className
        }
      )
    }
  );
}
function MagneticButton({
  strength = 10,
  variant = "gold",
  className,
  children,
  onClick,
  ...rest
}) {
  const ref = reactExports.useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const handleMove = reactExports.useCallback(
    (e) => {
      if (!isDesktopPointer() || prefersReducedMotion() || !ref.current)
        return;
      const r = ref.current.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) / (r.width / 2) * strength);
      y.set(
        (e.clientY - (r.top + r.height / 2)) / (r.height / 2) * strength
      );
    },
    [strength, x, y]
  );
  const handleLeave = reactExports.useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);
  const handleClick = reactExports.useCallback(
    (e) => {
      const btn = ref.current;
      if (btn) {
        const r = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const d = Math.max(r.width, r.height) * 2;
        ripple.style.cssText = `position:absolute;border-radius:9999px;pointer-events:none;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px;width:${d}px;height:${d}px;background:radial-gradient(circle,rgba(255,255,255,0.35),transparent 60%);transform:scale(0);opacity:1;transition:transform .6s ease,opacity .7s ease;`;
        btn.appendChild(ripple);
        requestAnimationFrame(
          () => requestAnimationFrame(() => {
            ripple.style.transform = "scale(1)";
            ripple.style.opacity = "0";
          })
        );
        setTimeout(() => ripple.remove(), 750);
      }
      onClick?.(e);
    },
    [onClick]
  );
  const variants = {
    gold: "bg-gradient-to-br from-gold-soft via-gold to-gold-deep text-obsidian shadow-[0_10px_30px_-8px_rgba(200,169,106,0.55)] hover:shadow-[0_16px_44px_-8px_rgba(200,169,106,0.7)]",
    glass: "glass glass-reflect text-ink hover:border-gold/40 hover:shadow-[0_0_30px_-6px_rgba(200,169,106,0.35)]",
    ghost: "border border-transparent text-ink-muted hover:text-ink hover:border-[var(--glass-border)]"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.button,
    {
      ref,
      "data-cursor": "button",
      style: { x: sx, y: sy },
      whileTap: { scale: 0.96 },
      onMouseMove: handleMove,
      onMouseLeave: handleLeave,
      onClick: handleClick,
      className: cn(
        "relative inline-flex min-h-[44px] items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-semibold tracking-[0.12em] uppercase transition-[box-shadow,border-color,color] duration-300 will-change-transform",
        variants[variant],
        className
      ),
      ...rest,
      children
    }
  );
}
function ShopHome() {
  const {
    state,
    toggleShopWishlist,
    addToShopCart
  } = usePortal();
  const products = (state.products || []).filter((p) => !p.status || p.status === "PUBLISHED" || p.status === "published");
  const isPreview = typeof window !== "undefined" && window.location.search.includes("preview=true");
  const layout = isPreview ? state.homepageLayoutDraft : state.homepageLayout;
  const glowX = useSpring(0, {
    damping: 50,
    stiffness: 180
  });
  const glowY = useSpring(0, {
    damping: 50,
    stiffness: 180
  });
  reactExports.useEffect(() => {
    const handleGlowMouseMove = (e) => {
      glowX.set(e.clientX - 250);
      glowY.set(e.clientY - 250);
    };
    window.addEventListener("mousemove", handleGlowMouseMove);
    return () => window.removeEventListener("mousemove", handleGlowMouseMove);
  }, []);
  const showRobot = layout?.assistant?.enabled !== false;
  const splineContainerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleGlobalMouseMove = (e) => {
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
        cancelable: true
      });
      canvas.dispatchEvent(clonedEvent);
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [showRobot]);
  const [activeHeroIdx, setActiveHeroIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const banners = layout.hero?.banners;
    if (banners && banners.length > 1) {
      const slideInterval = setInterval(() => {
        setActiveHeroIdx((prev) => (prev + 1) % banners.length);
      }, 5e3);
      return () => clearInterval(slideInterval);
    }
  }, [layout.hero?.banners]);
  const [activeFeedIdx, setActiveFeedIdx] = reactExports.useState(0);
  const demoPurchases = [{
    name: "Priya",
    item: "Oversized Hoodie",
    time: "2 minutes ago"
  }, {
    name: "Rahul",
    item: "Black Maxi Dress",
    time: "5 minutes ago"
  }, {
    name: "Ananya",
    item: "Tailored Linen Blazer",
    time: "12 minutes ago"
  }, {
    name: "Kabir",
    item: "Cashmere Cape",
    time: "15 minutes ago"
  }];
  reactExports.useEffect(() => {
    if (layout?.liveFeed?.enabled) {
      const feedInterval = setInterval(() => {
        setActiveFeedIdx((prev) => (prev + 1) % demoPurchases.length);
      }, 5e3);
      return () => clearInterval(feedInterval);
    }
  }, [layout]);
  const [timeLeft, setTimeLeft] = reactExports.useState({
    hours: 12,
    minutes: 22,
    seconds: 30
  });
  reactExports.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return {
          ...prev,
          seconds: prev.seconds - 1
        };
        if (prev.minutes > 0) return {
          ...prev,
          minutes: prev.minutes - 1,
          seconds: 59
        };
        if (prev.hours > 0) return {
          hours: prev.hours - 1,
          minutes: 59,
          seconds: 59
        };
        clearInterval(timer);
        return prev;
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (t) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(t.hours)}h ${pad(t.minutes)}m ${pad(t.seconds)}s`;
  };
  const [newsletterSent, setNewsletterSent] = reactExports.useState(false);
  const [emailInput, setEmailInput] = reactExports.useState("");
  const [lookbookSelectedProduct, setLookbookSelectedProduct] = reactExports.useState(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("reevibes:recently_viewed");
        if (stored) {
          setRecentlyViewedIds(JSON.parse(stored).slice(0, 4));
        }
      } catch {
      }
    }
  }, []);
  const [activeSection, setActiveSection] = reactExports.useState("hero");
  reactExports.useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "categories", "collections", "flashSale", "trending", "bestSellers", "reviews", "brandStory", "newsletter", "footer"];
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
  const [heroMousePos, setHeroMousePos] = reactExports.useState({
    x: 0,
    y: 0
  });
  if (!layout) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 text-muted-foreground", children: "Initializing layout..." });
  }
  const renderSection = (sectionId) => {
    const sec = layout[sectionId];
    if (!sec || !sec.enabled) return null;
    switch (sectionId) {
      case "hero":
        const heroData = layout.hero;
        if (!heroData.banners || heroData.banners.length === 0) return null;
        const currentBanner = heroData.banners[activeHeroIdx % heroData.banners.length];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "hero", "aria-label": "Featured stories", className: "relative flex min-h-[75svh] flex-col items-center justify-center overflow-hidden pb-14 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute left-1/2 top-[16%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-shell relative z-10 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "region", "aria-roledescription": "carousel", "aria-label": "Seasonal highlights", className: "glass glass-edge group relative h-[55svh] min-h-[26rem] w-full overflow-hidden rounded-[1.8rem] sm:h-[62svh]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "sync", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
              opacity: 0,
              scale: 1.04
            }, animate: {
              opacity: 1,
              scale: 1
            }, exit: {
              opacity: 0
            }, transition: {
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }, className: "absolute inset-0", children: [
              currentBanner.type === "Video Banner" && currentBanner.videoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.video, { src: currentBanner.videoUrl, autoPlay: true, loop: true, muted: true, playsInline: true, initial: {
                scale: 1
              }, animate: {
                scale: 1.08
              }, transition: {
                duration: 6,
                ease: "linear"
              }, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(motion.img, { src: currentBanner.desktopImage, alt: currentBanner.title, initial: {
                scale: 1
              }, animate: {
                scale: 1.08
              }, transition: {
                duration: 6,
                ease: "linear"
              }, className: "h-full w-full object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-14 z-20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
                  opacity: 0,
                  y: 22
                }, animate: {
                  opacity: 1,
                  y: 0
                }, transition: {
                  delay: 0.25,
                  duration: 0.6
                }, className: "mb-3 text-[10.5px] tracking-[0.34em] uppercase text-gold-soft", children: currentBanner.subtitle || "The Curation Édition" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h1, { initial: {
                  opacity: 0,
                  y: 26,
                  filter: "blur(6px)"
                }, animate: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)"
                }, transition: {
                  delay: 0.35,
                  duration: 0.7
                }, className: "max-w-2xl text-balance text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl", children: currentBanner.title || "Wear the Extraordinary" }),
                currentBanner.description && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
                  opacity: 0,
                  y: 22
                }, animate: {
                  opacity: 1,
                  y: 0
                }, transition: {
                  delay: 0.48,
                  duration: 0.6
                }, className: "mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base", children: currentBanner.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
                  opacity: 0,
                  y: 20
                }, animate: {
                  opacity: 1,
                  y: 0
                }, transition: {
                  delay: 0.6,
                  duration: 0.6
                }, className: "mt-6 flex flex-wrap gap-4", children: currentBanner.redirectUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: currentBanner.redirectUrl, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(MagneticButton, { variant: "gold", children: [
                  currentBanner.buttonText || "Discover Now",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 15, "aria-hidden": "true" })
                ] }) }) })
              ] })
            ] }, activeHeroIdx) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "Previous banner", onClick: () => setActiveHeroIdx((prev) => prev === 0 ? heroData.banners.length - 1 : prev - 1), className: "glass absolute left-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white opacity-0 transition-all duration-300 hover:border-gold/40 hover:text-gold-soft group-hover:opacity-100 focus-visible:opacity-100 sm:flex cursor-pointer", style: {
              position: "absolute",
              left: "1rem"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 18 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "Next banner", onClick: () => setActiveHeroIdx((prev) => (prev + 1) % heroData.banners.length), className: "glass absolute right-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white opacity-0 transition-all duration-300 hover:border-gold/40 hover:text-gold-soft group-hover:opacity-100 focus-visible:opacity-100 sm:flex cursor-pointer", style: {
              position: "absolute",
              right: "1rem"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 18 }) }),
            heroData.banners.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-5 right-6 z-35 flex items-center gap-2 sm:bottom-7 sm:right-9", role: "tablist", "aria-label": "Choose banner", children: heroData.banners.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "tab", "aria-selected": idx === activeHeroIdx, onClick: () => setActiveHeroIdx(idx), className: "group/dot relative flex h-6 items-center cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `block h-1.5 rounded-full transition-all duration-500 ${idx === activeHeroIdx ? "w-8 bg-gold shadow-[0_0_12px_rgba(200,169,106,0.7)]" : "w-1.5 bg-white/40 group-hover/dot:bg-white/70"}` }) }, idx)) })
          ] }) })
        ] }, sectionId);
      case "categories":
        const catData = layout.categories;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "categories", "aria-labelledby": "categories-title", className: "relative py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-shell", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0,
            y: 28,
            filter: "blur(8px)"
          }, whileInView: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)"
          }, viewport: {
            once: true,
            margin: "-80px"
          }, transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }, className: "mb-10 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-3 flex items-center justify-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-8 bg-gold/50", "aria-hidden": "true" }),
              "Curated Departments",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-8 bg-gold/50", "aria-hidden": "true" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "categories-title", className: "text-3xl text-ink sm:text-4xl", children: "Shop by Category" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5", children: catData.items.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
            opacity: 0,
            y: 32
          }, whileInView: {
            opacity: 1,
            y: 0
          }, viewport: {
            once: true,
            margin: "-60px"
          }, transition: {
            duration: 0.6,
            delay: i * 0.07,
            ease: [0.22, 1, 0.36, 1]
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: cat.redirectUrl, className: "glass glass-reflect glass-edge group cursor-pointer overflow-hidden rounded-2xl block w-full text-left aspect-[3/4]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full w-full overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: cat.image, alt: "", loading: "lazy", className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 flex items-end justify-between p-3.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[15px] text-white", children: cat.name }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { size: 15, "aria-hidden": "true", className: "mb-1 text-gold-soft opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" })
            ] })
          ] }) }) }, cat.id)) })
        ] }) });
      case "flashSale":
        const fs = layout.flashSale;
        const fsProducts = products.filter((p) => fs.products.includes(p.id));
        if (fsProducts.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-3 sm:px-5 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass glass-reflect glass-edge p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10 rounded-3xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-6 h-6 text-red-500 animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-serif text-white", children: "Limited Flash Sale" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "Exclusive ",
                  fs.discount,
                  "% discount live right now"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground", children: "Ends In" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm font-bold text-red-400 mt-1", children: formatTime(timeLeft) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MagneticButton, { variant: "gold", children: "Shop Flash Sale" }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: fsProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""], discountPercent: fs.discount }, p.id)) })
        ] }, sectionId);
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
          trendingProductsList = products.filter((p) => trendingCuration.manualProducts.includes(p.id));
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-3 sm:px-5 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-end border-b border-border-subtle pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Trending Curation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mt-1", children: "High-Fidelity Statements" })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: trendingProductsList.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
        ] }, sectionId);
      case "newArrivals":
        const naConfig = layout.newArrival || {
          productCount: 3,
          layoutStyle: "grid"
        };
        const naProducts = products.slice(0, naConfig.productCount || 3);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-3 sm:px-5 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end border-b border-border-subtle pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "New Arrivals" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mt-1", children: "Season Statement Curation" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/categories", className: "text-xs uppercase tracking-widest font-semibold hover:text-accent flex items-center gap-1.5 transition-colors", children: [
              "View All ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: naConfig.layoutStyle === "carousel" ? "flex gap-8 overflow-x-auto pb-4 scrollbar-thin" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: naProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: naConfig.layoutStyle === "carousel" ? "w-80 shrink-0" : "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }) }, p.id)) })
        ] }, sectionId);
      case "campaign":
        const camp = layout.campaign;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-3 sm:px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[21/9] min-h-[300px] overflow-hidden bg-zinc-950 group rounded-3xl border border-border-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: camp.image, className: "absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105", alt: "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 p-8 md:p-12 flex flex-col justify-center space-y-4 max-w-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-[0.2em] text-accent font-bold", children: "Editorial Fashion Campaign" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-3xl md:text-4xl text-white leading-tight", children: camp.heading }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: camp.redirectUrl || "/categories", className: "liquid-glass-btn bg-white text-zinc-950 font-bold px-6 py-2.5 text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-full w-fit", children: camp.ctaText || "Explore Curation" })
          ] })
        ] }) }) }, sectionId);
      case "collections":
        const colData = layout.collections;
        const colProducts = products.slice(0, 3);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-3 sm:px-5 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/1] min-h-[220px] rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: colData.coverImage, className: "absolute inset-0 w-full h-full object-cover opacity-60", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl md:text-5xl italic tracking-widest text-white uppercase font-bold", children: colData.collectionId }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: colProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
        ] }, sectionId);
      case "liveFeed":
        const activeFeed = demoPurchases[activeFeedIdx];
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 left-6 z-40 animate-in slide-in-from-bottom-5 duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-white/20 px-4 py-3 rounded-full flex items-center gap-3 bg-black/85 shadow-2xl max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground leading-normal pr-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: activeFeed.name }),
            " from Mumbai purchased ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-accent", children: activeFeed.item }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic", children: activeFeed.time })
          ] })
        ] }) }, sectionId);
      case "bestSellers":
        const bsConfig = layout.bestSellers;
        let bsProducts = [];
        if (bsConfig.autoMode) {
          bsProducts = products.slice(1, 4);
        } else {
          bsProducts = products.filter((p) => bsConfig.manualProducts.includes(p.id));
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-3 sm:px-5 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border-subtle pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Best Sellers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mt-1", children: "Most Coveted Curation" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: bsProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
        ] }, sectionId);
      case "limitedStock":
        const lim = layout.limitedStock;
        const limProducts = products.filter((p) => {
          const totalStock = p.stockPerSize ? Object.values(p.stockPerSize).reduce((a, b) => a + b, 0) : 0;
          return totalStock > 0 && totalStock <= (lim.threshold || 5);
        }).slice(0, 3);
        if (limProducts.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-3 sm:px-5 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-500/10 border border-amber-500/20 p-4 rounded-3xl text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] font-bold text-amber-400", children: "High Conversion Alert" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg mt-1", children: "Couture Pieces Selling Fast" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: limProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""], stockWarningText: `Only ${Object.values(p.stockPerSize || {}).reduce((a, b) => a + b, 0)} left` }, p.id)) })
        ] }, sectionId);
      case "influencerPicks":
        const inf = layout.influencerPicks;
        const infProducts = products.filter((p) => inf.products.includes(p.id));
        if (infProducts.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-3 sm:px-5 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border-subtle pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-eyebrow text-accent", children: "Influencer Picks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl mt-1", children: "Editor's & Stylist Favorites" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: infProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
        ] }, sectionId);
      case "reviews":
        return null;
      case "lookbook":
        return null;
      case "recentlyViewed":
        const recentProducts = products.filter((p) => recentlyViewedIds.includes(p.id));
        if (recentProducts.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-3 sm:px-5 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-white/10 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg tracking-wider", children: "Recently Viewed" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: recentProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
              productId: p.id
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, className: "aspect-[3/4] object-cover rounded-2xl w-full", alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold truncate", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-accent font-bold", children: p.price })
          ] }, p.id)) })
        ] }, sectionId);
      case "recommended":
        layout.recommended;
        const recProducts = products.slice(0, 3);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-3 sm:px-5 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-white/10 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg tracking-wider", children: "Recommended For You" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-8", children: recProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
        ] }, sectionId);
      case "brandStory":
        const story = layout.brandStory;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "brand-story", className: "relative py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0,
            x: -36
          }, whileInView: {
            opacity: 1,
            x: 0
          }, viewport: {
            once: true,
            margin: "-80px"
          }, transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }, className: "relative grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass overflow-hidden rounded-3xl border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: story.image1, className: "aspect-[3/4] object-cover transition-transform duration-700 hover:scale-105", alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass overflow-hidden rounded-3xl border border-white/10 mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: story.image2, className: "aspect-[3/4] object-cover transition-transform duration-700 hover:scale-105", alt: "" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0,
            x: 36
          }, whileInView: {
            opacity: 1,
            x: 0
          }, viewport: {
            once: true,
            margin: "-80px"
          }, transition: {
            duration: 0.8,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1]
          }, className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-3 flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-8 bg-gold/50", "aria-hidden": "true" }),
              "Maison ReeVibes"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-balance text-3xl leading-[1.15] text-ink sm:text-4xl lg:text-[2.6rem]", children: [
              "Quiet luxury, ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gold-text", children: "loudly crafted." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] leading-relaxed text-ink-muted", children: story.text }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(MagneticButton, { variant: "glass", children: [
              "Discover Collection ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14, "aria-hidden": "true" })
            ] }) }) })
          ] })
        ] }) }, sectionId);
      case "newsletter":
        const news = layout.newsletter;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "newsletter", "aria-labelledby": "newsletter-heading", className: "relative py-16 md:py-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[22rem] w-[44rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[110px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-shell max-w-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
            opacity: 0,
            y: 34,
            filter: "blur(8px)"
          }, whileInView: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)"
          }, viewport: {
            once: true,
            margin: "-80px"
          }, transition: {
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1]
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass glass-strong rounded-3xl p-8 text-center sm:p-12 border border-white/10 shadow-[var(--glass-shadow)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", className: "mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold shadow-[var(--gold-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 22, strokeWidth: 1.6 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "newsletter-heading", className: "text-balance text-2xl text-ink sm:text-3xl font-serif", children: news.heading || "Join the Private List" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted", children: news.subheading || "Seasonal previews, atelier stories, and first access to the Flash Édit — a few beautiful letters a year." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: newsletterSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.p, { initial: {
              opacity: 0,
              scale: 0.92
            }, animate: {
              opacity: 1,
              scale: 1
            }, className: "mx-auto mt-7 flex max-w-md items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/10 py-3.5 text-sm text-gold", role: "status", children: [
              "✓ Congratulations! Your ₹",
              news.rewardAmount,
              " Coupon code [FESTIVE",
              news.rewardAmount,
              "] has been sent to your email."
            ] }, "done") : /* @__PURE__ */ jsxRuntimeExports.jsx(motion.form, { exit: {
              opacity: 0,
              scale: 0.96
            }, onSubmit: (e) => {
              e.preventDefault();
              if (emailInput.trim()) setNewsletterSent(true);
            }, noValidate: true, className: "mx-auto mt-7 max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "newsletter-email", className: "sr-only", children: "Email address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "newsletter-email", type: "email", required: true, placeholder: "your@email.com", value: emailInput, onChange: (e) => setEmailInput(e.target.value), className: "glass min-h-[48px] flex-1 rounded-full border-[var(--glass-border)] bg-transparent px-6 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold/50 focus:outline-none text-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MagneticButton, { variant: "gold", type: "submit", children: "Send Credits" })
            ] }) }, "form") })
          ] }) }) })
        ] }, sectionId);
      default:
        if (sectionId.startsWith("banner-") || sectionId.startsWith("subbanner-")) {
          const banner = layout[sectionId];
          if (!banner) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(RotatableBanner, { banner, sectionId }, sectionId);
        } else if (sectionId.startsWith("bucket-")) {
          const bucketSection = layout[sectionId];
          if (!bucketSection) return null;
          const bucket = state.buckets?.find((b) => b.id === bucketSection.id);
          if (!bucket) return null;
          const starProd = products.find((p) => p.id === bucket.starProductId) || products.find((p) => bucket.productIds.includes(p.id));
          const thumbnail = starProd?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&h=500&q=80";
          const bucketProducts = products.filter((p) => bucket.productIds.includes(p.id));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[21/9] min-h-[220px] rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: thumbnail, className: "absolute inset-0 w-full h-full object-cover opacity-60", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-black/40 flex flex-col justify-center p-8 md:p-12", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-accent font-bold", children: "Curated Set Selection" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl md:text-4xl text-white font-bold mt-1 uppercase tracking-wider", children: bucket.name })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5", children: bucketProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id)) })
          ] }, sectionId);
        } else if (sectionId.startsWith("section-")) {
          const sec2 = layout[sectionId];
          if (!sec2) return null;
          const sectionBuckets = (sec2.bucketIds || []).map((bid) => state.buckets?.find((b) => b.id === bid)).filter(Boolean);
          const sectionProducts = (sec2.productIds || []).map((pid) => products.find((p) => p.id === pid)).filter(Boolean);
          if (sectionBuckets.length === 0 && sectionProducts.length === 0) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 space-y-12 animate-in fade-in duration-300 relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-white/10 pb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl text-foreground tracking-wide", children: sec2.name || "Curated Section" }),
              sec2.subname && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-accent mt-1.5 font-sans font-semibold", children: sec2.subname })
            ] }),
            sectionBuckets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl text-accent border-l-2 border-accent pl-3", children: "Curated Collections" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative px-12 group/carousel", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
                  const container = e.currentTarget.nextElementSibling;
                  if (container) {
                    container.scrollBy({
                      left: -320,
                      behavior: "smooth"
                    });
                  }
                }, className: "absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-surface-3 hover:bg-accent border border-border-subtle hover:border-accent text-foreground hover:text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all cursor-pointer text-sm font-bold", title: "Scroll Left", children: "←" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-5 overflow-x-auto snap-x scroll-smooth scrollbar-none pb-4 px-1", children: sectionBuckets.map((bkt) => {
                  const starProd = products.find((p) => p.id === bkt.starProductId) || products.find((p) => bkt.productIds?.includes(p.id));
                  const thumbnail = starProd?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&h=500&q=80";
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[280px] shrink-0 snap-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories", search: {
                    bucketId: bkt.id
                  }, className: "liquid-glass liquid-glass-card-hover relative flex flex-col group overflow-hidden bg-transparent border border-white/10 rounded-3xl block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[3/4] overflow-hidden bg-zinc-950 relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: thumbnail, className: "absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105", alt: "" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-6 flex justify-between items-center z-10", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-accent font-bold", children: "Curation Set" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg mt-1 text-white font-bold truncate max-w-[170px]", children: bkt.name })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 text-white group-hover:text-accent transition-colors shrink-0" })
                    ] })
                  ] }) }) }, bkt.id);
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
                  const container = e.currentTarget.previousElementSibling;
                  if (container) {
                    container.scrollBy({
                      left: 320,
                      behavior: "smooth"
                    });
                  }
                }, className: "absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-surface-3 hover:bg-accent border border-border-subtle hover:border-accent text-foreground hover:text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all cursor-pointer text-sm font-bold", title: "Scroll Right", children: "→" })
              ] })
            ] }),
            sectionProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl text-foreground/80 border-l-2 border-emerald-400 pl-3", children: "Featured Curation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative px-12 group/carousel", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
                  const container = e.currentTarget.nextElementSibling;
                  if (container) {
                    container.scrollBy({
                      left: -320,
                      behavior: "smooth"
                    });
                  }
                }, className: "absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-surface-3 hover:bg-accent border border-border-subtle hover:border-accent text-foreground hover:text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all cursor-pointer text-sm font-bold", title: "Scroll Left", children: "←" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-5 overflow-x-auto snap-x scroll-smooth scrollbar-none pb-4 px-1", children: sectionProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[280px] shrink-0 snap-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, toggleShopWishlist, addToShopCart, wishlist: state.shopWishlist[state.user?.id || ""] }, p.id) }, p.id)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
                  const container = e.currentTarget.previousElementSibling;
                  if (container) {
                    container.scrollBy({
                      left: 320,
                      behavior: "smooth"
                    });
                  }
                }, className: "absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-surface-3 hover:bg-accent border border-border-subtle hover:border-accent text-foreground hover:text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all cursor-pointer text-sm font-bold", title: "Scroll Right", children: "→" })
              ] })
            ] })
          ] }, sectionId);
        }
        return null;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-16 pb-16 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "hidden lg:block fixed pointer-events-none z-0 w-[500px] h-[500px] rounded-full blur-[140px] mix-blend-screen opacity-[0.25]", style: {
      x: glowX,
      y: glowY,
      background: "radial-gradient(circle, rgba(212, 175, 55, 0.45) 0%, transparent 70%)"
    } }),
    showRobot && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: splineContainerRef, className: "hidden lg:block fixed right-2 bottom-[-70px] w-[220px] h-[220px] pointer-events-auto z-30 select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplineScene, { scene: "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode", className: "w-full h-full" }) }),
    layout.sectionOrder.filter((sectionId) => ["hero", "recentlyViewed"].includes(sectionId) || sectionId.startsWith("section-") || sectionId.startsWith("subbanner-")).map((sectionId) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: sectionId, className: "relative z-10", children: renderSection(sectionId) }, sectionId);
    })
  ] });
}
function RotatableBanner({
  banner,
  sectionId
}) {
  const slides = banner.banners || [{
    id: "root",
    desktopImage: banner.desktopImage,
    mobileImage: banner.mobileImage || banner.desktopImage,
    redirectUrl: banner.redirectUrl || "/shop",
    scale: banner.scale || 1,
    xOffset: banner.xOffset || 0,
    yOffset: banner.yOffset || 0,
    title: banner.title || banner.name || "Showcase Collection",
    subtitle: banner.subtitle || "",
    buttonText: banner.buttonText || "Discover Collection"
  }];
  const [activeIdx, setActiveIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 5e3);
    return () => clearInterval(interval);
  }, [slides.length]);
  const currentSlide = slides[activeIdx % slides.length] || slides[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-6 lg:px-16 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[21/9] min-h-[260px] overflow-hidden bg-zinc-950 group rounded-3xl border border-border-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: currentSlide.redirectUrl || "/shop", className: "absolute inset-0 block w-full h-full z-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-[1.05]", style: {
        backgroundImage: `url(${currentSlide.desktopImage})`,
        transform: `scale(${currentSlide.scale || 1}) translate(${currentSlide.xOffset || 0}%, ${currentSlide.yOffset || 0}%)`,
        transformOrigin: "center center"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 p-8 md:p-12 flex flex-col justify-center space-y-3 max-w-xl z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-[0.2em] text-accent font-bold", children: "Featured Showcase" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-3xl md:text-4xl text-white leading-tight", children: currentSlide.title || "Showcase Collection" }),
        currentSlide.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-zinc-300 font-sans", children: currentSlide.subtitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest text-white hover:text-accent font-bold transition-colors", children: [
          currentSlide.buttonText || "Discover Collection",
          " →"
        ] })
      ] })
    ] }),
    slides.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5", children: slides.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setActiveIdx(idx), className: `w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIdx ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"}` }, idx)) })
  ] }) }) }, sectionId);
}
function ProductCard({
  p,
  toggleShopWishlist,
  addToShopCart,
  wishlist,
  discountPercent,
  stockWarningText
}) {
  const {
    state
  } = usePortal();
  const {
    triggerPopup
  } = useShopNotification();
  const userId = state.user?.id;
  const isFavorite = wishlist ? wishlist.includes(p.id) : false;
  const quickAdd = reactExports.useContext(QuickAddContext);
  const gallery = p.images && p.images.length > 0 ? p.images : [p.image];
  const [activeImgIdx, setActiveImgIdx] = reactExports.useState(0);
  const [isTitleHovered, setIsTitleHovered] = reactExports.useState(false);
  const [isHovered, setIsHovered] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const frame = reactExports.useRef(0);
  const handleMove = reactExports.useCallback((e) => {
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
  const handleLeave = reactExports.useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
    }
  }, []);
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      toast.error("Please login to manage your wishlist.");
      return;
    }
    toggleShopWishlist(userId, p.id);
    triggerPopup(!isFavorite ? `${p.name} added to wishlist!` : `${p.name} removed from wishlist.`, () => toggleShopWishlist(userId, p.id), !isFavorite ? `${p.name} removed from wishlist.` : `${p.name} added to wishlist!`, () => toggleShopWishlist(userId, p.id), !isFavorite ? `${p.name} added to wishlist!` : `${p.name} removed from wishlist.`);
  };
  const handleAddToCartClick = (e) => {
    e.preventDefault();
    if (quickAdd) {
      quickAdd.openQuickAdd(p);
    }
  };
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
    } catch {
    }
  }
  const ensureRupees = (val) => {
    if (val === void 0 || val === null) return "";
    const clean = String(val).trim();
    return clean.startsWith("₹") ? clean : `₹${clean}`;
  };
  const displayFinalPrice = ensureRupees(finalPrice);
  const displayOrigPrice = ensureRupees(origPrice);
  let displayPct = pct;
  if (hasDiscount && !displayPct) {
    try {
      const origNumeric = Number(String(origPrice).replace(/[^0-9]/g, ""));
      const finalNumeric = Number(String(finalPrice).replace(/[^0-9]/g, ""));
      if (origNumeric && finalNumeric && origNumeric > finalNumeric) {
        displayPct = Math.round((origNumeric - finalNumeric) / origNumeric * 100);
      }
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, onMouseMove: (e) => {
    setIsHovered(true);
    handleMove(e);
  }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => {
    setIsHovered(false);
    handleLeave();
  }, className: "group glass glass-reflect glass-edge relative overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:shadow-[var(--glass-shadow-hover)] flex flex-col justify-between h-full cursor-pointer", style: {
    transformStyle: "preserve-3d"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/5] overflow-hidden bg-charcoal/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
        productId: p.id
      }, className: "block w-full h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: gallery[activeImgIdx], alt: p.name, className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" }),
      displayPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "glass-strong glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-ink z-10", children: [
        displayPct,
        "% OFF"
      ] }),
      stockWarningText && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "glass absolute bottom-3 left-3 rounded-full bg-amber-500/20 border border-amber-500/35 px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] font-bold text-amber-300 z-10", children: stockWarningText }),
      gallery.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveImgIdx((prev) => prev === 0 ? gallery.length - 1 : prev - 1);
        }, className: "absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveImgIdx((prev) => prev === gallery.length - 1 ? 0 : prev + 1);
        }, className: "absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-accent text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.button, { type: "button", onClick: handleWishlistClick, whileTap: {
        scale: 0.8
      }, className: `glass glass-strong absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full cursor-pointer transition-all duration-300 ease-out ${isFavorite ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-[-10px] pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { initial: {
        scale: 0.4
      }, animate: {
        scale: 1
      }, transition: {
        type: "spring",
        stiffness: 480,
        damping: 15
      }, className: "flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 16, strokeWidth: 1.8, className: cn("transition-colors duration-300", isFavorite ? "fill-gold text-gold" : "text-ink") }) }, String(isFavorite)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-3 bottom-3 translate-y-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleAddToCartClick, className: "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-obsidian shadow-[0_10px_28px_-8px_rgba(200,169,106,0.6)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_14px_38px_-8px_rgba(200,169,106,0.8)] hover:brightness-105", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 14, strokeWidth: 2 }),
        "Add to Bag"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-[2] flex flex-col justify-between p-5 bg-black/25 flex-1 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground text-[9px]", children: p.house }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: {
        productId: p.id
      }, className: "hover:text-accent transition-colors block mt-1", onMouseEnter: () => setIsTitleHovered(true), onMouseLeave: () => setIsTitleHovered(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate font-serif text-sm font-medium text-ink leading-tight", children: p.name }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-accent", children: displayFinalPrice }),
        hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs line-through text-muted-foreground", children: displayOrigPrice })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `transition-all duration-300 overflow-hidden ${isTitleHovered ? "h-6 opacity-100 mt-1.5" : "h-0 opacity-0"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-muted-foreground shrink-0", children: "Sizes:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden w-full relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                  @keyframes marquee-pingpong {
                    0%, 15% { transform: translateX(0%); }
                    85%, 100% { transform: translateX(-45%); }
                  }
                ` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", style: isTitleHovered && (p.sizes || ["S", "M", "L", "XL"]).length > 3 ? {
            animation: "marquee-pingpong 4s ease-in-out infinite alternate",
            animationDelay: "1s",
            width: "max-content"
          } : {
            width: "max-content"
          }, children: (p.sizes || ["S", "M", "L", "XL"]).map((sz, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded border border-white/5 text-foreground whitespace-nowrap", children: sz }, sz + "-" + idx)) })
        ] })
      ] }) })
    ] }) })
  ] });
}
export {
  ShopHome as component
};
