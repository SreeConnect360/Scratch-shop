// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
import fs from "fs";
import path from "path";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: process.env.NITRO_PRESET || "netlify",
    // We add hooks to copy the missing ES6 module files of tslib because Nitro's builder
    // omits them when compiling the function node_modules, triggering ERR_MODULE_NOT_FOUND.
    hooks: {
      compiled(nitro) {
        const destDir = path.join(
          nitro.options.output.serverDir,
          "node_modules",
          "tslib"
        );
        if (fs.existsSync(destDir)) {
          const srcDir = path.dirname(require.resolve("tslib/package.json"));
          const filesToCopy = ["tslib.es6.js", "tslib.es6.mjs"];
          for (const file of filesToCopy) {
            const srcPath = path.join(srcDir, file);
            const destPath = path.join(destDir, file);
            if (fs.existsSync(srcPath)) {
              fs.copyFileSync(srcPath, destPath);
            }
          }
        }
      }
    }
  },
});
