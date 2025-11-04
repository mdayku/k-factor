"use client";

/**
 * Challenge CTA Component
 * Viral CTAs for Buddy Challenge, Streak Rescue, Study Buddy, etc.
 */

import { useState } from "react";

interface ChallengeCTAProps {
  resultId: string;
  subject: string;
  score: number;
  type: "buddy-challenge" | "streak-rescue" | "study-buddy" | "tutor-spotlight";
}

export default function ChallengeCTA({
  resultId,
  subject,
  score,
  type,
}: ChallengeCTAProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCtaConfig = () => {
    switch (type) {
      case "buddy-challenge":
        return {
          icon: "🎯",
          title: "Challenge a Friend",
          description: `Think your friend can beat your ${score}% score? Send them a challenge!`,
          reward: "🏆 Both get Streak Shields when they complete it",
          buttonText: "Send Challenge",
        };
      case "streak-rescue":
        return {
          icon: "🔥",
          title: "Phone a Friend",
          description: "Your streak is at risk! Invite a friend to co-practice and save it together.",
          reward: "🛡️ Both get Streak Shields",
          buttonText: "Rescue My Streak",
        };
      case "study-buddy":
        return {
          icon: "👥",
          title: "Invite Study Buddy",
          description: `Get a study buddy for ${subject} and improve together!`,
          reward: "📚 Get practice power-ups when they join",
          buttonText: "Invite Buddy",
        };
      case "tutor-spotlight":
        return {
          icon: "⭐",
          title: "Share with Parents",
          description: "Show your parents your progress and invite other families!",
          reward: "🎁 Earn class pass rewards for referrals",
          buttonText: "Share Progress",
        };
      default:
        return {
          icon: "🎯",
          title: "Challenge",
          description: "",
          reward: "",
          buttonText: "Send",
        };
    }
  };

  const config = getCtaConfig();

  const handleSendInvite = async () => {
    if (!friendEmail) return;

    setLoading(true);

    try {
      // Call signed link API to create invite
      const response = await fetch("/api/invites/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId,
          recipientEmail: friendEmail,
          challengeType: type,
          subject,
          score,
        }),
      });

      if (response.ok) {
        setInviteSent(true);
        setFriendEmail("");
        
        // Track invite.sent event
        await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "invite.sent",
            metadata: {
              challengeType: type,
              subject,
              resultId,
            },
          }),
        });

        setTimeout(() => {
          setInviteSent(false);
          setShowInviteForm(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to send invite:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showInviteForm) {
    return (
      <div style={{
        background: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        {inviteSent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
              ✅
            </div>
            <h3 style={{ fontSize: "20px", color: "#10b981", marginBottom: "8px" }}>
              Challenge Sent!
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Your friend will receive an email with the challenge link.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "20px", color: "#1f2937" }}>
                {config.icon} {config.title}
              </h3>
              <button
                onClick={() => setShowInviteForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#9ca3af"
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
              {config.description}
            </p>

            <input
              type="text"
              placeholder="Friend's email address or @username"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "16px"
              }}
            />

            <button
              onClick={handleSendInvite}
              disabled={!friendEmail || loading}
              style={{
                width: "100%",
                padding: "14px",
                background: friendEmail && !loading ? "#0070f3" : "#9ca3af",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: friendEmail && !loading ? "pointer" : "not-allowed"
              }}
            >
              {loading ? "Sending..." : config.buttonText}
            </button>

            <p style={{
              fontSize: "12px",
              color: "#10b981",
              marginTop: "12px",
              textAlign: "center"
            }}>
              {config.reward}
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowInviteForm(true)}
      style={{
        width: "100%",
        padding: "20px",
        background: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "32px", marginRight: "16px" }}>
          {config.icon}
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937", marginBottom: "4px" }}>
            {config.title}
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            {config.description}
          </p>
        </div>
        <span style={{ fontSize: "24px", color: "#0070f3" }}>
          →
        </span>
      </div>
      <div style={{
        fontSize: "12px",
        color: "#10b981",
        fontWeight: "600",
        paddingLeft: "48px"
      }}>
        {config.reward}
      </div>
    </button>
  );
}

