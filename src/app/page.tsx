import HeroSection from "@/components/HeroSection";
import Ticker from "@/components/Ticker";
import ArticlesPreview from "@/components/ArticlesPreview";
import CommunityBanner from "@/components/CommunityBanner";
import { sanityFetch } from "@/sanity/lib/client";
import { featuredArticleQuery, allArticlesQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  excerpt: string;
  coverImage?: { asset: object; alt?: string };
  publishedAt: string;
  featured: boolean;
};

export default async function Home() {
  const [featured, allArticles] = await Promise.all([
    sanityFetch<Article | null>(featuredArticleQuery),
    sanityFetch<Article[]>(allArticlesQuery),
  ]);

  const recent = allArticles
    .filter((a) => a._id !== featured?._id)
    .slice(0, 3);

  return (
    <main className="flex flex-col flex-1">
      <HeroSection featured={featured} recentArticles={recent} />
      <Ticker />
      <ArticlesPreview />
      <CommunityBanner />
    </main>
  );
}
