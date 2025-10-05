// --- USER PROFILE & PREFERENCES ---
export interface UserPreferences {
  pmv_future: 'Less' | 'Stay the same' | 'More';
  pmv_protection: 'Protecting traditional values' | 'Balancing tradition and progress' | 'Supporting social change';
  pmv_economy: 'Lower taxes and markets' | 'Mixed approach' | 'Programs to reduce inequality';
}

export interface ProfileQuestion {
  key: keyof UserPreferences;
  question: string;
  options: { value: UserPreferences[keyof UserPreferences]; label: string; pmv: 'A' | 'B' | 'C' }[];
  criteria: Record<string, string>; // Changed to Record<string, string> for flexibility
}

// --- COMPANY DATA MODELS ---
export interface DiscoveryCompany {
  company_name: string;
  summary_violation: string; // 1-sentence summary of anti-SDG activity.
  logo_url?: string; // New field for company logo URL
  category?: string; // New field for company category
}

export interface CompanyDiscoveryList {
  discovery_list_title: string;
  companies: DiscoveryCompany[];
}

export interface Violation {
  violation_type: string;
  sdg_impacted: string;
  source: string;
  date: string;
  actionable_summary: string;
}

export interface ScoreData {
  company_name: string;
  transparency_score: number; // 1 to 10
  primary_sdg_violation: string;
  risk_summary: string; // 1-2 sentence summary
  detailed_violations: Violation[];
}

export interface RecommendedAction {
  category: 'Economic Pressure' | 'Political Advocacy' | 'Social/Media Campaign';
  label: string;
  description: string;
}

export interface ActivismPlan {
  action_plan_title: string;
  recommended_actions: RecommendedAction[];
  template_script: string; // Copy/paste script for user
}

// --- FINAL CONSOLIDATED REPORT ---
export interface FullAnalysisReport {
  company_name: string;
  score_data: ScoreData;
  activism_plan: ActivismPlan;
  // Mock fields (for future AI implementation)
  ethical_reinvestment_idea: string; 
  pipeline_control_status: string; 
}

// Represents a company being analyzed.
export interface Company {
  name: string;
  ticker_symbol?: string;
  industry: string;
  logo_url?: string; // New field for company logo URL
  category?: string; // New field for company category
}

// The structured output from the due diligence AI call.
// ...existing code...
