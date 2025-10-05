import { callGeminiApi } from "./utils";
import { CompanyDiscoveryList, ScoreData, ActivismPlan } from "./types";

const groundingTool = [{ google_search: {} }];

// --- PROMPT SCHEMAS ---

const aiDiscoveryPrompt = {
  role: "You are an ethical data curator...",
  system_instruction:
    "Output must be a single, valid JSON object. The output should be a JSON string, not a JSON object directly.",
  output_schema: {
    type: "OBJECT",
    properties: {
      discovery_list_title: { type: "STRING" },
      companies: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            company_name: { type: "STRING" },
            category: { type: "STRING" },
            summary_violation: { type: "STRING" },
            logo_url: { type: "STRING", description: "URL of the company's logo" }, // New field
            category: { type: "STRING", description: "Industry or sector category of the company" }, // New field
          },
        },
        maxItems: 20, // Increased to 20 companies
      },
    },
  },
};

const aiDueDiligencePrompt = {
  role: "You are a professional corporate due diligence analyst...",
  system_instruction:
    "Output must be a single, valid JSON object. The output should be a JSON string, not a JSON object directly.",
  output_schema: {
    type: "OBJECT",
    properties: {
      company_name: { type: "STRING" },
      transparency_score: { type: "INTEGER" },
      primary_sdg_violation: { type: "STRING" },
      risk_summary: { type: "STRING" },
      logo_url: { type: "STRING", description: "URL of the company's logo" }, // New field
      category: {
        type: "STRING",
        description: "Industry or sector category of the company",
      }, // New field
      detailed_violations: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            violation_type: { type: "STRING" },
            sdg_impacted: { type: "STRING" },
            source: { type: "STRING" },
            date: { type: "STRING" },
            actionable_summary: { type: "STRING" },
          },
        },
      },
    },
  },
};

const aiActivismPrompt = {
  role: "You are a grassroots activist...",
  system_instruction: "Output must be a single, valid JSON object.",
  output_schema: {
    type: "OBJECT",
    properties: {
      action_plan_title: { type: "STRING" },
      recommended_actions: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            category: {
              type: "STRING",
              enum: [
                "Economic Pressure",
                "Political Advocacy",
                "Social/Media Campaign",
              ],
            },
            label: { type: "STRING" },
            description: { type: "STRING" },
          },
        },
      },
      template_script: { type: "STRING" },
    },
  },
};

// --- API FUNCTIONS ---

export async function callCompanyDiscoveryAI(
  preferencePrompt?: string
): Promise<CompanyDiscoveryList> {
  try {
    console.log("Calling Gemini API for company discovery...");
    const userInput = `Generate a list of the 20 most high-risk companies based on recent anti-UNSDG activities. Apply extra scrutiny to companies whose violations align with the user's core political and moral values: ${
      preferencePrompt || "general market trends"
    }. For each company, also provide its primary industry/sector category and a direct link to its official logo image file (e.g., .png, .svg, .jpg) that is directly embeddable in an HTML <img> tag. If a direct image link is not found, provide a placeholder or a link to a page where the logo is prominently displayed. IMPORTANT: Ensure each company name is distinct and not combined with other company names (e.g., 'Uber' not 'Uber, DoorDash'). The output MUST be a JSON string matching the following schema: ${JSON.stringify(
      aiDiscoveryPrompt.output_schema
    )}`;

    const response = await callGeminiApi(
      userInput,
      aiDiscoveryPrompt.system_instruction,
      groundingTool,
      undefined // Removed responseSchema here
    );
    console.log("Gemini API response received:", response);

    return JSON.parse(response) as CompanyDiscoveryList;
  } catch (error) {
    console.error("Error in callCompanyDiscoveryAI:", error);
    throw error;
  }
}

export async function callDueDiligenceAI(
  companyName: string
): Promise<ScoreData> {
  try {
    const userInput = `Perform a comprehensive due diligence analysis on the company "${companyName}". Use your search tool to find recent, verifiable data from government, NGO, and news databases regarding their compliance with UN Sustainable Development Goals (UNSDGs). Also, find the company's official logo URL and its primary industry/sector category. Based on your findings, generate a detailed report structured according to the provided schema. The output MUST be a JSON string matching the following schema: ${JSON.stringify(
      aiDueDiligencePrompt.output_schema
    )}`;

    const response = await callGeminiApi(
      userInput,
      aiDueDiligencePrompt.system_instruction,
      groundingTool,
      undefined // Removed responseSchema here
    );
    return JSON.parse(response) as ScoreData;
  } catch (error) {
    console.error(`Error in callDueDiligenceAI for ${companyName}:`, error);
    throw error;
  }
}

export async function callActivismAI(
  scoreData: ScoreData
): Promise<ActivismPlan> {
  try {
    const userInput = `Based on the following risk data JSON, generate a three-point activism plan focusing on economic, political, and social pressure.\n\n${JSON.stringify(
      scoreData,
      null,
      2
    )}`;

    const response = await callGeminiApi(
      userInput,
      aiActivismPrompt.system_instruction,
      undefined,
      aiActivismPrompt.output_schema // Kept responseSchema here as no tools are used
    );
    return JSON.parse(response) as ActivismPlan;
  } catch (error) {
    console.error(
      `Error in callActivismAI for ${scoreData.company_name}:`,
      error
    );
    throw error;
  }
}
