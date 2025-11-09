"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { Route } from "next";

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Don't show nav on auth pages
  if (pathname?.startsWith("/auth") || pathname?.startsWith("/challenge")) {
    return null;
  }

  if (!session?.user) {
    return null;
  }

  const links = [
    { href: "/presence" as Route, label: "Home" },
    { href: "/practice" as Route, label: "Practice" },
    { href: "/test-challenges" as Route, label: "Challenges" },
    { href: "/dashboard" as Route, label: "Dashboard" },
  ];

  return (
    <nav style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "12px 24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo / Brand */}
        <Link href="/presence" style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "white",
          textDecoration: "none",
          letterSpacing: "0.5px",
        }}>
          VT K-Factor
        </Link>

        {/* Nav Links */}
        <div style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  color: "white",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: isActive ? "600" : "500",
                  background: isActive ? "rgba(255,255,255,0.25)" : "transparent",
                  transition: "all 0.2s",
                  borderBottom: isActive ? "2px solid white" : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* User Menu */}
          <div style={{
            marginLeft: "16px",
            paddingLeft: "16px",
            borderLeft: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <div style={{
              color: "white",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "600",
              }}>
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span>{(session.user.name || "U").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span style={{ fontWeight: "500" }}>
                {session.user.name || "Student"}
              </span>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

