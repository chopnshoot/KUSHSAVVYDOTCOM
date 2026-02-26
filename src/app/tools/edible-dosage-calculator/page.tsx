import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EdibleDosageCalculator from "@/components/tools/EdibleDosageCalculator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edible Dosage Calculator — How Many MG Should You Take?",
  description:
    "Calculate the right edible dosage based on your experience level, body weight, and desired intensity. Free cannabis edible dose calculator with safety tips.",
};

const faqs = [
  {
    question: "How many mg of edibles should a beginner take?",
    answer:
      "Beginners should start with 2.5-5mg of THC. This is considered a low dose that allows you to gauge your sensitivity without overwhelming effects. Wait at least 2 hours before considering taking more.",
  },
  {
    question: "How long do edibles take to kick in?",
    answer:
      "Edibles typically take 30-90 minutes to take effect, depending on the type. Beverages and tinctures tend to act faster (15-30 minutes), while baked goods and capsules can take 45-90 minutes. Always wait at least 2 hours before taking more.",
  },
  {
    question: "How long do edible effects last?",
    answer:
      "Edible effects typically last 4-8 hours, with peak effects occurring 1-4 hours after consumption. The duration depends on the dose, your metabolism, and the type of edible consumed.",
  },
  {
    question: "What should I do if I take too much?",
    answer:
      "Stay calm and remember that cannabis overdose is not fatal. Find a comfortable place, take deep breaths, stay hydrated, and try chewing black peppercorns (the caryophyllene may help). CBD can also help counteract THC effects. The feelings will pass within a few hours.",
  },
  {
    question: "Does body weight affect edible dosage?",
    answer:
      "Body weight can influence how edibles affect you, but it is not as significant a factor as your overall cannabis tolerance and experience level. Our calculator accounts for body weight as a secondary factor alongside your primary experience level.",
  },
];

export default function EdibleDosageCalculatorPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Edible Dosage Calculator
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Find the right edible dose for your experience level and
            goals. Answer 4 questions for a personalized recommendation
            with timing and safety info.
          </p>
        </div>

        <EdibleDosageCalculator />

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
                Find the perfect strain for your needs with AI
              </p>
            </Link>
            <Link
              href="/tools/is-it-legal"
              className="card p-6 block hover:shadow-md transition-shadow"
            >
              <h3 className="font-heading text-lg mb-1">
                Is It Legal?
              </h3>
              <p className="text-text-secondary text-sm">
                Check cannabis laws in your state
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
