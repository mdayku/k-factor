/**
 * Sign-up API Route
 * Handles user registration with COPPA compliance
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendParentalConsentEmail } from "../../../../lib/email";

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(5).max(120),
  role: z.enum(["STUDENT", "PARENT", "TUTOR"]),
  parentEmail: z.string().email().optional(),
  referrerSignedLinkId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = signupSchema.parse(body);

    // Check COPPA compliance (users under 13)
    const isMinor = data.age < 13;
    const coppaCompliant = !isMinor || !!data.parentEmail;

    if (isMinor && !data.parentEmail) {
      return NextResponse.json(
        {
          error: "Parental consent required",
          requiresParentalConsent: true,
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      // If user exists and is a minor without consent, resend the email
      if (existingUser.isMinor && !existingUser.parentalConsent && data.parentEmail) {
        // Find existing consent request
        const consentRequest = await prisma.parentalConsent.findFirst({
          where: {
            childUserId: existingUser.id,
            consentGiven: false,
            expiresAt: { gt: new Date() }
          }
        });

        if (consentRequest) {
          // Resend the consent email
          const emailSent = await sendParentalConsentEmail(data.parentEmail, consentRequest.consentToken);
          
          return NextResponse.json({
            success: true,
            message: emailSent 
              ? "Parental consent email resent. Check your inbox." 
              : "Account exists. Check console for parental consent link.",
            userId: existingUser.id,
            requiresParentalConsent: true,
            emailSent,
          });
        }
      }

      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        age: data.age,
        role: data.role,
        isMinor,
        parentEmail: data.parentEmail,
        coppaCompliant,
        parentalConsent: false, // Will be set to true after parent confirms
        isSimulated: false,
      },
    });

    // If minor, create parental consent request
    if (isMinor && data.parentEmail) {
      const consentToken = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days to consent

      await prisma.parentalConsent.create({
        data: {
          childUserId: user.id,
          parentEmail: data.parentEmail,
          consentToken,
          expiresAt,
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      });

      // Send consent email to parent
      const emailSent = await sendParentalConsentEmail(data.parentEmail, consentToken);

      return NextResponse.json({
        success: true,
        message: emailSent 
          ? "Account created. Parental consent email sent." 
          : "Account created. Check console for parental consent link.",
        userId: user.id,
        requiresParentalConsent: true,
        emailSent,
      });
    }

    // If user signed up via referral, create attribution record
    if (data.referrerSignedLinkId) {
      try {
        const signedLink = await prisma.signedLink.findUnique({
          where: { id: data.referrerSignedLinkId },
        });

        if (signedLink) {
          await prisma.attribution.create({
            data: {
              signedLinkId: signedLink.id,
              userId: user.id, // The referred user
              touchpoint: "signup", // Required field - where conversion happened
            },
          });
        }
      } catch (error) {
        console.error("Failed to create attribution:", error);
        // Continue anyway - don't fail signup if attribution fails
      }
    }

    // Track signup event with attribution
    await prisma.event.create({
      data: {
        type: "account.created",
        userId: user.id,
        sessionId: `signup_${Date.now()}`,
        surface: "web",
        metadata: {
          provider: "email",
          role: data.role,
          isMinor,
          coppaCompliant,
          referrerSignedLinkId: data.referrerSignedLinkId || null,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      userId: user.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

// Helper function to generate secure random token
function generateToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

