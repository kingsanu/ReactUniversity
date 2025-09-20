"use client";

import { motion } from "motion/react";
import { usePCAData } from "@/hooks/usePCAData";
import { useTranslation } from "react-i18next";

interface PCAResultsProps {
  className?: string;
}

export function PCAResults({ className }: PCAResultsProps) {
  const { pcaData, loading, error, refreshPCAData, hasPCA, isCompleted } =
    usePCAData();
  const { t } = useTranslation();

  const getTopCompetencies = () => {
    if (!pcaData?.results?.data) {
      return [];
    }

    const data = pcaData.results.data;

    // Map the PCA scores to competencies based on the API response structure
    const competencies = [
      { name: "Dominance", score: data.pcaD1 || 0, color: "#3B82F6" },
      { name: "Influence", score: data.pcaI1 || 0, color: "#10B981" },
      { name: "Steadiness", score: data.pcaS1 || 0, color: "#8B5CF6" },
      { name: "Conscientiousness", score: data.pcaC1 || 0, color: "#F59E0B" },
    ];

    // Sort by score descending and return top 4
    return competencies.sort((a, b) => b.score - a.score).slice(0, 4);
  };

  const getOverallScore = () => {
    if (!pcaData?.results?.data) return 0;

    const data = pcaData.results.data;

    // Calculate average of the four main DISC dimensions
    const scores = [
      data.pcaD1 || 0,
      data.pcaI1 || 0,
      data.pcaS1 || 0,
      data.pcaC1 || 0,
    ];

    const validScores = scores.filter((score) => score > 0);
    if (validScores.length === 0) return 0;

    return Math.round(
      validScores.reduce((sum, score) => sum + score, 0) / validScores.length
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("dashboard.pcaErrorTitle")}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshPCAData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if (!hasPCA) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 mb-2">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("dashboard.noPCATitle")}
          </h3>
          <p className="text-gray-600 mb-4">
            {pcaData?.status === "not_found"
              ? t("dashboard.noPCACreated")
              : t("dashboard.noPCACompleted")}
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {t("dashboard.startAssessment")}
          </button>
        </div>
      </div>
    );
  }

  // Show in-progress status
  if (hasPCA && !isCompleted) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center">
          <div className="text-yellow-500 mb-2">⏳</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("dashboard.pcaInProgress")}
          </h3>
          <p className="text-gray-600 mb-4">
            {pcaData?.status === "in_progress"
              ? t("dashboard.pcaProcessing")
              : t("dashboard.pcaStarted")}
          </p>
          {pcaData?.pcaCod && (
            <p className="text-sm text-gray-500 mb-4">
              {t("dashboard.assessmentCode")}:{" "}
              <span className="font-mono">{pcaData.pcaCod}</span>
            </p>
          )}
          <div className="flex gap-2 justify-center">
            <button
              onClick={refreshPCAData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t("dashboard.checkStatus")}
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              {t("dashboard.continueAssessment")}
            </button>
          </div>
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
          <h3 className="text-lg font-semibold text-gray-900">
            {t("dashboard.pcaAssessment")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("dashboard.personalCompetenceAnalysis")}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {overallScore}%
          </div>
          <div className="text-xs text-gray-500">
            {t("dashboard.overallScore")}
          </div>
        </div>
      </div>

      {/* Competencies */}
      <div className="space-y-4 mb-6">
        {competencies.map((competency, index) => (
          <div
            key={`${competency.name}-${index}`}
            className="flex items-center"
          >
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
          href="/dashboard/assessments/pca"
          className="flex-1 text-center py-2 px-4 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
        >
          {t("common.view")}
        </a>
        <button
          onClick={refreshPCAData}
          className="flex-1 py-2 px-4 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          {t("common.refresh")}
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>
              {t("dashboard.pcaCode")}: {pcaData?.pcaCod || "N/A"}
            </span>
            {pcaData?.status && (
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  pcaData.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : pcaData.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {pcaData.status.replace("_", " ").toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {t("dashboard.lastUpdated")}:{" "}
              {pcaData?.lastUpdated
                ? new Date(pcaData.lastUpdated).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
