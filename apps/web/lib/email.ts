/**
 * Email Service
 * Sends invites via nodemailer (supports Gmail, SendGrid, or any SMTP)
 */

import nodemailer from "nodemailer";

interface SendInviteEmailParams {
  to: string;
  fromName: string;
  inviteUrl: string;
  challengeType: string;
  subject: string;
  score?: number;
  copy?: {
    headline: string;
    body: string;
    cta: string;
    aiGenerated?: boolean;
  };
}

// Create transporter (reuse connection)
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  // Check if email is configured
  const emailHost = process.env.EMAIL_HOST;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailHost || !emailUser || !emailPass) {
    console.warn("⚠️  Email not configured. Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env.local");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: emailHost,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return transporter;
}

/**
 * Send challenge invite email
 */
export async function sendInviteEmail(params: SendInviteEmailParams): Promise<boolean> {
  const transport = getTransporter();
  
  if (!transport) {
    console.log("📧 Email not configured - invite created but not sent");
    return false;
  }

  try {
    const { to, fromName, inviteUrl, challengeType, subject, score, copy } = params;

    // Use AI-generated copy if available, otherwise use defaults
    const headline = copy?.headline || `${fromName} challenges you!`;
    const body = copy?.body || `${fromName} scored ${score}% on ${subject}. Think you can beat that?`;
    const cta = copy?.cta || "Accept Challenge";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headline}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 48px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="font-size: 64px; margin-bottom: 16px;">🎯</div>
      <h1 style="font-size: 28px; margin: 0 0 16px 0; color: #1f2937; line-height: 1.3;">
        ${headline}
      </h1>
      <p style="font-size: 16px; color: #6b7280; margin: 0; line-height: 1.6;">
        ${body}
      </p>
      ${copy?.aiGenerated ? '<p style="font-size: 12px; color: #9ca3af; margin: 16px 0 0 0; font-style: italic;">✨ Personalized by AI</p>' : ''}
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${inviteUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 12px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(102,126,234,0.4);">
        ${cta}
      </a>
    </div>

    <!-- Incentive -->
    <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin: 32px 0; border: 1px solid #dbeafe;">
      <p style="margin: 0; font-size: 14px; color: #1e40af; text-align: center;">
        <strong>🎁 Bonus:</strong> Both you and ${fromName} get a streak shield when you complete the challenge!
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">
        Powered by <strong style="color: #667eea;">VT K-Factor</strong>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">
        <a href="${inviteUrl}" style="color: #9ca3af; text-decoration: none;">View in browser</a> •
        <a href="#" style="color: #9ca3af; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${headline}

${body}

${cta}: ${inviteUrl}

${copy?.aiGenerated ? '✨ This message was personalized by AI' : ''}

🎁 Bonus: Both you and ${fromName} get a streak shield when you complete the challenge!

---
Powered by VT K-Factor
View in browser: ${inviteUrl}
    `;

    await transport.sendMail({
      from: `"VT K-Factor" <${process.env.EMAIL_USER}>`,
      to,
      subject: headline,
      text,
      html,
    });

    console.log(`✅ Invite email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send invite email:", error);
    return false;
  }
}

/**
 * Send parental consent email
 */
export async function sendParentalConsentEmail(
  parentEmail: string,
  consentToken: string
): Promise<boolean> {
  const transport = getTransporter();
  
  if (!transport) {
    console.log("📧 Email not configured - parental consent email not sent");
    return false;
  }

  const consentUrl = `${process.env.NEXTAUTH_URL}/auth/parental-consent?token=${consentToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parental Consent Required - VT K-Factor</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 48px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="font-size: 64px; margin-bottom: 16px;">📧</div>
      <h1 style="font-size: 28px; margin: 0 0 16px 0; color: #1f2937; line-height: 1.3;">
        Parental Consent Required
      </h1>
      <p style="font-size: 16px; color: #6b7280; margin: 0; line-height: 1.6;">
        Your child has created an account on VT K-Factor. To comply with COPPA regulations, we need your consent to allow them to use the platform.
      </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${consentUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 12px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(102,126,234,0.4);">
        Approve Account
      </a>
    </div>

    <!-- Info Box -->
    <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin: 32px 0; border: 1px solid #dbeafe;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af;">
        <strong>⏰ This link expires in 7 days.</strong>
      </p>
      <p style="margin: 0; font-size: 14px; color: #1e40af;">
        Your child will not be able to sign in until you approve their account.
      </p>
    </div>

    <!-- Security Info -->
    <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 32px 0;">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #374151; font-weight: 600;">
        🔒 Your child's privacy is protected:
      </p>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #6b7280; line-height: 1.8;">
        <li>No personal information shared publicly</li>
        <li>COPPA-compliant data handling</li>
        <li>You can revoke consent at any time</li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">
        Powered by <strong style="color: #667eea;">VT K-Factor</strong>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">
        Questions? <a href="mailto:${process.env.EMAIL_USER}" style="color: #667eea; text-decoration: none;">Contact us</a> •
        <a href="${process.env.NEXTAUTH_URL}/legal/coppa" style="color: #9ca3af; text-decoration: none;">COPPA Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Parental Consent Required - VT K-Factor

Your child has created an account on VT K-Factor. To comply with COPPA regulations, we need your consent to allow them to use the platform.

Approve Account: ${consentUrl}

⏰ This link expires in 7 days.

Your child will not be able to sign in until you approve their account.

🔒 Your child's privacy is protected:
- No personal information shared publicly
- COPPA-compliant data handling
- You can revoke consent at any time

---
Powered by VT K-Factor
Questions? Contact us at ${process.env.EMAIL_USER}
COPPA Policy: ${process.env.NEXTAUTH_URL}/legal/coppa
  `;

  try {
    await transport.sendMail({
      from: `"VT K-Factor" <${process.env.EMAIL_USER}>`,
      to: parentEmail,
      subject: "Parental Consent Required for Your Child's VT K-Factor Account",
      text,
      html,
    });

    console.log(`✅ Parental consent email sent to ${parentEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send parental consent email:", error);
    return false;
  }
}

/**
 * Send test email (for debugging)
 */
export async function sendTestEmail(to: string): Promise<boolean> {
  const transport = getTransporter();
  
  if (!transport) {
    return false;
  }

  try {
    await transport.sendMail({
      from: `"VT K-Factor" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Test Email from VT K-Factor",
      text: "If you're reading this, email is working! 🎉",
      html: "<h1>Email is working! 🎉</h1><p>You can now send invites.</p>",
    });

    console.log(`✅ Test email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send test email:", error);
    return false;
  }
}

