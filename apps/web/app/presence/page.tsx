"use client";

/**
 * Presence & Social Layer
 * Live presence signals, leaderboards, and cohort rooms
 * Makes the platform feel "alive"
 */

import { useState, useEffect } from "react";
import PresenceSignals from "../components/PresenceSignals";
import MiniLeaderboard from "../components/MiniLeaderboard";
import CohortRooms from "../components/CohortRooms";
import { useTracking, useScrollTracking } from "../../hooks/useTracking";

export default function PresencePage() {
  const [activeTab, setActiveTab] = useState<"presence" | "leaderboards" | "cohorts">("presence");
  
  // Event tracking for AI retraining
  const { trackClick } = useTracking("Presence Page");
  useScrollTracking(80);
  
  // Track tab switches
  const handleTabSwitch = (tab: "presence" | "leaderboards" | "cohorts") => {
    trackClick("Tab Switch", { tab });
    setActiveTab(tab);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "white"
        }}>
          <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>
            📍 Live Activity
          </h1>
          <p style={{ fontSize: "20px", opacity: 0.9 }}>
            See what others are learning right now
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          gap: "16px",
          marginBottom: "32px",
          justifyContent: "center"
        }}>
          {[
            { id: "presence", label: "👥 Who's Online", emoji: "👥" },
            { id: "leaderboards", label: "🏆 Leaderboards", emoji: "🏆" },
            { id: "cohorts", label: "💬 Cohort Rooms", emoji: "💬" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id as any)}
              style={{
                padding: "16px 32px",
                background: activeTab === tab.id ? "white" : "rgba(255,255,255,0.2)",
                color: activeTab === tab.id ? "#667eea" : "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === "presence" && <PresenceSignals />}
          {activeTab === "leaderboards" && <MiniLeaderboard />}
          {activeTab === "cohorts" && <CohortRooms />}
        </div>
      </div>
    </div>
  );
}
