import { NextResponse } from "next/server";
import { generatePublicDiscoveryList } from "@/app/lib/data_orchestrator";


export async function GET() {
  try {
    const discoveryList = await generatePublicDiscoveryList();
    return NextResponse.json(discoveryList);
  } catch (error) {
    console.error("Error in test API route:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
