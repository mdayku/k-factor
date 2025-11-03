"use client";

/**
 * Mini Leaderboard Component
 * Per-subject leaderboards with friend filtering
 */

import { useState, useEffect } from "react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  isFriend: boolean;
  isCurrentUser: boolean;
}

export default function MiniLeaderboard() {
  const [subject, setSubject] = useState("Algebra");
  const [filterFriends, setFilterFriends] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const subjects = ["Algebra", "Geometry", "Chemistry", "Physics", "Biology", "Calculus"];

  useEffect(() => {
    // Simulate leaderboard data
    const mockData: LeaderboardEntry[] = [
      { rank: 1, name: "Alex Chen", avatar: "🏆", score: 2850, streak: 28, isFriend: false, isCurrentUser: false },
      { rank: 2, name: "Sarah Kim", avatar: "⭐", score: 2720, streak: 24, isFriend: true, isCurrentUser: false },
      { rank: 3, name: "Mike Johnson", avatar: "🎯", score: 2580, streak: 19, isFriend: true, isCurrentUser: false },
      { rank: 4, name: "You", avatar: "👤", score: 2450, streak: 15, isFriend: false, isCurrentUser: true },
      { rank: 5, name: "Emma Davis", avatar: "✨", score: 2320, streak: 21, isFriend: false, isCurrentUser: false },
      { rank: 6, name: "James Wilson", avatar: "🚀", score: 2180, streak: 12, isFriend: true, isCurrentUser: false },
      { rank: 7, name: "Lisa Brown", avatar: "💫", score: 2050, streak: 16, isFriend: false, isCurrentUser: false },
      { rank: 8, name: "David Lee", avatar: "⚡", score: 1920, streak: 9, isFriend: false, isCurrentUser: false },
      { rank: 9, name: "Amy Martinez", avatar: "🌟", score: 1840, streak: 14, isFriend: true, isCurrentUser: false },
      { rank: 10, name: "Tom Anderson", avatar: "🎨", score: 1750, streak: 8, isFriend: false, isCurrentUser: false },
    ];

    if (filterFriends) {
      setLeaderboard(mockData.filter(entry => entry.isFriend || entry.isCurrentUser));
    } else {
      setLeaderboard(mockData);
    }
  }, [subject, filterFriends]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#f59e0b"; // gold
    if (rank === 2) return "#9ca3af"; // silver
    if (rank === 3) return "#d97706"; // bronze
    return "#6b7280"; // default
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Controls */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* Subject selector */}
          <div>
            <label style={{
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "8px",
              display: "block"
            }}>
              Subject:
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                padding: "10px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                background: "white"
              }}
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Friends filter */}
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer"
          }}>
            <input
              type="checkbox"
              checked={filterFriends}
              onChange={(e) => setFilterFriends(e.target.checked)}
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer"
              }}
            />
            <span style={{ fontSize: "16px", color: "#374151" }}>
              Friends only
            </span>
          </label>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{
          fontSize: "24px",
          marginBottom: "20px",
          color: "#1f2937",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          🏆 {subject} Leaderboard
        </h2>

        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 120px 120px",
          gap: "16px",
          padding: "12px 16px",
          background: "#f9fafb",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          color: "#6b7280",
          marginBottom: "12px"
        }}>
          <div>Rank</div>
          <div>Name</div>
          <div>Score</div>
          <div>Streak</div>
        </div>

        {/* Entries */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {leaderboard.map((entry, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 120px 120px",
                gap: "16px",
                padding: "16px",
                background: entry.isCurrentUser ? "#eff6ff" : "#f9fafb",
                border: entry.isCurrentUser ? "2px solid #0070f3" : "2px solid transparent",
                borderRadius: "12px",
                alignItems: "center",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                if (!entry.isCurrentUser) {
                  e.currentTarget.style.background = "#f3f4f6";
                }
              }}
              onMouseLeave={(e) => {
                if (!entry.isCurrentUser) {
                  e.currentTarget.style.background = "#f9fafb";
                }
              }}
            >
              {/* Rank */}
              <div style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: getRankColor(entry.rank)
              }}>
                {getRankBadge(entry.rank)}
              </div>

              {/* Name */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px"
                }}>
                  {entry.avatar}
                </div>
                <div>
                  <div style={{
                    fontWeight: "600",
                    color: "#1f2937",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    {entry.name}
                    {entry.isFriend && (
                      <span style={{ fontSize: "14px" }}>👥</span>
                    )}
                    {entry.isCurrentUser && (
                      <span style={{
                        fontSize: "12px",
                        padding: "2px 8px",
                        background: "#0070f3",
                        color: "white",
                        borderRadius: "4px"
                      }}>
                        You
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#0070f3"
              }}>
                {entry.score.toLocaleString()}
              </div>

              {/* Streak */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#f59e0b"
              }}>
                <span>🔥</span>
                <span>{entry.streak}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Challenge CTA */}
        <div style={{
          marginTop: "24px",
          padding: "20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "12px",
          textAlign: "center",
          color: "white"
        }}>
          <p style={{
            fontSize: "16px",
            marginBottom: "12px"
          }}>
            Challenge the top players and climb the ranks!
          </p>
          <button style={{
            padding: "12px 24px",
            background: "white",
            color: "#667eea",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Start Practice
          </button>
        </div>
      </div>
    </div>
  );
}

