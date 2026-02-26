import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CostCalculator from "@/components/tools/CostCalculator";
import Link from "next/link";

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
];

export default function CostCalculatorPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Cannabis Cost Calculator
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Find out exactly how much you are spending on cannabis — and get
            smart tips to stretch your budget further.
          </p>
        </div>

        <CostCalculator />

        <section className="mt-16 pt-12 border-t border-border">
          <h2 className="font-heading text-2xl mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/tools/tolerance-break-planner" className="card p-6 block hover:shadow-md transition-shadow">
              <h3 className="font-heading text-lg mb-1">Tolerance Break Planner</h3>
              <p className="text-text-secondary text-sm">Reset your tolerance to use less and save more</p>
            </Link>
            <Link href="/tools/edible-dosage-calculator" className="card p-6 block hover:shadow-md transition-shadow">
              <h3 className="font-heading text-lg mb-1">Edible Dosage Calculator</h3>
              <p className="text-text-secondary text-sm">Get the right dose to avoid wasting edibles</p>
            </Link>
          </div>
        </section>

        <section className="mt-16 pt-12 border-t border-border">
          <h2 className="font-heading text-2xl mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="font-heading text-lg mb-2">{faq.question}</h3>
                <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
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
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
