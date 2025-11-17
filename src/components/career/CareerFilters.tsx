"use client";

import React from "react";
import { useGlobalStore } from "@/store/useGlobalStore";

export function CareerFilters({
  industry,
  onIndustry,
}: {
  industry?: string;
  onIndustry: (i?: string) => void;
}) {
  const { language } = useGlobalStore();

  return (
    <div className="flex items-center space-x-3">
      <select
        className="rounded-md border px-3 py-2"
        value={industry}
        onChange={(e) => onIndustry(e.target.value || undefined)}
      >
        <option value="">All industries</option>
        <option value="Technology">Technology</option>
        <option value="Finance">Finance</option>
        <option value="Retail">Retail</option>
      </select>
    </div>
  );
}
