import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp } from "@/components/motion/Reveal";
import { useAppStore, type PublishedContest } from "@/lib/portal-state";
import { BrandLogo } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/FashionBattle/apply/")({
  head: () => ({ meta: [{ title: "Apply — ReeVibes" }, { name: "description", content: "Apply to be considered for the next ReeVibes season." }] }),
  component: ApplyPage,
});

function ContestCardLogo({ contest }: { contest: PublishedContest }) {
  const { theme } = useTheme();
  const [logos, setLogos] = useState<{ white: string | null; black: string | null }>({ white: null, black: null });

  useEffect(() => {
    if (contest.logoWhite || contest.logoBlack) {
      setLogos({ white: contest.logoWhite || null, black: contest.logoBlack || null });
      return;
    }
    
    // Fallback: fetch dynamically if not set
    if (contest.country && contest.country !== "Global") {
      fetch(`/api/countries-logos?country=${encodeURIComponent(contest.country)}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setLogos({ white: data.whiteLogo || null, black: data.blackLogo || null });
          }
        })
        .catch(err => console.error("Error fetching logos dynamically:", err));
    }
  }, [contest]);

  const displayLogo = theme === "dark" 
    ? (logos.white || contest.logo) 
    : (logos.black || contest.logo);

  if (displayLogo) {
    return (
      <img
        src={displayLogo}
        alt={contest.country}
        className="w-48 h-16 object-contain transition-transform duration-300 group-hover:scale-105"
      />
    );
  }

  return <BrandLogo className="w-24 h-auto object-contain transition-transform duration-300 group-hover:scale-105" />;
}

function ApplyPage() {
  const { state } = useAppStore();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const publishedContests = state.contests.filter(c => c.published);

  const handleCardClick = (id: string) => {
    if (!state.user) {
      sessionStorage.setItem("apply:redirectContestId", id);
      navigate({ to: "/FashionBattle/login" });
    } else {
      navigate({ to: `/apply/${id}` });
    }
  };

  if (!mounted) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <header className="px-6 lg:px-16 pt-24 pb-12 border-b border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">Apply · Season 04 Casting</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-5xl lg:text-7xl">Select Your Country</h1></FadeUp>
        <FadeUp delay={0.2}>
          <p className="mt-4 text-muted-foreground text-sm max-w-xl">
            Choose a published country edition to start your application. Every entry is reviewed personally by our casting team.
          </p>
        </FadeUp>
      </header>

      <section className="px-6 lg:px-16 py-16">
        {publishedContests.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border-subtle">
            <p className="font-serif text-2xl text-muted-foreground">No live contests available at this moment.</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Please check back later or contact support.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedContests.map(c => (
              <div
                key={c.id}
                onClick={() => handleCardClick(c.id)}
                className="group relative cursor-pointer aspect-[16/7] bg-surface hover:bg-surface-2 border border-border-subtle hover:border-accent/40 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden rounded shadow-xl"
              >
                {/* Top label */}
                <div className="editorial-label text-[10px] text-muted-foreground/60 tracking-[0.2em] font-medium">
                  LIVE · {c.year}
                </div>

                {/* Centered dynamic logo */}
                <div className="flex flex-col items-center justify-center flex-1 my-3">
                  <ContestCardLogo contest={c} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
