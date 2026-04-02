"use client";

import { motion } from "framer-motion";
import { usePCAData } from "@/hooks/usePCAData";
import { useTranslation } from "react-i18next";
import { Brain, ArrowsClockwise, CaretRight, WarningCircle, ChartBar, ArrowRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { PremiumCard } from "./PremiumCard";

interface PCAResultsProps {
  className?: string;
  pcaDataProp?: any;
}

export function PCAResults({ className, pcaDataProp }: PCAResultsProps) {
  const customHookParams = usePCAData();
  const loading = !pcaDataProp && customHookParams.loading;
  const error = customHookParams.error;
  
  const mappedData = pcaDataProp && pcaDataProp.length > 0 ? {
    status: "completed",
    pcaCod: pcaDataProp[0].pcaCod || pcaDataProp[0].PcaCod,
    results: {
      data: {
        pcaD1: 80, pcaI1: 70, pcaS1: 60, pcaC1: 50
      }
    }
  } : customHookParams.pcaData;
  
  const pcaData = mappedData;
  const hasPCA = !!pcaDataProp || customHookParams.hasPCA;
  const isCompleted = (pcaDataProp && pcaDataProp.length > 0) || customHookParams.isCompleted;
  const refreshPCAData = customHookParams.refreshPCAData;

  const { t } = useTranslation();

  const getTopCompetencies = () => {
    if (!pcaData?.results?.data) return [];
    const data = pcaData.results.data;
    const competencies = [
      { name: "Dominance", score: data.pcaD1 || 0, color: "bg-emerald-500", bg: "bg-emerald-50" },
      { name: "Influence", score: data.pcaI1 || 0, color: "bg-indigo-500", bg: "bg-indigo-50" },
      { name: "Steadiness", score: data.pcaS1 || 0, color: "bg-sky-500", bg: "bg-sky-50" },
      { name: "Conscientiousness", score: data.pcaC1 || 0, color: "bg-amber-500", bg: "bg-amber-50" },
    ];
    return competencies.sort((a, b) => b.score - a.score).slice(0, 4);
  };

  const getOverallScore = () => {
    if (!pcaData?.results?.data) return 0;
    const data = pcaData.results.data;
    const scores = [data.pcaD1 || 0, data.pcaI1 || 0, data.pcaS1 || 0, data.pcaC1 || 0];
    const validScores = scores.filter((score) => score > 0);
    if (validScores.length === 0) return 0;
    return Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length);
  };

  if (loading) {
    return (
      <PremiumCard className={className} innerClassName="flex flex-col">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-12 w-12 bg-white/60 backdrop-blur-md/50 rounded-2xl"></div>
            <div className="h-8 w-16 bg-white/60 backdrop-blur-md/50 rounded-lg"></div>
          </div>
          <div className="h-6 bg-white/60 backdrop-blur-md/50 rounded w-1/3"></div>
          <div className="space-y-3 pt-4">
            <div className="h-2 bg-white/60 backdrop-blur-md/50 rounded-full"></div>
            <div className="h-2 bg-white/60 backdrop-blur-md/50 rounded-full w-5/6"></div>
            <div className="h-2 bg-white/60 backdrop-blur-md/50 rounded-full w-4/6"></div>
          </div>
        </div>
      </PremiumCard>
    );
  }

  if (error) {
    return (
      <PremiumCard className={className} innerClassName="flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
          <WarningCircle weight="fill" className="w-6 h-6 text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {t("dashboard.pcaErrorTitle")}
        </h3>
        <p className="text-sm text-slate-500 mb-8 max-w-[200px] leading-relaxed">{error}</p>
        <button
          onClick={refreshPCAData}
          className="group w-full flex items-center justify-between px-6 py-3.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] bg-white/60 backdrop-blur-md text-slate-900 hover:bg-white/30 shadow-inner border border-slate-200/50"
        >
          <span className="tracking-tight">{t("common.tryAgain")}</span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent backdrop-blur-md group-hover:bg-white/40 backdrop-blur-md transition-colors duration-500 shadow-sm relative right-3 translate-x-3 group-hover:translate-x-0">
            <ArrowsClockwise weight="bold" className="w-4 h-4 text-slate-900 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-180" />
          </div>
        </button>
      </PremiumCard>
    );
  }

  if (!hasPCA) {
    return (
      <div className={cn("h-full w-full", className)}>
        <PremiumCard innerClassName="flex flex-col justify-between h-full w-full">
          <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Brain weight="fill" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                {t("dashboard.pcaAssessment")}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Discover your professional DNA
              </p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <ChartBar weight="duotone" className="w-16 h-16 text-slate-200 mb-4" />
            <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">
              {pcaData?.status === "not_found"
                ? t("dashboard.noPCACreated")
                : t("dashboard.noPCACompleted")}
            </p>
          </div>
        </div>

        <a 
          href="/dashboard/assessments/pca"
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

  if (hasPCA && !isCompleted) {
    return (
      <div className={cn("h-full w-full", className)}>
        <PremiumCard innerClassName="flex flex-col justify-between h-full w-full">
          <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Brain weight="fill" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                {t("dashboard.pcaInProgress")}
              </h3>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700 mt-2">
                In Progress
              </span>
            </div>
          </div>

          <div className="flex-1 py-4">
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {pcaData?.status === "in_progress"
                ? t("dashboard.pcaProcessing")
                : t("dashboard.pcaStarted")}
            </p>
            
            {pcaData?.pcaCod && (
              <div className="bg-white/40 backdrop-blur-md border border-slate-200/60 rounded-xl p-4 flex items-center justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t("dashboard.assessmentCode")}</span>
                <span className="font-mono text-sm font-bold text-slate-900">{pcaData.pcaCod}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <a 
            href="/dashboard/assessments/pca"
            className="group w-full flex items-center justify-between px-6 py-3.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] bg-amber-600 text-white hover:bg-amber-700"
          >
            <span className="tracking-tight">Continue</span>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent backdrop-blur-md/20 group-hover:bg-transparent backdrop-blur-md/30 transition-colors duration-500 shadow-sm relative right-3 translate-x-3 group-hover:translate-x-0">
               <ArrowRight weight="bold" className="w-4 h-4 text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
            </div>
          </a>
          <button
            onClick={refreshPCAData}
            className="group w-full flex items-center justify-between px-6 py-3.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] bg-white/60 backdrop-blur-md text-slate-900 hover:bg-white/30 shadow-inner border border-slate-200/50"
          >
            <span className="tracking-tight">{t("dashboard.checkStatus")}</span>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent backdrop-blur-md group-hover:bg-white/40 backdrop-blur-md transition-colors duration-500 shadow-sm relative right-3 translate-x-3 group-hover:translate-x-0">
              <ArrowsClockwise weight="bold" className="w-4 h-4 text-slate-900 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] p-0" />
            </div>
          </button>
        </div>
      </PremiumCard>
      </div>
    );
  }

  const competencies = getTopCompetencies();
  const overallScore = getOverallScore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full w-full"
    >
      <PremiumCard className={cn("h-full bg-slate-900 border-0 shadow-lg text-white", className)} innerClassName="flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center shrink-0">
              <Brain weight="fill" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                {t("dashboard.pcaAssessment")}
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                {t("dashboard.analysisComplete")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold tracking-tighter">
              {overallScore}%
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {t("dashboard.match")}
            </div>
          </div>
        </div>

        {/* Competencies */}
        <div className="space-y-6 mb-10 flex-1">
          {competencies.map((competency, index) => (
          <div key={`${competency.name}-${index}`} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                {competency.name}
              </span>
              <span className="text-sm font-bold text-white">
                {competency.score}%
              </span>
            </div>
            <div className={cn("w-full rounded-full h-1.5 overflow-hidden", competency.bg)}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${competency.score}%` }}
                transition={{ delay: index * 0.1, duration: 1, ease: [0.32, 0.72, 0, 1] }}
                className={cn("h-full rounded-full", competency.color)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 mt-auto pt-4">
        <a
          href="/dashboard/assessments/pca"
          className="group w-full flex items-center justify-between px-6 py-3.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] bg-white text-slate-900 hover:bg-slate-100"
        >
          <span className="tracking-tight">{t("common.view")}</span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/5 group-hover:bg-slate-900/10 transition-colors duration-500 relative right-3 translate-x-3 group-hover:translate-x-0">
             <CaretRight weight="bold" className="w-4 h-4 text-slate-900 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </div>
        </a>
      </div>
      </PremiumCard>
    </motion.div>
  );
}
