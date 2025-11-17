"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseFilter, CourseSortOption } from "@/types/course";
import { useTranslation } from "react-i18next";
import { Search, Filter, X } from "lucide-react";
import Fuse from "fuse.js";
import { Course } from "@/types/course";

interface CourseFiltersProps {
  filters: CourseFilter;
  sortBy: CourseSortOption;
  onFiltersChange: (filters: CourseFilter) => void;
  onSortChange: (sort: CourseSortOption) => void;
  onClearFilters: () => void;
  availableFilters: {
    categories: string[];
    languages: string[];
    difficulties: string[];
    countries: string[];
    regions: string[];
    candidates?: Course[];
  };
  searchCandidates?: Course[];
}

export function CourseFilters({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  onClearFilters,
  availableFilters,
  searchCandidates,
}: CourseFiltersProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });

    // fuzzy suggestions
    if (searchCandidates && value.trim().length > 1) {
      const fuse = new Fuse(searchCandidates, {
        keys: ["title", "shortDescription", "provider"],
        threshold: 0.35,
      });

      const results = fuse
        .search(value)
        .slice(0, 5)
        .map((r) => r.item);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleCategoryChange = (value: string) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(value)
      ? currentCategories.filter((c) => c !== value)
      : [...currentCategories, value];
    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleLanguageChange = (value: string) => {
    const currentLanguages = filters.language || [];
    const newLanguages = currentLanguages.includes(value)
      ? currentLanguages.filter((l) => l !== value)
      : [...currentLanguages, value];
    onFiltersChange({
      ...filters,
      language: newLanguages.length > 0 ? newLanguages : undefined,
    });
  };

  const handleDifficultyChange = (value: string) => {
    const currentDifficulties = filters.difficulty || [];
    const newDifficulties = currentDifficulties.includes(value as any)
      ? currentDifficulties.filter((d) => d !== value)
      : [...currentDifficulties, value as any];
    onFiltersChange({
      ...filters,
      difficulty: newDifficulties.length > 0 ? newDifficulties : undefined,
    });
  };

  const handleCountryChange = (value: string) => {
    const currentCountries = filters.country || [];
    const newCountries = currentCountries.includes(value)
      ? currentCountries.filter((c) => c !== value)
      : [...currentCountries, value];
    onFiltersChange({
      ...filters,
      country: newCountries.length > 0 ? newCountries : undefined,
    });
  };

  const handleRegionChange = (value: string) => {
    const currentRegions = filters.region || [];
    const newRegions = currentRegions.includes(value)
      ? currentRegions.filter((r) => r !== value)
      : [...currentRegions, value];
    onFiltersChange({
      ...filters,
      region: newRegions.length > 0 ? newRegions : undefined,
    });
  };

  const hasActiveFilters =
    filters.search ||
    (filters.category && filters.category.length > 0) ||
    (filters.language && filters.language.length > 0) ||
    (filters.difficulty && filters.difficulty.length > 0) ||
    (filters.country && filters.country.length > 0) ||
    (filters.region && filters.region.length > 0);

  return (
    <div className="bg-white rounded-lg  mb-6">
      {/* Search Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t("courses.searchCourses")}
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-12 bg-white shadow rounded z-20">
              {suggestions.map((s, i) => (
                <button
                  key={s.id}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                    i === selectedIndex ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    onFiltersChange({ ...filters, search: s.title });
                    setSuggestions([]);
                    setSelectedIndex(-1);
                  }}
                >
                  <div className="text-sm font-medium">{s.title}</div>
                  <div className="text-xs text-gray-500">{s.provider}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t("courses.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">
              {t("courses.sort.recommended")}
            </SelectItem>
            <SelectItem value="rating">{t("courses.sort.rating")}</SelectItem>
            <SelectItem value="enrollment">
              {t("courses.sort.enrollment")}
            </SelectItem>
            <SelectItem value="newest">{t("courses.sort.newest")}</SelectItem>
            <SelectItem value="duration">
              {t("courses.sort.duration")}
            </SelectItem>
            <SelectItem value="title">{t("courses.sort.title")}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          {t("courses.filters")}
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
              {(filters.category?.length || 0) +
                (filters.language?.length || 0) +
                (filters.difficulty?.length || 0) +
                (filters.country?.length || 0) +
                (filters.region?.length || 0)}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            {t("courses.clearFilters")}
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("courses.category")}
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableFilters.categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category?.includes(category) || false}
                      onChange={() => handleCategoryChange(category)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("courses.language")}
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableFilters.languages.map((language) => (
                  <label key={language} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.language?.includes(language) || false}
                      onChange={() => handleLanguageChange(language)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {language}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("courses.difficulty.label")}
              </label>
              <div className="space-y-2">
                {availableFilters.difficulties.map((difficulty) => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        filters.difficulty?.includes(difficulty as any) || false
                      }
                      onChange={() => handleDifficultyChange(difficulty)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t(`courses.difficulty.${difficulty.toLowerCase()}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("courses.country")}
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableFilters.countries.map((country) => (
                  <label key={country} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.country?.includes(country) || false}
                      onChange={() => handleCountryChange(country)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {country}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("courses.region")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {availableFilters.regions.map((region) => (
                  <label key={region} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.region?.includes(region) || false}
                      onChange={() => handleRegionChange(region)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{region}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
