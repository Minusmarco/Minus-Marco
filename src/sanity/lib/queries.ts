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
    "categories": select(
      defined(categories) => categories[defined(@->title)]->title,
      defined(category->title) => [category->title],
      []
    ),
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
    "categories": select(
      defined(categories) => categories[defined(@->title)]->title,
      defined(category->title) => [category->title],
      []
    ),
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
    _id, name, handle, note, avatar, badge, platform,
    "socials": socials[defined(url) && defined(platform)]{ _key, platform, url }
  }
`;

export const allVideosQuery = groq`
  *[_type == "video"] | order(featured desc, coalesce(publishedAt, _createdAt) desc) {
    _id, title, youtubeUrl, description, publishedAt, featured, embedOnSite
  }
`;

export const allTeamMembersQuery = groq`
  *[_type == "teamMember"] | order(coalesce(order, 999) asc, name asc) {
    _id, name, role, photo,
    "socials": socials[defined(url) && defined(platform)]{ _key, platform, url }
  }
`;

export const relatedArticlesQuery = groq`
  *[_type == "article" && _id != $id && count((
    select(
      defined(categories) => categories[defined(@->title)]->title,
      defined(category->title) => [category->title],
      []
    )
  )[@ in $categories]) > 0] | order(publishedAt desc)[0...3] {
    _id, title, slug, excerpt, coverImage, publishedAt,
    "categories": select(
      defined(categories) => categories[defined(@->title)]->title,
      defined(category->title) => [category->title],
      []
    )
  }
`;

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    subtitle,
    slug,
    "categories": select(
      defined(categories) => categories[defined(@->title)]->title,
      defined(category->title) => [category->title],
      []
    ),
    excerpt,
    coverImage,
    body,
    publishedAt,
    gameInfo {
      gameTitle, boxArt, score, esrb, platforms,
      publisher, developer, genre, releaseDate, timeToBeat, editorsNote,
      "devLinks": devLinks[defined(url) && defined(platform)]{ _key, platform, url }
    }
  }
`;
