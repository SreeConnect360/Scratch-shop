import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { CinematicImage, FadeUp } from "@/components/motion/Reveal";
import { useState, useEffect } from "react";
import { X, Camera, Globe, Award, Calendar } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/best-photography")({
  head: () => ({
    meta: [
      { title: "Best Photography — ReeVibes" },
      { name: "description", content: "A dynamic curated gallery of this season's most evocative frames." }
    ]
  }),
  component: PhotographyPage,
});

type BestPhotographyPortfolio = {
  portfolioId: string;
  contestantId: string;
  contestantName: string;
  countryId: string;
  countryName: string;
  year: number;
  photoId: string;
  photoUrl: string;
  photographerId: string;
  photographerName: string;
  positionTag: "BEST PHOTOGRAPHY";
  publishStatus: "published" | "draft";
  createdDate: string;
  updatedDate: string;
  caption?: string;
  alt?: string;
};

function PhotographyPage() {
  const { theme } = useTheme();
  const [portfolio, setPortfolio] = useState<BestPhotographyPortfolio[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<BestPhotographyPortfolio | null>(null);

  useEffect(() => {
    const loadPortfolio = () => {
      try {
        const raw = window.localStorage.getItem("reevibes:best-photography:portfolio");
        if (raw) {
          const list: BestPhotographyPortfolio[] = JSON.parse(raw);
          // Filter to show only active, published BEST PHOTOGRAPHY records
          setPortfolio(list.filter(item => item.publishStatus === "published"));
        } else {
          setPortfolio([]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadPortfolio();
    window.addEventListener("storage", loadPortfolio);
    const interval = setInterval(loadPortfolio, 1000);

    return () => {
      window.removeEventListener("storage", loadPortfolio);
      clearInterval(interval);
    };
  }, []);

  return (
    <PublicLayout>
      <header className="px-6 lg:px-16 pt-28 pb-16 border-b border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">Visual Archive</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-6 font-serif text-6xl lg:text-8xl">Best Photography</h1></FadeUp>
        <FadeUp delay={0.2}>
          <p className="mt-6 max-w-xl text-muted-foreground">
            A dynamic curated showcase of this season's most evocative editorial frames — captured live by our network of master photographers.
          </p>
        </FadeUp>
      </header>

      <section className="px-6 lg:px-16 py-16 min-h-[40vh]">
        {portfolio.length === 0 ? (
          <div className="border border-dashed border-border-subtle py-24 text-center rounded max-w-md mx-auto">
            <Camera className="w-8 h-8 mx-auto text-muted-foreground/40 mb-4 animate-pulse" />
            <h3 className="font-serif text-xl text-foreground/80 mb-2">No Published Work Yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Photographers and administrators have not published any best photography portfolios for the live contest stages yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {portfolio.map((w, i) => {
              const span = i % 6 === 0
                ? "col-span-12 md:col-span-8 aspect-[16/10]"
                : i % 5 === 0
                ? "col-span-12 md:col-span-4 aspect-[4/5]"
                : "col-span-12 sm:col-span-6 md:col-span-4 aspect-[3/4]";
              return (
                <div
                  key={w.portfolioId}
                  className={`${span} flex flex-col group cursor-pointer`}
                  onClick={() => setSelectedPhoto(w)}
                >
                  <div className="w-full flex-1 overflow-hidden bg-black/5 border border-border-subtle rounded relative">
                    <img
                      src={w.photoUrl}
                      alt={w.alt || `By ${w.photographerName}`}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-[10px] text-white uppercase tracking-[0.2em] font-mono font-semibold">
                        View Editorial Frame
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-foreground leading-tight">{w.contestantName}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono uppercase mt-0.5">
                        <Globe className="w-3 h-3 text-muted-foreground/60" /> {w.countryName} · {w.year}
                      </p>
                    </div>
                    
                    {/* Highlighted Photographer Badge */}
                    <div className="bg-accent/10 border border-accent/20 px-2.5 py-1 rounded text-accent flex items-center gap-1.5 shrink-0 shadow-sm">
                      <Camera className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase tracking-wider font-semibold font-mono">
                        {w.photographerName}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Immersive Photo Detail View Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-background border border-border-subtle w-full max-w-4xl rounded shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh] text-foreground animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-surface/50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                <span className="editorial-label text-accent">Visual Archive · Best Photography Details</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 text-muted-foreground hover:text-foreground rounded border border-transparent hover:border-border-subtle transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                {/* Image display */}
                <div className="md:col-span-7 flex justify-center bg-black/5 border border-border-subtle/50 rounded overflow-hidden p-2 aspect-[3/4] max-h-[60vh]">
                  <img
                    src={selectedPhoto.photoUrl}
                    alt={selectedPhoto.alt || `By ${selectedPhoto.photographerName}`}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>

                {/* Meta details */}
                <div className="md:col-span-5 space-y-6">
                  <div>
                    <span className="editorial-label text-accent font-mono">Contestant</span>
                    <h3 className="font-serif text-3xl font-bold mt-1 text-foreground leading-tight">
                      {selectedPhoto.contestantName}
                    </h3>
                  </div>

                  <div className="space-y-3 font-mono text-sm text-muted-foreground border-y border-border-subtle py-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground/60" />
                      <span>Country: <strong className="text-foreground">{selectedPhoto.countryName}</strong></span>
                    </div>
                    {selectedPhoto.year && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground/60" />
                        <span>Edition / Year: <strong className="text-foreground">{selectedPhoto.year}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground/60" />
                      <span>Position Tag: <strong className="text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-[10px]">BEST PHOTOGRAPHY</strong></span>
                    </div>
                  </div>

                  {/* Highlighted Photographer Section */}
                  <div className="bg-surface/50 border border-border-subtle p-4 rounded flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 border border-accent/20">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="editorial-label text-muted-foreground/60 text-[9px] font-mono uppercase tracking-wider">
                        Master Photographer
                      </div>
                      <div className="font-serif text-lg font-bold text-foreground mt-0.5">
                        {selectedPhoto.photographerName}
                      </div>
                    </div>
                  </div>

                  {selectedPhoto.caption && (
                    <div className="pt-2">
                      <h5 className="editorial-label text-muted-foreground/60 text-[9px] font-mono uppercase tracking-wider mb-1">
                        Caption / Description
                      </h5>
                      <p className="text-sm text-muted-foreground leading-relaxed italic font-serif">
                        {selectedPhoto.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-surface/50 border-t border-border-subtle flex justify-end">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="bg-foreground text-background font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded transition-colors hover:bg-foreground/90 shadow-md"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
