/**
 * Test Email API
 * Verifies email configuration is working
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { sendTestEmail } from "../../../../lib/email";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email } = body;

    const recipientEmail = email || session.user.email;

    const success = await sendTestEmail(recipientEmail);

    return NextResponse.json({
      success,
      message: success
        ? `Test email sent to ${recipientEmail}`
        : "Email not configured. Check EMAIL_* environment variables.",
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}

