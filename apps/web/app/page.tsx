"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (session?.user) {
      // Logged in → redirect to Presence (home)
      router.push("/presence");
    } else {
      // Not logged in → redirect to sign in
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  // Show loading while redirecting
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: "48px",
          marginBottom: "16px",
        }}>
          🎓
        </div>
        <h1 style={{ margin: "0 0 8px 0", color: "#1f2937" }}>
          Loading...
        </h1>
        <p style={{ margin: 0, color: "#6b7280" }}>
          Redirecting you to the right place
        </p>
      </div>
    </div>
  );
}
