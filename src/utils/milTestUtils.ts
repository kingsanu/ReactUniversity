// MIL Test Utilities for Development

import {
  MILExam,
  MILQuestion,
  MILExamMetadata,
  MILSession,
} from "@/services/milService";

/**
 * Generate mock MIL exam data for testing
 */
export function generateMockMILExam(examId: string, type: number = 1): MILExam {
  const examTypes = {
    1: {
      name: "Pattern Recognition",
      description: "Identify matching letter pairs",
    },
    2: {
      name: "Verbal Reasoning",
      description: "Language comprehension tasks",
    },
    3: { name: "Working Memory", description: "Memory and processing tasks" },
    4: { name: "Numeric Velocity", description: "Speed arithmetic tasks" },
    5: { name: "Visual Rotation", description: "Spatial reasoning tasks" },
  };

  const examInfo = examTypes[type as keyof typeof examTypes] || examTypes[1];

  const questions: MILQuestion[] = [];

  // Generate questions based on type
  for (let i = 1; i <= 60; i++) {
    if (type === 1) {
      // Pattern Recognition - Letter pairs
      questions.push({
        questionNumber: i,
        questionText: `How many letter pairs match?`,
        type: 1,
        data: {
          letterPairs: [
            { topLetter: getRandomLetter(), bottomLetter: getRandomLetter() },
            { topLetter: getRandomLetter(), bottomLetter: getRandomLetter() },
            { topLetter: getRandomLetter(), bottomLetter: getRandomLetter() },
            { topLetter: getRandomLetter(), bottomLetter: getRandomLetter() },
          ],
        },
        explanation:
          "Count the number of letter pairs where the top and bottom letters are the same.",
      });
    } else if (type === 2) {
      // Verbal Reasoning
      questions.push({
        questionNumber: i,
        questionText: `Which word best completes the analogy?`,
        type: 2,
        data: {
          statements: [`Cat is to Kitten as Dog is to ___`],
          options: ["Puppy", "Bark", "Tail", "Bone", "Walk"],
        },
        explanation:
          "Find the relationship between the first pair and apply it to the second pair.",
      });
    } else {
      // Generic question for other types
      questions.push({
        questionNumber: i,
        questionText: `Question ${i} for ${examInfo.name}`,
        type: type,
        data: {
          options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
        },
        explanation: `This is a ${examInfo.name} question.`,
      });
    }
  }

  return {
    id: examId,
    name: examInfo.name,
    description: examInfo.description,
    type: type,
    timeLimitMinutes: 3,
    totalQuestions: questions.length,
    questions: questions,
  };
}

/**
 * Generate mock MIL exam metadata
 */
export function generateMockMILExamMetadata(): MILExamMetadata[] {
  return [
    {
      id: "pattern-recognition-001",
      name: "Pattern Recognition",
      description: "Identify matching letter pairs and patterns",
      type: 1,
      timeLimitMinutes: 3,
      totalQuestions: 60,
    },
    {
      id: "verbal-reasoning-001",
      name: "Verbal Reasoning",
      description: "Language comprehension and analogies",
      type: 2,
      timeLimitMinutes: 4,
      totalQuestions: 40,
    },
    {
      id: "working-memory-001",
      name: "Working Memory",
      description: "Memory and cognitive processing tasks",
      type: 3,
      timeLimitMinutes: 5,
      totalQuestions: 30,
    },
    {
      id: "numeric-velocity-001",
      name: "Numeric Velocity",
      description: "Speed arithmetic and number sequences",
      type: 4,
      timeLimitMinutes: 3,
      totalQuestions: 50,
    },
    {
      id: "visual-rotation-001",
      name: "Visual Rotation",
      description: "Spatial reasoning and mental rotation",
      type: 5,
      timeLimitMinutes: 4,
      totalQuestions: 35,
    },
  ];
}

/**
 * Create a mock MIL session for testing
 */
export function createMockMILSession(
  examId: string,
  completed: boolean = false
): MILSession {
  const session: MILSession = {
    examId,
    startTime: new Date().toISOString(),
    answers: [],
    currentQuestion: 0,
    isCompleted: completed,
  };

  if (completed) {
    // Add some mock answers
    for (let i = 1; i <= 10; i++) {
      session.answers.push({
        questionNumber: i,
        answer: Math.floor(Math.random() * 5),
        timeSpent: Math.floor(Math.random() * 30) + 10,
        timestamp: new Date().toISOString(),
      });
    }
    session.currentQuestion = 10;
  }

  return session;
}

/**
 * Get random letter for pattern recognition questions
 */
function getRandomLetter(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
}

/**
 * Clear all MIL test data
 */
export function clearAllMILTestData(): void {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("mil_")) {
      localStorage.removeItem(key);
    }
  });
  console.log("Cleared all MIL test data");
}

/**
 * Populate test data for MIL assessment
 */
export function populateMILTestData(): void {
  const exams = generateMockMILExamMetadata();

  // Create some completed sessions
  const completedExams = ["pattern-recognition-001", "verbal-reasoning-001"];
  localStorage.setItem("mil_completed_exams", JSON.stringify(completedExams));

  // Create mock sessions
  exams.forEach((exam) => {
    const isCompleted = completedExams.includes(exam.id);
    const session = createMockMILSession(exam.id, isCompleted);
    localStorage.setItem(`mil_session_${exam.id}`, JSON.stringify(session));
  });

  console.log("Populated MIL test data");
}

// Make functions available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).milTestUtils = {
    generateMockMILExam,
    generateMockMILExamMetadata,
    createMockMILSession,
    clearAllMILTestData,
    populateMILTestData,
  };
}
