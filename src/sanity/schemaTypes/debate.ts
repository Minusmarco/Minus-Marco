import { defineField, defineType } from "sanity";

export const debate = defineType({
  name: "debate",
  title: "Debate of the Week",
  type: "document",
  fields: [
    defineField({ name: "question", title: "The Question", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "optionA", title: "Side A", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "optionB", title: "Side B", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "context", title: "Context", type: "text", rows: 2, description: "Optional background info for the debate." }),
    defineField({ name: "active", title: "Active Debate", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "question", subtitle: "optionA" },
  },
});
