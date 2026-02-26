"use client";

import { useState } from "react";
import ShareBar from "@/components/ShareBar";

interface Phase {
  day: string;
  title: string;
  what_to_expect: string;
  tips: string[];
}

interface TolerancePlan {
  plan_title: string;
  summary: string;
  daily_plan: Phase[];
  supplements: string[];
  when_to_resume: string;
  expected_benefit: string;
}

const usageLevels = [
  { value: "light", label: "Light (a few hits)" },
  { value: "moderate", label: "Moderate (1-2 sessions/day)" },
  { value: "heavy", label: "Heavy (3+ sessions/day)" },
  { value: "all-day", label: "All day, every day" },
];

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "most-days", label: "Most days" },
  { value: "weekends", label: "Weekends only" },
  { value: "few-per-week", label: "A few times a week" },
];

const durationOptions = [
  { value: "3-days", label: "3 Days (Quick Reset)" },
  { value: "7-days", label: "1 Week" },
  { value: "14-days", label: "2 Weeks" },
  { value: "21-days", label: "3 Weeks" },
  { value: "30-days", label: "30 Days (Full Reset)" },
];

const goalOptions = [
  { value: "lower-tolerance", label: "Lower my tolerance" },
  { value: "save-money", label: "Save money" },
  { value: "clearer-head", label: "Feel clearer-headed" },
  { value: "drug-test", label: "Pass a drug test" },
  { value: "re-evaluate", label: "Re-evaluate my relationship with cannabis" },
];

export default function ToleranceBreakPlanner() {
  const [usage, setUsage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<TolerancePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const canSubmit = usage && frequency && duration;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/tolerance-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usage, frequency, duration, goal }),
      });
      const data = await response.json().catch(() => ({ error: `Server error (${response.status})` }));
      if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);
      setResult(data);
      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
        window.history.pushState({ tool: "tolerance-break-planner", hash: data.shareHash }, "", data.shareUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate your plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUsage("");
    setFrequency("");
    setDuration("");
    setGoal("");
    setResult(null);
    setError("");
  };

  if (loading) {
    return (
      <div className="tool-container text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green mx-auto mb-4" />
        <p className="text-text-secondary text-lg">Building your personalized tolerance break plan...</p>
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
        {/* Header */}
        <div className="tool-container text-center">
          <h2 className="font-heading text-2xl md:text-3xl mb-2">{result.plan_title}</h2>
          <p className="text-text-secondary leading-relaxed max-w-2xl mx-auto">{result.summary}</p>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {result.daily_plan.map((phase, i) => (
            <div key={i} className="rounded-card border border-border bg-surface p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-sm bg-accent-green text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-heading text-lg">{phase.title}</h3>
                  <span className="text-text-tertiary text-sm">{phase.day}</span>
                </div>
              </div>
              <p className="text-text-secondary mb-3">{phase.what_to_expect}</p>
              <ul className="space-y-1">
                {phase.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-accent-green mt-0.5">&#10003;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Supplements */}
        <div className="tool-container">
          <h3 className="font-heading text-xl mb-4">Helpful Supplements & Activities</h3>
          <div className="flex flex-wrap gap-2">
            {result.supplements.map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
        </div>

        {/* Resume & Benefit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-accent-green/5 border border-accent-green/20 rounded-2xl p-6">
            <h3 className="font-heading text-lg mb-2 text-accent-green">When to Resume</h3>
            <p className="text-text-secondary">{result.when_to_resume}</p>
          </div>
          <div className="bg-accent-green/5 border border-accent-green/20 rounded-2xl p-6">
            <h3 className="font-heading text-lg mb-2 text-accent-green">Expected Benefit</h3>
            <p className="text-text-secondary">{result.expected_benefit}</p>
          </div>
        </div>

        <div className="text-center">
          <button onClick={handleReset} className="btn-secondary">Plan a Different Break</button>
        </div>
        {shareUrl && (
          <ShareBar url={shareUrl} text="Just got my custom tolerance break plan from KushSavvy!" />
        )}
      </div>
    );
  }

  return (
    <div className="tool-container space-y-8">
      {/* Usage Level */}
      <div>
        <label className="block font-heading text-lg mb-3">How much do you typically use?</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {usageLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setUsage(level.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                usage === level.value
                  ? "border-accent-green bg-accent-green/5 text-accent-green"
                  : "border-border hover:border-accent-green/30"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block font-heading text-lg mb-3">How often do you use?</label>
        <div className="grid grid-cols-2 gap-3">
          {frequencyOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFrequency(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                frequency === opt.value
                  ? "border-accent-green bg-accent-green/5 text-accent-green"
                  : "border-border hover:border-accent-green/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block font-heading text-lg mb-3">How long of a break?</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {durationOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDuration(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                duration === opt.value
                  ? "border-accent-green bg-accent-green/5 text-accent-green"
                  : "border-border hover:border-accent-green/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <label className="block font-heading text-lg mb-3">What is your main goal? (optional)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      <div className="text-center pt-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn-primary text-lg px-10 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Generate My Plan
        </button>
      </div>
    </div>
  );
}
