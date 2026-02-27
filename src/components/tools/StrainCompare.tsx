"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import strainNames from "@/data/strain-names.json";
import TurnstileWidget from "@/components/ui/TurnstileWidget";
import RateLimitPrompt from "@/components/ui/RateLimitPrompt";
import UsageCounter from "@/components/ui/UsageCounter";
import LoadingMeter from "@/components/ui/LoadingMeter";
import ShareBar from "@/components/ShareBar";

interface StrainInfo {
  name: string;
  type: string;
  ratio: string;
  thc_range: string;
  cbd_range: string;
  terpenes: string[];
  effects: string[];
  negativeEffects: string[];
  flavors: string[];
  bestFor: string;
}

interface CompareResult {
  strain1: StrainInfo;
  strain2: StrainInfo;
  comparison: string;
  verdict: string;
}

const typeColors: Record<string, string> = {
  Indica: "bg-indica/10 text-indica border-indica",
  Sativa: "bg-sativa/10 text-sativa border-sativa",
  Hybrid: "bg-hybrid/10 text-hybrid border-hybrid",
};

function AutocompleteInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  label: string;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (value.length >= 1) {
      const query = value.toLowerCase();
      const filtered = strainNames
        .filter((name: string) => name.toLowerCase().includes(query))
        .slice(0, 8);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setHighlightIndex(-1);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      onChange(suggestions[highlightIndex]);
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <label className="block font-heading text-lg mb-3">{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-4 rounded-xl border-2 border-border bg-surface text-text-primary font-body focus:border-accent-green focus:outline-none transition-colors"
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-surface shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((name, i) => (
            <li
              key={name}
              className={`px-4 py-2.5 cursor-pointer text-sm font-body transition-colors ${
                i === highlightIndex
                  ? "bg-accent-green/10 text-accent-green"
                  : "text-text-primary hover:bg-tag-bg"
              }`}
              onMouseDown={() => {
                onChange(name);
                setShowSuggestions(false);
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function StrainCompare() {
  const [strain1, setStrain1] = useState("");
  const [strain2, setStrain2] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleCompare = async () => {
    if (!strain1.trim() || !strain2.trim()) return;
    setLoading(true);
    setError("");
    setRateLimited(false);
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strain1: strain1.trim(),
          strain2: strain2.trim(),
          turnstileToken,
        }),
      });
      const data = await response.json().catch(() => ({ error: `Server error (${response.status})` }));

      if (response.status === 429) {
        setRateLimited(true);
        if (data.limit) {
          setUsage({ used: data.limit, limit: data.limit });
        }
        return;
      }

      if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);
      setResult(data);

      // Update URL to shareable link
      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
        window.history.pushState({ tool: "strain-compare", hash: data.shareHash }, "", data.shareUrl);
      }

      // Update usage counter from response
      if (data._rateLimit) {
        setUsage({
          used: data._rateLimit.limit - data._rateLimit.remaining,
          limit: data._rateLimit.limit,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate comparison. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStrain1("");
    setStrain2("");
    setResult(null);
    setError("");
    setRateLimited(false);
  };

  const handleSubscribeUpgrade = () => {
    setRateLimited(false);
    // Re-submit the comparison after upgrading
    handleCompare();
  };

  if (loading) {
    return (
      <LoadingMeter
        title={`${strain1} vs ${strain2}`}
        icon="&#x2696;"
        messages={[
          "Pulling up strain profiles...",
          "Comparing terpene fingerprints...",
          "Analyzing THC and CBD levels...",
          "Weighing the effects...",
          "Cross-checking user reviews...",
          "Writing up the verdict...",
          "Almost there — finalizing the showdown...",
        ]}
      />
    );
  }

  if (rateLimited) {
    return <RateLimitPrompt onUpgraded={handleSubscribeUpgrade} />;
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
              {strain.ratio && (
                <p className="font-mono text-xs text-text-tertiary mb-3">{strain.ratio}</p>
              )}
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
                    {strain.effects.map((e) => (
                      <span key={e} className="tag text-xs">{e}</span>
                    ))}
                  </div>
                </div>
                {strain.negativeEffects && strain.negativeEffects.length > 0 && (
                  <div>
                    <span className="text-text-tertiary block mb-1">Watch Out For</span>
                    <div className="flex flex-wrap gap-1">
                      {strain.negativeEffects.map((e) => (
                        <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">{e}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-text-tertiary block mb-1">Flavors</span>
                  <div className="flex flex-wrap gap-1">
                    {strain.flavors.map((f) => (
                      <span key={f} className="tag text-xs">{f}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-text-tertiary block mb-1">Terpenes</span>
                  <div className="flex flex-wrap gap-1">
                    {strain.terpenes.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-accent-green/20 bg-accent-green/5 text-accent-green font-mono">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <span className="text-text-tertiary text-xs">Best for</span>
                  <p className="font-body font-medium">{strain.bestFor}</p>
                </div>
              </div>
              {/* Affiliate Links */}
              <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-3">
                <a
                  href={`https://www.leafly.com/search?q=${encodeURIComponent(strain.name)}`}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="text-xs text-accent-green hover:text-accent-green-light transition-colors"
                >
                  Find on Leafly &rarr;
                </a>
                <a
                  href={`https://weedmaps.com/search?q=${encodeURIComponent(strain.name)}`}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="text-xs text-text-secondary hover:text-accent-green transition-colors"
                >
                  Find on Weedmaps &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* AI Comparison */}
        <div className="tool-container">
          <h3 className="font-heading text-xl mb-4">AI Comparison</h3>
          <div className="prose prose-sm max-w-none text-text-secondary">
            {result.comparison.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-3 leading-relaxed">{paragraph}</p>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-lg bg-accent-green/5 border border-accent-green/20">
            <p className="font-heading text-sm font-semibold text-accent-green mb-1">Verdict</p>
            <p className="text-text-primary text-sm">{result.verdict}</p>
          </div>
        </div>

        <div className="text-center">
          <button onClick={handleReset} className="btn-secondary">Compare Different Strains</button>
        </div>
        {shareUrl && (
          <ShareBar
            url={shareUrl}
            text={`${strain1} vs ${strain2} — check out this strain comparison on KushSavvy!`}
          />
        )}
        {usage && <UsageCounter used={usage.used} limit={usage.limit} />}
      </div>
    );
  }

  return (
    <div className="tool-container space-y-8">
      <p className="text-text-secondary text-center">
        Type any two strain names to get an AI-powered side-by-side comparison with detailed profiles and a verdict.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AutocompleteInput
          value={strain1}
          onChange={setStrain1}
          placeholder="Type a strain name..."
          label="Strain 1"
        />
        <AutocompleteInput
          value={strain2}
          onChange={setStrain2}
          placeholder="Type a strain name..."
          label="Strain 2"
        />
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
      <TurnstileWidget onVerify={handleTurnstileVerify} />
      {usage && <UsageCounter used={usage.used} limit={usage.limit} />}
    </div>
  );
}
