import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllStateLaws, getStateLaw } from "@/lib/sanity";
import { seedCountryLaws, CountryLaw } from "@/lib/seed-countries";
import { notFound } from "next/navigation";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getCountryLaw(slug: string): CountryLaw | undefined {
  return seedCountryLaws.find((c) => slugify(c.country) === slug);
}

export async function generateStaticParams() {
  const stateLaws = await getAllStateLaws();
  const stateParams = stateLaws.map((state) => ({
    slug: slugify(state.state),
  }));
  const countryParams = seedCountryLaws.map((country) => ({
    slug: slugify(country.country),
  }));
  return [...stateParams, ...countryParams];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const state = await getStateLaw(params.slug);
  if (state) {
    return {
      title: `Cannabis Laws in ${state.state} — Is Weed Legal in ${state.abbreviation}?`,
      description: `Cannabis is ${state.legalStatus.toLowerCase()} in ${state.state}. Learn about possession limits, home growing, dispensaries, and recent changes to ${state.state} marijuana laws.`,
    };
  }

  const country = getCountryLaw(params.slug);
  if (country) {
    return {
      title: `Cannabis Laws in ${country.country} — Is Weed Legal?`,
      description: `Cannabis is ${country.legalStatus.toLowerCase()} in ${country.country}. ${country.summary.slice(0, 120)}...`,
    };
  }

  return { title: "Not Found" };
}

const statusColors: Record<string, string> = {
  "Fully Legal": "bg-green-100 text-green-800 border-green-300",
  "Medical Only": "bg-yellow-100 text-yellow-800 border-yellow-300",
  Decriminalized: "bg-orange-100 text-orange-800 border-orange-300",
  "Partially Legal": "bg-blue-100 text-blue-800 border-blue-300",
  Illegal: "bg-red-100 text-red-800 border-red-300",
};

export default async function LegalDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Try state first
  const state = await getStateLaw(params.slug);

  if (state) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-8">
            <Link href="/legal" className="hover:text-accent-green transition-colors">
              Legal
            </Link>
            <span>/</span>
            <span className="text-text-primary">{state.state}</span>
          </nav>

          <div className="text-center mb-10">
            <h1 className="font-heading text-3xl md:text-5xl mb-4">
              Cannabis Laws in {state.state}
            </h1>
            <div className={`inline-flex items-center px-6 py-3 rounded-full border-2 text-xl font-semibold ${statusColors[state.legalStatus]}`}>
              {state.legalStatus}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">Recreational</p>
              <p className="font-semibold text-lg">
                {state.recreationalLegal ? "Legal" : "Not Legal"}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">Medical</p>
              <p className="font-semibold text-lg">
                {state.medicalLegal ? "Legal" : "Not Legal"}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">Minimum Age</p>
              <p className="font-mono font-semibold text-lg">{state.ageRequirement}+</p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">Rec. Possession Limit</p>
              <p className="font-semibold">{state.possessionLimitRec}</p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">Med. Possession Limit</p>
              <p className="font-semibold">{state.possessionLimitMed}</p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">Where to Buy</p>
              <p className="font-semibold">{state.purchaseLocations}</p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">Home Growing</p>
              <p className="font-semibold">
                {state.homeGrowAllowed ? state.homeGrowLimit : "Not Allowed"}
              </p>
            </div>
          </div>

          {state.publicConsumption && (
            <section className="card p-6 mb-6">
              <h2 className="font-heading text-xl mb-3">Public Consumption</h2>
              <p className="text-text-secondary leading-relaxed">{state.publicConsumption}</p>
            </section>
          )}

          {state.recentChanges && (
            <section className="card p-6 mb-6">
              <h2 className="font-heading text-xl mb-3">Recent Changes</h2>
              <p className="text-text-secondary leading-relaxed">{state.recentChanges}</p>
            </section>
          )}

          {state.regulatoryUrl && (
            <section className="card p-6 mb-10">
              <h2 className="font-heading text-xl mb-3">Official Resources</h2>
              <a
                href={state.regulatoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-green hover:text-accent-green-light transition-colors inline-flex items-center gap-2"
              >
                {state.state} Cannabis Regulatory Authority
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </section>
          )}

          {state.recreationalLegal && (
            <div className="bg-accent-green/5 rounded-2xl p-8 text-center border border-accent-green/20 mb-10">
              <h3 className="font-heading text-2xl mb-2">
                Cannabis is legal in {state.state}!
              </h3>
              <p className="text-text-secondary mb-4">
                Find your perfect strain with our AI recommendation tool.
              </p>
              <Link href="/tools/strain-recommender" className="btn-primary">
                Find Your Strain
              </Link>
            </div>
          )}

          <div className="text-center">
            <Link href="/legal" className="text-accent-green hover:text-accent-green-light transition-colors">
              &larr; View all states &amp; countries
            </Link>
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: `Cannabis Laws in ${state.state}`,
                description: `Cannabis is ${state.legalStatus.toLowerCase()} in ${state.state}.`,
              }),
            }}
          />
        </main>
        <Footer />
      </>
    );
  }

  // Try country
  const country = getCountryLaw(params.slug);
  if (!country) notFound();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-8">
          <Link href="/legal" className="hover:text-accent-green transition-colors">
            Legal
          </Link>
          <span>/</span>
          <span className="text-text-primary">{country.country}</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl mb-4">
            Cannabis Laws in {country.country}
          </h1>
          <div className={`inline-flex items-center px-6 py-3 rounded-full border-2 text-xl font-semibold ${statusColors[country.legalStatus]}`}>
            {country.legalStatus}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="card p-5">
            <p className="text-text-tertiary text-sm mb-1">Recreational</p>
            <p className="font-semibold text-lg">
              {country.recreational ? "Legal" : "Not Legal"}
            </p>
          </div>
          <div className="card p-5">
            <p className="text-text-tertiary text-sm mb-1">Medical</p>
            <p className="font-semibold text-lg">
              {country.medical ? "Legal" : "Not Legal"}
            </p>
          </div>
        </div>

        <section className="card p-6 mb-6">
          <h2 className="font-heading text-xl mb-3">Overview</h2>
          <p className="text-text-secondary leading-relaxed">{country.summary}</p>
        </section>

        {country.recentChanges && (
          <section className="card p-6 mb-10">
            <h2 className="font-heading text-xl mb-3">Recent Changes</h2>
            <p className="text-text-secondary leading-relaxed">{country.recentChanges}</p>
          </section>
        )}

        {country.recreational && (
          <div className="bg-accent-green/5 rounded-2xl p-8 text-center border border-accent-green/20 mb-10">
            <h3 className="font-heading text-2xl mb-2">
              Cannabis is legal in {country.country}!
            </h3>
            <p className="text-text-secondary mb-4">
              Find your perfect strain with our AI recommendation tool.
            </p>
            <Link href="/tools/strain-recommender" className="btn-primary">
              Find Your Strain
            </Link>
          </div>
        )}

        <div className="text-center">
          <Link href="/legal" className="text-accent-green hover:text-accent-green-light transition-colors">
            &larr; View all states &amp; countries
          </Link>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: `Cannabis Laws in ${country.country}`,
              description: `Cannabis is ${country.legalStatus.toLowerCase()} in ${country.country}.`,
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
