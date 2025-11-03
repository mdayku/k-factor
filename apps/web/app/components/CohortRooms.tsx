"use client";

/**
 * Cohort Rooms Component
 * Live cohort activity feeds and co-practice rooms
 */

import { useState, useEffect } from "react";

interface CohortRoom {
  id: string;
  name: string;
  subject: string;
  membersCount: number;
  onlineCount: number;
  recentActivity: string[];
  goal: string;
  level: string;
}

export default function CohortRooms() {
  const [rooms, setRooms] = useState<CohortRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    // Simulate cohort rooms data
    const mockRooms: CohortRoom[] = [
      {
        id: "algebra-masters",
        name: "Algebra Masters",
        subject: "Algebra",
        membersCount: 45,
        onlineCount: 12,
        recentActivity: [
          "Sarah completed Linear Equations practice",
          "Mike earned a streak shield",
          "Emma started a Buddy Challenge",
        ],
        goal: "Master Algebra 1 by end of month",
        level: "Intermediate"
      },
      {
        id: "chem-club",
        name: "Chemistry Club",
        subject: "Chemistry",
        membersCount: 32,
        onlineCount: 8,
        recentActivity: [
          "Tom finished Periodic Table quiz",
          "Lisa invited 2 friends",
          "David reached FVM milestone",
        ],
        goal: "Ace Chemistry midterm",
        level: "Advanced"
      },
      {
        id: "physics-phans",
        name: "Physics Phans",
        subject: "Physics",
        membersCount: 28,
        onlineCount: 6,
        recentActivity: [
          "Alex completed Newton's Laws",
          "Sam started Kinematics practice",
        ],
        goal: "Complete Physics 101",
        level: "Beginner"
      },
      {
        id: "calculus-crew",
        name: "Calculus Crew",
        subject: "Calculus",
        membersCount: 18,
        onlineCount: 5,
        recentActivity: [
          "Jamie solved 10 derivative problems",
          "Chris earned integration badge",
        ],
        goal: "Master AP Calculus",
        level: "Advanced"
      },
    ];

    setRooms(mockRooms);

    // Simulate real-time activity updates
    const interval = setInterval(() => {
      setRooms(prev => prev.map(room => ({
        ...room,
        onlineCount: Math.max(1, room.onlineCount + Math.floor(Math.random() * 3) - 1)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "#10b981";
      case "Intermediate": return "#f59e0b";
      case "Advanced": return "#ef4444";
      default: return "#6b7280";
    }
  };

  if (selectedRoom) {
    const room = rooms.find(r => r.id === selectedRoom);
    if (!room) return null;

    return (
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <div>
            <h2 style={{
              fontSize: "28px",
              color: "#1f2937",
              marginBottom: "8px"
            }}>
              {room.name}
            </h2>
            <div style={{
              display: "flex",
              gap: "12px",
              alignItems: "center"
            }}>
              <span style={{
                padding: "4px 12px",
                background: getLevelColor(room.level),
                color: "white",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                {room.level}
              </span>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                {room.subject}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedRoom(null)}
            style={{
              padding: "8px 16px",
              background: "#f3f4f6",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            ← Back
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
          marginBottom: "32px"
        }}>
          <div style={{
            padding: "16px",
            background: "#f9fafb",
            borderRadius: "12px"
          }}>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
              Total Members
            </div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
              {room.membersCount}
            </div>
          </div>
          <div style={{
            padding: "16px",
            background: "#dcfce7",
            borderRadius: "12px"
          }}>
            <div style={{ fontSize: "12px", color: "#166534", marginBottom: "4px" }}>
              Online Now
            </div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#166534" }}>
              🟢 {room.onlineCount}
            </div>
          </div>
        </div>

        {/* Goal */}
        <div style={{
          padding: "20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "12px",
          color: "white",
          marginBottom: "32px"
        }}>
          <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>
            🎯 Room Goal
          </div>
          <div style={{ fontSize: "20px", fontWeight: "600" }}>
            {room.goal}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div>
          <h3 style={{
            fontSize: "18px",
            color: "#1f2937",
            marginBottom: "16px"
          }}>
            📊 Recent Activity
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {room.recentActivity.map((activity, index) => (
              <div
                key={index}
                style={{
                  padding: "16px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10b981"
                }} />
                <div style={{
                  fontSize: "14px",
                  color: "#374151"
                }}>
                  {activity}
                </div>
                <div style={{
                  marginLeft: "auto",
                  fontSize: "12px",
                  color: "#9ca3af"
                }}>
                  {index === 0 ? "Just now" : index === 1 ? "2m ago" : "5m ago"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
          marginTop: "32px"
        }}>
          <button style={{
            flex: 1,
            padding: "16px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Start Co-Practice
          </button>
          <button style={{
            flex: 1,
            padding: "16px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Invite Friends
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "32px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{
        fontSize: "24px",
        marginBottom: "24px",
        color: "#1f2937"
      }}>
        💬 Join a Cohort Room
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {rooms.map((room) => (
          <div
            key={room.id}
            style={{
              padding: "24px",
              background: "#f9fafb",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onClick={() => setSelectedRoom(room.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0070f3";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "16px"
            }}>
              <div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "8px"
                }}>
                  {room.name}
                </h3>
                <div style={{
                  fontSize: "14px",
                  color: "#6b7280"
                }}>
                  {room.subject}
                </div>
              </div>
              <span style={{
                padding: "4px 8px",
                background: getLevelColor(room.level),
                color: "white",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "600"
              }}>
                {room.level}
              </span>
            </div>

            {/* Stats */}
            <div style={{
              display: "flex",
              gap: "16px",
              marginBottom: "16px"
            }}>
              <div style={{
                flex: 1,
                padding: "12px",
                background: "white",
                borderRadius: "8px"
              }}>
                <div style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  marginBottom: "4px"
                }}>
                  Members
                </div>
                <div style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1f2937"
                }}>
                  {room.membersCount}
                </div>
              </div>
              <div style={{
                flex: 1,
                padding: "12px",
                background: "#dcfce7",
                borderRadius: "8px"
              }}>
                <div style={{
                  fontSize: "11px",
                  color: "#166534",
                  marginBottom: "4px"
                }}>
                  Online
                </div>
                <div style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#166534"
                }}>
                  🟢 {room.onlineCount}
                </div>
              </div>
            </div>

            {/* Goal */}
            <div style={{
              padding: "12px",
              background: "white",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#374151"
            }}>
              <span style={{ marginRight: "6px" }}>🎯</span>
              {room.goal}
            </div>
          </div>
        ))}
      </div>

      {/* Create Room CTA */}
      <div style={{
        marginTop: "32px",
        padding: "24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "12px",
        textAlign: "center",
        color: "white"
      }}>
        <h3 style={{
          fontSize: "20px",
          marginBottom: "8px"
        }}>
          Can't find the right room?
        </h3>
        <p style={{
          fontSize: "14px",
          opacity: 0.9,
          marginBottom: "16px"
        }}>
          Create your own cohort and invite friends to join!
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
          Create Cohort Room
        </button>
      </div>
    </div>
  );
}

