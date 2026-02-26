import type { StrainRecommendation } from "@/lib/types";

const typeBorderColors: Record<StrainRecommendation["type"], string> = {
  Indica: "border-l-indica",
  Sativa: "border-l-sativa",
  Hybrid: "border-l-hybrid",
};

const typeBadgeStyles: Record<StrainRecommendation["type"], string> = {
  Indica: "bg-indica/10 text-indica",
  Sativa: "bg-sativa/10 text-sativa",
  Hybrid: "bg-hybrid/10 text-hybrid",
};

export default function StrainResultCard({
  name,
  type,
  ratio,
  thc_range,
  cbd_range,
  terpenes,
  effects,
  flavors,
  best_for,
  description,
  why_for_you,
}: StrainRecommendation) {
  return (
    <div
      className={`rounded-card border border-border border-l-4 ${typeBorderColors[type]} bg-surface p-6 transition-shadow hover:shadow-md`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-xl font-semibold text-text-primary">
            {name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${typeBadgeStyles[type]}`}
            >
              {type}
            </span>
            {ratio && (
              <span className="font-mono text-xs text-text-secondary">
                {ratio}
              </span>
            )}
          </div>
        </div>

        {/* Cannabinoid Ranges */}
        <div className="flex gap-4 text-right">
          <div>
            <p className="font-mono text-xs text-text-tertiary">THC</p>
            <p className="font-mono text-sm font-medium text-text-primary">
              {thc_range}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-text-tertiary">CBD</p>
            <p className="font-mono text-sm font-medium text-text-primary">
              {cbd_range}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 font-body text-sm leading-relaxed text-text-secondary">
        {description}
      </p>

      {/* Why For You */}
      <div className="mt-4 rounded-lg bg-accent-green/5 px-4 py-3">
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-accent-green">
          Why this strain is for you
        </p>
        <p className="mt-1 font-body text-sm leading-relaxed text-text-primary">
          {why_for_you}
        </p>
      </div>

      {/* Details Grid */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Effects */}
        <div>
          <h4 className="font-body text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Effects
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {effects.map((effect) => (
              <span
                key={effect}
                className="inline-flex items-center rounded-full bg-tag-bg px-2.5 py-0.5 font-body text-xs text-text-secondary"
              >
                {effect}
              </span>
            ))}
          </div>
        </div>

        {/* Flavors */}
        <div>
          <h4 className="font-body text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Flavors
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {flavors.map((flavor) => (
              <span
                key={flavor}
                className="inline-flex items-center rounded-full bg-tag-bg px-2.5 py-0.5 font-body text-xs text-text-secondary"
              >
                {flavor}
              </span>
            ))}
          </div>
        </div>

        {/* Terpenes */}
        <div>
          <h4 className="font-body text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Terpenes
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {terpenes.map((terpene) => (
              <span
                key={terpene}
                className="inline-flex items-center rounded-full border border-accent-green/20 bg-accent-green/5 px-2.5 py-0.5 font-mono text-xs text-accent-green"
              >
                {terpene}
              </span>
            ))}
          </div>
        </div>

        {/* Best For */}
        <div>
          <h4 className="font-body text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Best For
          </h4>
          <p className="mt-2 font-body text-sm text-text-secondary">
            {best_for}
          </p>
        </div>
      </div>

      {/* View Full Profile Link */}
      <div className="mt-6 border-t border-border pt-4">
        <button
          type="button"
          className="inline-flex items-center font-body text-sm font-medium text-accent-green transition-colors hover:text-accent-green-light"
        >
          View full profile
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
