import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-catalog";

function getHeaders(prefer?: string) {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (prefer) {
    headers["Prefer"] = prefer;
  }
  return headers;
}

/**
 * Parses raw layout JSON safely.
 */
function parseLayoutJson(raw: any): any | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse homepage layout JSON:", err);
    return null;
  }
}

/**
 * Fetches both 'published' and 'draft' homepage layouts from Supabase.
 */
export async function fetchAllHomepageLayoutsFromSupabase(): Promise<{
  published: any | null;
  draft: any | null;
}> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/homepage_layout?select=*`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!res.ok) {
      console.warn("Supabase fetch homepage_layout returned non-200:", res.status);
      return { published: null, draft: null };
    }

    const rows = await res.json();
    if (!Array.isArray(rows)) return { published: null, draft: null };

    const pubRow = rows.find((r) => r.id === "published");
    const draftRow = rows.find((r) => r.id === "draft");

    return {
      published: pubRow ? parseLayoutJson(pubRow.layout_json) : null,
      draft: draftRow ? parseLayoutJson(draftRow.layout_json) : null,
    };
  } catch (err) {
    console.error("Network error fetching all homepage layouts from Supabase:", err);
    return { published: null, draft: null };
  }
}

/**
 * Fetches a single layout ('published' or 'draft') from Supabase.
 */
export async function fetchHomepageLayoutFromSupabase(isDraft: boolean = false): Promise<any | null> {
  const targetId = isDraft ? "draft" : "published";
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/homepage_layout?id=eq.${targetId}&select=*`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!res.ok) {
      console.warn(`Failed to fetch ${targetId} layout from Supabase:`, res.status);
      return null;
    }

    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;

    return parseLayoutJson(rows[0].layout_json);
  } catch (err) {
    console.error(`Network error fetching ${targetId} layout from Supabase:`, err);
    return null;
  }
}

/**
 * Upserts a homepage layout (either draft or published) directly into Supabase.
 */
export async function saveHomepageLayoutToSupabase(
  layout: any,
  isDraft: boolean = true
): Promise<{ ok: boolean; error?: string }> {
  const targetId = isDraft ? "draft" : "published";
  const jsonStr = typeof layout === "string" ? layout : JSON.stringify(layout);
  const now = new Date().toISOString();

  const payload: Record<string, any> = {
    id: targetId,
    layout_json: jsonStr,
    version: Date.now(),
    updated_at: now,
    updated_by: "admin",
  };

  if (!isDraft) {
    payload.published_at = now;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/homepage_layout`, {
      method: "POST",
      headers: getHeaders("resolution=merge-duplicates"),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`Failed to upsert ${targetId} layout to Supabase:`, res.status, errText);
      return { ok: false, error: errText || `Status ${res.status}` };
    }

    return { ok: true };
  } catch (err: any) {
    console.error(`Network error saving ${targetId} layout to Supabase:`, err);
    return { ok: false, error: err?.message || String(err) };
  }
}

/**
 * Publishes the layout live by saving it to BOTH 'published' and 'draft' rows in Supabase.
 */
export async function publishHomepageLayoutToSupabase(
  layout: any
): Promise<{ ok: boolean; error?: string }> {
  const jsonStr = typeof layout === "string" ? layout : JSON.stringify(layout);
  const now = new Date().toISOString();
  const version = Date.now();

  const batch = [
    {
      id: "published",
      layout_json: jsonStr,
      version,
      updated_at: now,
      published_at: now,
      updated_by: "admin",
    },
    {
      id: "draft",
      layout_json: jsonStr,
      version,
      updated_at: now,
      published_at: now,
      updated_by: "admin",
    },
  ];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/homepage_layout`, {
      method: "POST",
      headers: getHeaders("resolution=merge-duplicates"),
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Failed to publish layout batch to Supabase:", res.status, errText);
      return { ok: false, error: errText || `Status ${res.status}` };
    }

    return { ok: true };
  } catch (err: any) {
    console.error("Network error publishing layout batch to Supabase:", err);
    return { ok: false, error: err?.message || String(err) };
  }
}

/**
 * Reverts the draft layout to match the current published layout directly in Supabase.
 */
export async function revertHomepageLayoutInSupabase(): Promise<{
  ok: boolean;
  layout?: any;
  error?: string;
}> {
  try {
    const published = await fetchHomepageLayoutFromSupabase(false);
    if (!published) {
      return { ok: false, error: "No published layout found in Supabase" };
    }

    const saveRes = await saveHomepageLayoutToSupabase(published, true);
    if (!saveRes.ok) {
      return { ok: false, error: saveRes.error };
    }

    return { ok: true, layout: published };
  } catch (err: any) {
    console.error("Network error reverting layout in Supabase:", err);
    return { ok: false, error: err?.message || String(err) };
  }
}
