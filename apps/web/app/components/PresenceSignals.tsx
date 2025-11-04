"use client";

/**
 * Presence Signals Component
 * Shows live activity - "28 peers practicing Algebra now"
 */

import { useState, useEffect } from "react";

interface Activity {
  subject: string;
  count: number;
  trend: "up" | "down" | "stable";
}

interface Friend {
  name: string;
  activity: string;
  avatar: string;
}

export default function PresenceSignals() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [friendsOnline, setFriendsOnline] = useState<Friend[]>([]);
  const [totalOnline, setTotalOnline] = useState(0);

  useEffect(() => {
    // Simulate live activity data
    // In production, this would come from WebSocket
    const mockActivities: Activity[] = [
      { subject: "Algebra", count: 28, trend: "up" },
      { subject: "Geometry", count: 15, trend: "stable" },
      { subject: "Chemistry", count: 22, trend: "up" },
      { subject: "Physics", count: 12, trend: "down" },
      { subject: "Biology", count: 18, trend: "stable" },
      { subject: "Calculus", count: 9, trend: "up" },
    ];

    const mockFriends: Friend[] = [
      { name: "Sarah", activity: "Practicing Algebra", avatar: "👩" },
      { name: "Mike", activity: "In Chemistry Class", avatar: "👨" },
      { name: "Emma", activity: "Flashcards - Physics", avatar: "👧" },
    ];

    setActivities(mockActivities);
    setFriendsOnline(mockFriends);
    setTotalOnline(mockActivities.reduce((sum, a) => sum + a.count, 0));

    // Simulate real-time updates
    const interval = setInterval(() => {
      setActivities(prev => prev.map(activity => ({
        ...activity,
        count: Math.max(0, activity.count + Math.floor(Math.random() * 5) - 2), // Prevent negative
        trend: Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable"
      })));
      setTotalOnline(prev => Math.max(0, prev + Math.floor(Math.random() * 10) - 5)); // Prevent negative
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTrendEmoji = (trend: string) => {
    switch (trend) {
      case "up": return "📈";
      case "down": return "📉";
      default: return "➡️";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Total Online */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          fontSize: "64px",
          fontWeight: "bold",
          color: "#0070f3",
          marginBottom: "8px"
        }}>
          {totalOnline}
        </div>
        <div style={{
          fontSize: "24px",
          color: "#1f2937",
          marginBottom: "8px"
        }}>
          learners online now
        </div>
        <div style={{
          display: "inline-block",
          padding: "8px 16px",
          background: "#dcfce7",
          color: "#166534",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "600"
        }}>
          🟢 Live
        </div>
      </div>

      {/* Friends Online */}
      {friendsOnline.length > 0 && (
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{
            fontSize: "20px",
            marginBottom: "20px",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            👥 Friends Online ({friendsOnline.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {friendsOnline.map((friend, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "12px",
                  background: "#f9fafb",
                  borderRadius: "12px",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#eff6ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px"
                }}>
                  {friend.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", color: "#1f2937", marginBottom: "4px" }}>
                    {friend.name}
                  </div>
                  <div style={{ fontSize: "14px", color: "#6b7280" }}>
                    {friend.activity}
                  </div>
                </div>
                <button style={{
                  padding: "8px 16px",
                  background: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Activity */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{
          fontSize: "20px",
          marginBottom: "20px",
          color: "#1f2937"
        }}>
          📚 Active by Subject
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          {activities.map((activity, index) => (
            <div
              key={index}
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0070f3";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px"
              }}>
                <h3 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1f2937"
                }}>
                  {activity.subject}
                </h3>
                <span style={{ fontSize: "20px" }}>
                  {getTrendEmoji(activity.trend)}
                </span>
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#0070f3",
                marginBottom: "4px"
              }}>
                {activity.count}
              </div>
              <div style={{
                fontSize: "14px",
                color: "#6b7280"
              }}>
                practicing now
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        padding: "32px",
        textAlign: "center",
        color: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{
          fontSize: "24px",
          marginBottom: "12px"
        }}>
          Join the action!
        </h2>
        <p style={{
          fontSize: "16px",
          opacity: 0.9,
          marginBottom: "24px"
        }}>
          Start practicing with peers and climb the leaderboards
        </p>
        <button style={{
          padding: "16px 32px",
          background: "white",
          color: "#667eea",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          Start Learning
        </button>
      </div>
    </div>
  );
}

