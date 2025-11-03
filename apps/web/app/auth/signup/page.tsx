"use client";

/**
 * Sign-up Page
 * Registration form with COPPA compliance and age verification
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    age: "",
    role: "STUDENT" as "STUDENT" | "PARENT" | "TUTOR",
    parentEmail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [requiresParentalConsent, setRequiresParentalConsent] = useState(false);

  const isMinor = parseInt(formData.age) < 13;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (isMinor && !formData.parentEmail) {
      newErrors.parentEmail = "Parent email required for users under 13";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          age: parseInt(formData.age),
          role: formData.role,
          parentEmail: isMinor ? formData.parentEmail : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Failed to create account" });
        setLoading(false);
        return;
      }

      if (data.requiresParentalConsent) {
        setRequiresParentalConsent(true);
        setLoading(false);
      } else {
        // Redirect to sign in
        router.push("/auth/signin?registered=true" as any);
      }
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
      setLoading(false);
    }
  };

  if (requiresParentalConsent) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            background: "white",
            borderRadius: "12px",
            padding: "48px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>✉️</div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            Parental Consent Required
          </h1>
          <p style={{ color: "#666", marginBottom: "24px" }}>
            We've sent a consent email to <strong>{formData.parentEmail}</strong>.
            Your parent needs to approve your account before you can sign in.
          </p>
          <p style={{ fontSize: "14px", color: "#999" }}>
            This email will expire in 7 days. Check your parent's inbox (and spam folder).
          </p>
          <Link
            href="/auth/signin"
            style={{
              display: "inline-block",
              marginTop: "32px",
              padding: "12px 24px",
              background: "#0070f3",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          background: "white",
          borderRadius: "12px",
          padding: "48px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Create Account
        </h1>
        <p style={{ color: "#666", textAlign: "center", marginBottom: "32px" }}>
          Join the 10x K-Factor growth system
        </p>

        {errors.general && (
          <div
            style={{
              padding: "12px",
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: "8px",
              color: "#c33",
              marginBottom: "24px",
            }}
          >
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
            {errors.name && (
              <p style={{ color: "#c33", fontSize: "14px", marginTop: "4px" }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
            {errors.email && (
              <p style={{ color: "#c33", fontSize: "14px", marginTop: "4px" }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Age */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Age
            </label>
            <input
              type="number"
              min="5"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
            {errors.age && (
              <p style={{ color: "#c33", fontSize: "14px", marginTop: "4px" }}>
                {errors.age}
              </p>
            )}
            {isMinor && formData.age && (
              <p
                style={{
                  background: "#fff3cd",
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#856404",
                  marginTop: "8px",
                }}
              >
                ℹ️ Users under 13 require parental consent (COPPA compliance)
              </p>
            )}
          </div>

          {/* Role */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              I am a...
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "STUDENT" | "PARENT" | "TUTOR",
                })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              <option value="STUDENT">Student</option>
              <option value="PARENT">Parent</option>
              <option value="TUTOR">Tutor</option>
            </select>
          </div>

          {/* Parent Email (if minor) */}
          {isMinor && (
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Parent/Guardian Email *
              </label>
              <input
                type="email"
                value={formData.parentEmail}
                onChange={(e) =>
                  setFormData({ ...formData, parentEmail: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px",
                }}
                placeholder="parent@example.com"
              />
              {errors.parentEmail && (
                <p style={{ color: "#c33", fontSize: "14px", marginTop: "4px" }}>
                  {errors.parentEmail}
                </p>
              )}
              <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                We'll send a consent email to your parent
              </p>
            </div>
          )}

          {/* Password */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
            {errors.password && (
              <p style={{ color: "#c33", fontSize: "14px", marginTop: "4px" }}>
                {errors.password}
              </p>
            )}
            <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              At least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: "#c33", fontSize: "14px", marginTop: "4px" }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms acceptance */}
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "24px" }}>
            By signing up, you agree to our{" "}
            <Link
              href="/legal/terms"
              style={{ color: "#0070f3", textDecoration: "underline" }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy"
              style={{ color: "#0070f3", textDecoration: "underline" }}
            >
              Privacy Policy
            </Link>
          </p>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            style={{
              color: "#0070f3",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

