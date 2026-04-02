"use client";

import { motion } from "framer-motion";
import { useMILData } from "@/hooks/useMILData";
import { useTranslation } from "react-i18next";
import { Target, ArrowsClockwise, CaretRight, WarningCircle, ChartBar, ArrowRight, Clock, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { PremiumCard } from "./PremiumCard";

interface MILResultsProps {
  className?: string;
  milDataProp?: any;
}

export function MILResults({ className, milDataProp }: MILResultsProps) {
  const hookData = useMILData();
  const loading = !milDataProp && hookData.loading;

  const hasMIL = (milDataProp && milDataProp.length > 0) || hookData.hasMIL;
  const { progress, error, isCompleted, getOverallScore, getSubtestScores, hasEnhancedData, completionStats } = hookData;
  const { t } = useTranslation();

  const overallScoreProp = milDataProp && milDataProp.length > 0
    ? Math.round(milDataProp.reduce((a: any, b: any) => a + (b.scorePercentage || b.ScorePercentage || 0), 0) / milDataProp.length)
    : hookData.hasMIL ? hookData.getOverallScore() : 0;

  // Build subtest scores from milDataProp if available, otherwise use hook
  // Deduplicate: take the best score per unique exam name to avoid repeated rows
  const examColorMap: Record<string, string> = {
    "Pattern Recognition": "#8B5CF6",
    "Verbal Reasoning": "#06B6D4",
    "Working Memory": "#10B981",
    "Numeric Velocity": "#F59E0B",
    "Visual Rotation": "#EF4444",
  };

  // Deduplicate milDataProp by exam name, taking the best score per exam
  const deduplicatedMilData = milDataProp && milDataProp.length > 0
    ? Object.values(
        milDataProp.reduce((acc: Record<string, any>, exam: any) => {
          const rawName =
            exam.examName || exam.ExamName ||
            exam.exam?.name || exam.Exam?.Name ||
            exam.exam?.examName || exam.Exam?.ExamName ||
            exam.name || exam.Name ||
            exam.title || exam.Title || "Unknown";
          const score = exam.scorePercentage ?? exam.ScorePercentage ?? 0;
          if (!acc[rawName] || score > (acc[rawName].scorePercentage ?? acc[rawName].ScorePercentage ?? 0)) {
            acc[rawName] = { ...exam, _resolvedName: rawName };
          }
          return acc;
        }, {} as Record<string, any>)
      )
    : null;

  const subtestScoresDerived = deduplicatedMilData
    ? deduplicatedMilData.map((exam: any) => ({
        name: exam._resolvedName,
        score: Math.min(100, Math.round(exam.scorePercentage || exam.ScorePercentage || 0)),
        color: examColorMap[exam._resolvedName] || "#6366F1",
      }))
    : getSubtestScores();

  const totalExamsExpected = progress?.totalExams || 5;
  const completionPercentageDerived = deduplicatedMilData
    ? Math.min(
        100,
        (deduplicatedMilData.filter((e: any) => (e.scorePercentage || e.ScorePercentage || 0) > 0).length /
          totalExamsExpected) *
          100
      )
    : progress
    ? (progress.completedExams.length / progress.totalExams) * 100
    : 0;

  if (loading) {
    return (
      <PremiumCard className={className} innerClassName="flex flex-col">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-12 w-12 bg-slate-100 rounded-2xl"></div>
            <div className="h-8 w-16 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="h-6 bg-slate-100 rounded w-1/3"></div>
          <div className="space-y-3 pt-4">
            <div className="h-2 bg-slate-100 rounded-full"></div>
            <div className="h-2 bg-slate-100 rounded-full w-5/6"></div>
            <div className="h-2 bg-slate-100 rounded-full w-4/6"></div>
          </div>
        </div>
      </PremiumCard>
    );
  }

  if (error || !hasMIL) {
    return (
      <div className={cn("h-full w-full", className)}>
        <PremiumCard innerClassName="flex flex-col justify-between h-full w-full">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
              <Target weight="fill" className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                {t("dashboard.takeLIAAssessment")}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {t("dashboard.measureCognitiveAbilities")}
              </p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <Target weight="duotone" className="w-16 h-16 text-slate-200 mb-4" />
            <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">
              Ready to discover your cognitive strengths?
            </p>
          </div>
        </div>

        <a
          href="/dashboard/assessments/mil"
          className="group mt-auto w-full flex items-center justify-between px-6 py-3.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] bg-slate-900 text-white hover:bg-slate-800"
        >
          <span className="tracking-tight">{t("dashboard.startAssessment")}</span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent backdrop-blur-md/10 group-hover:bg-transparent backdrop-blur-md/20 transition-colors duration-500 shadow-sm relative right-3 translate-x-3 group-hover:translate-x-0">
             <ArrowRight weight="bold" className="w-4 h-4 text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </div>
        </a>
      </PremiumCard>
      </div>
    );
  }

  const completionPercentage = completionPercentageDerived;
  const subtestScores = subtestScoresDerived;
  
  const completedCount = deduplicatedMilData 
    ? deduplicatedMilData.filter((e: any) => (e.scorePercentage || e.ScorePercentage) > 0).length 
    : (hasEnhancedData ? completionStats.completed : progress?.completedExams.length || 0);
    
  const totalCount = deduplicatedMilData 
    ? Math.max(5, deduplicatedMilData.length) 
    : (hasEnhancedData ? completionStats.total : progress?.totalExams || 5);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-full w-full">
      <PremiumCard className={cn("h-full", className)} innerClassName="flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
              <Target weight="fill" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                {t("dashboard.liaResults")}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {t("dashboard.cognitiveMatrix")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900 tracking-tighter">
              {completedCount}/{totalCount}
            </div>
          </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {t("common.progress")}
          </span>
          <span className="text-sm font-bold text-slate-900">
            {Math.round(completionPercentage)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
            className="bg-indigo-600 h-full rounded-full"
          />
        </div>
        {hasEnhancedData && completionStats.inProgress > 0 && (
          <div className="mt-4 flex items-center gap-2 text-[10px] text-amber-600 font-bold uppercase tracking-widest">
            <Clock weight="bold" className="w-3.5 h-3.5" />
            {completionStats.inProgress} {t("dashboard.examsInProgress")}
          </div>
        )}
      </div>

      {/* Subtests */}
      {subtestScores.length > 0 && (
        <div className="space-y-4 mb-8 flex-1 overflow-y-auto pr-2">
          {subtestScores.map((subtest: { name: string; score: number; color: string }, index: number) => (
            <div key={subtest.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {subtest.name}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {subtest.score}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${subtest.score}%` }}
                  transition={{ delay: index * 0.1, duration: 1, ease: [0.32, 0.72, 0, 1] }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: subtest.color }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-4 mt-auto pt-4">
        <a
          href="/dashboard/assessments/mil"
          className={cn(
            "group w-full flex items-center justify-between px-6 py-3.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
            !isCompleted ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-slate-900 text-white hover:bg-slate-800"
          )}
        >
          <span className="tracking-tight">{isCompleted ? t("dashboard.viewAssessments") : t("common.next")}</span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-500 relative right-3 translate-x-3 group-hover:translate-x-0">
             <CaretRight weight="bold" className="w-4 h-4 text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </div>
        </a>
      </div>
      </PremiumCard>
    </motion.div>
  );
}
