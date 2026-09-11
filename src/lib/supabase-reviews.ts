import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-catalog";
import type { ProductReview } from "./portal-state";

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

export interface SupabaseReviewRow {
  id: string;
  product_id: string;
  user_id?: string | null;
  user_name: string;
  user_email?: string | null;
  order_id?: string | null;
  product_name?: string | null;
  product_image?: string | null;
  rating: number;
  comment: string;
  images?: string | null;
  videos?: string | null;
  review_date?: string | null;
  status?: string | null;
  created_at?: string | null;
}

export function mapSupabaseRowToReview(row: SupabaseReviewRow): ProductReview {
  let images: string[] = [];
  if (row.images) {
    try {
      images = typeof row.images === "string" ? row.images.split(",").map(s => s.trim()).filter(Boolean) : (row.images as any);
    } catch {
      images = [];
    }
  }

  let videos: string[] = [];
  if (row.videos) {
    try {
      videos = typeof row.videos === "string" ? row.videos.split(",").map(s => s.trim()).filter(Boolean) : (row.videos as any);
    } catch {
      videos = [];
    }
  }

  const reviewDate = row.review_date || (row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10));

  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id || undefined,
    userName: row.user_name || "Verified Customer",
    userEmail: row.user_email || undefined,
    orderId: row.order_id || undefined,
    productName: row.product_name || undefined,
    productImage: row.product_image || undefined,
    rating: Number(row.rating) || 5,
    comment: row.comment || "",
    images,
    videos,
    date: reviewDate,
    status: row.status === "Hidden" ? "Hidden" : "Approved",
    createdAt: row.created_at || undefined,
  };
}

/**
 * Fetches all product reviews directly from Supabase `product_reviews` table.
 */
export async function fetchReviewsFromSupabase(): Promise<ProductReview[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/product_reviews?select=*&order=created_at.desc`;
    const res = await fetch(url, {
      headers: getHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("Failed to fetch product_reviews from Supabase:", res.status, res.statusText);
      return [];
    }

    const rows: SupabaseReviewRow[] = await res.json();
    return rows.map(mapSupabaseRowToReview);
  } catch (err) {
    console.error("Error fetching reviews from Supabase:", err);
    return [];
  }
}

/**
 * Inserts a new review into Supabase `product_reviews` table.
 */
export async function insertReviewToSupabase(review: ProductReview): Promise<boolean> {
  try {
    const row = {
      id: review.id,
      product_id: review.productId || "",
      user_id: review.userId || null,
      user_name: review.userName,
      user_email: review.userEmail || null,
      order_id: review.orderId || null,
      product_name: review.productName || null,
      product_image: review.productImage || null,
      rating: review.rating,
      comment: review.comment,
      images: review.images && review.images.length > 0 ? review.images.join(",") : null,
      videos: review.videos && review.videos.length > 0 ? review.videos.join(",") : null,
      review_date: review.date || new Date().toISOString().slice(0, 10),
      status: review.status || "Approved",
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/product_reviews`, {
      method: "POST",
      headers: getHeaders("return=representation"),
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to insert review into Supabase:", res.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error inserting review into Supabase:", err);
    return false;
  }
}

/**
 * Updates moderation status of a review in Supabase `product_reviews` table.
 */
export async function updateReviewStatusInSupabase(reviewId: string, status: "Approved" | "Hidden"): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/product_reviews?id=eq.${encodeURIComponent(reviewId)}`, {
      method: "PATCH",
      headers: getHeaders("return=minimal"),
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to update review status in Supabase:", res.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error updating review status in Supabase:", err);
    return false;
  }
}

/**
 * Deletes a review permanently from Supabase `product_reviews` table.
 */
export async function deleteReviewFromSupabase(reviewId: string): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/product_reviews?id=eq.${encodeURIComponent(reviewId)}`, {
      method: "DELETE",
      headers: getHeaders("return=minimal"),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to delete review from Supabase:", res.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error deleting review from Supabase:", err);
    return false;
  }
}
