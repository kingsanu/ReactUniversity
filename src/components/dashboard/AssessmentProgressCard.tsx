"use client";

import { useState } from "react";
import { generateAssessmentPDF } from "@/utils/pdfGenerator";
import { NexaReport } from "@/app/print/nexa/page";
import { Download, Loader2, ArrowRight, Sparkles } from "lucide-react";

import { motion } from "motion/react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from 'react-i18next';
import { useDashboardAssessmentSummary } from "@/hooks/useAssessmentQueries";
import { CheckCircle2, Circle, Brain, Target, Users, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function AssessmentProgressCard() {
  const { user } = useGlobalStore();
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: assessmentData,
    isLoading: loading,
  } = useDashboardAssessmentSummary(user?.id || '');

  const getAssessmentIcon = (type: string, status: string) => {
    const isLocked = status === 'pending';
    const colorClass = isLocked ? "text-gray-400" :
      type === "pca" ? "text-blue-600" :
        type === "mil" ? "text-purple-600" : "text-teal-600";

    if (isLocked) return <Lock className="w-5 h-5 text-gray-300" />;

    switch (type) {
      case "pca":
        return <Brain className={cn("w-5 h-5", colorClass)} />;
      case "mil":
        return <Target className={cn("w-5 h-5", colorClass)} />;
      case "evaluation":
        return <Users className={cn("w-5 h-5", colorClass)} />;
      default:
        return <Circle className={cn("w-5 h-5", colorClass)} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-400 text-sm">Loading journey...</p>
      </div>
    );
  }

  if (!assessmentData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 p-0 h-full flex flex-col relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-50/40 via-purple-50/40 to-transparent rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

      {/* Header Section */}
      <div className="p-8 pb-4 relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              My Growth
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            {t('dashboard.assessmentJourney')}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-[200px]">
            {t('dashboard.assessmentSubtitle')}
          </p>
        </div>

        {/* Radial Progress */}
        <div className="relative flex items-center justify-center bg-white p-2 rounded-full shadow-sm border border-gray-50">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="36" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
            <circle cx="40" cy="40" r="36" stroke="url(#gradient)" strokeWidth="6" fill="transparent"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 36}
              strokeDashoffset={2 * Math.PI * 36 * (1 - assessmentData.overallCompletion / 100)}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-bold text-gray-900">{assessmentData.overallCompletion}%</span>
          </div>
        </div>
      </div>

      {/* Zig-Zag Timeline Container */}
      <div className="flex-1 relative px-4 py-6 md:px-8">
        {/* Central Spine Line */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-12 w-0.5 bg-gradient-to-b from-blue-100 via-purple-100 to-transparent md:-translate-x-1/2 z-0" aria-hidden="true" />

        <div className="space-y-12 md:space-y-0 relative z-10">
          {assessmentData.assessments.map((assessment: any, index: number) => {
            const isCompleted = assessment.status === 'completed';
            const isInProgress = assessment.status === 'in_progress';

            // Determine alignment for desktop (Alternating)
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={assessment.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={cn(
                  "relative flex items-center md:justify-center w-full",
                  // Mobile: Always left aligned timeline
                  // Desktop: Zig-zag
                )}
              >
                {/* Desktop: Container for alternating layout */}
                <div className={cn(
                  "hidden md:flex w-full items-center justify-between",
                  isLeft ? "flex-row" : "flex-row-reverse"
                )}>
                  {/* Content Side */}
                  <div className={cn(
                    "w-[42%] transition-all duration-300",
                    isLeft ? "text-right pr-4" : "text-left pl-4"
                  )}>
                    <AssessmentCard
                      assessment={assessment}
                      status={assessment.status}
                      align={isLeft ? 'right' : 'left'}
                      compact={!isInProgress}
                    />
                  </div>

                  {/* Timeline Node (Center) */}
                  <div className={cn(
                    "relative z-20 w-12 h-12 rounded-2xl rotate-45 flex items-center justify-center border-4 border-white shadow-lg transition-transform duration-500",
                    isCompleted ? "bg-gradient-to-br from-green-400 to-green-600" :
                      isInProgress ? "bg-gradient-to-br from-blue-500 to-indigo-600 scale-110 shadow-blue-500/30" :
                        "bg-gray-100"
                  )}>
                    <div className="-rotate-45">
                      {isCompleted ? <CheckCircle2 className="w-6 h-6 text-white" /> :
                        getAssessmentIcon(assessment.type, assessment.status === 'pending' ? 'pending' : 'active')}
                    </div>
                    {/* Connecting pulsing ring for active */}
                    {isInProgress && (
                      <div className="absolute -inset-2 bg-blue-500/10 rounded-2xl -z-10 animate-pulse" />
                    )}
                  </div>

                  {/* Empty Space Side (for balance) */}
                  <div className="w-[42%]">
                    {/* Optional: Date decoration or small metadata on opposite side */}
                    {isCompleted && (
                      <div className={cn(
                        "text-xs text-gray-400 font-medium",
                        isLeft ? "text-left pl-4" : "text-right pr-4"
                      )}>
                        Completed
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile View: Vertical list */}
                <div className="flex gap-4 md:hidden w-full">
                  <div className={cn(
                    "relative z-20 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0",
                    isCompleted ? "bg-green-100 text-green-600" :
                      isInProgress ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                      getAssessmentIcon(assessment.type, assessment.status)}
                  </div>
                  <div className="flex-1 pb-8">
                    <AssessmentCard assessment={assessment} status={assessment.status} align="left" compact={!isInProgress} />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-50 bg-gray-50/50 backdrop-blur-sm">
        <button
          onClick={async () => {
            setIsDownloading(true);
            try {
              await generateAssessmentPDF(<NexaReport />);
            } catch (error) {
              console.error(error);
            } finally {
              setIsDownloading(false);
            }
          }}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-2 text-sm font-medium"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Download Journey Report</span>
        </button>
      </div>
    </motion.div>
  );
}

// Subcomponent for the cards floating on sides
function AssessmentCard({ assessment, status, align, compact }: { assessment: any, status: string, align: 'left' | 'right', compact: boolean }) {
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  const isLocked = status === 'pending';

  return (
    <div className={cn(
      "relative transition-all duration-300",
      isInProgress ? "scale-105" : "scale-100",
      align === 'right' ? "items-end text-right" : "items-start text-left"
    )}>
      {/* Title */}
      <h4 className={cn(
        "font-bold text-gray-900 mb-1",
        isInProgress ? "text-lg" : "text-base"
      )}>
        {assessment.name}
      </h4>

      {/* Description / Content */}
      {isCompleted && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-xs font-semibold text-green-700">
          <Sparkles className="w-3 h-3" /> Mastery Achieved
        </div>
      )}

      {isLocked && (
        <p className="text-xs text-gray-400">Locked until previous step complete</p>
      )}

      {isInProgress && (
        <div className={cn(
          "mt-3 bg-white p-4 rounded-2xl border border-blue-100 shadow-xl shadow-blue-500/10",
          align === 'right' ? "rounded-tr-none" : "rounded-tl-none"
        )}>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            You're {assessment.completion}% of the way there. Keep the momentum going!
          </p>

          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${assessment.completion}%` }} />
          </div>

          <a
            href="/dashboard/assessments"
            className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
