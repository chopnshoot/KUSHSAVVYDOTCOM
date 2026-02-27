import { getResult } from "@/lib/results";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResultExpired from "@/components/ResultExpired";
import ToolCTA from "@/components/ToolCTA";
import ShareBar from "@/components/ShareBar";
import Breadcrumbs from "@/components/Breadcrumbs";

interface PageProps {
  params: Promise<{ toolSlug: string; hash: string }>;
}

const VALID_TOOLS = [
  "strain-recommender",
  "strain-compare",
  "cbd-vs-thc",
  "tolerance-break-planner",
  "grow-timeline",
  "terpene-guide",
];

const TOOL_NAMES: Record<string, string> = {
  "strain-recommender": "Strain Recommender",
  "strain-compare": "Strain Comparison",
  "cbd-vs-thc": "CBD vs THC",
  "tolerance-break-planner": "Tolerance Break Planner",
  "grow-timeline": "Grow Timeline",
  "terpene-guide": "Terpene Guide",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { toolSlug, hash } = await params;
  const result = await getResult(toolSlug, hash);

  if (!result) {
    return { title: "Result Not Found | KushSavvy" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kushsavvy.com";

  return {
    title: result.meta.title,
    description: result.meta.description,
    openGraph: {
      title: result.meta.title,
      description: result.meta.description,
      url: `${baseUrl}/tools/${toolSlug}/r/${hash}`,
      siteName: "KushSavvy",
      type: "article",
      images: [
        {
          url: `${baseUrl}/api/og/${toolSlug}/${hash}`,
          width: 1200,
          height: 630,
          alt: result.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: result.meta.title,
      description: result.meta.description,
      images: [`${baseUrl}/api/og/${toolSlug}/${hash}`],
    },
  };
}

function RecommenderResult({ data }: { data: { recommendations: Array<{ name: string; type: string; ratio: string; thc_range: string; cbd_range: string; terpenes: string[]; effects: string[]; flavors: string[]; best_for: string; description: string; why_for_you: string }> } }) {
  const recs = Array.isArray(data?.recommendations) ? data.recommendations : [];
  if (recs.length === 0) return <p className="text-center text-text-secondary">No recommendations found in this result.</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl md:text-3xl text-center mb-8">Personalized Strain Recommendations</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recs.map((rec, i) => (
          <div key={i} className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-heading text-xl mb-1">{rec.name}</h3>
            <span className="text-xs text-text-tertiary font-mono">{rec.type} {rec.ratio && `| ${rec.ratio}`}</span>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-tertiary">THC</span><span className="font-mono font-semibold">{rec.thc_range}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">CBD</span><span className="font-mono font-semibold">{rec.cbd_range}</span></div>
            </div>
            {Array.isArray(rec.effects) && <div className="flex flex-wrap gap-1 mt-3">{rec.effects.map(e => <span key={e} className="tag text-xs">{e}</span>)}</div>}
            {Array.isArray(rec.terpenes) && <div className="flex flex-wrap gap-1 mt-2">{rec.terpenes.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-accent-green/20 bg-accent-green/5 text-accent-green font-mono">{t}</span>)}</div>}
            <p className="text-text-secondary text-sm mt-3">{rec.description}</p>
            <p className="text-accent-green text-sm mt-2 font-medium">{rec.why_for_you}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareResult({ data }: { data: { strain1: { name: string; type: string; thc_range: string; cbd_range: string; effects: string[]; terpenes: string[]; bestFor: string }; strain2: { name: string; type: string; thc_range: string; cbd_range: string; effects: string[]; terpenes: string[]; bestFor: string }; comparison: string; verdict: string } }) {
  return (
    <div className="space-y-8">
      <h2 className="font-heading text-2xl md:text-3xl text-center">{data.strain1.name} vs {data.strain2.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[data.strain1, data.strain2].map((s, i) => (
          <div key={i} className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-heading text-xl mb-2">{s.name}</h3>
            <span className="text-xs text-text-tertiary">{s.type}</span>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-tertiary">THC</span><span className="font-mono font-semibold">{s.thc_range}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">CBD</span><span className="font-mono font-semibold">{s.cbd_range}</span></div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">{s.effects.map(e => <span key={e} className="tag text-xs">{e}</span>)}</div>
            <p className="text-text-secondary text-sm mt-3"><span className="font-medium">Best for:</span> {s.bestFor}</p>
          </div>
        ))}
      </div>
      <div className="tool-container">
        <h3 className="font-heading text-xl mb-4">AI Comparison</h3>
        <div className="text-text-secondary leading-relaxed">{data.comparison.split("\n").map((p, i) => <p key={i} className="mb-3">{p}</p>)}</div>
        <div className="mt-4 p-4 rounded-lg bg-accent-green/5 border border-accent-green/20">
          <p className="font-heading text-sm font-semibold text-accent-green mb-1">Verdict</p>
          <p className="text-text-primary text-sm">{data.verdict}</p>
        </div>
      </div>
    </div>
  );
}

function GenericResult({ data, toolSlug }: { data: Record<string, unknown>; toolSlug: string }) {
  const title = (data.plan_title || data.title || data.recommendation || data.name || TOOL_NAMES[toolSlug]) as string;
  const summary = (data.summary || data.description || "") as string;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-heading text-2xl md:text-3xl mb-2">{title}</h2>
        {summary && <p className="text-text-secondary leading-relaxed max-w-2xl mx-auto">{summary}</p>}
      </div>
      <div className="tool-container">
        <pre className="text-sm text-text-secondary whitespace-pre-wrap font-body leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default async function ResultPage({ params }: PageProps) {
  const { toolSlug, hash } = await params;

  if (!VALID_TOOLS.includes(toolSlug)) {
    notFound();
  }

  const result = await getResult(toolSlug, hash);

  if (!result) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <ResultExpired toolSlug={toolSlug} />
        </main>
        <Footer />
      </>
    );
  }

  const parsed = JSON.parse(result.output);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kushsavvy.com";

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: TOOL_NAMES[toolSlug] || toolSlug, href: `/tools/${toolSlug}` },
            { label: "Shared Result" },
          ]}
        />

        {toolSlug === "strain-recommender" && <RecommenderResult data={parsed} />}
        {toolSlug === "strain-compare" && <CompareResult data={parsed} />}
        {!["strain-recommender", "strain-compare"].includes(toolSlug) && (
          <GenericResult data={parsed} toolSlug={toolSlug} />
        )}

        <ShareBar
          url={`/tools/${toolSlug}/r/${hash}`}
          text={result.meta.shareText}
        />

        <ToolCTA toolSlug={toolSlug} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: result.meta.title,
              description: result.meta.description,
              datePublished: result.createdAt,
              author: { "@type": "Organization", name: "KushSavvy" },
              publisher: {
                "@type": "Organization",
                name: "KushSavvy",
                url: baseUrl,
              },
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
