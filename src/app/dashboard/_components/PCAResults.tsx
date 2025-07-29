"use client";

import { motion } from "motion/react";
import { usePCAData } from "@/hooks/usePCAData";

interface PCAResultsProps {
  className?: string;
}

export function PCAResults({ className }: PCAResultsProps) {
  const { pcaData, loading, error, refreshPCAData, hasPCA, isCompleted } =
    usePCAData();

  const getTopCompetencies = () => {
    if (!pcaData?.competences) return [];

    // Mock competency data structure - adjust based on actual API response
    const mockCompetencies = [
      { name: "Leadership", score: 85, color: "#3B82F6" },
      { name: "Communication", score: 78, color: "#10B981" },
      { name: "Problem Solving", score: 72, color: "#8B5CF6" },
      { name: "Teamwork", score: 68, color: "#F59E0B" },
    ];

    return mockCompetencies.slice(0, 4);
  };

  const getOverallScore = () => {
    const competencies = getTopCompetencies();
    if (competencies.length === 0) return 0;
    return Math.round(
      competencies.reduce((sum, comp) => sum + comp.score, 0) /
        competencies.length
    );
  };

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

  if (error || !hasPCA || !isCompleted) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasPCA && !isCompleted
              ? "Complete Your PCA Assessment"
              : "Take PCA Assessment"}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {hasPCA && !isCompleted
              ? "Finish your Personal Competence Analysis to see results here"
              : "Take the Personal Competence Analysis to see your results here"}
          </p>
          <a
            href="/dashboard/assessments"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {hasPCA && !isCompleted
              ? "Continue Assessment"
              : "Start Assessment"}
          </a>
        </div>
      </div>
    );
  }

  const competencies = getTopCompetencies();
  const overallScore = getOverallScore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">PCA Results</h3>
          <p className="text-sm text-gray-600">Personal Competence Analysis</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {overallScore}%
          </div>
          <div className="text-xs text-gray-500">Overall Score</div>
        </div>
      </div>

      {/* Competencies */}
      <div className="space-y-4 mb-6">
        {competencies.map((competency, index) => (
          <div key={competency.name} className="flex items-center">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {competency.name}
                </span>
                <span className="text-sm text-gray-600">
                  {competency.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${competency.score}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="h-2 rounded-full"
                  style={{ backgroundColor: competency.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <a
          href="/dashboard/assessments"
          className="flex-1 text-center py-2 px-4 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
        >
          View Details
        </a>
        <button
          onClick={refreshPCAData}
          className="flex-1 py-2 px-4 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>PCA Code: {pcaData?.pcaCod.slice(0, 8)}...</span>
          <span>
            Updated:{" "}
            {pcaData?.lastUpdated
              ? new Date(pcaData.lastUpdated).toLocaleDateString()
              : "Today"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
