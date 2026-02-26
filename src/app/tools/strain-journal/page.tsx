import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StrainJournal from "@/components/tools/StrainJournal";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Strain Journal — Track Your Cannabis Sessions",
  description:
    "Log and rate cannabis strains you have tried. Track effects, consumption methods, and notes to discover your preferences over time.",
};

const faqs = [
  {
    question: "Where is my journal data stored?",
    answer:
      "Your journal entries are stored locally in your browser using localStorage. This means your data stays private on your device and is never sent to our servers. However, clearing your browser data will erase your entries.",
  },
  {
    question: "Can I export my journal entries?",
    answer:
      "Currently the journal stores data locally in your browser. We are working on account-based storage and export features for a future update.",
  },
  {
    question: "Why should I keep a strain journal?",
    answer:
      "Keeping a journal helps you remember which strains you liked, what effects they produced, and what methods worked best. Over time, you will see patterns in your preferences that help you make better purchasing decisions.",
  },
];

export default function StrainJournalPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Strain Journal
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Log your sessions, rate strains, and track effects to build a
            personal database of what works best for you.
          </p>
        </div>

        <StrainJournal />

        <section className="mt-16 pt-12 border-t border-border">
          <h2 className="font-heading text-2xl mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/tools/strain-recommender" className="card p-6 block hover:shadow-md transition-shadow">
              <h3 className="font-heading text-lg mb-1">Strain Recommender</h3>
              <p className="text-text-secondary text-sm">Get AI-powered strain picks based on your preferences</p>
            </Link>
            <Link href="/tools/strain-compare" className="card p-6 block hover:shadow-md transition-shadow">
              <h3 className="font-heading text-lg mb-1">Strain Comparison</h3>
              <p className="text-text-secondary text-sm">Compare two strains before your next purchase</p>
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
