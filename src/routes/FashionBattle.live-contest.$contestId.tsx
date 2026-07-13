import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Send } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp, ease } from "@/components/motion/Reveal";
import { BATTLES } from "@/lib/data";
import { SEED_COMMENTS } from "@/lib/portal-data";
import { usePortal } from "@/lib/portal-state";

export const Route = createFileRoute("/FashionBattle/live-contest/$contestId")({
  loader: ({ params }) => {
    const battle = BATTLES.find(b => b.id === params.contestId);
    if (!battle) throw notFound();
    return { battle };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.battle.a.name} vs ${loaderData.battle.b.name} — ReeVibes` },
      { name: "description", content: `${loaderData.battle.round} — vote live.` },
      { property: "og:image", content: loaderData.battle.a.image },
    ] : [],
  }),
  notFoundComponent: () => (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div>
          <p className="editorial-label text-accent">404</p>
          <h1 className="mt-3 font-serif text-5xl">Battle not found</h1>
          <Link to="/FashionBattle/live-contest" className="mt-6 inline-block editorial-label hover:text-accent">← All battles</Link>
        </div>
      </div>
    </PublicLayout>
  ),
  component: BattleView,
});

function BattleView() {
  const { battle } = Route.useLoaderData();
  const { state, voteFor, comment, likeComment } = usePortal();
  const [text, setText] = useState("");
  const [popup, setPopup] = useState<string | null>(null);
  const [confirmVoteFor, setConfirmVoteFor] = useState<{ contestantId: string; contestantName: string; onConfirm: () => void } | null>(null);

  const total = battle.votesA + battle.votesB;
  const pctA = (battle.votesA / total) * 100;
  const today = new Date().toISOString().slice(0, 10);
  const commentList = state.comments[battle.id] ?? SEED_COMMENTS;

  const onVote = (id: string, name: string) => {
    setConfirmVoteFor({
      contestantId: id,
      contestantName: name,
      onConfirm: () => {
        const r = voteFor(id);
        if (r.ok) {
          setPopup("Vote submitted");
          setTimeout(() => setPopup(null), 2000);
        } else {
          setPopup(r.reason ?? "Already voted");
          setTimeout(() => setPopup(null), 2000);
        }
      }
    });
  };

  return (
    <PublicLayout>
      <header className="px-6 lg:px-16 pt-24 pb-8 border-b border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> {battle.round}</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-5xl lg:text-7xl">{battle.a.name} vs {battle.b.name}</h1></FadeUp>
      </header>

      <section className="px-6 lg:px-16 py-12 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 relative border border-border-subtle">
            {[battle.a, battle.b].map((c, i) => {
              const voted = state.votesByDay[c.id] === today;
              const hasVotedForEither = (state.votesByDay[battle.a.id] === today) || (state.votesByDay[battle.b.id] === today);
              const votes = i === 0 ? battle.votesA : battle.votesB;
              const pct = i === 0 ? pctA : 100 - pctA;
              return (
                <div key={c.id} className="group relative aspect-[3/4] overflow-hidden">
                  <Link to="/FashionBattle/contestants/$slug" params={{ slug: c.slug }}>
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover img-cinematic transition-transform duration-[1500ms] group-hover:scale-105" />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                  <div className={`absolute bottom-0 left-0 right-0 p-6 text-white ${i === 1 ? "text-right" : ""}`}>
                    <div className="font-serif text-3xl">{c.name}</div>
                    <div className="editorial-label text-white/70 mt-1">{c.country}</div>
                    <div className={`mt-3 flex items-center gap-3 ${i === 1 ? "flex-row-reverse" : ""}`}>
                      <div className="font-serif text-2xl">{votes.toLocaleString()}</div>
                      <div className="editorial-label text-white/70">{pct.toFixed(1)}%</div>
                    </div>
                    <button
                      onClick={() => onVote(c.id, c.name)}
                      disabled={hasVotedForEither || !state.voting.open}
                      className={`mt-4 inline-flex items-center gap-2 px-5 py-2.5 editorial-label transition-all ${
                        voted 
                          ? "bg-accent text-white" 
                          : hasVotedForEither
                          ? "border border-white/20 text-white/40 cursor-not-allowed"
                          : "border border-white/60 text-white hover:bg-white hover:text-black"
                      } disabled:opacity-70`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${voted ? "fill-current" : ""}`} />
                      {!state.voting.open ? "Voting closed" : voted ? "Voted today" : "Cast vote"}
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center pointer-events-none">
              <span className="font-serif italic text-6xl lg:text-8xl text-accent">vs</span>
            </div>
          </div>
          <div className="h-px bg-surface-3 relative mt-1">
            <motion.div initial={{ width: 0 }} whileInView={{ width: `${pctA}%` }} transition={{ duration: 1.2, ease }} viewport={{ once: true }} className="absolute inset-y-0 left-0 bg-accent" />
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="border border-border-subtle">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-accent" />
              <span className="editorial-label">Live comments</span>
            </div>
            <ul className="max-h-96 overflow-y-auto divide-y divide-border-subtle">
              {commentList.map(c => (
                <li key={c.id} className="px-5 py-3 flex gap-3 items-start">
                  <img src={c.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"} alt={c.user} className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs"><span className="font-medium">{c.user}</span><span className="text-muted-foreground"> · {c.time}</span></div>
                    <div className="text-sm mt-1">{c.text}</div>
                    <button onClick={() => likeComment(battle.id, c.id)} className="text-xs text-muted-foreground hover:text-accent mt-1 inline-flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {c.likes}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <form
              onSubmit={(e) => { e.preventDefault(); if (text.trim()) { comment(battle.id, text.trim()); setText(""); } }}
              className="flex items-center gap-2 px-5 py-3 border-t border-border-subtle"
            >
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment…" className="flex-1 bg-transparent outline-none text-sm" />
              <button className="text-accent" aria-label="Send"><Send className="w-4 h-4" /></button>
            </form>
          </div>
        </aside>
      </section>

      {/* Confirm Vote Modal */}
      {confirmVoteFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background border border-border-subtle w-full max-w-md rounded shadow-2xl p-6 text-foreground">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-serif text-xl font-bold tracking-tight">Confirm Your Vote</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Are you sure you want to cast your daily vote for <strong className="text-foreground">{confirmVoteFor.contestantName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmVoteFor(null)}
                className="border border-border-subtle hover:bg-surface text-foreground font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmVoteFor.onConfirm();
                  setConfirmVoteFor(null);
                }}
                className="bg-accent hover:bg-accent/90 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors shadow-md"
              >
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}

      {popup && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 20 }} 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white border border-zinc-800 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl z-50 font-mono text-sm uppercase tracking-wider"
        >
          <span className="text-accent">❤️</span> {popup}
        </motion.div>
      )}
    </PublicLayout>
  );
}
