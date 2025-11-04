"use client";

/**
 * Onboarding Page (Placeholder for Testing)
 * Allows users to complete onboarding and proceed to app
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  const handleComplete = () => {
    // For testing: just redirect to dashboard
    // The onboarding API can be fixed later
    router.push("/dashboard");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "500px",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        <div style={{
          fontSize: "64px",
          marginBottom: "24px"
        }}>
          👋
        </div>

        <h1 style={{
          fontSize: "32px",
          marginBottom: "16px",
          color: "#1f2937"
        }}>
          Welcome to VT K-Factor!
        </h1>

        <p style={{
          fontSize: "18px",
          color: "#6b7280",
          marginBottom: "32px",
          lineHeight: "1.6"
        }}>
          You're all set! This is a placeholder onboarding page for testing.
          Click below to complete setup and start exploring.
        </p>

        {session && (
          <div style={{
            padding: "16px",
            background: "#f9fafb",
            borderRadius: "12px",
            marginBottom: "32px",
            textAlign: "left"
          }}>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
              Logged in as:
            </div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>
              {session.user?.email}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
              Role: {session.user?.role || "student"}
            </div>
          </div>
        )}

        <button
          onClick={handleComplete}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            background: loading ? "#9ca3af" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(0,112,243,0.3)"
          }}
        >
          {loading ? "Completing..." : "Complete Setup"}
        </button>

        <p style={{
          fontSize: "12px",
          color: "#9ca3af",
          marginTop: "24px"
        }}>
          🚧 This is a placeholder page for testing Phase 4 features
        </p>
      </div>
    </div>
  );
}

