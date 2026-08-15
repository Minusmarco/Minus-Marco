import { defineField, defineType } from "sanity";

export const shoutout = defineType({
  name: "shoutout",
  title: "Community Shoutout",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "handle", title: "Handle", type: "string", description: "e.g. @username" }),
    defineField({
      name: "socials",
      title: "Social Links",
      type: "array",
      description: "Add one or more social profiles — each becomes a clickable link.",
      of: [
        defineField({
          name: "social",
          title: "Social Link",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              description: "e.g. Instagram, YouTube, Twitter/X, TikTok, Discord, Twitch",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              description: "Link to their page (https://…)",
              validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "badge",
      title: "Badge / Icon",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe the badge for screen readers, e.g. \"Verified\" or \"Moderator\"." })],
      description: "Optional small badge or icon shown next to the name — upload your own.",
    }),
    defineField({ name: "note", title: "Shoutout Note", type: "text", rows: 2, validation: (Rule) => Rule.required().max(150) }),
    defineField({
      name: "avatar", title: "Avatar", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      // Deprecated: superseded by `socials`. Hidden so legacy shoutouts still
      // render their platform via the component fallback. Safe to remove once
      // every shoutout has been moved to `socials`.
      name: "platform",
      title: "Platform (legacy)",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "handle", media: "avatar" },
  },
});
