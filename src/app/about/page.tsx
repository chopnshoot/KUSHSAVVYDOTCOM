import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About KushSavvy",
  description:
    "KushSavvy is an AI-powered cannabis education platform with interactive tools, strain guides, and comprehensive cannabis information.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <h1 className="font-heading text-3xl md:text-5xl mb-6">About KushSavvy</h1>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>
            KushSavvy is an AI-powered cannabis education platform designed to help
            people make informed decisions about cannabis. We combine interactive
            tools, comprehensive strain data, and educational content to create the
            most useful cannabis resource on the web.
          </p>

          <h2 className="font-heading text-2xl text-text-primary mt-10">Our Mission</h2>
          <p>
            Cannabis legalization is expanding rapidly, and millions of people are
            exploring cannabis for the first time. We believe everyone deserves
            access to accurate, science-backed information to make informed
            decisions — whether you are choosing your first strain, calculating an
            edible dose, or understanding the laws in your state.
          </p>

          <h2 className="font-heading text-2xl text-text-primary mt-10">What We Offer</h2>
          <p>
            Our platform includes AI-powered tools like our{" "}
            <Link href="/tools/strain-recommender" className="text-accent-green hover:text-accent-green-light">
              Strain Recommender
            </Link>
            , which analyzes your preferences to suggest personalized strain
            matches, an{" "}
            <Link href="/tools/edible-dosage-calculator" className="text-accent-green hover:text-accent-green-light">
              Edible Dosage Calculator
            </Link>{" "}
            for safe dosing guidance, and a comprehensive{" "}
            <Link href="/tools/is-it-legal" className="text-accent-green hover:text-accent-green-light">
              state law checker
            </Link>{" "}
            covering all 50 states.
          </p>
          <p>
            Beyond tools, we maintain a{" "}
            <Link href="/strains" className="text-accent-green hover:text-accent-green-light">
              strain directory
            </Link>{" "}
            with detailed profiles of popular strains, and a{" "}
            <Link href="/learn" className="text-accent-green hover:text-accent-green-light">
              learning center
            </Link>{" "}
            with in-depth articles covering everything from terpene science to
            beginner guides.
          </p>

          <h2 className="font-heading text-2xl text-text-primary mt-10">Our Approach</h2>
          <p>
            We approach cannabis education with the same rigor and respect you would
            expect from any health and wellness resource. Our content is
            science-backed, our recommendations are data-driven, and our design is
            clean and professional. We are not a head shop — we are an educational
            platform.
          </p>

          <h2 className="font-heading text-2xl text-text-primary mt-10">Important Disclaimer</h2>
          <p>
            KushSavvy is an educational resource and does not sell cannabis products.
            Our tools and content are for informational purposes only and should not
            be considered medical advice. Always consult with a healthcare
            professional before using cannabis for medical purposes, and always
            comply with your local laws and regulations.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
