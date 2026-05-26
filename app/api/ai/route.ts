import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// TODO: Re-enable Anthropic AI when package is added back
// import Anthropic from "@anthropic-ai/sdk";
// const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // TODO: AI insights disabled - Anthropic package temporarily removed
  // Will be re-enabled once package is reinstalled
  return NextResponse.json({ 
    insights: [
      { 
        type: "info", 
        title: "AI Insights Coming Soon", 
        message: "AI-powered insights will be available once the Anthropic API is configured." 
      }
    ] 
  });
}
