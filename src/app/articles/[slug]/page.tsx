import { sanityFetch } from "@/sanity/lib/client";
import { articleBySlugQuery, allArticlesQuery } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";
import { urlFor } from "@/sanity/lib/image";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  excerpt: string;
  coverImage?: { asset: object; alt?: string };
  body: PortableTextBlock[];
  publishedAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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
        className="text-accent underline underline-offset-2 hover:text-accent-hover transition-colors"
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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article: Article | null = await sanityFetch<Article | null>(articleBySlugQuery, { slug } as Record<string, unknown>);

  if (!article) notFound();

  const imageUrl = article.coverImage
    ? urlFor(article.coverImage).width(1400).height(600).url()
    : null;

  return (
    <article className="min-h-screen pt-20">
      {/* Cover image header */}
      <div className="relative h-[60vh] bg-surface-raised overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 pb-10">
          <span className="inline-block mb-4 rounded-sm bg-accent px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-bg">
            {article.category}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
            {article.title}
          </h1>
          {article.publishedAt && (
            <p className="mt-4 text-text-muted text-sm font-sans">
              by Minus Marco &middot; {formatDate(article.publishedAt)}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {article.excerpt && (
          <p className="mb-10 text-xl text-text-secondary leading-relaxed border-l-4 border-accent pl-6 italic">
            {article.excerpt}
          </p>
        )}

        {article.body && (
          <PortableText value={article.body} components={portableTextComponents} />
        )}

        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-text-secondary hover:text-accent transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>
        </div>
      </div>
    </article>
  );
}
