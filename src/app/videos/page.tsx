import { sanityFetch } from "@/sanity/lib/client";
import { allVideosQuery } from "@/sanity/lib/queries";
import VideoGrid from "@/components/videos/VideoGrid";
import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "Videos" };
export const revalidate = 60;

type Video = Parameters<typeof VideoGrid>[0]["videos"][number];

export default async function VideosPage() {
  const videos = await sanityFetch<Video[]>(allVideosQuery);

  if (!videos || videos.length === 0) {
    return (
      <ComingSoon
        title="Videos"
        description="Video content, previews, and deep dives. Coming soon."
      />
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-[#f6b327]/5 pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-accent opacity-[0.05] blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-8 bg-[#f6b327]" />
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#f6b327]">Watch</span>
          </div>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-text-primary leading-[0.95] tracking-tight">
            VIDEOS
          </h1>
          <p className="mt-6 text-text-secondary text-lg max-w-xl leading-relaxed">
            Deep-dives, previews, and reactions. Click any thumbnail to watch without leaving the page.
          </p>
        </div>
      </section>

      {/* ── GRID ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <VideoGrid videos={videos} />
      </section>
    </div>
  );
}
