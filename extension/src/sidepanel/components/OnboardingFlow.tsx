import React, { useState } from "react";
import type { ExperienceLevel, DesiredEffect, EffectToAvoid, ProductType, TimePreference, PotencyPreference, UserProfile } from "../../lib/types";
import { buildEffectVector, buildAvoidVector, buildTerpPreferenceVector, POTENCY_TARGET, TOLERANCE_PRIOR } from "../../lib/effectsMap";
import { saveUserProfile, buildDefaultProfile, getInstallationId } from "../../lib/storage";
import { syncProfileToServer } from "../../lib/profileSync";
import { setAgeVerified } from "../../lib/storage";

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  container: { display: "flex", flexDirection: "column" as const, height: "100%", background: "#fff" },
  header: { padding: "20px 20px 0", textAlign: "center" as const },
  logo: { fontSize: 24, marginBottom: 8 },
  stepTitle: { fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" },
  stepSub: { fontSize: 13, color: "#666", margin: 0 },
  content: { flex: 1, padding: "16px 20px", overflowY: "auto" as const },
  footer: { padding: "14px 20px", borderTop: "1px solid #f0f0ec", display: "flex", gap: 10 },
  btnPrimary: {
    flex: 1, padding: "12px", background: "#2D6A4F", color: "#fff",
    border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  },
  btnBack: {
    padding: "12px 16px", background: "none", border: "1px solid #ddd",
    borderRadius: 8, fontSize: 14, cursor: "pointer", color: "#666", fontFamily: "inherit",
  },
  progress: { display: "flex", gap: 4, justifyContent: "center" as const, padding: "12px 0 0" },
  dot: (active: boolean, done: boolean) => ({
    width: 6, height: 6, borderRadius: "50%",
    background: active ? "#2D6A4F" : done ? "#86efac" : "#e5e5e5",
    transition: "background 0.2s",
  }),
  optionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 },
  optionCard: (selected: boolean) => ({
    padding: "10px 12px", border: `2px solid ${selected ? "#2D6A4F" : "#e5e5e5"}`,
    borderRadius: 8, background: selected ? "#f0fdf4" : "#fff",
    cursor: "pointer", textAlign: "left" as const, transition: "all 0.15s",
  }),
  optionEmoji: { fontSize: 18, display: "block", marginBottom: 4 },
  optionLabel: (selected: boolean) => ({ fontSize: 12, fontWeight: 600, color: selected ? "#2D6A4F" : "#333", display: "block" }),
  optionDesc: { fontSize: 11, color: "#888", display: "block", marginTop: 2 },
  singleCol: { display: "flex", flexDirection: "column" as const, gap: 8, marginTop: 12 },
  radioCard: (selected: boolean) => ({
    padding: "12px 14px", border: `2px solid ${selected ? "#2D6A4F" : "#e5e5e5"}`,
    borderRadius: 8, background: selected ? "#f0fdf4" : "#fff",
    cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
  }),
  radioCircle: (selected: boolean) => ({
    width: 16, height: 16, borderRadius: "50%",
    border: `2px solid ${selected ? "#2D6A4F" : "#ccc"}`,
    background: selected ? "#2D6A4F" : "transparent", flexShrink: 0,
  }),
  radioLabel: (selected: boolean) => ({ fontSize: 13, fontWeight: selected ? 600 : 400, color: selected ? "#2D6A4F" : "#333" }),
  ageInput: { width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 16, fontFamily: "inherit", marginTop: 12, outline: "none", boxSizing: "border-box" as const },
  privacyNote: { fontSize: 11, color: "#888", textAlign: "center" as const, marginTop: 16, lineHeight: 1.5 },
  avoidGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 },
  avoidCard: (selected: boolean) => ({
    padding: "10px 12px", border: `2px solid ${selected ? "#dc2626" : "#e5e5e5"}`,
    borderRadius: 8, background: selected ? "#fff1f2" : "#fff",
    cursor: "pointer", textAlign: "left" as const, transition: "all 0.15s",
  }),
  avoidLabel: (selected: boolean) => ({ fontSize: 12, fontWeight: 600, color: selected ? "#dc2626" : "#555", display: "block" }),
  skipNote: { fontSize: 12, color: "#999", textAlign: "center" as const, marginTop: 12 },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "age" | "q1_experience" | "q2_effects" | "q3_avoid" | "q4_time" | "q5_categories" | "q6_potency" | "q7_flavors";
const STEPS: Step[] = ["age", "q1_experience", "q2_effects", "q3_avoid", "q4_time", "q5_categories", "q6_potency", "q7_flavors"];

// ─── Q1: Experience ───────────────────────────────────────────────────────────

const EXPERIENCE_OPTIONS: Array<{ value: ExperienceLevel; label: string; desc: string }> = [
  { value: "new",    label: "New to cannabis",  desc: "< 6 months experience" },
  { value: "casual", label: "Casual consumer",  desc: "A few times a month" },
  { value: "weekly", label: "Weekly consumer",  desc: "Most weekends" },
  { value: "daily",  label: "Daily consumer",   desc: "Part of my routine" },
];

// ─── Q2: Desired effects ──────────────────────────────────────────────────────

const EFFECT_OPTIONS: Array<{ value: DesiredEffect; emoji: string; label: string; desc: string }> = [
  { value: "relaxation",    emoji: "😌", label: "Relax / Unwind",     desc: "Wind down after the day" },
  { value: "creativity",    emoji: "🎨", label: "Create / Focus",      desc: "Get in a creative zone" },
  { value: "energy",        emoji: "⚡", label: "Energy / Motivation", desc: "Get things done" },
  { value: "pain_relief",   emoji: "💊", label: "Pain Relief",         desc: "Physical discomfort" },
  { value: "anxiety_relief",emoji: "🧘", label: "Calm Anxiety",        desc: "Quiet the mind" },
  { value: "social",        emoji: "🎉", label: "Social / Fun",        desc: "With friends" },
  { value: "appetite",      emoji: "🍕", label: "Appetite",            desc: "Stimulate hunger" },
  { value: "intimacy",      emoji: "💕", label: "Intimacy",            desc: "Connection" },
];

// ─── Q3: Effects to avoid ─────────────────────────────────────────────────────

const AVOID_OPTIONS: Array<{ value: EffectToAvoid; emoji: string; label: string }> = [
  { value: "paranoia",       emoji: "😰", label: "Paranoia / Anxiety" },
  { value: "couch_lock",     emoji: "🛋️", label: "Couch-lock" },
  { value: "heavy_sedation", emoji: "😴", label: "Heavy sedation" },
  { value: "racing_thoughts",emoji: "🌀", label: "Racing thoughts" },
  { value: "dry_mouth",      emoji: "💧", label: "Bad cotton-mouth" },
];

// ─── Q4: Time preference ─────────────────────────────────────────────────────

const TIME_OPTIONS: Array<{ value: TimePreference; emoji: string; label: string; desc: string }> = [
  { value: "day",      emoji: "☀️",  label: "Daytime",   desc: "Morning or afternoon" },
  { value: "night",    emoji: "🌙",  label: "Nighttime",  desc: "Evening or before bed" },
  { value: "both",     emoji: "🔄",  label: "Both",       desc: "Depends on the occasion" },
  { value: "weekends", emoji: "🎉",  label: "Weekends",   desc: "Mostly recreational" },
];

// ─── Q5: Product categories ───────────────────────────────────────────────────

const CATEGORY_OPTIONS: Array<{ value: ProductType; emoji: string; label: string }> = [
  { value: "flower",       emoji: "🌸", label: "Flower" },
  { value: "vapes",        emoji: "💨", label: "Vapes / Carts" },
  { value: "edibles",      emoji: "🍬", label: "Edibles" },
  { value: "concentrates", emoji: "💎", label: "Concentrates" },
  { value: "prerolls",     emoji: "🚬", label: "Pre-rolls" },
  { value: "tinctures",    emoji: "💧", label: "Tinctures" },
];

// ─── Q6: Potency preference ───────────────────────────────────────────────────

const POTENCY_OPTIONS: Array<{ value: PotencyPreference; label: string; desc: string; thc: string }> = [
  { value: "light",      label: "Light & easy",   desc: "Subtle effects, low THC",  thc: "< 15% THC" },
  { value: "medium",     label: "Balanced",        desc: "The sweet spot for most",  thc: "15–22% THC" },
  { value: "strong",     label: "Strong",          desc: "High tolerance or intense", thc: "22–28% THC" },
  { value: "very_strong",label: "Maximum",         desc: "Experienced users only",   thc: "> 28% THC" },
];

// ─── Q7: Flavor vibes ─────────────────────────────────────────────────────────

const FLAVOR_OPTIONS: Array<{ value: string; emoji: string; label: string }> = [
  { value: "citrus",   emoji: "🍋", label: "Citrus" },
  { value: "pine",     emoji: "🌲", label: "Pine" },
  { value: "berry",    emoji: "🫐", label: "Berry" },
  { value: "sweet",    emoji: "🍯", label: "Sweet" },
  { value: "gassy",    emoji: "⛽", label: "Gassy / Diesel" },
  { value: "earthy",   emoji: "🌿", label: "Earthy" },
  { value: "floral",   emoji: "🌸", label: "Floral" },
  { value: "spicy",    emoji: "🌶️", label: "Spicy / Pepper" },
  { value: "minty",    emoji: "🍃", label: "Minty / Fresh" },
  { value: "tropical", emoji: "🌴", label: "Tropical" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>("age");
  const [dob, setDob] = useState("");
  const [ageError, setAgeError] = useState("");

  // Q1
  const [experience, setExperience] = useState<ExperienceLevel>("casual");
  // Q2 - up to 3
  const [effects, setEffects] = useState<DesiredEffect[]>([]);
  // Q3 - up to 3
  const [avoids, setAvoids] = useState<EffectToAvoid[]>([]);
  // Q4
  const [timePreference, setTimePreference] = useState<TimePreference>("both");
  // Q5 - up to 2
  const [categories, setCategories] = useState<ProductType[]>(["flower"]);
  // Q6
  const [potency, setPotency] = useState<PotencyPreference>("medium");
  // Q7 - up to 3
  const [flavors, setFlavors] = useState<string[]>([]);

  const stepIndex = STEPS.indexOf(step);

  // ─── Age Verification ───────────────────────────────────────────────────

  function verifyAge() {
    if (!dob) { setAgeError("Please enter your date of birth."); return; }
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthday = today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    if (!hasHadBirthday) age--;
    if (age < 21) { setAgeError("You must be 21 or older to use KushSavvy."); return; }
    setAgeError("");
    setAgeVerified(true).catch(console.error);
    setStep("q1_experience");
  }

  // ─── Toggle helpers ──────────────────────────────────────────────────────

  function toggleEffect(e: DesiredEffect) {
    setEffects((prev) => prev.includes(e)
      ? prev.filter((x) => x !== e)
      : prev.length >= 3 ? prev : [...prev, e]);
  }

  function toggleAvoid(e: EffectToAvoid) {
    setAvoids((prev) => prev.includes(e)
      ? prev.filter((x) => x !== e)
      : prev.length >= 3 ? prev : [...prev, e]);
  }

  function toggleCategory(c: ProductType) {
    setCategories((prev) => prev.includes(c)
      ? prev.length > 1 ? prev.filter((x) => x !== c) : prev
      : prev.length >= 2 ? prev : [...prev, c]);
  }

  function toggleFlavor(f: string) {
    setFlavors((prev) => prev.includes(f)
      ? prev.filter((x) => x !== f)
      : prev.length >= 3 ? prev : [...prev, f]);
  }

  // ─── Complete Onboarding ─────────────────────────────────────────────────

  async function complete() {
    const installationId = await getInstallationId();

    const profile: UserProfile = {
      ...buildDefaultProfile(installationId),
      experience_level: experience,
      tolerance_prior: TOLERANCE_PRIOR[experience] ?? 0.4,
      effect_vector: buildEffectVector(effects.length > 0 ? effects : ["relaxation"]),
      avoid_vector: buildAvoidVector(avoids),
      time_preference: timePreference,
      preferred_categories: categories.length > 0 ? categories : ["flower"],
      potency_preference: potency,
      potency_target: POTENCY_TARGET[potency] ?? 0.55,
      flavor_preferences: flavors,
      terp_preference_vector: buildTerpPreferenceVector(flavors),
      onboardingComplete: true,
    };

    await saveUserProfile(profile);

    // Sync to server (non-blocking)
    syncProfileToServer(profile).catch(console.error);

    onComplete(profile);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────

  function next() {
    if (step === "age") { verifyAge(); return; }
    if (step === "q7_flavors") { complete(); return; }
    setStep(STEPS[stepIndex + 1]);
  }

  function back() {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]);
  }

  // ─── Step titles ─────────────────────────────────────────────────────────

  const titles: Record<Step, { title: string; sub: string }> = {
    age:           { title: "Welcome to KushSavvy", sub: "Your AI budtender, everywhere you shop" },
    q1_experience: { title: "Your experience level", sub: "Helps us calibrate recommendations" },
    q2_effects:    { title: "What are you looking for?", sub: "Pick up to 3 — we'll prioritize them" },
    q3_avoid:      { title: "Anything you want to avoid?", sub: "Pick up to 3 side effects (or skip)" },
    q4_time:       { title: "When do you usually consume?", sub: "Helps match daytime vs. nighttime strains" },
    q5_categories: { title: "What do you shop for?", sub: "Pick up to 2 product types" },
    q6_potency:    { title: "How strong do you like it?", sub: "We'll flag strains that don't fit" },
    q7_flavors:    { title: "Any flavor vibes?", sub: "Pick up to 3 — maps to terpene preferences (or skip)" },
  };

  const { title, sub } = titles[step];

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.logo}>🌿</div>
        <p style={s.stepTitle}>{title}</p>
        <p style={s.stepSub}>{sub}</p>
        <div style={s.progress}>
          {STEPS.map((st, i) => (
            <div key={st} style={s.dot(st === step, i < stepIndex)} />
          ))}
        </div>
      </div>

      <div style={s.content}>
        {step === "age" && (
          <AgeStep dob={dob} onDobChange={setDob} error={ageError} />
        )}
        {step === "q1_experience" && (
          <RadioStep
            options={EXPERIENCE_OPTIONS}
            value={experience}
            onChange={(v) => setExperience(v as ExperienceLevel)}
          />
        )}
        {step === "q2_effects" && (
          <GridStep
            options={EFFECT_OPTIONS}
            selected={effects}
            onToggle={(v) => toggleEffect(v as DesiredEffect)}
            max={3}
          />
        )}
        {step === "q3_avoid" && (
          <>
            <AvoidGrid avoids={avoids} onToggle={toggleAvoid} />
            <p style={s.skipNote}>Skip if nothing concerns you →</p>
          </>
        )}
        {step === "q4_time" && (
          <RadioStep
            options={TIME_OPTIONS}
            value={timePreference}
            onChange={(v) => setTimePreference(v as TimePreference)}
          />
        )}
        {step === "q5_categories" && (
          <GridStep
            options={CATEGORY_OPTIONS}
            selected={categories}
            onToggle={(v) => toggleCategory(v as ProductType)}
            max={2}
          />
        )}
        {step === "q6_potency" && (
          <PotencyStep value={potency} onChange={setPotency} />
        )}
        {step === "q7_flavors" && (
          <>
            <GridStep
              options={FLAVOR_OPTIONS}
              selected={flavors}
              onToggle={toggleFlavor}
              max={3}
            />
            <p style={s.skipNote}>Skip if you don't have a preference →</p>
          </>
        )}
      </div>

      <div style={s.footer}>
        {stepIndex > 0 && (
          <button style={s.btnBack} onClick={back}>Back</button>
        )}
        <button style={s.btnPrimary} onClick={next}>
          {step === "q7_flavors" ? "Get Insights →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AgeStep({ dob, onDobChange, error }: { dob: string; onDobChange: (v: string) => void; error: string }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: "#555", margin: "0 0 8px" }}>
        Cannabis is for adults 21+. Enter your date of birth to continue.
      </p>
      <input
        style={s.ageInput}
        type="date"
        value={dob}
        onChange={(e) => onDobChange(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
      />
      {error && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>{error}</p>}
      <p style={s.privacyNote}>
        Your profile is backed up anonymously for 90 days. No personal info stored.{" "}
        <a href="https://kushsavvy.com/extension/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#2D6A4F" }}>
          Privacy policy
        </a>
      </p>
    </div>
  );
}

function RadioStep<T extends string>({
  options, value, onChange,
}: {
  options: Array<{ value: T; emoji?: string; label: string; desc: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={s.singleCol}>
      {options.map((opt) => (
        <button key={opt.value} style={s.radioCard(value === opt.value)} onClick={() => onChange(opt.value)}>
          <div style={s.radioCircle(value === opt.value)} />
          <div>
            <span style={s.radioLabel(value === opt.value)}>
              {opt.emoji ? `${opt.emoji} ` : ""}{opt.label}
            </span>
            <span style={{ fontSize: 12, color: "#888", display: "block" }}>{opt.desc}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function GridStep({
  options, selected, onToggle, max,
}: {
  options: Array<{ value: string; emoji: string; label: string; desc?: string }>;
  selected: string[];
  onToggle: (v: string) => void;
  max: number;
}) {
  return (
    <div style={s.optionGrid}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        const isDisabled = !isSelected && selected.length >= max;
        return (
          <button
            key={opt.value}
            style={{ ...s.optionCard(isSelected), opacity: isDisabled ? 0.5 : 1 }}
            onClick={() => onToggle(opt.value)}
          >
            <span style={s.optionEmoji}>{opt.emoji}</span>
            <span style={s.optionLabel(isSelected)}>{opt.label}</span>
            {opt.desc && <span style={s.optionDesc}>{opt.desc}</span>}
          </button>
        );
      })}
    </div>
  );
}

function AvoidGrid({ avoids, onToggle }: { avoids: EffectToAvoid[]; onToggle: (v: EffectToAvoid) => void }) {
  return (
    <div style={s.avoidGrid}>
      {AVOID_OPTIONS.map((opt) => {
        const isSelected = avoids.includes(opt.value);
        return (
          <button key={opt.value} style={s.avoidCard(isSelected)} onClick={() => onToggle(opt.value)}>
            <span style={{ fontSize: 18, display: "block", marginBottom: 4 }}>{opt.emoji}</span>
            <span style={s.avoidLabel(isSelected)}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PotencyStep({ value, onChange }: { value: PotencyPreference; onChange: (v: PotencyPreference) => void }) {
  return (
    <div style={s.singleCol}>
      {POTENCY_OPTIONS.map((opt) => (
        <button key={opt.value} style={s.radioCard(value === opt.value)} onClick={() => onChange(opt.value)}>
          <div style={s.radioCircle(value === opt.value)} />
          <div>
            <span style={s.radioLabel(value === opt.value)}>{opt.label}</span>
            <span style={{ fontSize: 12, color: "#888", display: "block" }}>
              {opt.desc} · <span style={{ fontFamily: "monospace" }}>{opt.thc}</span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
