import type { Metadata, Viewport } from "next";
import {
  metadata as studioMetadata,
  viewport as studioViewport,
} from "next-sanity/studio";

// Force-static so the Studio shell is served as a SPA, and inherit Sanity's
// recommended metadata (robots: noindex — keep the CMS out of search results)
// and viewport (viewport-fit: cover for notched devices).
export const dynamic = "force-static";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Minus Marco Studio",
};

export const viewport: Viewport = {
  ...studioViewport,
  viewportFit: "cover",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
