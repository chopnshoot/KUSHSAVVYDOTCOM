import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CbdVsThc from "@/components/tools/CbdVsThc";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TOOL_DEFINITIVE_ANSWERS, TOOL_EXTRA_FAQS } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "CBD vs THC — Which Cannabinoid Is Right for You?",
  description:
    "Take our quiz to find out whether CBD, THC, or a combination is best for your goals. Get personalized dosing suggestions and product recommendations.",
};

const faqs = [
  {
    question: "What is the difference between CBD and THC?",
    answer:
      "THC (tetrahydrocannabinol) is the psychoactive compound that produces the 'high' associated with cannabis. CBD (cannabidiol) is non-psychoactive and does not produce a high. Both interact with the endocannabinoid system but in different ways, producing different therapeutic effects.",
  },
  {
    question: "Will CBD show up on a drug test?",
    answer:
      "Pure CBD should not cause a positive drug test. However, full-spectrum CBD products contain trace amounts of THC (up to 0.3%) which could potentially trigger a positive result with heavy use. If drug testing is a concern, use CBD isolate or broad-spectrum products.",
  },
  {
    question: "Can I take CBD and THC together?",
    answer:
      "Yes, and many people find the combination more effective than either alone. This is known as the entourage effect. CBD can actually help moderate some of THC's side effects like anxiety and paranoia. Products with specific CBD:THC ratios are available at most dispensaries.",
  },
  {
    question: "Is CBD legal everywhere?",
    answer:
      "Hemp-derived CBD (containing less than 0.3% THC) is federally legal in the US under the 2018 Farm Bill. However, some states have additional restrictions. THC products are only legal in states with recreational or medical cannabis programs.",
  },
  ...(TOOL_EXTRA_FAQS["cbd-vs-thc"] || []),
];

const definitiveAnswer = TOOL_DEFINITIVE_ANSWERS["cbd-vs-thc"];

export default function CbdVsThcPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "CBD vs THC" },
          ]}
        />

        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            CBD vs THC
          </h1>
          {/* GEO: Definitive first-paragraph answer */}
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {definitiveAnswer.answer}
          </p>
          <p className="text-text-tertiary text-sm mt-3 max-w-2xl mx-auto">
            Not sure which cannabinoid is right for you? Answer a few questions
            and get a personalized recommendation with dosing guidance.
          </p>
        </div>

        <CbdVsThc />

        <RelatedTools currentSlug="cbd-vs-thc" />

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
