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
      case MIL_EXAMS.VERBAL_REASONING:
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        );
      case MIL_EXAMS.WORKING_MEMORY:
        return (
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case MIL_EXAMS.NUMERIC_VELOCITY:
        return (
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
          </div>
        );
      case MIL_EXAMS.VISUAL_ROTATION:
        return (
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
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
    if (exam.id === MIL_EXAMS.VERBAL_REASONING) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How it works:
            </h3>
            <p className="text-gray-700 mb-4">
              You will be presented with statements or logical reasoning
              questions. Read each statement carefully and select the most
              appropriate answer from the given options.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How to respond:
            </h3>
            <p className="text-gray-700 mb-4">
              Choose the option that best answers the question or completes the
              statement. Trust your first instinct and work quickly.
            </p>
          </div>

          {/* Example 1 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-medium text-green-900 mb-4 text-center">
              Example 1: Comparative Reasoning
            </h4>

            <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-4">
              <p className="text-gray-800 font-medium mb-4 text-center">
                "Tom is stronger than Mike. Jake is stronger than Tom. Who is
                the strongest?"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-xs sm:max-w-md mx-auto">
                <div className="bg-gray-100 p-2 sm:p-3 rounded text-center text-xs sm:text-sm">
                  Tom
                </div>
                <div className="bg-gray-100 p-2 sm:p-3 rounded text-center text-xs sm:text-sm">
                  Mike
                </div>
                <div className="bg-green-200 p-2 sm:p-3 rounded text-center text-xs sm:text-sm font-medium">
                  Jake
                </div>
              </div>
            </div>

            <div className="text-sm text-green-800">
              <p className="font-medium mb-2">Answer: Jake</p>
              <p>
                Jake is stronger than Tom, and Tom is stronger than Mike, so
                Jake is the strongest.
              </p>
            </div>
          </div>

          {/* Example 2 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-medium text-purple-900 mb-4 text-center">
              Example 2: Comparative Reasoning
            </h4>

            <div className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-4">
              <p className="text-gray-800 font-medium mb-4 text-center">
                "Emma is taller than Lisa. Sarah is shorter than Emma. Who is
                the shortest?"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-xs sm:max-w-md mx-auto">
                <div className="bg-gray-100 p-2 sm:p-3 rounded text-center text-xs sm:text-sm">
                  Emma
                </div>
                <div className="bg-gray-100 p-2 sm:p-3 rounded text-center text-xs sm:text-sm">
                  Lisa
                </div>
                <div className="bg-purple-200 p-2 sm:p-3 rounded text-center text-xs sm:text-sm font-medium">
                  Cannot be determined
                </div>
              </div>
            </div>

            <div className="text-sm text-purple-800">
              <p className="font-medium mb-2">Answer: Cannot be determined</p>
              <p>
                We don't know how Sarah compares to Lisa, so we can't determine
                who is shortest.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              ⏱️ Speed Challenge:
            </h3>
            <p className="text-red-800 font-medium">
              You have <strong>{exam.timeLimitMinutes} minutes</strong> for{" "}
              <strong>{exam.totalQuestions} questions</strong>
            </p>
            <p className="text-red-700 text-sm mt-2">
              That's only <strong>3 seconds per question</strong>! Work quickly
              and trust your first instinct.
            </p>
          </div>
        </div>
      );
    }

    if (exam.id === MIL_EXAMS.WORKING_MEMORY) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How it works:
            </h3>
            <p className="text-gray-700 mb-4">
              You will see a sequence of three letters. Your task is to identify
              which outer letter is alphabetically furthest from the middle
              letter.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How to respond:
            </h3>
            <p className="text-gray-700 mb-4">
              Look at the three letters, identify the middle one, then determine
              which of the two outer letters is alphabetically furthest away
              from it.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-medium text-purple-900 mb-4 text-center">
              Example: Letter Distance
            </h4>

            <div className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-4">
              <p className="text-gray-800 font-medium mb-4 text-center">
                Letter sequence: <strong>K - N - R</strong>
              </p>
              <p className="text-gray-700 text-sm text-center mb-4">
                Which outer letter is alphabetically furthest from the middle
                letter?
              </p>

              <div className="flex justify-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold font-mono">K</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Outer</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 border-2 border-purple-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold font-mono">N</span>
                  </div>
                  <div className="text-xs text-purple-600 mt-1">Middle</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold font-mono">R</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Outer</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                <div className="bg-gray-100 p-2 sm:p-3 rounded text-center text-xs sm:text-sm">
                  K
                </div>
                <div className="bg-purple-200 p-2 sm:p-3 rounded text-center text-xs sm:text-sm font-medium">
                  R
                </div>
              </div>
            </div>

            <div className="text-sm text-purple-800">
              <p className="font-medium mb-2">Answer: R</p>
              <p>
                K is 3 positions before N, R is 4 positions after N. R is
                further from N alphabetically.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              ⏱️ Speed Challenge:
            </h3>
            <p className="text-red-800 font-medium">
              You have <strong>{exam.timeLimitMinutes} minutes</strong> for{" "}
              <strong>{exam.totalQuestions} questions</strong>
            </p>
            <p className="text-red-700 text-sm mt-2">
              That's only <strong>3 seconds per question</strong>! Focus
              intensely and trust your memory.
            </p>
          </div>
        </div>
      );
    }

    if (exam.id === MIL_EXAMS.NUMERIC_VELOCITY) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How it works:
            </h3>
            <p className="text-gray-700 mb-4">
              You will see three numbers. Your task is to find the highest and
              lowest numbers, then determine which extreme is furthest from the
              middle number.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How to respond:
            </h3>
            <p className="text-gray-700 mb-4">
              Identify the lowest, middle, and highest numbers, then select
              which extreme (lowest or highest) is furthest from the middle.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h4 className="font-medium text-orange-900 mb-4 text-center">
              Example: Number Distance
            </h4>

            <div className="bg-white border-2 border-orange-300 rounded-lg p-4 mb-4">
              <p className="text-gray-800 font-medium mb-4 text-center">
                Numbers: <strong>6 - 11 - 17</strong>
              </p>
              <p className="text-gray-700 text-sm text-center mb-4">
                Which extreme is furthest from the middle number?
              </p>

              <div className="flex justify-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 border-2 border-red-300 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold font-mono">6</span>
                  </div>
                  <div className="text-xs text-red-600 mt-1">Lowest</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 border-2 border-orange-300 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold font-mono">11</span>
                  </div>
                  <div className="text-xs text-orange-600 mt-1">Middle</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 border-2 border-red-300 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold font-mono">17</span>
                  </div>
                  <div className="text-xs text-red-600 mt-1">Highest</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                <div className="bg-gray-100 p-2 sm:p-3 rounded text-center text-xs sm:text-sm">
                  6
                </div>
                <div className="bg-orange-200 p-2 sm:p-3 rounded text-center text-xs sm:text-sm font-medium">
                  17
                </div>
              </div>
            </div>

            <div className="text-sm text-orange-800">
              <p className="font-medium mb-2">Answer: 17</p>
              <p>
                6 is 5 away from 11, but 17 is 6 away from 11. So 17 is furthest
                from the middle.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              ⏱️ Speed Challenge:
            </h3>
            <p className="text-red-800 font-medium">
              You have <strong>{exam.timeLimitMinutes} minutes</strong> for{" "}
              <strong>{exam.totalQuestions} questions</strong>
            </p>
            <p className="text-red-700 text-sm mt-2">
              That's only <strong>3 seconds per question</strong>! Speed and
              accuracy are both crucial.
            </p>
          </div>
        </div>
      );
    }

    if (exam.id === MIL_EXAMS.VISUAL_ROTATION) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How it works:
            </h3>
            <p className="text-gray-700 mb-4">
              You will see 3D objects or 2D shapes that have been rotated. Your
              task is to identify which rotated version matches the original
              object from a different angle.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How to respond:
            </h3>
            <p className="text-gray-700 mb-4">
              Study the original shape carefully, then select which of the
              rotated options represents the same object viewed from a different
              angle.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h4 className="font-medium text-indigo-900 mb-4 text-center">
              Example: Shape Rotation
            </h4>

            <div className="bg-white border-2 border-indigo-300 rounded-lg p-4 mb-4">
              <p className="text-gray-800 font-medium mb-4 text-center">
                Original Shape: <strong>L</strong>
              </p>
              <p className="text-gray-700 text-sm text-center mb-4">
                Which option shows the same L-shape rotated?
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-sm mx-auto">
                <div className="bg-gray-100 p-2 sm:p-3 rounded text-center text-xs sm:text-sm">
                  ⅃
                </div>
                <div className="bg-indigo-200 p-2 sm:p-3 rounded text-center text-xs sm:text-sm font-medium">
                  Γ
                </div>
                <div className="bg-gray-100 p-2 sm:p-3 rounded text-center text-xs sm:text-sm">
                  ⅂
                </div>
                <div className="bg-gray-100 p-2 sm:p-3 rounded text-center text-xs sm:text-sm">
                  ⌐
                </div>
              </div>
            </div>

            <div className="text-sm text-indigo-800">
              <p className="font-medium mb-2">Answer: Γ (Option 2)</p>
              <p>The L-shape rotated 90° clockwise becomes a Γ shape.</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              ⏱️ Speed Challenge:
            </h3>
            <p className="text-red-800 font-medium">
              You have <strong>{exam.timeLimitMinutes} minutes</strong> for{" "}
              <strong>{exam.totalQuestions} questions</strong>
            </p>
            <p className="text-red-700 text-sm mt-2">
              That's only <strong>3 seconds per question</strong>! Visualize
              rotations quickly and trust your spatial reasoning.
            </p>
          </div>
        </div>
      );
    }

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
            <div className="bg-white border-2 border-blue-300 rounded-lg p-2 sm:p-3 md:p-4 mb-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              {/* Top Row */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    A
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    B
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    D
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    R
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-blue-300 mb-3 sm:mb-4"></div>

              {/* Bottom Row */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    a
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    c
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    d
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
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
            <div className="bg-white border-2 border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 mb-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              {/* Top Row */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    X
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    M
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    P
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    K
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-300 mb-3 sm:mb-4"></div>

              {/* Bottom Row */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    Y
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    m
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
                    Q
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 font-mono">
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {exam.name}
              </h1>
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
            >
              ← Back to Overview
            </button>

            <div className="text-center order-1 sm:order-2">
              <button
                onClick={() => setShowPractice(true)}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 sm:px-12 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
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
