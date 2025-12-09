"use client";

import React from "react";
import { IndexData } from "@/services/benchmarkService";
import { DollarSign, Home, ShoppingBag } from "lucide-react";

interface CostOfLivingProps {
  data?: IndexData;
  isLoading: boolean;
}

export default function CostOfLiving({ data, isLoading }: CostOfLivingProps) {
  if (isLoading || !data) {
    return (
       <div className="h-[200px] w-full bg-slate-50 rounded-lg animate-pulse" />
    );
  }

  const getColor = (val: number) => {
    if (val < 40) return "text-emerald-500";
    if (val < 70) return "text-amber-500";
    return "text-rose-500";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-md shadow-sm">
             <DollarSign className="h-5 w-5 text-slate-500"/>
          </div>
          <span className="text-sm font-medium text-slate-600">Cost of Living Index</span>
        </div>
        <span className={`text-xl font-bold ${getColor(data.costOfLiving)}`}>
          {data.costOfLiving.toFixed(1)}
        </span>
      </div>

       <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-md shadow-sm">
             <Home className="h-5 w-5 text-slate-500"/>
          </div>
          <span className="text-sm font-medium text-slate-600">Rent Index</span>
        </div>
        <span className={`text-xl font-bold ${getColor(data.rentIndex)}`}>
          {data.rentIndex.toFixed(1)}
        </span>
      </div>

       <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-md shadow-sm">
             <ShoppingBag className="h-5 w-5 text-slate-500"/>
          </div>
          <span className="text-sm font-medium text-slate-600">Purchasing Power</span>
        </div>
        <span className={`text-xl font-bold ${getColor(100 - data.purchasingPower)}`}>
          {data.purchasingPower.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
