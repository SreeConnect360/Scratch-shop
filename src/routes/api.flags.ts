import { createFileRoute } from "@tanstack/react-router";

const INDIAN_FLAG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 150" width="100%" height="100%">
<rect width="225" height="150" fill="#FF9933"/>
<rect y="50" width="225" height="100" fill="#FFFFFF"/>
<rect y="100" width="225" height="50" fill="#128807"/>
<g transform="translate(112.5,75)">
<circle r="20" fill="none" stroke="#000088" stroke-width="2"/>
<circle r="4" fill="#000088"/>
<path d="M0 -20 L0 20 M-20 0 L20 0 M-14.14 -14.14 L14.14 14.14 M-14.14 14.14 L14.14 -14.14 M-7.65 -18.48 L7.65 18.48 M-18.48 -7.65 L18.48 7.65 M-18.48 7.65 L18.48 -7.65 M-7.65 18.48 L7.65 -18.48" stroke="#000088" stroke-width="0.5"/>
</g>
</svg>`;

export const Route = createFileRoute("/api/flags")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return new Response(INDIAN_FLAG_SVG, {
            headers: {
              "Content-Type": "image/svg+xml",
              "Cache-Control": "public, max-age=86400"
            }
          });
        } catch (error: any) {
          console.error("Error serving flag:", error);
          return new Response("Internal Server Error", { status: 500 });
        }
      }
    }
  }
});
