import Link from "next/link";

const TOOL_NAMES: Record<string, string> = {
  "strain-recommender": "Strain Recommender",
  "strain-compare": "Strain Comparison",
  "cbd-vs-thc": "CBD vs THC",
  "tolerance-break-planner": "Tolerance Break Planner",
  "grow-timeline": "Grow Timeline",
  "terpene-guide": "Terpene Guide",
};

export default function ResultExpired({ toolSlug }: { toolSlug: string }) {
  return (
    <div className="text-center py-20">
      <h1 className="font-heading text-2xl md:text-3xl mb-4">
        This result has expired
      </h1>
      <p className="text-text-secondary mb-8">
        Shared results are available for 90 days.
      </p>
      <Link
        href={`/tools/${toolSlug}`}
        className="inline-block bg-accent-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent-green-light transition"
      >
        Try the {TOOL_NAMES[toolSlug] || "Tool"} Yourself
      </Link>
    </div>
  );
}
