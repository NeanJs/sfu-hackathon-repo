'use client'

// Functionality: CompanyDetail data types

export interface Violation {
  violation_type?: string
  sdg_impacted?: string
  source?: string
  date?: string
  actionable_summary?: string
  [key: string]: unknown
}

export interface ScoreData {
  company_name?: string
  transparency_score?: number | null
  primary_sdg_violation?: string
  risk_summary?: string
  logo_url?: string
  category?: string
  detailed_violations?: Violation[]
  [key: string]: unknown
}

export interface RecommendedAction {
  category?: string
  description?: string
  label?: string
  [key: string]: unknown
}

export interface ActivismPlan {
  action_plan_title?: string
  recommended_actions?: RecommendedAction[]
  template_script?: string
  [key: string]: unknown
}

export interface CompanyFullAnalysis {
  company_name?: string
  score_data?: ScoreData
  activism_plan?: ActivismPlan
  ethical_reinvestment_idea?: string
  pipeline_control_status?: string
  [key: string]: unknown
}

export interface CompanyDetailProps {
  companyName: string
  data?: CompanyFullAnalysis
  className?: string
}


