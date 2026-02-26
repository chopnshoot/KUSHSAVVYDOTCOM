"use client";

import { useState } from "react";
import { seedTerpenes, SeedTerpene } from "@/lib/seed-terpenes";

const terpeneEmojis: Record<string, string> = {
  Myrcene: "🥭",
  Limonene: "🍋",
  Linalool: "💐",
  Caryophyllene: "🌶️",
  Pinene: "🌲",
  Humulene: "🍺",
  Terpinolene: "🌿",
  Ocimene: "🌸",
  Bisabolol: "🌼",
  Geraniol: "🌹",
  Camphene: "🌲",
  Valencene: "🍊",
  Nerolidol: "🪵",
  Guaiol: "🌿",
};

export default function TerpeneGuide() {
  const [selected, setSelected] = useState<SeedTerpene | null>(null);

  if (selected) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="tool-container">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{terpeneEmojis[selected.name] || "🧪"}</span>
            <h2 className="font-heading text-2xl md:text-3xl">{selected.name}</h2>
          </div>
          <p className="tag mb-4">{selected.aroma}</p>
          <p className="text-text-secondary leading-relaxed">{selected.description}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-heading text-lg mb-3">Effects</h3>
            <div className="flex flex-wrap gap-2">
              {selected.effects.map((e) => (
                <span key={e} className="tag">{e}</span>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-heading text-lg mb-3">Also Found In</h3>
            <div className="flex flex-wrap gap-2">
              {selected.alsoFoundIn.map((item) => (
                <span key={item} className="tag">{item}</span>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-heading text-lg mb-3">Common Strains</h3>
            <div className="flex flex-wrap gap-2">
              {selected.commonStrains.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-heading text-lg mb-3">Research Summary</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{selected.researchSummary}</p>
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => setSelected(null)} className="btn-secondary">Explore Another Terpene</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-container">
      <p className="text-text-secondary text-center mb-8">
        Select a terpene to learn about its effects, aromas, and which strains are rich in it.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {seedTerpenes.map((t) => (
          <button
            key={t.name}
            onClick={() => setSelected(t)}
            className="p-5 rounded-card border-2 border-border bg-surface text-left transition-all hover:border-accent-green hover:shadow-md"
          >
            <span className="text-2xl mb-2 block">{terpeneEmojis[t.name] || "🧪"}</span>
            <h3 className="font-heading text-lg">{t.name}</h3>
            <p className="text-text-tertiary text-sm">{t.aroma}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {t.effects.slice(0, 2).map((e) => (
                <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-tag-bg text-text-secondary">{e}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
