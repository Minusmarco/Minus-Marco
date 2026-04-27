import { defineField, defineType } from "sanity";

export const communityQuote = defineType({
  name: "communityQuote",
  title: "Quote of the Week",
  type: "document",
  fields: [
    defineField({ name: "text", title: "Quote", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "attribution", title: "Attribution", type: "string", description: "Who said it — a game character, dev, journalist, or Marco himself." }),
    defineField({ name: "source", title: "Source", type: "string", description: "Optional — game title, interview, article, etc." }),
    defineField({ name: "active", title: "Active", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "text", subtitle: "attribution" },
  },
});
