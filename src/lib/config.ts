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
      
    if (!isLocal) {
      return "https://scratch-render-sj9n.onrender.com";
    }
    
    // Dynamically construct backend URL using current protocol and hostname on port 8081
    return `${window.location.protocol}//${hostname}:8081`;
  }
  return "http://localhost:8081";
};

const rawUrl = getBackendUrl();
export const BACKEND_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
