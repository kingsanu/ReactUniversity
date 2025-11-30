"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CareerCard from "./CareerCard";
import SkeletonCareerCard from "./SkeletonCareerCard";
import CareerCompareBar from "./CareerCompareBar";
import { CareerFilters } from "./CareerFilters";
import { useCareerList } from "@/hooks/useCareerQueries";
import { motion } from "motion/react";
import { Compass, SearchX } from "lucide-react";

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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
              <Compass className="h-6 w-6 text-white" />
            </div>
            {t("dashboard.careerExplorerTitle", "Career Explorer")}
          </h2>
          <p className="text-gray-500 text-lg ml-[3.75rem] leading-relaxed">
            Explore career paths tailored to your unique profile. Filter by industry, education, and demand to find your perfect match.
          </p>
        </div>
      </div>

      <CareerFilters filters={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCareerCard key={i} />
            ))}
          </>
        )}
        {!isLoading && (!data?.careers || data.careers.length === 0) && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <SearchX className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No careers found</h3>
            <p className="text-gray-500 max-w-sm">
              {t("career.noResults", "We couldn't find any careers matching your current filters. Try adjusting your search criteria.")}
            </p>
          </div>
        )}
        {data?.careers?.map((career, i) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <CareerCard career={career} />
          </motion.div>
        ))}
      </div>

      <CareerCompareBar />
    </div>
  );
}
