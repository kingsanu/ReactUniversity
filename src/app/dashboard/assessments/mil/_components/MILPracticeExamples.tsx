"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  MILExamId,
  MILQuestion,
  calculateMatchingPairs,
} from "@/services/milService";

interface MILPracticeExamplesProps {
  examId: MILExamId;
  onComplete: () => void;
  onBack: () => void;
}

export default function MILPracticeExamples({
  examId,
  onComplete,
  onBack,
}: MILPracticeExamplesProps) {
  const [practiceQuestions, setPracticeQuestions] = useState<MILQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPracticeQuestions();
  }, [examId]);

  const loadPracticeQuestions = async () => {
    try {
      setLoading(true);

      // Create custom practice questions instead of using API questions
      const customPracticeQuestions = createCustomPracticeQuestions(examId);
      setPracticeQuestions(customPracticeQuestions);
      setCompletedQuestions(
        new Array(customPracticeQuestions.length).fill(false)
      );
    } catch (error) {
      console.error("Failed to load practice questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCustomPracticeQuestions = (examId: MILExamId): MILQuestion[] => {
    console.log(
      "🏗️ [LIA PRACTICE] Creating custom questions for examId:",
      examId
    );

    const baseQuestions = [
      // Pattern Recognition Practice Questions (similar to instruction examples)
      {
        questionNumber: 1,
        questionText: "How many letter pairs match? (Case doesn't matter)",
        type: 1,
        data: {
          letterPairs: [
            { topLetter: "C", bottomLetter: "c" },
            { topLetter: "E", bottomLetter: "F" },
            { topLetter: "L", bottomLetter: "l" },
            { topLetter: "W", bottomLetter: "V" },
          ],
        },
        explanation: "C matches c, L matches l. E≠F and W≠V. So 2 pairs match.",
        correctAnswer: 2,
      },
      {
        questionNumber: 2,
        questionText: "Count the matching letter pairs:",
        type: 1,
        data: {
          letterPairs: [
            { topLetter: "T", bottomLetter: "t" },
            { topLetter: "N", bottomLetter: "n" },
            { topLetter: "H", bottomLetter: "G" },
            { topLetter: "S", bottomLetter: "s" },
          ],
        },
        explanation:
          "T matches t, N matches n, S matches s. Only H≠G. So 3 pairs match.",
        correctAnswer: 3,
      },
      // Verbal Reasoning Practice Questions (similar to instruction examples)
      {
        questionNumber: 3,
        questionText:
          "All flowers are beautiful. Roses are flowers. Therefore, roses are beautiful.",
        type: 2,
        data: {
          options: ["True", "False", "Cannot be determined"],
        },
        explanation:
          "The logic is valid: if all flowers are beautiful and roses are flowers, then roses must be beautiful.",
        correctAnswer: 0,
      },
      {
        questionNumber: 4,
        questionText: "Pen is to Writer as Brush is to ___",
        type: 2,
        data: {
          options: ["Paint", "Artist", "Canvas", "Color", "Studio"],
        },
        explanation:
          "A writer uses a pen as their main tool, just as an artist uses a brush as their main tool.",
        correctAnswer: 1,
      },
    ];

    // Return appropriate questions based on exam type
    console.log("🎯 [LIA PRACTICE] Filtering questions for exam type:", examId);

    if (examId.includes("pattern-recognition")) {
      console.log("📐 [LIA PRACTICE] Using Pattern Recognition questions");
      return baseQuestions.filter((q) => q.type === 1);
    } else if (examId.includes("verbal-reasoning")) {
      console.log("💬 [LIA PRACTICE] Using Verbal Reasoning questions");
      return baseQuestions.filter((q) => q.type === 2);
    } else if (examId.includes("working-memory")) {
      console.log("🧠 [LIA PRACTICE] Using Working Memory questions");
      return [
        {
          questionNumber: 1,
          questionText:
            "Which outer letter is alphabetically furthest from the middle letter?",
          type: 2,
          data: {
            letterSequence: {
              letters: ["K", "N", "R"],
              outerLetters: ["K", "R"],
              middleLetter: "N",
            },
          },
          explanation:
            "K is 3 positions before N, R is 4 positions after N. R is further from N alphabetically.",
          correctAnswer: "R",
        },
        {
          questionNumber: 2,
          questionText:
            "Which outer letter is alphabetically furthest from the middle letter?",
          type: 2,
          data: {
            letterSequence: {
              letters: ["D", "H", "L"],
              outerLetters: ["D", "L"],
              middleLetter: "H",
            },
          },
          explanation:
            "D is 4 positions before H, L is 4 positions after H. Both are equally distant, but D comes first alphabetically.",
          correctAnswer: "D",
        },
      ];
    } else if (examId.includes("numeric-velocity")) {
      console.log("🔢 [LIA PRACTICE] Using Numeric Velocity questions");
      return [
        {
          questionNumber: 1,
          questionText:
            "Find the highest and lowest numbers, then determine which extreme is furthest from the middle number.",
          type: 3,
          data: {
            numbers: [6, 11, 17],
          },
          explanation:
            "Lowest: 6, Highest: 17, Middle: 11. 6 is 5 away from 11, 17 is 6 away from 11. So 17 is furthest.",
          correctAnswer: 17,
        },
        {
          questionNumber: 2,
          questionText:
            "Find the highest and lowest numbers, then determine which extreme is furthest from the middle number.",
          type: 3,
          data: {
            numbers: [8, 15, 12],
          },
          explanation:
            "Lowest: 8, Highest: 15, Middle: 12. 8 is 4 away from 12, 15 is 3 away from 12. So 8 is furthest.",
          correctAnswer: 8,
        },
      ];
    } else if (examId.includes("visual-rotation")) {
      console.log("🔄 [LIA PRACTICE] Using Visual Rotation questions");
      return [
        {
          questionNumber: 1,
          questionText: "Which option shows the same L-shape rotated?",
          type: 5,
          data: {
            options: ["⅃", "Γ", "⅂", "⌐"],
          },
          explanation: "The L-shape rotated 90° clockwise becomes a Γ shape.",
          correctAnswer: 1,
        },
        {
          questionNumber: 2,
          questionText:
            "If you rotate this shape ⌐ 90° counterclockwise, what do you get?",
          type: 5,
          data: {
            options: ["L", "⅃", "Γ", "⅂"],
          },
          explanation: "Rotating ⌐ 90° counterclockwise gives you ⅂.",
          correctAnswer: 3,
        },
      ];
    }

    // Default: return first 2 questions for any other exam type
    console.log("🔧 [LIA PRACTICE] Using default questions (first 2)");
    const defaultQuestions = baseQuestions.slice(0, 2);
    console.log("🔧 [LIA PRACTICE] Default questions:", defaultQuestions);
    return defaultQuestions;
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const question = practiceQuestions[currentQuestion];
    console.log("🧪 [LIA PRACTICE] Validating answer:", {
      questionType: question.type,
      selectedAnswer,
      hasOptions: question.data.options ? true : false,
      hasLetterPairs: question.data.letterPairs ? true : false,
      hasCorrectAnswer: question.correctAnswer !== undefined,
      correctAnswer: question.correctAnswer,
    });

    // Use custom validation for practice questions
    const correct = validatePracticeAnswer(question, selectedAnswer);

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const updated = [...completedQuestions];
      updated[currentQuestion] = true;
      setCompletedQuestions(updated);
    }
  };

  const validatePracticeAnswer = (
    question: MILQuestion,
    answer: number
  ): boolean => {
    // Handle letter sequence questions (Working Memory)
    if (
      question.data.letterSequence &&
      question.data.letterSequence.outerLetters
    ) {
      const selectedLetter = question.data.letterSequence.outerLetters[answer];
      console.log("🔤 [LIA PRACTICE] Letter sequence validation:", {
        selectedLetter,
        correctAnswer: question.correctAnswer,
      });
      return selectedLetter === question.correctAnswer;
    }

    // Handle number sequence questions (Numeric Velocity)
    if (question.data.numbers && question.data.numbers.length === 3) {
      const numbers = question.data.numbers;
      const sortedNumbers = [...numbers].sort((a, b) => a - b);
      const extremes = [sortedNumbers[0], sortedNumbers[2]]; // [lowest, highest]
      const selectedNumber = extremes[answer];
      console.log("🔢 [LIA PRACTICE] Number sequence validation:", {
        selectedNumber,
        correctAnswer: question.correctAnswer,
      });
      return selectedNumber === question.correctAnswer;
    }

    // Handle options-based questions (Verbal Reasoning, etc.)
    if (question.data.options && question.data.options.length > 0) {
      console.log("🔤 [LIA PRACTICE] Options-based validation:", {
        answerIndex: answer,
        correctAnswer: question.correctAnswer,
      });
      return answer === question.correctAnswer;
    }

    // Handle numeric questions (Pattern Recognition)
    if (
      question.correctAnswer !== undefined &&
      typeof question.correctAnswer === "number"
    ) {
      console.log("🔢 [LIA PRACTICE] Numeric validation:", {
        answer,
        correctAnswer: question.correctAnswer,
      });
      return answer === question.correctAnswer;
    }

    // Fallback to pattern recognition calculation if it's a letter pairs question
    if (question.data.letterPairs) {
      console.log("🔤 [LIA PRACTICE] Calculating from letter pairs");
      const correctAnswer = calculateMatchingPairs(question.data.letterPairs);
      return answer === correctAnswer;
    }

    console.warn("⚠️ [LIA PRACTICE] No validation method available");
    return false;
  };

  const handleContinue = () => {
    if (isCorrect) {
      if (currentQuestion < practiceQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
    } else {
      // Reset for retry
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const allPracticeCompleted = completedQuestions.every(
    (completed) => completed
  );

  const renderLetterPairs = (question: MILQuestion) => {
    if (!question.data.letterPairs) return null;

    return (
      <div className="max-w-sm sm:max-w-md md:max-w-xl mx-auto mb-4 sm:mb-6">
        {/* Letter Pairs Container */}
        <div className="bg-white border-2 border-blue-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm">
          {/* Top Row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            {question.data.letterPairs.map((pair, index) => (
              <div key={`top-${index}`} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                  {pair.topLetter}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-blue-300 mb-3 sm:mb-4 md:mb-6"></div>

          {/* Bottom Row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {question.data.letterPairs.map((pair, index) => (
              <div key={`bottom-${index}`} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                  {pair.bottomLetter}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLetterSequence = (question: MILQuestion) => {
    if (!question.data.letterSequence) return null;

    const { letters } = question.data.letterSequence;

    return (
      <div className="max-w-lg mx-auto mb-6 sm:mb-8">
        <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
          {/* Letter Sequence Display */}
          <div className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8">
            {letters.map((letter, index) => (
              <div
                key={index}
                className={`text-center ${
                  index === 1 ? "transform scale-110" : ""
                }`}
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${
                    index === 1
                      ? "bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-300 shadow-lg"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300"
                  }`}
                >
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    {letter}
                  </span>
                </div>
                {index === 1 && (
                  <div className="text-xs sm:text-sm text-purple-600 font-medium mt-2">
                    Middle
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNumberSequence = (question: MILQuestion) => {
    if (!question.data.numbers || question.data.numbers.length !== 3)
      return null;

    const numbers = question.data.numbers;
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const lowest = sortedNumbers[0];
    const highest = sortedNumbers[2];
    const middle = sortedNumbers[1];

    return (
      <div className="max-w-lg mx-auto mb-6 sm:mb-8">
        <div className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 border-2 border-orange-200/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
          {/* Number Sequence Display */}
          <div className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8">
            {numbers.map((number, index) => {
              const isMiddle = number === middle;
              const isExtreme = number === lowest || number === highest;

              return (
                <div
                  key={index}
                  className={`text-center ${
                    isMiddle ? "transform scale-110" : ""
                  }`}
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center ${
                      isMiddle
                        ? "bg-gradient-to-br from-orange-100 to-yellow-100 border-2 border-orange-300 shadow-lg"
                        : isExtreme
                        ? "bg-gradient-to-br from-red-100 to-orange-100 border-2 border-red-300 shadow-md"
                        : "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300"
                    }`}
                  >
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 font-mono">
                      {number}
                    </span>
                  </div>
                  {isMiddle && (
                    <div className="text-xs sm:text-sm text-orange-600 font-medium mt-2">
                      Middle
                    </div>
                  )}
                  {number === lowest && (
                    <div className="text-xs sm:text-sm text-red-600 font-medium mt-2">
                      Lowest
                    </div>
                  )}
                  {number === highest && (
                    <div className="text-xs sm:text-sm text-red-600 font-medium mt-2">
                      Highest
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAnswerOptions = (question: MILQuestion) => {
    // Check if question has API-provided options (for Verbal Reasoning, etc.)
    if (question.data.options && question.data.options.length > 0) {
      console.log(
        "🔤 [LIA PRACTICE] Using API-provided options:",
        question.data.options
      );

      return question.data.options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleAnswerSelect(index)}
          disabled={showFeedback}
          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-100 min-w-[100px] sm:min-w-[120px] max-w-[180px] sm:max-w-[200px] text-center ${
            selectedAnswer === index
              ? "bg-blue-600 text-white shadow-lg transform scale-105"
              : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md"
          } ${showFeedback ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <span className="block leading-tight">{option}</span>
        </button>
      ));
    }

    // Check if question has letter sequence (for Working Memory)
    if (
      question.data.letterSequence &&
      question.data.letterSequence.outerLetters
    ) {
      console.log(
        "🔤 [LIA PRACTICE] Using letter sequence options:",
        question.data.letterSequence.outerLetters
      );

      return question.data.letterSequence.outerLetters.map((letter, index) => (
        <button
          key={index}
          onClick={() => handleAnswerSelect(index)}
          disabled={showFeedback}
          className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl font-bold text-xl sm:text-2xl md:text-3xl transition-all duration-100 ${
            selectedAnswer === index
              ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl transform scale-105 sm:scale-110 ring-2 sm:ring-4 ring-purple-200/50"
              : "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 shadow-lg hover:shadow-xl"
          } font-mono ${showFeedback ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {letter}
        </button>
      ));
    }

    // Check if question has numbers (for Numeric Velocity)
    if (question.data.numbers && question.data.numbers.length === 3) {
      const numbers = question.data.numbers;
      const sortedNumbers = [...numbers].sort((a, b) => a - b);
      const lowest = sortedNumbers[0];
      const highest = sortedNumbers[2];
      const extremes = [lowest, highest];

      console.log(
        "🔢 [LIA PRACTICE] Using numeric velocity options:",
        extremes
      );

      return extremes.map((number, index) => (
        <button
          key={index}
          onClick={() => handleAnswerSelect(index)}
          disabled={showFeedback}
          className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl font-bold text-xl sm:text-2xl md:text-3xl transition-all duration-100 ${
            selectedAnswer === index
              ? "bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-2xl transform scale-105 sm:scale-110 ring-2 sm:ring-4 ring-orange-200/50"
              : "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50 shadow-lg hover:shadow-xl"
          } font-mono ${showFeedback ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {number}
        </button>
      ));
    }

    // Default numeric options (for Pattern Recognition, etc.)
    console.log("🔢 [LIA PRACTICE] Using default numeric options (0-4)");

    return [0, 1, 2, 3, 4].map((option) => (
      <button
        key={option}
        onClick={() => handleAnswerSelect(option)}
        disabled={showFeedback}
        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg font-bold text-base sm:text-lg md:text-xl transition-all ${
          selectedAnswer === option
            ? "bg-blue-600 text-white shadow-lg transform scale-105"
            : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md"
        } ${showFeedback ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {option}
      </button>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice examples...</p>
        </div>
      </div>
    );
  }

  if (practiceQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No practice questions available</p>
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQ = practiceQuestions[currentQuestion];

  // Debug log to see the current question structure
  console.log("🔍 [LIA PRACTICE] Current question:", {
    questionNumber: currentQ?.questionNumber,
    questionText: currentQ?.questionText,
    type: currentQ?.type,
    hasOptions: currentQ?.data?.options ? true : false,
    options: currentQ?.data?.options,
    hasLetterPairs: currentQ?.data?.letterPairs ? true : false,
    correctAnswer: currentQ?.correctAnswer,
    explanation: currentQ?.explanation,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Practice Examples
            </h1>
            <p className="text-gray-600 mb-4">
              Answer these examples correctly to proceed to the actual test.
            </p>

            {/* Progress */}
            <div className="flex justify-center space-x-2 mb-4">
              {practiceQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    completedQuestions[index]
                      ? "bg-green-500"
                      : index === currentQuestion
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="text-sm text-gray-500">
              Example {currentQuestion + 1} of {practiceQuestions.length}
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 text-center mb-6">
              {currentQ.questionText}
            </h2>

            {renderLetterPairs(currentQ)}
            {renderLetterSequence(currentQ)}
            {renderNumberSequence(currentQ)}

            {/* Answer Options */}
            <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 max-w-4xl mx-auto px-2">
              {renderAnswerOptions(currentQ)}
            </div>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 ${
                isCorrect
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center mb-2">
                {isCorrect ? (
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-red-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span
                  className={`font-medium ${
                    isCorrect ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isCorrect
                    ? "Perfect! You can now start the test"
                    : "Review the instructions and try again"}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isCorrect ? "text-green-700" : "text-red-700"
                }`}
              >
                {currentQ.explanation}
              </p>
              {!isCorrect && (
                <p
                  className={`text-sm mt-2 ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  Correct answer:{" "}
                  {(() => {
                    // For letter pairs questions
                    if (currentQ.data.letterPairs) {
                      return `${calculateMatchingPairs(
                        currentQ.data.letterPairs
                      )} matching pairs`;
                    }

                    // For questions with options
                    if (
                      currentQ.data.options &&
                      currentQ.correctAnswer !== undefined &&
                      typeof currentQ.correctAnswer === 'number' &&
                      currentQ.data.options[currentQ.correctAnswer]
                    ) {
                      return `"${
                        currentQ.data.options[currentQ.correctAnswer]
                      }"`;
                    }

                    // For numeric answers
                    if (currentQ.correctAnswer !== undefined) {
                      return currentQ.correctAnswer.toString();
                    }

                    return "Not available";
                  })()}
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
            <button
              onClick={onBack}
              className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              ← Back to Instructions
            </button>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {!showFeedback ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Submit Answer
                </button>
              ) : (
                <>
                  {!isCorrect ? (
                    <button
                      onClick={handleContinue}
                      className="bg-orange-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
                    >
                      Try Again
                    </button>
                  ) : allPracticeCompleted ? (
                    <button
                      onClick={onComplete}
                      className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      onClick={handleContinue}
                      className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      Next Example
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
