import Link from "next/link";
import { tools } from "@/lib/tools-data";
import { seedStrains } from "@/lib/seed-strains";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StrainCard from "@/components/ui/StrainCard";
import ToolCard from "@/components/ui/ToolCard";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

export default function HomePage() {
  const featuredStrains = seedStrains.slice(0, 10);
  const featuredTools = tools
    .filter((t) => t.available)
    .concat(tools.filter((t) => !t.available))
    .slice(0, 6);

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-accent-green/5 via-background to-warm/5">
          <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-text-primary leading-tight mb-6">
              Find your perfect strain
              <br />
              <span className="text-accent-green">in 60 seconds</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              AI-powered cannabis tools and guides — from strain discovery to
              dosage to legality. Make informed decisions with science-backed
              recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Browse All Tools
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Tools */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
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
          <div className="text-center mt-8">
            <Link
              href="/tools"
              className="text-accent-green hover:text-accent-green-light font-medium transition-colors"
            >
              View all tools &rarr;
            </Link>
          </div>
        </section>

        {/* Featured Strains */}
        <section className="bg-tool-bg py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-heading mb-2">Popular Strains</h2>
                <p className="text-text-secondary text-lg">
                  Explore the most popular cannabis strains
                </p>
              </div>
              <Link
                href="/strains"
                className="hidden md:inline-flex btn-secondary text-sm px-4 py-2"
              >
                View All
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
              {featuredStrains.map((strain) => (
                <div
                  key={strain.name}
                  className="min-w-[280px] flex-shrink-0"
                >
                  <StrainCard
                    name={strain.name}
                    slug={strain.name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}
                    type={strain.type}
                    thcMin={strain.thcMin}
                    thcMax={strain.thcMax}
                    effects={strain.effects.slice(0, 3)}
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-6 md:hidden">
              <Link
                href="/strains"
                className="text-accent-green hover:text-accent-green-light font-medium transition-colors"
              >
                View all strains &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">How KushSavvy Works</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Personalized cannabis guidance powered by AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-heading text-accent-green">
                  1
                </span>
              </div>
              <h3 className="font-heading text-xl mb-2">
                Tell Us Your Preferences
              </h3>
              <p className="text-text-secondary">
                Answer a few simple questions about your desired effects,
                experience level, and preferences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-heading text-accent-green">
                  2
                </span>
              </div>
              <h3 className="font-heading text-xl mb-2">
                Get AI Recommendations
              </h3>
              <p className="text-text-secondary">
                Our AI analyzes your preferences and matches you with
                strains from our comprehensive database.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-heading text-accent-green">
                  3
                </span>
              </div>
              <h3 className="font-heading text-xl mb-2">
                Explore &amp; Learn
              </h3>
              <p className="text-text-secondary">
                Dive into detailed strain profiles, calculate dosages, check
                legality, and educate yourself.
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-accent-green/5 py-16 md:py-24">
          <div className="max-w-2xl mx-auto px-4">
            <NewsletterSignup />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
