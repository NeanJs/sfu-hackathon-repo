import { NextResponse } from "next/server";
import { PROFILE_QUESTIONS } from "@/app/lib/user_profile";
import { saveUserPreferences } from "@/app/lib/firestore_service";
import { generatePersonalizedDiscoveryList } from "@/app/lib/data_orchestrator";
import { UserPreferences } from "@/app/lib/types";
import { firebaseConfig } from "../../../firebase.config";

// Set Firebase config for server-side operations
(global as any).__firebase_config = JSON.stringify(firebaseConfig);
(global as any).__app_id = firebaseConfig.appId;

export async function GET() {
  try {
    return NextResponse.json(PROFILE_QUESTIONS);
  } catch (error) {
    console.error("Error in onboarding API route:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const preferences: UserPreferences = await request.json();

    // Validate that all required fields are present
    const requiredKeys = ["pmv_future", "pmv_protection", "pmv_economy"];
    for (const key of requiredKeys) {
      if (!(key in preferences)) {
        return NextResponse.json(
          { error: `Missing required field: ${key}` },
          { status: 400 }
        );
      }
    }

    await saveUserPreferences(preferences);
    // Generate personalized company list using Gemini
    const companyList = await generatePersonalizedDiscoveryList(preferences);
    return NextResponse.json({
      message: "Preferences saved successfully",
      companyList,
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
