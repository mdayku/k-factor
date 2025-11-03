/**
 * Create Invite API
 * Generates signed links for challenges and tracks invite.sent events
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
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

    // Create signed link record
    const signedLink = await prisma.signedLink.create({
      data: {
        code: shortCode,
        signature,
        referrerId: session.user.id,
        resultId,
        surface: "results-page",
        metadata: {
          challengeType,
          subject,
          referrerScore: score,
          recipientEmail,
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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

