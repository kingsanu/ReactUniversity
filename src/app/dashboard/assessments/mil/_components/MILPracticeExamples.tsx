"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  MILExamId,
  getMILExamById,
  MILQuestion,
  calculateMatchingPairs,
  validatePatternRecognitionAnswer,
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
      const examData = await getMILExamById(examId);
      // Use first 3-4 questions as practice examples
      const practice = examData.questions.slice(0, 4);
      setPracticeQuestions(practice);
      setCompletedQuestions(new Array(practice.length).fill(false));
    } catch (error) {
      console.error("Failed to load practice questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const question = practiceQuestions[currentQuestion];
    const correct = validatePatternRecognitionAnswer(question, selectedAnswer);

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const updated = [...completedQuestions];
      updated[currentQuestion] = true;
      setCompletedQuestions(updated);
    }
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
      <div className="max-w-xl mx-auto mb-6">
        {/* Letter Pairs Container */}
        <div className="bg-white border-2 border-blue-300 rounded-2xl p-6 shadow-sm">
          {/* Top Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {question.data.letterPairs.map((pair, index) => (
              <div key={`top-${index}`} className="text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {pair.topLetter}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-4 gap-6">
            {question.data.letterPairs.map((pair, index) => (
              <div key={`bottom-${index}`} className="text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {pair.bottomLetter}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Answer Options */}
            <div className="flex justify-center space-x-4 mb-6">
              {[0, 1, 2, 3, 4].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={`w-14 h-14 rounded-lg font-bold text-xl transition-all ${
                    selectedAnswer === option
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md"
                  } ${showFeedback ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {option}
                </button>
              ))}
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
              {!isCorrect && currentQ.data.letterPairs && (
                <p
                  className={`text-sm mt-2 ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  Correct answer:{" "}
                  {calculateMatchingPairs(currentQ.data.letterPairs)} matching
                  pairs
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Instructions
            </button>

            <div className="space-x-4">
              {!showFeedback ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <>
                  {!isCorrect ? (
                    <button
                      onClick={handleContinue}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Try Again
                    </button>
                  ) : allPracticeCompleted ? (
                    <button
                      onClick={onComplete}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      onClick={handleContinue}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
