import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { seedTerpenes, SeedTerpene } from "./seed-terpenes";
import { seedStateLaws, SeedStateLaw } from "./seed-states";
import { seedArticles, SeedArticle, slugifyArticle } from "./seed-articles";

// ─── Client ───────────────────────────────────────────────────────────────────

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return builder.image(source as any);
}

/** true when a project ID is configured so we can attempt Sanity queries */
const sanityConfigured = projectId.length > 0;

// ─── Terpenes ─────────────────────────────────────────────────────────────────

export async function getTerpenes(): Promise<SeedTerpene[]> {
  if (sanityConfigured) {
    try {
      const results = await client.fetch(
        `*[_type == "terpene"] | order(name asc) {
          name, aroma, effects, alsoFoundIn, commonStrains, description, researchSummary, color
        }`
      );
      if (results && results.length > 0) return results;
    } catch {
      /* fall through to seed data */
    }
  }
  return seedTerpenes;
}

// ─── State Laws ───────────────────────────────────────────────────────────────

function slugifyState(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function getAllStateLaws(): Promise<SeedStateLaw[]> {
  if (sanityConfigured) {
    try {
      const results = await client.fetch(
        `*[_type == "stateLaw"] | order(state asc) {
          state, abbreviation, legalStatus, recreationalLegal, medicalLegal,
          possessionLimitRec, possessionLimitMed, ageRequirement,
          homeGrowAllowed, homeGrowLimit, purchaseLocations,
          publicConsumption, recentChanges, regulatoryUrl
        }`
      );
      if (results && results.length > 0) return results;
    } catch {
      /* fall through */
    }
  }
  return seedStateLaws;
}

export async function getStateLaw(slug: string): Promise<SeedStateLaw | undefined> {
  if (sanityConfigured) {
    try {
      const result = await client.fetch(
        `*[_type == "stateLaw" && slug.current == $slug][0]`,
        { slug }
      );
      if (result) return result;
    } catch {
      /* fall through */
    }
  }
  return seedStateLaws.find((s) => slugifyState(s.state) === slug);
}

// ─── Articles ─────────────────────────────────────────────────────────────────

export async function getArticles(limit = 10): Promise<SeedArticle[]> {
  if (sanityConfigured) {
    try {
      const results = await client.fetch(
        `*[_type == "article"] | order(publishedAt desc) [0...$limit] {
          title, "slug": slug.current, excerpt, category, author, publishedAt, tags, relatedTools, body
        }`,
        { limit }
      );
      if (results && results.length > 0) return results;
    } catch {
      /* fall through */
    }
  }
  return seedArticles.slice(0, limit);
}

export async function getArticleBySlug(slug: string): Promise<SeedArticle | undefined> {
  if (sanityConfigured) {
    try {
      const result = await client.fetch(
        `*[_type == "article" && slug.current == $slug][0] {
          title, "slug": slug.current, excerpt, body, category, tags, author, publishedAt, relatedTools
        }`,
        { slug }
      );
      if (result) return result;
    } catch {
      /* fall through */
    }
  }
  return seedArticles.find((a) => slugifyArticle(a.title) === slug);
}

export async function getArticlesByCategory(category: string): Promise<SeedArticle[]> {
  if (sanityConfigured) {
    try {
      const results = await client.fetch(
        `*[_type == "article" && category == $category] | order(publishedAt desc) {
          title, "slug": slug.current, excerpt, category, author, publishedAt, tags, relatedTools, body
        }`,
        { category }
      );
      if (results && results.length > 0) return results;
    } catch {
      /* fall through */
    }
  }
  return seedArticles.filter((a) => a.category === category);
}

// Re-export for convenience
export { slugifyArticle } from "./seed-articles";
export type { SeedTerpene, SeedStateLaw, SeedArticle };
