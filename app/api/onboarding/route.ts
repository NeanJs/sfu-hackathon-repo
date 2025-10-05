import { NextResponse } from "next/server";
import { PROFILE_QUESTIONS } from "@/app/lib/user_profile";

export async function GET() {
  try {
    return NextResponse.json(PROFILE_QUESTIONS);
  } catch (error) {
    console.error("Error in onboarding API route:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
