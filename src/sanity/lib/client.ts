import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "../env";

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      // Only ever return published documents to the public site.
      perspective: "published",
    })
  : null;

export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  // When the project isn't configured (e.g. local dev without env), fail soft
  // with an empty array so pages render their "coming soon" fallbacks.
  if (!client) return [] as unknown as T;
  return client.fetch<T>(query, params ?? {});
}
