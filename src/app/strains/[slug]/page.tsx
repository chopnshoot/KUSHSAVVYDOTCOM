import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { seedStrains } from "@/lib/seed-strains";
import { notFound } from "next/navigation";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function generateStaticParams() {
  return seedStrains.map((strain) => ({
    slug: slugify(strain.name),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const strain = seedStrains.find((s) => slugify(s.name) === params.slug);
  if (!strain) return { title: "Strain Not Found" };

  return {
    title: `${strain.name} Strain — Effects, THC, Terpenes & Review`,
    description: `${strain.name} is a ${strain.type} strain with ${strain.thcMin}-${strain.thcMax}% THC. ${strain.description.substring(0, 140)}...`,
  };
}

const typeColors = {
  Indica: {
    badge: "bg-indica/10 text-indica border-indica/20",
    bar: "bg-indica",
  },
  Sativa: {
    badge: "bg-sativa/10 text-sativa border-sativa/20",
    bar: "bg-sativa",
  },
  Hybrid: {
    badge: "bg-hybrid/10 text-hybrid border-hybrid/20",
    bar: "bg-hybrid",
  },
};

export default function StrainPage({
  params,
}: {
  params: { slug: string };
}) {
  const strain = seedStrains.find((s) => slugify(s.name) === params.slug);
  if (!strain) notFound();

  const colors = typeColors[strain.type];
  const relatedStrains = seedStrains
    .filter((s) => s.type === strain.type && s.name !== strain.name)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-8">
          <Link href="/strains" className="hover:text-accent-green transition-colors">
            Strains
          </Link>
          <span>/</span>
          <span className="text-text-primary">{strain.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="font-heading text-3xl md:text-5xl">{strain.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors.badge}`}>
              {strain.type}
            </span>
          </div>
          <p className="text-text-secondary">{strain.ratio}</p>
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* THC Bar */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary text-sm">THC Content</span>
              <span className="font-mono font-semibold text-lg">
                {strain.thcMin}-{strain.thcMax}%
              </span>
            </div>
            <div className="w-full bg-tag-bg rounded-full h-3">
              <div
                className={`h-3 rounded-full ${colors.bar}`}
                style={{ width: `${(strain.thcMax / 35) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* CBD Bar */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary text-sm">CBD Content</span>
              <span className="font-mono font-semibold text-lg">
                {strain.cbdMin}-{strain.cbdMax}%
              </span>
            </div>
            <div className="w-full bg-tag-bg rounded-full h-3">
              <div
                className="h-3 rounded-full bg-blue-400"
                style={{ width: `${Math.max((strain.cbdMax / 5) * 100, 3)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Terpene Profile */}
        <section className="card p-6 mb-6">
          <h2 className="font-heading text-xl mb-4">Terpene Profile</h2>
          <div className="space-y-3">
            {strain.terpenes.map((terpene, i) => (
              <div key={terpene} className="flex items-center gap-3">
                <span className="text-text-secondary w-32 text-sm">
                  {terpene}
                </span>
                <div className="flex-1 bg-tag-bg rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${colors.bar}`}
                    style={{ width: `${100 - i * 25}%`, opacity: 1 - i * 0.2 }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Effects */}
        <section className="card p-6 mb-6">
          <h2 className="font-heading text-xl mb-4">Effects</h2>
          <div className="mb-4">
            <p className="text-text-tertiary text-sm mb-2">Positive Effects</p>
            <div className="flex flex-wrap gap-2">
              {strain.effects.map((effect) => (
                <span key={effect} className="tag bg-green-100 text-green-800">
                  {effect}
                </span>
              ))}
            </div>
          </div>
          {strain.negativeEffects.length > 0 && (
            <div>
              <p className="text-text-tertiary text-sm mb-2">
                Possible Negative Effects
              </p>
              <div className="flex flex-wrap gap-2">
                {strain.negativeEffects.map((effect) => (
                  <span key={effect} className="tag bg-amber-100 text-amber-800">
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Flavors */}
        <section className="card p-6 mb-6">
          <h2 className="font-heading text-xl mb-4">Flavor Profile</h2>
          <div className="flex flex-wrap gap-2">
            {strain.flavors.map((flavor) => (
              <span key={flavor} className="tag">
                {flavor}
              </span>
            ))}
          </div>
        </section>

        {/* Best For */}
        <section className="card p-6 mb-6">
          <h2 className="font-heading text-xl mb-4">Best For</h2>
          <div className="flex flex-wrap gap-2">
            {strain.bestFor.map((use) => (
              <span key={use} className={`tag ${colors.badge}`}>
                {use}
              </span>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="card p-6 mb-6">
          <h2 className="font-heading text-xl mb-4">About {strain.name}</h2>
          <p className="text-text-secondary leading-relaxed">
            {strain.description}
          </p>
        </section>

        {/* Growing Info */}
        <section className="card p-6 mb-10">
          <h2 className="font-heading text-xl mb-4">Growing Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-text-tertiary text-sm mb-1">Difficulty</p>
              <p className="font-semibold">{strain.growDifficulty}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm mb-1">
                Flowering Time
              </p>
              <p className="font-semibold">{strain.floweringTime}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm mb-1">Indoor Yield</p>
              <p className="font-semibold">{strain.yieldIndoor}</p>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/tools/strain-recommender" className="btn-primary text-center flex-1">
            Find Similar Strains
          </Link>
          <Link href="/strains" className="btn-secondary text-center flex-1">
            Browse All Strains
          </Link>
        </div>

        {/* Related Strains */}
        {relatedStrains.length > 0 && (
          <section className="border-t border-border pt-12">
            <h2 className="font-heading text-2xl mb-6">
              Similar {strain.type} Strains
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedStrains.map((rel) => (
                <Link
                  key={rel.name}
                  href={`/strains/${slugify(rel.name)}`}
                  className="card p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-heading text-base mb-1">{rel.name}</h3>
                  <p className="font-mono text-sm text-text-secondary">
                    {rel.thcMin}-{rel.thcMax}% THC
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rel.effects.slice(0, 2).map((e) => (
                      <span key={e} className="text-xs tag">
                        {e}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: strain.name,
              description: strain.description,
              category: `Cannabis / ${strain.type}`,
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
