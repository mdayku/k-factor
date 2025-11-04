"use client";

/**
 * Share Card Component
 * Privacy-safe share cards with student/parent/tutor variants
 */

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ShareCardProps {
  resultId: string;
  subject: string;
  score: number;
  skillsBreakdown: {
    skill: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  onClose: () => void;
}

export default function ShareCard({
  resultId,
  subject,
  score,
  skillsBreakdown,
  onClose,
}: ShareCardProps) {
  const { data: session } = useSession();
  
  // Auto-detect variant from user's role, default to student
  const defaultVariant = (session?.user?.role?.toLowerCase() as "student" | "parent" | "tutor") || "student";
  const [variant, setVariant] = useState<"student" | "parent" | "tutor">(defaultVariant);
  const [copied, setCopied] = useState(false);

  // Update variant if session loads after component mount
  useEffect(() => {
    if (session?.user?.role) {
      setVariant(session.user.role.toLowerCase() as "student" | "parent" | "tutor");
    }
  }, [session]);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/challenge/${resultId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getShareText = () => {
    switch (variant) {
      case "student":
        return `🎯 I just scored ${score}% on ${subject}! Think you can beat my score? Take the challenge!`;
      case "parent":
        return `📚 My child scored ${score}% on their ${subject} assessment! See their progress and help them improve.`;
      case "tutor":
        return `⭐ Great session! Student scored ${score}% on ${subject}. Here's the detailed breakdown for review.`;
      default:
        return "";
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        maxWidth: "600px",
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto",
        padding: "32px",
        position: "relative"
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#9ca3af"
          }}
        >
          ✕
        </button>

        <h2 style={{ fontSize: "24px", marginBottom: "8px", color: "#1f2937" }}>
          Share Your Results
        </h2>
        
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
          Sharing as: <strong style={{ color: "#0070f3", textTransform: "capitalize" }}>{variant}</strong>
        </p>

        {/* Preview Card */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "24px",
          borderRadius: "12px",
          color: "white",
          marginBottom: "24px"
        }}>
          <div style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "8px" }}>
            {score}%
          </div>
          <div style={{ fontSize: "20px", marginBottom: "16px" }}>
            {subject} Assessment
          </div>
          <div style={{ fontSize: "14px", opacity: 0.9 }}>
            {skillsBreakdown.length} skills assessed
          </div>
        </div>

        {/* Share text */}
        <div style={{
          background: "#f9fafb",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "14px",
          color: "#374151",
          lineHeight: "1.6"
        }}>
          {getShareText()}
        </div>

        {/* Share link */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
            Share link:
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={shareUrl}
              readOnly
              style={{
                flex: 1,
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                background: "#f9fafb"
              }}
            />
            <button
              onClick={handleCopyLink}
              style={{
                padding: "12px 24px",
                background: copied ? "#10b981" : "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Social share buttons */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
            Or share via:
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{
              flex: 1,
              padding: "12px",
              background: "#1da1f2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              Twitter
            </button>
            <button style={{
              flex: 1,
              padding: "12px",
              background: "#25d366",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              WhatsApp
            </button>
            <button style={{
              flex: 1,
              padding: "12px",
              background: "#0088cc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              Email
            </button>
          </div>
        </div>

        {/* Privacy notice */}
        <p style={{
          fontSize: "12px",
          color: "#9ca3af",
          textAlign: "center",
          lineHeight: "1.5"
        }}>
          🔒 Privacy-safe sharing: Only summary stats are visible. Full details require
          authentication and parental consent for minors.
        </p>
      </div>
    </div>
  );
}

