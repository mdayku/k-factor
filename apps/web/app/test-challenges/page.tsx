"use client";

/**
 * Challenge Types Test Page
 * View all 4 challenge CTA types
 */

import ChallengeCTA from "../components/ChallengeCTA";

export default function TestChallengesPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        <h1 style={{
          fontSize: "32px",
          color: "white",
          textAlign: "center",
          marginBottom: "40px"
        }}>
          Challenge Types Test Page
        </h1>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}>
          {/* Buddy Challenge */}
          <div>
            <h2 style={{ color: "white", fontSize: "20px", marginBottom: "12px" }}>
              1. Buddy Challenge
            </h2>
            <ChallengeCTA
              resultId="test-result-1"
              subject="Algebra"
              score={85}
              type="buddy-challenge"
            />
          </div>

          {/* Streak Rescue */}
          <div>
            <h2 style={{ color: "white", fontSize: "20px", marginBottom: "12px" }}>
              2. Streak Rescue
            </h2>
            <ChallengeCTA
              resultId="test-result-2"
              subject="Chemistry"
              score={78}
              type="streak-rescue"
            />
          </div>

          {/* Study Buddy */}
          <div>
            <h2 style={{ color: "white", fontSize: "20px", marginBottom: "12px" }}>
              3. Study Buddy
            </h2>
            <ChallengeCTA
              resultId="test-result-3"
              subject="Physics"
              score={92}
              type="study-buddy"
            />
          </div>

          {/* Tutor Spotlight */}
          <div>
            <h2 style={{ color: "white", fontSize: "20px", marginBottom: "12px" }}>
              4. Tutor Spotlight
            </h2>
            <ChallengeCTA
              resultId="test-result-4"
              subject="Biology"
              score={88}
              type="tutor-spotlight"
            />
          </div>
        </div>

        <div style={{
          marginTop: "40px",
          padding: "20px",
          background: "white",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            🧪 This is a test page to view all 4 challenge types. Click each one to test the full flow.
          </p>
        </div>
      </div>
    </div>
  );
}

