import { groq } from "next-sanity";

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title
  }
`;

export const allArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    "category": category->title,
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
    "category": category->title,
    excerpt,
    coverImage,
    publishedAt
  }
`;

export const currentlyPlayingQuery = groq`
  *[_type == "currentlyPlaying" && active == true] | order(_updatedAt desc)[0] {
    _id, game, platform, progress, rating, coverImage, hotTake
  }
`;

export const activePollQuery = groq`
  *[_type == "poll" && active == true] | order(_updatedAt desc)[0] {
    _id, question, options,
    "votes": coalesce(votes, [])
  }
`;

export const activeDebateQuery = groq`
  *[_type == "debate" && active == true] | order(_updatedAt desc)[0] {
    _id, question, optionA, optionB, context,
    "votesA": coalesce(votesA, 0),
    "votesB": coalesce(votesB, 0)
  }
`;

export const activeQuoteQuery = groq`
  *[_type == "communityQuote" && active == true] | order(_updatedAt desc)[0] {
    _id, text, attribution, source
  }
`;

export const allShoutoutsQuery = groq`
  *[_type == "shoutout"] | order(_createdAt desc) {
    _id, name, handle, platform, note, avatar
  }
`;

export const allVideosQuery = groq`
  *[_type == "video"] | order(featured desc, coalesce(publishedAt, _createdAt) desc) {
    _id, title, youtubeUrl, description, publishedAt, featured
  }
`;

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    subtitle,
    slug,
    "category": category->title,
    excerpt,
    coverImage,
    body,
    publishedAt
  }
`;
