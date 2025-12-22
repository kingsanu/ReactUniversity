import { motion } from "motion/react";
import { dashboardData } from "./data";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface CareerMatchesProps {
  className?: string;
}

export function CareerMatches({ className }: CareerMatchesProps) {
  const { careerMatches } = dashboardData;
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-6",
        className
      )}
      aria-labelledby="career-matches-heading"
    >
      <h2 id="career-matches-heading" className="text-lg font-semibold text-gray-900 mb-6">
        {t("dashboard.top3CareerMatch")}
      </h2>

      <ul className="space-y-4" role="list">
        {careerMatches.map((match, index) => (
          <motion.li
            key={match.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {/* Company Icon */}
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
                aria-hidden="true"
              >
                <span className="text-white font-bold text-sm">
                  {match.company.charAt(0)}
                </span>
              </div>

              {/* Job Info */}
              <div>
                <h3 className="font-medium text-gray-900 text-sm">
                  {match.title}
                </h3>
                <p className="text-xs text-gray-500">{match.company}</p>
              </div>
            </div>

            {/* Progress and Action */}
            <div className="flex items-center space-x-3">
              {/* Progress Circle */}
              <div 
                className="relative w-10 h-10"
                role="img"
                aria-label={`${match.progress}% match`}
              >
                <svg className="w-10 h-10 transform -rotate-90" aria-hidden="true">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="transparent"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 16 * (1 - match.progress / 100)
                    }`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 16 * (1 - match.progress / 100),
                    }}
                    transition={{ delay: index * 0.2, duration: 1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <span className="text-xs font-medium text-gray-700">
                    {match.progress}%
                  </span>
                </div>
              </div>

              {/* Arrow Button */}
              <button 
                type="button"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`View ${match.title} at ${match.company}`}
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </motion.li>
        ))}
      </ul>

      <button 
        type="button"
        className="w-full text-sm text-blue-600 hover:text-blue-700 mt-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
      >
        {t("dashboard.showMore")}
      </button>
    </motion.section>
  );
}

