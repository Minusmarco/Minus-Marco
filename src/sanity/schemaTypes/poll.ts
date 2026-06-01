import { defineField, defineType } from "sanity";

export const poll = defineType({
  name: "poll",
  title: "Community Poll",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(2).max(6),
      description: "Add between 2 and 6 options.",
    }),
    defineField({ name: "active", title: "Active Poll", type: "boolean", initialValue: true, description: "Only one poll should be active at a time." }),
    defineField({
      name: "votes",
      title: "Votes",
      type: "array",
      of: [{ type: "number" }],
      readOnly: true,
      description: "Tallied automatically per option as visitors vote. No need to edit.",
    }),
  ],
  preview: {
    select: { title: "question" },
  },
});
