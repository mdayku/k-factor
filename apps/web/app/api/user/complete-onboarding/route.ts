/**
 * Complete Onboarding API
 * Marks user as having completed onboarding
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update user's onboarding status
    await prisma.user.update({
      where: { id: session.user.id },
      data: { hasCompletedOnboarding: true },
    });

    return NextResponse.json({
      success: true,
      message: "Onboarding completed",
    });
  } catch (error) {
    console.error("Complete onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

