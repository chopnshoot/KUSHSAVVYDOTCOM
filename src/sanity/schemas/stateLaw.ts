import { defineType, defineField } from "sanity";

export const stateLaw = defineType({
  name: "stateLaw",
  title: "State Law",
  type: "document",
  fields: [
    defineField({
      name: "state",
      title: "State",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "state", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "abbreviation",
      title: "Abbreviation",
      type: "string",
      validation: (r) => r.max(2),
    }),
    defineField({
      name: "legalStatus",
      title: "Legal Status",
      type: "string",
      options: {
        list: [
          "Fully Legal",
          "Medical Only",
          "Decriminalized",
          "Illegal",
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "recreationalLegal",
      title: "Recreational Legal",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "medicalLegal",
      title: "Medical Legal",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "possessionLimitRec",
      title: "Possession Limit (Recreational)",
      type: "string",
    }),
    defineField({
      name: "possessionLimitMed",
      title: "Possession Limit (Medical)",
      type: "string",
    }),
    defineField({
      name: "ageRequirement",
      title: "Age Requirement",
      type: "number",
    }),
    defineField({
      name: "homeGrowAllowed",
      title: "Home Grow Allowed",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "homeGrowLimit",
      title: "Home Grow Limit",
      type: "string",
    }),
    defineField({
      name: "purchaseLocations",
      title: "Purchase Locations",
      type: "string",
      options: {
        list: ["Dispensaries", "Delivery Only", "Both", "N/A"],
      },
    }),
    defineField({
      name: "publicConsumption",
      title: "Public Consumption",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "recentChanges",
      title: "Recent Changes",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "regulatoryUrl",
      title: "Regulatory URL",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "state", subtitle: "legalStatus" },
    prepare({ title, subtitle }) {
      const icon =
        subtitle === "Fully Legal"
          ? "✅"
          : subtitle === "Medical Only"
            ? "🏥"
            : subtitle === "Decriminalized"
              ? "⚠️"
              : "🚫";
      return { title: `${title}`, subtitle: `${icon} ${subtitle}` };
    },
  },
  orderings: [
    {
      title: "State A–Z",
      name: "stateAsc",
      by: [{ field: "state", direction: "asc" }],
    },
  ],
});
