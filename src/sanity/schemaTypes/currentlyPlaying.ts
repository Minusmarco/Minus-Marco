import { defineField, defineType } from "sanity";

export const currentlyPlaying = defineType({
  name: "currentlyPlaying",
  title: "Currently Playing",
  type: "document",
  fields: [
    defineField({ name: "game", title: "Game Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "platform", title: "Platform", type: "string", description: "e.g. PS5, Xbox, PC, Switch" }),
    defineField({ name: "progress", title: "Progress", type: "string", description: "e.g. 12 hours in, Chapter 3, Post-game" }),
    defineField({ name: "rating", title: "Rating (1–10)", type: "number", validation: (Rule) => Rule.min(1).max(10) }),
    defineField({
      name: "coverImage", title: "Cover Art", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({ name: "hotTake", title: "Hot Take", type: "text", rows: 3, description: "Marco's current thoughts on the game." }),
    defineField({ name: "active", title: "Show on Site", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "game", subtitle: "platform", media: "coverImage" },
  },
});
