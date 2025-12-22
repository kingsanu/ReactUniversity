"use client";

import React from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Bolt, Compass, Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useRecommendations,
  usePrefetchCareers,
} from "@/hooks/useCareerQueries";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export function Top3Careers() {
  const { user } = useGlobalStore();
  const { data, isLoading } = useRecommendations(user.id ?? undefined);

  const recs = data?.recommendations ?? [];
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
          <li role="status" aria-busy="true" className="text-gray-500">
            <span className="sr-only">Loading career matches...</span>
            Loading...
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
                    {r.careerId}
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

