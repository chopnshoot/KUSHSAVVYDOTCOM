// ─── Product Data ─────────────────────────────────────────────────────────────

export interface ProductData {
  name: string;
  brand?: string;
  category: "flower" | "vape" | "edible" | "concentrate" | "preroll" | "tincture" | "topical" | "unknown";
  subcategory?: string;
  strainType?: "sativa" | "indica" | "hybrid";
  thc?: string;
  thcPercent?: number;
  cbd?: string;
  cbdPercent?: number;
  terpenes?: string[];
  terpenesParsed?: Array<{ name: string; percent?: number }>;
  weight?: string;
  price?: string;
  priceAmount?: number;
  dispensary?: string;
  productUrl: string;
  source: "weedmaps" | "leafly" | "dutchie" | "jane" | "generic";
  rawDescription?: string;
  coaLink?: string;
  siteTags?: { effects: string[]; flavors: string[] };
  reviews?: Array<{ rating?: number; text: string; capturedAt: string }>;
  reviewCount?: number;
  imageUrls?: string[];
  geoHint?: { state?: string; city?: string };
}

// ─── Page Capture Event ───────────────────────────────────────────────────────

export interface PageCaptureEvent {
  event_type: "page_capture";
  event_version: "1.0";
  captured_at_utc: string;
  user: {
    anonymous_device_id: string;
    consent_flags: {
      capture_enabled: boolean;
      send_reviews: boolean;
    };
  };
  source: {
    domain: string;
    url: string;
    page_type: "product" | "strain" | "review" | "menu";
    geo_hint?: { state?: string; city?: string };
  };
  extracted: {
    product_name: string;
    brand_name?: string;
    category: string;
    subcategory?: string;
    strain_display_name?: string;
    strain_type_claimed?: string;
    price?: { amount: number; currency: string };
    unit_size?: { value: number; unit: string };
    potency: { thc_percent?: number; cbd_percent?: number };
    terpenes: Array<{ name: string; percent?: number }>;
    site_tags: { effects: string[]; flavors: string[] };
    reviews: {
      count_visible: number;
      items: Array<{ rating?: number; text: string; captured_at_utc: string }>;
    };
  };
  evidence: {
    description_text?: string;
    ingredients_text?: string;
    lab_report_url?: string;
    dom_snapshot_hash: string;
  };
}

// ─── User Profile (vector-based, from 7-question onboarding) ─────────────────

export type ExperienceLevel = "new" | "casual" | "weekly" | "daily";
export type DesiredEffect =
  | "relaxation"
  | "creativity"
  | "energy"
  | "pain_relief"
  | "anxiety_relief"
  | "social"
  | "appetite"
  | "intimacy";
export type EffectToAvoid =
  | "paranoia"
  | "couch_lock"
  | "heavy_sedation"
  | "racing_thoughts"
  | "dry_mouth";
export type ProductType = "flower" | "vapes" | "edibles" | "concentrates" | "prerolls" | "tinctures";
export type TimePreference = "day" | "night" | "both" | "weekends";
export type PotencyPreference = "light" | "medium" | "strong" | "very_strong";

export interface UserProfile {
  installationId: string;
  profile_version: "1.0";
  createdAt: number;
  updatedAt: number;
  onboardingComplete: boolean;
  profileBackupEnabled: boolean;

  // Q1: Experience
  experience_level: ExperienceLevel;
  tolerance_prior: number;                      // 0–1

  // Q2: Desired effects → normalized weight vector
  effect_vector: Record<string, number>;         // { focus: 0.34, calm: 0.33 }

  // Q3: Effects to avoid → penalty vector
  avoid_vector: Record<string, number>;          // { anxiety_risk: 0.5 }

  // Q4: Time preference
  time_preference: TimePreference;

  // Q5: Product categories
  preferred_categories: ProductType[];

  // Q6: Potency preference
  potency_preference: PotencyPreference;
  potency_target: number;                        // 0.30 / 0.55 / 0.75 / 0.90

  // Q7: Flavor vibes → terpene preference vector
  flavor_preferences: string[];
  terp_preference_vector: Record<string, number>;

  budget_range?: { min: number; max: number };

  // Learned (V1.5) — initialized empty
  learned_effect_vector: Record<string, number>;
  learned_terp_vector: Record<string, number>;
  feedback_count: number;
  sessions_count: number;

  favorites: FavoriteEntry[];
  feedback_log: FeedbackEntry[];
}

// ─── Favorites & Feedback ─────────────────────────────────────────────────────

export interface FavoriteEntry {
  strainKey: string;
  strainName: string;
  category: string;
  strainType?: string;
  effectTags: string[];
  terpeneTags: string[];
  potencyLevel: string;
  dispensary?: string;
  price?: string;
  productUrl?: string;
  savedAt: number;
  canonical_product_id?: string;
}

export interface FeedbackEntry {
  strainKey: string;
  strainName: string;
  signal: "thumbs_up" | "thumbs_down";
  timestamp: number;
  strainEffectTags: string[];
  strainTerpeneTags: string[];
  canonical_product_id?: string;
}

// ─── Strain Profile (returned by /api/extension/insights) ────────────────────

export type PotencyLevel = "mild" | "moderate" | "strong" | "very_strong";

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

export interface StrainProfile {
  effectTags: string[];
  terpeneTags: string[];
  avoidanceTags: string[];
  useCaseTags: string[];
  potencyLevel: PotencyLevel;
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
  similar: SimilarStrain[];
  trustSignal: {
    status: "verified" | "caution" | "warning";
    message: string;
    details?: string;
  };
  cached: boolean;
  shareUrl?: string;
}

// ─── Puff or Pass Score (from /api/v1/score/product) ─────────────────────────

export type ScoreLabel =
  | "Perfect match"
  | "Great match"
  | "Good fit"
  | "Decent option"
  | "Use caution"
  | "Probably skip";

export interface PuffOrPassScore {
  canonical_product_id?: string;
  consensus: {
    score: number;
    confidence: number;
    top_reasons: string[];
    sample_size: number;
  } | null;
  personalized: {
    score: number;
    confidence: number;
    score_label: ScoreLabel;
    why_it_matches: string[];
    watch_out_for: string[];
  };
  data_quality: {
    has_coa: boolean;
    has_terp_table: boolean;
    review_count: number;
    contradictions: number;
    overall_confidence: number;
  };
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

export interface CachedStrainProfile {
  data: StrainProfile;
  cachedAt: number;
  ttl: number;
}

export interface ExtensionStorage {
  userProfile?: UserProfile;
  preferences?: LegacyUserPreferences;
  cachedInsights?: Record<string, unknown>;
  installationId?: string;
  insightsUsedToday?: number;
  insightsResetDate?: string;
  ageVerified?: boolean;
  accountEmail?: string;
}

export interface LegacyUserPreferences {
  experienceLevel: string;
  desiredEffects: string[];
  thcSensitivity: string;
  productTypes: string[];
  installedAt: number;
  onboardingComplete: boolean;
}

// Backward-compat alias
export type UserPreferences = LegacyUserPreferences;

// ─── Extension Messages ────────────────────────────────────────────────────────

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
