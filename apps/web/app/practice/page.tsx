"use client";

/**
 * Enhanced Practice/Study Mode
 * - Unit selection
 * - Progress tracking
 * - Review mode
 * - Completion %
 * - Final test
 * - Leaderboard integration
 * - Viral loops
 */

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useTracking, useScrollTracking } from "../../hooks/useTracking";

interface Question {
  id: string;
  unit: string;
  skill: string;
  difficulty: "easy" | "medium" | "hard";
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Progress {
  [unit: string]: {
    completed: number;
    total: number;
    bestScore: number;
  };
}

export default function PracticePage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Event tracking for AI retraining
  const { trackClick, trackFormSubmit } = useTracking("Practice Page");
  useScrollTracking(75);
  
  const [view, setView] = useState<"menu" | "practice" | "review">("menu");
  const [units, setUnits] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [progress, setProgress] = useState<Progress>({});
  const [loading, setLoading] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [lastSessionScore, setLastSessionScore] = useState<number | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("geography_progress");
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Load units
  useEffect(() => {
    fetch("/api/curriculum/geography")
      .then(res => res.json())
      .then(data => {
        setUnits(data.units || []);
        // Initialize progress for new units
        const newProgress = { ...progress };
        data.units.forEach((unit: string) => {
          if (!newProgress[unit]) {
            newProgress[unit] = { completed: 0, total: 0, bestScore: 0 };
          }
        });
        setProgress(newProgress);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load units:", err);
        setLoading(false);
      });
  }, []);

  const startPractice = async (unit: string | null, isFinal = false) => {
    // Track practice start
    trackClick("Start Practice", { unit, isFinal });
    
    setSelectedUnit(unit);
    setLoading(true);
    
    try {
      const url = new URL("/api/curriculum/geography", window.location.origin);
      if (unit) url.searchParams.set("unit", unit);
      if (isFinal) url.searchParams.set("final", "true");
      url.searchParams.set("count", "10");
      
      const res = await fetch(url);
      const data = await res.json();
      
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setAnswers([]);
      setView("practice");
      setReviewMode(false);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load questions:", err);
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete
      const score = calculateScore(newAnswers);
      setLastSessionScore(score);
      
      // Update progress
      if (selectedUnit) {
        const newProgress = { ...progress };
        if (!newProgress[selectedUnit]) {
          newProgress[selectedUnit] = { completed: 0, total: 0, bestScore: 0 };
        }
        newProgress[selectedUnit].completed += 1;
        newProgress[selectedUnit].total = questions.length;
        newProgress[selectedUnit].bestScore = Math.max(
          newProgress[selectedUnit].bestScore,
          score
        );
        setProgress(newProgress);
        localStorage.setItem("geography_progress", JSON.stringify(newProgress));
      }
      
      // Go to results
      router.push(`/practice/results?score=${score}&total=${questions.length}&unit=${selectedUnit || "mixed"}` as Route);
    }
  };

  const startReview = () => {
    setReviewMode(true);
    setCurrentIndex(0);
    setView("review");
  };

  const calculateScore = (userAnswers: number[]): number => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const getTotalCompletion = (): number => {
    const completed = Object.values(progress).reduce((sum, p) => sum + p.completed, 0);
    const total = units.length * 3; // Assume 3 sessions per unit for 100%
    return Math.min(100, Math.round((completed / total) * 100));
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p style={{ margin: 0, color: "#6b7280" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // MENU VIEW
  if (view === "menu") {
    const completion = getTotalCompletion();
    
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Header with progress */}
          <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h1 style={{ fontSize: "32px", margin: "0 0 8px 0", color: "#1f2937" }}>
                  🌍 Geography Practice
                </h1>
                <p style={{ margin: 0, color: "#6b7280" }}>7th/8th Grade Curriculum</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: "#0070f3" }}>
                  {completion}%
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>Complete</div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div style={{
              background: "#e5e7eb",
              height: "12px",
              borderRadius: "6px",
              overflow: "hidden"
            }}>
              <div style={{
                background: "linear-gradient(90deg, #0070f3, #00c6ff)",
                height: "100%",
                width: `${completion}%`,
                transition: "width 0.5s"
              }} />
            </div>
          </div>

          {/* Unit selection */}
          <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <h2 style={{ fontSize: "20px", marginBottom: "24px", color: "#1f2937" }}>
              📚 Choose a Unit
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "16px"
            }}>
              {units.map((unit, index) => {
                const unitProgress = progress[unit] || { completed: 0, total: 0, bestScore: 0 };
                const unitCompletion = unitProgress.completed > 0 
                  ? Math.min(100, Math.round((unitProgress.completed / 3) * 100))
                  : 0;
                
                return (
                  <button
                    key={unit}
                    onClick={() => startPractice(unit)}
                    style={{
                      padding: "20px",
                      background: unitCompletion === 100 ? "#dcfce7" : "#f9fafb",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      cursor: "pointer",
                      textAlign: "left",
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
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                      {["🌍", "🗺️", "🏔️", "🌦️", "🏛️", "🧭"][index]}
                    </div>
                    <h3 style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#1f2937"
                    }}>
                      {unit}
                    </h3>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px"
                    }}>
                      <div style={{
                        flex: 1,
                        height: "4px",
                        background: "#e5e7eb",
                        borderRadius: "2px",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${unitCompletion}%`,
                          background: unitCompletion === 100 ? "#10b981" : "#0070f3",
                          transition: "width 0.3s"
                        }} />
                      </div>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#6b7280"
                      }}>
                        {unitCompletion}%
                      </span>
                    </div>
                    {unitProgress.bestScore > 0 && (
                      <div style={{
                        fontSize: "12px",
                        color: "#6b7280"
                      }}>
                        Best: {unitProgress.bestScore}/{unitProgress.total}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Final Test */}
          <div style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            color: "white",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏆</div>
            <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>
              Final Test
            </h2>
            <p style={{ marginBottom: "24px", opacity: 0.9 }}>
              Test your knowledge across all units!
            </p>
            <button
              onClick={() => startPractice(null, true)}
              style={{
                padding: "16px 32px",
                background: "white",
                color: "#f59e0b",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Start Final Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PRACTICE/REVIEW VIEW
  const currentQuestion = questions[currentIndex];
  const progress2 = ((currentIndex + 1) / questions.length) * 100;
  const isCorrect = reviewMode && answers[currentIndex] === currentQuestion.correctAnswer;
  const isIncorrect = reviewMode && answers[currentIndex] !== currentQuestion.correctAnswer;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Progress bar */}
        <div style={{
          background: "rgba(255,255,255,0.2)",
          borderRadius: "12px",
          height: "8px",
          marginBottom: "32px",
          overflow: "hidden"
        }}>
          <div style={{
            background: "white",
            height: "100%",
            width: `${progress2}%`,
            transition: "width 0.3s"
          }} />
        </div>

        {/* Question card */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px"
          }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{
                padding: "8px 16px",
                background: "#eff6ff",
                color: "#0070f3",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600"
              }}>
                {currentQuestion.unit}
              </span>
              <span style={{
                padding: "8px 16px",
                background: currentQuestion.difficulty === "easy" ? "#dcfce7" :
                           currentQuestion.difficulty === "medium" ? "#fef3c7" : "#fee2e2",
                color: currentQuestion.difficulty === "easy" ? "#166534" :
                       currentQuestion.difficulty === "medium" ? "#92400e" : "#991b1b",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
            </div>
            <span style={{
              fontSize: "14px",
              color: "#6b7280",
              fontWeight: "600"
            }}>
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <h2 style={{
            fontSize: "24px",
            marginBottom: "32px",
            color: "#1f2937",
            lineHeight: "1.4"
          }}>
            {currentQuestion.text}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: reviewMode ? "32px" : "0" }}>
            {currentQuestion.options.map((option, index) => {
              const isThisCorrect = index === currentQuestion.correctAnswer;
              const isThisSelected = reviewMode && answers[currentIndex] === index;
              
              return (
                <button
                  key={index}
                  onClick={() => !reviewMode && handleAnswer(index)}
                  disabled={reviewMode}
                  style={{
                    padding: "20px 24px",
                    background: reviewMode
                      ? isThisCorrect
                        ? "#dcfce7"
                        : isThisSelected
                        ? "#fee2e2"
                        : "#f9fafb"
                      : "#f9fafb",
                    border: reviewMode
                      ? isThisCorrect
                        ? "2px solid #10b981"
                        : isThisSelected
                        ? "2px solid #ef4444"
                        : "2px solid #e5e7eb"
                      : "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#1f2937",
                    cursor: reviewMode ? "default" : "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (!reviewMode) {
                      e.currentTarget.style.background = "#eff6ff";
                      e.currentTarget.style.borderColor = "#0070f3";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!reviewMode) {
                      e.currentTarget.style.background = "#f9fafb";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.transform = "translateX(0)";
                    }
                  }}
                >
                  <span style={{
                    display: "inline-block",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: reviewMode
                      ? isThisCorrect
                        ? "#10b981"
                        : isThisSelected
                        ? "#ef4444"
                        : "#e5e7eb"
                      : "#e5e7eb",
                    color: reviewMode && (isThisCorrect || isThisSelected) ? "white" : "#6b7280",
                    textAlign: "center",
                    lineHeight: "32px",
                    marginRight: "16px",
                    fontWeight: "600"
                  }}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                  {reviewMode && isThisCorrect && <span style={{ marginLeft: "12px" }}>✓</span>}
                  {reviewMode && isThisSelected && !isThisCorrect && <span style={{ marginLeft: "12px" }}>✗</span>}
                </button>
              );
            })}
          </div>

          {/* Review mode explanation */}
          {reviewMode && (
            <div style={{
              padding: "20px",
              background: "#eff6ff",
              borderRadius: "12px",
              marginBottom: "24px",
              border: "1px solid #dbeafe"
            }}>
              <h4 style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#1e40af",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span>💡</span>
                Explanation:
              </h4>
              <p style={{
                margin: 0,
                fontSize: "14px",
                color: "#1e40af",
                lineHeight: "1.6"
              }}>
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Review mode navigation */}
          {reviewMode && (
            <div style={{ display: "flex", gap: "16px", justifyContent: "space-between" }}>
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                style={{
                  padding: "12px 24px",
                  background: currentIndex === 0 ? "#e5e7eb" : "#f3f4f6",
                  color: currentIndex === 0 ? "#9ca3af" : "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: currentIndex === 0 ? "not-allowed" : "pointer"
                }}
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  if (currentIndex < questions.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                  } else {
                    setView("menu");
                  }
                }}
                style={{
                  padding: "12px 24px",
                  background: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                {currentIndex < questions.length - 1 ? "Next →" : "Back to Menu"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
