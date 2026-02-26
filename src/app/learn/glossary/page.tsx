import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { glossaryTerms } from "@/lib/seed-glossary";

export const metadata: Metadata = {
  title: "Cannabis Glossary — A-Z Cannabis Terms & Definitions",
  description:
    "Comprehensive glossary of cannabis terminology. Definitions for cannabinoids, terpenes, consumption methods, growing terms, and legal terminology.",
};

const categories = [
  "Cannabinoids",
  "Science",
  "Consumption",
  "Growing",
  "Legal",
  "Medical",
];

export default function GlossaryPage() {
  const sortedTerms = [...glossaryTerms].sort((a, b) =>
    a.term.localeCompare(b.term)
  );

  const termsByLetter: Record<string, typeof glossaryTerms> = {};
  for (const term of sortedTerms) {
    const letter = term.term[0].toUpperCase();
    if (!termsByLetter[letter]) termsByLetter[letter] = [];
    termsByLetter[letter].push(term);
  }

  const letters = Object.keys(termsByLetter).sort();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Learn", href: "/learn" },
            { label: "Glossary" },
          ]}
        />

        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Cannabis Glossary
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            A comprehensive A-Z guide to cannabis terminology. From cannabinoids
            to cultivation, learn the language of cannabis.
          </p>
        </div>

        {/* Letter navigation */}
        <nav className="flex flex-wrap gap-2 mb-12 justify-center">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:border-accent-green hover:text-accent-green transition-colors font-mono text-sm font-bold"
            >
              {letter}
            </a>
          ))}
        </nav>

        {/* Category filter tags */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {categories.map((cat) => (
            <span key={cat} className="tag text-xs">
              {cat} ({glossaryTerms.filter((t) => t.category === cat).length})
            </span>
          ))}
        </div>

        {/* Terms by letter */}
        <div className="space-y-12">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`}>
              <h2 className="font-heading text-3xl text-accent-green mb-6 border-b border-border pb-2">
                {letter}
              </h2>
              <div className="space-y-6">
                {termsByLetter[letter].map((term) => (
                  <div key={term.slug} id={term.slug}>
                    <h3 className="font-heading text-xl mb-1">
                      {term.term}
                      <span className="text-xs text-text-tertiary font-mono ml-2">
                        {term.category}
                      </span>
                    </h3>
                    <p className="text-text-primary mb-1">
                      {term.definition}
                    </p>
                    <p className="text-text-secondary text-sm">
                      {term.expandedExplanation}
                    </p>
                    {term.relatedTerms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {term.relatedTerms.map((rt) => {
                          const related = glossaryTerms.find(
                            (g) => g.term === rt
                          );
                          return related ? (
                            <a
                              key={rt}
                              href={`#${related.slug}`}
                              className="text-xs px-2 py-0.5 rounded-full border border-accent-green/20 bg-accent-green/5 text-accent-green hover:bg-accent-green/10 transition-colors"
                            >
                              {rt}
                            </a>
                          ) : (
                            <span
                              key={rt}
                              className="text-xs px-2 py-0.5 rounded-full bg-tag-bg text-text-tertiary"
                            >
                              {rt}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* DefinedTermSet Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DefinedTermSet",
              name: "Cannabis Glossary",
              description:
                "Comprehensive glossary of cannabis terminology including cannabinoids, terpenes, consumption methods, growing terms, and legal definitions.",
              definedTerm: glossaryTerms.map((t) => ({
                "@type": "DefinedTerm",
                name: t.term,
                description: t.definition,
              })),
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
