import { motion } from "framer-motion";
import { dashboardData } from "./data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PremiumCard } from "./PremiumCard";

interface ActionCardsProps {
  className?: string;
  data?: any[];
}

export function ActionCards({ className, data }: ActionCardsProps) {
  const defaultActionCards = dashboardData.actionCards;
  const cardsToRender = data && data.length > 0
    ? data.map((d, i) => ({
        id: i + 1,
        title: d.title || d.Title,
        subtitle: d.description || d.Description,
        action: d.urgency || d.Urgency || "Start",
        link: "#",
        variant: "primary",
        icon: "⚡",
        badge: undefined
      }))
    : defaultActionCards;
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-full auto-rows-fr w-full",
        className
      )}
      aria-label={t("dashboard.learningTools")}
    >
      {cardsToRender.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PremiumCard innerClassName="p-8 pb-8 flex flex-col flex-grow relative overflow-hidden group/card bg-transparent">
              {/* Badge */}
              {card.badge && (
                <div className="absolute top-4 right-4">
                  <span
                    className={cn(
                      "text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest",
                      card.id === 1 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                    )}
                  >
                    {t(card.badge)}
                  </span>
                </div>
              )}
              {/* Icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/60",
                  card.id === 1 ? "bg-emerald-50/50 text-emerald-600 backdrop-blur-md" : "bg-indigo-50/50 text-indigo-600 backdrop-blur-md"
                )}
                aria-hidden="true"
              >
                <span className="text-2xl drop-shadow-sm">{card.icon}</span>
              </div>
              {/* Content */}
              <div className="mb-10 flex-grow relative z-10">
                <h3 className="font-serif font-semibold text-xl text-slate-900 mb-2 tracking-tight">
                  {t(card.title)}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-[90%] font-medium">{t(card.subtitle)}</p>
              </div>
              {/* Action Button - Island Architecture */}
              <Link
                href={card.link}
                className={cn(
                  "group mt-auto w-full flex items-center justify-between px-6 py-3.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] shadow-sm backdrop-blur-md",
                  card.variant === "primary" ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-black/5" : "bg-white/40 text-slate-900 hover:bg-white/60 border border-white/60"
                )}
              >
                <span className="tracking-tight uppercase text-[11px] font-bold ml-1">{t(card.action)}</span>
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-500 translate-x-3 group-hover:translate-x-0 relative right-3 shadow-sm",
                  card.variant === "primary" ? "bg-white/10 group-hover:bg-white/20" : "bg-white group-hover:bg-blue-50"
                )}>
                  <ArrowUpRight 
                    weight="bold" 
                    className={cn(
                      "w-4 h-4 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                      card.variant === "primary" ? "text-white" : "text-slate-900"
                    )} 
                  />
                </div>
              </Link>
          </PremiumCard>
        </motion.div>
      ))}
    </section>
  );
}

