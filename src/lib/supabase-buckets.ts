import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-catalog";

export type Bucket = {
  id: string;
  name: string;
  productIds: string[];
  starProductId?: string;
  thumbnail?: string;
  displayOrder?: number;
  hidden?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

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
 * Normalizes a raw Supabase `product_buckets` row into a frontend `Bucket`.
 */
export function mapSupabaseRowToBucket(row: any): Bucket {
  let productIds: string[] = [];
  if (row.product_ids) {
    if (typeof row.product_ids === "string") {
      productIds = row.product_ids
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else if (Array.isArray(row.product_ids)) {
      productIds = row.product_ids.map(String);
    }
  }

  return {
    id: String(row.id),
    name: row.name || "Curated Collection",
    productIds,
    starProductId: row.star_product_id || undefined,
    thumbnail: row.thumbnail || undefined,
    displayOrder: row.display_order !== undefined && row.display_order !== null ? Number(row.display_order) : 0,
    hidden: Boolean(row.hidden),
    createdAt: row.created_at || undefined,
    updatedAt: row.updated_at || undefined,
  };
}

/**
 * Converts a frontend `Bucket` into a Supabase database payload.
 */
export function mapBucketToSupabaseRow(b: Bucket): Record<string, any> {
  return {
    id: b.id,
    name: b.name,
    product_ids: Array.isArray(b.productIds) ? b.productIds.join(",") : (b.productIds || ""),
    star_product_id: b.starProductId || null,
    thumbnail: b.thumbnail || "",
    display_order: b.displayOrder !== undefined && b.displayOrder !== null ? Number(b.displayOrder) : 0,
    hidden: Boolean(b.hidden),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetches all buckets from Supabase `product_buckets`, sorted by `display_order` ascending.
 */
export async function fetchBucketsFromSupabase(): Promise<Bucket[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/product_buckets?select=*&order=display_order.asc,created_at.asc`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      console.warn("Failed to fetch product_buckets from Supabase:", res.status, await res.text());
      return [];
    }

    const rows = await res.json();
    if (!Array.isArray(rows)) return [];

    return rows.map(mapSupabaseRowToBucket);
  } catch (err) {
    console.error("Network error fetching product_buckets from Supabase:", err);
    return [];
  }
}

/**
 * Upserts a bucket (insert or update) directly into Supabase `product_buckets`.
 */
export async function upsertBucketToSupabase(b: Bucket): Promise<{ ok: boolean; bucket?: Bucket; error?: string }> {
  try {
    const row = mapBucketToSupabaseRow(b);
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/product_buckets`,
      {
        method: "POST",
        headers: getHeaders("resolution=merge-duplicates,return=representation"),
        body: JSON.stringify(row),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to upsert to Supabase product_buckets:", res.status, errText);
      return { ok: false, error: errText };
    }

    const savedRows = await res.json();
    const savedBucket = savedRows && savedRows[0] ? mapSupabaseRowToBucket(savedRows[0]) : b;
    return { ok: true, bucket: savedBucket };
  } catch (err: any) {
    console.error("Network error upserting to Supabase product_buckets:", err);
    return { ok: false, error: err?.message || String(err) };
  }
}

/**
 * Deletes a bucket by ID from Supabase `product_buckets`.
 */
export async function deleteBucketFromSupabase(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/product_buckets?id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to delete from Supabase product_buckets:", res.status, errText);
      return { ok: false, error: errText };
    }

    return { ok: true };
  } catch (err: any) {
    console.error("Network error deleting from Supabase product_buckets:", err);
    return { ok: false, error: err?.message || String(err) };
  }
}

/**
 * Reorders a list of buckets in Supabase by updating each bucket's `display_order`.
 */
export async function reorderBucketsInSupabase(buckets: Bucket[]): Promise<{ ok: boolean; error?: string }> {
  try {
    const rows = buckets.map((b, idx) => ({
      ...mapBucketToSupabaseRow({ ...b, displayOrder: idx }),
      display_order: idx,
      updated_at: new Date().toISOString(),
    }));

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/product_buckets`,
      {
        method: "POST",
        headers: getHeaders("resolution=merge-duplicates,return=representation"),
        body: JSON.stringify(rows),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to reorder in Supabase product_buckets:", res.status, errText);
      return { ok: false, error: errText };
    }

    return { ok: true };
  } catch (err: any) {
    console.error("Network error reordering in Supabase product_buckets:", err);
    return { ok: false, error: err?.message || String(err) };
  }
}
