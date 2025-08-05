// MIL Assessment Service

export interface MILQuestion {
  questionNumber: number;
  questionText: string;
  type: number;
  data: {
    letterPairs?: Array<{
      topLetter: string;
      bottomLetter: string;
    }>;
    statements?: string[] | null;
    options?: string[] | null;
    letters?: string[] | null;
    middleLetterIndex?: number | null;
    numbers?: number[] | null;
    figurePairs?: any[] | null;
  };
  explanation: string;
  correctAnswer?: number; // Index of the correct answer
}

export interface MILExam {
  id: string;
  name: string;
  description: string;
  type: number;
  timeLimitMinutes: number;
  totalQuestions: number;
  questions: MILQuestion[];
}

export interface MILExamMetadata {
  id: string;
  name: string;
  description: string;
  type: number;
  timeLimitMinutes: number;
  totalQuestions: number;
}

export interface MILAnswer {
  questionNumber: number;
  answer: number | string;
  timeSpent: number;
  timestamp: string;
}

export interface MILSession {
  examId: string;
  startTime: string;
  answers: MILAnswer[];
  currentQuestion: number;
  isCompleted: boolean;
}

// Available MIL Exams
export const MIL_EXAMS = {
  PATTERN_RECOGNITION: "pattern-recognition-001",
  VERBAL_REASONING: "verbal-reasoning-001",
  WORKING_MEMORY: "working-memory-001",
  NUMERIC_VELOCITY: "numeric-velocity-001",
  VISUAL_ROTATION: "visual-rotation-001",
} as const;

export type MILExamId = (typeof MIL_EXAMS)[keyof typeof MIL_EXAMS];

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all available MIL exams
 */
export async function getAllMILExams(): Promise<MILExamMetadata[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/PCAExam/exams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch MIL exams: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get MIL Exams Error:", error);

    throw error;
  }
}

/**
 * Get specific MIL exam by ID
 */
export async function getMILExamById(examId: MILExamId): Promise<MILExam> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/PCAExam/exams/${examId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch MIL exam: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get MIL Exam Error:", error);
    throw error;
  }
}

/**
 * Start MIL exam session
 */
export async function startMILExam(examId: MILExamId): Promise<MILExam> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/PCAExam/exams/${examId}/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to start MIL exam: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Start MIL Exam Error:", error);

    throw error;
  }
}

/**
 * Get exam instructions
 */
export async function getMILExamInstructions(examId: MILExamId): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/PCAExam/exams/${examId}/instructions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch exam instructions: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get MIL Instructions Error:", error);
    throw error;
  }
}

/**
 * Submit MIL exam for scoring
 */
export async function submitMILExam(
  session: MILSession,
  userId: string
): Promise<any> {
  try {
    console.log("🚀 [LIA SUBMIT] Starting LIA exam submission...");
    console.log("📋 [LIA SUBMIT] Session data:", {
      examId: session.examId,
      userId: userId,
      startTime: session.startTime,
      answersCount: session.answers.length,
      isCompleted: session.isCompleted,
    });

    const examAnswers = session.answers.map((answer) => ({
      questionNumber: answer.questionNumber,
      selectedAnswer: answer.answer.toString(),
      isAnswered: true,
      timeSpent: formatTimeSpent(answer.timeSpent),
    }));

    const submissionData = {
      examId: session.examId,
      userId: userId,
      startTime: session.startTime,
      endTime: new Date().toISOString(),
      isTimeExpired: false,
      answers: examAnswers,
    };

    console.log(
      "📤 [LIA SUBMIT] API Endpoint:",
      `${API_BASE_URL}/api/PCAExam/submit`
    );
    console.log(
      "📤 [LIA SUBMIT] Payload being sent:",
      JSON.stringify(submissionData, null, 2)
    );
    console.log("📊 [LIA SUBMIT] Payload summary:", {
      examId: submissionData.examId,
      userId: submissionData.userId,
      totalAnswers: submissionData.answers.length,
      timeSpent: `${submissionData.startTime} → ${submissionData.endTime}`,
      sampleAnswers: submissionData.answers.slice(0, 3), // First 3 answers for preview
    });

    const startTime = Date.now();
    const response = await fetch(`${API_BASE_URL}/api/PCAExam/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    const responseTime = Date.now() - startTime;
    console.log(`⏱️ [LIA SUBMIT] API Response time: ${responseTime}ms`);
    console.log(
      "📥 [LIA SUBMIT] Response status:",
      response.status,
      response.statusText
    );
    console.log(
      "📥 [LIA SUBMIT] Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [LIA SUBMIT] API Error Response:", errorText);
      throw new Error(
        `Failed to submit LIA exam: ${response.status} - ${errorText}`
      );
    }

    const responseData = await response.json();
    console.log(
      "✅ [LIA SUBMIT] Success! Response data:",
      JSON.stringify(responseData, null, 2)
    );
    console.log("📊 [LIA SUBMIT] Response summary:", {
      success: true,
      responseTime: `${responseTime}ms`,
      dataKeys: Object.keys(responseData),
      hasScore: "score" in responseData,
      hasResults: "results" in responseData,
    });

    return responseData;
  } catch (error) {
    console.error("❌ [LIA SUBMIT] Submit LIA Exam Error:", error);
    console.error("❌ [LIA SUBMIT] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      examId: session.examId,
      userId: userId,
    });
    throw error;
  }
}

/**
 * Complete MIL exam (for time-expired scenarios)
 */
export async function completeMILExam(
  session: MILSession,
  userId: string
): Promise<any> {
  try {
    const examAnswers = session.answers.map((answer) => ({
      questionNumber: answer.questionNumber,
      selectedAnswer: answer.answer.toString(),
      isAnswered: true,
      timeSpent: formatTimeSpent(answer.timeSpent),
    }));

    const completionData = {
      examId: session.examId,
      userId: userId,
      startTime: session.startTime,
      endTime: new Date().toISOString(),
      isTimeExpired: true,
      isCompleted: false,
      answers: examAnswers,
    };

    const response = await fetch(`${API_BASE_URL}/api/PCAExam/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completionData),
    });

    if (!response.ok) {
      throw new Error(`Failed to complete MIL exam: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Complete MIL Exam Error:", error);
    throw error;
  }
}

/**
 * Format time spent in HH:MM:SS format for API
 */
function formatTimeSpent(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Save MIL session to localStorage
 */
export function saveMILSession(session: MILSession): void {
  try {
    localStorage.setItem(
      `mil_session_${session.examId}`,
      JSON.stringify(session)
    );
  } catch (error) {
    console.error("Save MIL Session Error:", error);
  }
}

/**
 * Load MIL session from localStorage
 */
export function loadMILSession(examId: string): MILSession | null {
  try {
    const sessionData = localStorage.getItem(`mil_session_${examId}`);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error("Load MIL Session Error:", error);
    return null;
  }
}

/**
 * Clear MIL session from localStorage
 */
export function clearMILSession(examId: string): void {
  try {
    localStorage.removeItem(`mil_session_${examId}`);
  } catch (error) {
    console.error("Clear MIL Session Error:", error);
  }
}

/**
 * Calculate matching letter pairs for pattern recognition
 */
export function calculateMatchingPairs(
  letterPairs: Array<{ topLetter: string; bottomLetter: string }>
): number {
  return letterPairs.filter(
    (pair) => pair.topLetter.toLowerCase() === pair.bottomLetter.toLowerCase()
  ).length;
}

/**
 * Validate answer for pattern recognition questions
 */
export function validatePatternRecognitionAnswer(
  question: MILQuestion,
  answer: number
): boolean {
  if (!question.data.letterPairs) return false;
  const correctAnswer = calculateMatchingPairs(question.data.letterPairs);
  return answer === correctAnswer;
}

/**
 * Generic answer validation for all question types
 */
export function validateAnswer(question: MILQuestion, answer: number): boolean {
  // If API provides correctAnswer, use it
  if (question.correctAnswer !== undefined) {
    console.log(
      "🎯 [LIA VALIDATION] Using API-provided correct answer:",
      question.correctAnswer
    );
    return answer === question.correctAnswer;
  }

  // For Pattern Recognition, calculate from letter pairs
  if (question.data.letterPairs) {
    console.log("🔤 [LIA VALIDATION] Calculating Pattern Recognition answer");
    return validatePatternRecognitionAnswer(question, answer);
  }

  // For other types without correctAnswer, we can't validate in practice
  console.warn(
    "⚠️ [LIA VALIDATION] No validation method available for this question type"
  );
  return true; // Allow to proceed
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Check if user has tab focus (for preventing cheating)
 */
export function setupTabFocusMonitoring(
  onTabLeave: () => void,
  onTabReturn: () => void
): () => void {
  let isCurrentlyActive = !document.hidden && document.hasFocus();
  let debounceTimeout: NodeJS.Timeout | null = null;
  let lastEventTime = 0;

  const checkAndUpdateState = (eventType: string) => {
    const now = Date.now();

    // Clear any pending debounce
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Debounce to prevent rapid fire events from multiple sources
    debounceTimeout = setTimeout(() => {
      // Only process if enough time has passed since last event
      if (now - lastEventTime < 50) {
        return;
      }

      lastEventTime = now;

      // Determine current state using multiple checks
      const isDocumentVisible = !document.hidden;
      const isWindowFocused = document.hasFocus();
      const isNowActive = isDocumentVisible && isWindowFocused;

      console.log(`Tab state check (${eventType}):`, {
        isDocumentVisible,
        isWindowFocused,
        isNowActive,
        wasActive: isCurrentlyActive,
      });

      if (isCurrentlyActive && !isNowActive) {
        // Tab became inactive
        console.log(`Tab became inactive via ${eventType}`);
        isCurrentlyActive = false;
        onTabLeave();
      } else if (!isCurrentlyActive && isNowActive) {
        // Tab became active
        console.log(`Tab became active via ${eventType}`);
        isCurrentlyActive = true;
        onTabReturn();
      }
    }, 150); // Increased debounce time
  };

  const handleVisibilityChange = () => {
    checkAndUpdateState("visibility");
  };

  const handleBlur = () => {
    checkAndUpdateState("blur");
  };

  const handleFocus = () => {
    checkAndUpdateState("focus");
  };

  // Add event listeners
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("blur", handleBlur);
  window.addEventListener("focus", handleFocus);

  // Return cleanup function
  return () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("blur", handleBlur);
    window.removeEventListener("focus", handleFocus);
  };
}
