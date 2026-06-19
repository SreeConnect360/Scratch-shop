import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";

const sponsorsDbPath = path.join(process.cwd(), "src", "lib", "sponsors-db.json");
const publishedDbPath = path.join(process.cwd(), "src", "lib", "published-sponsors-db.json");
const contestsDbPath = path.join(process.cwd(), "src", "lib", "contests-db.json");

function readJsonFile(filePath: string, fallback: any = []) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || JSON.stringify(fallback));
  } catch (error) {
    console.error(`Error reading ${path.basename(filePath)}:`, error);
    return fallback;
  }
}

function writeJsonFile(filePath: string, data: any) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing to ${path.basename(filePath)}:`, error);
  }
}

export const Route = createFileRoute("/api/sponsors")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const action = url.searchParams.get("action");

          if (action === "get-open-countries") {
            const contests = readJsonFile(contestsDbPath);
            const activeContests = contests.filter((c: any) => !c.deleted && c.status !== "Deleted");
            const countries = Array.from(new Set(activeContests.map((c: any) => c.country)));
            // Ensure Global is included if we want it, or just return existing active contest countries
            return new Response(JSON.stringify({ countries }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "get-sponsors") {
            const sponsors = readJsonFile(sponsorsDbPath);
            return new Response(JSON.stringify(sponsors), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "get-sponsors-by-country") {
            const country = url.searchParams.get("country");
            const sponsors = readJsonFile(sponsorsDbPath);
            if (!country) {
              return new Response(JSON.stringify(sponsors), {
                headers: { "Content-Type": "application/json" },
              });
            }
            const filtered = sponsors.filter((s: any) => {
              const active = s.status !== "Inactive";
              const matchesCountry = (s.countries || []).some(
                (c: string) => c.toLowerCase() === country.toLowerCase() || c.toLowerCase() === "global"
              );
              return active && matchesCountry;
            });
            return new Response(JSON.stringify(filtered), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "get-published-sponsors") {
            const published = readJsonFile(publishedDbPath);
            return new Response(JSON.stringify(published), {
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Invalid action" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error?.message || "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      POST: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const action = url.searchParams.get("action");
          const body = await request.json();

          const now = new Date().toISOString();

          if (action === "save-sponsor") {
            const sponsors = readJsonFile(sponsorsDbPath);
            const sponsor = body;

            if (!sponsor.id || !sponsor.name) {
              return new Response(JSON.stringify({ error: "Sponsor ID and Name are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            const existingIdx = sponsors.findIndex((s: any) => s.id === sponsor.id);
            if (existingIdx > -1) {
              sponsors[existingIdx] = {
                ...sponsors[existingIdx],
                ...sponsor,
                updatedDate: now,
              };
            } else {
              sponsors.push({
                ...sponsor,
                status: sponsor.status || "Active",
                createdDate: now,
                updatedDate: now,
              });
            }

            writeJsonFile(sponsorsDbPath, sponsors);
            return new Response(JSON.stringify({ success: true, sponsor }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "delete-sponsor") {
            const { id } = body;
            if (!id) {
              return new Response(JSON.stringify({ error: "Sponsor ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }
            const sponsors = readJsonFile(sponsorsDbPath);
            const filtered = sponsors.filter((s: any) => s.id !== id);
            writeJsonFile(sponsorsDbPath, filtered);
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "save-published-sponsors") {
            const { publishedSectionId, countryId, countryName, stageName, selectedSponsorIds, publishStatus } = body;

            if (!publishedSectionId || !countryId || !countryName) {
              return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            const published = readJsonFile(publishedDbPath);
            const existingIdx = published.findIndex((p: any) => p.publishedSectionId === publishedSectionId);

            const record = {
              publishedSectionId,
              countryId,
              countryName,
              stageName: stageName || "",
              selectedSponsorIds: selectedSponsorIds || [],
              publishStatus: publishStatus || "published",
              createdDate: existingIdx > -1 ? published[existingIdx].createdDate : now,
              updatedDate: now,
            };

            if (existingIdx > -1) {
              published[existingIdx] = record;
            } else {
              published.push(record);
            }

            writeJsonFile(publishedDbPath, published);
            return new Response(JSON.stringify({ success: true, record }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "sync-contests") {
            const contests = body;
            if (!Array.isArray(contests)) {
              return new Response(JSON.stringify({ error: "Body must be a contests array" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }
            writeJsonFile(contestsDbPath, contests);
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Invalid action" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error?.message || "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
