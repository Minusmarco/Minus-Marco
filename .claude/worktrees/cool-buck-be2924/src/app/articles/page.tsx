import { sanityFetch } from "@/sanity/lib/client";
import { allArticlesQuery } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = ["All", "Review", "News", "Opinion", "Feature", "Video"];

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ArticleCard({ article }: { article: Article }) {
  const imageUrl = article.coverImage
    ? urlFor(article.coverImage).width(600).height(340).url()
    : null;

  return (
    <Link
      href={`/articles/${article.slug.current}`}
      className="group flex flex-col bg-surface rounded-lg overflow-hidden border border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
    >
      <div className="relative h-48 bg-surface-raised overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.coverImage?.alt ?? article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-raised to-bg flex items-center justify-center">
            <span className="font-display text-4xl font-bold text-text-muted opacity-30">MM</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-sm bg-accent px-2 py-0.5 font-display text-xs font-bold uppercase tracking-widest text-bg">
          {article.category}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-5 flex-1">
        <h2 className="font-sans text-base font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <span className="mt-auto pt-3 text-xs text-text-muted font-sans">
          {article.publishedAt ? formatDate(article.publishedAt) : ""}
        </span>
      </div>
    </Link>
  );
}

export default async function ArticlesPage() {
  const articles: Article[] = await sanityFetch<Article[]>(allArticlesQuery);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-text-primary tracking-tight">
          Articles
        </h1>
        <p className="mt-3 text-text-secondary text-lg max-w-xl">
          Reviews, news, opinions, and features from Minus Marco.
        </p>

        {/* Category filter tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="rounded-md border border-border px-4 py-1.5 text-sm font-sans font-medium text-text-secondary hover:border-accent hover:text-accent cursor-pointer transition-colors duration-200 first:border-accent first:text-accent first:bg-accent-dim"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-6">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="font-display text-6xl font-bold text-text-muted opacity-20">MM</span>
            <p className="text-text-secondary text-lg">No articles yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
