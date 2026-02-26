import { MetadataRoute } from "next";
import { getAllStateLaws, getArticles, slugifyArticle } from "@/lib/sanity";
import { tools } from "@/lib/tools-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kushsavvy.com";

  const [stateLaws, articles] = await Promise.all([
    getAllStateLaws(),
    getArticles(100),
  ]);

  const staticPages = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/tools`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/learn`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/learn/glossary`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/learn/cannabis-facts`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/legal`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/newsletter`, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const toolPages = tools
    .filter((t) => t.available)
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const statePages = stateLaws.map((state) => ({
    url: `${baseUrl}/legal/${state.state.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/learn/${slugifyArticle(article.title)}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(article.publishedAt),
  }));

  return [...staticPages, ...toolPages, ...statePages, ...articlePages];
}
