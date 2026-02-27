import { getResultKeys } from "@/lib/results";

export async function GET() {
  const tools = [
    "strain-recommender",
    "strain-compare",
    "cbd-vs-thc",
    "tolerance-break-planner",
    "grow-timeline",
    "terpene-guide",
  ];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kushsavvy.com";
  const urls: string[] = [];

  for (const tool of tools) {
    const hashes = await getResultKeys(tool, 1000);
    for (const hash of hashes) {
      urls.push(`${baseUrl}/tools/${tool}/r/${hash}`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc><changefreq>never</changefreq><priority>0.4</priority></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
