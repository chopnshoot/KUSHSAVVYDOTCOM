"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Tool {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export default function HeroToolCarousel({ tools }: { tools: Tool[] }) {
  const [shuffled, setShuffled] = useState<Tool[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Shuffle on mount (client only) so order is random per visit
  useEffect(() => {
    const copy = [...tools];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffled(copy);
  }, [tools]);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % shuffled.length);
  }, [shuffled.length]);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + shuffled.length) % shuffled.length);
  }, [shuffled.length]);

  // Auto-rotate every 4s
  useEffect(() => {
    if (paused || shuffled.length === 0) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next, shuffled.length]);

  if (shuffled.length === 0) return null;

  const tool = shuffled[active];

  return (
    <div
      className="mt-12 max-w-md mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="text-text-tertiary text-xs uppercase tracking-wider mb-3 font-mono">
        Explore our tools
      </p>
      <div className="relative">
        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          aria-label="Previous tool"
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-surface/80 border border-border flex items-center justify-center text-text-tertiary hover:text-accent-green hover:border-accent-green transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next tool"
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-surface/80 border border-border flex items-center justify-center text-text-tertiary hover:text-accent-green hover:border-accent-green transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Card */}
        <Link
          href={`/tools/${tool.slug}`}
          key={tool.slug}
          className="group block rounded-card border border-border bg-surface/60 backdrop-blur-sm px-6 py-5 transition-all hover:shadow-md hover:border-accent-green/30 animate-in fade-in duration-300"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl flex-shrink-0" aria-hidden="true">
              {tool.icon}
            </span>
            <div className="text-left min-w-0">
              <h3 className="font-heading text-base font-semibold text-text-primary group-hover:text-accent-green transition-colors truncate">
                {tool.title}
              </h3>
              <p className="text-text-secondary text-sm leading-snug line-clamp-1">
                {tool.description}
              </p>
            </div>
            <svg
              className="w-5 h-5 text-text-tertiary group-hover:text-accent-green transition-colors flex-shrink-0 ml-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {shuffled.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to tool ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === active
                ? "bg-accent-green w-4"
                : "bg-text-tertiary/30 hover:bg-text-tertiary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
