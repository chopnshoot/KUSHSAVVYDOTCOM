import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — KushSavvy Chrome Extension",
  description:
    "KushSavvy extension privacy policy. We collect the minimum data needed to serve you, disclose everything in plain English, and never track your general browsing.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "February 27, 2026";

export default function ExtensionPrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-primary font-bold text-lg">
            🌿 KushSavvy
          </Link>
          <Link href="/extension" className="text-sm text-text-secondary hover:text-primary">
            ← Back to Extension
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <div className="inline-block bg-green-50 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Chrome Extension
          </div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-3">
            Privacy Policy
          </h1>
          <p className="text-text-secondary text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* TL;DR Box */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-10">
          <h2 className="font-bold text-primary text-lg mb-3">TL;DR — The Short Version</h2>
          <ul className="space-y-2 text-sm text-text-primary">
            <li>✅ We only read product info from dispensary sites you visit</li>
            <li>✅ We never touch your general browsing history</li>
            <li>✅ We never capture your IP address</li>
            <li>✅ We never read your email, banking, or any non-cannabis site</li>
            <li>✅ All product data collection can be toggled off in Settings</li>
            <li>✅ No account required — preferences stored locally on your device</li>
          </ul>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-text-primary">
          {/* What we collect */}
          <Section title="What KushSavvy Collects">
            <SubSection title="Always on (cannot be disabled)">
              <ul>
                <li>
                  <strong>Installation ID</strong> — A random ID generated when you install the
                  extension (format: <code>ks_abc123xyz</code>). Not tied to your identity. Used
                  only for rate limiting (to prevent abuse) and aggregated usage metrics.
                </li>
                <li>
                  <strong>Extension version and browser info</strong> — Used for debugging when
                  something breaks.
                </li>
                <li>
                  <strong>Aggregate usage metrics</strong> — Total number of insights served across
                  all users. Not per-user, not tied to any identity.
                </li>
              </ul>
            </SubSection>

            <SubSection title="Default ON — you can disable this in Settings">
              <p>
                When you view a product on a supported dispensary site (Weedmaps, Leafly, Dutchie-powered
                sites), KushSavvy reads the following from the page:
              </p>
              <ul>
                <li>Product name (e.g., &ldquo;Blue Dream&rdquo;)</li>
                <li>THC and CBD percentages as listed on the menu</li>
                <li>Product category (flower, edible, vape, etc.)</li>
                <li>Terpene profile if listed</li>
                <li>Dispensary name</li>
              </ul>
              <p>This data is sent to our servers to generate AI insights. Specifically:</p>
              <ul>
                <li>
                  <strong>We do NOT capture the full page URL</strong> — only the extracted product
                  fields above.
                </li>
                <li>
                  <strong>We do NOT capture your IP address</strong> — it is stripped at our edge
                  network (Vercel) before reaching our servers.
                </li>
                <li>
                  <strong>We do NOT capture anything from non-dispensary pages</strong> — the
                  content script only activates on matched dispensary domains.
                </li>
                <li>
                  This data is used to generate and cache AI insights. Cached insights help us
                  serve faster responses when other users look up the same strain.
                </li>
              </ul>
            </SubSection>

            <SubSection title="Account holders only (explicit opt-in)">
              <p>
                If you create a free KushSavvy account (just an email address), we additionally
                store:
              </p>
              <ul>
                <li>Your email address (for account management and optional newsletter)</li>
                <li>
                  Your preference profile (experience level, desired effects, THC sensitivity,
                  product types) — encrypted at rest in our database
                </li>
                <li>COA analysis history (so you can review past lab report analyses)</li>
              </ul>
            </SubSection>
          </Section>

          {/* What we NEVER collect */}
          <Section title="What KushSavvy Never Collects">
            <ul>
              <li>Your general browsing history — the extension only activates on dispensary sites</li>
              <li>Content from non-cannabis websites (no email, banking, social media, news, etc.)</li>
              <li>Your purchase history or cart contents</li>
              <li>GPS location or precise geolocation</li>
              <li>IP addresses (stripped at edge before reaching servers)</li>
              <li>Social media accounts or profiles</li>
              <li>Any data from websites not in our permitted list</li>
            </ul>
          </Section>

          {/* Technical permissions */}
          <Section title="Chrome Permissions Explained">
            <p>
              KushSavvy requests exactly the permissions it needs — nothing more. Here&rsquo;s what
              each permission does:
            </p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold">Permission</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">Why we need it</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["storage", "Store your preferences and cached insights locally on your device"],
                  ["sidePanel", "Show the insight panel alongside dispensary menus"],
                  [
                    "contextMenus",
                    "Add the \"Look up on KushSavvy\" right-click option for selected text",
                  ],
                  [
                    "Host: *.weedmaps.com, *.leafly.com",
                    "Read product data from these dispensary sites only",
                  ],
                ].map(([perm, reason]) => (
                  <tr key={perm}>
                    <td className="p-3 border border-gray-200 font-mono text-xs">{perm}</td>
                    <td className="p-3 border border-gray-200">{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-text-secondary mt-3">
              We do not request <code>&lt;all_urls&gt;</code> (access to all websites),{" "}
              <code>webRequest</code> (intercept network traffic), or <code>tabs</code> permission
              (access to your open tabs). Our access is limited to what&rsquo;s needed.
            </p>
          </Section>

          {/* Data sharing */}
          <Section title="Who We Share Data With">
            <p>We share product data (strain name, category, potency) with:</p>
            <ul>
              <li>
                <strong>OpenAI</strong> — for generating strain insights (Tier 1, ~90% of calls).
                OpenAI&rsquo;s data is processed per their{" "}
                <a href="https://openai.com/enterprise-privacy" target="_blank" rel="noopener noreferrer">
                  enterprise privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Anthropic (Claude)</strong> — for COA analysis and complex parsing (Tier 2,
                ~10% of calls). Processed per Anthropic&rsquo;s{" "}
                <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">
                  privacy policy
                </a>
                .
              </li>
            </ul>
            <p>We do not sell data to third parties. We do not share data with advertisers.</p>
            <p>
              Brand partners see aggregate impression data (e.g., &ldquo;1,200 users viewed Blue Dream
              this week&rdquo;) — never individual user data.
            </p>
          </Section>

          {/* Data storage */}
          <Section title="Where Your Data Lives">
            <ul>
              <li>
                <strong>Your device</strong> — Preferences, cached insights, and your installation
                ID are stored in Chrome&rsquo;s local storage (chrome.storage.local). This data never
                leaves your device unless you create an account.
              </li>
              <li>
                <strong>Our servers (Vercel / Upstash Redis)</strong> — Cached AI insights for
                popular strains (no PII, just strain analysis). Retained for 24 hours.
              </li>
              <li>
                <strong>Our database (Supabase)</strong> — Account data for users who create a free
                account. Encrypted at rest. Hosted in the US.
              </li>
            </ul>
          </Section>

          {/* Your controls */}
          <Section title="Your Controls">
            <ul>
              <li>
                <strong>Disable product data collection</strong> — Go to Extension Settings → toggle
                off &ldquo;Help improve KushSavvy&rdquo;. Insights will still work; strain data won&rsquo;t
                contribute to our cache.
              </li>
              <li>
                <strong>Clear local data</strong> — Extension Settings → &ldquo;Clear all data&rdquo;.
                Removes preferences, installation ID, and cached insights from your device.
              </li>
              <li>
                <strong>Delete your account</strong> — Email privacy@kushsavvy.com with subject
                &ldquo;Delete my account&rdquo;. We&rsquo;ll remove all server-side data within 30 days.
              </li>
              <li>
                <strong>Uninstall</strong> — Uninstalling the extension removes all locally stored
                data automatically.
              </li>
            </ul>
          </Section>

          {/* Children */}
          <Section title="Age Requirement">
            <p>
              KushSavvy is intended for adults 21 and older. We require date-of-birth verification
              on install. If you are under 21, please do not use this extension.
            </p>
          </Section>

          {/* Contact */}
          <Section title="Contact">
            <p>
              Questions about this policy or your data? Email{" "}
              <a href="mailto:privacy@kushsavvy.com">privacy@kushsavvy.com</a>.
            </p>
            <p>
              To report a privacy concern, use the same address with subject line &ldquo;Privacy
              Concern&rdquo;. We respond within 5 business days.
            </p>
          </Section>

          {/* Changes */}
          <Section title="Changes to This Policy">
            <p>
              If we make material changes (adding new data collection, changing how we use data), we
              will notify users via the extension with a banner notification before the changes take
              effect. Minor changes (clarifications, formatting) will be reflected in the
              &ldquo;Last updated&rdquo; date above.
            </p>
          </Section>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 mt-12">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
          <p>© 2026 KushSavvy. Cannabis insights for legal adult use.</p>
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-primary">
              Site Terms
            </Link>
            <Link href="/extension" className="hover:text-primary">
              Extension
            </Link>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4 border-b border-gray-100 pb-2">
        {title}
      </h2>
      <div className="space-y-3 text-text-primary leading-relaxed">{children}</div>
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-text-primary mb-2 text-sm uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}
