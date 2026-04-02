"use client";

import { motion } from "framer-motion";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from "react-i18next";
import { useDashboardAssessmentSummary } from "@/hooks/useAssessmentQueries";
import {
  CheckCircle,
  Circle,
  Clock,
  Brain,
  Target,
  Users,
  ArrowRight
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { PremiumCard } from "@/app/dashboard/_components/PremiumCard";

export function AssessmentProgressCard() {
  const { user } = useGlobalStore();
  const { t } = useTranslation();

  const {
    data: assessmentData,
    isLoading: loading,
    error,
  } = useDashboardAssessmentSummary(user?.id || "");

  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case "pca":
        return <Brain weight="fill" className="w-5 h-5 text-indigo-600" />;
      case "mil":
        return <Target weight="fill" className="w-5 h-5 text-rose-600" />;
      case "evaluation":
        return <Users weight="fill" className="w-5 h-5 text-amber-600" />;
      default:
        return <Circle weight="bold" className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "in_progress":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-full">
        <PremiumCard innerClassName="flex flex-col text-slate-900" aria-label="Loading assessment progress">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-100/50 rounded w-1/3"></div>
            <div className="h-4 bg-slate-100/50 rounded w-1/2"></div>
            <div className="h-32 bg-slate-100/50 rounded-[1.5rem]"></div>
          </div>
        </PremiumCard>
      </motion.div>
    );
  }

  if (!assessmentData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full w-full"
    >
      <PremiumCard innerClassName="flex flex-col justify-between">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-xl font-serif font-semibold text-slate-900 tracking-tight">
              {t("dashboard.assessmentJourney")}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {t("dashboard.assessmentSubtitle")}
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl md:text-8xl font-mono font-bold text-slate-900 tracking-tighter leading-none">
              {assessmentData.overallCompletion}%
            </div>
          </div>
        </div>

      {/* Overall Progress Bar */}
      <div className="mb-12 p-8 rounded-[2rem] bg-slate-50 border border-slate-200/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative overflow-hidden">
        {/* Subtle decorative background ring */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
        <div
          className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden relative z-10"
          role="progressbar"
          aria-valuenow={assessmentData.overallCompletion}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${assessmentData.overallCompletion}%` }}
            transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
            className="bg-indigo-600 h-full rounded-full"
          />
        </div>
        <div className="mt-6 flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500 relative z-10">
          <span>{t("common.start")}</span>
          <span className="text-slate-900">{t("dashboard.professionalCertified")}</span>
        </div>
      </div>

      {/* Individual Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6 flex-1 mb-8" role="list">
        {assessmentData.assessments.map((assessment: any, index: number) => (
          <motion.div
            key={assessment.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[1.5rem] bg-white border border-slate-200/60 shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative overflow-hidden"
            role="listitem"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  assessment.type === "pca"
                    ? "bg-indigo-50"
                    : assessment.type === "mil"
                      ? "bg-rose-50"
                      : "bg-amber-50",
                )}
                aria-hidden="true"
              >
                {getAssessmentIcon(assessment.type)}
              </div>
              <div>
                <div className="font-semibold text-slate-900 leading-tight">
                  {assessment.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-widest",
                      getStatusColor(assessment.status),
                    )}
                  >
                    {assessment.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {assessment.status === "completed" ? (
                <CheckCircle
                  weight="fill"
                  className="w-6 h-6 text-emerald-500"
                  aria-label="Completed"
                />
              ) : (
                <div
                  className="text-sm font-bold text-slate-400 font-mono tracking-tight"
                  aria-label={`${assessment.completion}% completed`}
                >
                  {assessment.completion}%
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="mt-auto pt-6 border-t border-slate-100/50 flex justify-end">
        <a
          href="/dashboard/assessments"
          className="group w-full md:w-auto flex items-center justify-between px-8 py-3.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] bg-slate-900 text-white hover:bg-slate-800"
        >
          <span className="tracking-tight">{t("dashboard.continueAssessment")}</span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-500 shadow-sm relative right-3 translate-x-3 group-hover:translate-x-0">
             <ArrowRight weight="bold" className="w-4 h-4 text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </div>
        </a>
      </div>
      </PremiumCard>
    </motion.div>
  );
}
