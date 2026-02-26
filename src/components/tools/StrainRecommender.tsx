"use client";

import { useState, useCallback } from "react";
import QuizStep from "@/components/ui/QuizStep";
import StrainResultCard from "@/components/ui/StrainResultCard";
import TurnstileWidget from "@/components/ui/TurnstileWidget";
import RateLimitPrompt from "@/components/ui/RateLimitPrompt";
import UsageCounter from "@/components/ui/UsageCounter";
import { StrainRecommendation } from "@/lib/types";

const quizSteps = [
  {
    question: "What effects are you looking for?",
    options: [
      "Relaxation",
      "Energy",
      "Creativity",
      "Pain Relief",
      "Sleep",
      "Social",
      "Focus",
    ],
    multiSelect: true,
    key: "effects",
  },
  {
    question: "What is your experience level?",
    options: [
      "New to cannabis",
      "Occasional",
      "Regular",
      "Experienced",
    ],
    multiSelect: false,
    key: "experience",
  },
  {
    question: "How do you plan to consume?",
    options: ["Smoke", "Vape", "Edible", "Tincture", "Topical"],
    multiSelect: false,
    key: "method",
  },
  {
    question: "Any effects you want to avoid?",
    options: [
      "Anxiety",
      "Couch-lock",
      "Dry mouth",
      "Munchies",
      "Paranoia",
      "None",
    ],
    multiSelect: true,
    key: "avoid",
  },
  {
    question: "Flavor preference?",
    options: [
      "Earthy",
      "Fruity",
      "Citrus",
      "Diesel",
      "Sweet",
      "Piney",
      "No preference",
    ],
    multiSelect: true,
    key: "flavor",
  },
];

export default function StrainRecommender() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [results, setResults] = useState<StrainRecommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleSelect = (value: string | string[]) => {
    const step = quizSteps[currentStep];
    if (step.multiSelect) {
      const clicked = value as string;
      setAnswers((prev) => {
        const current = (prev[step.key] as string[]) || [];
        if (current.includes(clicked)) {
          return { ...prev, [step.key]: current.filter((v) => v !== clicked) };
        }
        return { ...prev, [step.key]: [...current, clicked] };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [step.key]: value }));
    }
  };

  const handleNext = async () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await submitQuiz();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    setError("");
    setRateLimited(false);
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, turnstileToken }),
      });
      const data = await response.json().catch(() => ({ error: `Server error (${response.status})` }));

      if (response.status === 429) {
        setRateLimited(true);
        if (data.limit) {
          setUsage({ used: data.limit, limit: data.limit });
        }
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      setResults(data.recommendations);

      // Update usage counter from response
      if (data._rateLimit) {
        setUsage({
          used: data._rateLimit.limit - data._rateLimit.remaining,
          limit: data._rateLimit.limit,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
    setError("");
    setRateLimited(false);
  };

  const handleSubscribeUpgrade = () => {
    setRateLimited(false);
    // Re-submit the quiz after upgrading
    submitQuiz();
  };

  if (loading) {
    return (
      <div className="tool-container text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green mx-auto mb-4"></div>
        <p className="text-text-secondary text-lg">
          Analyzing your preferences and finding your perfect strains...
        </p>
        <p className="text-text-tertiary text-sm mt-2">
          This usually takes 5-10 seconds
        </p>
      </div>
    );
  }

  if (rateLimited) {
    return <RateLimitPrompt onUpgraded={handleSubscribeUpgrade} />;
  }

  if (results) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl md:text-3xl mb-2">
            Your Personalized Recommendations
          </h2>
          <p className="text-text-secondary">
            Based on your preferences, here are 3 strains we think
            you will love
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {results.map((rec, index) => (
            <StrainResultCard key={index} {...rec} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={resetQuiz} className="btn-secondary">
            Try Again with Different Preferences
          </button>
        </div>
        {usage && <UsageCounter used={usage.used} limit={usage.limit} />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="tool-container text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={resetQuiz} className="btn-primary">
          Start Over
        </button>
      </div>
    );
  }

  const step = quizSteps[currentStep];
  const currentAnswer = answers[step.key];
  const hasAnswer = currentAnswer && (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : currentAnswer.length > 0);

  return (
    <div className="tool-container">
      <QuizStep
        question={step.question}
        options={step.options}
        selected={currentAnswer || (step.multiSelect ? [] : "")}
        onSelect={handleSelect}
        multiSelect={step.multiSelect}
        stepNumber={currentStep + 1}
        totalSteps={quizSteps.length}
      />
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!hasAnswer}
          className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {currentStep === quizSteps.length - 1
            ? "Get Recommendations"
            : "Next"}
        </button>
      </div>
      <TurnstileWidget onVerify={handleTurnstileVerify} />
      {usage && <UsageCounter used={usage.used} limit={usage.limit} />}
    </div>
  );
}
