import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
function Marquee({ children, speed = 40 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "flex gap-16 whitespace-nowrap",
      animate: { x: ["0%", "-50%"] },
      transition: { duration: speed, ease: "linear", repeat: Infinity },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-16", children }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-16", "aria-hidden": true, children })
      ]
    }
  ) });
}
export {
  Marquee as M
};
