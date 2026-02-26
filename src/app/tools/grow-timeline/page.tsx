import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GrowTimeline from "@/components/tools/GrowTimeline";
import RelatedTools from "@/components/RelatedTools";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TOOL_DEFINITIVE_ANSWERS, TOOL_HOWTO_SCHEMAS, TOOL_EXTRA_FAQS } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Grow Timeline Planner — Seed to Harvest Schedule",
  description:
    "Plan your cannabis grow with a personalized timeline from seed to harvest. Get phase-by-phase guidance, supply lists, and pro tips for your setup.",
};

const faqs = [
  {
    question: "How long does it take to grow cannabis?",
    answer:
      "Most grows take 3-5 months from seed to harvest. Autoflower strains are fastest at 8-12 weeks. Photoperiod indicas typically take 12-16 weeks, while sativas can take 14-20 weeks. Indoor grows tend to be faster since you control the light cycle.",
  },
  {
    question: "Is it legal to grow cannabis at home?",
    answer:
      "Home growing laws vary by state. Many legal states allow 4-6 plants per household. Check our Is It Legal tool for your state's specific home grow regulations before starting.",
  },
  {
    question: "What is the cheapest way to start growing?",
    answer:
      "A basic indoor setup with a grow tent, LED light, pots, soil, and nutrients can start around $200-400. Outdoor growing is even cheaper if you have suitable climate and a private space. The cost per gram drops significantly after your first harvest.",
  },
  {
    question: "Which growing method is best for beginners?",
    answer:
      "Soil growing is the most forgiving for beginners. It buffers pH fluctuations and nutrient mistakes better than hydro or coco. Pair it with an autoflower strain for the easiest first grow — no need to worry about light schedules.",
  },
  ...(TOOL_EXTRA_FAQS["grow-timeline"] || []),
];

const howTo = TOOL_HOWTO_SCHEMAS["grow-timeline"];
const definitiveAnswer = TOOL_DEFINITIVE_ANSWERS["grow-timeline"];

export default function GrowTimelinePage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Grow Timeline" },
          ]}
        />

        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-4">
            Grow Timeline Planner
          </h1>
          {/* GEO: Definitive first-paragraph answer */}
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {definitiveAnswer.answer}
          </p>
          <p className="text-text-tertiary text-sm mt-3 max-w-2xl mx-auto">
            Tell us about your setup and get an AI-generated grow timeline with
            phase-by-phase tasks, supply lists, and pro tips.
          </p>
        </div>

        <GrowTimeline />

        <RelatedTools currentSlug="grow-timeline" />

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
