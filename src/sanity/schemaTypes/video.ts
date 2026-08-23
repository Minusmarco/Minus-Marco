import { defineField, defineType } from "sanity";

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      description: "Paste the full link to the video, e.g. https://www.youtube.com/watch?v=… or https://youtu.be/…",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https"] }).custom((url) =>
          typeof url === "string" && /youtu\.?be/.test(url)
            ? true
            : "Must be a YouTube link.",
        ),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, description: "Optional blurb shown under the title." }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime", description: "Used to order videos (newest first). Defaults to creation date if left blank." }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false, description: "Featured videos are highlighted at the top of the page." }),
    defineField({
      name: "embedOnSite",
      title: "Play embedded on the site",
      type: "boolean",
      initialValue: false,
      description: "Off (default): clicking the video opens it on YouTube in a new tab. On: it plays in a popup player on this site.",
    }),
  ],
  orderings: [
    { title: "Published, newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "youtubeUrl" },
  },
});
