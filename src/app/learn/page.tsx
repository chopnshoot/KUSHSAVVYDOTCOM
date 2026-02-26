import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getArticles, slugifyArticle } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Learn About Cannabis — Guides, Science & Education",
  description:
    "Educational cannabis articles covering strains, edibles, terpenes, legality, growing, and more. Science-backed guides for beginners and experienced users.",
};

export default async function LearnPage() {
  const seedArticles = await getArticles(100);
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="section-heading mb-4">Learn About Cannabis</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Science-backed articles and guides to help you understand cannabis.
            From beginner basics to advanced science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seedArticles.map((article) => (
            <Link
              key={article.title}
              href={`/learn/${slugifyArticle(article.title)}`}
              className="card overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="h-48 bg-gradient-to-br from-accent-green/10 to-warm/10 flex items-center justify-center">
                <span className="text-4xl opacity-30 group-hover:opacity-50 transition-opacity font-heading">
                  {article.category.charAt(0)}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="tag text-xs">{article.category}</span>
                </div>
                <h2 className="font-heading text-lg mb-2 group-hover:text-accent-green transition-colors">
                  {article.title}
                </h2>
                <p className="text-text-secondary text-sm line-clamp-2">
                  {article.excerpt}
                </p>
                <p className="text-text-tertiary text-xs mt-3">
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
