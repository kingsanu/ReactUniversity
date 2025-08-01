"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  MILExamMetadata,
  getMILExamInstructions,
  MIL_EXAMS,
} from "@/services/milService";
import MILPracticeExamples from "./MILPracticeExamples";

interface MILInstructionsProps {
  exam: MILExamMetadata;
  onStart: () => void;
  onBack: () => void;
}

export default function MILInstructions({
  exam,
  onStart,
  onBack,
}: MILInstructionsProps) {
  const [showPractice, setShowPractice] = useState(false);
  const [instructions, setInstructions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstructions();
  }, [exam.id]);

  const loadInstructions = async () => {
    try {
      setLoading(true);
      const data = await getMILExamInstructions(exam.id as any);
      setInstructions(data);
    } catch (error) {
      console.error("Failed to load instructions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExamIcon = () => {
    switch (exam.id) {
      case MIL_EXAMS.PATTERN_RECOGNITION:
        return (
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        );
    }
  };

  const getInstructionContent = () => {
    if (exam.id === MIL_EXAMS.PATTERN_RECOGNITION) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How it works:
            </h3>
            <p className="text-gray-700 mb-4">
              Each box contains four pairs of letters. You have to identify how
              many of those pairs are the same (it doesn't matter if a letter is
              uppercase or lowercase).
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How to respond:
            </h3>
            <p className="text-gray-700 mb-4">
              Select the number that corresponds to the number of matching pairs
              in each block.
            </p>
          </div>

          {/* Visual Example */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-medium text-blue-900 mb-4 text-center">
              Example:
            </h4>

            {/* Example Letter Pairs Display */}
            <div className="bg-white border-2 border-blue-300 rounded-lg p-4 mb-4 max-w-sm mx-auto">
              {/* Top Row */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    A
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    B
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    D
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    R
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-blue-300 mb-4"></div>

              {/* Bottom Row */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    a
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    c
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    d
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    r
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span>
                  Pair 1: <strong>A</strong> and <strong>a</strong> → Same
                  letter (match)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span>
                  Pair 2: <strong>B</strong> and <strong>c</strong> → Different
                  letters (no match)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span>
                  Pair 3: <strong>D</strong> and <strong>d</strong> → Same
                  letter (match)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span>
                  Pair 4: <strong>R</strong> and <strong>r</strong> → Same
                  letter (match)
                </span>
              </div>
            </div>

            {/* Answer */}
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <div className="flex items-center justify-center">
                <span className="text-green-800 font-medium mr-3 text-sm">
                  Total matching pairs:
                </span>
                <div className="w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center font-bold text-lg">
                  3
                </div>
              </div>
              <p className="text-center text-green-700 text-xs mt-2">
                You would select <strong>3</strong> as your answer
              </p>
            </div>
          </div>

          {/* Second Example */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4 text-center">
              Another Example:
            </h4>

            {/* Example Letter Pairs Display */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-4 max-w-sm mx-auto">
              {/* Top Row */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    X
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    M
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    P
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    K
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-300 mb-4"></div>

              {/* Bottom Row */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    Y
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    m
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    Q
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    k
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Analysis */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>X ≠ Y</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>M = m</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>P ≠ Q</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>K = k</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-2 bg-orange-100 border border-orange-300 rounded-lg text-center">
              <span className="text-orange-800 font-medium text-sm">
                Answer:{" "}
              </span>
              <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-600 text-white rounded font-bold ml-2 text-sm">
                2
              </span>
              <span className="text-orange-700 text-xs ml-2">
                (2 matching pairs)
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-gray-700">{exam.description}</p>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Time Limit:</span>
              <span className="text-gray-600 ml-2">
                {exam.timeLimitMinutes} minutes
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Questions:</span>
              <span className="text-gray-600 ml-2">
                {exam.totalQuestions} items
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showPractice) {
    return (
      <MILPracticeExamples
        examId={exam.id as any}
        onComplete={onStart}
        onBack={() => setShowPractice(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.name}</h1>
              <p className="text-sm text-gray-600">Instructions & Examples</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">
                {exam.timeLimitMinutes} minutes
              </div>
              <div className="text-sm text-gray-500">
                {exam.totalQuestions} questions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            {/* Speed Challenge Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                ⏱️ Speed Challenge:
              </h3>
              <p className="text-red-800 font-medium">
                You have <strong>{exam.timeLimitMinutes} minutes</strong> for{" "}
                <strong>{exam.totalQuestions} questions</strong>
              </p>
              <p className="text-red-700 text-sm mt-2">
                That's only <strong>3 seconds per question</strong>! Work
                quickly and trust your first instinct.
              </p>
            </div>

            {/* Instructions Content */}
            <div className="mb-8">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading instructions...</p>
                </div>
              ) : (
                getInstructionContent()
              )}
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <h4 className="font-medium text-yellow-900 mb-2">Important:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• You cannot go back to previous questions</li>
                <li>• Each answer is automatically saved when you continue</li>
                <li>
                  • If you leave the tab or lose internet connection, the test
                  will restart
                </li>
                <li>
                  • Complete the practice examples before starting the actual
                  test
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fixed Footer with Continue Button */}
      <div className="bg-white border-t px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Overview
            </button>

            <div className="text-center">
              <button
                onClick={() => setShowPractice(true)}
                className="bg-blue-600 text-white px-12 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
              >
                Continue to Practice →
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Next: Practice examples to ensure you understand
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
