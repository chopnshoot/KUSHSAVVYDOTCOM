"use client";

import { useState } from "react";
import {
  calculateDosage,
  experienceLevels,
  weightRanges,
  intensityLevels,
  edibleTypes,
} from "@/lib/dosage-calculator";
import { DosageResult } from "@/lib/types";

export default function EdibleDosageCalculator() {
  const [experience, setExperience] = useState("");
  const [weight, setWeight] = useState("");
  const [intensity, setIntensity] = useState("");
  const [edibleType, setEdibleType] = useState("");
  const [result, setResult] = useState<DosageResult | null>(null);

  const canCalculate = experience && weight && intensity && edibleType;

  const handleCalculate = () => {
    if (!canCalculate) return;
    const dosageResult = calculateDosage(
      experience as Parameters<typeof calculateDosage>[0],
      weight as Parameters<typeof calculateDosage>[1],
      intensity as Parameters<typeof calculateDosage>[2],
      edibleType as Parameters<typeof calculateDosage>[3]
    );
    setResult(dosageResult);
  };

  const handleReset = () => {
    setExperience("");
    setWeight("");
    setIntensity("");
    setEdibleType("");
    setResult(null);
  };

  return (
    <div>
      {!result ? (
        <div className="tool-container space-y-8">
          {/* Experience Level */}
          <div>
            <label className="block font-heading text-lg mb-3">
              What is your experience level with edibles?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setExperience(level.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    experience === level.value
                      ? "border-accent-green bg-accent-green/5 text-accent-green"
                      : "border-border hover:border-accent-green/30"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body Weight */}
          <div>
            <label className="block font-heading text-lg mb-3">
              Body weight range (optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {weightRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setWeight(range.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    weight === range.value
                      ? "border-accent-green bg-accent-green/5 text-accent-green"
                      : "border-border hover:border-accent-green/30"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desired Intensity */}
          <div>
            <label className="block font-heading text-lg mb-3">
              Desired intensity
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {intensityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setIntensity(level.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    intensity === level.value
                      ? "border-accent-green bg-accent-green/5 text-accent-green"
                      : "border-border hover:border-accent-green/30"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Edible Type */}
          <div>
            <label className="block font-heading text-lg mb-3">
              Type of edible
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {edibleTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setEdibleType(type.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    edibleType === type.value
                      ? "border-accent-green bg-accent-green/5 text-accent-green"
                      : "border-border hover:border-accent-green/30"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleCalculate}
              disabled={!canCalculate}
              className="btn-primary text-lg px-10 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Calculate My Dose
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Result */}
          <div className="tool-container text-center">
            <p className="text-text-secondary mb-2">
              Your recommended dose
            </p>
            <p className="font-mono text-5xl md:text-6xl font-bold text-accent-green mb-4">
              {result.recommendedDose}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
              <div className="bg-surface rounded-xl p-5 border border-border">
                <p className="text-text-tertiary text-sm mb-1">
                  Expected onset
                </p>
                <p className="font-mono text-lg font-semibold">
                  {result.onsetTime}
                </p>
              </div>
              <div className="bg-surface rounded-xl p-5 border border-border">
                <p className="text-text-tertiary text-sm mb-1">
                  Duration
                </p>
                <p className="font-mono text-lg font-semibold">
                  {result.duration}
                </p>
              </div>
              <div className="bg-surface rounded-xl p-5 border border-border">
                <p className="text-text-tertiary text-sm mb-1">
                  Peak effects
                </p>
                <p className="font-mono text-lg font-semibold">
                  {result.peakWindow}
                </p>
              </div>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-amber-50 rounded-2xl p-6 md:p-8 border border-amber-200">
            <h3 className="font-heading text-xl mb-4 text-amber-900">
              Safety Tips
            </h3>
            <ul className="space-y-2">
              {result.safetyTips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-amber-800"
                >
                  <span className="mt-1 flex-shrink-0">&#9888;&#65039;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Too Much Guide */}
          <div className="bg-blue-50 rounded-2xl p-6 md:p-8 border border-blue-200">
            <h3 className="font-heading text-xl mb-4 text-blue-900">
              What to Do If You Take Too Much
            </h3>
            <ul className="space-y-2">
              {result.tooMuchGuide.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-blue-800"
                >
                  <span className="font-mono text-sm bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <button onClick={handleReset} className="btn-secondary">
              Calculate Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
