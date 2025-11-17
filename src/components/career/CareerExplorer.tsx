"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CareerCard from "./CareerCard";
import SkeletonCareerCard from "./SkeletonCareerCard";
import CareerCompareBar from "./CareerCompareBar";
import { useCareerList } from "@/hooks/useCareerQueries";
import { motion } from "motion/react";

export default function CareerExplorer() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState<string | undefined>(undefined);

  const { data, isLoading } = useCareerList({
    search: search || undefined,
    industry: industry || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {t("dashboard.careerExplorerTitle")}
        </h2>
        <div className="flex items-center space-x-3">
          <input
            aria-label="Search careers"
            placeholder={t("dashboard.careerExploreSearchPlaceholder")}
            className="rounded-md border px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-md border px-3 py-2"
            value={industry}
            onChange={(e) => setIndustry(e.target.value || undefined)}
          >
            <option value="">{t("careerExplorer.allIndustries")}</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
          </select>

          {/* TODO: Add multi-filters - interest, education, location */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCareerCard key={i} />
            ))}
          </>
        )}
        {!isLoading && (!data?.careers || data.careers.length === 0) && (
          <div className="col-span-3 text-sm text-gray-500">
            {t("career.noResults")}
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
