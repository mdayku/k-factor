/**
 * Privacy Policy Page
 */

export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "16px" }}>
        Privacy Policy
      </h1>
      <p style={{ color: "#666", marginBottom: "48px" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          1. Information We Collect
        </h2>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", marginTop: "20px" }}>
          Account Information
        </h3>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          When you create an account, we collect:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Name and email address</li>
          <li>Age (for COPPA compliance)</li>
          <li>Role (student, parent, or tutor)</li>
          <li>Password (encrypted)</li>
          <li>Parent email (for users under 13)</li>
        </ul>

        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", marginTop: "20px" }}>
          Usage Data
        </h3>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          We automatically collect information about how you use our Service,
          including session data, page views, features used, and referral activity.
        </p>

        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", marginTop: "20px" }}>
          Device Information
        </h3>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          We collect device information such as IP address, browser type, operating
          system, and device identifiers for security and fraud prevention.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          2. How We Use Your Information
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          We use your information to:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Provide and improve our Service</li>
          <li>Personalize your experience</li>
          <li>Process referrals and rewards</li>
          <li>Send educational content and platform updates</li>
          <li>Detect and prevent fraud</li>
          <li>Comply with legal obligations</li>
          <li>Analyze usage patterns to improve features</li>
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          3. Children's Privacy (COPPA)
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          We are committed to protecting children's privacy:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Users under 13 require verified parental consent</li>
          <li>We collect only necessary information from children</li>
          <li>Children's data is segregated and encrypted</li>
          <li>Parents can review, modify, or delete their child's data</li>
          <li>No targeted advertising to children</li>
          <li>Third-party integrations are COPPA-compliant</li>
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          4. FERPA Compliance (Educational Records)
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          For educational institutions, we comply with the Family Educational Rights
          and Privacy Act (FERPA). We act as a School Official and protect student
          education records according to FERPA requirements. Student data is never
          sold or shared for non-educational purposes.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          5. Information Sharing
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          We do NOT sell your personal information. We may share data with:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Service providers (hosting, analytics, email delivery)</li>
          <li>Parents/guardians (for child accounts)</li>
          <li>Law enforcement (when legally required)</li>
          <li>Business successors (in case of merger/acquisition)</li>
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          6. Data Security
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          We implement industry-standard security measures including encryption,
          secure authentication, regular security audits, and fraud detection
          systems. However, no method of transmission is 100% secure.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          7. Data Retention
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          We retain your data while your account is active and for a reasonable
          period thereafter for legal and business purposes. You can request account
          deletion at any time. Child data is deleted according to COPPA
          requirements.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          8. Your Rights
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          You have the right to:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Delete your account and data</li>
          <li>Opt-out of marketing communications</li>
          <li>Export your data (data portability)</li>
          <li>Object to certain data processing</li>
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          9. Cookies and Tracking
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          We use cookies and similar technologies for authentication, preferences,
          analytics, and fraud prevention. You can control cookie settings in your
          browser. Our Cookie Banner allows you to manage consent.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          10. International Users
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          If you access our Service from outside the United States, your data may be
          transferred to and stored in the US. By using our Service, you consent to
          this transfer.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          11. Changes to This Policy
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          We may update this Privacy Policy. Material changes will be notified via
          email or in-app notification. Continued use after changes constitutes
          acceptance.
        </p>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          12. Contact Us
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          For privacy questions or to exercise your rights, contact us at:
          <br />
          <strong>privacy@k-factor-platform.com</strong>
          <br />
          <br />
          For children's privacy specifically:
          <br />
          <strong>coppa@k-factor-platform.com</strong>
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
          href="/legal/terms"
          style={{
            color: "#0070f3",
            textDecoration: "none",
            marginRight: "24px",
          }}
        >
          Terms of Service
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

