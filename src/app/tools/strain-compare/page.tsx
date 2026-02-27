import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StrainCompare from "@/components/tools/StrainCompare";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TOOL_DEFINITIVE_ANSWERS, TOOL_EXTRA_FAQS } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Strain Comparison — Compare Cannabis Strains Side by Side",
  description:
    "Compare any two cannabis strains head-to-head. See THC/CBD levels, effects, flavors, and terpenes side by side with an AI-powered analysis.",
};

const faqs = [
  {
    question: "How does the strain comparison work?",
    answer:
      "Enter any two strain names and our AI analyzes their profiles — including THC/CBD levels, terpenes, effects, and flavors — to give you a detailed side-by-side comparison with a clear verdict on which strain is best for different situations.",
  },
  {
    question: "Can I compare any strain?",
    answer:
      "Yes, you can type in any cannabis strain name. Our AI has knowledge of thousands of strains including popular dispensary strains, classics, and newer varieties.",
  },
  {
    question: "How accurate are the strain profiles?",
    answer:
      "Strain profiles are based on widely documented averages. Actual THC/CBD levels and effects can vary by grower, harvest, and individual biochemistry. Use our comparisons as a general guide.",
  },
  ...(TOOL_EXTRA_FAQS["strain-compare"] || []),
];

const definitiveAnswer = TOOL_DEFINITIVE_ANSWERS["strain-compare"];

export default function StrainComparePage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Strain Comparison" },
          ]}
        />

        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Strain vs. Strain
          </h1>
          {/* GEO: Definitive first-paragraph answer */}
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {definitiveAnswer.answer}
          </p>
          <p className="text-text-tertiary text-sm mt-3 max-w-2xl mx-auto">
            Enter two strains and get an AI-powered side-by-side breakdown of
            effects, potency, flavors, and which one is right for you.
          </p>
        </div>

        <StrainCompare />

        <RelatedTools currentSlug="strain-compare" />

        {/* FAQ */}
        <section className="mt-16 pt-12 border-t border-border">
          <h2 className="font-heading text-2xl mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="font-heading text-lg mb-2">{faq.question}</h3>
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
