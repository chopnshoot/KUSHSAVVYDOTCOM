import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "KushSavvy privacy policy — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <h1 className="font-heading text-3xl md:text-5xl mb-6">Privacy Policy</h1>
        <p className="text-text-tertiary mb-8">Last updated: January 1, 2026</p>

        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Information We Collect</h2>
            <p>
              When you use KushSavvy, we may collect information you provide directly,
              such as your email address when you subscribe to our newsletter. We also
              collect usage data through analytics services to understand how visitors
              use our site and tools.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Send newsletter communications (if you subscribe)</li>
              <li>Improve our tools and content based on usage patterns</li>
              <li>Analyze site traffic and performance</li>
              <li>Respond to your inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Tool Data</h2>
            <p>
              When you use our interactive tools (Strain Recommender, Dosage Calculator,
              etc.), the information you input is processed to generate results. Quiz
              answers sent to our AI recommendation engine are not stored or linked to
              your identity. Dosage calculations are performed entirely in your browser
              and are never sent to our servers.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Cookies and Analytics</h2>
            <p>
              We use cookies and similar technologies to analyze traffic and usage
              patterns. We may use Google Analytics and PostHog for this purpose.
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Third-Party Services</h2>
            <p>
              We may use third-party services for analytics, email delivery, and
              advertising. These services have their own privacy policies. We may
              display ads through networks like Google AdSense or Mediavine, which
              may use cookies for ad personalization.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information.
              However, no method of transmission over the internet is 100% secure,
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal
              information by contacting us. You can unsubscribe from our newsletter
              at any time using the link in any email.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-text-primary mb-3">Contact</h2>
            <p>
              For privacy-related questions, contact us at privacy@kushsavvy.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
