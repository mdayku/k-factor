/**
 * Orchestrator Agent API
 * Decides which viral loop to activate for a given context
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { logOrchestratorDecision, logIncentivesDecision } from "../../../../lib/agents";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { surface, score, streak, sessionCount } = body;

    // Orchestrator decides which loop to activate
    const selectedLoop = await logOrchestratorDecision(session.user.id, {
      surface,
      score,
      streak,
      sessionCount,
    });

    // Incentives agent decides what reward to offer
    const incentive = await logIncentivesDecision(session.user.id, {
      loop: selectedLoop,
      previousInvites: body.previousInvites || 0,
    });

    return NextResponse.json({
      success: true,
      selectedLoop,
      incentive,
    });
  } catch (error) {
    console.error("Orchestration error:", error);
    return NextResponse.json(
      { error: "Failed to orchestrate" },
      { status: 500 }
    );
  }
}

