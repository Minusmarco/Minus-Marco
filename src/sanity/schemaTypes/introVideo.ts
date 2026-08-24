import { defineField, defineType } from "sanity";

export const introVideo = defineType({
  name: "introVideo",
  title: "Intro Splash Video",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal label only, e.g. \"Spring 2027 reel\". Not shown to visitors.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "video",
      title: "Video File",
      type: "file",
      options: { accept: "video/mp4" },
      description:
        "A 5–8 second highlight reel, MP4 (H.264), 1080p or 720p, exported WITHOUT an audio track, ideally under 5MB. Plays silently when visitors first open the site.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster Frame",
      type: "image",
      options: { hotspot: true },
      description: "First-frame image shown while the video loads. Export the video's first frame as a JPG.",
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: false,
      description: "Only one intro should be active at a time. Turn off to disable the intro entirely.",
    }),
  ],
  preview: {
    select: { title: "title", active: "active" },
    prepare({ title, active }) {
      return { title, subtitle: active ? "Active" : "Inactive" };
    },
  },
});
