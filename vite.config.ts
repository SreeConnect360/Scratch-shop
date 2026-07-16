// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: process.env.NITRO_PRESET || "vercel",
    // Force-inline tslib into the Vercel serverless bundle (Nitro externalises
    // it by default, but Vercel functions don't ship node_modules).
    // The lovable type surface is intentionally narrow; the runtime spreads all
    // options through to Nitro, so this works despite the TS complaint.
    ...({ externals: { inline: ["tslib"] } } as Record<string, unknown>),
  },
});
