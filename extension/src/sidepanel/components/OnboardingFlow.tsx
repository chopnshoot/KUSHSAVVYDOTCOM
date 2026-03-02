import React, { useState } from "react";
import type {
  UserPreferences,
  ExperienceLevel,
  DesiredEffect,
  THCSensitivity,
  ProductType,
} from "../../lib/types";
import { savePreferences, setAgeVerified } from "../../lib/storage";

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    background: "#fff",
  },
  header: {
    padding: "20px 20px 0",
    textAlign: "center" as const,
  },
  logo: { fontSize: 24, marginBottom: 8 },
  stepTitle: { fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" },
  stepSub: { fontSize: 13, color: "#666", margin: 0 },
  content: {
    flex: 1,
    padding: "20px",
    overflowY: "auto" as const,
  },
  footer: {
    padding: "16px 20px",
    borderTop: "1px solid #f0f0ec",
    display: "flex",
    gap: 10,
  },
  btnPrimary: {
    flex: 1,
    padding: "12px",
    background: "#2D6A4F",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnBack: {
    padding: "12px 16px",
    background: "none",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    color: "#666",
    fontFamily: "inherit",
  },
  progress: {
    display: "flex",
    gap: 4,
    justifyContent: "center" as const,
    padding: "12px 0 0",
  },
  dot: (active: boolean, done: boolean) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: active ? "#2D6A4F" : done ? "#86efac" : "#e5e5e5",
    transition: "background 0.2s",
  }),
  optionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginTop: 12,
  },
  optionCard: (selected: boolean) => ({
    padding: "10px 12px",
    border: `2px solid ${selected ? "#2D6A4F" : "#e5e5e5"}`,
    borderRadius: 8,
    background: selected ? "#f0fdf4" : "#fff",
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "all 0.15s",
  }),
  optionEmoji: { fontSize: 18, display: "block", marginBottom: 4 },
  optionLabel: (selected: boolean) => ({
    fontSize: 12,
    fontWeight: 600,
    color: selected ? "#2D6A4F" : "#333",
    display: "block",
  }),
  optionDesc: {
    fontSize: 11,
    color: "#888",
    display: "block",
    marginTop: 2,
  },
  singleCol: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
    marginTop: 12,
  },
  radioCard: (selected: boolean) => ({
    padding: "12px 14px",
    border: `2px solid ${selected ? "#2D6A4F" : "#e5e5e5"}`,
    borderRadius: 8,
    background: selected ? "#f0fdf4" : "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all 0.15s",
  }),
  radioLabel: (selected: boolean) => ({
    fontSize: 13,
    fontWeight: selected ? 600 : 400,
    color: selected ? "#2D6A4F" : "#333",
  }),
  radioCircle: (selected: boolean) => ({
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: `2px solid ${selected ? "#2D6A4F" : "#ccc"}`,
    background: selected ? "#2D6A4F" : "transparent",
    flexShrink: 0,
  }),
  ageInput: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 16,
    fontFamily: "inherit",
    marginTop: 12,
    outline: "none",
  },
  privacyNote: {
    fontSize: 11,
    color: "#888",
    textAlign: "center" as const,
    marginTop: 16,
    lineHeight: 1.5,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface OnboardingFlowProps {
  onComplete: (prefs: UserPreferences) => void;
}

type Step = "age" | "experience" | "effects" | "thc" | "products";

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>("age");
  const [dob, setDob] = useState("");
  const [ageError, setAgeError] = useState("");
  const [experience, setExperience] = useState<ExperienceLevel>("casual");
  const [effects, setEffects] = useState<DesiredEffect[]>([]);
  const [thcSensitivity, setThcSensitivity] = useState<THCSensitivity>("moderate");
  const [productTypes, setProductTypes] = useState<ProductType[]>(["flower"]);

  const steps: Step[] = ["age", "experience", "effects", "thc", "products"];
  const stepIndex = steps.indexOf(step);

  // ─── Age Verification ───────────────────────────────────────────────────

  function verifyAge() {
    if (!dob) {
      setAgeError("Please enter your date of birth.");
      return;
    }
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthday =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    const actualAge = hasHadBirthday ? age : age - 1;

    if (actualAge < 21) {
      setAgeError("You must be 21 or older to use KushSavvy.");
      return;
    }

    setAgeError("");
    setAgeVerified(true).catch(console.error);
    setStep("experience");
  }

  // ─── Toggle Multi-Select ────────────────────────────────────────────────

  function toggleEffect(effect: DesiredEffect) {
    setEffects((prev) =>
      prev.includes(effect) ? prev.filter((e) => e !== effect) : [...prev, effect]
    );
  }

  function toggleProductType(pt: ProductType) {
    setProductTypes((prev) =>
      prev.includes(pt) ? prev.filter((p) => p !== pt) : [...prev, pt]
    );
  }

  // ─── Complete Onboarding ─────────────────────────────────────────────────

  async function complete() {
    const prefs: UserPreferences = {
      experienceLevel: experience,
      desiredEffects: effects.length > 0 ? effects : ["relaxation"],
      thcSensitivity,
      productTypes: productTypes.length > 0 ? productTypes : ["flower"],
      installedAt: Date.now(),
      onboardingComplete: true,
    };
    await savePreferences(prefs);
    onComplete(prefs);
  }

  // ─── Render Steps ─────────────────────────────────────────────────────────

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.logo}>🌿</div>
        {step === "age" ? (
          <>
            <p style={s.stepTitle}>Welcome to KushSavvy</p>
            <p style={s.stepSub}>Your AI budtender, everywhere you shop</p>
          </>
        ) : (
          <>
            <p style={s.stepTitle}>
              {step === "experience" && "Your Experience Level"}
              {step === "effects" && "What Are You Looking For?"}
              {step === "thc" && "THC Sensitivity"}
              {step === "products" && "Product Types You Use"}
            </p>
            <p style={s.stepSub}>
              {step === "experience" && "Helps us tailor dosing guidance"}
              {step === "effects" && "Select all that apply"}
              {step === "thc" && "We'll personalize potency guidance"}
              {step === "products" && "Select all that apply"}
            </p>
          </>
        )}
        <div style={s.progress}>
          {steps.map((s_, i) => (
            <div key={s_} style={s.dot(s_ === step, i < stepIndex)} />
          ))}
        </div>
      </div>

      <div style={s.content}>
        {step === "age" && (
          <AgeStep dob={dob} onDobChange={setDob} error={ageError} />
        )}
        {step === "experience" && (
          <ExperienceStep value={experience} onChange={setExperience} />
        )}
        {step === "effects" && (
          <EffectsStep selected={effects} onToggle={toggleEffect} />
        )}
        {step === "thc" && (
          <THCStep value={thcSensitivity} onChange={setThcSensitivity} />
        )}
        {step === "products" && (
          <ProductTypesStep selected={productTypes} onToggle={toggleProductType} />
        )}
      </div>

      <div style={s.footer}>
        {stepIndex > 0 && (
          <button style={s.btnBack} onClick={() => setStep(steps[stepIndex - 1])}>
            Back
          </button>
        )}
        <button
          style={s.btnPrimary}
          onClick={() => {
            if (step === "age") verifyAge();
            else if (step === "products") complete();
            else setStep(steps[stepIndex + 1]);
          }}
        >
          {step === "products" ? "Start Getting Insights →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ─── Step: Age ────────────────────────────────────────────────────────────────

function AgeStep({
  dob,
  onDobChange,
  error,
}: {
  dob: string;
  onDobChange: (v: string) => void;
  error: string;
}) {
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
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>{error}</p>
      )}
      <p style={s.privacyNote}>
        KushSavvy only reads product info from dispensary websites you visit.
        We never track your general browsing.{" "}
        <a
          href="https://kushsavvy.com/extension/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2D6A4F" }}
        >
          Privacy policy
        </a>
      </p>
    </div>
  );
}

// ─── Step: Experience ─────────────────────────────────────────────────────────

const EXPERIENCE_OPTIONS: Array<{
  value: ExperienceLevel;
  label: string;
  desc: string;
}> = [
  { value: "new", label: "New to cannabis", desc: "< 6 months experience" },
  { value: "casual", label: "Casual user", desc: "A few times per month" },
  { value: "regular", label: "Regular user", desc: "Weekly" },
  { value: "daily", label: "Daily user", desc: "Every day" },
  { value: "medical", label: "Medical patient", desc: "Using for health reasons" },
];

function ExperienceStep({
  value,
  onChange,
}: {
  value: ExperienceLevel;
  onChange: (v: ExperienceLevel) => void;
}) {
  return (
    <div style={s.singleCol}>
      {EXPERIENCE_OPTIONS.map((opt) => (
        <button key={opt.value} style={s.radioCard(value === opt.value)} onClick={() => onChange(opt.value)}>
          <div style={s.radioCircle(value === opt.value)} />
          <div>
            <span style={s.radioLabel(value === opt.value)}>{opt.label}</span>
            <span style={{ fontSize: 12, color: "#888", display: "block" }}>{opt.desc}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Step: Effects ────────────────────────────────────────────────────────────

const EFFECT_OPTIONS: Array<{ value: DesiredEffect; emoji: string; label: string; desc: string }> =
  [
    { value: "relaxation", emoji: "😌", label: "Relaxation / Sleep", desc: "Wind down & unwind" },
    { value: "creativity", emoji: "🎨", label: "Creativity / Focus", desc: "Get in the zone" },
    { value: "energy", emoji: "⚡", label: "Energy / Motivation", desc: "Get things done" },
    { value: "pain_relief", emoji: "💊", label: "Pain Relief", desc: "Physical discomfort" },
    { value: "anxiety_relief", emoji: "🧘", label: "Anxiety Relief", desc: "Calm the mind" },
    { value: "social", emoji: "🎉", label: "Social / Fun", desc: "With friends" },
    { value: "appetite", emoji: "🍕", label: "Appetite", desc: "Munchies welcome" },
    { value: "intimacy", emoji: "💕", label: "Intimacy", desc: "Connection" },
  ];

function EffectsStep({
  selected,
  onToggle,
}: {
  selected: DesiredEffect[];
  onToggle: (e: DesiredEffect) => void;
}) {
  return (
    <div style={s.optionGrid}>
      {EFFECT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          style={s.optionCard(selected.includes(opt.value))}
          onClick={() => onToggle(opt.value)}
        >
          <span style={s.optionEmoji}>{opt.emoji}</span>
          <span style={s.optionLabel(selected.includes(opt.value))}>{opt.label}</span>
          <span style={s.optionDesc}>{opt.desc}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Step: THC Sensitivity ────────────────────────────────────────────────────

const THC_OPTIONS: Array<{ value: THCSensitivity; label: string; desc: string }> = [
  { value: "mild", label: "Mild effects", desc: "Lower THC, gentler experience" },
  { value: "moderate", label: "Balanced effects", desc: "Moderate THC, steady experience" },
  { value: "strong", label: "Strong effects", desc: "High THC, full experience" },
  { value: "terpene_focused", label: "Terpene-focused", desc: "THC doesn't matter — I care about effects" },
];

function THCStep({
  value,
  onChange,
}: {
  value: THCSensitivity;
  onChange: (v: THCSensitivity) => void;
}) {
  return (
    <div style={s.singleCol}>
      {THC_OPTIONS.map((opt) => (
        <button key={opt.value} style={s.radioCard(value === opt.value)} onClick={() => onChange(opt.value)}>
          <div style={s.radioCircle(value === opt.value)} />
          <div>
            <span style={s.radioLabel(value === opt.value)}>{opt.label}</span>
            <span style={{ fontSize: 12, color: "#888", display: "block" }}>{opt.desc}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Step: Product Types ──────────────────────────────────────────────────────

const PRODUCT_OPTIONS: Array<{ value: ProductType; emoji: string; label: string }> = [
  { value: "flower", emoji: "🌸", label: "Flower" },
  { value: "vapes", emoji: "💨", label: "Vapes / Carts" },
  { value: "edibles", emoji: "🍬", label: "Edibles" },
  { value: "concentrates", emoji: "💎", label: "Concentrates" },
  { value: "prerolls", emoji: "🚬", label: "Pre-rolls" },
  { value: "tinctures", emoji: "💧", label: "Tinctures / Topicals" },
];

function ProductTypesStep({
  selected,
  onToggle,
}: {
  selected: ProductType[];
  onToggle: (p: ProductType) => void;
}) {
  return (
    <div style={s.optionGrid}>
      {PRODUCT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          style={s.optionCard(selected.includes(opt.value))}
          onClick={() => onToggle(opt.value)}
        >
          <span style={s.optionEmoji}>{opt.emoji}</span>
          <span style={s.optionLabel(selected.includes(opt.value))}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
