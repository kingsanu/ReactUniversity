"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieData } from "@/services/benchmarkService";

interface WorkModeChartProps {
  data?: PieData[];
  isLoading: boolean;
}

export default function WorkModeChart({ data, isLoading }: WorkModeChartProps) {
  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-lg animate-pulse">
        <span className="text-slate-400 font-medium">Loading work modes...</span>
      </div>
    );
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
