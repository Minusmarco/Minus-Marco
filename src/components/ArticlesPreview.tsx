import { sanityFetch } from "@/sanity/lib/client";
import { allArticlesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  excerpt: string;
  coverImage?: { asset: object; alt?: string };
  publishedAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const PLACEHOLDERS = [
  { category: "Coming Soon", title: "Articles are on the way", id: "1" },
  { category: "Coming Soon", title: "Articles are on the way", id: "2" },
  { category: "Coming Soon", title: "Articles are on the way", id: "3" },
];

export default async function ArticlesPreview() {
  const articles: Article[] = await sanityFetch<Article[]>(allArticlesQuery);
  const displayArticles = articles.slice(0, 3);
  const hasArticles = displayArticles.length > 0;

  return (
    <section className="relative border-t border-border overflow-hidden">
      {/* Soft blue-white gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F4F8FD] to-[#EAF3FB] pointer-events-none" />
      <div className="absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-accent opacity-[0.08] blur-[120px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 bg-accent" />
              <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">Select a Story</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-text-primary">From the desk.</h2>
          </div>
          <Link
            href="/articles"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-sans font-medium text-text-secondary hover:text-accent transition-colors duration-200 group"
          >
            View All
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasArticles
            ? displayArticles.map((article, i) => {
                const imageUrl = article.coverImage
                  ? urlFor(article.coverImage).width(600).height(340).url()
                  : null;
                return (
                  <Link
                    key={article._id}
                    href={`/articles/${article.slug.current}`}
                    className="group flex flex-col bg-surface rounded-lg overflow-hidden border border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-shadow/15"
                  >
                    <div className="relative h-48 bg-surface-raised overflow-hidden">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={article.coverImage?.alt ?? article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-surface-raised to-bg flex items-center justify-center">
                          <span className="font-display text-4xl font-bold text-text-muted opacity-20">MM</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 flex items-center justify-center h-7 min-w-7 px-1.5 rounded-md bg-bg/85 backdrop-blur-sm font-display text-xs font-bold text-text-primary tabular-nums">
                        0{i + 1}
                      </span>
                      <span className="absolute bottom-3 left-3 rounded-sm bg-accent px-2 py-0.5 font-display text-xs font-bold uppercase tracking-widest text-bg">
                        {article.category}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 p-5 flex-1">
                      <h3 className="font-sans text-base font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">{article.excerpt}</p>
                      )}
                      <span className="mt-auto pt-3 text-xs text-text-muted font-sans">
                        {article.publishedAt ? formatDate(article.publishedAt) : ""}
                      </span>
                    </div>
                  </Link>
                );
              })
            : PLACEHOLDERS.map((p) => (
                <div key={p.id} className="flex flex-col bg-surface rounded-lg overflow-hidden border border-border">
                  <div className="h-48 bg-gradient-to-br from-surface-raised to-bg flex items-center justify-center">
                    <span className="font-display text-4xl font-bold text-text-muted opacity-10">MM</span>
                  </div>
                  <div className="flex flex-col gap-2 p-5">
                    <span className="self-start rounded-sm bg-surface-raised border border-border px-2 py-0.5 font-display text-xs font-bold uppercase tracking-widest text-text-muted">
                      Coming Soon
                    </span>
                    <h3 className="font-sans text-base font-semibold text-text-muted leading-snug">Articles are on the way</h3>
                    <span className="mt-2 text-xs text-text-muted">Check back soon</span>
                  </div>
                </div>
              ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link href="/articles" className="flex items-center justify-center gap-2 w-full rounded-md border border-border py-3 text-sm font-sans font-medium text-text-secondary hover:border-accent hover:text-accent transition-colors duration-200 group">
            View All Articles
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
