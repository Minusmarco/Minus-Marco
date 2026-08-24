import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "A short line shown under the headline. Optional.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (Rule) => Rule.required().min(1).unique(),
      description: "Pick one or more. Articles can span multiple categories.",
    }),
    defineField({
      // Deprecated: superseded by `categories`. Hidden so legacy data on older
      // articles is preserved and still readable via the query fallback. Safe
      // to remove once every article has been moved to `categories`.
      name: "category",
      title: "Category (legacy)",
      type: "reference",
      to: [{ type: "category" }],
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Pin this article to the top of the homepage hero.",
      initialValue: false,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "gameInfo",
      title: "Game Info Box",
      type: "object",
      description:
        "Optional spec box shown at the end of the article, for reviews and previews. Leave the game name blank to hide the box entirely.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "gameTitle",
          title: "Game Name",
          type: "string",
          description: "Required for the box to appear.",
        }),
        defineField({
          name: "boxArt",
          title: "Box Art / Key Art",
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        }),
        defineField({
          name: "score",
          title: "Score (out of 5)",
          type: "number",
          description: "Half stars allowed, e.g. 4.5. Leave blank for previews or non-scored pieces.",
          validation: (Rule) =>
            Rule.min(0).max(5).custom((v) =>
              v === undefined || Number.isInteger((v as number) * 2)
                ? true
                : "Use whole or half numbers only, e.g. 4 or 4.5.",
            ),
        }),
        defineField({
          name: "esrb",
          title: "ESRB Rating",
          type: "string",
          options: {
            list: [
              { title: "E: Everyone", value: "E" },
              { title: "E10+: Everyone 10+", value: "E10+" },
              { title: "T: Teen", value: "T" },
              { title: "M: Mature 17+", value: "M" },
              { title: "AO: Adults Only 18+", value: "AO" },
              { title: "RP: Rating Pending", value: "RP" },
            ],
          },
        }),
        defineField({
          name: "platforms",
          title: "Platforms",
          type: "array",
          of: [{ type: "string" }],
          description: "e.g. PlayStation 5, Xbox Series X|S, Windows, Switch 2",
          options: { layout: "tags" },
        }),
        defineField({ name: "publisher", title: "Publisher", type: "string" }),
        defineField({ name: "developer", title: "Developer", type: "string" }),
        defineField({ name: "genre", title: "Genre", type: "string" }),
        defineField({ name: "releaseDate", title: "Release Date", type: "date" }),
        defineField({
          name: "timeToBeat",
          title: "Estimated Time to Beat",
          type: "string",
          description: "e.g. 16 hours",
        }),
        defineField({
          name: "devLinks",
          title: "Developer Links",
          type: "array",
          of: [{ type: "socialLink" }],
          description: "Developer/publisher socials. Each shows as a clickable icon.",
        }),
        defineField({
          name: "editorsNote",
          title: "Editor's Note",
          type: "text",
          rows: 2,
          description: "e.g. how the game was provided and which platform it was reviewed on.",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage" },
  },
  orderings: [
    {
      title: "Published Date, New First",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
