import Link from "next/link";

interface ToolCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
}

export default function ToolCard({
  slug,
  title,
  description,
  icon,
  available,
}: ToolCardProps) {
  const cardContent = (
    <div
      className={`group relative flex flex-col gap-4 rounded-card border border-border bg-surface p-6 transition-shadow ${
        available
          ? "hover:shadow-md cursor-pointer"
          : "opacity-75 cursor-default"
      }`}
    >
      {/* Coming Soon Badge */}
      {!available && (
        <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-tag-bg px-2.5 py-0.5 font-body text-xs font-medium text-text-secondary">
          Coming Soon
        </span>
      )}

      {/* Icon */}
      <span className="text-3xl" role="img" aria-hidden="true">
        {icon}
      </span>

      {/* Title */}
      <h3
        className={`font-heading text-lg font-semibold text-text-primary ${
          available
            ? "group-hover:text-accent-green transition-colors"
            : ""
        }`}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="font-body text-sm leading-relaxed text-text-secondary">
        {description}
      </p>

      {/* Arrow indicator for available tools */}
      {available && (
        <span
          className="mt-auto inline-flex items-center font-body text-sm font-medium text-accent-green opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        >
          Explore tool
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </span>
      )}
    </div>
  );

  if (available) {
    return (
      <Link href={`/tools/${slug}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
