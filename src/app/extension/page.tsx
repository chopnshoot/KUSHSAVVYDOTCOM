import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KushSavvy Chrome Extension — AI Cannabis Insights While You Shop",
  description:
    "Get budtender-quality cannabis insights on Weedmaps, Leafly, and any dispensary menu. Free Chrome extension with AI-powered strain analysis, terpene breakdowns, and personal match scores.",
  openGraph: {
    title: "KushSavvy Chrome Extension — Your AI Budtender",
    description:
      "Install KushSavvy and get instant AI insights on any cannabis product you browse. Free, no signup required.",
  },
};

const FEATURES = [
  {
    emoji: "💡",
    title: "Effects Profile",
    desc: "Plain-English description of what this strain actually does — not copied from the label.",
  },
  {
    emoji: "🌿",
    title: "Terpene Breakdown",
    desc: "What each terpene does in this specific combination. The science behind the experience.",
  },
  {
    emoji: "📏",
    title: "Dosing Guide",
    desc: "Tailored guidance for your experience level. Beginners, regular users, and experienced consumers.",
  },
  {
    emoji: "🎯",
    title: "Personal Match Score",
    desc: "See how well a strain matches your preferences. Gets smarter with every product you view.",
  },
  {
    emoji: "✅",
    title: "Trust Signal",
    desc: "Flags suspiciously high THC claims. 70% of cannabis products misrepresent potency — we catch it.",
  },
  {
    emoji: "🔬",
    title: "COA Interpreter",
    desc: "Drop a lab report link and get a plain-English translation. Know what you're actually buying.",
  },
];

const STEPS = [
  { num: "1", title: "Install", desc: "One click from the Chrome Web Store. Free, no credit card." },
  {
    num: "2",
    title: "Quick Setup",
    desc: "4 screens: experience level, desired effects, THC sensitivity, product types. 60 seconds.",
  },
  {
    num: "3",
    title: "Browse",
    desc: "Go to any Weedmaps or Leafly page. Click a product. The insight panel opens automatically.",
  },
  {
    num: "4",
    title: "Shop Smarter",
    desc: "Effects, terpenes, dosing, your personal match score — all in seconds.",
  },
];

export default function ExtensionPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-primary font-bold text-lg">
            🌿 KushSavvy
          </Link>
          <nav className="flex gap-6 text-sm text-text-secondary">
            <Link href="/tools" className="hover:text-primary">Tools</Link>
            <Link href="/learn" className="hover:text-primary">Learn</Link>
            <Link href="/extension/privacy" className="hover:text-primary">Privacy</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-green-50 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Free Chrome Extension · No Account Required
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text-primary mb-5 leading-tight">
            Your AI Budtender,<br />Everywhere You Shop
          </h1>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed max-w-xl mx-auto">
            Get instant cannabis insights on Weedmaps, Leafly, and any dispensary menu.
            Effects, terpenes, dosing, and your personal match score — in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://chrome.google.com/webstore/detail/kushsavvy"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-8 py-3 rounded-xl"
            >
              Add to Chrome — It&rsquo;s Free
            </a>
            <Link
              href="#how-it-works"
              className="btn-secondary text-base px-8 py-3 rounded-xl"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-sm text-text-tertiary mt-4">
            For adults 21+ in legal markets.{" "}
            <Link href="/extension/privacy" className="text-primary hover:underline">
              Privacy policy
            </Link>
          </p>
        </div>
      </section>

      {/* Problem statement */}
      <section className="py-14 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-text-secondary text-base leading-relaxed">
            <strong className="text-text-primary">61% of cannabis shoppers</strong> browse menus online before visiting a dispensary.
            But those menus give you strain name, THC percentage, and price.
            Not what it does to you. Not whether it matches what you&rsquo;re looking for.
            Not whether the lab results check out.
          </p>
          <p className="text-text-secondary text-base leading-relaxed mt-4">
            <strong className="text-text-primary">KushSavvy fills that gap.</strong> Every product you browse gets
            instant AI analysis — the kind of insight a great budtender gives you,
            available everywhere cannabis is sold online.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-text-primary text-center mb-10">
            What You Get On Every Product
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:border-green-200 transition-colors"
              >
                <div className="text-2xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 px-6 bg-green-50 border-y border-green-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-text-primary text-center mb-10">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  {step.num}
                </div>
                <h3 className="font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy promise */}
      <section className="py-14 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-3xl mb-4">🔒</div>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
            Privacy First
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            KushSavvy only reads product info from dispensary sites you visit.
            We never see your general browsing, never capture your IP address,
            and never touch any non-cannabis site.
            Your preferences are stored locally on your device — no account required.
          </p>
          <Link
            href="/extension/privacy"
            className="text-primary font-semibold hover:underline text-sm"
          >
            Read the full privacy policy →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-primary text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Better cannabis decisions start here
          </h2>
          <p className="text-green-100 mb-8">
            Free forever. Works instantly. No account required to start.
          </p>
          <a
            href="https://chrome.google.com/webstore/detail/kushsavvy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors"
          >
            Add to Chrome — Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
          <p>© 2026 KushSavvy. Cannabis insights for legal adult use.</p>
          <div className="flex gap-6">
            <Link href="/tools" className="hover:text-primary">Tools</Link>
            <Link href="/learn" className="hover:text-primary">Learn</Link>
            <Link href="/extension/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/" className="hover:text-primary">Home</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
