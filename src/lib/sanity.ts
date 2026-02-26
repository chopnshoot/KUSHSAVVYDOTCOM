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

export async function getStrains() {
  return client.fetch(
    `*[_type == "strain"] | order(popularity desc) {
      _id, name, slug, type, ratio, thcMin, thcMax, cbdMin, cbdMax,
      terpenes[]->{name, slug, color},
      effects, negativeEffects, flavors, bestFor,
      description, growDifficulty, floweringTime, yieldIndoor,
      image, popularity, seoTitle, seoDescription
    }`
  );
}

export async function getStrainBySlug(slug: string) {
  return client.fetch(
    `*[_type == "strain" && slug.current == $slug][0] {
      _id, name, slug, type, ratio, thcMin, thcMax, cbdMin, cbdMax,
      terpenes[]->{name, slug, color, aroma, effects, alsoFoundIn, description},
      effects, negativeEffects, flavors, bestFor,
      description, growDifficulty, floweringTime, yieldIndoor,
      image, popularity, seoTitle, seoDescription
    }`,
    { slug }
  );
}

export async function getFeaturedStrains(limit = 10) {
  return client.fetch(
    `*[_type == "strain"] | order(popularity desc) [0...$limit] {
      _id, name, slug, type, thcMin, thcMax, image
    }`,
    { limit }
  );
}

export async function getTerpenes() {
  return client.fetch(
    `*[_type == "terpene"] | order(name asc) {
      _id, name, slug, aroma, effects, alsoFoundIn, description, researchSummary, color
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
      author, publishedAt, relatedStrains[]->{name, slug, type, thcMin, thcMax},
      relatedTools, seoTitle, seoDescription, seoKeywords
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

export async function getStrainsByType(type: string) {
  return client.fetch(
    `*[_type == "strain" && type == $type] | order(popularity desc) {
      _id, name, slug, type, ratio, thcMin, thcMax, cbdMin, cbdMax,
      effects, flavors, bestFor, image, popularity
    }`,
    { type }
  );
}
