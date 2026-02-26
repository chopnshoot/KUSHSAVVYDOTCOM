"use client";

import { useState, useEffect } from "react";

interface JournalEntry {
  id: string;
  strain: string;
  type: string;
  rating: number;
  effects: string[];
  notes: string;
  date: string;
  method: string;
}

const effectOptions = [
  "Relaxed", "Euphoric", "Creative", "Focused", "Sleepy",
  "Energetic", "Happy", "Hungry", "Giggly", "Uplifted",
  "Anxious", "Paranoid", "Dry Mouth", "Couch-lock",
];

const methodOptions = ["Smoke", "Vape", "Edible", "Tincture", "Dab", "Topical"];

const typeOptions = ["Indica", "Sativa", "Hybrid"];

export default function StrainJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [strain, setStrain] = useState("");
  const [type, setType] = useState("");
  const [rating, setRating] = useState(0);
  const [effects, setEffects] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("kushsavvy-journal");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntries = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem("kushsavvy-journal", JSON.stringify(updated));
  };

  const toggleEffect = (effect: string) => {
    setEffects((prev) =>
      prev.includes(effect) ? prev.filter((e) => e !== effect) : [...prev, effect]
    );
  };

  const handleSubmit = () => {
    if (!strain.trim() || !rating) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      strain: strain.trim(),
      type: type || "Hybrid",
      rating,
      effects,
      notes: notes.trim(),
      date: new Date().toISOString().split("T")[0],
      method: method || "Smoke",
    };
    saveEntries([entry, ...entries]);
    resetForm();
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter((e) => e.id !== id));
  };

  const resetForm = () => {
    setShowForm(false);
    setStrain("");
    setType("");
    setRating(0);
    setEffects([]);
    setNotes("");
    setMethod("");
  };

  const typeColors: Record<string, string> = {
    Indica: "bg-indica/10 text-indica",
    Sativa: "bg-sativa/10 text-sativa",
    Hybrid: "bg-hybrid/10 text-hybrid",
  };

  const avgRating = entries.length
    ? (entries.reduce((sum, e) => sum + e.rating, 0) / entries.length).toFixed(1)
    : "—";

  const topEffects = entries.length
    ? Object.entries(
        entries.flatMap((e) => e.effects).reduce<Record<string, number>>((acc, eff) => {
          acc[eff] = (acc[eff] || 0) + 1;
          return acc;
        }, {})
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name]) => name)
    : [];

  if (showForm) {
    return (
      <div className="tool-container space-y-6">
        <h2 className="font-heading text-xl mb-2">Log a Session</h2>

        {/* Strain Name */}
        <div>
          <label className="block font-heading text-base mb-2">Strain Name</label>
          <input
            type="text"
            value={strain}
            onChange={(e) => setStrain(e.target.value)}
            placeholder="e.g. Blue Dream"
            className="w-full p-4 rounded-xl border-2 border-border bg-surface text-text-primary font-body focus:border-accent-green focus:outline-none transition-colors"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block font-heading text-base mb-2">Type</label>
          <div className="flex gap-3">
            {typeOptions.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-xl border-2 transition-all ${
                  type === t
                    ? "border-accent-green bg-accent-green/5 text-accent-green"
                    : "border-border hover:border-accent-green/30"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Method */}
        <div>
          <label className="block font-heading text-base mb-2">Method</label>
          <div className="flex flex-wrap gap-2">
            {methodOptions.map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-4 py-2 rounded-xl border-2 transition-all text-sm ${
                  method === m
                    ? "border-accent-green bg-accent-green/5 text-accent-green"
                    : "border-border hover:border-accent-green/30"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block font-heading text-base mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform hover:scale-110 ${
                  star <= rating ? "text-warm" : "text-border"
                }`}
              >
                &#9733;
              </button>
            ))}
          </div>
        </div>

        {/* Effects */}
        <div>
          <label className="block font-heading text-base mb-2">Effects Felt</label>
          <div className="flex flex-wrap gap-2">
            {effectOptions.map((eff) => (
              <button
                key={eff}
                onClick={() => toggleEffect(eff)}
                className={`px-3 py-1 rounded-full text-sm border transition-all ${
                  effects.includes(eff)
                    ? "border-accent-green bg-accent-green/10 text-accent-green"
                    : "border-border text-text-secondary hover:border-accent-green/30"
                }`}
              >
                {eff}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-heading text-base mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was the experience? Any standout moments?"
            rows={3}
            className="w-full p-4 rounded-xl border-2 border-border bg-surface text-text-primary font-body focus:border-accent-green focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button onClick={resetForm} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!strain.trim() || !rating}
            className="btn-primary flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Save Entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface rounded-xl p-4 border border-border text-center">
            <p className="text-text-tertiary text-sm">Entries</p>
            <p className="font-mono text-2xl font-bold">{entries.length}</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-border text-center">
            <p className="text-text-tertiary text-sm">Avg Rating</p>
            <p className="font-mono text-2xl font-bold text-warm">{avgRating}</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-border text-center">
            <p className="text-text-tertiary text-sm">Strains Tried</p>
            <p className="font-mono text-2xl font-bold">
              {new Set(entries.map((e) => e.strain.toLowerCase())).size}
            </p>
          </div>
        </div>
      )}

      {/* Top Effects */}
      {topEffects.length > 0 && (
        <div className="tool-container">
          <p className="text-text-tertiary text-sm mb-2">Your most common effects</p>
          <div className="flex flex-wrap gap-2">
            {topEffects.map((eff) => (
              <span key={eff} className="tag">{eff}</span>
            ))}
          </div>
        </div>
      )}

      {/* Add Button */}
      <div className="text-center">
        <button onClick={() => setShowForm(true)} className="btn-primary text-lg px-10 py-4">
          Log a Session
        </button>
      </div>

      {/* Entries List */}
      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-card border border-border bg-surface p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-heading text-lg">{entry.strain}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[entry.type] || "bg-tag-bg text-text-secondary"}`}>
                      {entry.type}
                    </span>
                    <span className="text-text-tertiary text-xs">{entry.method}</span>
                    <span className="text-text-tertiary text-xs">{entry.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-warm">
                    {Array.from({ length: entry.rating }, (_, i) => (
                      <span key={i}>&#9733;</span>
                    ))}
                  </span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-text-tertiary hover:text-red-500 transition-colors text-sm"
                    aria-label="Delete entry"
                  >
                    &#10005;
                  </button>
                </div>
              </div>
              {entry.effects.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {entry.effects.map((eff) => (
                    <span key={eff} className="tag text-xs">{eff}</span>
                  ))}
                </div>
              )}
              {entry.notes && (
                <p className="text-text-secondary text-sm">{entry.notes}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="tool-container text-center py-12">
          <p className="text-text-tertiary text-lg mb-2">No entries yet</p>
          <p className="text-text-secondary text-sm">Start logging your sessions to track your preferences and discover patterns.</p>
        </div>
      )}
    </div>
  );
}
