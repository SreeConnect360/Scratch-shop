export const PRODUCTION_BACKEND_URL = "https://scratch-render-sj9n.onrender.com";

const getBackendUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof process !== "undefined" && process.env.VITE_API_URL) return process.env.VITE_API_URL;
  
  if (typeof window !== "undefined" && window.location) {
    const hostname = window.location.hostname;
    
    // Detect local environment hostnames and private IP subnets
    const isLocal = 
      hostname === "localhost" || 
      hostname === "127.0.0.1" || 
      hostname.startsWith("192.168.") || 
      hostname.startsWith("10.") || 
      hostname.startsWith("172.") || 
      hostname.endsWith(".local");
      
    if (isLocal) {
      // Use local Spring Boot backend running on port 8081
      return `${window.location.protocol}//${hostname}:8081`;
    }
    
    return PRODUCTION_BACKEND_URL;
  }
  return PRODUCTION_BACKEND_URL;
};

const rawUrl = getBackendUrl();
export const BACKEND_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
