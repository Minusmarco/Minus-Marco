import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { projectId, dataset } from "../env";

// The builder only needs project details — no full client required.
const builder = createImageUrlBuilder({
  projectId: projectId ?? "placeholder",
  dataset,
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
