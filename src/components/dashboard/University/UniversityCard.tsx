"use client";

import React from "react";
import { motion } from "motion/react";
import { Star, MapPin, Heart, HeartOff, GraduationCap, ArrowRight } from "lucide-react";
import { UniversityCardProps } from "@/types/university";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/useGlobalStore";

export function UniversityCard({
  university,
  matchScore,
  matchReasons,
  isFavorite,
  onFavoriteToggle,
  onViewDetails,
  onCompare,
  isCompareSelected,
  variant = "default",
}: UniversityCardProps) {
  const { language } = useGlobalStore();
  const tuition =
    university.tuition.international ?? university.tuition.outOfState ?? university.tuition.inState ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden",
        "hover:shadow-md transition-shadow",
        variant === "featured" && "border-primary/40 ring-1 ring-primary/20",
      )}
    >
      {/* Header banner */}
      <div className="relative h-32 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        {university.coverImage && (
          <div
            className="absolute inset-0 opacity-60 bg-cover bg-center"
            style={{ backgroundImage: `url(${university.coverImage})` }}
          />
        )}
        <div className="relative h-full flex items-end justify-between p-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-white shadow flex items-center justify-center overflow-hidden">
              {university.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={university.logo} alt={university.name} className="h-full w-full object-contain p-1" />
              ) : (
                <span className="text-sm font-semibold">{university.shortName || university.name.slice(0, 3)}</span>
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white line-clamp-1">{university.name}</h3>
              <p className="text-xs text-slate-200 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>
                  {university.city}, {university.country}
                </span>
              </p>
            </div>
          </div>
          {typeof matchScore === "number" && (
            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-1 text-emerald-300">
                <span className="text-lg font-bold">{matchScore}</span>
                <span className="text-xs">/100</span>
              </div>
              <p className="text-[10px] text-emerald-100">
                {language === "spanish" ? "Coincidencia total" : "Overall match"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Tags & quick info */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {university.type && (
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              {university.type}
            </span>
          )}
          {university.ranking.global && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] text-amber-700 dark:text-amber-300">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {language === "spanish" ? "Ranking global" : "Global rank"}: #{university.ranking.global}
            </span>
          )}
          {university.acceptanceRate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300">
              {language === "spanish" ? "Aceptación" : "Acceptance"}: {university.acceptanceRate}%
            </span>
          )}
        </div>

        {/* Degrees & tuition */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <GraduationCap className="h-3 w-3" />
            <span>
              {university.programs
                .map((p) => p.degree)
                .filter((v, i, a) => a.indexOf(v) === i)
                .join(" • ")}
            </span>
          </div>
          {tuition > 0 && (
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                ${tuition.toLocaleString()} {university.tuition.currency}
              </p>
              <p className="text-[10px] text-slate-500">
                {language === "spanish" ? "por año (aprox.)" : "per year (approx.)"}
              </p>
            </div>
          )}
        </div>

        {/* Match reasons */}
        {matchReasons && matchReasons.length > 0 && (
          <ul className="mt-1 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
            {matchReasons.slice(0, 2).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="mt-0.5 h-1 w-1 rounded-full bg-emerald-500" />
                <span className="line-clamp-2">{reason}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-2 border-t px-4 py-3 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onFavoriteToggle?.(university.id)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] transition-colors",
              isFavorite
                ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300"
                : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
            )}
          >
            {isFavorite ? (
              <Heart className="h-3 w-3 fill-current" />
            ) : (
              <HeartOff className="h-3 w-3" />
            )}
            <span>{language === "spanish" ? "Guardar" : "Save"}</span>
          </button>

          {onCompare && (
            <button
              type="button"
              onClick={() => onCompare(university)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] transition-colors",
                isCompareSelected
                  ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                  : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              <span>{language === "spanish" ? "Comparar" : "Compare"}</span>
            </button>
          )}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs gap-1"
          onClick={() => onViewDetails?.(university)}
        >
          <span>{language === "spanish" ? "Ver detalles" : "View details"}</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}

export default UniversityCard;
