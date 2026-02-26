import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "KushSavvy terms of service — rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <h1 className="font-heading text-3xl md:text-5xl mb-6">Terms of Service</h1>
        <p className="text-text-tertiary mb-8">Last updated: January 1, 2026</p>

        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Acceptance of Terms</h2>
            <p>
              By accessing and using KushSavvy (kushsavvy.com), you agree to be bound
              by these Terms of Service. If you do not agree, please do not use our
              platform.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Educational Purpose</h2>
            <p>
              KushSavvy is an educational resource providing information about cannabis.
              We do not sell, distribute, or facilitate the purchase of cannabis or
              cannabis products. All content, tools, and recommendations are for
              informational and educational purposes only.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Not Medical Advice</h2>
            <p>
              Nothing on KushSavvy constitutes medical advice. Our tools, including
              the Strain Recommender and Dosage Calculator, provide general guidance
              based on commonly available information. Always consult with a qualified
              healthcare professional before using cannabis for medical purposes.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Age Requirement</h2>
            <p>
              You must be at least 21 years old to use KushSavvy. By using our
              platform, you confirm that you meet this age requirement.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Legal Compliance</h2>
            <p>
              You are responsible for understanding and complying with all applicable
              laws regarding cannabis in your jurisdiction. While we provide legal
              information through our Is It Legal tool, this information is for
              reference only and may not reflect the most current laws. Always verify
              with official sources.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Accuracy of Information</h2>
            <p>
              We strive to provide accurate and up-to-date information, but we make
              no warranties about the completeness, reliability, or accuracy of our
              content. Strain information, legal data, and dosage guidelines may vary
              and should be verified independently.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Limitation of Liability</h2>
            <p>
              KushSavvy and its operators are not liable for any damages arising from
              your use of our platform, tools, or content. You use our services at
              your own risk.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Intellectual Property</h2>
            <p>
              All content on KushSavvy, including text, graphics, tools, and
              software, is owned by KushSavvy and protected by applicable intellectual
              property laws. You may not reproduce, distribute, or create derivative
              works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Contact</h2>
            <p>
              For questions about these terms, contact us at legal@kushsavvy.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
