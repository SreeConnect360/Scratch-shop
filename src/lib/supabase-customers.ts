import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-catalog";

export interface CustomerAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  age: number;
  dob: string;
  country: string;
  avatar: string;
  walletBalance: number;
  cart: any[];
  wishlist: string[];
  addresses: any[];
  orders: any[];
  reviews: any[];
  ratings: any[];
  status: "Active" | "Suspended" | "Pending";
  roles: string[];
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

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

function safeParseJson<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === "object") return val as T;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

/**
 * Normalizes a raw Supabase `customer_accounts` row into a frontend CustomerAccount.
 */
export function mapSupabaseRowToCustomerAccount(row: any): CustomerAccount {
  const firstName = row.first_name || "";
  const lastName = row.last_name || "";
  const email = row.email || "";
  const id = row.id || `USR-${Math.floor(100000 + Math.random() * 900000)}`;

  let parsedCart = safeParseJson<any[]>(row.cart, []);
  let parsedWishlist = safeParseJson<string[]>(row.wishlist, []);
  let parsedAddresses = safeParseJson<any[]>(row.addresses, []);
  let parsedOrders = safeParseJson<any[]>(row.orders, []);
  let parsedReviews = safeParseJson<any[]>(row.reviews, []);
  let parsedRatings = safeParseJson<any[]>(row.ratings, []);

  // Handle double-encoded JSON if strings are nested
  if (Array.isArray(parsedAddresses) && typeof parsedAddresses[0] === "string") {
    parsedAddresses = parsedAddresses.map(a => {
      if (typeof a === "string") {
        try { return JSON.parse(a); } catch { return a; }
      }
      return a;
    });
  }

  return {
    id,
    email,
    firstName,
    lastName,
    phone: row.phone || "",
    gender: row.gender || "",
    age: Number(row.age) || 25,
    dob: row.dob || "",
    country: row.country || "India",
    avatar: row.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName + " " + lastName || email)}`,
    walletBalance: Number(row.wallet_balance) || 0,
    cart: Array.isArray(parsedCart) ? parsedCart : [],
    wishlist: Array.isArray(parsedWishlist) ? parsedWishlist : [],
    addresses: Array.isArray(parsedAddresses) ? parsedAddresses : [],
    orders: Array.isArray(parsedOrders) ? parsedOrders : [],
    reviews: Array.isArray(parsedReviews) ? parsedReviews : [],
    ratings: Array.isArray(parsedRatings) ? parsedRatings : [],
    status: (row.status as any) || "Active",
    roles: row.roles ? (typeof row.roles === "string" ? row.roles.split(",").map((r: string) => r.trim()) : row.roles) : ["General"],
    lastLogin: row.last_login ? new Date(row.last_login).toLocaleString() : undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

/**
 * Converts a frontend CustomerAccount object to a Supabase `customer_accounts` table row.
 */
export function mapCustomerAccountToSupabaseRow(account: Partial<CustomerAccount>): any {
  const row: Record<string, any> = {};

  if (account.id !== undefined) row.id = account.id;
  if (account.email !== undefined) row.email = account.email.trim().toLowerCase();
  if (account.firstName !== undefined) row.first_name = account.firstName;
  if (account.lastName !== undefined) row.last_name = account.lastName;
  if (account.phone !== undefined) row.phone = account.phone;
  if (account.gender !== undefined) row.gender = account.gender;
  if (account.age !== undefined) row.age = account.age;
  if (account.dob !== undefined) row.dob = account.dob;
  if (account.country !== undefined) row.country = account.country;
  if (account.avatar !== undefined) row.avatar = account.avatar;
  if (account.walletBalance !== undefined) row.wallet_balance = account.walletBalance;
  if (account.cart !== undefined) row.cart = account.cart;
  if (account.wishlist !== undefined) row.wishlist = account.wishlist;
  if (account.addresses !== undefined) row.addresses = account.addresses;
  if (account.orders !== undefined) row.orders = account.orders;
  if (account.reviews !== undefined) row.reviews = account.reviews;
  if (account.ratings !== undefined) row.ratings = account.ratings;
  if (account.status !== undefined) row.status = account.status;
  if (account.roles !== undefined) {
    row.roles = Array.isArray(account.roles) ? account.roles.join(",") : account.roles;
  }
  if (account.lastLogin !== undefined) {
    row.last_login = new Date().toISOString();
  }
  row.updated_at = new Date().toISOString();

  return row;
}

/**
 * Fetches all customer accounts directly from Supabase.
 */
export async function fetchCustomerAccountsFromSupabase(): Promise<CustomerAccount[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/customer_accounts?select=*&order=created_at.desc`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.warn("Could not fetch customer accounts from Supabase:", err);
      return [];
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map(mapSupabaseRowToCustomerAccount);
    }
    return [];
  } catch (err) {
    console.error("fetchCustomerAccountsFromSupabase error:", err);
    return [];
  }
}

/**
 * Fetches a single customer account by email.
 */
export async function fetchCustomerAccountByEmail(email: string): Promise<CustomerAccount | null> {
  if (!email) return null;
  try {
    const cleanEmail = encodeURIComponent(email.trim().toLowerCase());
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/customer_accounts?email=eq.${cleanEmail}&select=*`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return mapSupabaseRowToCustomerAccount(data[0]);
    }
    return null;
  } catch (err) {
    console.error("fetchCustomerAccountByEmail error:", err);
    return null;
  }
}

/**
 * Fetches a single customer account by user ID.
 */
export async function fetchCustomerAccountById(id: string): Promise<CustomerAccount | null> {
  if (!id) return null;
  try {
    const cleanId = encodeURIComponent(id.trim());
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/customer_accounts?id=eq.${cleanId}&select=*`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return mapSupabaseRowToCustomerAccount(data[0]);
    }
    return null;
  } catch (err) {
    console.error("fetchCustomerAccountById error:", err);
    return null;
  }
}

/**
 * Upserts a customer account in Supabase (creates if not exists, updates if exists).
 */
export async function upsertCustomerAccountInSupabase(
  account: Partial<CustomerAccount>
): Promise<CustomerAccount | null> {
  try {
    const row = mapCustomerAccountToSupabaseRow(account);
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/customer_accounts`,
      {
        method: "POST",
        headers: getHeaders("resolution=merge-duplicates,return=representation"),
        body: JSON.stringify(row),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.warn("upsertCustomerAccountInSupabase failed:", err);
      return null;
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return mapSupabaseRowToCustomerAccount(data[0]);
    }
    return null;
  } catch (err) {
    console.error("upsertCustomerAccountInSupabase error:", err);
    return null;
  }
}

/**
 * Patches specific fields of a customer account in Supabase over the network.
 */
export async function patchCustomerAccountInSupabase(
  id: string,
  patch: Partial<CustomerAccount>
): Promise<boolean> {
  if (!id) return false;
  try {
    const row = mapCustomerAccountToSupabaseRow(patch);
    delete row.id; // do not overwrite primary key in update payload

    const cleanId = encodeURIComponent(id.trim());
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/customer_accounts?id=eq.${cleanId}`,
      {
        method: "PATCH",
        headers: getHeaders("return=minimal"),
        body: JSON.stringify(row),
      }
    );

    return res.ok;
  } catch (err) {
    console.error("patchCustomerAccountInSupabase error:", err);
    return false;
  }
}

/**
 * Deletes a customer account from Supabase.
 */
export async function deleteCustomerAccountFromSupabase(id: string): Promise<boolean> {
  if (!id) return false;
  try {
    const cleanId = encodeURIComponent(id.trim());
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/customer_accounts?id=eq.${cleanId}`,
      {
        method: "DELETE",
        headers: getHeaders("return=minimal"),
      }
    );
    return res.ok;
  } catch (err) {
    console.error("deleteCustomerAccountFromSupabase error:", err);
    return false;
  }
}

/**
 * Synchronizes user wishlist to both customer_accounts table and user_wishlists table.
 */
export async function syncUserWishlistToSupabase(userId: string, wishlist: string[]): Promise<void> {
  if (!userId) return;
  try {
    // 1. Update customer_accounts
    await patchCustomerAccountInSupabase(userId, { wishlist });

    // 2. Sync user_wishlists table
    const cleanId = encodeURIComponent(userId.trim());
    await fetch(`${SUPABASE_URL}/rest/v1/user_wishlists?user_id=eq.${cleanId}`, {
      method: "DELETE",
      headers: getHeaders("return=minimal"),
    }).catch(() => null);

    if (wishlist && wishlist.length > 0) {
      const rows = wishlist.map(productId => ({
        id: `${userId}_${productId}`,
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString(),
      }));
      await fetch(`${SUPABASE_URL}/rest/v1/user_wishlists`, {
        method: "POST",
        headers: getHeaders("resolution=merge-duplicates,return=minimal"),
        body: JSON.stringify(rows),
      }).catch(err => console.error("Failed to insert into user_wishlists:", err));
    }
  } catch (err) {
    console.error("syncUserWishlistToSupabase error:", err);
  }
}

/**
 * Synchronizes user cart to both customer_accounts table and user_cart_items table.
 */
export async function syncUserCartToSupabase(userId: string, cart: any[]): Promise<void> {
  if (!userId) return;
  try {
    // 1. Update customer_accounts
    await patchCustomerAccountInSupabase(userId, { cart });

    // 2. Sync user_cart_items table
    const cleanId = encodeURIComponent(userId.trim());
    await fetch(`${SUPABASE_URL}/rest/v1/user_cart_items?user_id=eq.${cleanId}`, {
      method: "DELETE",
      headers: getHeaders("return=minimal"),
    }).catch(() => null);

    if (cart && cart.length > 0) {
      const rows = cart.map((item, idx) => ({
        id: `${userId}_${item.productId || idx}_${item.selectedSize || "M"}`,
        user_id: userId,
        product_id: item.productId || "",
        selected_size: item.selectedSize || "M",
        qty: item.qty || 1,
        name: item.name || "",
        price: typeof item.price === "string" ? item.price : String(item.price || ""),
        image: item.image || "",
        house: item.house || "",
        updated_at: new Date().toISOString(),
      }));
      await fetch(`${SUPABASE_URL}/rest/v1/user_cart_items`, {
        method: "POST",
        headers: getHeaders("resolution=merge-duplicates,return=minimal"),
        body: JSON.stringify(rows),
      }).catch(err => console.error("Failed to insert into user_cart_items:", err));
    }
  } catch (err) {
    console.error("syncUserCartToSupabase error:", err);
  }
}

/**
 * Synchronizes user addresses to both customer_accounts table and user_addresses table.
 */
export async function syncUserAddressesToSupabase(userId: string, addresses: any[]): Promise<void> {
  if (!userId) return;
  try {
    // 1. Update customer_accounts
    await patchCustomerAccountInSupabase(userId, { addresses });

    // 2. Sync user_addresses table
    const cleanId = encodeURIComponent(userId.trim());
    await fetch(`${SUPABASE_URL}/rest/v1/user_addresses?user_id=eq.${cleanId}`, {
      method: "DELETE",
      headers: getHeaders("return=minimal"),
    }).catch(() => null);

    if (addresses && addresses.length > 0) {
      const rows = addresses.map((addr, idx) => ({
        id: `${userId}_addr_${idx}`,
        user_id: userId,
        address_data: typeof addr === "object" ? addr : { raw: addr },
        is_default: idx === 0,
        updated_at: new Date().toISOString(),
      }));
      await fetch(`${SUPABASE_URL}/rest/v1/user_addresses`, {
        method: "POST",
        headers: getHeaders("resolution=merge-duplicates,return=minimal"),
        body: JSON.stringify(rows),
      }).catch(err => console.error("Failed to insert into user_addresses:", err));
    }
  } catch (err) {
    console.error("syncUserAddressesToSupabase error:", err);
  }
}

/**
 * Synchronizes a new or updated order to both shop_orders table and customer_accounts table.
 */
export async function syncOrderToSupabase(order: any, userId: string, allUserOrders?: any[]): Promise<void> {
  if (!order || !userId) return;
  try {
    // 1. Upsert into shop_orders table
    const orderRow = {
      id: order.id,
      user_id: userId,
      order_date: order.date ? new Date(order.date).toISOString() : new Date().toISOString(),
      items_json: JSON.stringify(order.items || []),
      total: Number(order.total) || 0,
      status: order.status || "Processing",
      address: typeof order.address === "object" ? JSON.stringify(order.address) : (order.address || ""),
      payment_status: order.paymentStatus || "Paid",
      razorpay_payment_id: order.razorpayPaymentId || null,
      razorpay_order_id: order.razorpayOrderId || null,
      razorpay_signature: order.razorpaySignature || null,
      currency: order.currency || "INR",
      payment_method: order.paymentMethod || "Razorpay Gateway",
      transaction_date: order.transactionDate ? new Date(order.transactionDate).toISOString() : new Date().toISOString(),
      tracking_number: order.trackingNumber || null,
      courier_partner: order.courierPartner || null,
      estimated_delivery_date: order.estimatedDeliveryDate || null,
    };

    await fetch(`${SUPABASE_URL}/rest/v1/shop_orders`, {
      method: "POST",
      headers: getHeaders("resolution=merge-duplicates,return=minimal"),
      body: JSON.stringify(orderRow),
    }).catch(err => console.error("Failed to upsert shop_orders in Supabase:", err));

    // 2. If allUserOrders provided, update customer_accounts.orders
    if (allUserOrders) {
      await patchCustomerAccountInSupabase(userId, { orders: allUserOrders });
    }
  } catch (err) {
    console.error("syncOrderToSupabase error:", err);
  }
}

