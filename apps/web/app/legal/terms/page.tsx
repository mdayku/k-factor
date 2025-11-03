/**
 * Terms of Service Page
 */

export default function TermsOfServicePage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "16px" }}>
        Terms of Service
      </h1>
      <p style={{ color: "#666", marginBottom: "48px" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          1. Acceptance of Terms
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          By accessing and using the 10x K-Factor platform ("Service"), you accept
          and agree to be bound by these Terms of Service. If you do not agree to
          these terms, please do not use our Service.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          2. User Accounts
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          You must create an account to use certain features of our Service. You
          agree to:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Notify us immediately of any unauthorized access</li>
          <li>Be responsible for all activities under your account</li>
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          3. Children's Accounts (COPPA Compliance)
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          Users under 13 years of age require verified parental consent to create
          an account. We comply with the Children's Online Privacy Protection Act
          (COPPA). Parents have the right to review, delete, and refuse further
          collection of their child's personal information.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          4. Acceptable Use
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          You agree NOT to:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Use the Service for any illegal purpose</li>
          <li>Engage in fraudulent activities or abuse referral programs</li>
          <li>Harass, bully, or harm other users</li>
          <li>Upload malicious code or attempt to breach security</li>
          <li>Impersonate others or create fake accounts</li>
          <li>Share inappropriate content</li>
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          5. Referral Program
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          Our referral program rewards users for inviting others. Abuse of the
          referral system (fake accounts, spam, fraud) will result in account
          suspension and forfeiture of rewards. We reserve the right to modify or
          terminate the referral program at any time.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          6. Intellectual Property
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          All content, trademarks, and intellectual property on the Service are
          owned by us or our licensors. You may not copy, modify, or distribute our
          content without permission.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          7. Termination
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          We may terminate or suspend your account at any time for violations of
          these Terms. You may also close your account at any time through your
          account settings.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          8. Disclaimer of Warranties
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT
          GUARANTEE UNINTERRUPTED OR ERROR-FREE SERVICE.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          9. Limitation of Liability
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR
          USE OF THE SERVICE.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          10. Changes to Terms
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          We may modify these Terms at any time. Continued use of the Service after
          changes constitutes acceptance of the new Terms. We will notify users of
          material changes via email or in-app notification.
        </p>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          11. Contact Us
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          For questions about these Terms, contact us at:
          <br />
          <strong>legal@k-factor-platform.com</strong>
        </p>
      </section>

      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "24px",
          textAlign: "center",
        }}
      >
        <a
          href="/legal/privacy"
          style={{
            color: "#0070f3",
            textDecoration: "none",
            marginRight: "24px",
          }}
        >
          Privacy Policy
        </a>
        <a
          href="/legal/coppa"
          style={{ color: "#0070f3", textDecoration: "none" }}
        >
          COPPA Policy
        </a>
      </div>
    </div>
  );
}

