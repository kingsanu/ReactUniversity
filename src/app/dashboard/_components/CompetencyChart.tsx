import { motion } from "framer-motion";
import { dashboardData } from "./data";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { PremiumCard } from "./PremiumCard";
import { TrendUp, TrendDown } from "@phosphor-icons/react";

interface CompetencyChartProps {
  className?: string;
}

export function CompetencyChart({ className }: CompetencyChartProps) {
  const { competencyPlan } = dashboardData;
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full w-full"
      aria-labelledby="competency-chart-title"
    >
      <PremiumCard className={className} innerClassName="flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-100/50">
          <div>
            <h2 id="competency-chart-title" className="text-xl font-serif font-semibold text-slate-900 tracking-tight mb-1">
              {competencyPlan.title}
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{competencyPlan.date}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              {t("dashboard.allCategories")}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">{t("common.today")}</span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-16 flex-1 mt-2">
          {/* Chart Container */}
          <div className="flex-1 w-full max-w-[240px] relative group cursor-pointer shrink-0">
            <div className="relative w-full aspect-square mx-auto transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
              {/* SVG Doughnut Chart with accessibility */}
              <svg
                viewBox="0 0 256 256"
                className="w-full h-full transform -rotate-90 drop-shadow-xl"
                role="img"
                aria-labelledby="chart-title chart-desc"
              >
                <title id="chart-title">{t("dashboard.competencyChart")}</title>
                <desc id="chart-desc">
                  {competencyPlan.categories.map(cat => `${cat.name}: ${cat.percentage}%`).join(", ")}
                </desc>
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="20"
                />

                {/* Render each category as arc */}
                {competencyPlan.categories.map((category, index) => {
                  const circumference = 2 * Math.PI * 100;
                  const offset = competencyPlan.categories
                    .slice(0, index)
                    .reduce(
                      (acc, cat) => acc + (cat.percentage / 100) * circumference,
                      0
                    );
                  const strokeDasharray =
                    (category.percentage / 100) * circumference;

                  return (
                    <motion.circle
                      key={`${category.name}-${index}`}
                      cx="128"
                      cy="128"
                      r="100"
                      fill="transparent"
                      stroke={category.color}
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeDasharray={`${strokeDasharray} ${circumference}`}
                      strokeDashoffset={-offset}
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{
                        strokeDasharray: `${strokeDasharray} ${circumference}`,
                      }}
                      transition={{ delay: index * 0.2, duration: 1.5, ease: [0.32, 0.72, 0, 1] }}
                      className="transition-opacity hover:opacity-80"
                    />
                  );
                })}
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-700 group-hover:scale-95" aria-hidden="true">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Overall
                </span>
                <span className="text-3xl font-serif font-bold text-slate-900 tracking-tighter">
                  85%
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <ul className="space-y-5" aria-label="Chart legend">
            {competencyPlan.categories.map((category, index) => (
              <li key={`${category.name}-${index}`} className="flex items-center group">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 mr-4 shadow-inner ring-4 ring-slate-50 transition-transform group-hover:scale-125"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-slate-600 min-w-[140px] group-hover:text-slate-900 transition-colors">
                  {category.name}
                </span>
                <span className="text-sm font-bold text-slate-900 w-12 text-right tracking-tight">
                  {category.percentage}%
                </span>
                <div className="w-8 flex justify-end">
                  {category.trend === "up" ? (
                    <TrendUp weight="bold" className="w-4 h-4 text-emerald-500" aria-label="Trending up" />
                  ) : (
                    <TrendDown weight="bold" className="w-4 h-4 text-rose-500" aria-label="Trending down" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </PremiumCard>
    </motion.section>
  );
}
