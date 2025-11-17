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

  return (
    <motion.div
      className="bg-white border rounded-lg p-4 hover:shadow-lg transition cursor-pointer group transform hover:-translate-y-1 hover:scale-101"
      layout
      onClick={() => router.push(`/careers/${career.id}`)}
      onMouseEnter={() => prefetch.prefetchCareer?.(career.id)}
    >
      <div className="flex items-start space-x-4">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md transform transition-transform group-hover:scale-105">
          {career.title.en?.charAt(0) || "C"}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <div className="flex items-center space-x-3">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="transparent"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 16 * (1 - (career.matchScore ?? 0) / 100)
                  }`}
                />
              </svg>
              <div className="text-sm text-gray-600">
                {t("career.match")}: {career.matchScore ?? "--"}%
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{short}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-gray-500">
              {(career.industries || [])[0] || ""}
            </div>
            <div className="flex items-center space-x-2">
              <FavoriteButton
                isFavorite={isFavorite}
                onToggle={() => toggleFavorite(career.id)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompare(career.id);
                }}
                className={`text-sm px-2 py-1 ${
                  inCompare
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600"
                } rounded hover: ${inCompare ? "bg-blue-700" : "bg-blue-100"}`}
              >
                {t("career.compare")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
