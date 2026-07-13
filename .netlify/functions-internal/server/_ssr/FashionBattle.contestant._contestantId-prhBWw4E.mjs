import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useParams, N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { C as CONTESTANTS } from "./router-C_drxgJo.mjs";
import { P as PublicLayout } from "./PublicLayout-DIee0132.mjs";
import "../_libs/react-oauth__google.mjs";
import "../_libs/sonner.mjs";
import "../_libs/maplibre-gl.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
function ContestantById() {
  const {
    contestantId
  } = useParams({
    from: "/contestant/$contestantId"
  });
  const c = CONTESTANTS.find((x) => x.id === contestantId);
  if (!c) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[60vh] flex items-center justify-center text-muted-foreground", children: "Contestant not found." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/FashionBattle/contestants/$slug", params: {
    slug: c.slug
  }, replace: true });
}
export {
  ContestantById as component
};
