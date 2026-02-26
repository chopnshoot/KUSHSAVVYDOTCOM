import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { seedStateLaws } from "@/lib/seed-states";

export const metadata: Metadata = {
  title: "Cannabis Laws by State — Is Marijuana Legal in Your State?",
  description:
    "Complete guide to cannabis laws in all 50 US states. Check if marijuana is legal, medical-only, decriminalized, or illegal in your state.",
};

const statusColors: Record<string, string> = {
  "Fully Legal": "bg-green-100 text-green-800",
  "Medical Only": "bg-yellow-100 text-yellow-800",
  Decriminalized: "bg-orange-100 text-orange-800",
  Illegal: "bg-red-100 text-red-800",
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function LegalPage() {
  const grouped = {
    "Fully Legal": seedStateLaws.filter((s) => s.legalStatus === "Fully Legal"),
    "Medical Only": seedStateLaws.filter((s) => s.legalStatus === "Medical Only"),
    Decriminalized: seedStateLaws.filter((s) => s.legalStatus === "Decriminalized"),
    Illegal: seedStateLaws.filter((s) => s.legalStatus === "Illegal"),
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="section-heading mb-4">
            Cannabis Laws by State
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Comprehensive guide to cannabis legality across all 50 US states.
            Updated for 2026.
          </p>
        </div>

        {/* Quick Tool CTA */}
        <div className="bg-tool-bg rounded-2xl p-6 text-center mb-12">
          <p className="text-text-secondary mb-3">
            Want a quick answer? Use our interactive checker.
          </p>
          <Link href="/tools/is-it-legal" className="btn-primary">
            Check Your State
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.entries(grouped).map(([status, states]) => (
            <div key={status} className="card p-5 text-center">
              <p className="font-mono text-3xl font-bold text-text-primary mb-1">
                {states.length}
              </p>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                {status}
              </span>
            </div>
          ))}
        </div>

        {/* State Lists by Category */}
        {Object.entries(grouped).map(([status, states]) => (
          <section key={status} className="mb-12">
            <h2 className="font-heading text-2xl mb-4 flex items-center gap-3">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                {status}
              </span>
              <span className="text-text-tertiary text-base font-body">
                ({states.length} states)
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {states.map((state) => (
                <Link
                  key={state.abbreviation}
                  href={`/legal/${slugify(state.state)}`}
                  className="card p-4 hover:shadow-md transition-shadow flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold">{state.state}</span>
                    <span className="text-text-tertiary ml-2 text-sm">
                      {state.abbreviation}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
