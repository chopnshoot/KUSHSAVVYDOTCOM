"use client";

import { useState } from "react";

interface CostResult {
  daily: string;
  weekly: string;
  monthly: string;
  yearly: string;
  costPerSession: string;
  costPerGram: string;
  tips: string[];
}

function calculateCost(
  amount: number,
  price: number,
  frequency: number
): CostResult {
  const gramsPerSession = amount;
  const costPerGram = price / 3.5; // price per eighth
  const costPerSession = gramsPerSession * costPerGram;
  const daily = costPerSession * frequency;
  const weekly = daily * 7;
  const monthly = daily * 30;
  const yearly = daily * 365;

  const tips: string[] = [];
  if (yearly > 3000) {
    tips.push("Consider switching to a dry herb vaporizer — you will use 30-40% less flower for the same effect.");
  }
  if (yearly > 2000) {
    tips.push("Buying in bulk (ounces instead of eighths) typically saves 20-30%.");
  }
  if (frequency > 2) {
    tips.push("A tolerance break could help you use less and feel more — even a 3-day break makes a difference.");
  }
  tips.push("Loyalty programs and daily deals at dispensaries can save 10-20% on average.");
  if (amount > 0.5) {
    tips.push("Micro-dosing (smaller bowls, one-hitters) can stretch your supply significantly.");
  }
  tips.push("Growing your own (where legal) can reduce costs to under $2/gram after initial setup.");

  return {
    daily: `$${daily.toFixed(2)}`,
    weekly: `$${weekly.toFixed(2)}`,
    monthly: `$${monthly.toFixed(2)}`,
    yearly: `$${yearly.toFixed(2)}`,
    costPerSession: `$${costPerSession.toFixed(2)}`,
    costPerGram: `$${costPerGram.toFixed(2)}`,
    tips,
  };
}

const amountOptions = [
  { value: 0.15, label: "Microdose (~0.15g)" },
  { value: 0.25, label: "Small bowl (~0.25g)" },
  { value: 0.5, label: "Medium bowl (~0.5g)" },
  { value: 1.0, label: "Full joint (~1g)" },
  { value: 1.5, label: "Big joint (~1.5g)" },
];

const priceOptions = [
  { value: 20, label: "$20/eighth (Budget)" },
  { value: 35, label: "$35/eighth (Mid)" },
  { value: 50, label: "$50/eighth (Premium)" },
  { value: 65, label: "$65/eighth (Top Shelf)" },
];

const frequencyOpts = [
  { value: 1, label: "Once a day" },
  { value: 2, label: "Twice a day" },
  { value: 3, label: "3 times a day" },
  { value: 5, label: "5+ times a day" },
  { value: 0.5, label: "A few times a week" },
  { value: 0.14, label: "Once a week" },
];

export default function CostCalculator() {
  const [amount, setAmount] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [result, setResult] = useState<CostResult | null>(null);

  const canCalculate = amount !== null && price !== null && frequency !== null;

  const handleCalculate = () => {
    if (!canCalculate) return;
    setResult(calculateCost(amount, price, frequency));
  };

  const handleReset = () => {
    setAmount(null);
    setPrice(null);
    setFrequency(null);
    setResult(null);
  };

  if (result) {
    return (
      <div className="space-y-8">
        <div className="tool-container text-center">
          <p className="text-text-secondary mb-2">Your estimated cannabis spending</p>
          <p className="font-mono text-5xl md:text-6xl font-bold text-accent-green mb-2">
            {result.monthly}
          </p>
          <p className="text-text-tertiary">per month</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Per Session", value: result.costPerSession },
            { label: "Per Day", value: result.daily },
            { label: "Per Week", value: result.weekly },
            { label: "Per Year", value: result.yearly },
          ].map((item) => (
            <div key={item.label} className="bg-surface rounded-xl p-5 border border-border text-center">
              <p className="text-text-tertiary text-sm mb-1">{item.label}</p>
              <p className="font-mono text-xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="tool-container">
          <p className="text-text-tertiary text-sm mb-1">Cost per gram</p>
          <p className="font-mono text-2xl font-bold">{result.costPerGram}</p>
        </div>

        {/* Saving Tips */}
        <div className="bg-accent-green/5 border border-accent-green/20 rounded-2xl p-6 md:p-8">
          <h3 className="font-heading text-xl mb-4 text-accent-green">Ways to Save</h3>
          <ul className="space-y-3">
            {result.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary">
                <span className="text-accent-green mt-0.5">&#10003;</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <button onClick={handleReset} className="btn-secondary">Calculate Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-container space-y-8">
      {/* Amount per session */}
      <div>
        <label className="block font-heading text-lg mb-3">How much per session?</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {amountOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAmount(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                amount === opt.value
                  ? "border-accent-green bg-accent-green/5 text-accent-green"
                  : "border-border hover:border-accent-green/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block font-heading text-lg mb-3">What do you typically pay?</label>
        <div className="grid grid-cols-2 gap-3">
          {priceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPrice(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                price === opt.value
                  ? "border-accent-green bg-accent-green/5 text-accent-green"
                  : "border-border hover:border-accent-green/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block font-heading text-lg mb-3">How often do you smoke?</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {frequencyOpts.map((opt) => (
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

      <div className="text-center pt-4">
        <button
          onClick={handleCalculate}
          disabled={!canCalculate}
          className="btn-primary text-lg px-10 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Calculate My Spending
        </button>
      </div>
    </div>
  );
}
