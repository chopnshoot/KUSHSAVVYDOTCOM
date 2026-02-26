"use client";

import { useState } from "react";

interface RateLimitPromptProps {
  onUpgraded: () => void;
}

export default function RateLimitPrompt({ onUpgraded }: RateLimitPromptProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subscribe-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      onUpgraded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container text-center py-12 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="w-16 h-16 bg-warm/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">&#9889;</span>
        </div>
        <h2 className="font-heading text-2xl mb-2">
          You&apos;ve used all your free searches for today
        </h2>
        <p className="text-text-secondary">
          Want more access? Join our newsletter — it&apos;s free.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 p-4 rounded-xl border-2 border-border bg-surface text-text-primary font-body focus:border-accent-green focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !email.includes("@")}
            className="btn-primary px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Subscribing..." : "Get 3x More Searches"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <p className="text-text-tertiary text-xs mt-4">
        Your limit resets tomorrow at midnight, or enter your email for 3x more searches instantly.
      </p>
    </div>
  );
}
