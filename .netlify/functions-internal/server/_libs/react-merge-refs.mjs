function o(f) {
  return (r) => {
    f.forEach((n) => {
      typeof n == "function" ? n(r) : n != null && (n.current = r);
    });
  };
}
export {
  o
};
