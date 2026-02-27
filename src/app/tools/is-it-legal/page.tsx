import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IsItLegal from "@/components/tools/IsItLegal";
import { getAllStateLaws } from "@/lib/sanity";
import { seedCountryLaws } from "@/lib/seed-countries";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TOOL_DEFINITIVE_ANSWERS, TOOL_EXTRA_FAQS } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Is Cannabis Legal? — Check Laws by State & Country",
  description:
    "Check cannabis laws in all 50 US states and 40+ countries worldwide. Find out if marijuana is legal, medical-only, decriminalized, or illegal where you are.",
};

const faqs = [
  {
    question: "Is weed legal in the United States?",
    answer:
      "Cannabis laws vary by state. As of 2026, 25 states plus Washington D.C. have legalized recreational cannabis, while many others allow medical use. Cannabis remains illegal at the federal level, classified as a Schedule I substance.",
  },
  {
    question: "What is the difference between decriminalized and legal?",
    answer:
      "Decriminalized means possession of small amounts is not treated as a criminal offense (usually a civil fine), but sale and distribution remain illegal. Legal means cannabis can be purchased, possessed, and consumed by adults within state regulations.",
  },
  {
    question: "Can I travel between states with cannabis?",
    answer:
      "No. Transporting cannabis across state lines is a federal offense, even between two states where it is legal. Always purchase cannabis in the state where you plan to consume it.",
  },
  {
    question: "How old do you have to be to buy cannabis?",
    answer:
      "In states with legal recreational cannabis, the minimum age is 21. Medical cannabis age requirements vary by state but typically require patients to be 18 or older with a qualifying condition.",
  },
  ...(TOOL_EXTRA_FAQS["is-it-legal"] || []),
];

const definitiveAnswer = TOOL_DEFINITIVE_ANSWERS["is-it-legal"];

export default async function IsItLegalPage() {
  const seedStateLaws = await getAllStateLaws();
  const states = seedStateLaws.map((s) => ({
    state: s.state,
    abbreviation: s.abbreviation,
    legalStatus: s.legalStatus,
    recreationalLegal: s.recreationalLegal,
    medicalLegal: s.medicalLegal,
    possessionLimitRec: s.possessionLimitRec,
    possessionLimitMed: s.possessionLimitMed,
    ageRequirement: s.ageRequirement,
    homeGrowAllowed: s.homeGrowAllowed,
    homeGrowLimit: s.homeGrowLimit,
    purchaseLocations: s.purchaseLocations,
    publicConsumption: s.publicConsumption,
    recentChanges: s.recentChanges,
    regulatoryUrl: s.regulatoryUrl,
  }));

  const countries = seedCountryLaws.map((c) => ({
    country: c.country,
    code: c.code,
    legalStatus: c.legalStatus,
    recreational: c.recreational,
    medical: c.medical,
    summary: c.summary,
    recentChanges: c.recentChanges,
  }));

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Is It Legal?" },
          ]}
        />

        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Is Cannabis Legal Where You Are?
          </h1>
          {/* GEO: Definitive first-paragraph answer */}
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {definitiveAnswer.answer}
          </p>
          <p className="text-text-tertiary text-sm mt-3 max-w-2xl mx-auto">
            Check cannabis laws, possession limits, home growing rules, and
            regulations for all 50 US states and 40+ countries. Updated for 2026.
          </p>
        </div>

        <IsItLegal states={states} countries={countries} />

        <RelatedTools currentSlug="is-it-legal" />

        {/* FAQ */}
        <section className="mt-16 pt-12 border-t border-border">
          <h2 className="font-heading text-2xl mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="font-heading text-lg mb-2">
                  {faq.question}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
