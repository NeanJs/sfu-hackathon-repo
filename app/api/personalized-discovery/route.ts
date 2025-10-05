import { NextResponse } from 'next/server';
import { generatePersonalizedDiscoveryList } from '@/app/lib/data_orchestrator';
import { UserPreferences } from '@/app/lib/types';

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
