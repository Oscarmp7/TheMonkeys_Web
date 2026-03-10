import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "es", title: "Español", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.es", maxLength: 96 },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "es", title: "Español", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Inbound Marketing", value: "inbound" },
          { title: "Content Production", value: "content_production" },
          { title: "SEO", value: "seo" },
          { title: "Web Development", value: "web_dev" },
          { title: "Influencer Marketing", value: "influencers" },
          { title: "Digital Campaigns", value: "campaigns" },
          { title: "Content Creation", value: "content_creation" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title.es", media: "mainImage" },
  },
});
