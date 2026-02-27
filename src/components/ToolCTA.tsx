import Link from "next/link";

const TOOL_CTA_TEXT: Record<string, string> = {
  "strain-recommender": "Want your own personalized strain recommendation?",
  "strain-compare": "Want to compare your own strains?",
  "cbd-vs-thc": "Not sure if CBD or THC is right for you?",
  "tolerance-break-planner": "Need your own tolerance break plan?",
  "grow-timeline": "Planning your own grow?",
  "terpene-guide": "Want to explore terpene profiles?",
};

export default function ToolCTA({ toolSlug }: { toolSlug: string }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 mt-8 text-center">
      <p className="font-heading text-lg mb-2">
        {TOOL_CTA_TEXT[toolSlug] || "Want your own result?"}
      </p>
      <p className="text-text-secondary text-sm mb-4">
        Get a personalized result in under 30 seconds — free, no signup
        required.
      </p>
      <Link
        href={`/tools/${toolSlug}`}
        className="inline-block bg-accent-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent-green-light transition"
      >
        Try It Free
      </Link>
    </div>
  );
}
