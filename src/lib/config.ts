const rawUrl =
  import.meta.env.VITE_API_URL ||
  (typeof process !== "undefined" ? process.env.VITE_API_URL : undefined) ||
  "http://localhost:8081";
export const BACKEND_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
