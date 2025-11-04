"use client";

/**
 * Challenge Landing Page - FVM (First Value Moment)
 * 5-question skill check for referred users
 * Deep link with prefilled context from the referrer
 */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Route } from "next";
import Link from "next/link";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface ChallengeData {
  id: string;
  referrerName: string;
  referrerScore: number;
  subject: string;
  skill: string;
  questions: Question[];
}

export default function ChallengePage() {
  const params = useParams();
  const challengeId = params?.id as string;

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [signedLinkId, setSignedLinkId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch signed link data to get proper attribution
    const fetchSignedLink = async () => {
      try {
        const response = await fetch(`/api/signed-link/${challengeId}`);
        if (response.ok) {
          const data = await response.json();
          setSignedLinkId(data.id);
          
          // Use real data from signed link
          const mockChallenge: ChallengeData = {
            id: challengeId,
            referrerName: data.referrerName || "A friend",
            referrerScore: data.metadata?.referrerScore || 85,
            subject: data.context || data.metadata?.subject || "Algebra",
            skill: "Practice Questions",
            questions: [
              {
                id: "1",
                text: "Solve for x: 2x + 5 = 13",
                options: ["x = 4", "x = 8", "x = 3", "x = 6"],
                correctAnswer: 0,
              },
              {
                id: "2",
                text: "What is the slope of the line y = 3x + 2?",
                options: ["2", "3", "5", "1"],
                correctAnswer: 1,
              },
              {
                id: "3",
                text: "Simplify: 4(2x - 3)",
                options: ["8x - 12", "8x - 3", "6x - 12", "8x + 12"],
                correctAnswer: 0,
              },
              {
                id: "4",
                text: "If 3x = 15, what is x?",
                options: ["3", "5", "45", "12"],
                correctAnswer: 1,
              },
              {
                id: "5",
                text: "Solve: x/4 = 3",
                options: ["12", "7", "4/3", "1.33"],
                correctAnswer: 0,
              },
            ],
          };

          setChallenge(mockChallenge);
          setLoading(false);

          // Track invite.opened event with signedLinkId
          fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "invite.opened",
              metadata: {
                challengeId,
                signedLinkId: data.id,
                referrerId: data.referrerId,
                surface: "web",
              },
            }),
          });
        } else {
          // Fallback to mock data if API fails
          const mockChallenge: ChallengeData = {
            id: challengeId,
            referrerName: "A friend",
            referrerScore: 85,
            subject: "Algebra",
            skill: "Linear Equations",
            questions: [
              {
                id: "1",
                text: "Solve for x: 2x + 5 = 13",
                options: ["x = 4", "x = 8", "x = 3", "x = 6"],
                correctAnswer: 0,
              },
              {
                id: "2",
                text: "What is the slope of the line y = 3x + 2?",
                options: ["2", "3", "5", "1"],
                correctAnswer: 1,
              },
              {
                id: "3",
                text: "Simplify: 4(2x - 3)",
                options: ["8x - 12", "8x - 3", "6x - 12", "8x + 12"],
                correctAnswer: 0,
              },
              {
                id: "4",
                text: "If 3x = 15, what is x?",
                options: ["3", "5", "45", "12"],
                correctAnswer: 1,
              },
              {
                id: "5",
                text: "Solve: x/4 = 3",
                options: ["12", "7", "4/3", "1.33"],
                correctAnswer: 0,
              },
            ],
          };
          setChallenge(mockChallenge);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch signed link:", error);
        // Use fallback mock data
        setLoading(false);
      }
    };

    fetchSignedLink();
  }, [challengeId]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < (challenge?.questions.length || 0) - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Challenge complete!
      setTimeout(() => {
        setShowResults(true);
        
        // Track FVM reached with attribution
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "fvm.reached",
            metadata: {
              challengeId,
              signedLinkId,
              score: calculateScore(newAnswers),
            },
          }),
        });
      }, 300);
    }
  };

  const calculateScore = (userAnswers: number[]) => {
    if (!challenge) return 0;
    const correct = userAnswers.filter(
      (answer, index) => answer === challenge.questions[index].correctAnswer
    ).length;
    return Math.round((correct / challenge.questions.length) * 100);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <h1 style={{ color: "white", fontSize: "32px" }}>
          Loading challenge...
        </h1>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <h1 style={{ color: "white", fontSize: "32px" }}>
          Challenge not found
        </h1>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const userScore = calculateScore(answers);
    const beatReferrer = userScore > challenge.referrerScore;

    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}>
          <div style={{
            fontSize: "72px",
            marginBottom: "24px"
          }}>
            {beatReferrer ? "🏆" : "🎯"}
          </div>

          <h1 style={{
            fontSize: "32px",
            marginBottom: "16px",
            color: "#1f2937"
          }}>
            {beatReferrer ? "You Won!" : "Great Try!"}
          </h1>

          <p style={{
            fontSize: "18px",
            color: "#6b7280",
            marginBottom: "32px"
          }}>
            You scored <strong style={{ color: "#0070f3" }}>{userScore}%</strong>
            <br />
            {challenge.referrerName} scored {challenge.referrerScore}%
          </p>

          <div style={{
            background: "#f9fafb",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "32px"
          }}>
            <p style={{
              fontSize: "16px",
              color: "#374151",
              marginBottom: "12px"
            }}>
              🛡️ <strong>Reward Unlocked!</strong>
            </p>
            <p style={{
              fontSize: "14px",
              color: "#6b7280"
            }}>
              You both earned Streak Shields!
            </p>
          </div>

          <Link
            href={`/auth/signup?ref=${signedLinkId || challengeId}` as Route}
            style={{
              display: "inline-block",
              padding: "16px 32px",
              background: "#0070f3",
              color: "white",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "600",
              textDecoration: "none",
              marginBottom: "16px"
            }}
          >
            Sign Up to Continue
          </Link>

          <p style={{
            fontSize: "14px",
            color: "#9ca3af"
          }}>
            Already have an account?{" "}
            <Link
              href={"/auth/signin" as Route}
              style={{
                color: "#0070f3",
                textDecoration: "underline"
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Start screen
  if (!started) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}>
          <div style={{
            fontSize: "64px",
            marginBottom: "24px"
          }}>
            🎯
          </div>

          <h1 style={{
            fontSize: "32px",
            marginBottom: "16px",
            color: "#1f2937"
          }}>
            Challenge from {challenge.referrerName}!
          </h1>

          <p style={{
            fontSize: "18px",
            color: "#6b7280",
            marginBottom: "32px"
          }}>
            {challenge.referrerName} scored <strong>{challenge.referrerScore}%</strong> on{" "}
            {challenge.subject}. Think you can beat that?
          </p>

          <div style={{
            background: "#f9fafb",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "32px",
            textAlign: "left"
          }}>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>
              📝 <strong>Quick Challenge:</strong>
            </p>
            <ul style={{
              fontSize: "14px",
              color: "#374151",
              lineHeight: "1.8",
              paddingLeft: "20px"
            }}>
              <li>5 questions on {challenge.skill}</li>
              <li>Takes about 3-5 minutes</li>
              <li>Instant results</li>
              <li>Both get rewards!</li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            style={{
              padding: "16px 48px",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,112,243,0.3)"
            }}
          >
            Start Challenge
          </button>

          <p style={{
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: "24px"
          }}>
            No account needed to try the challenge!
          </p>
        </div>
      </div>
    );
  }

  // Question screen
  const question = challenge.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / challenge.questions.length) * 100;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "600px",
        width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Progress bar */}
        <div style={{
          marginBottom: "32px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              Question {currentQuestion + 1} of {challenge.questions.length}
            </span>
            <span style={{ fontSize: "14px", color: "#0070f3", fontWeight: "600" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{
            height: "8px",
            background: "#e5e7eb",
            borderRadius: "4px",
            overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "#0070f3",
              transition: "width 0.3s ease"
            }} />
          </div>
        </div>

        {/* Question */}
        <h2 style={{
          fontSize: "24px",
          marginBottom: "32px",
          color: "#1f2937",
          lineHeight: "1.4"
        }}>
          {question.text}
        </h2>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              style={{
                padding: "16px 20px",
                background: "white",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "16px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
                color: "#1f2937"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0070f3";
                e.currentTarget.style.background = "#eff6ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background = "white";
              }}
            >
              <span style={{
                display: "inline-block",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#f3f4f6",
                textAlign: "center",
                lineHeight: "32px",
                marginRight: "12px",
                fontWeight: "600"
              }}>
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

