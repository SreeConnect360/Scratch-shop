# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

ReeVibes is a monorepo with two independently-deployed halves:

- **Frontend** (repo root): a TanStack Start (React 19 + Vite 7 + TailwindCSS 4) SSR app, originally scaffolded by lovable.dev. It serves three distinct sections under one router: a public "FashionBattle" contest platform, a `_shop` e-commerce storefront, and an `admin` back-office.
- **Backend**: a Spring Boot 3.2 (Java 17) REST API, duplicated in two folders — `backend-spring-boot/` (source of truth) and `reevibes-backend-render/` (a byte-for-byte copy with a `Dockerfile` + Render-specific `README.md`, kept in sync manually for standalone deployment to Render). When editing backend logic, changes generally need to be applied to both folders.

## Commands

### Frontend (root)
- `npm run dev` — start the Vite dev server
- `npm run build` — production build (raises Node heap to 4GB; large SSR bundle)
- `npm run build:dev` — development-mode build
- `npm run preview` — preview a production build locally
- `npm run lint` — ESLint over the whole repo
- `npm run format` — Prettier write
- No test runner is configured (no `test` script, no test files present).

### Backend (`backend-spring-boot/` or `reevibes-backend-render/`)
- `./mvnw.cmd spring-boot:run` — run the API locally (Windows; listens on port 8081)
- `./mvnw.cmd clean package` — build the jar
- `./mvnw.cmd test` — run tests (no test sources currently exist in `src/main`, so this is effectively a no-op)

## Architecture

### Frontend routing
Routes live in `src/routes/` using TanStack Router's flat file-based convention — dots in filenames (`FashionBattle.account.profile.tsx`) encode nested paths, `$param` encodes dynamic segments, `_prefix` (e.g. `_shop.tsx`) denotes a pathless layout route. `src/routeTree.gen.ts` is generated from this directory by the TanStack router Vite plugin — do not hand-edit it. `src/routes/__root.tsx` wraps every route in `ThemeProvider` and `PortalProvider` and defines the shared HTML shell (fonts, Razorpay checkout script, theme-flash prevention inline script).

Three sibling sections share the router but are otherwise independent UIs:
- `FashionBattle.*` — the public contest platform (applications, live voting, contestant profiles).
- `_shop.*` — the e-commerce storefront (product/category/brand pages, cart, checkout, orders).
- `admin.*` — the back-office (contestants, sponsors, vote control, users, reports).

A few routes (`api.angels.ts`, `api.sponsors.ts`, `api.flags.ts`, `api.countries-logos.ts`, `sitemap[.]xml.ts`) are server-only API/data endpoints handled inside the TanStack Start server, not the Spring Boot backend.

### Client-side state
`src/lib/portal-state.tsx` is a single React context (`PortalProvider`) that is the shared source of truth for **both** the public portal and the admin portal — an admin write (e.g. publishing a contest) is immediately visible to public reads because both read from the same context, persisted to `localStorage` under key `reevibes:portal:v3`. When adding a feature that touches both admin and public views, this is the file to extend rather than introducing a parallel store.

`src/lib/vendor-api.ts` and `src/lib/config.ts` (`BACKEND_URL`, from `VITE_API_URL`, default `http://localhost:8081`) are the boundary to the Spring Boot backend; `src/lib/data.ts` / `src/lib/portal-data.ts` / the `*-db.json` files under `src/lib/` hold seed/mock data used before or alongside real API calls.

### SSR / server entry
`src/server.ts` is the actual server entry (wired via `vite.config.ts`'s `tanstackStart.server.entry`, not the default TanStack Start entry) — it wraps the real handler to catch h3's swallowed-500 case (a JSON body shaped like `{"unhandled":true,"message":"HTTPError"}`) and re-render it as a branded error page (`src/lib/error-page.ts`), using the last error captured by `src/lib/error-capture.ts`. Deployment targets are Netlify (`netlify.toml`, `NITRO_PRESET=netlify`), Vercel (`.vercel/`), and Cloudflare Workers (`wrangler.jsonc`, `@cloudflare/vite-plugin`) — all built from the same Vite config via different Nitro presets.

`vite.config.ts` wraps `@lovable.dev/vite-tanstack-config`, which already bundles TanStack Start, React, Tailwind, tsconfig-paths, the Cloudflare plugin, and sandbox detection — do not re-add these plugins manually or the build breaks with duplicate plugins.

### Backend structure (`com.reevibes.ai`)
- `controller/` — `AIController`, `AuthController`, `ShopPortalController`, `VendorController` (the shop/admin REST surface; `ShopPortalController` and `VendorController` are the largest, ~650–760 lines each).
- `service/` — includes `GeminiService` + `AIQueryProcessingService` + `AIFunctionRegistry` + `CommandNormalizationService` (a Gemini-LLM-driven natural-language command layer), `EmailService` (Gmail API/OAuth for OTP + transactional email), `ShiprocketService` (shipping integration), `VendorSyncService`/`SyncService` (vendor data sync), `DatabaseSeeder`, `OtpCleanupScheduler`.
- Config is entirely environment-variable driven through `application.properties` (`${VAR:default}` syntax) — Supabase Postgres, Gemini, Gmail OAuth, Razorpay, Shiprocket credentials.

## Conventions
- Path alias `@/*` maps to `src/*` (frontend only).
- `shadcn/ui` components (`components.json`): style `new-york`, base color `slate`, icons from `lucide-react`, installed under `src/components/ui`.
- ESLint disables `@typescript-eslint/no-unused-vars`; Prettier is run as an ESLint rule (`eslint-plugin-prettier/recommended`), so `npm run lint` and `npm run format` should both pass before committing.
- Do not import the `server-only` npm package — it's a Next.js convention that doesn't apply here; use a `*.server.ts` filename or `@tanstack/react-start/server-only` instead (enforced by an ESLint `no-restricted-imports` rule).
