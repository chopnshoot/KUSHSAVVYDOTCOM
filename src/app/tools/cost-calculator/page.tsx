import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CostCalculator from "@/components/tools/CostCalculator";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TOOL_DEFINITIVE_ANSWERS, TOOL_HOWTO_SCHEMAS, TOOL_EXTRA_FAQS } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Cannabis Cost Calculator — How Much Are You Spending?",
  description:
    "Calculate your daily, weekly, monthly, and yearly cannabis spending. Get personalized tips to save money on your cannabis budget.",
};

const faqs = [
  {
    question: "How accurate is the cost calculator?",
    answer:
      "The calculator provides estimates based on average consumption patterns and the price you pay for an eighth. Actual costs may vary based on local pricing, deals, and consumption habits. Use it as a ballpark to understand your spending trends.",
  },
  {
    question: "What is the best way to save money on cannabis?",
    answer:
      "The biggest savings come from: buying in bulk (ounces vs eighths), using a dry herb vaporizer (30-40% more efficient than smoking), taking tolerance breaks to reduce how much you need, and taking advantage of dispensary loyalty programs and deals.",
  },
  {
    question: "Does switching to vaping really save money?",
    answer:
      "Yes. Dry herb vaporizers extract cannabinoids more efficiently than combustion, meaning you get more effect from less flower. Most users report using 30-40% less cannabis after switching, which adds up to significant yearly savings.",
  },
  ...(TOOL_EXTRA_FAQS["cost-calculator"] || []),
];

const howTo = TOOL_HOWTO_SCHEMAS["cost-calculator"];
const definitiveAnswer = TOOL_DEFINITIVE_ANSWERS["cost-calculator"];

export default function CostCalculatorPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Cost Calculator" },
          ]}
        />

        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Cannabis Cost Calculator
          </h1>
          {/* GEO: Definitive first-paragraph answer */}
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {definitiveAnswer.answer}
          </p>
          <p className="text-text-tertiary text-sm mt-3 max-w-2xl mx-auto">
            Find out exactly how much you are spending on cannabis — and get
            smart tips to stretch your budget further.
          </p>
        </div>

        <CostCalculator />

        <RelatedTools currentSlug="cost-calculator" />

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

        {/* HowTo Schema */}
        {howTo && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: howTo.name,
                description: howTo.description,
                step: howTo.steps.map((s) => ({
                  "@type": "HowToStep",
                  name: s.name,
                  text: s.text,
                })),
              }),
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
