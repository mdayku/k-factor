/**
 * Parental Consent API
 * Handles verification of parental consent for COPPA compliance
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { token, consent } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Consent token required" },
        { status: 400 }
      );
    }

    // Find consent request
    const consentRequest = await prisma.parentalConsent.findUnique({
      where: { consentToken: token },
    });

    if (!consentRequest) {
      return NextResponse.json(
        { error: "Invalid or expired consent token" },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date() > consentRequest.expiresAt) {
      return NextResponse.json(
        { error: "Consent token has expired" },
        { status: 400 }
      );
    }

    // Check if already processed
    if (consentRequest.consentGiven !== false) {
      return NextResponse.json(
        { error: "Consent already processed" },
        { status: 400 }
      );
    }

    // Update consent
    await prisma.parentalConsent.update({
      where: { consentToken: token },
      data: {
        consentGiven: consent === true,
        consentDate: new Date(),
      },
    });

    // Update child user account
    if (consent === true) {
      await prisma.user.update({
        where: { id: consentRequest.childUserId },
        data: {
          parentalConsent: true,
          coppaCompliant: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Parental consent granted. The child account is now active.",
      });
    } else {
      // Consent denied - deactivate account or mark as non-compliant
      await prisma.user.update({
        where: { id: consentRequest.childUserId },
        data: {
          parentalConsent: false,
          coppaCompliant: false,
        },
      });

      return NextResponse.json({
        success: true,
        message:
          "Parental consent denied. The child account cannot be activated.",
      });
    }
  } catch (error) {
    console.error("Parental consent error:", error);
    return NextResponse.json(
      { error: "Failed to process consent" },
      { status: 500 }
    );
  }
}

// Get consent request details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token required" },
        { status: 400 }
      );
    }

    const consentRequest = await prisma.parentalConsent.findUnique({
      where: { consentToken: token },
      include: {
        childUser: {
          select: {
            name: true,
            email: true,
            age: true,
            role: true,
          },
        },
      },
    });

    if (!consentRequest) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date() > consentRequest.expiresAt) {
      return NextResponse.json(
        { error: "Consent link has expired" },
        { status: 400 }
      );
    }

    // Check if already processed
    if (consentRequest.consentGiven !== false) {
      return NextResponse.json(
        {
          error: "Consent already processed",
          alreadyProcessed: true,
          consentGiven: consentRequest.consentGiven,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      childName: consentRequest.childUser?.name,
      childEmail: consentRequest.childUser?.email,
      childAge: consentRequest.childUser?.age,
      childRole: consentRequest.childUser?.role,
      parentEmail: consentRequest.parentEmail,
      createdAt: consentRequest.createdAt,
      expiresAt: consentRequest.expiresAt,
    });
  } catch (error) {
    console.error("Get consent error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve consent request" },
      { status: 500 }
    );
  }
}

