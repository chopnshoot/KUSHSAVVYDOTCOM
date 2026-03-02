/**
 * Migrate seed data into Sanity.
 *
 * Usage:
 *   npx tsx scripts/migrate-seed-data.ts
 *
 * Requires SANITY_API_TOKEN (write token) in .env.local
 */

import { createClient } from "@sanity/client";
import { seedArticles, slugifyArticle } from "../src/lib/seed-articles";
import { seedTerpenes } from "../src/lib/seed-terpenes";
import { seedStateLaws } from "../src/lib/seed-states";

// Load env from .env.local
import { config } from "dotenv";
config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hd4xlikb",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function migrateArticles() {
  console.log(`\nMigrating ${seedArticles.length} articles...`);
  for (const article of seedArticles) {
    const slug = slugifyArticle(article.title);
    const doc = {
      _type: "article" as const,
      _id: `article-${slug}`,
      title: article.title,
      slug: { _type: "slug" as const, current: slug },
      excerpt: article.excerpt,
      body: article.body,
      category: article.category,
      tags: article.tags,
      author: article.author,
      publishedAt: article.publishedAt,
      relatedTools: article.relatedTools,
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ ${article.title}`);
  }
}

async function migrateTerpenes() {
  console.log(`\nMigrating ${seedTerpenes.length} terpenes...`);
  for (const terpene of seedTerpenes) {
    const id = slugify(terpene.name);
    const doc = {
      _type: "terpene" as const,
      _id: `terpene-${id}`,
      name: terpene.name,
      aroma: terpene.aroma,
      effects: terpene.effects,
      alsoFoundIn: terpene.alsoFoundIn,
      commonStrains: terpene.commonStrains,
      description: terpene.description,
      researchSummary: terpene.researchSummary,
      color: terpene.color,
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ ${terpene.name}`);
  }
}

async function migrateStateLaws() {
  console.log(`\nMigrating ${seedStateLaws.length} state laws...`);
  for (const law of seedStateLaws) {
    const slug = slugify(law.state);
    const doc = {
      _type: "stateLaw" as const,
      _id: `state-${slug}`,
      state: law.state,
      slug: { _type: "slug" as const, current: slug },
      abbreviation: law.abbreviation,
      legalStatus: law.legalStatus,
      recreationalLegal: law.recreationalLegal,
      medicalLegal: law.medicalLegal,
      possessionLimitRec: law.possessionLimitRec,
      possessionLimitMed: law.possessionLimitMed,
      ageRequirement: law.ageRequirement,
      homeGrowAllowed: law.homeGrowAllowed,
      homeGrowLimit: law.homeGrowLimit,
      purchaseLocations: law.purchaseLocations,
      publicConsumption: law.publicConsumption,
      recentChanges: law.recentChanges,
      regulatoryUrl: law.regulatoryUrl,
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ ${law.state}`);
  }
}

async function main() {
  console.log("Starting Sanity seed data migration...");
  console.log(`Project: ${client.config().projectId}`);
  console.log(`Dataset: ${client.config().dataset}`);

  if (!process.env.SANITY_API_TOKEN) {
    console.error("\n✗ SANITY_API_TOKEN is required. Set it in .env.local");
    process.exit(1);
  }

  await migrateArticles();
  await migrateTerpenes();
  await migrateStateLaws();

  console.log("\n✓ Migration complete!");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
