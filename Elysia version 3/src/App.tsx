import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { StoreProvider } from "@/context/StoreContext";
import Particles from "@/components/Particles";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import SearchOverlay from "@/components/SearchOverlay";
import Toast from "@/components/Toast";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";

// Below-the-fold sections are code-split and lazy-loaded.
const Collections = lazy(() => import("@/components/sections/Collections"));
const FlashSale = lazy(() => import("@/components/sections/FlashSale"));
const Trending = lazy(() => import("@/components/sections/Trending"));
const BestSellers = lazy(() => import("@/components/sections/BestSellers"));
const Testimonials = lazy(() => import("@/components/sections/Testimonials"));
const BrandStory = lazy(() => import("@/components/sections/BrandStory"));
const Newsletter = lazy(() => import("@/components/sections/Newsletter"));
const Footer = lazy(() => import("@/components/sections/Footer"));

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-gold px-5 py-2 text-obsidian focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>

        <Particles />
        <Navbar />
        <BottomNav />
        <SearchOverlay />
        <Toast />

        <main id="main" className="relative z-[2] pb-24 md:pb-0">
          <Hero />
          <Categories />
          <Suspense fallback={<div className="min-h-[40vh]" aria-hidden="true" />}>
            <Collections />
            <FlashSale />
            <Trending />
            <BestSellers />
            <Testimonials />
            <BrandStory />
            <Newsletter />
            <Footer />
          </Suspense>
        </main>
      </StoreProvider>
    </ThemeProvider>
  );
}
