import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
const ease = [0.2, 0.7, 0.2, 1];
function FadeUp({
  children,
  delay = 0,
  className,
  as = "div"
}) {
  const Comp = motion[as];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.9, ease, delay },
      className,
      children
    }
  );
}
function CinematicImage({ src, alt, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { scale: 1.08, opacity: 0 },
      whileInView: { scale: 1, opacity: 1 },
      viewport: { once: true, margin: "-60px" },
      transition: { duration: 1.4, ease },
      className: `overflow-hidden ${className ?? ""}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt, loading: "lazy", className: "w-full h-full object-cover img-cinematic" })
    }
  );
}
export {
  CinematicImage as C,
  FadeUp as F,
  ease as e
};
