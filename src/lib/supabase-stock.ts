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

export interface StockOrderItem {
  productId: string;
  selectedSize?: string;
  qty: number;
  sizeBreakdown?: Record<string, number>;
}

function normalizeStockOrderItems(items: StockOrderItem[]): Array<{ productId: string; size: string; qty: number }> {
  const normalized: Array<{ productId: string; size: string; qty: number }> = [];
  for (const item of items) {
    if (item.sizeBreakdown && typeof item.sizeBreakdown === "object" && Object.keys(item.sizeBreakdown).length > 0) {
      for (const [size, q] of Object.entries(item.sizeBreakdown)) {
        const count = Number(q) || 0;
        if (count > 0) {
          normalized.push({ productId: String(item.productId), size: String(size).trim(), qty: count });
        }
      }
    } else {
      normalized.push({
        productId: String(item.productId),
        size: (item.selectedSize || "M").trim(),
        qty: Number(item.qty) || 1,
      });
    }
  }
  return normalized;
}

/**
 * Deducts stock for specified ordered items from:
 * 1. `admin_product_catalog` (stock_per_size_json, stock_quantity, in_stock)
 * 2. `vendor_products` (stock_per_size_json, stock_quantity, in_stock)
 * 3. `vendor_product_stock` (available_stock, sold_stock)
 */
export async function deductProductStockInSupabase(items: StockOrderItem[]): Promise<boolean> {
  if (!items || items.length === 0) return true;

  try {
    const flatItems = normalizeStockOrderItems(items);
    for (const item of flatItems) {
      const prodId = String(item.productId);
      const size = (item.size || "M").trim();
      const qty = Number(item.qty) || 1;

      // 1. Fetch current product from admin_product_catalog
      const getRes = await fetch(`${SUPABASE_URL}/rest/v1/admin_product_catalog?id=eq.${encodeURIComponent(prodId)}&select=id,stock_per_size_json,stock_quantity,sizes_json`, {
        headers: getHeaders(),
      });

      if (getRes.ok) {
        const prodList = await getRes.json();
        if (prodList && prodList.length > 0) {
          const row = prodList[0];
          let stockPerSize: Record<string, number> = {};
          try {
            if (row.stock_per_size_json) {
              stockPerSize = typeof row.stock_per_size_json === "string" ? JSON.parse(row.stock_per_size_json) : row.stock_per_size_json;
            }
          } catch {
            stockPerSize = {};
          }

          // If size wasn't in object, initialize with 10 or current total
          const currentSizeStock = stockPerSize[size] !== undefined ? Number(stockPerSize[size]) : Math.max(0, (row.stock_quantity || 10));
          const newSizeStock = Math.max(0, currentSizeStock - qty);
          stockPerSize[size] = newSizeStock;

          // Calculate new total stock
          let newTotalStock = Object.values(stockPerSize).reduce((acc, val) => acc + (Number(val) || 0), 0);
          if (newTotalStock === 0 && row.stock_quantity) {
            newTotalStock = Math.max(0, Number(row.stock_quantity) - qty);
          }
          const inStock = newTotalStock > 0;

          // Patch admin_product_catalog
          await fetch(`${SUPABASE_URL}/rest/v1/admin_product_catalog?id=eq.${encodeURIComponent(prodId)}`, {
            method: "PATCH",
            headers: getHeaders("return=minimal"),
            body: JSON.stringify({
              stock_per_size_json: JSON.stringify(stockPerSize),
              stock_quantity: newTotalStock,
              in_stock: inStock,
              updated_at: new Date().toISOString(),
            }),
          }).catch(err => console.error("Error updating admin_product_catalog stock:", err));

          // Also patch vendor_products if present
          await fetch(`${SUPABASE_URL}/rest/v1/vendor_products?id=eq.${encodeURIComponent(prodId)}`, {
            method: "PATCH",
            headers: getHeaders("return=minimal"),
            body: JSON.stringify({
              stock_per_size_json: JSON.stringify(stockPerSize),
              stock_quantity: newTotalStock,
              in_stock: inStock,
            }),
          }).catch(() => null);

          // 2. Synchronize with vendor_product_stock table
          try {
            const stockCheckRes = await fetch(`${SUPABASE_URL}/rest/v1/vendor_product_stock?product_id=eq.${encodeURIComponent(prodId)}&size_name=eq.${encodeURIComponent(size)}&select=id,available_stock,sold_stock`, {
              headers: getHeaders(),
            });
            if (stockCheckRes.ok) {
              const stockRows = await stockCheckRes.json();
              if (stockRows && stockRows.length > 0) {
                const stockRow = stockRows[0];
                const updatedSold = (Number(stockRow.sold_stock) || 0) + qty;
                await fetch(`${SUPABASE_URL}/rest/v1/vendor_product_stock?id=eq.${stockRow.id}`, {
                  method: "PATCH",
                  headers: getHeaders("return=minimal"),
                  body: JSON.stringify({
                    available_stock: newSizeStock,
                    sold_stock: updatedSold,
                  }),
                });
              } else {
                // Insert new size record into vendor_product_stock
                await fetch(`${SUPABASE_URL}/rest/v1/vendor_product_stock`, {
                  method: "POST",
                  headers: getHeaders("return=minimal"),
                  body: JSON.stringify({
                    product_id: prodId,
                    size_name: size,
                    available_stock: newSizeStock,
                    sold_stock: qty,
                    reserved_stock: 0,
                  }),
                }).catch(() => null);
              }
            }
          } catch (e) {
            console.error("Error syncing vendor_product_stock on deduct:", e);
          }
        }
      }
    }
    return true;
  } catch (err) {
    console.error("deductProductStockInSupabase failure:", err);
    return false;
  }
}

/**
 * Restores stock for items when an order is cancelled or declined by admin:
 * 1. `admin_product_catalog` (increments stock_per_size_json and stock_quantity)
 * 2. `vendor_products` (increments stock_per_size_json and stock_quantity)
 * 3. `vendor_product_stock` (increments available_stock, decrements sold_stock)
 */
export async function restoreProductStockInSupabase(items: StockOrderItem[]): Promise<boolean> {
  if (!items || items.length === 0) return true;

  try {
    const flatItems = normalizeStockOrderItems(items);
    for (const item of flatItems) {
      const prodId = String(item.productId);
      const size = (item.size || "M").trim();
      const qty = Number(item.qty) || 1;

      // 1. Fetch current product from admin_product_catalog
      const getRes = await fetch(`${SUPABASE_URL}/rest/v1/admin_product_catalog?id=eq.${encodeURIComponent(prodId)}&select=id,stock_per_size_json,stock_quantity`, {
        headers: getHeaders(),
      });

      if (getRes.ok) {
        const prodList = await getRes.json();
        if (prodList && prodList.length > 0) {
          const row = prodList[0];
          let stockPerSize: Record<string, number> = {};
          try {
            if (row.stock_per_size_json) {
              stockPerSize = typeof row.stock_per_size_json === "string" ? JSON.parse(row.stock_per_size_json) : row.stock_per_size_json;
            }
          } catch {
            stockPerSize = {};
          }

          const currentSizeStock = stockPerSize[size] !== undefined ? Number(stockPerSize[size]) : (row.stock_quantity || 10);
          const newSizeStock = currentSizeStock + qty;
          stockPerSize[size] = newSizeStock;

          // Calculate new total stock
          const newTotalStock = Object.values(stockPerSize).reduce((acc, val) => acc + (Number(val) || 0), 0);

          // Patch admin_product_catalog
          await fetch(`${SUPABASE_URL}/rest/v1/admin_product_catalog?id=eq.${encodeURIComponent(prodId)}`, {
            method: "PATCH",
            headers: getHeaders("return=minimal"),
            body: JSON.stringify({
              stock_per_size_json: JSON.stringify(stockPerSize),
              stock_quantity: newTotalStock,
              in_stock: true,
              updated_at: new Date().toISOString(),
            }),
          }).catch(err => console.error("Error restoring admin_product_catalog stock:", err));

          // Patch vendor_products if present
          await fetch(`${SUPABASE_URL}/rest/v1/vendor_products?id=eq.${encodeURIComponent(prodId)}`, {
            method: "PATCH",
            headers: getHeaders("return=minimal"),
            body: JSON.stringify({
              stock_per_size_json: JSON.stringify(stockPerSize),
              stock_quantity: newTotalStock,
              in_stock: true,
            }),
          }).catch(() => null);

          // 2. Synchronize with vendor_product_stock table
          try {
            const stockCheckRes = await fetch(`${SUPABASE_URL}/rest/v1/vendor_product_stock?product_id=eq.${encodeURIComponent(prodId)}&size_name=eq.${encodeURIComponent(size)}&select=id,available_stock,sold_stock`, {
              headers: getHeaders(),
            });
            if (stockCheckRes.ok) {
              const stockRows = await stockCheckRes.json();
              if (stockRows && stockRows.length > 0) {
                const stockRow = stockRows[0];
                const updatedSold = Math.max(0, (Number(stockRow.sold_stock) || 0) - qty);
                await fetch(`${SUPABASE_URL}/rest/v1/vendor_product_stock?id=eq.${stockRow.id}`, {
                  method: "PATCH",
                  headers: getHeaders("return=minimal"),
                  body: JSON.stringify({
                    available_stock: newSizeStock,
                    sold_stock: updatedSold,
                  }),
                });
              }
            }
          } catch (e) {
            console.error("Error restoring vendor_product_stock:", e);
          }
        }
      }
    }
    return true;
  } catch (err) {
    console.error("restoreProductStockInSupabase failure:", err);
    return false;
  }
}
