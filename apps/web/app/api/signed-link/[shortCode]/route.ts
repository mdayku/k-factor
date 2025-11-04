/**
 * Get Signed Link API
 * Retrieves signed link data for attribution tracking
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params;

    const signedLink = await prisma.signedLink.findUnique({
      where: { shortCode },
      include: {
        referrer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!signedLink) {
      return NextResponse.json(
        { error: "Challenge link not found or expired" },
        { status: 404 }
      );
    }

    // Check if expired
    if (signedLink.expiresAt && new Date() > signedLink.expiresAt) {
      return NextResponse.json(
        { error: "Challenge link has expired" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      id: signedLink.id,
      referrerId: signedLink.referrerId,
      referrerName: signedLink.referrer.name || signedLink.referrer.email,
      persona: signedLink.persona,
      context: signedLink.context,
      loop: signedLink.loop,
      metadata: signedLink.metadata,
      createdAt: signedLink.createdAt,
    });
  } catch (error) {
    console.error("Get signed link error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve challenge link" },
      { status: 500 }
    );
  }
}

