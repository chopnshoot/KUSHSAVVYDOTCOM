export interface Terpene {
  _id: string;
  name: string;
  slug: { current: string };
  aroma: string;
  effects: string[];
  alsoFoundIn: string[];
  commonStrains: string[];
  description: string;
  researchSummary: string;
  color: string;
}

export interface StateLaw {
  _id: string;
  state: string;
  slug: { current: string };
  abbreviation: string;
  legalStatus: "Fully Legal" | "Medical Only" | "Decriminalized" | "Illegal";
  recreationalLegal: boolean;
  medicalLegal: boolean;
  possessionLimitRec: string;
  possessionLimitMed: string;
  ageRequirement: number;
  homeGrowAllowed: boolean;
  homeGrowLimit: string;
  purchaseLocations: "Dispensaries" | "Delivery Only" | "Both" | "N/A";
  publicConsumption: string;
  recentChanges: string;
  regulatoryUrl: string;
  lastUpdated: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
  category: string;
  tags: string[];
  featuredImage?: SanityImage;
  author: string;
  publishedAt: string;
  relatedTools: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface StrainRecommendation {
  name: string;
  type: "Indica" | "Sativa" | "Hybrid";
  ratio: string;
  thc_range: string;
  cbd_range: string;
  terpenes: string[];
  effects: string[];
  flavors: string[];
  best_for: string;
  description: string;
  why_for_you: string;
}

export interface DosageResult {
  recommendedDose: string;
  onsetTime: string;
  duration: string;
  peakWindow: string;
  safetyTips: string[];
  tooMuchGuide: string[];
}

export interface ToolInfo {
  slug: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
}
