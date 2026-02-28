// ─── Product Data ────────────────────────────────────────────────────────────

export interface ProductData {
  name: string;
  brand?: string;
  category: "flower" | "vape" | "edible" | "concentrate" | "preroll" | "tincture" | "topical" | "unknown";
  strainType?: "sativa" | "indica" | "hybrid";
  thc?: string;
  cbd?: string;
  terpenes?: string[];
  weight?: string;
  price?: string;
  dispensary?: string;
  productUrl: string;
  source: "weedmaps" | "leafly" | "dutchie" | "jane" | "generic";
  rawDescription?: string;
  coaLink?: string;
}

// ─── User Preferences ────────────────────────────────────────────────────────

export type ExperienceLevel = "new" | "casual" | "regular" | "daily" | "medical";
export type DesiredEffect =
  | "relaxation"
  | "creativity"
  | "energy"
  | "pain_relief"
  | "anxiety_relief"
  | "social"
  | "appetite"
  | "intimacy";
export type THCSensitivity = "mild" | "moderate" | "strong" | "terpene_focused";
export type ProductType = "flower" | "vapes" | "edibles" | "concentrates" | "prerolls" | "tinctures";

export interface UserPreferences {
  experienceLevel: ExperienceLevel;
  desiredEffects: DesiredEffect[];
  thcSensitivity: THCSensitivity;
  productTypes: ProductType[];
  installedAt: number;
  onboardingComplete: boolean;
}

// ─── Insight Response ─────────────────────────────────────────────────────────

export interface TerpeneDetail {
  name: string;
  aroma: string;
  effect: string;
  percentage?: string;
}

export interface SimilarStrain {
  name: string;
  comparison: string;
  affiliateLink?: string;
}

export interface InsightResponse {
  effects: {
    summary: string;
    primary: string[];
    bestFor: string[];
    caution: string[];
  };
  terpenes: {
    dominant: TerpeneDetail[];
    explanation: string;
  };
  dosing: {
    level: "strong" | "moderate" | "mild";
    beginner: string;
    regular: string;
    experienced: string;
  };
  matchScore?: {
    score: number;
    reasons: string[];
    mismatches: string[];
  };
  similar: SimilarStrain[];
  trustSignal: {
    status: "verified" | "caution" | "warning";
    message: string;
    details?: string;
  };
  cached: boolean;
  shareUrl?: string;
}

// ─── COA Response ─────────────────────────────────────────────────────────────

export type TestResult = "pass" | "fail" | "not_tested";
export type COAGrade = "A" | "B" | "C" | "D" | "F";

export interface COAResponse {
  labName: string;
  labAccredited: boolean;
  testDate: string;
  safetyTests: {
    pesticides: TestResult;
    heavyMetals: TestResult;
    microbial: TestResult;
    solvents: TestResult;
    mycotoxins: TestResult;
  };
  potency: {
    thc: string;
    thca: string;
    cbd: string;
    totalThc: string;
    matchesLabel: boolean;
    discrepancy?: string;
  };
  terpeneProfile?: TerpeneDetail[];
  redFlags: string[];
  summary: string;
  grade: COAGrade;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

export interface CachedInsight {
  data: InsightResponse;
  cachedAt: number;
  ttl: number; // ms
}

export interface ExtensionStorage {
  preferences?: UserPreferences;
  cachedInsights?: Record<string, CachedInsight>; // key: `${name}:${category}`
  installationId?: string;
  insightsUsedToday?: number;
  insightsResetDate?: string; // ISO date string
  ageVerified?: boolean;
  accountEmail?: string;
}

// ─── Extension Messages ───────────────────────────────────────────────────────

export type MessageType =
  | "PRODUCT_DETECTED"
  | "GET_INSIGHT"
  | "OPEN_SIDE_PANEL"
  | "HIGHLIGHT_LOOKUP"
  | "INSIGHT_RESPONSE"
  | "ERROR";

export interface ExtensionMessage {
  type: MessageType;
  payload?: unknown;
}

export interface ProductDetectedMessage extends ExtensionMessage {
  type: "PRODUCT_DETECTED";
  payload: ProductData;
}

export interface GetInsightMessage extends ExtensionMessage {
  type: "GET_INSIGHT";
  payload: ProductData;
}

export interface HighlightLookupMessage extends ExtensionMessage {
  type: "HIGHLIGHT_LOOKUP";
  payload: { text: string };
}
