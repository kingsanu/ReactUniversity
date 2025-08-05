"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useMILData } from "@/hooks/useMILData";
import { loadMILSession, MILSession } from "@/services/milService";

export default function MILResultsPage() {
  const { exams, progress, loading, getOverallScore } = useMILData();
  const [sessions, setSessions] = useState<MILSession[]>([]);

  useEffect(() => {
    if (exams.length > 0) {
      const loadedSessions = exams
        .map((exam) => loadMILSession(exam.id))
        .filter((session) => session !== null) as MILSession[];
      setSessions(loadedSessions);
    }
  }, [exams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const overallScore = getOverallScore();
  const completedCount = progress?.completedExams.length || 0;
  const totalCount = progress?.totalExams || 5;

  // Mock detailed scores - replace with actual calculation
  const subtestResults = [
    {
      name: "Pattern Recognition",
      score: 85,
      percentile: 78,
      time: "2:45",
      status: "completed",
    },
    {
      name: "Verbal Reasoning",
      score: 78,
      percentile: 65,
      time: "3:12",
      status: "completed",
    },
    {
      name: "Working Memory",
      score: 72,
      percentile: 58,
      time: "2:58",
      status: "completed",
    },
    {
      name: "Numeric Velocity",
      score: 68,
      percentile: 52,
      time: "2:33",
      status: "completed",
    },
    {
      name: "Visual Rotation",
      score: 75,
      percentile: 61,
      time: "3:05",
      status: "completed",
    },
  ].slice(0, completedCount);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LIA Assessment Results
          </h1>
          <p className="text-gray-600">
            Your Labor Intelligence Measurement assessment is{" "}
            {completedCount === totalCount ? "complete" : "in progress"}
          </p>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-8 mb-8"
        >
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  strokeDasharray={`${(overallScore / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {overallScore}%
                  </div>
                  <div className="text-sm text-gray-500">Overall</div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {overallScore >= 80
                ? "Excellent"
                : overallScore >= 60
                ? "Good"
                : "Developing"}
            </h2>
            <p className="text-gray-600 mb-4">
              You completed {completedCount} of {totalCount} subtests
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {subtestResults.reduce(
                    (acc, result) => acc + result.score,
                    0
                  ) / subtestResults.length || 0}
                </div>
                <div className="text-gray-500">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {subtestResults.reduce(
                    (acc, result) => acc + result.percentile,
                    0
                  ) / subtestResults.length || 0}
                </div>
                <div className="text-gray-500">Avg Percentile</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {sessions.reduce(
                    (acc, session) => acc + session.answers.length,
                    0
                  )}
                </div>
                <div className="text-gray-500">Total Questions</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subtest Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Subtest Performance
          </h3>
          <div className="space-y-4">
            {subtestResults.map((result, index) => (
              <div
                key={result.name}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{result.name}</h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">Time: {result.time}</span>
                      <span className="font-semibold text-purple-600">
                        {result.score}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ delay: index * 0.02, duration: 0.2 }}
                        className="bg-purple-600 h-2 rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-0">
                      {result.percentile}th percentile
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cognitive Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Cognitive Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <h4 className="font-medium text-gray-900 mb-1">
                Logical Reasoning
              </h4>
              <p className="text-sm text-gray-600">
                Strong pattern recognition and analytical thinking
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                Verbal Processing
              </h4>
              <p className="text-sm text-gray-600">
                Good language comprehension and reasoning
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                Processing Speed
              </h4>
              <p className="text-sm text-gray-600">
                Efficient cognitive processing under time pressure
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center space-x-4"
        >
          <a
            href="/dashboard"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Return to Dashboard
          </a>
          {completedCount < totalCount && (
            <a
              href="/dashboard/assessments/mil"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Continue Assessment
            </a>
          )}
          <button
            onClick={() => window.print()}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Print Results
          </button>
        </motion.div>
      </div>
    </div>
  );
}
