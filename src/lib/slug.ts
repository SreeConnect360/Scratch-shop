/**
 * ReeVibes Clean URL & Slug Utilities
 * Generates and resolves clean, professional, SEO-friendly slugs without uneven symbols,
 * em-dashes (%E2%80%94), special characters, or long random IDs.
 */

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD') // Normalize accented characters (e.g., é -> e)
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[—–]/g, '-') // Convert em-dash and en-dash to hyphen
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
    .replace(/[\s_]+/g, '-') // Replace whitespace and underscores with hyphen
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens
}

export interface SlugIdentifiable {
  id?: string;
  slug?: string;
  name?: string;
  sku?: string;
}

/**
 * Returns the cleanest canonical slug for a product.
 * Prioritizes explicit slug > slugified name > id.
 */
export function getProductSlug(product?: SlugIdentifiable | null): string {
  if (!product) return '';
  if (product.slug && product.slug.trim()) {
    return slugify(product.slug);
  }
  if (product.name && product.name.trim()) {
    return slugify(product.name);
  }
  return product.id || '';
}

/**
 * Returns the canonical clean shop URL path for a product.
 * E.g., /product/silk-slip-noir
 */
export function getProductPath(product?: SlugIdentifiable | null): string {
  const slug = getProductSlug(product);
  return slug ? `/product/${slug}` : '/';
}

/**
 * Checks if a given query identifier matches a product's slug, id, or normalized name.
 */
export function matchesProductIdentifier(
  product: SlugIdentifiable,
  identifier: string
): boolean {
  if (!product || !identifier) return false;

  const rawIdent = decodeURIComponent(identifier).trim();
  const cleanIdent = slugify(rawIdent);

  // Exact ID match
  if (product.id && product.id.toLowerCase() === rawIdent.toLowerCase()) {
    return true;
  }

  // Explicit slug match
  if (product.slug && slugify(product.slug) === cleanIdent) {
    return true;
  }

  // Name slug match
  if (product.name && slugify(product.name) === cleanIdent) {
    return true;
  }

  // SKU match
  if (product.sku && slugify(product.sku) === cleanIdent) {
    return true;
  }

  return false;
}
