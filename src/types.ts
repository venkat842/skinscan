export enum SkinType {
  Oily = "Oily",
  Dry = "Dry",
  Combination = "Combination",
  Normal = "Normal",
  Sensitive = "Sensitive"
}

export enum Severity {
  Mild = "Mild",
  Moderate = "Moderate",
  Severe = "Severe"
}

export interface SkinConcern {
  concern: string; // e.g. "Acne", "Hyperpigmentation", "Redness", "Fine Lines", "Dryness"
  severity: Severity;
  visualEvidence: string; // Describe what was detected (e.g., "Mild redness around cheeks", "Slight congestion on the forehead")
  details: string; // Brief educational explanation of this concern
}

export interface CommercialProduct {
  name: string; // e.g. "Salicylic Acid 2% Cleanser", "Niacinamide 10% Serum"
  category: string; // e.g. "Cleanser", "Serum", "Moisturizer", "Sunscreen"
  activeIngredients: string[];
  purpose: string; // Why this ingredient is recommended for their concern
  howToUse: string; // Recommendations on frequency and time of day (e.g., "Use in PM after cleansing")
  searchQuery: string; // Used to build URLs for search
}

export interface NaturalRemedy {
  name: string; // e.g. "Aloe Vera Gel", "Colloidal Oatmeal Mask", "Green Tea Compress"
  ingredients: string[];
  purpose: string; // What concern it targets and how it helps
  instructions: string[]; // Step-by-step prep and application instructions
  precautions: string; // e.g., "Do a patch test first"
}

export interface SkinAnalysisResponse {
  skinType: SkinType;
  overallScore: number; // 0-100 overall health score estimation based on hydration and barrier state
  assessment: string; // Overall human-friendly analysis text
  detectedConcerns: SkinConcern[];
  commercialRecommendations: CommercialProduct[];
  naturalRecommendations: NaturalRemedy[];
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  imageUrl: string; // Data URL or placeholder
  analysis: SkinAnalysisResponse;
}
