"use client";

/**
 * Header Component
 * Shows user info and logout button
 */

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return null; // Don't show header if not logged in
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid #e5e7eb",
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 1000,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
      {/* Logo/Brand */}
      <div style={{
        fontSize: "18px",
        fontWeight: "bold",
        color: "#667eea",
        cursor: "pointer"
      }} onClick={() => router.push("/dashboard")}>
        VT K-Factor
      </div>

      {/* User Info & Logout */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          fontSize: "14px"
        }}>
          <div style={{ fontWeight: "600", color: "#1f2937" }}>
            {session.user?.email}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280", textTransform: "capitalize" }}>
            {session.user?.role || "student"}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ef4444";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

