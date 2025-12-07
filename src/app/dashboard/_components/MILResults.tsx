"use client";

import { motion } from "motion/react";
import { useMILData } from "@/hooks/useMILData";
import { useTranslation } from "react-i18next";
import { Target, RefreshCw, ChevronRight, AlertCircle, BarChart3, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MILResultsProps {
  className?: string;
}

export function MILResults({ className }: MILResultsProps) {
  const {
    progress,
    loading,
    error,
    hasMIL,
    isCompleted,
    getOverallScore,
    getSubtestScores,
    getCompletionStats,
    hasEnhancedData,
    completionStats,
  } = useMILData();
  const { t } = useTranslation();

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

  if (error || !hasMIL) {
    return (
      <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col items-center justify-center text-center", className)}>
        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
          <Target className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {t("dashboard.takeLIAAssessment")}
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-[200px]">
          {t("dashboard.measureCognitiveAbilities")}
        </p>
        <a
          href="/dashboard/assessments/mil"
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-purple-700 transition-all duration-200 shadow-lg shadow-purple-600/20"
        >
          <span>{t("dashboard.startAssessment")}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  const overallScore = getOverallScore();
  const completionPercentage = progress
    ? (progress.completedExams.length / progress.totalExams) * 100
    : 0;

  // Use enhanced API data for subtest scores
  const subtestScores = getSubtestScores();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {t("dashboard.liaResults")}
            </h3>
            <p className="text-sm text-gray-500">
              Cognitive Assessment
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {hasEnhancedData
              ? `${completionStats.completed}/${completionStats.total}`
              : `${progress?.completedExams.length || 0}/${
                  progress?.totalExams || 5
                }`}
          </div>
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
            {isCompleted
              ? t("dashboard.allComplete")
              : t("dashboard.examsCompleted")}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t("common.progress")}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(completionPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-purple-600 h-full rounded-full"
          />
        </div>
        {hasEnhancedData && completionStats.inProgress > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <Clock className="w-3 h-3" />
            {completionStats.inProgress} {t("dashboard.examsInProgress")}
          </div>
        )}
      </div>

      {/* Subtest Completion Status */}
      {subtestScores.length > 0 && (
        <div className="space-y-3 mb-6 flex-1 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
          {subtestScores.map((subtest, index) => (
            <div key={subtest.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {subtest.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    {t("dashboard.complete")}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full rounded-full bg-green-500 w-full" />
              </div>
              {hasEnhancedData && (subtest as any).timeSpent && (
                <div className="mt-1 text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {(subtest as any).timeSpent.split(".")[0]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
        <a
          href="/dashboard/assessments/mil"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-xl transition-all shadow-lg",
            isCompleted 
              ? "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/10 hover:shadow-gray-900/20"
              : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-600/20 hover:shadow-purple-600/30"
          )}
        >
          <span>{isCompleted ? t("dashboard.viewAssessments") : t("common.next")}</span>
          <ChevronRight className="w-4 h-4" />
        </a>
        <button
          onClick={() => window.location.reload()}
          className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 font-medium">
        <span>
          {isCompleted
            ? t("dashboard.allAssessmentsComplete")
            : `${progress?.completedExams.length || 0}/${progress?.totalExams || 5} completed`}
        </span>
        <div className="flex items-center gap-2">
          <span>
            {progress?.lastUpdated
              ? new Date(progress.lastUpdated).toLocaleDateString()
              : "Today"}
          </span>
          {hasEnhancedData && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" title={t("dashboard.liveData")} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
