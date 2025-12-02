"use client";

import React from "react";
import { SlidersHorizontal, Globe2, DollarSign, GraduationCap, Filter, X } from "lucide-react";
import { UniversityFiltersProps, DegreeLevel, FieldOfStudy } from "@/types/university";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Using a simple range slider input instead of shadcn Slider for now
import { Switch } from "@/components/ui/switch";
import { useGlobalStore } from "@/store/useGlobalStore";

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:bg-muted",
      )}
    >
      {label}
      {active && <X className="ml-1 h-3 w-3" />}
    </button>
  );
}

export function UniversityFilters({ filters, onFiltersChange, filterOptions, isLoading }: UniversityFiltersProps) {
  const { language } = useGlobalStore();
  const [search, setSearch] = React.useState(filters.search ?? "");

  React.useEffect(() => {
    const t = setTimeout(() => {
      onFiltersChange({ ...filters, search: search || undefined });
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const toggleDegree = (degree: DegreeLevel) => {
    const current = new Set(filters.degrees ?? []);
    current.has(degree) ? current.delete(degree) : current.add(degree);
    const next = Array.from(current);
    onFiltersChange({ ...filters, degrees: next.length ? next : undefined });
  };

  const toggleField = (field: FieldOfStudy) => {
    const current = new Set(filters.fields ?? []);
    current.has(field) ? current.delete(field) : current.add(field);
    const next = Array.from(current);
    onFiltersChange({ ...filters, fields: next.length ? next : undefined });
  };

  const tuitionMin = filters.tuitionMin ?? filterOptions?.tuitionRange.min ?? 0;
  const tuitionMax = filters.tuitionMax ?? filterOptions?.tuitionRange.max ?? 80000;

  const handleTuitionChange = (value: number, type: "min" | "max") => {
    const clamped = Math.min(
      Math.max(value, filterOptions?.tuitionRange.min ?? 0),
      filterOptions?.tuitionRange.max ?? 80000,
    );
    const nextMin = type === "min" ? clamped : tuitionMin;
    const nextMax = type === "max" ? clamped : tuitionMax;
    onFiltersChange({ ...filters, tuitionMin: nextMin, tuitionMax: Math.max(nextMin, nextMax) });
  };

  const resetAll = () => {
    setSearch("");
    onFiltersChange({});
  };

  const t = (en: string, es: string) => (language === "spanish" ? es : en);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">{t("Filters", "Filtros")}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-[11px] text-muted-foreground"
          onClick={resetAll}
        >
          <X className="mr-1 h-3 w-3" />
          {t("Clear", "Limpiar")}
        </Button>
      </div>

      {/* Search */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">
          {t("Search", "Buscar")}
        </label>
        <Input
          placeholder={t("Search by name, city, country", "Buscar por nombre, ciudad, país")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 text-xs"
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Globe2 className="h-3 w-3" />
          <span>{t("Location", "Ubicación")}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions?.countries.slice(0, 6).map((c) => (
            <Chip
              key={c.code}
              label={c.code}
              active={filters.countries?.includes(c.code) ?? false}
              onClick={() => {
                const current = new Set(filters.countries ?? []);
                current.has(c.code) ? current.delete(c.code) : current.add(c.code);
                const next = Array.from(current);
                onFiltersChange({ ...filters, countries: next.length ? next : undefined });
              }}
            />
          ))}
        </div>
      </div>

      {/* Degree levels */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <GraduationCap className="h-3 w-3" />
          <span>{t("Degree level", "Nivel de grado")}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["Associate", "Bachelor", "Master", "Doctorate"] as DegreeLevel[]).map((deg) => (
            <Chip
              key={deg}
              label={deg}
              active={filters.degrees?.includes(deg) ?? false}
              onClick={() => toggleDegree(deg)}
            />
          ))}
        </div>
      </div>

      {/* Fields of study */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {t("Field of study", "Área de estudio")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(filterOptions?.fields || []).slice(0, 8).map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              active={filters.fields?.includes(f.value) ?? false}
              onClick={() => toggleField(f.value as FieldOfStudy)}
            />
          ))}
        </div>
      </div>

      {/* Tuition slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>{t("Tuition per year", "Matrícula anual")}</span>
          </div>
          <span className="text-[11px]">
            ${tuitionMin.toLocaleString()} - ${tuitionMax.toLocaleString()} USD
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            className="h-8 w-24 text-xs"
            value={tuitionMin}
            onChange={(e) => handleTuitionChange(Number(e.target.value) || 0, "min")}
          />
          <span className="text-[11px] text-muted-foreground">-</span>
          <Input
            type="number"
            className="h-8 w-24 text-xs"
            value={tuitionMax}
            onChange={(e) => handleTuitionChange(Number(e.target.value) || 0, "max")}
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 rounded-lg border bg-card/40 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-xs font-medium">{t("Financial aid", "Ayuda financiera")}</p>
            <p className="text-[11px] text-muted-foreground">
              {t("Show universities with scholarships", "Solo con becas o apoyo")}
            </p>
          </div>
          <Switch
            checked={!!filters.hasFinancialAid}
            onCheckedChange={(val) => onFiltersChange({ ...filters, hasFinancialAid: val || undefined })}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-xs font-medium">{t("On-campus housing", "Residencias estudiantiles")}</p>
            <p className="text-[11px] text-muted-foreground">
              {t("Include only universities with housing", "Solo universidades con alojamiento")}
            </p>
          </div>
          <Switch
            checked={!!filters.hasHousing}
            onCheckedChange={(val) => onFiltersChange({ ...filters, hasHousing: val || undefined })}
          />
        </div>
      </div>
    </div>
  );
}

export default UniversityFilters;
