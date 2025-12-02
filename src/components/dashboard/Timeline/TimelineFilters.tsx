"use client";

import React from "react";
import { X, Filter, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type {
  TimelineFilters as TimelineFiltersType,
  TimelineFiltersProps,
  AssessmentType,
  TimelineEventStatus,
} from "@/types/timeline";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useGlobalStore } from "@/store/useGlobalStore";

/**
 * Assessment type options
 */
const assessmentTypes: {
  value: AssessmentType;
  label: { en: string; sp: string };
  color: string;
}[] = [
  {
    value: "pca",
    label: { en: "PCA", sp: "PCA" },
    color: "bg-violet-100 text-violet-700 border-violet-300",
  },
  {
    value: "mil",
    label: { en: "LIA", sp: "LIA" },
    color: "bg-cyan-100 text-cyan-700 border-cyan-300",
  },
  {
    value: "evaluation",
    label: { en: "360°", sp: "360°" },
    color: "bg-orange-100 text-orange-700 border-orange-300",
  },
  {
    value: "course",
    label: { en: "Courses", sp: "Cursos" },
    color: "bg-teal-100 text-teal-700 border-teal-300",
  },
];

/**
 * Status options
 */
const statusOptions: {
  value: TimelineEventStatus;
  label: { en: string; sp: string };
  color: string;
}[] = [
  {
    value: "completed",
    label: { en: "Completed", sp: "Completado" },
    color: "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
  {
    value: "in_progress",
    label: { en: "In Progress", sp: "En Progreso" },
    color: "bg-blue-100 text-blue-700 border-blue-300",
  },
  {
    value: "not_started",
    label: { en: "Not Started", sp: "No Iniciado" },
    color: "bg-gray-100 text-gray-700 border-gray-300",
  },
];

/**
 * Filter chip component
 */
interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  color?: string;
}

function FilterChip({ label, isActive, onClick, color }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
        isActive
          ? color || "bg-primary text-primary-foreground border-primary"
          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      )}
    >
      {label}
      {isActive && <X className="h-3 w-3" />}
    </button>
  );
}

/**
 * Timeline Filters Component
 */
export function TimelineFilters({
  filters,
  onFiltersChange,
}: TimelineFiltersProps) {
  const { language } = useGlobalStore();
  const langKey = language === "spanish" ? "sp" : "en";
  const locale = language === "spanish" ? es : enUS;

  const [searchValue, setSearchValue] = React.useState(filters.search || "");
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    filters.dateRange?.startDate
      ? new Date(filters.dateRange.startDate)
      : undefined
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    filters.dateRange?.endDate ? new Date(filters.dateRange.endDate) : undefined
  );

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchValue || undefined });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Toggle assessment type
  const toggleType = (type: AssessmentType) => {
    const currentTypes = filters.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    onFiltersChange({
      ...filters,
      types: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  // Toggle status
  const toggleStatus = (status: TimelineEventStatus) => {
    const currentStatus = filters.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter((s) => s !== status)
      : [...currentStatus, status];
    onFiltersChange({
      ...filters,
      status: newStatus.length > 0 ? newStatus : undefined,
    });
  };

  // Update date range
  const updateDateRange = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
    onFiltersChange({
      ...filters,
      dateRange:
        start || end
          ? {
              startDate: start?.toISOString(),
              endDate: end?.toISOString(),
            }
          : undefined,
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchValue("");
    setStartDate(undefined);
    setEndDate(undefined);
    onFiltersChange({});
  };

  // Check if any filters are active
  const hasActiveFilters =
    (filters.types && filters.types.length > 0) ||
    (filters.status && filters.status.length > 0) ||
    filters.dateRange?.startDate ||
    filters.dateRange?.endDate ||
    filters.search;

  return (
    <div className="space-y-4">
      {/* Search and Date Range Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={
              language === "spanish" ? "Buscar eventos..." : "Search events..."
            }
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-start gap-2"
            >
              <Calendar className="h-4 w-4" />
              {startDate || endDate ? (
                <span className="text-sm">
                  {startDate ? format(startDate, "MMM d", { locale }) : "..."} -{" "}
                  {endDate ? format(endDate, "MMM d", { locale }) : "..."}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {language === "spanish" ? "Rango de fechas" : "Date range"}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="flex flex-col sm:flex-row">
              <div className="p-3 border-b sm:border-b-0 sm:border-r">
                <p className="text-sm font-medium mb-2 text-center">
                  {language === "spanish" ? "Desde" : "From"}
                </p>
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => updateDateRange(date, endDate)}
                  locale={locale}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium mb-2 text-center">
                  {language === "spanish" ? "Hasta" : "To"}
                </p>
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => updateDateRange(startDate, date)}
                  locale={locale}
                  disabled={(date) => (startDate ? date < startDate : false)}
                />
              </div>
            </div>
            {(startDate || endDate) && (
              <div className="p-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => updateDateRange(undefined, undefined)}
                >
                  {language === "spanish" ? "Limpiar fechas" : "Clear dates"}
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Assessment Type Filters */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {language === "spanish" ? "Tipo de Evaluación" : "Assessment Type"}
        </p>
        <div className="flex flex-wrap gap-2">
          {assessmentTypes.map((type) => (
            <FilterChip
              key={type.value}
              label={type.label[langKey]}
              isActive={filters.types?.includes(type.value) || false}
              onClick={() => toggleType(type.value)}
              color={
                filters.types?.includes(type.value) ? type.color : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {language === "spanish" ? "Estado" : "Status"}
        </p>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <FilterChip
              key={status.value}
              label={status.label[langKey]}
              isActive={filters.status?.includes(status.value) || false}
              onClick={() => toggleStatus(status.value)}
              color={
                filters.status?.includes(status.value)
                  ? status.color
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            {language === "spanish" ? "Limpiar filtros" : "Clear all filters"}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Compact filter bar for mobile/smaller screens
 */
export function TimelineFiltersCompact({
  filters,
  onFiltersChange,
}: TimelineFiltersProps) {
  const { language } = useGlobalStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const activeFilterCount =
    (filters.types?.length || 0) +
    (filters.status?.length || 0) +
    (filters.dateRange?.startDate ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Compact Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          {language === "spanish" ? "Filtros" : "Filters"}
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Quick search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={language === "spanish" ? "Buscar..." : "Search..."}
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                search: e.target.value || undefined,
              })
            }
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {isOpen && (
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-900">
          <TimelineFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
          />
        </div>
      )}
    </div>
  );
}

export default TimelineFilters;
