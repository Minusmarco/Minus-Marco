import Link from "next/link";
import HeroSection, { FeatureItem } from "@/components/HeroSection";
import Ticker, { type TickerItem } from "@/components/Ticker";
import ArticlesPreview from "@/components/ArticlesPreview";
import CommunityBanner from "@/components/CommunityBanner";
import CommunityPoll from "@/components/community/CommunityPoll";
import DebateOfWeek from "@/components/community/DebateOfWeek";
import MissionStrip from "@/components/MissionStrip";
import SubscribeBanner from "@/components/SubscribeBanner";
import Reveal from "@/components/Reveal";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  featuredArticleQuery,
  allArticlesQuery,
  allVideosQuery,
  activePollQuery,
  activeDebateQuery,
} from "@/sanity/lib/queries";

export const revalidate = 60;

type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  categories: string[];
  excerpt?: string;
  coverImage?: { asset: object; alt?: string };
  publishedAt?: string;
  featured?: boolean;
};

type Video = {
  _id: string;
  title: string;
  youtubeUrl: string;
  description?: string;
};

// Pull the 11-char id out of any common YouTube URL shape.
function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export default async function Home() {
  const [featured, allArticles, videos, poll, debate] = await Promise.all([
    sanityFetch<Article | null>(featuredArticleQuery),
    sanityFetch<Article[]>(allArticlesQuery),
    sanityFetch<Video[]>(allVideosQuery),
    sanityFetch(activePollQuery),
    sanityFetch(activeDebateQuery),
  ]);

  // Feature reel — articles (featured first) interleaved with videos so the
  // hero card cycles across content types.
  const articleItems: FeatureItem[] = [
    ...(featured ? [featured] : []),
    ...allArticles.filter((a) => a._id !== featured?._id),
  ]
    .slice(0, 4)
    .map((a) => ({
      kind: "article",
      label: a.categories?.[0] ?? "Article",
      title: a.title,
      blurb: a.excerpt ?? "",
      href: `/articles/${a.slug.current}`,
      image: a.coverImage ? urlFor(a.coverImage).width(720).height(400).url() : null,
      cta: "Read Now",
    }));

  const videoItems: FeatureItem[] = videos
    .map((v): FeatureItem => {
      const id = youtubeId(v.youtubeUrl);
      return {
        kind: "video",
        label: "Video",
        title: v.title,
        blurb: v.description ?? "New drop on the channel — tap in.",
        href: "/videos",
        image: id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null,
        cta: "Watch Now",
      };
    })
    .filter((v) => v.image);

  const reel: FeatureItem[] = [];
  const maxLen = Math.max(articleItems.length, videoItems.length);
  for (let i = 0; i < maxLen; i++) {
    if (articleItems[i]) reel.push(articleItems[i]);
    if (videoItems[i]) reel.push(videoItems[i]);
  }
  const items = reel.slice(0, 6);

  // Ticker shows real recent headlines when there's content, falling back to
  // its own static labels when the site is still empty.
  const tickerItems: TickerItem[] = allArticles.slice(0, 5).map((a) => ({
    label: `New — ${a.title}`,
    href: `/articles/${a.slug.current}`,
  }));

  return (
    <main className="flex flex-col flex-1">
      <HeroSection items={items} />
      <Ticker items={tickerItems} />
      <Reveal><ArticlesPreview /></Reveal>
      <MissionStrip />

      {(!!poll || !!debate) && (
        <Reveal><section className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-widest text-accent-text">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  Live
                </span>
                <span className="text-border">·</span>
                <span className="font-display text-xs font-bold uppercase tracking-widest text-text-muted">Community Pulse</span>
              </div>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 text-sm font-sans font-medium text-text-secondary hover:text-accent-text transition-colors duration-200 group"
              >
                Enter the community
                <svg className="transition-transform duration-200 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommunityPoll data={poll as Parameters<typeof CommunityPoll>[0]["data"]} />
              <DebateOfWeek data={debate as Parameters<typeof DebateOfWeek>[0]["data"]} />
            </div>
          </div>
        </section></Reveal>
      )}

      <Reveal><SubscribeBanner /></Reveal>
      <Reveal><CommunityBanner /></Reveal>
    </main>
  );
}
