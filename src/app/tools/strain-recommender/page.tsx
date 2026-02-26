import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StrainRecommender from "@/components/tools/StrainRecommender";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Strain Recommender — Find Your Perfect Cannabis Strain",
  description:
    "Take our AI-powered quiz to find the perfect cannabis strain for you. Answer 5 simple questions and get personalized strain recommendations based on your preferences.",
};

const faqs = [
  {
    question: "How does the strain recommender work?",
    answer:
      "Our AI-powered strain recommender analyzes your preferences — desired effects, experience level, consumption method, effects to avoid, and flavor preferences — to match you with 3 cannabis strains from our database. The recommendations are personalized to your specific needs.",
  },
  {
    question: "Are the strain recommendations accurate?",
    answer:
      "Our recommendations are based on widely documented strain profiles and effects. However, individual experiences with cannabis can vary based on factors like personal biochemistry, tolerance, and product quality. Use our recommendations as a starting point and consult with your local budtender for additional guidance.",
  },
  {
    question: "What if I do not like the recommended strains?",
    answer:
      "You can retake the quiz with different preferences to get new recommendations. You can also use our Strain Comparison tool to compare specific strains side by side, or search for strains on Leafly and Weedmaps.",
  },
  {
    question: "Do I need an account to use the recommender?",
    answer:
      "No account is needed. The strain recommender is completely free to use with no sign-up required.",
  },
  {
    question: "Can I use this for medical cannabis recommendations?",
    answer:
      "While our tool can help identify strains commonly associated with certain effects, it is not a substitute for medical advice. Always consult with a healthcare professional or qualified cannabis physician for medical cannabis recommendations.",
  },
];

export default function StrainRecommenderPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            What Strain Should You Try?
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Answer 5 quick questions and our AI will recommend 3 strains
            perfectly matched to your preferences and experience level.
          </p>
        </div>

        <StrainRecommender />

        {/* Related Tools */}
        <section className="mt-16 pt-12 border-t border-border">
          <h2 className="font-heading text-2xl mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/tools/edible-dosage-calculator"
              className="card p-6 block hover:shadow-md transition-shadow"
            >
              <h3 className="font-heading text-lg mb-1">
                Edible Dosage Calculator
              </h3>
              <p className="text-text-secondary text-sm">
                Calculate the right edible dose for your experience level
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
