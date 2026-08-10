export const PRODUCTION_BACKEND_URL = "https://scratch-render-sj9n.onrender.com";

const getBackendUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof process !== "undefined" && process.env.VITE_API_URL) return process.env.VITE_API_URL;
  
  if (import.meta.env.VITE_USE_LOCAL_BACKEND === "true") {
    if (typeof window !== "undefined" && window.location) {
      return `${window.location.protocol}//${window.location.hostname}:8081`;
    }
    return "http://localhost:8081";
  }

  return PRODUCTION_BACKEND_URL;
};

const rawUrl = getBackendUrl();
export const BACKEND_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
