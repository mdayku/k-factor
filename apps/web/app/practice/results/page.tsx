"use client";

/**
 * Practice Results Page
 * Shows score and triggers viral sharing loops
 * This is where the viral magic happens!
 */

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { useTracking, useScrollTracking } from "../../../hooks/useTracking";

function ResultsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Event tracking for AI retraining
  const { trackClick, trackFormSubmit } = useTracking("Practice Results");
  useScrollTracking(90);
  
  const score = parseInt(searchParams.get("score") || "0");
  const total = parseInt(searchParams.get("total") || "10");
  const percentage = Math.round((score / total) * 100);
  
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [incentive, setIncentive] = useState<string | null>(null);

  // Determine performance level
  const getPerformanceLevel = () => {
    if (percentage >= 90) return { emoji: "🏆", text: "Excellent!", color: "#10b981" };
    if (percentage >= 70) return { emoji: "🎯", text: "Great job!", color: "#0070f3" };
    if (percentage >= 50) return { emoji: "📈", text: "Good effort!", color: "#f59e0b" };
    return { emoji: "💪", text: "Keep practicing!", color: "#6b7280" };
  };

  const performance = getPerformanceLevel();

  // Call orchestrator agent on mount to decide viral loop
  useEffect(() => {
    const orchestrate = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch("/api/agents/orchestrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            surface: "practice_results",
            score: percentage,
            sessionCount: 1, // Could track this in localStorage
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setSelectedLoop(data.selectedLoop);
          setIncentive(data.incentive);
        }
      } catch (error) {
        console.error("Orchestration failed:", error);
        // Fallback to default
        setSelectedLoop("buddy_challenge");
        setIncentive("streak_shield");
      }
    };

    orchestrate();
  }, [session, percentage]);

  const handleSendInvite = async () => {
    if (!session?.user || !recipientEmail) return;

    // Track invite form submission
    trackFormSubmit("Send Invite", { 
      score: percentage, 
      recipientEmail: recipientEmail.substring(0, 3) + "***" // Privacy: partial email
    });

    try {
      // Create invite via API
      const response = await fetch("/api/invites/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId: `practice_${Date.now()}`,
          recipientEmail,
          challengeType: "buddy_challenge",
          subject: "Geography",
          score: percentage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInviteLink(data.inviteUrl);
        setInviteSent(true);
        setEmailSent(data.emailSent || false);
        setEmailStatus(data.message || null);

        // Track viral loop trigger
        await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "share_clicked",
            metadata: {
              loop: "buddy_challenge",
              surface: "practice_results",
              score: percentage,
              subject: "Geography",
              emailSent: data.emailSent || false,
            },
          }),
        });
      }
    } catch (error) {
      console.error("Failed to send invite:", error);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {/* Score card */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          textAlign: "center",
          marginBottom: "24px"
        }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>
            {performance.emoji}
          </div>
          
          <h1 style={{
            fontSize: "36px",
            marginBottom: "8px",
            color: performance.color
          }}>
            {performance.text}
          </h1>

          <p style={{ fontSize: "18px", color: "#6b7280", marginBottom: "32px" }}>
            You scored {score} out of {total}
          </p>

          {/* Score circle */}
          <div style={{
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: `conic-gradient(${performance.color} ${percentage}%, #e5e7eb ${percentage}%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            position: "relative"
          }}>
            <div style={{
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}>
              <div style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: performance.color
              }}>
                {percentage}%
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/practice" as Route)}
              style={{
                padding: "14px 28px",
                background: "#f3f4f6",
                color: "#1f2937",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e5e7eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
              }}
            >
              Practice Menu
            </button>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "14px 28px",
                background: "#f3f4f6",
                color: "#1f2937",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e5e7eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
              }}>
                View Leaderboard
              </button>
            </Link>
            <Link href="/presence" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "14px 28px",
                background: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,112,243,0.3)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}>
                Home
              </button>
            </Link>
          </div>
        </div>

        {/* Viral sharing card */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}>
          <h2 style={{
            fontSize: "24px",
            marginBottom: "16px",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <span>🎯</span>
            Challenge a Friend!
          </h2>

          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            marginBottom: "24px"
          }}>
            Think your friends can beat your score? Send them this challenge!
          </p>

          {!inviteSent ? (
            <div>
              <input
                type="email"
                placeholder="Friend's email address"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "16px",
                  marginBottom: "16px",
                  outline: "none"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#0070f3";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              />
              
              <button
                onClick={handleSendInvite}
                disabled={!recipientEmail || !session}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: recipientEmail && session ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#e5e7eb",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: recipientEmail && session ? "pointer" : "not-allowed",
                  transition: "transform 0.2s",
                  boxShadow: recipientEmail && session ? "0 4px 12px rgba(102,126,234,0.4)" : "none"
                }}
                onMouseEnter={(e) => {
                  if (recipientEmail && session) {
                    e.currentTarget.style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Send Challenge
              </button>

              <div style={{
                marginTop: "16px",
                padding: "16px",
                background: "#eff6ff",
                borderRadius: "12px",
                border: "1px solid #dbeafe"
              }}>
                <p style={{
                  fontSize: "14px",
                  color: "#1e40af",
                  margin: "0 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span>🎁</span>
                  <strong>Bonus:</strong> Both you and your friend get a streak shield if they complete the challenge!
                </p>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "#6b7280"
                }}>
                  <span>📊</span>
                  <span>147 students invited friends this week</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              padding: "24px",
              background: "#dcfce7",
              borderRadius: "12px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                ✅
              </div>
              <h3 style={{
                fontSize: "20px",
                marginBottom: "8px",
                color: "#166534"
              }}>
                Challenge Sent!
              </h3>
              <p style={{
                fontSize: "14px",
                color: "#166534",
                marginBottom: "8px"
              }}>
                {emailSent 
                  ? `✉️ Email sent to ${recipientEmail}!` 
                  : `Link created for ${recipientEmail}`}
              </p>
              {!emailSent && (
                <p style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "16px",
                  fontStyle: "italic"
                }}>
                  (Email not configured - share the link manually)
                </p>
              )}
              {inviteLink && (
                <div style={{
                  padding: "12px",
                  background: "white",
                  borderRadius: "8px",
                  marginTop: "12px",
                  wordBreak: "break-all",
                  fontSize: "14px",
                  color: "#6b7280"
                }}>
                  <strong>Link:</strong> {inviteLink}
                </div>
              )}
              <button
                onClick={() => {
                  setInviteSent(false);
                  setRecipientEmail("");
                }}
                style={{
                  marginTop: "16px",
                  padding: "10px 20px",
                  background: "#166534",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Send Another Challenge
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <p style={{ color: "white", fontSize: "18px" }}>Loading results...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

