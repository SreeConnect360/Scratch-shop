import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-catalog";

export type SupabaseShopCoupon = {
  code: string;
  discount: number;
  type: "fixed" | "percentage" | "wallet";
  expiryDate: string;
  usageLimit: number;
  userEligibility: string;
  active: boolean;
  usedCount?: number;
  productType?: string;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SupabaseWalletGiftCard = {
  id: string;
  code: string;
  amount: number;
  usageType: "unlimited" | "custom";
  usageLimit?: number;
  usedCount: number;
  validityType: "unlimited" | "custom";
  expiryDate?: string;
  status: "Active" | "Inactive" | "Expired" | "Fully Redeemed";
  createdAt: string;
  updatedAt?: string;
  redeemedUsers?: string[];
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
 * Normalizes a raw Supabase `shop_coupons` row into a frontend coupon.
 */
export function mapSupabaseRowToCoupon(row: any): SupabaseShopCoupon {
  return {
    code: String(row.code || "").trim().toUpperCase(),
    discount: Number(row.discount) || 0,
    type: (row.type as any) || "percentage",
    expiryDate: row.expiry_date || "unlimited",
    usageLimit: row.usage_limit !== undefined && row.usage_limit !== null ? Number(row.usage_limit) : 100,
    userEligibility: row.user_eligibility || "All",
    active: row.active !== undefined ? Boolean(row.active) : true,
    usedCount: row.used_count !== undefined && row.used_count !== null ? Number(row.used_count) : 0,
    productType: (row.product_type || "").trim(),
    brand: (row.brand || "").trim(),
    createdAt: row.created_at || undefined,
    updatedAt: row.updated_at || undefined,
  };
}

/**
 * Converts a frontend coupon into a Supabase `shop_coupons` database payload.
 */
export function mapCouponToSupabaseRow(c: SupabaseShopCoupon): Record<string, any> {
  return {
    code: c.code.trim().toUpperCase(),
    discount: Number(c.discount),
    type: c.type,
    expiry_date: c.expiryDate || "unlimited",
    usage_limit: c.usageLimit !== undefined ? Number(c.usageLimit) : 100,
    user_eligibility: c.userEligibility || "All",
    active: Boolean(c.active),
    used_count: c.usedCount !== undefined ? Number(c.usedCount) : 0,
    product_type: (c.productType || "").trim(),
    brand: (c.brand || "").trim(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Normalizes a raw Supabase `wallet_gift_cards` row into a frontend gift card.
 */
export function mapSupabaseRowToGiftCard(row: any): SupabaseWalletGiftCard {
  let redeemedUsers: string[] = [];
  if (row.redeemed_users) {
    if (typeof row.redeemed_users === "string") {
      redeemedUsers = row.redeemed_users
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else if (Array.isArray(row.redeemed_users)) {
      redeemedUsers = row.redeemed_users.map(String);
    }
  }

  return {
    id: String(row.id),
    code: String(row.code || "").trim().toUpperCase(),
    amount: Number(row.amount) || 0,
    usageType: (row.usage_type as any) || "unlimited",
    usageLimit: row.usage_limit !== undefined && row.usage_limit !== null ? Number(row.usage_limit) : undefined,
    usedCount: row.used_count !== undefined && row.used_count !== null ? Number(row.used_count) : 0,
    validityType: (row.validity_type as any) || "unlimited",
    expiryDate: row.expiry_date || undefined,
    status: (row.status as any) || "Active",
    createdAt: row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
    updatedAt: row.updated_at || undefined,
    redeemedUsers,
  };
}

/**
 * Converts a frontend gift card into a Supabase `wallet_gift_cards` database payload.
 */
export function mapGiftCardToSupabaseRow(g: SupabaseWalletGiftCard): Record<string, any> {
  return {
    id: g.id,
    code: g.code.trim().toUpperCase(),
    amount: Number(g.amount),
    usage_type: g.usageType,
    usage_limit: g.usageLimit !== undefined ? Number(g.usageLimit) : 100,
    used_count: g.usedCount !== undefined ? Number(g.usedCount) : 0,
    validity_type: g.validityType,
    expiry_date: g.expiryDate || null,
    status: g.status,
    redeemed_users: Array.isArray(g.redeemedUsers) ? g.redeemedUsers.join(",") : (g.redeemedUsers || ""),
    updated_at: new Date().toISOString(),
  };
}

// ────────────────── COUPONS REST API ──────────────────

/**
 * Fetches all store coupons from Supabase.
 */
export async function fetchCouponsFromSupabase(): Promise<SupabaseShopCoupon[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/shop_coupons?select=*&order=created_at.desc`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      console.warn("Failed to fetch shop_coupons from Supabase:", res.status, await res.text());
      return [];
    }

    const rows = await res.json();
    if (!Array.isArray(rows)) return [];

    return rows.map(mapSupabaseRowToCoupon);
  } catch (err) {
    console.error("Network error fetching shop_coupons from Supabase:", err);
    return [];
  }
}

/**
 * Upserts a store coupon directly in Supabase.
 */
export async function upsertCouponToSupabase(
  coupon: SupabaseShopCoupon
): Promise<{ ok: boolean; coupon?: SupabaseShopCoupon; error?: any }> {
  try {
    const payload = mapCouponToSupabaseRow(coupon);
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/shop_coupons`,
      {
        method: "POST",
        headers: getHeaders("resolution=merge-duplicates,return=representation"),
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to upsert coupon to Supabase:", res.status, errText);
      return { ok: false, error: errText };
    }

    const data = await res.json();
    const saved = Array.isArray(data) && data[0] ? mapSupabaseRowToCoupon(data[0]) : coupon;
    return { ok: true, coupon: saved };
  } catch (err) {
    console.error("Exception upserting coupon to Supabase:", err);
    return { ok: false, error: err };
  }
}

/**
 * Deletes a store coupon directly from Supabase.
 */
export async function deleteCouponFromSupabase(
  code: string
): Promise<{ ok: boolean; error?: any }> {
  try {
    const upperCode = encodeURIComponent(code.trim().toUpperCase());
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/shop_coupons?code=eq.${upperCode}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to delete coupon from Supabase:", res.status, errText);
      return { ok: false, error: errText };
    }

    return { ok: true };
  } catch (err) {
    console.error("Exception deleting coupon from Supabase:", err);
    return { ok: false, error: err };
  }
}

// ────────────────── WALLET GIFT CARDS REST API ──────────────────

/**
 * Fetches all wallet gift cards from Supabase.
 */
export async function fetchWalletGiftCardsFromSupabase(): Promise<SupabaseWalletGiftCard[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/wallet_gift_cards?select=*&order=created_at.desc`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      console.warn("Failed to fetch wallet_gift_cards from Supabase:", res.status, await res.text());
      return [];
    }

    const rows = await res.json();
    if (!Array.isArray(rows)) return [];

    return rows.map(mapSupabaseRowToGiftCard);
  } catch (err) {
    console.error("Network error fetching wallet_gift_cards from Supabase:", err);
    return [];
  }
}

/**
 * Upserts a wallet gift card directly in Supabase.
 */
export async function upsertWalletGiftCardToSupabase(
  card: SupabaseWalletGiftCard
): Promise<{ ok: boolean; giftCard?: SupabaseWalletGiftCard; error?: any }> {
  try {
    const payload = mapGiftCardToSupabaseRow(card);
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/wallet_gift_cards`,
      {
        method: "POST",
        headers: getHeaders("resolution=merge-duplicates,return=representation"),
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to upsert wallet gift card to Supabase:", res.status, errText);
      return { ok: false, error: errText };
    }

    const data = await res.json();
    const saved = Array.isArray(data) && data[0] ? mapSupabaseRowToGiftCard(data[0]) : card;
    return { ok: true, giftCard: saved };
  } catch (err) {
    console.error("Exception upserting wallet gift card to Supabase:", err);
    return { ok: false, error: err };
  }
}

/**
 * Deletes a wallet gift card directly from Supabase.
 */
export async function deleteWalletGiftCardFromSupabase(
  id: string
): Promise<{ ok: boolean; error?: any }> {
  try {
    const encodedId = encodeURIComponent(id.trim());
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/wallet_gift_cards?id=eq.${encodedId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to delete wallet gift card from Supabase:", res.status, errText);
      return { ok: false, error: errText };
    }

    return { ok: true };
  } catch (err) {
    console.error("Exception deleting wallet gift card from Supabase:", err);
    return { ok: false, error: err };
  }
}

/**
 * Updates redemption status and used count in Supabase.
 */
export async function redeemWalletGiftCardInSupabase(
  id: string,
  usedCount: number,
  status: string,
  redeemedUsers: string[]
): Promise<{ ok: boolean; error?: any }> {
  try {
    const encodedId = encodeURIComponent(id.trim());
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/wallet_gift_cards?id=eq.${encodedId}`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          used_count: usedCount,
          status,
          redeemed_users: redeemedUsers.join(","),
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to patch gift card redemption in Supabase:", res.status, errText);
      return { ok: false, error: errText };
    }

    return { ok: true };
  } catch (err) {
    console.error("Exception patching gift card redemption in Supabase:", err);
    return { ok: false, error: err };
  }
}

// ────────────────── COUPON VALIDATION & ELIGIBILITY HELPERS ──────────────────

/**
 * Validates whether a coupon is currently active, non-expired, and within limits.
 */
export function isCouponValid(c: SupabaseShopCoupon): boolean {
  if (!c || !c.active) return false;

  // Expiration check
  if (c.expiryDate && c.expiryDate !== "unlimited") {
    const today = new Date().toISOString().slice(0, 10);
    if (today > c.expiryDate) return false;
  }

  // Usage limit check
  if (c.usageLimit !== undefined && c.usageLimit !== -1 && c.usageLimit > 0) {
    if ((c.usedCount || 0) >= c.usageLimit) return false;
  }

  return true;
}

/**
 * Checks whether a given product matches a coupon's Product Type and/or Brand targeting.
 * - If coupon has neither productType nor brand: valid for ALL products (storewide).
 * - If coupon has productType: matches product.category or product.type.
 * - If coupon has brand: matches product.house or product.brand.
 * - If coupon has both: must match both!
 */
export function isProductEligibleForCoupon(product: any, coupon: SupabaseShopCoupon): boolean {
  if (!product || !coupon) return false;
  if (!isCouponValid(coupon)) return false;

  const targetType = (coupon.productType || "").trim().toLowerCase();
  const targetBrand = (coupon.brand || "").trim().toLowerCase();

  // If no targeting specified, coupon is storewide
  if (!targetType && !targetBrand) {
    return true;
  }

  let typeMatches = true;
  if (targetType) {
    const prodCategory = String(product.category || "").trim().toLowerCase();
    const prodType = String(product.type || "").trim().toLowerCase();
    typeMatches = (prodCategory === targetType || prodType === targetType);
  }

  let brandMatches = true;
  if (targetBrand) {
    const prodHouse = String(product.house || "").trim().toLowerCase();
    const prodBrand = String(product.brand || "").trim().toLowerCase();
    brandMatches = (prodHouse === targetBrand || prodBrand === targetBrand);
  }

  return typeMatches && brandMatches;
}

/**
 * Finds all active and valid coupons that apply to a specific product.
 */
export function getEligibleCouponsForProduct(product: any, coupons: SupabaseShopCoupon[]): SupabaseShopCoupon[] {
  if (!product || !Array.isArray(coupons)) return [];
  return coupons.filter((c) => isProductEligibleForCoupon(product, c));
}
