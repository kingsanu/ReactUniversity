"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { SkillData } from "@/services/benchmarkService";

interface SkillsChartProps {
  data?: SkillData[];
  isLoading: boolean;
}

export default function SkillsChart({ data, isLoading }: SkillsChartProps) {
  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-lg animate-pulse">
        <span className="text-slate-400 font-medium">Loading skills...</span>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  return (
    <div className="h-[600px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 40,
            bottom: 5,
          }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis 
            dataKey="skill" 
            type="category" 
            width={100} 
            tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`${value}% demand`, " Popularity"]}
          />
          <Bar dataKey="popularity" radius={[0, 4, 4, 0]}>
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
