import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToolCard from "@/components/ui/ToolCard";
import { tools } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Cannabis Tools — Free Calculators & Guides",
  description:
    "Free AI-powered cannabis tools: strain recommender, edible dosage calculator, legality checker, terpene guide, and more.",
};

export default function ToolsPage() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="section-heading mb-4">Cannabis Tools</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Free interactive tools to help you make informed cannabis
            decisions. From AI-powered strain recommendations to dosage
            calculators and legality checkers.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.slug}
              slug={tool.slug}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              available={tool.available}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
