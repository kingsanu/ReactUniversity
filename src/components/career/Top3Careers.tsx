"use client";

import React from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Lightning, Compass, Briefcase, ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import {
  usePrefetchCareers,
} from "@/hooks/useCareerQueries";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTimsCareerScoring } from "@/hooks/useTimsQueries";
import { careers } from "@/services/careerService";
import { cn } from "@/lib/utils";
import { PremiumCard } from "@/app/dashboard/_components/PremiumCard";

export function Top3Careers({ topCareersProp }: { topCareersProp?: string[] }) {
  const { user } = useGlobalStore();
  const { data: timsData, isLoading: isTimsLoading, hasAssessments } = useTimsCareerScoring(); 

  const timsCareerList = timsData?.data?.careers;

  const recs = React.useMemo(() => {
    if (topCareersProp && topCareersProp.length > 0) {
      return topCareersProp.map((c, i) => ({
        careerId: c,
        matchScore: 90 - (i * 5),
        explanation: {
          en: "Based on your dashboard AI insights",
          es: "Basado en tu panel de control de IA",
        },
        title: { en: c, es: c },
        iconUrl: "",
      }));
    }
    if (timsCareerList) {
      return timsCareerList.map(sc => {
        const staticCareer = careers.find(c => c.id === sc.programId || c.slug === sc.programId);
        return {
          careerId: sc.programId,
          matchScore: sc.totalScore,
          explanation: {
            en: sc.bridgingReasons?.[0] || "Based on your profile match",
            es: sc.bridgingReasons?.[0] || "Basado en tu perfil",
          },
          title: staticCareer?.title || { en: sc.programTitle, es: sc.programTitle },
          iconUrl: staticCareer?.iconUrl,
        };
      });
    }
    return [];
  }, [timsCareerList, topCareersProp]);

  const isLoading = !topCareersProp && isTimsLoading;
  const showAssessmentPrompt = !hasAssessments && !topCareersProp;
  const prefetch = usePrefetchCareers();

  const router = useRouter();
  const { language } = useGlobalStore();

  const openCareer = (id?: string) => id && router.push(`/careers/${id}`);

  const { t } = useTranslation();

  return (
    <motion.section
      className="h-full w-full"
      aria-labelledby="top3-careers-heading"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <PremiumCard innerClassName="flex flex-col">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100/50">
        <h2 id="top3-careers-heading" className="text-xl font-serif font-semibold text-slate-900 tracking-tight">
          {t("dashboard.top3CareerMatch")}
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full ring-1 ring-emerald-200">
          AI Suggested
        </span>
      </div>

      <ul className="space-y-4 flex-1" role="list">
        {isLoading && (
          <li role="status" aria-busy="true" className="py-4 text-center">
            <span className="sr-only">Loading career matches...</span>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-xl bg-slate-100/50 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-100/50 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-100/50 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-100/50 rounded col-span-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        )}

        {!isLoading && showAssessmentPrompt && recs.length === 0 && (
          <li className="text-center py-10">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Compass weight="duotone" className="w-6 h-6" />
            </div>
            <p className="mb-6 text-sm text-slate-500 leading-relaxed font-medium">
              {t("dashboard.completeAssessmentsForCareers", "Complete your assessments to see your top career matches!")}
            </p>
            <button
              onClick={() => router.push("/dashboard/assessments")}
              className="group w-full flex items-center justify-between px-6 py-3.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] bg-slate-900 text-white hover:bg-slate-800"
            >
              <span className="tracking-tight">{t("dashboard.goToAssessments", "Go to Assessments")}</span>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-500 shadow-sm relative right-3 translate-x-3 group-hover:translate-x-0">
                 <ArrowRight weight="bold" className="w-4 h-4 text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
              </div>
            </button>
          </li>
        )}

        {!isLoading && !showAssessmentPrompt && recs.length === 0 && (
          <li className="text-center py-6 text-slate-500 text-sm font-medium">
            {t("dashboard.noMatchesFound", "No career matches found yet. Try completing more sections of your profile.")}
          </li>
        )}
        
        {recs.slice(0, 3).map((r, index) => (
          <motion.li
            key={r.careerId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="group flex items-center justify-between p-4 border border-slate-100 rounded-[1.25rem] hover:bg-slate-50 hover:shadow-sm hover:border-slate-200 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg font-serif font-bold uppercase ring-1 ring-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500"
                aria-hidden="true"
              >
                {r.careerId?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className="font-semibold text-slate-900 tracking-tight"
                    onMouseEnter={() => prefetch.prefetchCareer?.(r.careerId)}
                  >
                    {r.title?.[language === "spanish" ? "es" : "en"] || r.careerId}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Lightning weight="fill" className="w-3 h-3 text-amber-500" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {r.explanation?.[language === "spanish" ? "es" : "en"] || "Profile Match"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 pr-2">
              <div className="text-xl font-serif font-bold text-slate-900 tabular-nums tracking-tighter" aria-label={`${Math.round(r.matchScore ?? 0)} percent match`}>
                {Math.round(r.matchScore ?? 0)}%
              </div>
              <button
                type="button"
                onClick={() => openCareer(r.careerId)}
                className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all duration-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95"
                aria-label={`View ${r.careerId} career details`}
              >
                <ArrowRight weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
      
      {recs.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-100/50">
          <button
            type="button"
            onClick={() => router.push("/careers")}
            className="group w-full flex items-center justify-between px-6 py-3.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200/50"
          >
            <span className="tracking-tight">{t("career.showAll")}</span>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white group-hover:bg-slate-50 transition-colors duration-500 shadow-sm relative right-3 translate-x-3 group-hover:translate-x-0">
               <MagnifyingGlass weight="bold" className="w-4 h-4 text-slate-900 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110" />
            </div>
          </button>
        </div>
      )}
      </PremiumCard>
    </motion.section>
  );
}
