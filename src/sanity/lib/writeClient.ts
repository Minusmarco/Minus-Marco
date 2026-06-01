import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// A server-only client that can mutate the dataset. The write token is a
// secret (NOT NEXT_PUBLIC) so it never reaches the browser — all writes must
// go through a Route Handler. Returns null when unconfigured so callers can
// fail soft.
const token = process.env.SANITY_API_WRITE_TOKEN;

export const writeClient =
  projectId && token
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token,
      })
    : null;
