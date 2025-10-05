import {
  UserPreferences,
  FullAnalysisReport,
  CompanyDiscoveryList,
} from "./types";
import { buildPreferencePrompt } from "./user_profile";
import {
  callCompanyDiscoveryAI,
  callDueDiligenceAI,
  callActivismAI,
} from "./gemini_service";
export async function generatePublicDiscoveryList(): Promise<CompanyDiscoveryList | null> {
  try {
    const result = await callCompanyDiscoveryAI();

    return result;
  } catch (error) {
    return null;
  }
}

export async function generatePersonalizedDiscoveryList(
  preferences: UserPreferences
): Promise<CompanyDiscoveryList | null> {
  try {
    const preferencePrompt = buildPreferencePrompt(preferences);

    const result = await callCompanyDiscoveryAI(preferencePrompt);

    return result;
  } catch (error) {
    return null;
  }
}

export async function generateFullAnalysisReport(
  companyName: string
): Promise<FullAnalysisReport | null> {
  try {
    const scoreData = await callDueDiligenceAI(companyName);

    const activismPlan = await callActivismAI(scoreData);

    const report: FullAnalysisReport = {
      company_name: scoreData.company_name,
      score_data: scoreData,
      activism_plan: activismPlan,
      ethical_reinvestment_idea:
        scoreData.transparency_score > 7
          ? "High-yield green energy bonds."
          : "Community-focused credit union.",
      pipeline_control_status:
        scoreData.transparency_score > 8
          ? "Flagged for Divestment Review"
          : "Monitored",
    };

    return report;
  } catch (error) {
    console.error(
      `Failed to generate full analysis for ${companyName}:`,
      error
    );
    return null;
  }
}
