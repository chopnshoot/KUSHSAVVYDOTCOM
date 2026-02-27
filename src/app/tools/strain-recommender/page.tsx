import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StrainRecommender from "@/components/tools/StrainRecommender";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TOOL_DEFINITIVE_ANSWERS, TOOL_HOWTO_SCHEMAS, TOOL_EXTRA_FAQS } from "@/lib/seo-data";

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
  ...(TOOL_EXTRA_FAQS["strain-recommender"] || []),
];

const howTo = TOOL_HOWTO_SCHEMAS["strain-recommender"];
const definitiveAnswer = TOOL_DEFINITIVE_ANSWERS["strain-recommender"];

export default function StrainRecommenderPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Strain Recommender" },
          ]}
        />

        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            What Strain Should You Try?
          </h1>
          {/* GEO: Definitive first-paragraph answer */}
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {definitiveAnswer.answer}
          </p>
          <p className="text-text-tertiary text-sm mt-3 max-w-2xl mx-auto">
            Answer 5 quick questions and our AI will recommend 3 strains
            perfectly matched to your preferences and experience level.
          </p>
        </div>

        <StrainRecommender />

        <RelatedTools currentSlug="strain-recommender" />

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
