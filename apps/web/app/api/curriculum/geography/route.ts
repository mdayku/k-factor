/**
 * Geography Curriculum API
 * Serves questions from the 7th/8th grade geography curriculum
 */

import { NextRequest, NextResponse } from "next/server";

// Import the geography curriculum
// For now, inline a subset. In production, this would come from a database
const geographyUnits = [
  "Continents and Oceans",
  "Countries and Capitals",
  "Physical Geography",
  "Climate and Biomes",
  "Cultural Geography",
  "Map Skills"
];

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

// Sample questions (in production, load all 200 from the curriculum file)
const sampleQuestions: Question[] = [
  // Continents and Oceans
  {
    id: "geo-1-001",
    unit: "Continents and Oceans",
    skill: "Identify continents",
    difficulty: "easy",
    text: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    explanation: "There are 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America."
  },
  {
    id: "geo-1-002",
    unit: "Continents and Oceans",
    skill: "Identify continents",
    difficulty: "easy",
    text: "Which is the largest continent by area?",
    options: ["Africa", "Asia", "North America", "Europe"],
    correctAnswer: 1,
    explanation: "Asia is the largest continent, covering about 44.58 million km²."
  },
  {
    id: "geo-1-003",
    unit: "Continents and Oceans",
    skill: "Identify continents",
    difficulty: "medium",
    text: "Which continent has the most countries?",
    options: ["Asia", "Africa", "Europe", "South America"],
    correctAnswer: 1,
    explanation: "Africa has 54 countries, more than any other continent."
  },
  {
    id: "geo-1-004",
    unit: "Continents and Oceans",
    skill: "Identify oceans",
    difficulty: "easy",
    text: "What is the largest ocean?",
    options: ["Atlantic", "Pacific", "Indian", "Arctic"],
    correctAnswer: 1,
    explanation: "The Pacific Ocean is the largest, covering about 165 million km²."
  },
  {
    id: "geo-1-005",
    unit: "Continents and Oceans",
    skill: "Identify oceans",
    difficulty: "medium",
    text: "Which ocean is between Africa and Australia?",
    options: ["Atlantic", "Pacific", "Indian", "Southern"],
    correctAnswer: 2,
    explanation: "The Indian Ocean lies between Africa and Australia."
  },

  // Countries and Capitals
  {
    id: "geo-2-001",
    unit: "Countries and Capitals",
    skill: "Identify capitals",
    difficulty: "easy",
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    explanation: "Paris is the capital and largest city of France."
  },
  {
    id: "geo-2-002",
    unit: "Countries and Capitals",
    skill: "Identify capitals",
    difficulty: "easy",
    text: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    correctAnswer: 2,
    explanation: "Tokyo is the capital of Japan and one of the world's largest cities."
  },
  {
    id: "geo-2-003",
    unit: "Countries and Capitals",
    skill: "Identify capitals",
    difficulty: "medium",
    text: "What is the capital of Canada?",
    options: ["Toronto", "Ottawa", "Montreal", "Vancouver"],
    correctAnswer: 1,
    explanation: "Ottawa is the capital of Canada, located in Ontario."
  },
  {
    id: "geo-2-004",
    unit: "Countries and Capitals",
    skill: "Identify capitals",
    difficulty: "hard",
    text: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: 2,
    explanation: "Canberra is the capital of Australia, though Sydney and Melbourne are larger cities."
  },
  {
    id: "geo-2-005",
    unit: "Countries and Capitals",
    skill: "Identify countries",
    difficulty: "medium",
    text: "Which country has the largest population?",
    options: ["India", "China", "United States", "Indonesia"],
    correctAnswer: 0,
    explanation: "As of 2023, India has surpassed China as the world's most populous country."
  },

  // Physical Geography
  {
    id: "geo-3-001",
    unit: "Physical Geography",
    skill: "Identify landforms",
    difficulty: "easy",
    text: "What is the longest river in the world?",
    options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
    correctAnswer: 1,
    explanation: "The Nile River is traditionally considered the longest at about 6,650 km."
  },
  {
    id: "geo-3-002",
    unit: "Physical Geography",
    skill: "Identify landforms",
    difficulty: "easy",
    text: "What is the highest mountain in the world?",
    options: ["K2", "Mount Everest", "Kilimanjaro", "Denali"],
    correctAnswer: 1,
    explanation: "Mount Everest is the highest mountain at 8,849 meters above sea level."
  },
  {
    id: "geo-3-003",
    unit: "Physical Geography",
    skill: "Identify landforms",
    difficulty: "medium",
    text: "Which mountain range separates Europe from Asia?",
    options: ["Alps", "Himalayas", "Andes", "Ural Mountains"],
    correctAnswer: 3,
    explanation: "The Ural Mountains form the traditional boundary between Europe and Asia."
  },
  {
    id: "geo-3-004",
    unit: "Physical Geography",
    skill: "Identify landforms",
    difficulty: "hard",
    text: "What is the largest desert in the world?",
    options: ["Gobi", "Sahara", "Antarctic", "Arabian"],
    correctAnswer: 2,
    explanation: "Antarctica is technically the largest desert (polar desert) at about 14 million km²."
  },
  {
    id: "geo-3-005",
    unit: "Physical Geography",
    skill: "Water bodies",
    difficulty: "medium",
    text: "What is the deepest point in the ocean?",
    options: ["Puerto Rico Trench", "Java Trench", "Mariana Trench", "Tonga Trench"],
    correctAnswer: 2,
    explanation: "The Mariana Trench reaches about 11,000 meters deep at Challenger Deep."
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unit = searchParams.get("unit");
  const count = parseInt(searchParams.get("count") || "10");
  const isFinal = searchParams.get("final") === "true";

  try {
    let questions: Question[];

    if (isFinal) {
      // Final test: mix of all units
      const questionsPerUnit = Math.ceil(count / geographyUnits.length);
      questions = geographyUnits.flatMap(unitName => {
        const unitQuestions = sampleQuestions.filter(q => q.unit === unitName);
        return unitQuestions.slice(0, questionsPerUnit);
      }).slice(0, count);
    } else if (unit && unit !== "all") {
      // Specific unit
      const unitQuestions = sampleQuestions.filter(q => q.unit === unit);
      questions = unitQuestions.slice(0, count);
    } else {
      // Random mix
      questions = sampleQuestions.slice(0, count);
    }

    // Shuffle questions
    questions = questions.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      questions,
      units: geographyUnits,
      total: sampleQuestions.length,
    });
  } catch (error) {
    console.error("Error fetching geography questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

