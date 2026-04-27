import { sanityFetch } from "@/sanity/lib/client";
import { allArticlesQuery, allCategoriesQuery } from "@/sanity/lib/queries";
import ArticleFilter from "@/components/ArticleFilter";

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

type Category = {
  _id: string;
  title: string;
};

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([
    sanityFetch<Article[]>(allArticlesQuery),
    sanityFetch<Category[]>(allCategoriesQuery),
  ]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-text-primary tracking-tight">
          Articles
        </h1>
        <p className="mt-3 text-text-secondary text-lg max-w-xl">
          Reviews, news, opinions, and features from Minus Marco.
        </p>

        <ArticleFilter articles={articles} categories={categories} />
      </div>
    </div>
  );
}
