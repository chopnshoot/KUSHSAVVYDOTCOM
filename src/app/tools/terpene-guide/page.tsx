import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TerpeneGuide from "@/components/tools/TerpeneGuide";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TOOL_DEFINITIVE_ANSWERS, TOOL_EXTRA_FAQS } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Terpene Guide — Cannabis Terpenes Explained",
  description:
    "Explore cannabis terpenes and learn how they affect your experience. Discover the aromas, effects, and strains associated with each terpene.",
};

const faqs = [
  {
    question: "What are terpenes?",
    answer:
      "Terpenes are aromatic compounds found in cannabis (and many other plants) that give each strain its unique smell and flavor. They also influence the effects you feel, working alongside cannabinoids like THC and CBD in what scientists call the entourage effect.",
  },
  {
    question: "Do terpenes get you high?",
    answer:
      "Terpenes alone do not produce a psychoactive high. However, they modulate and shape your cannabis experience by influencing how cannabinoids interact with your body. For example, myrcene can enhance sedation while limonene may boost mood.",
  },
  {
    question: "How do I use terpene info when choosing a strain?",
    answer:
      "Look at a strain's dominant terpenes to predict its effects. If you want relaxation, look for myrcene-dominant strains. For energy and uplift, seek limonene or terpinolene. This is often more reliable than just looking at Indica vs Sativa labels.",
  },
  {
    question: "Can terpenes be found outside of cannabis?",
    answer:
      "Absolutely! Terpenes are found throughout nature. Limonene is in citrus fruits, pinene is in pine trees, linalool is in lavender, and caryophyllene is in black pepper. Cannabis just happens to produce them in high concentrations.",
  },
  ...(TOOL_EXTRA_FAQS["terpene-guide"] || []),
];

const definitiveAnswer = TOOL_DEFINITIVE_ANSWERS["terpene-guide"];

export default function TerpeneGuidePage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Terpene Guide" },
          ]}
        />

        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Terpene Guide
          </h1>
          {/* GEO: Definitive first-paragraph answer */}
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {definitiveAnswer.answer}
          </p>
          <p className="text-text-tertiary text-sm mt-3 max-w-2xl mx-auto">
            Explore each terpene to understand its effects, aromas, and which
            strains are rich in it.
          </p>
        </div>

        <TerpeneGuide />

        <RelatedTools currentSlug="terpene-guide" />

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
