"use client";

import { useState } from "react";

interface StrainInfo {
  name: string;
  type: string;
  thc_range: string;
  cbd_range: string;
  top_effects: string[];
  top_flavors: string[];
  best_for: string;
  terpenes: string[];
}

interface CompareResult {
  strain1: StrainInfo;
  strain2: StrainInfo;
  summary: string;
}

const popularStrains = [
  "Blue Dream",
  "OG Kush",
  "Gorilla Glue",
  "Girl Scout Cookies",
  "Sour Diesel",
  "Wedding Cake",
  "Gelato",
  "Jack Herer",
  "Northern Lights",
  "Granddaddy Purple",
  "Green Crack",
  "Pineapple Express",
  "White Widow",
  "AK-47",
  "Purple Haze",
];

const typeColors: Record<string, string> = {
  Indica: "bg-indica/10 text-indica border-indica",
  Sativa: "bg-sativa/10 text-sativa border-sativa",
  Hybrid: "bg-hybrid/10 text-hybrid border-hybrid",
};

export default function StrainCompare() {
  const [strain1, setStrain1] = useState("");
  const [strain2, setStrain2] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    if (!strain1.trim() || !strain2.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strain1: strain1.trim(), strain2: strain2.trim() }),
      });
      if (!response.ok) throw new Error("Failed to compare");
      const data = await response.json();
      setResult(data);
    } catch {
      setError("Failed to generate comparison. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStrain1("");
    setStrain2("");
    setResult(null);
    setError("");
  };

  if (loading) {
    return (
      <div className="tool-container text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green mx-auto mb-4" />
        <p className="text-text-secondary text-lg">
          Comparing {strain1} vs {strain2}...
        </p>
        <p className="text-text-tertiary text-sm mt-2">This usually takes 5-10 seconds</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tool-container text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={handleReset} className="btn-primary">Start Over</button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-8">
        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[result.strain1, result.strain2].map((strain, i) => (
            <div key={i} className="rounded-card border border-border bg-surface p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-heading text-xl">{strain.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full border ${typeColors[strain.type] || "bg-tag-bg text-text-secondary border-border"}`}>
                  {strain.type}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">THC</span>
                  <span className="font-mono font-semibold">{strain.thc_range}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">CBD</span>
                  <span className="font-mono font-semibold">{strain.cbd_range}</span>
                </div>
                <div>
                  <span className="text-text-tertiary block mb-1">Effects</span>
                  <div className="flex flex-wrap gap-1">
                    {strain.top_effects.map((e) => (
                      <span key={e} className="tag text-xs">{e}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-text-tertiary block mb-1">Flavors</span>
                  <div className="flex flex-wrap gap-1">
                    {strain.top_flavors.map((f) => (
                      <span key={f} className="tag text-xs">{f}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-text-tertiary block mb-1">Terpenes</span>
                  <div className="flex flex-wrap gap-1">
                    {strain.terpenes.map((t) => (
                      <span key={t} className="tag text-xs">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <span className="text-text-tertiary text-xs">Best for</span>
                  <p className="font-body font-medium">{strain.best_for}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Summary */}
        <div className="tool-container">
          <h3 className="font-heading text-xl mb-4">AI Verdict</h3>
          <div className="prose prose-sm max-w-none text-text-secondary">
            {result.summary.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-3 leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button onClick={handleReset} className="btn-secondary">Compare Different Strains</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-container space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strain 1 */}
        <div>
          <label className="block font-heading text-lg mb-3">Strain 1</label>
          <input
            type="text"
            value={strain1}
            onChange={(e) => setStrain1(e.target.value)}
            placeholder="Type a strain name..."
            className="w-full p-4 rounded-xl border-2 border-border bg-surface text-text-primary font-body focus:border-accent-green focus:outline-none transition-colors"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {popularStrains.slice(0, 5).map((s) => (
              <button
                key={s}
                onClick={() => setStrain1(s)}
                className="tag text-xs cursor-pointer hover:bg-accent-green/10 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Strain 2 */}
        <div>
          <label className="block font-heading text-lg mb-3">Strain 2</label>
          <input
            type="text"
            value={strain2}
            onChange={(e) => setStrain2(e.target.value)}
            placeholder="Type a strain name..."
            className="w-full p-4 rounded-xl border-2 border-border bg-surface text-text-primary font-body focus:border-accent-green focus:outline-none transition-colors"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {popularStrains.slice(5, 10).map((s) => (
              <button
                key={s}
                onClick={() => setStrain2(s)}
                className="tag text-xs cursor-pointer hover:bg-accent-green/10 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={handleCompare}
          disabled={!strain1.trim() || !strain2.trim()}
          className="btn-primary text-lg px-10 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Compare Strains
        </button>
      </div>
    </div>
  );
}
