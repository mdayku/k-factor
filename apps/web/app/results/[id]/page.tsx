"use client";

/**
 * Results Page - Async Tools (Diagnostics, Practice Tests, Flashcards)
 * Viral surface with share cards, challenge CTAs, and deep links
 */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ShareCard from "../../components/ShareCard";
import ChallengeCTA from "../../components/ChallengeCTA";

interface ResultData {
  id: string;
  type: "diagnostic" | "practice" | "flashcard";
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  skillsBreakdown: {
    skill: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  completedAt: string;
  timeTaken: number; // seconds
}

export default function ResultsPage() {
  const params = useParams();
  const resultId = params?.id as string;
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    // Fetch result data
    // For now, using mock data
    const mockResult: ResultData = {
      id: resultId,
      type: "practice",
      subject: "Algebra",
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      skillsBreakdown: [
        { skill: "Linear Equations", correct: 8, total: 10, percentage: 80 },
        { skill: "Quadratic Functions", correct: 6, total: 7, percentage: 86 },
        { skill: "Polynomials", correct: 3, total: 3, percentage: 100 },
      ],
      completedAt: new Date().toISOString(),
      timeTaken: 1240, // ~20 minutes
    };

    setResult(mockResult);
    setLoading(false);
  }, [resultId]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Loading results...</h1>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Results not found</h1>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10b981"; // green
    if (score >= 70) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "white",
        borderRadius: "16px",
        padding: "40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-block",
            background: getScoreColor(result.score),
            color: "white",
            fontSize: "72px",
            fontWeight: "bold",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            {result.score}%
          </div>
          <h1 style={{ fontSize: "32px", marginBottom: "8px", color: "#1f2937" }}>
            {result.subject} {result.type === "diagnostic" ? "Diagnostic" : "Practice"}
          </h1>
          <p style={{ fontSize: "18px", color: "#6b7280" }}>
            {result.correctAnswers} out of {result.totalQuestions} correct
          </p>
          <p style={{ fontSize: "14px", color: "#9ca3af", marginTop: "8px" }}>
            Completed in {Math.floor(result.timeTaken / 60)} minutes
          </p>
        </div>

        {/* Skills Breakdown */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#1f2937" }}>
            Skills Breakdown
          </h2>
          {result.skillsBreakdown.map((skill, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px"
              }}>
                <span style={{ fontWeight: "600", color: "#374151" }}>
                  {skill.skill}
                </span>
                <span style={{ color: "#6b7280" }}>
                  {skill.correct}/{skill.total} ({skill.percentage}%)
                </span>
              </div>
              <div style={{
                height: "12px",
                background: "#e5e7eb",
                borderRadius: "6px",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${skill.percentage}%`,
                  background: getScoreColor(skill.percentage),
                  transition: "width 0.5s ease"
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Challenge CTAs - Viral Surface! */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "32px",
          borderRadius: "12px",
          marginBottom: "32px"
        }}>
          <h2 style={{
            fontSize: "24px",
            color: "white",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            🎯 Ready to Challenge Your Friends?
          </h2>
          <p style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            marginBottom: "24px"
          }}>
            See if they can beat your score! Both get rewards when they complete the challenge.
          </p>
          
          <ChallengeCTA
            resultId={result.id}
            subject={result.subject}
            score={result.score}
            type="buddy-challenge"
          />
        </div>

        {/* Share Card */}
        <div style={{ marginBottom: "32px" }}>
          <button
            onClick={() => setShareModalOpen(!shareModalOpen)}
            style={{
              width: "100%",
              padding: "16px",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            📤 Share Your Results
          </button>
        </div>

        {shareModalOpen && (
          <ShareCard
            resultId={result.id}
            subject={result.subject}
            score={result.score}
            skillsBreakdown={result.skillsBreakdown}
            onClose={() => setShareModalOpen(false)}
          />
        )}

        {/* Next Steps */}
        <div style={{
          textAlign: "center",
          paddingTop: "32px",
          borderTop: "2px solid #e5e7eb"
        }}>
          <h3 style={{ fontSize: "20px", marginBottom: "16px", color: "#1f2937" }}>
            What's Next?
          </h3>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <button style={{
              padding: "12px 24px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              Practice Weak Areas
            </button>
            <button style={{
              padding: "12px 24px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              Try Another Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

