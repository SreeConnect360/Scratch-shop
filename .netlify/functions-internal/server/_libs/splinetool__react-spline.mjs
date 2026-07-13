import { r as reactExports, j as jsxRuntimeExports } from "./react.mjs";
import { s as sU } from "./splinetool__runtime.mjs";
import { b } from "./lodash.debounce.mjs";
import { o } from "./react-merge-refs.mjs";
const I = [], K = { width: "100%", height: "100%" }, M = reactExports.forwardRef(function({
  className: w,
  children: p,
  debounceTime: i = 300,
  ignoreDimensions: s = I,
  parentSizeStyles: z,
  enableDebounceLeadingCall: u = true,
  resizeObserverPolyfill: f,
  ...R
}, S) {
  const o$1 = reactExports.useRef(null), d = reactExports.useRef(0), [v, y] = reactExports.useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), n = reactExports.useMemo(() => {
    const a = Array.isArray(s) ? s : [s];
    return b(
      (e) => {
        y((r) => Object.keys(r).filter(
          (t) => r[t] !== e[t]
        ).every(
          (t) => a.includes(t)
        ) ? r : e);
      },
      i,
      { leading: u }
    );
  }, [i, u, s]);
  return reactExports.useEffect(() => {
    const a = f || window.ResizeObserver, e = new a((r) => {
      r.forEach((c) => {
        const { left: h, top: l, width: t, height: A } = (c == null ? void 0 : c.contentRect) ?? {};
        d.current = window.requestAnimationFrame(() => {
          n({ width: t, height: A, top: l, left: h });
        });
      });
    });
    return o$1.current && e.observe(o$1.current), () => {
      window.cancelAnimationFrame(d.current), e.disconnect(), n.cancel();
    };
  }, [n, f]), /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: { ...K, ...z },
      ref: o([S, o$1]),
      className: w,
      ...R,
      children: p({
        ...v,
        ref: o$1.current,
        resize: n
      })
    }
  );
});
const G = reactExports.forwardRef(
  ({
    scene: s,
    style: u,
    onSplineMouseDown: p,
    onSplineMouseUp: b2,
    onSplineMouseHover: d,
    onSplineKeyDown: v,
    onSplineKeyUp: w,
    onSplineStart: y,
    onSplineLookAt: h,
    onSplineFollow: S,
    onSplineScroll: k,
    onLoad: r,
    renderOnDemand: E = true,
    wasmPath: g,
    children: x,
    ...A
  }, R) => {
    const o2 = reactExports.useRef(null), [c, a] = reactExports.useState(true), [i, j] = reactExports.useState();
    if (i)
      throw i;
    return reactExports.useEffect(() => {
      a(true);
      let e;
      const m = [
        {
          name: "mouseDown",
          cb: p
        },
        {
          name: "mouseUp",
          cb: b2
        },
        {
          name: "mouseHover",
          cb: d
        },
        {
          name: "keyDown",
          cb: v
        },
        {
          name: "keyUp",
          cb: w
        },
        {
          name: "start",
          cb: y
        },
        {
          name: "lookAt",
          cb: h
        },
        {
          name: "follow",
          cb: S
        },
        {
          name: "scroll",
          cb: k
        }
      ];
      if (o2.current) {
        e = new sU(o2.current, {
          renderOnDemand: E,
          wasmPath: g
        });
        async function t() {
          await e.load(s);
          for (let n of m)
            n.cb && e.addEventListener(n.name, n.cb);
          a(false), r == null || r(e);
        }
        t().catch((n) => {
          j(n);
        });
      }
      return () => {
        for (let t of m)
          t.cb && e.removeEventListener(t.name, t.cb);
        e.dispose();
      };
    }, [s]), /* @__PURE__ */ jsxRuntimeExports.jsx(
      M,
      {
        ref: R,
        parentSizeStyles: { overflow: "hidden", ...u },
        debounceTime: 50,
        ...A,
        children: () => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          c && x,
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: o2,
              style: {
                display: c ? "none" : "block"
              }
            }
          )
        ] })
      }
    );
  }
);
export {
  G as default
};
