"use client";

import React from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from "react-i18next";

export function CareerFilters({
  filters,
  onChange,
}: {
  filters: {
    search?: string;
    industry?: string;
    education?: string;
    sort?: string;
  };
  onChange: (newFilters: any) => void;
}) {
  const { language } = useGlobalStore();
  const { t } = useTranslation();

  const handleChange = (key: string, value: string) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-sm border mb-6">
      <div className="flex-1 w-full">
        <input
          type="text"
          placeholder={t("career.search_placeholder", "Search careers...")}
          className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={filters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
        <select
          className="rounded-md border px-3 py-2 bg-white"
          value={filters.industry || ""}
          onChange={(e) => handleChange("industry", e.target.value)}
        >
          <option value="">
            {t("career.all_industries", "All Industries")}
          </option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Retail">Retail</option>
          <option value="Healthcare">Healthcare</option>
        </select>

        <select
          className="rounded-md border px-3 py-2 bg-white"
          value={filters.education || ""}
          onChange={(e) => handleChange("education", e.target.value)}
        >
          <option value="">{t("career.all_education", "Any Education")}</option>
          <option value="HighSchool">High School</option>
          <option value="Associate">Associate</option>
          <option value="Bachelors">Bachelors</option>
          <option value="Masters">Masters</option>
          <option value="PhD">PhD</option>
        </select>

        <select
          className="rounded-md border px-3 py-2 bg-white"
          value={filters.sort || ""}
          onChange={(e) => handleChange("sort", e.target.value)}
        >
          <option value="">{t("career.sort_default", "Default Sort")}</option>
          <option value="recommended">
            {t("career.sort_recommended", "Recommended")}
          </option>
          <option value="match">{t("career.sort_match", "Match Score")}</option>
          <option value="title">{t("career.sort_title", "Name (A-Z)")}</option>
          <option value="demand">
            {t("career.sort_demand", "High Demand")}
          </option>
        </select>
      </div>
    </div>
  );
}
