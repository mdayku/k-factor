/**
 * COPPA Policy Page
 * Children's Online Privacy Protection Act compliance documentation
 */

export default function COPPAPolicyPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "16px" }}>
        COPPA Policy
      </h1>
      <p style={{ color: "#666", marginBottom: "16px" }}>
        Children's Online Privacy Protection Act Compliance
      </p>
      <p style={{ color: "#666", marginBottom: "48px" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Our Commitment to Children's Privacy
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          We are committed to protecting the privacy of children under 13 years of
          age. This policy explains how we comply with the Children's Online Privacy
          Protection Act (COPPA) and what rights parents have regarding their
          child's information.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Parental Consent Requirement
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          Before a child under 13 can create an account:
        </p>
        <ol style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>The child provides their age during signup</li>
          <li>The child provides their parent/guardian's email address</li>
          <li>We send a consent verification email to the parent</li>
          <li>The parent reviews the account details and our privacy practices</li>
          <li>The parent approves or denies the account activation</li>
          <li>The account remains inactive until parental consent is granted</li>
        </ol>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Information Collected from Children
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          We collect only necessary information from children:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li><strong>Account creation:</strong> Name, email, age, password (encrypted)</li>
          <li><strong>Educational use:</strong> Practice attempts, scores, progress</li>
          <li><strong>Social features:</strong> Friend invites (with parental oversight)</li>
          <li><strong>Technical data:</strong> Session logs, device info (for security)</li>
        </ul>
        <p style={{ lineHeight: "1.8", color: "#374151", marginTop: "12px" }}>
          We do NOT collect: physical location, photos/videos, voice recordings, or
          any sensitive personal information beyond what's listed above.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          How We Use Children's Information
        </h2>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Provide educational services and learning features</li>
          <li>Track educational progress and personalize content</li>
          <li>Enable supervised social interactions with friends</li>
          <li>Send service updates and educational content</li>
          <li>Maintain security and prevent misuse</li>
        </ul>
        <p style={{ lineHeight: "1.8", color: "#374151", marginTop: "12px" }}>
          <strong>We do NOT:</strong> Use children's data for targeted advertising,
          create behavioral profiles for commercial purposes, or sell children's
          information to third parties.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Parental Rights and Controls
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          Parents have the right to:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li><strong>Review:</strong> Request to see all data collected from their child</li>
          <li><strong>Delete:</strong> Request deletion of their child's account and data</li>
          <li><strong>Refuse:</strong> Deny further collection of their child's information</li>
          <li><strong>Modify:</strong> Correct or update their child's information</li>
          <li><strong>Control:</strong> Manage notification and communication preferences</li>
          <li><strong>Monitor:</strong> Receive activity reports and alerts</li>
        </ul>
        <p style={{ lineHeight: "1.8", color: "#374151", marginTop: "12px" }}>
          To exercise these rights, email us at{" "}
          <strong>coppa@k-factor-platform.com</strong> with your child's account
          email.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Data Security for Children
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          Children's data receives enhanced protection:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Separate, encrypted database storage</li>
          <li>Limited employee access (need-to-know basis)</li>
          <li>No integration with external advertising networks</li>
          <li>Automated age verification at signup</li>
          <li>Regular security audits and monitoring</li>
          <li>Automatic account archival after inactivity</li>
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Third-Party Services
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          Any third-party services we use (hosting, analytics, email) are
          COPPA-compliant and bound by data processing agreements. We do not allow
          third-party advertising or tracking for children's accounts.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Data Retention for Children
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          We retain children's data only as long as necessary for educational
          purposes or as required by law. When a child's account is deleted, all
          personal information is permanently removed within 30 days. Educational
          records may be retained longer for institutional use (FERPA compliance).
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Social Features and Child Safety
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151", marginBottom: "12px" }}>
          Children can participate in supervised social features:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Friend invites require parent email verification</li>
          <li>No public profiles or user-generated content visible to strangers</li>
          <li>Pre-moderated text communication (no free-form chat)</li>
          <li>Reporting and blocking features for inappropriate contact</li>
          <li>Automated content filtering for safety</li>
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Consent Withdrawal
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          Parents can withdraw consent at any time by:
        </p>
        <ol style={{ lineHeight: "1.8", color: "#374151", paddingLeft: "24px" }}>
          <li>Logging into their child's account settings</li>
          <li>Clicking "Delete Account"</li>
          <li>Confirming via email</li>
        </ol>
        <p style={{ lineHeight: "1.8", color: "#374151", marginTop: "12px" }}>
          Or by emailing <strong>coppa@k-factor-platform.com</strong> to request
          immediate account deletion.
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Age Transition (Turning 13)
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          When a child turns 13, their account transitions to a regular account. We
          notify the parent and the child of this change. The child can then update
          their privacy settings independently.
        </p>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
          Questions or Concerns
        </h2>
        <p style={{ lineHeight: "1.8", color: "#374151" }}>
          If you have questions about our COPPA compliance or how we handle
          children's data, please contact:
        </p>
        <div
          style={{
            background: "#f9fafb",
            padding: "20px",
            borderRadius: "8px",
            marginTop: "16px",
          }}
        >
          <p style={{ lineHeight: "1.8", color: "#374151" }}>
            <strong>COPPA Compliance Officer</strong>
            <br />
            Email: coppa@k-factor-platform.com
            <br />
            <br />
            <strong>Mailing Address:</strong>
            <br />
            10x K-Factor Platform
            <br />
            COPPA Compliance Department
            <br />
            [Address Line 1]
            <br />
            [City, State ZIP]
          </p>
        </div>
      </section>

      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "48px",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#1e40af" }}>
          ℹ️ For Parents
        </h3>
        <p style={{ lineHeight: "1.8", color: "#1e3a8a" }}>
          We recommend that parents:
        </p>
        <ul style={{ lineHeight: "1.8", color: "#1e3a8a", paddingLeft: "24px", marginTop: "8px" }}>
          <li>Review this policy with your child</li>
          <li>Discuss online safety and privacy</li>
          <li>Monitor your child's account activity</li>
          <li>Set up notification alerts for important activities</li>
          <li>Regularly review and update privacy settings</li>
        </ul>
      </div>

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
          href="/legal/privacy"
          style={{ color: "#0070f3", textDecoration: "none" }}
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
}

