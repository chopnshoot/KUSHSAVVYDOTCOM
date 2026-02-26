import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return builder.image(source as any);
}

export async function getTerpenes() {
  return client.fetch(
    `*[_type == "terpene"] | order(name asc) {
      _id, name, slug, aroma, effects, alsoFoundIn, commonStrains, description, researchSummary, color
    }`
  );
}

export async function getStateLaw(slug: string) {
  return client.fetch(
    `*[_type == "stateLaw" && slug.current == $slug][0]`,
    { slug }
  );
}

export async function getAllStateLaws() {
  return client.fetch(
    `*[_type == "stateLaw"] | order(state asc) {
      _id, state, slug, abbreviation, legalStatus, recreationalLegal, medicalLegal
    }`
  );
}

export async function getArticles(limit = 10) {
  return client.fetch(
    `*[_type == "article"] | order(publishedAt desc) [0...$limit] {
      _id, title, slug, excerpt, category, featuredImage, author, publishedAt, tags
    }`,
    { limit }
  );
}

export async function getArticleBySlug(slug: string) {
  return client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id, title, slug, excerpt, body, category, tags, featuredImage,
      author, publishedAt, relatedTools, seoTitle, seoDescription, seoKeywords
    }`,
    { slug }
  );
}

export async function getArticlesByCategory(category: string) {
  return client.fetch(
    `*[_type == "article" && category == $category] | order(publishedAt desc) {
      _id, title, slug, excerpt, category, featuredImage, author, publishedAt, tags
    }`,
    { category }
  );
}
