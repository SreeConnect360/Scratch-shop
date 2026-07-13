import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp } from "@/components/motion/Reveal";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/FashionBattle/angels")({
  head: () => ({
    meta: [
      { title: "Angels — ReeVibes" },
      { name: "description", content: "The crowned winners of ReeVibes — official representatives of our editorial vision." }
    ]
  }),
  component: AngelsPage,
});

function AngelsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/angels")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
      })
      .catch((err) => console.error("Error loading angels:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <PublicLayout>
      <header className="px-6 lg:px-16 pt-24 pb-16 border-b border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">Hall of Fame</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-6 font-serif text-6xl lg:text-8xl">Angels</h1></FadeUp>
        <FadeUp delay={0.2}>
          <p className="mt-6 max-w-xl text-muted-foreground">
            The crowned winners of ReeVibes around the world — official representatives of our editorial vision.
          </p>
        </FadeUp>
      </header>

      <section className="px-6 lg:px-16 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border-subtle max-w-md mx-auto my-8">
            <p className="text-muted-foreground font-serif text-lg">No crowned winners posted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {posts.map((post, i) => (
              <FadeUp key={post.angelsPostId} delay={i * 0.1}>
                <div className="relative group overflow-hidden bg-surface dark:bg-zinc-950 border border-amber-500/20 dark:border-amber-500/10 shadow-2xl p-6 md:p-8 flex flex-col justify-between rounded-xl transition-all duration-500 hover:border-amber-500/40 hover:shadow-amber-500/5">
                  {/* Celebratory background decoration */}
                  <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Top: Country Logo */}
                  <div className="flex flex-col items-center justify-center mb-6 text-center z-10">
                    <div className="h-16 flex items-center justify-center max-w-[200px]">
                      {post.logoUrl ? (
                        <img 
                          src={post.logoUrl} 
                          alt={`${post.countryName} Logo`} 
                          className="max-h-12 w-auto object-contain dark:invert-0 filter dark:brightness-100" 
                        />
                      ) : (
                        <div className="font-serif text-2xl tracking-widest text-amber-500/80 uppercase font-bold">
                          {post.countryName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Winner Photo Frame */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-amber-500/30 bg-surface-2 shadow-inner group/photo">
                    {/* Corner accents */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-amber-500/50 z-10" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-amber-500/50 z-10" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber-500/50 z-10" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-amber-500/50 z-10" />
                    
                    <img 
                      src={post.winnerPhotoUrl} 
                      alt={post.winnerName || "Winner"} 
                      className="w-full h-full object-cover img-cinematic transition-transform duration-[2000ms] group-hover/photo:scale-105" 
                    />
                  </div>

                  {/* Bottom: Winner Details and Coronation info */}
                  <div className="mt-6 text-center z-10 flex flex-col items-center gap-3">
                    {post.winnerName && (
                      <div className="inline-block px-4 py-1.5 border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 font-serif text-lg tracking-wider rounded">
                        {post.winnerName}
                      </div>
                    )}
                    <div className="mt-1">
                      <div className="text-accent font-serif tracking-widest uppercase text-xs font-semibold mb-1">
                        Official Coronation
                      </div>
                      <h2 className="font-serif text-2xl text-foreground font-semibold">
                        ReeVibes {post.countryName} {post.year} Winner
                      </h2>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
