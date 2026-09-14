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
    customRating: (row.custom_rating !== undefined && row.custom_rating !== null && String(row.custom_rating).trim() !== "" && String(row.custom_rating).toLowerCase() !== "none")
      ? Number(row.custom_rating)
      : undefined,
    customReviewCount: (row.custom_review_count !== undefined && row.custom_review_count !== null && String(row.custom_review_count).trim() !== "" && String(row.custom_review_count).toLowerCase() !== "none")
      ? Number(row.custom_review_count)
      : undefined,
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
 * Selectively patches specific fields of a product in Supabase `admin_product_catalog`
 * without touching or overwriting other columns.
 */
export async function patchCatalogProductInSupabase(
  id: string,
  patch: Record<string, any>
): Promise<{ ok: boolean; product?: Product; error?: string }> {
  if (!id) return { ok: false, error: "Missing product ID" };
  try {
    const fieldsToUpdate: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (patch.status !== undefined) fieldsToUpdate.status = String(patch.status).toUpperCase();
    if (patch.visibility !== undefined) fieldsToUpdate.visibility = String(patch.visibility).toUpperCase();
    if (patch.name !== undefined && String(patch.name).trim()) fieldsToUpdate.name = String(patch.name).trim();
    if (patch.house !== undefined) fieldsToUpdate.house = String(patch.house);
    if (patch.brand !== undefined) fieldsToUpdate.brand = String(patch.brand);
    if (patch.category !== undefined) fieldsToUpdate.category = String(patch.category);
    if (patch.gender !== undefined) fieldsToUpdate.gender = String(patch.gender);
    if (patch.tag !== undefined) fieldsToUpdate.tag = String(patch.tag);
    if (patch.sku !== undefined) fieldsToUpdate.sku = String(patch.sku);
    if (patch.description !== undefined) fieldsToUpdate.description = String(patch.description);
    if (patch.details !== undefined) fieldsToUpdate.details = String(patch.details);
    if (patch.material !== undefined) fieldsToUpdate.material = String(patch.material);
    if (patch.fabric !== undefined) fieldsToUpdate.fabric = String(patch.fabric);
    if (patch.color !== undefined) fieldsToUpdate.color = String(patch.color);
    if (patch.collections !== undefined) fieldsToUpdate.collections = String(patch.collections);
    if (patch.type !== undefined) fieldsToUpdate.type = String(patch.type);
    if (patch.productInfo !== undefined) fieldsToUpdate.product_info = String(patch.productInfo);
    if (patch.overviewTitle !== undefined) fieldsToUpdate.overview_title = String(patch.overviewTitle);

    if (patch.price !== undefined) {
      const disc = parseFloat(String(patch.price).replace(/[^0-9.]/g, "")) || 0;
      fieldsToUpdate.price = String(disc);
    }
    if (patch.originalPrice !== undefined) {
      const orig = parseFloat(String(patch.originalPrice).replace(/[^0-9.]/g, "")) || 0;
      fieldsToUpdate.original_price = String(orig);
    }
    if (patch.discount !== undefined) {
      fieldsToUpdate.discount = Number(patch.discount);
    }

    if (patch.image !== undefined) fieldsToUpdate.image = String(patch.image);
    if (patch.images !== undefined) {
      fieldsToUpdate.images_json = JSON.stringify(Array.isArray(patch.images) ? patch.images : []);
      if (!fieldsToUpdate.image && Array.isArray(patch.images) && patch.images[0]) {
        fieldsToUpdate.image = patch.images[0];
      }
    }
    if (patch.videos !== undefined) {
      fieldsToUpdate.videos_json = JSON.stringify(Array.isArray(patch.videos) ? patch.videos : []);
    }
    if (patch.sizes !== undefined) {
      fieldsToUpdate.sizes_json = JSON.stringify(Array.isArray(patch.sizes) ? patch.sizes : []);
    }
    if (patch.tags !== undefined) {
      fieldsToUpdate.tags_json = JSON.stringify(Array.isArray(patch.tags) ? patch.tags : []);
    }
    if (patch.stockPerSize !== undefined) {
      fieldsToUpdate.stock_per_size_json = JSON.stringify(patch.stockPerSize || {});
    }
    if (patch.stockQuantity !== undefined) {
      fieldsToUpdate.stock_quantity = Number(patch.stockQuantity);
      fieldsToUpdate.in_stock = Number(patch.stockQuantity) > 0;
    }
    if (patch.inStock !== undefined) fieldsToUpdate.in_stock = Boolean(patch.inStock);

    if (patch.isFeatured !== undefined) fieldsToUpdate.is_featured = Boolean(patch.isFeatured);
    if (patch.isNew !== undefined) fieldsToUpdate.is_new = Boolean(patch.isNew);
    if (patch.isNewArrival !== undefined) fieldsToUpdate.is_new_arrival = Boolean(patch.isNewArrival);
    if (patch.isTrending !== undefined) fieldsToUpdate.is_trending = Boolean(patch.isTrending);
    if (patch.isBestSeller !== undefined) fieldsToUpdate.is_best_seller = Boolean(patch.isBestSeller);
    if (patch.isRecommended !== undefined) fieldsToUpdate.is_recommended = Boolean(patch.isRecommended);

    if (patch.seoTitle !== undefined) fieldsToUpdate.seo_title = String(patch.seoTitle);
    if (patch.seoDescription !== undefined) fieldsToUpdate.seo_description = String(patch.seoDescription);
    if (patch.seoKeywords !== undefined) fieldsToUpdate.seo_keywords = String(patch.seoKeywords);

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_product_catalog?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: getHeaders("return=representation"),
        body: JSON.stringify(fieldsToUpdate),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Failed to patch Supabase product ${id}:`, res.status, errText);
      return { ok: false, error: errText };
    }

    const rows = await res.json();
    const updated = rows && rows[0] ? mapSupabaseRowToProduct(rows[0]) : undefined;
    return { ok: true, product: updated };
  } catch (err: any) {
    console.error(`Network error patching product ${id} in Supabase:`, err);
    return { ok: false, error: err?.message || String(err) };
  }
}

/**
 * Upserts (inserts or updates) a complete product record in Supabase `admin_product_catalog`.
 */
export async function upsertCatalogProductToSupabase(p: any): Promise<{ ok: boolean; product?: Product; error?: string }> {
  try {
    const id = String(p.id || `pr-${Date.now()}`);

    // Safeguard: if this is a partial update without a name, route to PATCH so we never wipe existing data
    if (!p.name && (p.status !== undefined || p.visibility !== undefined)) {
      return patchCatalogProductInSupabase(id, p);
    }

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
      custom_rating: (p.customRating !== undefined && p.customRating !== null && String(p.customRating).trim() !== "" && String(p.customRating).toLowerCase() !== "none")
        ? Number(p.customRating)
        : null,
      custom_review_count: (p.customReviewCount !== undefined && p.customReviewCount !== null && String(p.customReviewCount).trim() !== "" && String(p.customReviewCount).toLowerCase() !== "none")
        ? Number(p.customReviewCount)
        : null,
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
