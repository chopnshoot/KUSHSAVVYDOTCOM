"use client";

import { useState } from "react";
import LoadingMeter from "@/components/ui/LoadingMeter";
import ShareBar from "@/components/ShareBar";

interface GrowPhase {
  name: string;
  duration: string;
  description: string;
  key_tasks: string[];
  watch_for: string;
}

interface GrowPlan {
  title: string;
  total_weeks: string;
  summary: string;
  phases: GrowPhase[];
  supplies_needed: string[];
  pro_tips: string[];
  estimated_yield: string;
}

const strainTypes = [
  { value: "indica", label: "Indica" },
  { value: "sativa", label: "Sativa" },
  { value: "hybrid", label: "Hybrid" },
  { value: "autoflower", label: "Autoflower" },
];

const growMethods = [
  { value: "soil", label: "Soil (Traditional)" },
  { value: "coco-coir", label: "Coco Coir" },
  { value: "hydroponics", label: "Hydroponics" },
  { value: "living-soil", label: "Living Soil (Organic)" },
];

const experienceLevels = [
  { value: "first-time", label: "First grow ever" },
  { value: "beginner", label: "1-2 grows" },
  { value: "intermediate", label: "3-5 grows" },
  { value: "experienced", label: "5+ grows" },
];

const environmentOptions = [
  { value: "indoor-tent", label: "Indoor grow tent" },
  { value: "indoor-room", label: "Indoor room" },
  { value: "outdoor", label: "Outdoor" },
  { value: "greenhouse", label: "Greenhouse" },
];

export default function GrowTimeline() {
  const [strainType, setStrainType] = useState("");
  const [growMethod, setGrowMethod] = useState("");
  const [experience, setExperience] = useState("");
  const [environment, setEnvironment] = useState("");
  const [result, setResult] = useState<GrowPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const canSubmit = strainType && growMethod && environment;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/grow-timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strain_type: strainType,
          grow_method: growMethod,
          experience,
          environment,
        }),
      });
      const data = await response.json().catch(() => ({ error: `Server error (${response.status})` }));
      if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);
      setResult(data);
      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
        window.history.pushState({ tool: "grow-timeline", hash: data.shareHash }, "", data.shareUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate grow timeline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStrainType("");
    setGrowMethod("");
    setExperience("");
    setEnvironment("");
    setResult(null);
    setError("");
  };

  if (loading) {
    return (
      <LoadingMeter
        title="Building Your Grow Timeline"
        icon="&#x1F331;"
        messages={[
          "Selecting the best nutrients...",
          "Mapping out the grow phases...",
          "Calculating light schedules...",
          "Planning the feeding chart...",
          "Checking strain-specific timelines...",
          "Adding pro tips for your setup...",
          "Almost there — estimating your yield...",
        ]}
      />
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
        {/* Header */}
        <div className="tool-container text-center">
          <h2 className="font-heading text-2xl md:text-3xl mb-2">{result.title}</h2>
          <p className="font-mono text-3xl font-bold text-accent-green mb-3">{result.total_weeks}</p>
          <p className="text-text-secondary leading-relaxed max-w-2xl mx-auto">{result.summary}</p>
        </div>

        {/* Phase Timeline */}
        <div className="space-y-4">
          {result.phases.map((phase, i) => (
            <div key={i} className="rounded-card border border-border bg-surface p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-sm bg-accent-green text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-heading text-lg">{phase.name}</h3>
                  <span className="text-text-tertiary text-sm">{phase.duration}</span>
                </div>
              </div>
              <p className="text-text-secondary mb-3">{phase.description}</p>
              <div className="mb-3">
                <p className="text-sm font-semibold mb-1">Key Tasks:</p>
                <ul className="space-y-1">
                  {phase.key_tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-accent-green mt-0.5">&#10003;</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Watch for: </span>{phase.watch_for}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Supplies */}
        <div className="tool-container">
          <h3 className="font-heading text-xl mb-4">Supplies Needed</h3>
          <div className="flex flex-wrap gap-2">
            {result.supplies_needed.map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
        </div>

        {/* Pro Tips & Yield */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-accent-green/5 border border-accent-green/20 rounded-2xl p-6">
            <h3 className="font-heading text-lg mb-3 text-accent-green">Pro Tips</h3>
            <ul className="space-y-2">
              {result.pro_tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-accent-green mt-0.5">&#10003;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-accent-green/5 border border-accent-green/20 rounded-2xl p-6">
            <h3 className="font-heading text-lg mb-2 text-accent-green">Estimated Yield</h3>
            <p className="font-mono text-2xl font-bold">{result.estimated_yield}</p>
          </div>
        </div>

        <div className="text-center">
          <button onClick={handleReset} className="btn-secondary">Plan a Different Grow</button>
        </div>
        {shareUrl && (
          <ShareBar url={shareUrl} text="Planning my cannabis grow with KushSavvy!" />
        )}
      </div>
    );
  }

  return (
    <div className="tool-container space-y-8">
      {/* Strain Type */}
      <div>
        <label className="block font-heading text-lg mb-3">What type of strain?</label>
        <div className="grid grid-cols-2 gap-3">
          {strainTypes.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStrainType(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                strainType === opt.value
                  ? "border-accent-green bg-accent-green/5 text-accent-green"
                  : "border-border hover:border-accent-green/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grow Method */}
      <div>
        <label className="block font-heading text-lg mb-3">Grow method</label>
        <div className="grid grid-cols-2 gap-3">
          {growMethods.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setGrowMethod(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                growMethod === opt.value
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
        <label className="block font-heading text-lg mb-3">Growing experience (optional)</label>
        <div className="grid grid-cols-2 gap-3">
          {experienceLevels.map((opt) => (
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

      {/* Environment */}
      <div>
        <label className="block font-heading text-lg mb-3">Growing environment</label>
        <div className="grid grid-cols-2 gap-3">
          {environmentOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setEnvironment(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                environment === opt.value
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
          disabled={!canSubmit}
          className="btn-primary text-lg px-10 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Generate Grow Timeline
        </button>
      </div>
    </div>
  );
}
