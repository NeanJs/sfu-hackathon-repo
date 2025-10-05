// --- USER PROFILE & PREFERENCES ---
export interface UserPreferences {
  economicStance: string; // E.g., 'Pro-regulation'
  environmentalStance: string; // E.g., 'Aggressive climate action'
  laborStance: string; // E.g., 'Strong union support'
  socialStance: string; // E.g., 'Prioritize community wealth'
}

export interface ProfileQuestion {
  key: keyof UserPreferences;
  question: string;
  placeholder: string;
}

// --- COMPANY DATA MODELS ---
export interface DiscoveryCompany {
  company_name: string;
  summary_violation: string; // 1-sentence summary of anti-SDG activity.
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
