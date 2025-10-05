import { NextResponse } from 'next/server';
import { generatePersonalizedDiscoveryList } from '@/app/lib/data_orchestrator';
import { UserPreferences } from '@/app/lib/types';
import { firebaseConfig } from "../../../firebase.config"; // Import your Firebase config

// Set global Firebase config variables for the API route's execution context
(global as any).__firebase_config = JSON.stringify(firebaseConfig);
(global as any).__app_id = firebaseConfig.appId;
(global as any).__initial_auth_token = ""; // Initial auth token can be empty for personalized discovery

export async function POST(request: Request) {
  try {
    const preferences: UserPreferences = await request.json();
    const personalizedList = await generatePersonalizedDiscoveryList(preferences);
    return NextResponse.json(personalizedList);
  } catch (error) {
    console.error("Error in personalized discovery API route:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
