"use client";

import { useState } from "react";
import ShareBar from "@/components/ShareBar";

interface CannabinoidBreakdown {
  relevance: string;
  why: string;
  suggested_form: string;
  onset: string;
}

interface CbdThcResult {
  recommendation: string;
  confidence: string;
  summary: string;
  cbd_breakdown: CannabinoidBreakdown;
  thc_breakdown: CannabinoidBreakdown;
  ratio_suggestion: string;
  start_low_guide: string;
  important_note: string;
}

const goalOptions = [
  { value: "pain-relief", label: "Pain Relief" },
  { value: "anxiety", label: "Anxiety / Stress" },
  { value: "sleep", label: "Better Sleep" },
  { value: "inflammation", label: "Inflammation" },
  { value: "focus", label: "Focus / Productivity" },
  { value: "mood", label: "Mood Enhancement" },
  { value: "relaxation", label: "General Relaxation" },
  { value: "nausea", label: "Nausea Relief" },
];

const experienceOptions = [
  { value: "none", label: "Never tried cannabis" },
  { value: "cbd-only", label: "Tried CBD only" },
  { value: "thc-only", label: "Tried THC only" },
  { value: "both", label: "Tried both" },
];

const concernOptions = [
  { value: "getting-high", label: "Getting high" },
  { value: "drug-test", label: "Drug testing" },
  { value: "side-effects", label: "Side effects" },
  { value: "legality", label: "Legality" },
  { value: "none", label: "No concerns" },
];

const relevanceColors: Record<string, string> = {
  High: "text-accent-green",
  Medium: "text-warm",
  Low: "text-text-tertiary",
};

export default function CbdVsThc() {
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [result, setResult] = useState<CbdThcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const toggleConcern = (value: string) => {
    if (value === "none") {
      setConcerns(["none"]);
      return;
    }
    setConcerns((prev) => {
      const filtered = prev.filter((c) => c !== "none");
      return filtered.includes(value)
        ? filtered.filter((c) => c !== value)
        : [...filtered, value];
    });
  };

  const handleSubmit = async () => {
    if (!goal) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/cbd-vs-thc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, experience, concerns }),
      });
      const data = await response.json().catch(() => ({ error: `Server error (${response.status})` }));
      if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);
      setResult(data);
      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
        window.history.pushState({ tool: "cbd-vs-thc", hash: data.shareHash }, "", data.shareUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGoal("");
    setExperience("");
    setConcerns([]);
    setResult(null);
    setError("");
  };

  if (loading) {
    return (
      <div className="tool-container text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green mx-auto mb-4" />
        <p className="text-text-secondary text-lg">Analyzing the best cannabinoid for your needs...</p>
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
        {/* Recommendation Header */}
        <div className="tool-container text-center">
          <p className="text-text-tertiary text-sm mb-1">{result.confidence}</p>
          <h2 className="font-heading text-3xl md:text-4xl text-accent-green mb-3">
            {result.recommendation}
          </h2>
          <p className="text-text-secondary leading-relaxed max-w-2xl mx-auto">{result.summary}</p>
        </div>

        {/* CBD vs THC Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CBD */}
          <div className="rounded-card border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl">CBD</h3>
              <span className={`font-mono text-sm font-bold ${relevanceColors[result.cbd_breakdown.relevance] || ""}`}>
                {result.cbd_breakdown.relevance} Relevance
              </span>
            </div>
            <p className="text-text-secondary mb-4">{result.cbd_breakdown.why}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Suggested Form</span>
                <span className="font-medium">{result.cbd_breakdown.suggested_form}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Onset</span>
                <span className="font-mono">{result.cbd_breakdown.onset}</span>
              </div>
            </div>
          </div>

          {/* THC */}
          <div className="rounded-card border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl">THC</h3>
              <span className={`font-mono text-sm font-bold ${relevanceColors[result.thc_breakdown.relevance] || ""}`}>
                {result.thc_breakdown.relevance} Relevance
              </span>
            </div>
            <p className="text-text-secondary mb-4">{result.thc_breakdown.why}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Suggested Form</span>
                <span className="font-medium">{result.thc_breakdown.suggested_form}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Onset</span>
                <span className="font-mono">{result.thc_breakdown.onset}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ratio & Starting Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="tool-container">
            <h3 className="font-heading text-lg mb-2">Suggested Ratio</h3>
            <p className="font-mono text-2xl font-bold text-accent-green">{result.ratio_suggestion}</p>
          </div>
          <div className="tool-container">
            <h3 className="font-heading text-lg mb-2">Start Low Guide</h3>
            <p className="text-text-secondary">{result.start_low_guide}</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <p className="text-amber-800 text-sm">{result.important_note}</p>
        </div>

        <div className="text-center">
          <button onClick={handleReset} className="btn-secondary">Try Different Options</button>
        </div>
        {shareUrl && (
          <ShareBar url={shareUrl} text="Found out whether CBD or THC is right for me on KushSavvy!" />
        )}
      </div>
    );
  }

  return (
    <div className="tool-container space-y-8">
      {/* Goal */}
      <div>
        <label className="block font-heading text-lg mb-3">What is your primary goal?</label>
        <div className="grid grid-cols-2 gap-3">
          {goalOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setGoal(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                goal === opt.value
                  ? "border-accent-green bg-accent-green/5 text-accent-green"
                  : "border-border hover:border-accent-green/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <label className="block font-heading text-lg mb-3">Cannabis experience</label>
        <div className="grid grid-cols-2 gap-3">
          {experienceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setExperience(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                experience === opt.value
                  ? "border-accent-green bg-accent-green/5 text-accent-green"
                  : "border-border hover:border-accent-green/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Concerns */}
      <div>
        <label className="block font-heading text-lg mb-3">Any concerns? (optional)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {concernOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleConcern(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                concerns.includes(opt.value)
                  ? "border-accent-green bg-accent-green/5 text-accent-green"
                  : "border-border hover:border-accent-green/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={handleSubmit}
          disabled={!goal}
          className="btn-primary text-lg px-10 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Get My Recommendation
        </button>
      </div>
    </div>
  );
}
