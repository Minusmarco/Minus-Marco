import { defineField, defineType } from "sanity";

export const shoutout = defineType({
  name: "shoutout",
  title: "Community Shoutout",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "handle", title: "Handle", type: "string", description: "e.g. @username" }),
    defineField({ name: "platform", title: "Platform", type: "string", description: "e.g. Twitter, Discord, Instagram" }),
    defineField({ name: "note", title: "Shoutout Note", type: "text", rows: 2, validation: (Rule) => Rule.required().max(150) }),
    defineField({
      name: "avatar", title: "Avatar", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "handle", media: "avatar" },
  },
});
