/**
 * Central Sanity configuration. Every other Sanity module (client, image
 * builder, studio config) reads from here so there's a single source of truth.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

/**
 * Pull straight from the live API rather than the edge CDN. Combined with the
 * frontend's ISR (`export const revalidate`), this keeps Studio edits showing
 * up promptly while Next still caches responses between revalidations.
 */
export const useCdn = false;
