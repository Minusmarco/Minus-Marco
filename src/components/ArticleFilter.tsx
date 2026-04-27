"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

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

type Category = {
  _id: string;
  title: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function ArticleFilter({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const [active, setActive] = useState("All");

  // Only show tabs for categories that have at least one published article
  const activeTabs = categories.filter((cat) =>
    articles.some((a) => a.category === cat.title)
  );

  const filtered = active === "All"
    ? articles
    : articles.filter((a) => a.category === active);

  return (
    <>
      {/* Category tabs — only rendered once articles exist */}
      {activeTabs.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActive("All")}
            className={[
              "rounded-md border px-4 py-1.5 text-sm font-sans font-medium transition-colors duration-200",
              active === "All"
                ? "border-accent text-accent bg-accent-dim"
                : "border-border text-text-secondary hover:border-accent hover:text-accent",
            ].join(" ")}
          >
            All
          </button>
          {activeTabs.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActive(cat.title)}
              className={[
                "rounded-md border px-4 py-1.5 text-sm font-sans font-medium transition-colors duration-200",
                active === cat.title
                  ? "border-accent text-accent bg-accent-dim"
                  : "border-border text-text-secondary hover:border-accent hover:text-accent",
              ].join(" ")}
            >
              {cat.title}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="mt-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Image src="/logo-icon.png" alt="" width={48} height={48} className="h-12 w-12 object-contain opacity-20" />
            <p className="text-text-secondary text-lg">No {active} articles yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => {
              const imageUrl = article.coverImage ? urlFor(article.coverImage).width(600).height(340).url() : null;
              return (
                <Link
                  key={article._id}
                  href={`/articles/${article.slug.current}`}
                  className="group flex flex-col bg-surface rounded-lg overflow-hidden border border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
                >
                  <div className="relative h-48 bg-surface-raised overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={(article.coverImage as { alt?: string })?.alt ?? article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-surface-raised to-bg flex items-center justify-center">
                        <Image src="/logo-mark.png" alt="" width={48} height={48} className="w-12 h-12 object-contain opacity-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-sm bg-accent px-2 py-0.5 font-display text-xs font-bold uppercase tracking-widest text-bg">
                      {article.category}
                    </span>
                    {article.featured && (
                      <span className="absolute top-3 right-3 rounded-sm bg-[#f6b327] px-2 py-0.5 font-display text-xs font-bold uppercase tracking-widest text-bg">
                        Featured
                      </span>
                    )}
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
            })}
          </div>
        )}
      </div>
    </>
  );
}
