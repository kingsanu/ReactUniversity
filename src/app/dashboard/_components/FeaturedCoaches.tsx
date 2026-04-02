"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ArrowRight, MapPin, Sparkle } from "@phosphor-icons/react";
import Link from "next/link";
import { getCoaches } from "@/services/coachService";
import { Coach } from "@/types/coach";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { PremiumCard } from "./PremiumCard";

export function FeaturedCoaches() {
  const { t } = useTranslation();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await getCoaches({ limit: 3 });
        // @ts-expect-error - API response structure mismatch fix
        setCoaches(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch featured coaches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  if (isLoading) {
    return (
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        role="status"
        aria-busy="true"
      >
        {[1, 2, 3].map((i) => (
          <PremiumCard key={i} innerClassName="h-[320px] animate-pulse flex flex-col">
            <div />
          </PremiumCard>
        ))}
      </div>
    );
  }

  if (coaches.length === 0) return null;

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-white/60 backdrop-blur-md text-slate-900 rounded-xl border border-slate-200/50 shadow-sm" aria-hidden="true">
              <Sparkle weight="fill" className="h-5 w-5" />
            </div>
            {t("coaching.featuredCoaches")}
          </h2>
          <p className="text-slate-500 text-sm ml-[3.25rem] mt-1">
            {t("coaching.featuredDescription")}
          </p>
        </div>
        <Link 
          href="/dashboard/book-coach"
          className="group flex items-center justify-between px-5 py-2.5 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] bg-transparent backdrop-blur-md text-slate-900 hover:bg-white/40 backdrop-blur-md border border-slate-200 shadow-sm"
        >
          <span className="tracking-tight text-sm mr-4">{t("coaching.viewAllCoaches")}</span>
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/60 backdrop-blur-md group-hover:bg-white/30 shadow-inner transition-colors duration-500">
             <ArrowRight weight="bold" className="w-3 h-3 text-slate-900 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coaches.map((coach, index) => (
          <motion.div
            key={coach.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="h-full"
          >
            <PremiumCard innerClassName="p-8 flex flex-col justify-between h-full group/card transition-colors duration-500 hover:border-slate-300/80">
              
              {/* Header Info */}
              <div className="flex items-start justify-between relative">
                 <div className="space-y-1 z-10 pr-4">
                    <h3 className="font-serif font-bold text-2xl text-slate-900 leading-tight group-hover/card:text-slate-700 transition-colors">
                      {coach.name}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
                      {coach.title || "Coach"}
                    </p>
                 </div>
                 
                 {/* Compact Avatar */}
                 <div className="relative shrink-0 text-right z-20 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/card:-translate-y-1 group-hover/card:scale-105">
                   {/* Background Glow */}
                   <div className="absolute -inset-2 bg-white/30 shadow-inner opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-xl rounded-full" />
                   
                   <Avatar className="h-16 w-16 shadow-xl ring-2 ring-white border border-slate-100 bg-transparent backdrop-blur-md relative">
                      {((coach.image?.length ?? 0) > 5) ? (
                        <AvatarImage src={coach.image} className="object-cover" alt={coach.name} />
                      ) : null}
                      <AvatarFallback className="bg-slate-900 text-white font-serif text-xl font-bold tracking-tight">
                         {coach.name.charAt(0)}
                      </AvatarFallback>
                   </Avatar>
                   
                   <div className="absolute -bottom-1 -right-1 bg-emerald-500 h-4 w-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                   </div>
                 </div>
              </div>

              {/* Middle Content - Tags & Rating */}
              <div className="mt-10 flex flex-col gap-5 flex-grow">
                {/* Meta Row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/40 backdrop-blur-md border border-slate-100/50 text-slate-700 rounded-full font-mono text-xs font-bold">
                     <Star weight="fill" className="h-3 w-3 text-amber-400" />
                     {coach.rating || "5.0"}
                  </div>
                  {coach.hourlyRate && (
                     <div className="text-base font-bold text-slate-900 font-mono tracking-tighter">
                       <span className="text-[10px] text-slate-400 font-bold uppercase font-sans tracking-widest mr-1.5 opacity-80">Rate</span>
                       ${coach.hourlyRate}<span className="text-xs text-slate-400 font-sans tracking-normal font-medium">/hr</span>
                     </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {coach.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-2.5 py-1 border border-slate-200/60 bg-transparent backdrop-blur-md shadow-[0_2px_4px_rgba(0,0,0,0.01)] rounded-md">
                        {tag}
                      </span>
                    ))}
                </div>
              </div>

              {/* Action / Footer */}
              <div className="mt-10 pt-5 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate max-w-[60%]">
                   <MapPin weight="bold" className="h-3.5 w-3.5 opacity-60 shrink-0" />
                   <span className="truncate">{coach.location || "Remote Default"}</span>
                 </div>

                 <Link 
                   href={`/dashboard/book-coach/${coach.id}`} 
                   className="group/btn flex items-center justify-center w-11 h-11 rounded-full bg-slate-900 text-white shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-105 active:scale-95"
                 >
                    <ArrowRight weight="bold" className="w-4 h-4 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:-rotate-45" />
                 </Link>
              </div>
            </PremiumCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
