import { DosageResult } from "./types";

type ExperienceLevel = "never" | "beginner" | "intermediate" | "experienced" | "high_tolerance";
type WeightRange = "under130" | "130-180" | "180-230" | "over230" | "unspecified";
type Intensity = "microdose" | "mild" | "moderate" | "strong" | "very_strong";
type EdibleType = "gummy" | "chocolate" | "baked" | "beverage" | "tincture" | "capsule";

const baseDoses: Record<ExperienceLevel, [number, number]> = {
  never: [1, 2.5],
  beginner: [2.5, 5],
  intermediate: [5, 15],
  experienced: [15, 30],
  high_tolerance: [30, 50],
};

const intensityMultiplier: Record<Intensity, number> = {
  microdose: 0.3,
  mild: 0.6,
  moderate: 1.0,
  strong: 1.4,
  very_strong: 1.8,
};

const weightMultiplier: Record<WeightRange, number> = {
  under130: 0.85,
  "130-180": 1.0,
  "180-230": 1.15,
  over230: 1.3,
  unspecified: 1.0,
};

const onsetTimes: Record<EdibleType, string> = {
  gummy: "30-60 minutes",
  chocolate: "30-60 minutes",
  baked: "45-90 minutes",
  beverage: "15-30 minutes",
  tincture: "15-45 minutes (sublingual) or 30-90 minutes (swallowed)",
  capsule: "45-90 minutes",
};

const durations: Record<EdibleType, string> = {
  gummy: "4-6 hours",
  chocolate: "4-6 hours",
  baked: "6-8 hours",
  beverage: "3-5 hours",
  tincture: "4-6 hours",
  capsule: "6-8 hours",
};

const peakWindows: Record<EdibleType, string> = {
  gummy: "1.5-3 hours after consumption",
  chocolate: "1.5-3 hours after consumption",
  baked: "2-4 hours after consumption",
  beverage: "1-2 hours after consumption",
  tincture: "1-2.5 hours after consumption",
  capsule: "2-4 hours after consumption",
};

export function calculateDosage(
  experience: ExperienceLevel,
  weight: WeightRange,
  intensity: Intensity,
  edibleType: EdibleType
): DosageResult {
  const [baseMin, baseMax] = baseDoses[experience];
  const intMult = intensityMultiplier[intensity];
  const wMult = weightMultiplier[weight];

  let doseMin = Math.round(baseMin * intMult * wMult * 10) / 10;
  let doseMax = Math.round(baseMax * intMult * wMult * 10) / 10;

  doseMin = Math.max(0.5, doseMin);
  doseMax = Math.max(doseMin + 0.5, doseMax);

  const recommendedDose =
    doseMin === doseMax
      ? `${doseMin}mg`
      : `${doseMin}-${doseMax}mg THC`;

  return {
    recommendedDose,
    onsetTime: onsetTimes[edibleType],
    duration: durations[edibleType],
    peakWindow: peakWindows[edibleType],
    safetyTips: [
      "Start low, go slow. You can always take more, but you cannot take less.",
      "Wait at least 2 hours before considering taking more.",
      "Eat a small meal before consuming edibles for more predictable effects.",
      "Stay hydrated — keep water nearby.",
      "Have CBD on hand — it may help counteract excessive THC effects.",
      "Avoid mixing with alcohol, especially if you are inexperienced.",
      "Tell someone you trust what you are taking, especially if it is your first time.",
    ],
    tooMuchGuide: [
      "Stay calm — no one has ever fatally overdosed on cannabis. This will pass.",
      "Find a comfortable, safe place to sit or lie down.",
      "Take deep, slow breaths. Inhale for 4 counts, hold for 4, exhale for 4.",
      "Chew on black peppercorns — the caryophyllene terpene may help reduce anxiety.",
      "If available, take CBD — it can counteract some THC effects.",
      "Stay hydrated with water or a sweet beverage.",
      "Distract yourself with familiar, comforting content (a favorite show, music).",
      "Sleep it off if possible — effects will be gone when you wake up.",
      "Remember: the effects are temporary and will typically subside within a few hours.",
    ],
  };
}

export const experienceLevels = [
  { value: "never", label: "Never tried edibles" },
  { value: "beginner", label: "Beginner (tried a few times)" },
  { value: "intermediate", label: "Intermediate (regular use)" },
  { value: "experienced", label: "Experienced (frequent use)" },
  { value: "high_tolerance", label: "High tolerance (daily use)" },
] as const;

export const weightRanges = [
  { value: "under130", label: "Under 130 lbs" },
  { value: "130-180", label: "130-180 lbs" },
  { value: "180-230", label: "180-230 lbs" },
  { value: "over230", label: "Over 230 lbs" },
  { value: "unspecified", label: "Prefer not to say" },
] as const;

export const intensityLevels = [
  { value: "microdose", label: "Microdose / Subtle" },
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "strong", label: "Strong" },
  { value: "very_strong", label: "Very strong" },
] as const;

export const edibleTypes = [
  { value: "gummy", label: "Gummy" },
  { value: "chocolate", label: "Chocolate" },
  { value: "baked", label: "Baked good" },
  { value: "beverage", label: "Beverage" },
  { value: "tincture", label: "Tincture" },
  { value: "capsule", label: "Capsule" },
] as const;
