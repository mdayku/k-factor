/**
 * Create Invite API
 * Generates signed links for challenges and tracks invite.sent events
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      resultId,
      recipientEmail,
      challengeType,
      subject,
      score,
    } = await request.json();

    if (!resultId || !recipientEmail || !challengeType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique short code for signed link
    const shortCode = crypto.randomBytes(6).toString('base64url');
    
    // Create HMAC signature
    const secret = process.env.SIGNED_LINK_SECRET || "dev-secret";
    const data = `${shortCode}:${session.user.id}:${resultId}`;
    const signature = crypto
      .createHmac("sha256", secret)
      .update(data)
      .digest("base64url");

    // Generate AI-powered personalized copy
    let personalizedCopy = null;
    try {
      const agentsUrl = process.env.NEXT_PUBLIC_AGENTS_URL || "http://localhost:4000";
      const personalizationResponse = await fetch(`${agentsUrl}/agents/personalization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: `invite_${Date.now()}`,
          agentName: "personalization",
          timestamp: new Date().toISOString(),
          context: {
            persona: session.user.role || "student",
            loop: challengeType,
            userId: session.user.id,
            contextData: {
              subject,
              score,
              studentName: session.user.name,
            },
          },
        }),
      });

      if (personalizationResponse.ok) {
        const result = await personalizationResponse.json();
        personalizedCopy = {
          ...result.decision.copy,
          tone: result.decision.tone,
          aiGenerated: result.decision.aiGenerated || false,
        };
      }
    } catch (error) {
      console.warn("Failed to generate AI copy, using defaults:", error);
    }

    // Create signed link record
    const signedLink = await prisma.signedLink.create({
      data: {
        shortCode: shortCode,
        signature,
        persona: session.user.role || "student",
        context: subject,
        loop: challengeType,
        referrerId: session.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        metadata: {
          resultId,
          challengeType,
          subject,
          referrerScore: score,
          recipientEmail,
          surface: "results-page",
          // Store AI-generated copy for the invite
          copy: personalizedCopy || {
            headline: `Can you beat my ${subject} score?`,
            body: `I just scored ${score}/10! Think you can do better?`,
            cta: "Accept Challenge",
            aiGenerated: false,
          },
        },
      },
    });

    // Track invite.sent event
    await prisma.event.create({
      data: {
        type: "invite.sent",
        userId: session.user.id,
        sessionId: `session_${Date.now()}`,
        surface: "results-page",
        metadata: {
          signedLinkId: signedLink.id,
          challengeType,
          subject,
          recipientEmail,
          cohort: "control", // TODO: Get from experiment assignment
        },
      },
    });

    // In production, send email here using nodemailer
    // For now, return the link
    const inviteUrl = `${process.env.NEXTAUTH_URL}/challenge/${shortCode}`;

    return NextResponse.json({
      success: true,
      inviteUrl,
      signedLinkId: signedLink.id,
      message: "Invite sent successfully!",
    });
  } catch (error) {
    console.error("Create invite error:", error);
    return NextResponse.json(
      { error: "Failed to create invite" },
      { status: 500 }
    );
  }
}

