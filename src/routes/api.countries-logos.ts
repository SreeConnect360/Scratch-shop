import { createFileRoute } from "@tanstack/react-router";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Puducherry", "Chandigarh"
];

// Simple fallback logo SVG base64 (ReeVibes text logo placeholder)
const FALLBACK_LOGO_WHITE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIyMCI+Ui5WPC90ZXh0Pjwvc3ZnPg==";
const FALLBACK_LOGO_BLACK = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iYmxhY2siIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIyMCI+Ui5WPC90ZXh0Pjwvc3ZnPg==";

export const Route = createFileRoute("/api/countries-logos")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const countryParam = url.searchParams.get("country");

          if (countryParam) {
            return new Response(
              JSON.stringify({
                whiteLogo: FALLBACK_LOGO_WHITE,
                blackLogo: FALLBACK_LOGO_BLACK,
              }),
              { headers: { "Content-Type": "application/json" } }
            );
          }

          return new Response(
            JSON.stringify({ countries: INDIAN_STATES }),
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (error: any) {
          console.error("Error in /api/countries-logos API:", error);
          return new Response(
            JSON.stringify({ error: error?.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
