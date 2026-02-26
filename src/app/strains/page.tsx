import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StrainCard from "@/components/ui/StrainCard";
import { seedStrains } from "@/lib/seed-strains";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cannabis Strain Directory — Browse 50+ Popular Strains",
  description:
    "Browse our comprehensive cannabis strain directory. Find detailed profiles with THC levels, terpenes, effects, and flavors for the most popular strains.",
};

export default function StrainsPage() {
  const strainsByType = {
    all: seedStrains,
    indica: seedStrains.filter((s) => s.type === "Indica"),
    sativa: seedStrains.filter((s) => s.type === "Sativa"),
    hybrid: seedStrains.filter((s) => s.type === "Hybrid"),
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="section-heading mb-4">Cannabis Strain Directory</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Explore detailed profiles for the most popular cannabis strains.
            Filter by type to find your perfect match.
          </p>
        </div>

        {/* Type Filter Links */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <span className="tag tag-indica font-medium">
            {strainsByType.indica.length} Indica
          </span>
          <span className="tag tag-sativa font-medium">
            {strainsByType.sativa.length} Sativa
          </span>
          <span className="tag tag-hybrid font-medium">
            {strainsByType.hybrid.length} Hybrid
          </span>
        </div>

        {/* CTA */}
        <div className="bg-accent-green/5 rounded-2xl p-6 text-center mb-12 border border-accent-green/20">
          <p className="text-text-secondary mb-3">
            Not sure which strain is right for you?
          </p>
          <Link href="/tools/strain-recommender" className="btn-primary">
            Take the Strain Quiz
          </Link>
        </div>

        {/* All Strains Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {seedStrains.map((strain) => (
            <StrainCard
              key={strain.name}
              name={strain.name}
              slug={strain.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              type={strain.type}
              thcMin={strain.thcMin}
              thcMax={strain.thcMax}
              effects={strain.effects.slice(0, 3)}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
