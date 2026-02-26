import Link from "next/link";
import { tools } from "@/lib/tools-data";
import { TOOL_RELATIONSHIPS } from "@/lib/seo-data";

interface RelatedToolsProps {
  currentSlug: string;
}

export default function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const relatedSlugs = TOOL_RELATIONSHIPS[currentSlug] || [];
  const relatedTools = relatedSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean);

  if (relatedTools.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="font-heading text-2xl mb-6">Related Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedTools.map((tool) => (
          <Link
            key={tool!.slug}
            href={`/tools/${tool!.slug}`}
            className="card p-6 block hover:shadow-md transition-shadow"
          >
            <span className="text-2xl mb-2 block">{tool!.icon}</span>
            <h3 className="font-heading text-lg mb-1">{tool!.title}</h3>
            <p className="text-text-secondary text-sm">{tool!.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
