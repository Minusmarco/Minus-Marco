import { groq } from "next-sanity";

export const allArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage,
    publishedAt,
    featured
  }
`;

export const featuredArticleQuery = groq`
  *[_type == "article" && featured == true] | order(publishedAt desc)[0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage,
    publishedAt
  }
`;

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    coverImage,
    body,
    publishedAt
  }
`;
