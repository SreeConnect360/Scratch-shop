import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";

const dbPath = path.join(process.cwd(), "src", "lib", "angels-posts-db.json");

function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading angels db:", error);
    return [];
  }
}

function writeDb(data: any) {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to angels db:", error);
  }
}

export const Route = createFileRoute("/api/angels")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const posts = readDb();
          return new Response(JSON.stringify(posts), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          return new Response(
            JSON.stringify({ error: error?.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const {
            countryId,
            countryName,
            year,
            logoUrl,
            winnerContestantId,
            winnerName,
            winnerPhotoUrl,
          } = body;

          if (!countryId || !countryName || !year || !winnerPhotoUrl) {
            return new Response(
              JSON.stringify({ error: "Missing required fields" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const posts = readDb();
          const existingIndex = posts.findIndex(
            (p: any) =>
              p.countryId?.toLowerCase() === countryId.toLowerCase() &&
              String(p.year) === String(year)
          );

          const now = new Date().toISOString();

          if (existingIndex > -1) {
            // Update existing post
            posts[existingIndex] = {
              ...posts[existingIndex],
              logoUrl: logoUrl || posts[existingIndex].logoUrl,
              winnerContestantId,
              winnerName,
              winnerPhotoUrl,
              updatedDate: now,
            };
          } else {
            // Create new post
            const newPost = {
              angelsPostId: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              countryId,
              countryName,
              year,
              logoUrl: logoUrl || "",
              winnerContestantId: winnerContestantId || "",
              winnerName: winnerName || "",
              winnerPhotoUrl,
              source: "Winner Coronation Selection",
              publishStatus: "published",
              createdDate: now,
              updatedDate: now,
            };
            posts.push(newPost);
          }

          writeDb(posts);

          return new Response(
            JSON.stringify({ success: true, message: "Posted to Angels successfully" }),
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (error: any) {
          return new Response(
            JSON.stringify({ error: error?.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
