import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToleranceBreakPlanner from "@/components/tools/ToleranceBreakPlanner";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TOOL_DEFINITIVE_ANSWERS, TOOL_HOWTO_SCHEMAS, TOOL_EXTRA_FAQS } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Tolerance Break Planner — Plan Your T-Break",
  description:
    "Get a personalized tolerance break plan with day-by-day guidance, tips for managing withdrawal symptoms, and expectations for when you return.",
};

const faqs = [
  {
    question: "How long should a tolerance break be?",
    answer:
      "Most people notice a significant difference after just 2-3 days, but a full reset of CB1 receptors typically takes 2-4 weeks. Even a 48-hour break can noticeably improve your experience when you return.",
  },
  {
    question: "What are common tolerance break side effects?",
    answer:
      "Common effects during the first few days include difficulty sleeping, vivid dreams, irritability, decreased appetite, and mild anxiety. These typically peak around days 2-3 and improve significantly by the end of the first week.",
  },
  {
    question: "Will a tolerance break help me save money?",
    answer:
      "Absolutely. After a tolerance break, you will need less cannabis to achieve the same effects, which directly reduces your spending. Many regular users find they can cut their consumption in half after a 2-week break.",
  },
  {
    question: "Can I use CBD during a tolerance break?",
    answer:
      "Yes. CBD does not significantly affect THC tolerance since it works on different receptors. Many people find CBD helpful for managing sleep and anxiety symptoms during a tolerance break.",
  },
  ...(TOOL_EXTRA_FAQS["tolerance-break-planner"] || []),
];

const howTo = TOOL_HOWTO_SCHEMAS["tolerance-break-planner"];
const definitiveAnswer = TOOL_DEFINITIVE_ANSWERS["tolerance-break-planner"];

export default function ToleranceBreakPlannerPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Tolerance Break Planner" },
          ]}
        />

        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Tolerance Break Planner
          </h1>
          {/* GEO: Definitive first-paragraph answer */}
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {definitiveAnswer.answer}
          </p>
          <p className="text-text-tertiary text-sm mt-3 max-w-2xl mx-auto">
            Get a personalized day-by-day plan for your tolerance break, with
            tips for managing symptoms and maximizing your reset.
          </p>
        </div>

        <ToleranceBreakPlanner />

        <RelatedTools currentSlug="tolerance-break-planner" />

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
