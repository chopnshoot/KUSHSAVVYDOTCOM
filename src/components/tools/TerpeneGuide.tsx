"use client";

import { useState } from "react";

interface TerpeneInfo {
  name: string;
  pronunciation: string;
  aroma: string;
  description: string;
  effects: string[];
  medical_benefits: string[];
  also_found_in: string[];
  strains_high_in: string[];
  boiling_point: string;
  synergies: string;
  fun_fact: string;
}

const commonTerpenes = [
  { name: "Myrcene", emoji: "🥭", aroma: "Earthy, Musky" },
  { name: "Limonene", emoji: "🍋", aroma: "Citrus" },
  { name: "Linalool", emoji: "💐", aroma: "Floral, Lavender" },
  { name: "Caryophyllene", emoji: "🌶️", aroma: "Spicy, Peppery" },
  { name: "Pinene", emoji: "🌲", aroma: "Pine" },
  { name: "Humulene", emoji: "🍺", aroma: "Hoppy, Earthy" },
  { name: "Terpinolene", emoji: "🌿", aroma: "Herbal, Floral" },
  { name: "Ocimene", emoji: "🌸", aroma: "Sweet, Herbal" },
  { name: "Bisabolol", emoji: "🌼", aroma: "Floral, Sweet" },
];

export default function TerpeneGuide() {
  const [selectedTerpene, setSelectedTerpene] = useState("");
  const [result, setResult] = useState<TerpeneInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = async (name: string) => {
    setSelectedTerpene(name);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/terpene-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terpene: name }),
      });
      const data = await response.json().catch(() => ({ error: `Server error (${response.status})` }));
      if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load terpene info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedTerpene("");
    setResult(null);
    setError("");
  };

  if (loading) {
    return (
      <div className="tool-container text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green mx-auto mb-4" />
        <p className="text-text-secondary text-lg">Loading {selectedTerpene} info...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tool-container text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={handleReset} className="btn-primary">Go Back</button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="tool-container">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading text-2xl md:text-3xl">{result.name}</h2>
            <span className="text-text-tertiary text-sm italic">/{result.pronunciation}/</span>
          </div>
          <p className="tag mb-4">{result.aroma}</p>
          <p className="text-text-secondary leading-relaxed">{result.description}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-heading text-lg mb-3">Effects</h3>
            <div className="flex flex-wrap gap-2">
              {result.effects.map((e) => (
                <span key={e} className="tag">{e}</span>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-heading text-lg mb-3">Potential Benefits</h3>
            <div className="flex flex-wrap gap-2">
              {result.medical_benefits.map((b) => (
                <span key={b} className="tag">{b}</span>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-heading text-lg mb-3">Also Found In</h3>
            <div className="flex flex-wrap gap-2">
              {result.also_found_in.map((item) => (
                <span key={item} className="tag">{item}</span>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="font-heading text-lg mb-3">Strains High In {result.name}</h3>
            <div className="flex flex-wrap gap-2">
              {result.strains_high_in.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="tool-container">
            <h3 className="font-heading text-lg mb-2">Boiling Point</h3>
            <p className="font-mono text-2xl font-bold text-accent-green">{result.boiling_point}</p>
          </div>
          <div className="tool-container">
            <h3 className="font-heading text-lg mb-2">Entourage Synergies</h3>
            <p className="text-text-secondary leading-relaxed">{result.synergies}</p>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-accent-green/5 border border-accent-green/20 rounded-2xl p-6">
          <h3 className="font-heading text-lg mb-2 text-accent-green">Fun Fact</h3>
          <p className="text-text-secondary">{result.fun_fact}</p>
        </div>

        <div className="text-center">
          <button onClick={handleReset} className="btn-secondary">Explore Another Terpene</button>
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
        {commonTerpenes.map((t) => (
          <button
            key={t.name}
            onClick={() => handleSelect(t.name)}
            className="p-5 rounded-card border-2 border-border bg-surface text-left transition-all hover:border-accent-green hover:shadow-md"
          >
            <span className="text-2xl mb-2 block">{t.emoji}</span>
            <h3 className="font-heading text-lg">{t.name}</h3>
            <p className="text-text-tertiary text-sm">{t.aroma}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
