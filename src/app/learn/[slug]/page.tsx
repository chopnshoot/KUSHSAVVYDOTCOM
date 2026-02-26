import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import { getArticles, getArticleBySlug, slugifyArticle } from "@/lib/sanity";
import { tools } from "@/lib/tools-data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const articles = await getArticles(100);
  return articles.map((article) => ({
    slug: slugifyArticle(article.title),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.excerpt,
  };
}

function renderMarkdown(body: string) {
  const lines = body.split("\n");
  const elements: { type: string; content: string; level?: number }[] = [];
  let currentParagraph = "";

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentParagraph.trim()) {
        elements.push({ type: "p", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      elements.push({ type: "h2", content: line.replace("## ", "") });
    } else if (line.startsWith("### ")) {
      if (currentParagraph.trim()) {
        elements.push({ type: "p", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      elements.push({ type: "h3", content: line.replace("### ", "") });
    } else if (line.startsWith("- ")) {
      if (currentParagraph.trim()) {
        elements.push({ type: "p", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      elements.push({ type: "li", content: line.replace("- ", "") });
    } else if (line.match(/^\d+\. /)) {
      if (currentParagraph.trim()) {
        elements.push({ type: "p", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      elements.push({
        type: "ol",
        content: line.replace(/^\d+\. /, ""),
        level: parseInt(line),
      });
    } else if (line.trim() === "") {
      if (currentParagraph.trim()) {
        elements.push({ type: "p", content: currentParagraph.trim() });
        currentParagraph = "";
      }
    } else {
      currentParagraph += (currentParagraph ? " " : "") + line.trim();
    }
  }
  if (currentParagraph.trim()) {
    elements.push({ type: "p", content: currentParagraph.trim() });
  }

  return elements;
}

function formatContent(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const elements = renderMarkdown(article.body);
  const wordCount = article.body.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 250);

  const relatedTools = article.relatedTools
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean);

  const allArticles = await getArticles(100);
  const otherArticles = allArticles
    .filter((a) => a.title !== article.title)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-8">
          <Link href="/learn" className="hover:text-accent-green transition-colors">
            Learn
          </Link>
          <span>/</span>
          <span className="text-text-primary truncate">{article.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="tag text-xs">{article.category}</span>
            <span className="text-text-tertiary text-sm">
              {readTime} min read
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-text-tertiary">
            <span>{article.author}</span>
            <span>·</span>
            <time>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        {/* Article Body */}
        <article className="prose prose-lg max-w-none">
          {elements.map((el, i) => {
            switch (el.type) {
              case "h2":
                return (
                  <h2
                    key={i}
                    className="font-heading text-2xl mt-10 mb-4"
                  >
                    {el.content}
                  </h2>
                );
              case "h3":
                return (
                  <h3
                    key={i}
                    className="font-heading text-xl mt-8 mb-3"
                  >
                    {el.content}
                  </h3>
                );
              case "p":
                return (
                  <p
                    key={i}
                    className="text-text-secondary leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{
                      __html: formatContent(el.content),
                    }}
                  />
                );
              case "li":
                return (
                  <div key={i} className="flex items-start gap-2 ml-4 mb-2">
                    <span className="text-accent-green mt-1.5">•</span>
                    <span
                      className="text-text-secondary"
                      dangerouslySetInnerHTML={{
                        __html: formatContent(el.content),
                      }}
                    />
                  </div>
                );
              case "ol":
                return (
                  <div key={i} className="flex items-start gap-3 ml-4 mb-2">
                    <span className="font-mono text-sm text-accent-green font-semibold mt-0.5">
                      {el.level}.
                    </span>
                    <span
                      className="text-text-secondary"
                      dangerouslySetInnerHTML={{
                        __html: formatContent(el.content),
                      }}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </article>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
          {article.tags.map((tag) => (
            <span key={tag} className="tag text-xs">
              {tag}
            </span>
          ))}
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <h2 className="font-heading text-2xl mb-6">Related Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedTools.map(
                (tool) =>
                  tool && (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="card p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tool.icon}</span>
                        <div>
                          <h3 className="font-heading text-base">
                            {tool.title}
                          </h3>
                          <p className="text-text-secondary text-sm">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
              )}
            </div>
          </section>
        )}

        {/* More Articles */}
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="font-heading text-2xl mb-6">More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherArticles.map((a) => (
              <Link
                key={a.title}
                href={`/learn/${slugifyArticle(a.title)}`}
                className="card p-5 hover:shadow-md transition-shadow"
              >
                <span className="tag text-xs mb-2 inline-block">
                  {a.category}
                </span>
                <h3 className="font-heading text-sm">{a.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mt-12 pt-8 border-t border-border">
          <NewsletterSignup />
        </section>

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.excerpt,
              author: {
                "@type": "Person",
                name: article.author,
              },
              datePublished: article.publishedAt,
              publisher: {
                "@type": "Organization",
                name: "KushSavvy",
              },
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
