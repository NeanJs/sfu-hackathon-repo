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
    console.log("Attempting to generate public discovery list...");
    const result = await callCompanyDiscoveryAI();
    console.log("Successfully generated public discovery list:", result);
    return result;
  } catch (error) {
    console.error("Failed to generate public discovery list:", error);
    return null;
  }
}

export async function generatePersonalizedDiscoveryList(
  preferences: UserPreferences
): Promise<CompanyDiscoveryList | null> {
  try {
    const preferencePrompt = buildPreferencePrompt(preferences);
    console.log(
      "Attempting to generate personalized discovery list with prompt:",
      preferencePrompt
    );
    const result = await callCompanyDiscoveryAI(preferencePrompt);
    console.log("Successfully generated personalized discovery list:", result);
    return result;
  } catch (error) {
    console.error("Failed to generate personalized discovery list:", error);
    return null;
  }
}

export async function generateFullAnalysisReport(
  companyName: string
): Promise<FullAnalysisReport | null> {
  try {
    console.log(
      `Attempting to generate full analysis report for ${companyName}...`
    );
    const scoreData = await callDueDiligenceAI(companyName);
    console.log("Successfully retrieved score data:", scoreData);
    const activismPlan = await callActivismAI(scoreData);
    console.log("Successfully generated activism plan:", activismPlan);

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

    console.log("Successfully generated full analysis report:", report);
    return report;
  } catch (error) {
    console.error(
      `Failed to generate full analysis for ${companyName}:`,
      error
    );
    return null;
  }
}
