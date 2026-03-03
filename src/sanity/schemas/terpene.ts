import { defineType, defineField } from "sanity";

export const terpene = defineType({
  name: "terpene",
  title: "Terpene",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "aroma",
      title: "Aroma",
      type: "string",
      description: "Aroma profile description",
    }),
    defineField({
      name: "effects",
      title: "Effects",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "alsoFoundIn",
      title: "Also Found In",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Other plants or foods containing this terpene",
    }),
    defineField({
      name: "commonStrains",
      title: "Common Strains",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "researchSummary",
      title: "Research Summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "Hex color for UI display (e.g. #A7C957)",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "aroma" },
  },
  orderings: [
    {
      title: "Name A–Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
