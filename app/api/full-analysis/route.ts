import { NextResponse } from 'next/server';
import { generateFullAnalysisReport } from '@/app/lib/data_orchestrator';

export async function POST(request: Request) {
  try {
    const { companyName } = await request.json();
    if (!companyName) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }
    const fullReport = await generateFullAnalysisReport(companyName);
    return NextResponse.json(fullReport);
  } catch (error) {
    console.error("Error in full analysis API route:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
