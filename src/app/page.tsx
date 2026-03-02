import Link from "next/link";
import { tools } from "@/lib/tools-data";
import { getArticles, slugifyArticle } from "@/lib/sanity";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToolCard from "@/components/ui/ToolCard";
import HeroToolCarousel from "@/components/HeroToolCarousel";

export default async function HomePage() {
  const featuredTools = tools
    .filter((t) => t.available)
    .concat(tools.filter((t) => !t.available))
    .slice(0, 6);
  const latestArticles = await getArticles(6);

  return (
    <>
      <Header />
      <main>
        {/* ── Hero ──────────────────────────────────────── */}
        <section className="hero-dark">
          <div className="hero-grid" />
          <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
            <p className="animate-fade-in-up text-accent-green/80 font-mono text-xs uppercase tracking-[0.2em] mb-6">
              AI-Powered Cannabis Platform
            </p>
            <h1 className="animate-fade-in-up animate-delay-100 font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 tracking-tight">
              Find your perfect strain
              <br />
              <span className="glow-green text-accent-green-light">
                in 60 seconds
              </span>
            </h1>
            <p className="animate-fade-in-up animate-delay-200 font-body text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              From strain discovery to dosage to legality — make informed
              decisions with science-backed recommendations.
            </p>
            <div className="animate-fade-in-up animate-delay-300 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tools/strain-recommender"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Find Your Strain
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="/tools"
                className="border-2 border-white/20 text-white px-8 py-4 rounded-xl font-body font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/30 inline-flex items-center justify-center active:scale-[0.98]"
              >
                Browse All Tools
              </Link>
            </div>

            {/* Tool Carousel */}
            <div className="animate-fade-in-up animate-delay-400">
              <HeroToolCarousel
                tools={tools
                  .filter((t) => t.available)
                  .map(({ slug, title, description, icon }) => ({
                    slug,
                    title,
                    description,
                    icon,
                  }))}
              />
            </div>
          </div>
        </section>

        {/* ── Popular Tools ─────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 pt-20 pb-20 md:pt-28 md:pb-28">
          <div className="text-center mb-14">
            <p className="text-accent-green font-mono text-xs uppercase tracking-[0.2em] mb-3">
              Interactive Tools
            </p>
            <h2 className="section-heading mb-4">Cannabis Tools</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Free interactive tools to help you make informed cannabis
              decisions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                available={tool.available}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-accent-green hover:text-accent-green-light font-semibold transition-colors"
            >
              View all tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>

        <div className="section-divider max-w-5xl mx-auto" />

        {/* ── Latest Guides ─────────────────────────────── */}
        <section className="py-20 md:py-28 bg-tool-bg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-accent-green font-mono text-xs uppercase tracking-[0.2em] mb-3">
                  Learn
                </p>
                <h2 className="section-heading mb-2">Latest Guides</h2>
                <p className="text-text-secondary text-lg">
                  In-depth articles to deepen your cannabis knowledge
                </p>
              </div>
              <Link
                href="/learn"
                className="hidden md:inline-flex items-center gap-2 btn-secondary text-sm px-5 py-2.5"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article, i) => {
                const gradients = [
                  "from-accent-green/30 to-accent-green-light/10",
                  "from-warm/30 to-warm/10",
                  "from-hybrid/25 to-hybrid/10",
                  "from-accent-green-light/30 to-warm/10",
                  "from-warm/25 to-accent-green/10",
                  "from-hybrid/25 to-accent-green-light/10",
                ];
                return (
                  <Link
                    key={article.title}
                    href={`/learn/${slugifyArticle(article.title)}`}
                    className="group rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div
                      className={`h-36 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}
                    >
                      <span className="text-4xl opacity-60 group-hover:scale-110 transition-transform duration-300">
                        {article.category === "Beginner Guides"
                          ? "📖"
                          : article.category === "Science"
                            ? "🔬"
                            : article.category === "Edibles"
                              ? "🍪"
                              : article.category === "Strains"
                                ? "🌿"
                                : "📝"}
                      </span>
                    </div>
                    <div className="p-5">
                      <span className="tag text-xs mb-3 inline-block">
                        {article.category}
                      </span>
                      <h3 className="font-heading text-base font-semibold text-text-primary group-hover:text-accent-green transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-text-secondary text-sm mt-2 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 text-accent-green hover:text-accent-green-light font-semibold transition-colors"
              >
                View all articles
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <div className="section-divider max-w-5xl mx-auto" />

        {/* ── How It Works ──────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-16">
            <p className="text-accent-green font-mono text-xs uppercase tracking-[0.2em] mb-3">
              How It Works
            </p>
            <h2 className="section-heading mb-4">Three Simple Steps</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Personalized cannabis guidance powered by AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-accent-green/20 via-accent-green/40 to-accent-green/20" />

            {[
              {
                num: "01",
                title: "Tell Us Your Preferences",
                desc: "Answer a few simple questions about your desired effects, experience level, and preferences.",
              },
              {
                num: "02",
                title: "Get AI Recommendations",
                desc: "Our AI analyzes your preferences and matches you with the perfect strains using deep cannabis knowledge.",
              },
              {
                num: "03",
                title: "Explore & Learn",
                desc: "Dive into detailed guides, calculate dosages, check legality, and find your strains at local dispensaries.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center relative group">
                <div className="rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent-green/20">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-green/15 to-accent-green-light/5 border border-accent-green/10 flex items-center justify-center mx-auto mb-5">
                    <span className="text-xl font-heading font-bold stat-highlight">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl mb-3">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
