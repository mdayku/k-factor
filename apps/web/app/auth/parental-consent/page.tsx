"use client";

/**
 * Parental Consent Verification Page
 * Parents click the link in email to approve/deny child account
 */

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ConsentForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [childInfo, setChildInfo] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<"approved" | "denied" | null>(null);

  useEffect(() => {
    if (token) {
      fetchConsentRequest();
    } else {
      setError("No consent token provided");
      setLoading(false);
    }
  }, [token]);

  const fetchConsentRequest = async () => {
    try {
      const response = await fetch(
        `/api/auth/parental-consent?token=${token}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load consent request");
        setLoading(false);
        return;
      }

      setChildInfo(data);
      setLoading(false);
    } catch (err) {
      setError("An error occurred loading the consent request");
      setLoading(false);
    }
  };

  const handleConsent = async (approved: boolean) => {
    setProcessing(true);
    setError("");

    try {
      const response = await fetch("/api/auth/parental-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          consent: approved,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to process consent");
        setProcessing(false);
        return;
      }

      setResult(approved ? "approved" : "denied");
      setProcessing(false);
    } catch (err) {
      setError("An error occurred processing your response");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #f3f4f6",
              borderTopColor: "#0070f3",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#666" }}>Loading consent request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            background: "white",
            borderRadius: "12px",
            padding: "48px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>⚠️</div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Invalid or Expired Link
          </h1>
          <p style={{ color: "#666", marginBottom: "24px" }}>{error}</p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#0070f3",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            background: "white",
            borderRadius: "12px",
            padding: "48px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>
            {result === "approved" ? "✅" : "❌"}
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            {result === "approved"
              ? "Consent Granted"
              : "Consent Denied"}
          </h1>
          <p style={{ color: "#666", marginBottom: "32px", lineHeight: "1.6" }}>
            {result === "approved"
              ? `Thank you for approving ${childInfo?.childName}'s account. They can now sign in and start learning!`
              : `You have declined consent for ${childInfo?.childName}'s account. The account will remain inactive.`}
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#0070f3",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "white",
          borderRadius: "12px",
          padding: "48px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛡️</div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>
            Parental Consent Required
          </h1>
          <p style={{ color: "#666", fontSize: "14px" }}>
            COPPA Compliance - Children's Online Privacy Protection Act
          </p>
        </div>

        <div
          style={{
            background: "#f9fafb",
            padding: "24px",
            borderRadius: "8px",
            marginBottom: "32px",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
            Account Details
          </h2>
          <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
            <p>
              <strong>Child's Name:</strong> {childInfo?.childName}
            </p>
            <p>
              <strong>Email:</strong> {childInfo?.childEmail}
            </p>
            <p>
              <strong>Age:</strong> {childInfo?.childAge} years old
            </p>
            <p>
              <strong>Role:</strong> {childInfo?.childRole}
            </p>
            <p>
              <strong>Your Email:</strong> {childInfo?.parentEmail}
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fcd34d",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "32px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
            <strong>ℹ️ What this means:</strong>
            <br />
            Your child has created an account on our platform. Under COPPA
            regulations, we need your permission before they can use our
            services. By approving, you confirm that you are the parent or legal
            guardian and consent to your child's account.
          </p>
        </div>

        {processing ? (
          <div style={{ textAlign: "center", padding: "32px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "4px solid #f3f4f6",
                borderTopColor: "#0070f3",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "#666" }}>Processing your response...</p>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "16px" }}>
            <button
              onClick={() => handleConsent(false)}
              style={{
                flex: 1,
                padding: "16px",
                background: "white",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              ❌ Deny
            </button>
            <button
              onClick={() => handleConsent(true)}
              style={{
                flex: 1,
                padding: "16px",
                background: "#10b981",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                color: "white",
                cursor: "pointer",
              }}
            >
              ✅ Approve Account
            </button>
          </div>
        )}

        <p
          style={{
            marginTop: "24px",
            fontSize: "12px",
            color: "#9ca3af",
            textAlign: "center",
            lineHeight: "1.6",
          }}
        >
          By approving, you agree to our{" "}
          <Link
            href="/legal/terms"
            style={{ color: "#0070f3", textDecoration: "underline" }}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/privacy"
            style={{ color: "#0070f3", textDecoration: "underline" }}
          >
            Privacy Policy
          </Link>
          . This link expires in 7 days.
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default function ParentalConsentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConsentForm />
    </Suspense>
  );
}

