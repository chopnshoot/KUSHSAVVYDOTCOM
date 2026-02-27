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

interface CountryLawData {
  country: string;
  code: string;
  legalStatus: string;
  recreational: boolean;
  medical: boolean;
  summary: string;
  recentChanges: string;
}

const statusColors: Record<string, string> = {
  "Fully Legal": "bg-green-100 text-green-800 border-green-300",
  "Medical Only": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Decriminalized": "bg-orange-100 text-orange-800 border-orange-300",
  "Partially Legal": "bg-blue-100 text-blue-800 border-blue-300",
  "Illegal": "bg-red-100 text-red-800 border-red-300",
};

const statusBgColors: Record<string, string> = {
  "Fully Legal": "bg-green-500",
  "Medical Only": "bg-yellow-500",
  "Decriminalized": "bg-orange-500",
  "Partially Legal": "bg-blue-500",
  "Illegal": "bg-red-500",
};

type Tab = "us" | "international";

export default function IsItLegal({
  states,
  countries,
}: {
  states: StateLawData[];
  countries: CountryLawData[];
}) {
  const [tab, setTab] = useState<Tab>("us");
  const [selectedState, setSelectedState] = useState<StateLawData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryLawData | null>(null);

  const handleStateSelect = (abbreviation: string) => {
    const state = states.find((s) => s.abbreviation === abbreviation);
    setSelectedState(state || null);
  };

  const handleCountrySelect = (code: string) => {
    const country = countries.find((c) => c.code === code);
    setSelectedCountry(country || null);
  };

  // Sort US states alphabetically
  const sortedStates = [...states].sort((a, b) => a.state.localeCompare(b.state));
  // Countries already sorted in seed file
  const sortedCountries = countries;

  const activeLegend =
    tab === "us"
      ? ["Fully Legal", "Medical Only", "Decriminalized", "Illegal"]
      : ["Fully Legal", "Partially Legal", "Medical Only", "Decriminalized"];

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex rounded-xl border border-border overflow-hidden mb-8">
        <button
          onClick={() => {
            setTab("us");
            setSelectedCountry(null);
          }}
          className={`flex-1 px-4 py-3 font-heading text-sm transition-colors ${
            tab === "us"
              ? "bg-accent-green text-white"
              : "bg-surface text-text-secondary hover:bg-tag-bg"
          }`}
        >
          United States
        </button>
        <button
          onClick={() => {
            setTab("international");
            setSelectedState(null);
          }}
          className={`flex-1 px-4 py-3 font-heading text-sm transition-colors ${
            tab === "international"
              ? "bg-accent-green text-white"
              : "bg-surface text-text-secondary hover:bg-tag-bg"
          }`}
        >
          International
        </button>
      </div>

      {/* ─── US STATES TAB ─────────────────────────────────────────────────────── */}
      {tab === "us" && (
        <>
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
              {sortedStates.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.state}
                </option>
              ))}
            </select>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6">
              {activeLegend.map((status) => (
                <div key={status} className="flex items-center gap-2 text-sm text-text-secondary">
                  <div className={`w-3 h-3 rounded-full ${statusBgColors[status]}`}></div>
                  <span>{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* State Results */}
          {selectedState && (
            <div className="space-y-6 animate-in fade-in duration-300">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="card p-5">
                  <p className="text-text-tertiary text-sm mb-1">Recreational</p>
                  <p className="font-semibold text-lg">
                    {selectedState.recreationalLegal ? "Legal" : "Not Legal"}
                  </p>
                </div>
                <div className="card p-5">
                  <p className="text-text-tertiary text-sm mb-1">Medical</p>
                  <p className="font-semibold text-lg">
                    {selectedState.medicalLegal ? "Legal" : "Not Legal"}
                  </p>
                </div>
                <div className="card p-5">
                  <p className="text-text-tertiary text-sm mb-1">Minimum Age</p>
                  <p className="font-mono font-semibold text-lg">
                    {selectedState.ageRequirement}+
                  </p>
                </div>
                <div className="card p-5">
                  <p className="text-text-tertiary text-sm mb-1">
                    Recreational Possession Limit
                  </p>
                  <p className="font-semibold">{selectedState.possessionLimitRec}</p>
                </div>
                <div className="card p-5">
                  <p className="text-text-tertiary text-sm mb-1">
                    Medical Possession Limit
                  </p>
                  <p className="font-semibold">{selectedState.possessionLimitMed}</p>
                </div>
                <div className="card p-5">
                  <p className="text-text-tertiary text-sm mb-1">Where to Buy</p>
                  <p className="font-semibold">{selectedState.purchaseLocations}</p>
                </div>
                <div className="card p-5">
                  <p className="text-text-tertiary text-sm mb-1">Home Growing</p>
                  <p className="font-semibold">
                    {selectedState.homeGrowAllowed
                      ? selectedState.homeGrowLimit
                      : "Not Allowed"}
                  </p>
                </div>
              </div>

              {selectedState.publicConsumption && (
                <div className="card p-6">
                  <h3 className="font-heading text-lg mb-2">Public Consumption</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {selectedState.publicConsumption}
                  </p>
                </div>
              )}

              {selectedState.recentChanges && (
                <div className="card p-6">
                  <h3 className="font-heading text-lg mb-2">Recent Changes</h3>
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </>
      )}

      {/* ─── INTERNATIONAL TAB ─────────────────────────────────────────────────── */}
      {tab === "international" && (
        <>
          <div className="tool-container mb-8">
            <label className="block font-heading text-lg mb-3">
              Select a country
            </label>
            <select
              onChange={(e) => handleCountrySelect(e.target.value)}
              value={selectedCountry?.code || ""}
              className="w-full p-4 rounded-xl border-2 border-border bg-surface text-text-primary font-body text-lg focus:border-accent-green focus:outline-none transition-colors"
            >
              <option value="">Choose a country...</option>
              {sortedCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.country}
                </option>
              ))}
            </select>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6">
              {activeLegend.map((status) => (
                <div key={status} className="flex items-center gap-2 text-sm text-text-secondary">
                  <div className={`w-3 h-3 rounded-full ${statusBgColors[status]}`}></div>
                  <span>{status}</span>
                </div>
              ))}
            </div>

            <p className="text-text-tertiary text-xs mt-4">
              Only countries where cannabis is legal, partially legal, medical-only, or decriminalized are listed.
              Countries where cannabis is fully illegal are excluded.
            </p>
          </div>

          {/* Country Results */}
          {selectedCountry && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center">
                <h2 className="font-heading text-2xl md:text-3xl mb-4">
                  Cannabis Laws in {selectedCountry.country}
                </h2>
                <div
                  className={`inline-flex items-center px-6 py-3 rounded-full border-2 text-lg font-semibold ${
                    statusColors[selectedCountry.legalStatus] || ""
                  }`}
                >
                  {selectedCountry.legalStatus}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-5">
                  <p className="text-text-tertiary text-sm mb-1">Recreational</p>
                  <p className="font-semibold text-lg">
                    {selectedCountry.recreational ? "Legal" : "Not Legal"}
                  </p>
                </div>
                <div className="card p-5">
                  <p className="text-text-tertiary text-sm mb-1">Medical</p>
                  <p className="font-semibold text-lg">
                    {selectedCountry.medical ? "Legal" : "Not Legal"}
                  </p>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-heading text-lg mb-2">Overview</h3>
                <p className="text-text-secondary leading-relaxed">
                  {selectedCountry.summary}
                </p>
              </div>

              {selectedCountry.recentChanges && (
                <div className="card p-6">
                  <h3 className="font-heading text-lg mb-2">Recent Changes</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {selectedCountry.recentChanges}
                  </p>
                </div>
              )}

              {selectedCountry.recreational && (
                <div className="bg-accent-green/5 rounded-2xl p-6 text-center border border-accent-green/20">
                  <h3 className="font-heading text-xl mb-2">
                    Cannabis is legal in {selectedCountry.country}!
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
        </>
      )}
    </div>
  );
}
