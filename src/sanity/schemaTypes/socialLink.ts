import { defineField, defineType } from "sanity";

// Shared {platform, url} pair. Used by community shoutouts and by the game
// info box's developer links. The platform name is free text — the site maps
// it to a brand icon, falling back to a globe for anything unrecognised.
export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      description: "e.g. Instagram, YouTube, X, TikTok, Discord, Twitch, Bluesky, Steam",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description: "Full link (https://…)",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: { select: { title: "platform", subtitle: "url" } },
});
