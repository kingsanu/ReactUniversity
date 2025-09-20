import { motion } from "motion/react";
import { dashboardData } from "./data";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface CompetencyChartProps {
  className?: string;
}

export function CompetencyChart({ className }: CompetencyChartProps) {
  const { competencyPlan } = dashboardData;
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {competencyPlan.title}
          </h3>
          <p className="text-sm text-gray-500">{competencyPlan.date}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {t("dashboard.allCategories")}
          </span>
          <span className="text-sm text-gray-500">{t("common.today")}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Chart Container */}
        <div className="flex-1">
          <div className="relative w-64 h-64 mx-auto">
            {/* SVG Doughnut Chart */}
            <svg width="256" height="256" className="transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="100"
                fill="transparent"
                stroke="#f3f4f6"
                strokeWidth="24"
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
                    key={category.name}
                    cx="128"
                    cy="128"
                    r="100"
                    fill="transparent"
                    stroke={category.color}
                    strokeWidth="24"
                    strokeDasharray={`${strokeDasharray} ${circumference}`}
                    strokeDashoffset={-offset}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{
                      strokeDasharray: `${strokeDasharray} ${circumference}`,
                    }}
                    transition={{ delay: index * 0.2, duration: 1 }}
                  />
                );
              })}
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-gray-600">
                {t("dashboard.allCategories")}
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {competencyPlan.categories.map((category) => (
            <div key={category.name} className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-gray-700 min-w-0 flex-1">
                {category.name}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {category.percentage}%
              </span>
              <span
                className={cn(
                  "text-xs",
                  category.trend === "up" ? "text-green-600" : "text-red-600"
                )}
              >
                {category.trend === "up" ? "↑" : "↓"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
