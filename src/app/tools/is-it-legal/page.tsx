import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IsItLegal from "@/components/tools/IsItLegal";
import { seedStateLaws } from "@/lib/seed-states";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Is Cannabis Legal in Your State? — State Law Checker",
  description:
    "Check cannabis laws in all 50 US states. Find out if marijuana is legal, medical-only, decriminalized, or illegal in your state, plus possession limits and regulations.",
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
];

export default function IsItLegalPage() {
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

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Is Cannabis Legal in Your State?
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Check cannabis laws, possession limits, home growing rules, and
            regulations for all 50 US states. Updated for 2026.
          </p>
        </div>

        <IsItLegal states={states} />

        {/* Related Tools */}
        <section className="mt-16 pt-12 border-t border-border">
          <h2 className="font-heading text-2xl mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/tools/strain-recommender"
              className="card p-6 block hover:shadow-md transition-shadow"
            >
              <h3 className="font-heading text-lg mb-1">
                Strain Recommender
              </h3>
              <p className="text-text-secondary text-sm">
                Find the perfect strain for your needs
              </p>
            </Link>
            <Link
              href="/tools/edible-dosage-calculator"
              className="card p-6 block hover:shadow-md transition-shadow"
            >
              <h3 className="font-heading text-lg mb-1">
                Edible Dosage Calculator
              </h3>
              <p className="text-text-secondary text-sm">
                Calculate the right dose for your experience level
              </p>
            </Link>
          </div>
        </section>

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
