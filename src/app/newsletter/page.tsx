import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

export const metadata: Metadata = {
  title: "Newsletter — Weekly Cannabis Insights & Strain Picks",
  description:
    "Subscribe to the KushSavvy newsletter for weekly strain recommendations, cannabis news, and educational content delivered to your inbox.",
};

export default function NewsletterPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-16 md:py-28">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-5xl mb-6">
            Stay in the Know
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            Join thousands of cannabis enthusiasts who get our weekly newsletter.
            Every week you will receive strain of the week picks, new tool updates,
            educational articles, and curated product recommendations.
          </p>
        </div>

        <div className="bg-tool-bg rounded-2xl p-8 md:p-12">
          <NewsletterSignup />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-heading text-lg mb-1">Weekly Picks</p>
            <p className="text-text-secondary text-sm">
              Curated strain recommendations every week
            </p>
          </div>
          <div>
            <p className="font-heading text-lg mb-1">Free Forever</p>
            <p className="text-text-secondary text-sm">
              No spam, no cost, unsubscribe anytime
            </p>
          </div>
          <div>
            <p className="font-heading text-lg mb-1">Exclusive Content</p>
            <p className="text-text-secondary text-sm">
              Guides and tips not published on the site
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
