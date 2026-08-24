import { defineField, defineType } from "sanity";

// The roles listed for the About-page staff section. Order here is the order
// the groups appear on the page.
export const TEAM_ROLES = [
  "Editor",
  "Reporter",
  "Contributor",
  "Graphic Designer",
  "Web Developer",
  "Animator",
  "Musician",
] as const;

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: { list: TEAM_ROLES.map((r) => ({ title: r, value: r })) },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
      description: "Optional headshot. A monogram is shown if left blank.",
    }),
    defineField({
      name: "socials",
      title: "Links",
      type: "array",
      of: [{ type: "socialLink" }],
      description: "Optional: portfolio or social links, shown as icons.",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first within a role. Optional.",
    }),
  ],
  orderings: [
    { title: "Role", name: "role", by: [{ field: "role", direction: "asc" }, { field: "name", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
