import { type Product } from "./data";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://rofhcjedmviwzysipmav.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmhjamVkbXZpd3p5c2lwbWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNDIxODYsImV4cCI6MjA5ODgxODE4Nn0.t-qUdbcR7y_M_2FzTuyN2fZyZswKuyvD4p931he3WyA";

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
 * Normalizes a raw Supabase `admin_product_catalog` row into a frontend `Product`.
 */
export function mapSupabaseRowToProduct(row: any): Product {
  let images: string[] = [];
  try {
    if (row.images_json) {
      images = typeof row.images_json === "string" ? JSON.parse(row.images_json) : row.images_json;
    }
  } catch {
    images = [];
  }
  if (!images || !Array.isArray(images) || images.length === 0) {
    if (row.image) images = [row.image];
  }

  let videos: string[] = [];
  try {
    if (row.videos_json) {
      videos = typeof row.videos_json === "string" ? JSON.parse(row.videos_json) : row.videos_json;
    }
  } catch {
    videos = [];
  }

  let sizes: string[] = ["S", "M", "L"];
  try {
    if (row.sizes_json) {
      sizes = typeof row.sizes_json === "string" ? JSON.parse(row.sizes_json) : row.sizes_json;
    }
  } catch {
    sizes = ["S", "M", "L"];
  }

  let stockPerSize: Record<string, number> = { S: 10, M: 10, L: 10 };
  try {
    if (row.stock_per_size_json) {
      stockPerSize = typeof row.stock_per_size_json === "string" ? JSON.parse(row.stock_per_size_json) : row.stock_per_size_json;
    }
  } catch {
    stockPerSize = { S: 10, M: 10, L: 10 };
  }

  let tags: string[] = [];
  try {
    if (row.tags_json) {
      tags = typeof row.tags_json === "string" ? JSON.parse(row.tags_json) : row.tags_json;
    }
  } catch {
    tags = [];
  }
  if ((!tags || tags.length === 0) && row.tag) {
    tags = row.tag.split(",").map((t: string) => t.trim()).filter(Boolean);
  }

  let categoriesList: string[] = [];
  try {
    if (row.categories_list) {
      categoriesList = typeof row.categories_list === "string" ? JSON.parse(row.categories_list) : row.categories_list;
    }
  } catch {
    categoriesList = [];
  }
  if ((!categoriesList || categoriesList.length === 0) && row.category) {
    categoriesList = [row.category];
  }

  const primaryImg = (images && images[0]) || row.image || "";

  const rawPrice = row.price !== undefined && row.price !== null ? String(row.price).replace(/[^0-9.]/g, "") : "0";
  const formattedPrice = `₹${parseFloat(rawPrice || "0").toLocaleString("en-IN")}`;

  const rawOrigPrice = row.original_price ? String(row.original_price).replace(/[^0-9.]/g, "") : rawPrice;
  const formattedOrigPrice = `₹${parseFloat(rawOrigPrice || rawPrice || "0").toLocaleString("en-IN")}`;

  return {
    id: String(row.id),
    name: row.name || "Untitled Creation",
    house: row.house || row.brand || "Atelier ReeVibes",
    price: formattedPrice,
    originalPrice: formattedOrigPrice,
    discount: typeof row.discount === "number" ? row.discount : parseInt(String(row.discount || 0), 10) || 0,
    image: primaryImg,
    images: images && images.length > 0 ? images : [primaryImg],
    videos: videos || [],
    category: row.category || "Tops",
    categoriesList: categoriesList && categoriesList.length > 0 ? categoriesList : [row.category || "Tops"],
    gender: (row.gender as any) || "Women",
    tag: row.tag || (tags && tags[0]) || "New",
    tags: tags || [],
    sku: row.sku || `SKU-${row.id}`,
    description: row.description || "",
    overviewTitle: row.overview_title || "ATELIER OVERVIEW",
    details: row.details || "",
    material: row.material || "",
    fabric: row.fabric || "",
    color: row.color || "",
    collections: row.collections || "",
    type: row.type || row.category || "",
    productInfo: row.product_info || "",
    sizes: sizes && sizes.length > 0 ? sizes : ["S", "M", "L"],
    stockPerSize: stockPerSize || { S: 10, M: 10, L: 10 },
    stockQuantity: typeof row.stock_quantity === "number" ? row.stock_quantity : 100,
    inStock: row.in_stock !== false,
    status: (row.status?.toUpperCase() as any) || "PUBLISHED",
    visibility: (row.visibility?.toUpperCase() as any) || "VISIBLE",
    isFeatured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    isNewArrival: Boolean(row.is_new_arrival),
    isTrending: Boolean(row.is_trending),
    isBestSeller: Boolean(row.is_best_seller),
    isRecommended: Boolean(row.is_recommended),
    customRating: row.custom_rating !== undefined ? Number(row.custom_rating) : 4.8,
    customReviewCount: row.custom_review_count !== undefined ? Number(row.custom_review_count) : 14,
    rating: row.rating !== undefined ? Number(row.rating) : 5.0,
    reviewCount: row.review_count !== undefined ? Number(row.review_count) : 0,
    seoTitle: row.seo_title || "",
    seoDescription: row.seo_description || "",
    seoKeywords: row.seo_keywords || "",
    discountLimitBuyers: row.discount_limit_buyers || undefined,
    discountExpiryDate: row.discount_expiry_date || undefined,
    discountBuyersCount: row.discount_buyers_count || 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  } as Product;
}

/**
 * Fetches all products stored in the `admin_product_catalog` table on Supabase.
 */
export async function fetchAdminCatalogFromSupabase(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_product_catalog?select=*&order=created_at.desc`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      console.warn("Failed to fetch admin_product_catalog from Supabase:", res.status, await res.text());
      return [];
    }

    const rows = await res.json();
    if (!Array.isArray(rows)) return [];

    return rows.map(mapSupabaseRowToProduct);
  } catch (err) {
    console.error("Network error fetching admin_product_catalog from Supabase:", err);
    return [];
  }
}

/**
 * Directly fetches a single product from Supabase `admin_product_catalog` by id or sku.
 */
export async function fetchSingleProductFromSupabase(productId: string): Promise<Product | null> {
  if (!productId) return null;
  const cleanId = String(productId).trim();
  try {
    // Try exact id match first
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_product_catalog?id=eq.${encodeURIComponent(cleanId)}&select=*`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        return mapSupabaseRowToProduct(rows[0]);
      }
    }

    // Fallback: try match by id without "-catalog", or sku
    const altRes = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_product_catalog?or=(id.eq.${encodeURIComponent(cleanId + "-catalog")},sku.eq.${encodeURIComponent(cleanId)})&select=*`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
    if (altRes.ok) {
      const rows = await altRes.json();
      if (Array.isArray(rows) && rows.length > 0) {
        return mapSupabaseRowToProduct(rows[0]);
      }
    }
    return null;
  } catch (err) {
    console.warn(`Error fetching single product ${productId} from Supabase:`, err);
    return null;
  }
}

/**
 * Upserts (inserts or updates) a complete product record in Supabase `admin_product_catalog`.
 */
export async function upsertCatalogProductToSupabase(p: any): Promise<{ ok: boolean; product?: Product; error?: string }> {
  try {
    const id = String(p.id || `pr-${Date.now()}`);
    const actual = parseFloat(String(p.originalPrice || p.price || "").replace(/[^0-9.]/g, "")) || 0;
    const disc = parseFloat(String(p.price || "").replace(/[^0-9.]/g, "")) || 0;
    const discountPct =
      p.discount !== undefined
        ? Number(p.discount)
        : actual && disc && actual > disc
        ? Math.round(((actual - disc) / actual) * 100)
        : 0;

    const images = Array.isArray(p.images) ? p.images : p.image ? [p.image] : [];
    const primaryImg = images[0] || p.image || "";

    const cleanStock = { ...(p.stockPerSize || {}) };
    Object.keys(cleanStock).forEach((k) => {
      if (cleanStock[k] === "" || cleanStock[k] === undefined || cleanStock[k] === null) {
        cleanStock[k] = 0;
      } else {
        cleanStock[k] = Number(cleanStock[k]);
      }
    });

    const totalStock = Object.values(cleanStock).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0) || Number(p.stockQuantity) || 100;

    const row = {
      id,
      name: p.name || "Untitled Creation",
      house: p.house || p.brand || "Atelier ReeVibes",
      brand: p.house || p.brand || "Atelier ReeVibes",
      price: String(disc || "0"),
      original_price: String(actual || disc || "0"),
      discount: discountPct,
      image: primaryImg,
      images_json: JSON.stringify(images),
      videos_json: JSON.stringify(Array.isArray(p.videos) ? p.videos : []),
      category: p.category || "Tops",
      categories_list: JSON.stringify(Array.isArray(p.categoriesList) ? p.categoriesList : [p.category || "Tops"]),
      gender: p.gender || "Women",
      tag: p.tag || (Array.isArray(p.tags) && p.tags[0]) || "New",
      tags_json: JSON.stringify(Array.isArray(p.tags) ? p.tags : []),
      sku: p.sku || `SKU-${id}`,
      description: p.description || "",
      overview_title: p.overviewTitle || "ATELIER OVERVIEW",
      details: p.details || "",
      material: p.material || "",
      fabric: p.fabric || "",
      color: p.color || "",
      collections: p.collections || "",
      type: p.type || p.category || "",
      product_info: p.productInfo || "",
      product_sections_json: JSON.stringify(p.productSections || []),
      sizes_json: JSON.stringify(Array.isArray(p.sizes) ? p.sizes : Object.keys(cleanStock)),
      stock_per_size_json: JSON.stringify(cleanStock),
      stock_quantity: totalStock,
      in_stock: totalStock > 0 && p.inStock !== false,
      status: (p.status?.toUpperCase() as string) || "PUBLISHED",
      visibility: (p.visibility?.toUpperCase() as string) || "VISIBLE",
      is_featured: Boolean(p.isFeatured),
      is_new: Boolean(p.isNew),
      is_new_arrival: Boolean(p.isNewArrival),
      is_trending: Boolean(p.isTrending),
      is_best_seller: Boolean(p.isBestSeller),
      is_recommended: Boolean(p.isRecommended),
      custom_rating: p.customRating !== undefined ? Number(p.customRating) : 4.8,
      custom_review_count: p.customReviewCount !== undefined ? Number(p.customReviewCount) : 14,
      rating: p.rating !== undefined ? Number(p.rating) : 5.0,
      review_count: p.reviewCount !== undefined ? Number(p.reviewCount) : 0,
      discount_limit_buyers: p.discountLimitBuyers || null,
      discount_expiry_date: p.discountExpiryDate || null,
      discount_buyers_count: p.discountBuyersCount || 0,
      seo_title: p.seoTitle || "",
      seo_description: p.seoDescription || "",
      seo_keywords: p.seoKeywords || "",
      raw_json: JSON.stringify({ ...p, id }),
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_product_catalog`,
      {
        method: "POST",
        headers: getHeaders("resolution=merge-duplicates,return=representation"),
        body: JSON.stringify(row),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to upsert to Supabase admin_product_catalog:", res.status, errText);
      return { ok: false, error: errText };
    }

    const savedRows = await res.json();
    const savedProduct = savedRows && savedRows[0] ? mapSupabaseRowToProduct(savedRows[0]) : mapSupabaseRowToProduct(row);
    return { ok: true, product: savedProduct };
  } catch (err: any) {
    console.error("Network error upserting to Supabase admin_product_catalog:", err);
    return { ok: false, error: err?.message || String(err) };
  }
}

/**
 * Deletes a product from the Supabase `admin_product_catalog` table.
 */
export async function deleteCatalogProductFromSupabase(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_product_catalog?id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to delete from Supabase admin_product_catalog:", res.status, errText);
      return { ok: false, error: errText };
    }

    return { ok: true };
  } catch (err: any) {
    console.error("Network error deleting from Supabase admin_product_catalog:", err);
    return { ok: false, error: err?.message || String(err) };
  }
}
