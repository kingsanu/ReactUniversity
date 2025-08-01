"use client";

import { motion } from "motion/react";
import { useMILData } from "@/hooks/useMILData";

interface MILResultsProps {
  className?: string;
}

export function MILResults({ className }: MILResultsProps) {
  const { progress, loading, error, hasMIL, isCompleted, getOverallScore } =
    useMILData();

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hasMIL) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-purple-600"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Take MIL Assessment
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Measure your cognitive abilities through various intelligence tasks
          </p>
          <a
            href="/dashboard/assessments/mil"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Assessment
          </a>
        </div>
      </div>
    );
  }

  const overallScore = getOverallScore();
  const completionPercentage = progress
    ? (progress.completedExams.length / progress.totalExams) * 100
    : 0;

  // Mock subtest scores - replace with actual data when available
  const subtestScores = [
    { name: "Pattern Recognition", score: 85, color: "#8B5CF6" },
    { name: "Verbal Reasoning", score: 78, color: "#06B6D4" },
    { name: "Working Memory", score: 72, color: "#10B981" },
    { name: "Numeric Velocity", score: 68, color: "#F59E0B" },
    { name: "Visual Rotation", score: 75, color: "#EF4444" },
  ].slice(0, progress?.completedExams.length || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">MIL Results</h3>
          <p className="text-sm text-gray-600">
            Labor Intelligence Measurement
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">
            {overallScore}%
          </div>
          <div className="text-xs text-gray-500">
            {isCompleted ? "Complete" : "In Progress"}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {progress?.completedExams.length}/{progress?.totalExams} subtests
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8 }}
            className="bg-purple-600 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Subtest Scores */}
      {subtestScores.length > 0 && (
        <div className="space-y-3 mb-6">
          {subtestScores.map((subtest, index) => (
            <div key={subtest.name} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {subtest.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {subtest.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subtest.score}%` }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: subtest.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <a
          href="/dashboard/assessments/mil"
          className="flex-1 text-center py-2 px-4 bg-purple-50 text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors"
        >
          {isCompleted ? "View Results" : "Continue"}
        </a>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 py-2 px-4 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {isCompleted
              ? "Assessment Complete"
              : `${progress?.completedExams.length || 0} of ${
                  progress?.totalExams || 5
                } completed`}
          </span>
          <span>
            Updated:{" "}
            {progress?.lastUpdated
              ? new Date(progress.lastUpdated).toLocaleDateString()
              : "Today"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
