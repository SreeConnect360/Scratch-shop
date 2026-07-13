import { BACKEND_URL } from "./config";

const BASE_URL = `${BACKEND_URL}/api/vendors`;

export async function fetchVendors() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch vendors");
  return res.json();
}

export async function createVendor(vendor: { companyName: string; contactPerson: string; email: string; phone: string }) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vendor)
  });
  if (!res.ok) throw new Error("Failed to register vendor");
  return res.json();
}

export async function deleteVendor(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete vendor");
  return res.json();
}

export async function fetchConnection(vendorId: string) {
  const res = await fetch(`${BASE_URL}/${vendorId}/connection`);
  if (!res.ok) throw new Error("Failed to fetch vendor connection");
  return res.json();
}

export async function saveConnection(vendorId: string, connection: any) {
  const res = await fetch(`${BASE_URL}/${vendorId}/connection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(connection)
  });
  if (!res.ok) throw new Error("Failed to save vendor connection");
  return res.json();
}

export async function triggerSync(vendorId: string) {
  const res = await fetch(`${BASE_URL}/${vendorId}/sync`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger sync");
  return res.json();
}

export async function fetchSyncHistory(vendorId: string) {
  const res = await fetch(`${BASE_URL}/${vendorId}/sync/history`);
  if (!res.ok) throw new Error("Failed to fetch sync history");
  return res.json();
}

export async function fetchProducts(filters?: { vendorId?: string; status?: string; category?: string; inCatalog?: boolean }) {
  const params = new URLSearchParams(filters as any);
  const res = await fetch(`${BASE_URL}/products?${params}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function importProductsToCatalog(productIds: string[]) {
  const res = await fetch(`${BASE_URL}/products/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productIds })
  });
  if (!res.ok) throw new Error("Failed to import products to catalog");
  return res.json();
}

export async function fetchProductDetail(id: string) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
}

export async function updateProductDetail(id: string, patch: any) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error("Failed to update product details");
  return res.json();
}

export async function restoreProductVersion(id: string, versionId: number) {
  const res = await fetch(`${BASE_URL}/products/${id}/restore?versionId=${versionId}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to restore product version");
  return res.json();
}

export async function bulkProductsAction(productIds: string[], action: string, value?: string) {
  const res = await fetch(`${BASE_URL}/products/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productIds, action, value })
  });
  if (!res.ok) throw new Error("Failed to execute bulk action");
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function mergeCategories(source: string, target: string) {
  const res = await fetch(`${BASE_URL}/categories/merge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, target })
  });
  if (!res.ok) throw new Error("Failed to merge categories");
  return res.json();
}

export async function renameCategory(oldName: string, newName: string) {
  const res = await fetch(`${BASE_URL}/categories/rename`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldName, newName })
  });
  if (!res.ok) throw new Error("Failed to rename category");
  return res.json();
}

export async function fetchVendorAnalytics() {
  const res = await fetch(`${BASE_URL}/analytics`);
  if (!res.ok) throw new Error("Failed to fetch vendor analytics");
  return res.json();
}
