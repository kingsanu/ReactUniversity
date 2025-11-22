"use client";

import React from "react";
import { CareerRole } from "@/types/career";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from "react-i18next";
import FavoriteButton from "./FavoriteButton";
import { usePrefetchCareers } from "@/hooks/useCareerQueries";
import { useCareersStore } from "@/store/useCareersStore";
import { useFavorites } from "@/hooks/useFavorites";

export default function CareerCard({ career }: { career: CareerRole }) {
  const router = useRouter();
  const { language } = useGlobalStore();

  const title =
    career.title[language === "spanish" ? "es" : "en"] || career.title.en || "";
  const short =
    career.shortDescription?.[language === "spanish" ? "es" : "en"] ||
    career.shortDescription?.en ||
    "";

  const { favorites, toggleFavorite } = useFavorites();

  const isFavorite = !!favorites.find((f) => f === career.id);

  const { t } = useTranslation();
  const prefetch = usePrefetchCareers();

  const { toggleCompare, compareList } = useCareersStore();

  const inCompare = compareList.includes(career.id);

  const matchScore = career.matchScore ?? 0;
  const matchColor =
    matchScore > 80 ? "#10b981" : matchScore > 60 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
      layout
      onClick={() => router.push(`/careers/${career.id}`)}
      onMouseEnter={() => prefetch.prefetchCareer?.(career.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 text-xl font-bold shadow-sm">
            {career.title.en?.charAt(0) || "C"}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg leading-tight">
              {title}
            </h4>
            <div className="text-xs text-gray-500 mt-1">
              {(career.industries || [])[0] || "General"}
            </div>
          </div>
        </div>

        {/* Match Score Indicator */}
        <div className="flex flex-col items-center">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="transparent"
                stroke="#f3f4f6"
                strokeWidth="4"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="transparent"
                stroke={matchColor}
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${
                  2 * Math.PI * 16 * (1 - matchScore / 100)
                }`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-gray-700">
              {matchScore}%
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1">
            {t("career.match", "Match")}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">{short}</p>

      <div className="flex items-center gap-2 mb-4">
        {career.salaryRange?.median && (
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
            <span className="font-semibold text-gray-700">
              ${career.salaryRange.median.toLocaleString()}
            </span>
            <span className="ml-1 text-gray-500">/yr</span>
          </div>
        )}
        {career.remoteEligible && (
          <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
            Remote
          </div>
        )}
        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
          {career.demandStats?.growthPercent &&
          career.demandStats.growthPercent > 0.05
            ? "High Demand"
            : "Stable"}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(career.id);
            }}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              inCompare
                ? "bg-indigo-600 text-white"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            {inCompare
              ? t("career.added", "Added")
              : t("career.compare", "Compare")}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => toggleFavorite(career.id)}
          />
          <div className="text-gray-300 group-hover:text-indigo-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
