"use client";

import React from "react";
import { motion } from "motion/react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useUniversityList, useUniversityRecommendations, useUniversityStats, useUniversityFiltersOptions } from "@/hooks/useUniversityQueries";
import { University, UniversityFilters } from "@/types/university";
import UniversityCard from "@/components/dashboard/University/UniversityCard";
import UniversityFiltersPanel from "@/components/dashboard/University/UniversityFilters";
import UniversityDetailsModal from "@/components/dashboard/University/UniversityDetailsModal";
import UniversityStats from "@/components/dashboard/University/UniversityStats";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Grid3X3, List, Compass, Star } from "lucide-react";
import Link from "next/link";

export default function UniversityPage() {
  const { user, language } = useGlobalStore();
  const userId = user?.id ?? "mock-user";
  const [filters, setFilters] = React.useState<UniversityFilters>({});
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedUniversity, setSelectedUniversity] = React.useState<University | null>(null);
  const [activeTab, setActiveTab] = React.useState("recommended");

  const listQuery = useUniversityList(filters, 1, 20);
  const recoQuery = useUniversityRecommendations(userId);
  const statsQuery = useUniversityStats(userId);
  const filterOptionsQuery = useUniversityFiltersOptions();

  const t = (en: string, es: string) => (language === "spanish" ? es : en);

  const universities = (activeTab === "recommended" && recoQuery.data
    ? recoQuery.data.recommendations.map((r) => r.university)
    : listQuery.data?.universities) as University[] | undefined;

  const recommendationMap = new Map(
    recoQuery.data?.recommendations.map((r) => [r.university.id, r]) ?? [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-1">
                {t("Personalized guidance", "Guía personalizada")}
              </p>
              <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                {t("University Suggestions", "Sugerencias de Universidades")}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-300">
                {t(
                  "Discover universities that match your profile, assessments, and career goals.",
                  "Descubre universidades que encajan con tu perfil, evaluaciones y metas profesionales.",
                )}
              </p>
            </div>
            <Link href="/dashboard" className="hidden sm:inline-flex text-xs text-slate-400 hover:text-primary">
              {t("Back to dashboard", "Volver al panel")}
            </Link>
          </div>

          <UniversityStats stats={statsQuery.data} isLoading={statsQuery.isLoading} />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          {/* Filters */}
          <motion.aside initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-slate-800 bg-slate-950/60 backdrop-blur">
              <CardContent className="p-4">
                <UniversityFiltersPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  filterOptions={filterOptionsQuery.data}
                  isLoading={filterOptionsQuery.isLoading}
                />
              </CardContent>
            </Card>
          </motion.aside>

          {/* Main content */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="border-slate-800 bg-slate-950/60 backdrop-blur">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-3">
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v)}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="bg-slate-900/70">
                    <TabsTrigger value="recommended" className="flex items-center gap-1 text-xs">
                      <Compass className="h-3 w-3" />
                      {t("Recommended", "Recomendadas")}
                    </TabsTrigger>
                    <TabsTrigger value="all" className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3" />
                      {t("All universities", "Todas las universidades")}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 border-slate-700 bg-slate-900 text-slate-100"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 border-slate-700 bg-slate-900 text-slate-100"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} className="space-y-4">
              <TabsContent value="recommended" className="space-y-4">
                {recoQuery.isLoading && (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="h-64 animate-pulse border-slate-800 bg-slate-900/60" />
                    ))}
                  </div>
                )}

                {recoQuery.error && (
                  <Card className="border-red-500/40 bg-red-950/40">
                    <CardContent className="p-4 text-sm text-red-100">
                      {t("Unable to load recommendations.", "No se pudieron cargar las recomendaciones.")}
                    </CardContent>
                  </Card>
                )}

                {!recoQuery.isLoading && universities && universities.length > 0 && (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                        : "space-y-3"
                    }
                  >
                    {universities.map((u) => {
                      const rec = recommendationMap.get(u.id);
                      return (
                        <UniversityCard
                          key={u.id}
                          university={u}
                          matchScore={rec?.matchScore}
                          matchReasons={rec?.matchReasonsArray?.[
                            language === "spanish" ? "es" : "en"
                          ]}
                          onViewDetails={setSelectedUniversity}
                        />
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {listQuery.isLoading && (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="h-64 animate-pulse border-slate-800 bg-slate-900/60" />
                    ))}
                  </div>
                )}
                {!listQuery.isLoading && !listQuery.data?.universities.length && (
                  <Card className="border-slate-800 bg-slate-900/60">
                    <CardContent className="p-6 text-center text-sm text-slate-300">
                      {t(
                        "No universities found with the current filters.",
                        "No se encontraron universidades con los filtros actuales.",
                      )}
                    </CardContent>
                  </Card>
                )}
                {!listQuery.isLoading && listQuery.data?.universities.length && (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                        : "space-y-3"
                    }
                  >
                    {listQuery.data.universities.map((u) => (
                      <UniversityCard
                        key={u.id}
                        university={u}
                        onViewDetails={setSelectedUniversity}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.section>
        </div>

        <UniversityDetailsModal
          university={selectedUniversity}
          isOpen={!!selectedUniversity}
          onClose={() => setSelectedUniversity(null)}
          matchScore={
            selectedUniversity ? recommendationMap.get(selectedUniversity.id)?.matchScore : undefined
          }
          matchBreakdown={
            selectedUniversity
              ? recommendationMap.get(selectedUniversity.id)?.matchBreakdown
              : undefined
          }
          matchReasons={
            selectedUniversity
              ? recommendationMap.get(selectedUniversity.id)?.matchReasonsArray?.[
                  language === "spanish" ? "es" : "en"
                ]
              : undefined
          }
          recommendedPrograms={
            selectedUniversity
              ? recommendationMap.get(selectedUniversity.id)?.recommendedPrograms
              : undefined
          }
        />
      </div>
    </div>
  );
}
