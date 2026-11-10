export interface PropertyInput {
  locality: string;
  bhk: number;
  carpet_sqft: number;
  floor: number;
  total_floors: number;
  age_years: number;
  parking: string;
  facing: string;
  furnishing?: string;
  society_amenities?: string;
  lat?: number;
  lng?: number;
}

export interface ShapFactor {
  factor: string;
  impact_lakhs: number;
  direction: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface ComparableProperty {
  id: string;
  society: string;
  locality: string;
  sub_locality: string;
  bhk: number;
  carpet_sqft: number;
  builtup_sqft: number;
  floor: number;
  total_floors: number;
  age_years: number;
  parking: string;
  facing: string;
  lat: number;
  lng: number;
  price_lakhs: number;
  price_per_sqft_carpet: number;
  sale_date: string;
  verified_source: string;
  distance_km: number;
  similarity_score: number;
  adjusted_price_lakhs: number;
  adjustment_notes: string;
}

export interface GovernmentBenchmark {
  ready_reckoner_rate_carpet: number;
  ready_reckoner_rate_builtup: number;
  government_floor_value_lakhs: number;
  market_premium_pct: number;
  stamp_duty_pct: number;
  stamp_duty_estimate_lakhs: number;
  registration_charge_inr: number;
  statutory_authority: string;
  statutory_note: string;
}

export interface SurroundingLocalityAnalysis {
  surrounding_rate_premium_per_sqft: number;
  nearest_transit: {
    name: string;
    distance_km: number;
  };
  nearest_employment_hub: {
    name: string;
    distance_km: number;
  };
  indices: {
    transit_accessibility: number;
    employment_proximity: number;
    walkability_score: number;
    civic_infrastructure: number;
  };
  amenities_count: {
    within_500m: number;
    within_1500m: number;
    within_3000m: number;
  };
  sample_surrounding_pois: Array<{
    name: string;
    type: string;
    distance_km: number;
  }>;
}

export interface GeminiAiLayer {
  source: string;
  livability_summary: string;
  infrastructure_catalysts: string[];
  rental_yield_outlook: string;
  appraisal_verdict: string;
}

export interface ValuationResult {
  estimated_value_lakhs: number;
  value_range_lakhs: {
    min: number;
    max: number;
    confidence_level: string;
  };
  rate_per_sqft_carpet: number;
  property_summary: {
    locality: string;
    district: string;
    region: string;
    authority: string;
    formatted_address: string;
    bhk: number;
    carpet_sqft: number;
    builtup_sqft_est: number;
    floor: number;
    total_floors: number;
    age_years: number;
    parking: string;
    lat: number;
    lng: number;
  };
  government_benchmark: GovernmentBenchmark;
  explainability_waterfall: {
    baseline_expected_lakhs: number;
    factors: ShapFactor[];
  };
  surrounding_locality_analysis: SurroundingLocalityAnalysis;
  geospatial_scores: {
    transit_score: number;
    employment_score: number;
    walkability_score: number;
    civic_score: number;
    nearest_metro_km: number;
    nearest_job_hub_km: number;
  };
  gemini_ai_layer: GeminiAiLayer;
  comparable_properties: ComparableProperty[];
}

export interface InfrastructureNode {
  name: string;
  category: string;
  lat: number;
  lng: number;
  impact_radius_km?: number;
}

export interface AppraisalMemorandum {
  memorandum_id: string;
  valuation_date: string;
  valuation_standard: string;
  executive_summary: string;
  statutory_analysis: string;
  infrastructure_highlights: string;
  comparable_reconciliation: string;
  risk_and_sensitivity_factors: string[];
  appraiser_note: string;
}

export interface ChatParseResponse {
  parsed_property: PropertyInput;
  valuation: ValuationResult;
  ai_reply: string;
}
