import { BACKEND_URL } from "./config";

/**
 * Render Backend 24/7 Keep-Alive Service
 *
 * Render's free tier spins down web instances after 15 minutes of inactivity,
 * which causes 50+ second cold-start delays.
 *
 * This client-side keep-alive loop sends a lightweight dummy request to
 * `${BACKEND_URL}/health` every 9 minutes (540,000ms) to ensure the instance
 * remains active and awake.
 */

let keepAliveRunning = false;
let pingIntervalTimer: any = null;

export function startRenderKeepAlive() {
  if (typeof window === "undefined" || keepAliveRunning) return;
  keepAliveRunning = true;

  const PING_INTERVAL_MS = 9 * 60 * 1000; // 9 minutes (well below Render's 15m idle timeout)

  const sendKeepAlivePing = async () => {
    try {
      const url = `${BACKEND_URL}/health?_t=${Date.now()}`;
      await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-store",
        mode: "cors"
      });
    } catch {
      // Backend spin-up in progress or network transition; next interval will retry
    }
  };

  // 1. Send immediate ping on app launch
  sendKeepAlivePing();

  // 2. Schedule recurring ping every 9 minutes
  pingIntervalTimer = setInterval(sendKeepAlivePing, PING_INTERVAL_MS);

  // 3. Ping on document regaining focus/visibility if tab was backgrounded
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      sendKeepAlivePing();
    }
  });
}
