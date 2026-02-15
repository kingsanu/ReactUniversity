"use client";

import React from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Bolt, Compass, Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  usePrefetchCareers,
} from "@/hooks/useCareerQueries";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTimsCareerScoring } from "@/hooks/useTimsQueries";
import { careers } from "@/services/careerService";

export function Top3Careers() {
  const { user } = useGlobalStore();
  const { data: timsData, isLoading, hasAssessments } = useTimsCareerScoring();

  const timsCareerList = timsData?.data?.careers;

  const recs = React.useMemo(() => {
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
  }, [timsCareerList]);

  const showAssessmentPrompt = !hasAssessments;
  const prefetch = usePrefetchCareers();

  const router = useRouter();
  const { language } = useGlobalStore();

  const openCareer = (id?: string) => id && router.push(`/careers/${id}`);

  const { t } = useTranslation();

  return (
    <motion.section
      className="bg-white p-6 rounded-lg shadow-sm border"
      aria-labelledby="top3-careers-heading"
    >
      <h2 id="top3-careers-heading" className="text-lg font-semibold text-gray-900 mb-6">
        {t("dashboard.top3CareerMatch")}
      </h2>
      <ul className="space-y-4" role="list">
        {isLoading && (
          <li role="status" aria-busy="true" className="text-gray-500 py-4 text-center">
            <span className="sr-only">Loading career matches...</span>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        )}

        {!isLoading && showAssessmentPrompt && recs.length === 0 && (
          <li className="text-center py-6 text-gray-500">
            <p className="mb-3">{t("dashboard.completeAssessmentsForCareers", "Complete your assessments to see your top career matches!")}</p>
            <button
              onClick={() => router.push("/dashboard/assessments")}
              className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition"
            >
              {t("dashboard.goToAssessments", "Go to Assessments")}
            </button>
          </li>
        )}

        {!isLoading && !showAssessmentPrompt && recs.length === 0 && (
          <li className="text-center py-6 text-gray-500">
            {t("dashboard.noMatchesFound", "No career matches found yet. Try completing more sections of your profile.")}
          </li>
        )}
        {recs.slice(0, 3).map((r, i) => (
          <li
            key={r.careerId}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                aria-hidden="true"
              >
                {r.careerId?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" aria-hidden="true" />
                  <h3
                    className="font-medium text-gray-900"
                    onMouseEnter={() => prefetch.prefetchCareer?.(r.careerId)}
                  >
                    {r.title?.[language === "spanish" ? "es" : "en"] || r.careerId}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  {r.explanation?.[language === "spanish" ? "es" : "en"]}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600" aria-label={`${Math.round(r.matchScore ?? 0)} percent match`}>
                {Math.round(r.matchScore ?? 0)}%
              </div>
              <button
                type="button"
                onClick={() => openCareer(r.careerId)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`View ${r.careerId} career details`}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => router.push("/careers")}
        className="text-sm text-blue-600 hover:text-blue-700 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
      >
        {t("career.showAll")}
      </button>
    </motion.section>
  );
}

