import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PublicLayout } from "./PublicLayout-u1w3O0qP.mjs";
import { F as FadeUp, e as ease } from "./Reveal-DABDixyV.mjs";
import { G as Route$d, u as usePortal, I as SEED_COMMENTS } from "./router-C0nupAs3.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
import { a6 as Heart, ax as MessageCircle, ab as Send } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "node:fs";
import "node:path";
import "../_libs/xlsx.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function BattleView() {
  const {
    battle
  } = Route$d.useLoaderData();
  const {
    state,
    voteFor,
    comment,
    likeComment
  } = usePortal();
  const [text, setText] = reactExports.useState("");
  const [popup, setPopup] = reactExports.useState(null);
  const [confirmVoteFor, setConfirmVoteFor] = reactExports.useState(null);
  const total = battle.votesA + battle.votesB;
  const pctA = battle.votesA / total * 100;
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const commentList = state.comments[battle.id] ?? SEED_COMMENTS;
  const onVote = (id, name) => {
    setConfirmVoteFor({
      contestantId: id,
      contestantName: name,
      onConfirm: () => {
        const r = voteFor(id);
        if (r.ok) {
          setPopup("Vote submitted");
          setTimeout(() => setPopup(null), 2e3);
        } else {
          setPopup(r.reason ?? "Already voted");
          setTimeout(() => setPopup(null), 2e3);
        }
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 lg:px-16 pt-24 pb-8 border-b border-border-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "editorial-eyebrow text-accent flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 bg-accent rounded-full animate-pulse" }),
        " ",
        battle.round
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeUp, { delay: 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-4 font-serif text-5xl lg:text-7xl", children: [
        battle.a.name,
        " vs ",
        battle.b.name
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 lg:px-16 py-12 grid lg:grid-cols-12 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 relative border border-border-subtle", children: [
          [battle.a, battle.b].map((c, i) => {
            const voted = state.votesByDay[c.id] === today;
            const hasVotedForEither = state.votesByDay[battle.a.id] === today || state.votesByDay[battle.b.id] === today;
            const votes = i === 0 ? battle.votesA : battle.votesB;
            const pct = i === 0 ? pctA : 100 - pctA;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative aspect-[3/4] overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/FashionBattle/contestants/$slug", params: {
                slug: c.slug
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.image, alt: c.name, className: "w-full h-full object-cover img-cinematic transition-transform duration-[1500ms] group-hover:scale-105" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute bottom-0 left-0 right-0 p-6 text-white ${i === 1 ? "text-right" : ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-3xl", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-white/70 mt-1", children: c.country }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-3 flex items-center gap-3 ${i === 1 ? "flex-row-reverse" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-2xl", children: votes.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-white/70", children: [
                    pct.toFixed(1),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onVote(c.id, c.name), disabled: hasVotedForEither || !state.voting.open, className: `mt-4 inline-flex items-center gap-2 px-5 py-2.5 editorial-label transition-all ${voted ? "bg-accent text-white" : hasVotedForEither ? "border border-white/20 text-white/40 cursor-not-allowed" : "border border-white/60 text-white hover:bg-white hover:text-black"} disabled:opacity-70`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-3.5 h-3.5 ${voted ? "fill-current" : ""}` }),
                  !state.voting.open ? "Voting closed" : voted ? "Voted today" : "Cast vote"
                ] })
              ] })
            ] }, c.id);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif italic text-6xl lg:text-8xl text-accent", children: "vs" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-surface-3 relative mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          width: 0
        }, whileInView: {
          width: `${pctA}%`
        }, transition: {
          duration: 1.2,
          ease
        }, viewport: {
          once: true
        }, className: "absolute inset-y-0 left-0 bg-accent" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "lg:col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border-subtle flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label", children: "Live comments" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-96 overflow-y-auto divide-y divide-border-subtle", children: commentList.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-5 py-3 flex gap-3 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop", alt: c.user, className: "w-8 h-8 rounded-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: c.user }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                " · ",
                c.time
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm mt-1", children: c.text }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => likeComment(battle.id, c.id), className: "text-xs text-muted-foreground hover:text-accent mt-1 inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3 h-3" }),
              " ",
              c.likes
            ] })
          ] })
        ] }, c.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          if (text.trim()) {
            comment(battle.id, text.trim());
            setText("");
          }
        }, className: "flex items-center gap-2 px-5 py-3 border-t border-border-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: text, onChange: (e) => setText(e.target.value), placeholder: "Add a comment…", className: "flex-1 bg-transparent outline-none text-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-accent", "aria-label": "Send", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" }) })
        ] })
      ] }) })
    ] }),
    confirmVoteFor && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-md rounded shadow-2xl p-6 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5 fill-current" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl font-bold tracking-tight", children: "Confirm Your Vote" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: [
        "Are you sure you want to cast your daily vote for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: confirmVoteFor.contestantName }),
        "? This action cannot be undone."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmVoteFor(null), className: "border border-border-subtle hover:bg-surface text-foreground font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          confirmVoteFor.onConfirm();
          setConfirmVoteFor(null);
        }, className: "bg-accent hover:bg-accent/90 text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors shadow-md", children: "Confirm Vote" })
      ] })
    ] }) }),
    popup && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, exit: {
      opacity: 0,
      y: 20
    }, className: "fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white border border-zinc-800 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl z-50 font-mono text-sm uppercase tracking-wider", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "❤️" }),
      " ",
      popup
    ] })
  ] });
}
export {
  BattleView as component
};
