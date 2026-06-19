# MissCurvy: Route Connection & Dynamic Sync

Goal: One shared store powers both Admin and Public. Admin changes appear live on Public, public submissions appear live in Admin. No UI redesign — only state, data flow, and routing.

## 1. Central Store (`src/lib/app-store.tsx`)

A single React context provider + `localStorage` persistence, holding all domain slices:

```
AppStore = {
  contests:      OpenContest[]            // admin Open Contest
  users:         PlatformUser[]           // public registrations + admin-managed
  contestants:   ContestantApplication[]  // apply submissions
  topPositions:  Record<contestantId, "Top16"|"Top8"|"Top4"|"Top2"|"Winner">
  bestPhotos:    string[]                 // tagged photo ids
  livePairs:     BattlePair[]             // admin-arranged VS pairings
  voting:        { open: boolean; rating: boolean }
  sponsors:      Sponsor[]                // with assignment refs
  reports:       AbuseReport[]
  session:       { userId | null }
}
```

Seed from existing `src/lib/data.ts` + `portal-data.ts` so current UI keeps working. Expose actions: `createContest`, `publishContest`, `registerUser`, `submitApplication`, `setPosition`, `tagBestPhoto`, `setLivePair`, `toggleVoting`, `toggleRating`, `assignSponsor`, `setPhotographerRole`, `reportAbuse`, `signIn/Out`, etc.

Replace/merge the existing `portal-state.tsx` so public pages already wired to it keep functioning. Re-export the same hook surface (`usePortal`) plus a new `useAppStore` selector hook. Mount provider in `src/routes/__root.tsx` (already wraps with `PortalProvider`).

## 2. Route Additions (file-based)

New dynamic route files:

- `src/routes/apply.$contestId.tsx` — apply scoped to one published contest
- `src/routes/live-contest.$countryId.$stage.tsx` — VS pairings filtered by country + stage
- `src/routes/contestant.$contestantId.tsx` — canonical contestant profile (existing `contestants.$slug.tsx` keeps working; new route reads by id)
- `src/routes/photography.$photoId.tsx` — single best-photo detail

Already exist (kept): `live-contest.$contestId.tsx`, `angels.$slug.tsx`, `house-of-fashion.$productId.tsx`, all `admin.*`, all `account.*`. Admin paths `/admin/top-10` stays; add alias route file `admin.top16.tsx` re-exporting Top10 component for the spec name.

## 3. Connections (per spec)

| Source (admin) | Store slice | Destination (public) |
|---|---|---|
| Open Contest CRUD + publish | `contests` | Home contests, Apply list, Live Contest country selector |
| Register form | `users` | Admin Users dashboard |
| Apply wizard submit | `contestants` + `users[i].isContestant` | Admin Contestants dashboard (filtered by contest country) |
| Top 16 edits | `contestants[i].media` + `topPositions` | Contestant profile, Angels, Photography, Live Contest |
| Best Photography tag | `bestPhotos` | Public Photography grid |
| Position tag | `topPositions` | Admin + Public Live Contest stage filters |
| Live Contest arrangement | `livePairs` | Public Live Contest renders identical order |
| Vote & Rate Start/Stop | `voting.open/rating` | Public vote/rate buttons enable/disable live |
| Sponsors assignment | `sponsors` + refs on contestant/photo | Live Contest, Contestant pages, Photography (logo → new tab) |
| User role = Photographer | `users[i].roles` | Admin Photographers dashboard auto-populates |
| Public abuse report submit | `reports` | Admin Abuse Reports dashboard |
| Admin profile/status edits | `users`, `contestants` | My Account auto-reflects |

## 4. Implementation Order

1. Build `src/lib/app-store.tsx` (extend `portal-state.tsx`) with all slices, actions, persistence. Seed from existing data.
2. Replace direct imports of `CONTESTANTS`, `PLATFORM_USERS`, `BATTLES`, `SPONSORS`, `PHOTOGRAPHERS`, `ABUSE_REPORTS`, `CONTESTANT_APPLICATIONS` in route files with `useAppStore()` selectors. Keep components/JSX untouched — only swap data source.
3. Wire admin write actions (Open Contest publish toggle, Top 16 position dropdown, Vote/Rate Start-Stop, Best Photo tag, Sponsor assign, Live Contest pair editor, User role/status edits, Photographer derive) to store actions.
4. Wire public write actions (Register → `registerUser`, Apply → `submitApplication`, Live Contest vote → respect `voting.open`, Report buttons → `reportAbuse`).
5. Add new dynamic routes listed in §2. Each is a thin wrapper that reads param + selects from store; reuses existing presentational components.
6. Smoke check: register on public → appears in `/admin/users`; toggle Stop Voting → public vote button disables without refresh; publish a new contest → appears in Apply selector.

## Technical notes

- Persistence: `localStorage` key `misscurvy.store.v2`, debounced write, merge-on-load so seed defaults fill missing keys.
- Reactivity: single context value re-render is fine at this app size; can split later if needed.
- Type-safe TanStack params via `Route.useParams()`.
- No UI files get visual changes — diffs limited to data wiring + new route shells.

## Out of scope

UI, animations, layouts, design tokens, real backend, websockets (cross-tab sync deferred — same-tab live sync only).
