"use client";

import { motion } from "motion/react";
import { usePCAData } from "@/hooks/usePCAData";
import { useTranslation } from "react-i18next";
import { Brain, RefreshCw, ChevronRight, AlertCircle, BarChart3, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
      { name: "Dominance", score: data.pcaD1 || 0, color: "bg-red-500", bg: "bg-red-50" },
      { name: "Influence", score: data.pcaI1 || 0, color: "bg-yellow-500", bg: "bg-yellow-50" },
      { name: "Steadiness", score: data.pcaS1 || 0, color: "bg-green-500", bg: "bg-green-50" },
      { name: "Conscientiousness", score: data.pcaC1 || 0, color: "bg-blue-500", bg: "bg-blue-50" },
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
      <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full", className)}>
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-10 w-10 bg-gray-100 rounded-xl"></div>
            <div className="h-8 w-16 bg-gray-100 rounded-lg"></div>
          </div>
          <div className="h-6 bg-gray-100 rounded w-1/3"></div>
          <div className="space-y-3 pt-4">
            <div className="h-2 bg-gray-100 rounded-full"></div>
            <div className="h-2 bg-gray-100 rounded-full w-5/6"></div>
            <div className="h-2 bg-gray-100 rounded-full w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col items-center justify-center text-center", className)}>
        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {t("dashboard.pcaErrorTitle")}
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-[200px]">{error}</p>
        <button
          onClick={refreshPCAData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          {t("common.tryAgain")}
        </button>
      </div>
    );
  }

  if (!hasPCA) {
    return (
      <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col", className)}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {t("dashboard.pcaAssessment")}
            </h3>
            <p className="text-sm text-gray-500">
              Discover your professional DNA
            </p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
          <BarChart3 className="w-12 h-12 text-gray-200 mb-3" />
          <p className="text-gray-600 text-sm mb-6 max-w-[240px]">
            {pcaData?.status === "not_found"
              ? t("dashboard.noPCACreated")
              : t("dashboard.noPCACompleted")}
          </p>
        </div>

        <a 
          href="/dashboard/assessments/pca"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/20"
        >
          <span>{t("dashboard.startAssessment")}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  // Show in-progress status
  if (hasPCA && !isCompleted) {
    return (
      <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col", className)}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("dashboard.pcaInProgress")}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                In Progress
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-4">
            {pcaData?.status === "in_progress"
              ? t("dashboard.pcaProcessing")
              : t("dashboard.pcaStarted")}
          </p>
          
          {pcaData?.pcaCod && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t("dashboard.assessmentCode")}</span>
              <span className="font-mono text-sm font-bold text-gray-900">{pcaData.pcaCod}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button
            onClick={refreshPCAData}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            {t("dashboard.checkStatus")}
          </button>
          <a 
            href="/dashboard/assessments/pca"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors text-sm font-medium shadow-lg shadow-amber-600/20"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
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
      className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {t("dashboard.pcaAssessment")}
            </h3>
            <p className="text-sm text-gray-500">
              Analysis Complete
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {overallScore}%
          </div>
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            {t("dashboard.overallScore")}
          </div>
        </div>
      </div>

      {/* Competencies */}
      <div className="space-y-4 mb-6 flex-1">
        {competencies.map((competency, index) => (
          <div
            key={`${competency.name}-${index}`}
            className="group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {competency.name}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {competency.score}%
              </span>
            </div>
            <div className={cn("w-full rounded-full h-2 overflow-hidden", competency.bg)}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${competency.score}%` }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                className={cn("h-full rounded-full", competency.color)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
        <a
          href="/dashboard/assessments/pca"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20"
        >
          <span>{t("common.view")}</span>
          <ChevronRight className="w-4 h-4" />
        </a>
        <button
          onClick={refreshPCAData}
          className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title={t("common.refresh")}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 font-medium">
        <span>Code: {pcaData?.pcaCod || "N/A"}</span>
        <span>
          {pcaData?.lastUpdated
            ? new Date(pcaData.lastUpdated).toLocaleDateString()
            : new Date().toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}
