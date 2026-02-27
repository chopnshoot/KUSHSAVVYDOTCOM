import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cannabis Facts & Statistics 2026 — Data, Trends & Market Size",
  description:
    "Up-to-date cannabis industry statistics including market size, user demographics, legalization timeline, average prices, and consumption trends. Updated quarterly.",
};

const facts = {
  market: [
    { label: "US legal cannabis market size (2025)", value: "$33.6 billion" },
    { label: "Projected market size (2030)", value: "$58.1 billion" },
    { label: "Annual growth rate (CAGR)", value: "10.4%" },
    { label: "Number of legal cannabis businesses (US)", value: "~15,000+" },
    { label: "Cannabis industry jobs (US)", value: "~440,000" },
  ],
  demographics: [
    { label: "US adults who have tried cannabis", value: "50%" },
    { label: "US adults who currently use cannabis", value: "17%" },
    { label: "Most common age group", value: "25-34 years old" },
    { label: "Gender split (male / female)", value: "55% / 45%" },
    { label: "Daily or near-daily users", value: "~48 million" },
  ],
  consumption: [
    { label: "Most common method", value: "Smoking (43%)" },
    { label: "Second most common method", value: "Edibles (24%)" },
    { label: "Third most common method", value: "Vaping (18%)" },
    { label: "Topicals and tinctures", value: "~10%" },
    { label: "Concentrates / dabbing", value: "~5%" },
  ],
  pricing: [
    { label: "Average price per gram (legal states)", value: "$8-15" },
    { label: "Average 1/8 oz price (legal states)", value: "$25-50" },
    { label: "Average edible price (10-pack)", value: "$15-30" },
    { label: "Average vape cartridge (0.5g)", value: "$25-50" },
    { label: "Average concentrate per gram", value: "$30-60" },
  ],
  legalization: [
    { label: "States with recreational cannabis", value: "24 + D.C." },
    { label: "States with medical cannabis", value: "38" },
    { label: "States with decriminalization only", value: "6" },
    { label: "States where cannabis is fully illegal", value: "6" },
    { label: "Federal classification", value: "Schedule I" },
  ],
  medical: [
    { label: "Registered medical cannabis patients (US)", value: "~3.9 million" },
    { label: "Most common qualifying condition", value: "Chronic pain (65%)" },
    { label: "Second most common condition", value: "Anxiety/PTSD (20%)" },
    { label: "States accepting out-of-state cards", value: "~12" },
    { label: "Average medical card cost", value: "$150-300/year" },
  ],
};

function StatSection({ title, data }: { title: string; data: { label: string; value: string }[] }) {
  return (
    <section className="mb-12">
      <h2 className="font-heading text-2xl mb-6">{title}</h2>
      <div className="space-y-3">
        {data.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-border bg-surface"
          >
            <span className="text-text-secondary text-sm">{stat.label}</span>
            <span className="font-mono font-bold text-accent-green text-lg">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CannabisFactsPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Learn", href: "/learn" },
            { label: "Cannabis Facts & Data" },
          ]}
        />

        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Cannabis Facts & Statistics
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Comprehensive, regularly updated data on the US cannabis industry.
            Market size, demographics, pricing, legalization status, and more.
          </p>
          <p className="text-text-tertiary text-sm mt-2">
            Last updated: February 2026
          </p>
        </div>

        <StatSection title="Market Size & Growth" data={facts.market} />
        <StatSection title="User Demographics" data={facts.demographics} />
        <StatSection title="Consumption Methods" data={facts.consumption} />
        <StatSection title="Average Pricing" data={facts.pricing} />
        <StatSection title="Legalization Status" data={facts.legalization} />
        <StatSection title="Medical Cannabis" data={facts.medical} />

        <section className="mt-12 p-6 rounded-2xl border border-border bg-surface">
          <h2 className="font-heading text-xl mb-3">About This Data</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Statistics are compiled from publicly available industry reports,
            state regulatory agencies, and peer-reviewed research. Sources
            include the Marijuana Policy Project, BDSA Cannabis Market
            Intelligence, Headset Analytics, and state cannabis regulatory
            authorities. Data is updated quarterly. Individual state figures may
            vary. All figures are estimates based on the best available data.
          </p>
        </section>

        {/* Article Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "Cannabis Facts & Statistics 2026",
              description:
                "Comprehensive cannabis industry statistics including market size, user demographics, and legalization data.",
              datePublished: "2026-01-15",
              dateModified: "2026-02-26",
              author: {
                "@type": "Person",
                name: "Langston",
                url: "https://kushsavvy.com/about",
              },
              publisher: {
                "@type": "Organization",
                name: "KushSavvy",
                url: "https://kushsavvy.com",
              },
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
