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
      case MIL_EXAMS.FEATURE_DETECTION:
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
      case MIL_EXAMS.NUMERICAL_SPEED_ACCURACY:
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
      case MIL_EXAMS.SPATIAL_ORIENTATION:
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
    if (exam.id === MIL_EXAMS.FEATURE_DETECTION) {
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🎯 Objective of This Subtest
            </h3>
            <p className="text-blue-800 mb-4">
              The Feature Detection subtest evaluates your ability to quickly and accurately identify relevant patterns and match information.
              This skill reflects how well you can detect important details in a work environment and adapt to new situations.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📝 How the Test Works
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
              <li>You will see four pairs of letters arranged vertically in each question.</li>
              <li>Your task is to check how many pairs match (e.g., uppercase vs. lowercase versions of the same letter).</li>
              <li>Carefully review each block and count how many pairs are identical.</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
              ✅ Example
            </h3>
            <p className="text-gray-700 mb-4">You will see something like this:</p>
            
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 font-mono text-center">
              <p>A   a</p>
              <p>B   c</p>
              <p>D   d</p>
              <p>R   r</p>
            </div>
            
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Pair 1: A and a match</li>
              <li>Pair 3: D and d match</li>
              <li>Pair 4: R and r match</li>
            </ul>
            
            <p className="mt-4 text-gray-700">
              In this example, three pairs match, so the correct answer is 3.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              🎯 What You Need to Do
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
              <li>For each question, select the correct number that indicates how many pairs match.</li>
              <li>You will have 3 minutes to complete the entire test.</li>
              <li>Work as fast and accurately as possible.</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              ⏱️ Speed Challenge:
            </h3>
            <p className="text-red-800 font-medium">
              You have <strong>{exam.timeLimitMinutes} minutes</strong> for{' '}
              <strong>{exam.totalQuestions} questions</strong>
            </p>
            <p className="text-red-700 text-sm mt-2">
              That's only{' '}
              <strong>
                {Math.round((exam.timeLimitMinutes * 60) / exam.totalQuestions)}{' '}
                seconds per question
              </strong>
              ! Speed and accuracy are both crucial.
            </p>
          </div>
        </div>
      );
    }

    if (exam.id === MIL_EXAMS.VERBAL_REASONING) {
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🎯 Objective of This Subtest
            </h3>
            <p className="text-blue-800 mb-4">
              The Verbal Reasoning subtest measures your ability to understand logical relationships between pieces of information and draw correct conclusions.
              This skill is essential for decision-making and problem-solving in complex situations.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📝 How the Test Works
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
              <li>You will read short statements that compare people or objects based on certain characteristics (e.g., who is taller, shorter, heavier, lighter, nicer, meaner, etc.).</li>
              <li>Your task is to identify the correct answer by logically interpreting the information provided.</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">
              ✅ Simple Example
            </h3>
            <p className="text-gray-700 mb-4">You will see something like this:</p>
            
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-gray-800 font-medium mb-4 text-center">
                "David is heavier than Carlos."
              </p>
              <p className="text-gray-700 text-center mb-4">Who is heavier?</p>
              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                <div className="bg-gray-100 p-2 rounded text-center">
                  David
                </div>
                <div className="bg-green-100 p-2 rounded text-center font-medium">
                  Carlos
                </div>
              </div>
            </div>
            
            <p className="text-gray-700">
              The correct answer is David, because the statement indicates that David is heavier.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">
              📌 Practice Examples
            </h3>
            <p className="text-gray-700 mb-4">
              Below are three practice examples. Please read each carefully and select the correct answer.
            </p>

            <div className="space-y-6">
              {/* Example 1 */}
              <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 mb-3">Example 1</h4>
                <p className="text-gray-800 font-medium mb-3">
                  "Anna is taller than Mary. Mary is taller than Olivia."
                </p>
                <p className="text-gray-700 mb-3">Who is the tallest?</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-md mx-auto">
                  <div className="bg-gray-100 p-2 rounded text-center">
                    Anna
                  </div>
                  <div className="bg-gray-100 p-2 rounded text-center">
                    Mary
                  </div>
                  <div className="bg-purple-100 p-2 rounded text-center font-medium">
                    Olivia
                  </div>
                </div>
              </div>

              {/* Example 2 */}
              <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 mb-3">Example 2</h4>
                <p className="text-gray-800 font-medium mb-3">
                  "Liam is faster than James. James is faster than Henry."
                </p>
                <p className="text-gray-700 mb-3">Who is the slowest?</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-md mx-auto">
                  <div className="bg-gray-100 p-2 rounded text-center">
                    Liam
                  </div>
                  <div className="bg-gray-100 p-2 rounded text-center">
                    James
                  </div>
                  <div className="bg-purple-100 p-2 rounded text-center font-medium">
                    Henry
                  </div>
                </div>
              </div>

              {/* Example 3 */}
              <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 mb-3">Example 3</h4>
                <p className="text-gray-800 font-medium mb-3">
                  "Leo is nicer than David. Owen is meaner than David."
                </p>
                <p className="text-gray-700 mb-3">Who is the meanest?</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-md mx-auto">
                  <div className="bg-gray-100 p-2 rounded text-center">
                    Leo
                  </div>
                  <div className="bg-gray-100 p-2 rounded text-center">
                    David
                  </div>
                  <div className="bg-purple-100 p-2 rounded text-center font-medium">
                    Owen
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              🚦 Before You Start
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-red-700">
              <li>Make sure you understand how to compare the statements and choose the correct answer.</li>
              <li>You will have 4 minutes to complete this test.</li>
              <li>If you have any doubts, ask before beginning.</li>
              <li>Once the test starts, the timer will run and you cannot return to previous questions.</li>
            </ul>
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

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                🎯 Spatial Orientation Test
              </h3>
              <p className="text-blue-800">
                This test measures your ability to mentally visualize and manipulate 3D objects in space.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📝 How the Test Works
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>You'll see 3D shapes from different angles</li>
                <li>Your task is to identify matching shapes</li>
                <li>Shapes may be rotated in 3D space</li>
                <li>Mirror images are considered different</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                ✅ Example
              </h3>
              
              <div className="bg-white border-2 border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-gray-700 mb-4">You'll see shapes like these:</p>
                
                <div className="grid grid-cols-2 gap-6 mb-4 justify-items-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-4xl">▲</span>
                    </div>
                    <p className="text-sm text-gray-600">Shape A</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-center mx-auto mb-2 transform rotate-90">
                      <span className="text-4xl">▲</span>
                    </div>
                    <p className="text-sm text-gray-600">Shape B</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700">
                  In this example, Shape A and Shape B are the same, just rotated 90 degrees. 
                  Your task is to identify matching shapes that can be rotated to look identical.
                </p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">
                🎯 What You Need to Do
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-purple-700">
                <li>Examine each 3D shape carefully</li>
                <li>Mentally rotate the shapes in your mind</li>
                <li>Determine if the shapes are identical when rotated</li>
                <li>Remember that mirror images are not the same</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">
                ⏱️ Test Instructions
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-red-700">
                <li>You'll have 4 minutes to complete the test</li>
                <li>There are 12 questions total</li>
                <li>Each question has only one correct answer</li>
                <li>Work as quickly and accurately as possible</li>
                <li>Once you move to the next question, you can't go back</li>
                <li>If unsure, make your best guess</li>
              </ul>
              <p className="mt-4 text-red-800 font-medium">
                DO NOT TURN THE PAGE UNTIL YOU ARE TOLD TO DO SO
              </p>
            </div>
          </div>
        </div>
      );
    }
    // Removed malformed JSX section
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
                That's only{" "}
                <strong>
                  {Math.round(
                    (exam.timeLimitMinutes * 60) / exam.totalQuestions
                  )}{" "}
                  seconds per question
                </strong>
                ! Work quickly and trust your first instinct.
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
