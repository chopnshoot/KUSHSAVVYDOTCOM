"use client";

import { useState } from "react";
import Link from "next/link";

interface StateLawData {
  state: string;
  abbreviation: string;
  legalStatus: string;
  recreationalLegal: boolean;
  medicalLegal: boolean;
  possessionLimitRec: string;
  possessionLimitMed: string;
  ageRequirement: number;
  homeGrowAllowed: boolean;
  homeGrowLimit: string;
  purchaseLocations: string;
  publicConsumption: string;
  recentChanges: string;
  regulatoryUrl: string;
}

const statusColors: Record<string, string> = {
  "Fully Legal": "bg-green-100 text-green-800 border-green-300",
  "Medical Only": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Decriminalized": "bg-orange-100 text-orange-800 border-orange-300",
  "Illegal": "bg-red-100 text-red-800 border-red-300",
};

const statusBgColors: Record<string, string> = {
  "Fully Legal": "bg-green-500",
  "Medical Only": "bg-yellow-500",
  "Decriminalized": "bg-orange-500",
  "Illegal": "bg-red-500",
};

export default function IsItLegal({
  states,
}: {
  states: StateLawData[];
}) {
  const [selectedState, setSelectedState] = useState<StateLawData | null>(null);

  const handleStateSelect = (abbreviation: string) => {
    const state = states.find((s) => s.abbreviation === abbreviation);
    setSelectedState(state || null);
  };

  return (
    <div>
      {/* State Selector */}
      <div className="tool-container mb-8">
        <label className="block font-heading text-lg mb-3">
          Select your state
        </label>
        <select
          onChange={(e) => handleStateSelect(e.target.value)}
          value={selectedState?.abbreviation || ""}
          className="w-full p-4 rounded-xl border-2 border-border bg-surface text-text-primary font-body text-lg focus:border-accent-green focus:outline-none transition-colors"
        >
          <option value="">Choose a state...</option>
          {states.map((state) => (
            <option key={state.abbreviation} value={state.abbreviation}>
              {state.state}
            </option>
          ))}
        </select>

        {/* Quick Legend */}
        <div className="flex flex-wrap gap-4 mt-6">
          {Object.entries(statusBgColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2 text-sm text-text-secondary">
              <div className={`w-3 h-3 rounded-full ${color}`}></div>
              <span>{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {selectedState && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Status Header */}
          <div className="text-center">
            <h2 className="font-heading text-2xl md:text-3xl mb-4">
              Cannabis Laws in {selectedState.state}
            </h2>
            <div
              className={`inline-flex items-center px-6 py-3 rounded-full border-2 text-lg font-semibold ${
                statusColors[selectedState.legalStatus] || ""
              }`}
            >
              {selectedState.legalStatus}
            </div>
          </div>

          {/* Quick Facts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">
                Recreational
              </p>
              <p className="font-semibold text-lg">
                {selectedState.recreationalLegal
                  ? "Legal"
                  : "Not Legal"}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">
                Medical
              </p>
              <p className="font-semibold text-lg">
                {selectedState.medicalLegal ? "Legal" : "Not Legal"}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">
                Minimum Age
              </p>
              <p className="font-mono font-semibold text-lg">
                {selectedState.ageRequirement}+
              </p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">
                Recreational Possession Limit
              </p>
              <p className="font-semibold">
                {selectedState.possessionLimitRec}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">
                Medical Possession Limit
              </p>
              <p className="font-semibold">
                {selectedState.possessionLimitMed}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">
                Where to Buy
              </p>
              <p className="font-semibold">
                {selectedState.purchaseLocations}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-text-tertiary text-sm mb-1">
                Home Growing
              </p>
              <p className="font-semibold">
                {selectedState.homeGrowAllowed
                  ? selectedState.homeGrowLimit
                  : "Not Allowed"}
              </p>
            </div>
          </div>

          {/* Details */}
          {selectedState.publicConsumption && (
            <div className="card p-6">
              <h3 className="font-heading text-lg mb-2">
                Public Consumption
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {selectedState.publicConsumption}
              </p>
            </div>
          )}

          {selectedState.recentChanges && (
            <div className="card p-6">
              <h3 className="font-heading text-lg mb-2">
                Recent Changes
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {selectedState.recentChanges}
              </p>
            </div>
          )}

          {selectedState.regulatoryUrl && (
            <div className="text-center">
              <a
                href={selectedState.regulatoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Visit {selectedState.state} Cannabis Authority
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}

          {/* CTA for legal states */}
          {selectedState.recreationalLegal && (
            <div className="bg-accent-green/5 rounded-2xl p-6 text-center border border-accent-green/20">
              <h3 className="font-heading text-xl mb-2">
                Cannabis is legal in {selectedState.state}!
              </h3>
              <p className="text-text-secondary mb-4">
                Find your perfect strain with our AI recommendation tool.
              </p>
              <Link href="/tools/strain-recommender" className="btn-primary">
                Find Your Strain
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
