"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CareerCard from "./CareerCard";
import SkeletonCareerCard from "./SkeletonCareerCard";
import CareerCompareBar from "./CareerCompareBar";
import { CareerFilters } from "./CareerFilters";
import { useCareerList } from "@/hooks/useCareerQueries";
import { motion } from "motion/react";

export default function CareerExplorer() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<{
    search?: string;
    industry?: string;
    education?: string;
    sort?: string;
  }>({});

  const { data, isLoading } = useCareerList({
    search: filters.search,
    industry: filters.industry,
    education: filters.education,
    sort: filters.sort as any,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {t("dashboard.careerExplorerTitle")}
        </h2>
      </div>

      <CareerFilters filters={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCareerCard key={i} />
            ))}
          </>
        )}
        {!isLoading && (!data?.careers || data.careers.length === 0) && (
          <div className="col-span-3 text-center py-12 text-gray-500">
            {t("career.noResults", "No careers found matching your criteria.")}
          </div>
        )}
        {data?.careers?.map((career, i) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <CareerCard career={career} />
          </motion.div>
        ))}
      </div>

      <CareerCompareBar />
    </div>
  );
}
