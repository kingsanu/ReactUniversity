"use client";

import React from "react";
import { InsightData } from "@/services/benchmarkService";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MarketInsightsProps {
  data?: InsightData[];
  isLoading: boolean;
}

export default function MarketInsights({ data, isLoading }: MarketInsightsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white rounded-xl border border-slate-100 shadow-sm animate-pulse" />
        ))}
      </div>
    );
  }

  const getTheme = (trend: "up" | "down" | "neutral", index: number) => {
     // Cycling colors for visual variety if neutral, otherwise semantic
     const colors = [
       { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", icon: "text-blue-500" },
       { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100", icon: "text-violet-500" },
       { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", icon: "text-amber-500" },
       { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", icon: "text-emerald-500" },
     ];

     if (trend === 'up') return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", icon: "text-emerald-500" };
     if (trend === 'down') return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100", icon: "text-rose-500" };
     
     return colors[index % colors.length];
  };

  const getIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up": return <ArrowUpRight className="h-5 w-5" />;
      case "down": return <ArrowDownRight className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data?.map((item, index) => {
        const theme = getTheme(item.trend, index);
        return (
          <Card 
            key={index} 
            className={`border shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden relative`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-slate-50 opacity-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            
            <CardContent className="p-5 relative">
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${theme.bg} ${theme.icon} bg-opacity-80 backdrop-blur-sm`}>
                  {getIcon(item.trend)}
                </div>
                {item.trend !== 'neutral' && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${theme.bg} ${theme.text}`}>
                    {item.trend === 'up' ? 'Rising' : 'Falling'}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                 <p className="text-sm font-medium text-slate-500">{item.label}</p>
                 <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{item.value}</h4>
              </div>
              
              <div className="mt-3 pt-3 border-t border-slate-50">
                <p className="text-xs text-slate-400 line-clamp-1 group-hover:line-clamp-none transition-all">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
