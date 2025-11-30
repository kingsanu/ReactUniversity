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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp, DollarSign, Globe, Briefcase } from "lucide-react";

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
  
  // Determine match color and label
  let matchColorClass = "text-red-600 bg-red-50 border-red-100";
  let matchLabel = "Low Match";
  if (matchScore > 80) {
    matchColorClass = "text-emerald-600 bg-emerald-50 border-emerald-100";
    matchLabel = "High Match";
  } else if (matchScore > 60) {
    matchColorClass = "text-amber-600 bg-amber-50 border-amber-100";
    matchLabel = "Good Match";
  }

  return (
    <motion.div
      className="bg-white rounded-3xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden border border-gray-100 h-full flex flex-col"
      layout
      onClick={() => router.push(`/careers/${career.id}`)}
      onMouseEnter={() => prefetch.prefetchCareer?.(career.id)}
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      
      <div className="flex items-start justify-between mb-5">
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
            {title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5 font-medium">
            <Briefcase className="h-3 w-3" />
            {(career.industries || [])[0] || "General"}
          </div>
        </div>

        {/* Match Score Badge */}
        <div className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-lg border ${matchColorClass}`}>
          <span className="text-sm font-bold leading-none">{matchScore}%</span>
          <span className="text-[9px] font-medium uppercase tracking-wider opacity-80 mt-0.5">Match</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed flex-grow">
        {short}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {career.salaryRange?.median && (
          <Badge variant="secondary" className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-100 font-medium px-2.5 py-1">
            <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
            ${(career.salaryRange.median / 1000).toFixed(0)}k/yr
          </Badge>
        )}
        {career.remoteEligible && (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 font-medium px-2.5 py-1">
            <Globe className="h-3 w-3 mr-1 text-blue-400" />
            Remote
          </Badge>
        )}
        {career.demandStats?.growthPercent && career.demandStats.growthPercent > 0.05 && (
          <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-100 font-medium px-2.5 py-1">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            High Demand
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(career.id);
            }}
            className={`text-xs font-medium px-3 h-8 rounded-full transition-all ${
              inCompare
                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            {inCompare ? t("career.added", "Added") : t("career.compare", "Compare")}
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <div onClick={(e) => e.stopPropagation()}>
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={() => toggleFavorite(career.id)}
            />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 group-hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
