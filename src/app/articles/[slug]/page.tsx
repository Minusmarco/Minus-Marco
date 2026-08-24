import { cache } from "react";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { articleBySlugQuery, allArticlesQuery, relatedArticlesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import ReadingProgress from "@/components/ReadingProgress";
import GameInfoBox, { type GameInfo } from "@/components/GameInfoBox";
import ShareRow from "@/components/ShareRow";
import SubscribeBanner from "@/components/SubscribeBanner";
import { SITE_URL } from "@/lib/brand";
import { notFound } from "next/navigation";

export const revalidate = 60;

type Article = {
  _id: string;
  title: string;
  subtitle?: string;
  slug: { current: string };
  categories: string[];
  excerpt: string;
  coverImage?: { asset: object; alt?: string };
  body: PortableTextBlock[];
  publishedAt: string;
  gameInfo?: GameInfo | null;
};

type RelatedArticle = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  coverImage?: { asset: object; alt?: string };
  categories: string[];
};

// Deduped per-request: generateMetadata and the page component both need the
// same article, so this avoids fetching it from Sanity twice.
const getArticle = cache((slug: string) =>
  sanityFetch<Article | null>(articleBySlugQuery, { slug } as Record<string, unknown>),
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type TextSpan = { text?: string };
type ContentBlock = { _type: string; children?: TextSpan[] };

function estimateReadingMinutes(body: PortableTextBlock[]): number {
  const words = (body as unknown as ContentBlock[]).reduce((count, block) => {
    if (block._type !== "block" || !block.children) return count;
    const text = block.children.map((c) => c.text ?? "").join(" ");
    return count + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 text-text-secondary leading-relaxed text-lg">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-10 mb-4 font-display text-3xl font-bold text-text-primary">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-8 mb-3 font-display text-2xl font-bold text-text-primary">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-6 border-l-4 border-accent pl-6 text-text-secondary italic text-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => (
      <a
        href={value?.href}
        className="text-accent-text underline underline-offset-2 hover:opacity-80 transition-opacity"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: { asset: object; alt?: string; caption?: string } }) => {
      const src = urlFor(value).width(900).url();
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image src={src} alt={value.alt ?? ""} fill className="object-cover" />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-text-muted">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export async function generateStaticParams() {
  const articles: Article[] = await sanityFetch<Article[]>(allArticlesQuery);
  return articles.map((a) => ({ slug: a.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const description = article.subtitle ?? article.excerpt ?? undefined;
  const ogImage = article.coverImage ? urlFor(article.coverImage).width(1200).height(630).url() : undefined;

  return {
    title: article.title,
    description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      publishedTime: article.publishedAt,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const [relatedRaw, allArticles] = await Promise.all([
    sanityFetch<RelatedArticle[]>(relatedArticlesQuery, { id: article._id, categories: article.categories }),
    sanityFetch<Article[]>(allArticlesQuery),
  ]);
  const related = relatedRaw.length > 0
    ? relatedRaw
    : allArticles.filter((a) => a._id !== article._id).slice(0, 3);

  const imageUrl = article.coverImage
    ? urlFor(article.coverImage).width(1400).height(600).url()
    : null;
  const articleUrl = `${SITE_URL}/articles/${slug}`;
  const readingMinutes = estimateReadingMinutes(article.body ?? []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.subtitle ?? article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { "@type": "Person", name: "Marco Hernandez" },
    publisher: { "@type": "Organization", name: "Minus Marco" },
    image: imageUrl ? [imageUrl] : undefined,
    mainEntityOfPage: articleUrl,
  };

  return (
    <article className="min-h-screen pt-20">
      <script
        type="application/ld+json"
        // JSON.stringify already escapes quotes; guard against a stray
        // "</script>" inside string values breaking out of the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ReadingProgress />
      {/* Cover image header — crisp photo with the title in a floating panel */}
      <div className="relative h-[60vh] min-h-[440px] bg-surface-raised overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.coverImage?.alt ?? article.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-raised via-[#0E1520] to-bg" />
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-4xl mx-auto px-6 pb-8">
            <div className="max-w-2xl rounded-2xl border border-white/50 bg-white/75 backdrop-blur-md p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.35)]">
              <div className="mb-4 flex flex-wrap gap-2">
                {article.categories.map((c) => (
                  <span key={c} className="inline-block rounded-sm bg-accent px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-bg">
                    {c}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="mt-4 text-lg sm:text-xl text-text-secondary font-sans leading-relaxed">
                  {article.subtitle}
                </p>
              )}
              {article.publishedAt && (
                <p className="mt-4 text-text-muted text-sm font-sans">
                  by Minus Marco &middot; {formatDate(article.publishedAt)} &middot; {readingMinutes} min read
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Narrower measure for actual reading prose; cards below stay full width. */}
        <div className="max-w-3xl mx-auto">
          {/* Skip the pull-quote when it just repeats the subtitle already shown above. */}
          {article.excerpt && article.excerpt.trim().toLowerCase() !== (article.subtitle ?? "").trim().toLowerCase() && (
            <p className="mb-10 text-xl text-text-secondary leading-relaxed border-l-4 border-accent pl-6 italic">
              {article.excerpt}
            </p>
          )}

          {article.body && (
            <PortableText value={article.body} components={portableTextComponents} />
          )}
        </div>

        <GameInfoBox info={article.gameInfo} />

        <div className="mt-10 pt-8 border-t border-border flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-text-secondary hover:text-accent-text transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>
          <ShareRow url={articleUrl} title={article.title} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-border bg-surface">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-px w-6 bg-accent" />
              <span className="font-display text-xs font-bold uppercase tracking-widest text-accent-text">Keep Playing</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r) => {
                const relatedImage = r.coverImage ? urlFor(r.coverImage).width(400).height(240).url() : null;
                return (
                  <Link
                    key={r._id}
                    href={`/articles/${r.slug.current}`}
                    className="group flex flex-col rounded-lg border border-border bg-bg overflow-hidden hover:border-accent/40 transition-colors duration-200"
                  >
                    <div className="relative h-32 bg-surface-raised overflow-hidden">
                      {relatedImage ? (
                        <Image src={relatedImage} alt={r.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-2xl font-bold text-text-muted opacity-20">MM</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 p-4">
                      {r.categories?.[0] && (
                        <span className="self-start rounded-sm bg-accent-dim px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-widest text-accent-text">
                          {r.categories[0]}
                        </span>
                      )}
                      <h3 className="font-sans text-sm font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-accent-text transition-colors duration-200">
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <SubscribeBanner />
    </article>
  );
}
