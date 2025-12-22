import { motion } from "motion/react";
import { dashboardData } from "./data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface ActionCardsProps {
  className?: string;
}

export function ActionCards({ className }: ActionCardsProps) {
  const { actionCards } = dashboardData;
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
      aria-label={t("dashboard.learningTools")}
    >
      {actionCards.map((card, index) => (
        <motion.article
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-4 relative"
        >
          {/* Badge */}
          {card.badge && (
            <div className="absolute -top-2 -right-2">
              <span
                className={cn(
                  "text-white text-xs px-2 py-1 rounded-full font-medium",
                  card.id === 1 ? "bg-green-600" : "bg-purple-600"
                )}
              >
                {t(card.badge)}
              </span>
            </div>
          )}
          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
              card.id === 1 ? "bg-blue-100" : "bg-gray-100"
            )}
            aria-hidden="true"
          >
            <span className="text-2xl">{card.icon}</span>
          </div>
          {/* Content */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-1">
              {t(card.title)}
            </h3>
            <p className="text-sm text-gray-500">{t(card.subtitle)}</p>
          </div>
          {/* Action Button - styled Link instead of nested button */}
          <Link
            href={card.link}
            className={cn(
              "block w-full py-2 px-3 rounded-md text-sm font-medium text-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
              card.variant === "primary"
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500"
            )}
          >
            {t(card.action)}
          </Link>
        </motion.article>
      ))}
    </section>
  );
}

