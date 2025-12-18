import { motion } from "motion/react";
import { dashboardData } from "./data";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface BenchmarksProps {
  className?: string;
}

export function Benchmarks({ className }: BenchmarksProps) {
  const { t } = useTranslation();
  const { benchmarks } = dashboardData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-6",
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("dashboard.benchmarks.common.title")}
        </h3>
        <span className="text-sm text-gray-500">
          {t("dashboard.benchmarks.common.today")}
        </span>
      </div>

      <div className="space-y-4">
        {/* Current Value */}
        <div>
          <div className="text-3xl font-bold text-gray-900">
            ${" "}
            {benchmarks.currentValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span
              className={cn(
                "text-sm font-medium",
                benchmarks.change >= 0 ? "text-green-600" : "text-red-600"
              )}
            >
              {benchmarks.change >= 0 ? "↑" : "↓"} {Math.abs(benchmarks.change)}
              %
            </span>
            <span className="text-sm text-gray-500">
              {t("dashboard.benchmarks.common.comparedToYesterday", {
                amount: benchmarks.comparison.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                }),
              })}
            </span>
          </div>
        </div>

        {/* Last Week Income */}
        <div>
          <div className="text-sm text-gray-600">
            {t("dashboard.benchmarks.common.lastWeekIncome")}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            $
            {benchmarks.lastWeekIncome.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
