import Link from "next/link";
import Image from "next/image";

interface StrainCardProps {
  name: string;
  slug: string;
  type: "Indica" | "Sativa" | "Hybrid";
  thcMin: number;
  thcMax: number;
  effects: string[];
  image?: string;
}

const typeBadgeStyles: Record<StrainCardProps["type"], string> = {
  Indica: "bg-indica/10 text-indica",
  Sativa: "bg-sativa/10 text-sativa",
  Hybrid: "bg-hybrid/10 text-hybrid",
};

export default function StrainCard({
  name,
  slug,
  type,
  thcMin,
  thcMax,
  effects,
  image,
}: StrainCardProps) {
  const displayEffects = effects.slice(0, 3);

  return (
    <Link href={`/strains/${slug}`} className="group block">
      <div className="overflow-hidden rounded-card border border-border bg-surface transition-shadow hover:shadow-md">
        {/* Image Section */}
        <div className="relative h-40 w-full bg-tag-bg">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-heading text-4xl text-text-tertiary/50">
                {type[0]}
              </span>
            </div>
          )}
          {/* Type Badge */}
          <span
            className={`absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${typeBadgeStyles[type]}`}
          >
            {type}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Name */}
          <h3 className="font-heading text-base font-semibold text-text-primary group-hover:text-accent-green transition-colors">
            {name}
          </h3>

          {/* THC Range */}
          <p className="mt-1 font-mono text-xs text-text-secondary">
            THC {thcMin}%&ndash;{thcMax}%
          </p>

          {/* Effects Tags */}
          {displayEffects.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {displayEffects.map((effect) => (
                <span
                  key={effect}
                  className="inline-flex items-center rounded-full bg-tag-bg px-2.5 py-0.5 font-body text-xs text-text-secondary"
                >
                  {effect}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
