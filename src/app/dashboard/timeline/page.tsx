"use client";

import React from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { History, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTimeline } from "@/hooks/useTimelineQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TimelineView,
  TimelineFilters,
  TimelineExport,
  TimelineStats,
} from "@/components/dashboard/Timeline";

export default function TimelinePage() {
  const { user, language } = useGlobalStore();
  const { t } = useTranslation();

  const {
    // Filter state
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    // Events data
    events,
    summary,
    isLoading,
    isError,
    error,
    refetch,
    // Stats data
    stats,
    isStatsLoading,
    // Export
    exportData,
    isExporting,
  } = useTimeline(user?.id || "");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                {t("nav.dashboard")}
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">
                  {language === "spanish" ? "Línea de Tiempo" : "Timeline"}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {language === "spanish"
                    ? "Línea de Tiempo de Progreso"
                    : "Progress Timeline"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {language === "spanish"
                    ? "Rastrea todas tus evaluaciones y progreso en un solo lugar"
                    : "Track all your assessments and progress in one place"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                {language === "spanish" ? "Actualizar" : "Refresh"}
              </Button>
              <TimelineExport
                events={events}
                filters={filters}
                onExport={exportData}
                isExporting={isExporting}
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <TimelineStats stats={stats} isLoading={isStatsLoading} />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  {language === "spanish" ? "Filtros" : "Filters"}
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-xs"
                    >
                      {language === "spanish" ? "Limpiar" : "Clear"}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <TimelineFilters
                  filters={filters}
                  onFiltersChange={updateFilters}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Card>
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {language === "spanish" ? "Eventos" : "Events"}
                    {summary && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({summary.totalEvents}{" "}
                        {language === "spanish" ? "total" : "total"})
                      </span>
                    )}
                  </CardTitle>
                  {/* Summary badges */}
                  {summary && (
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {summary.byStatus.completed}{" "}
                        {language === "spanish" ? "completados" : "completed"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {summary.byStatus.in_progress}{" "}
                        {language === "spanish" ? "en progreso" : "in progress"}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isError ? (
                  <div className="text-center py-12">
                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="h-6 w-6 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {language === "spanish"
                        ? "Error al cargar la línea de tiempo"
                        : "Error loading timeline"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {error?.message ||
                        (language === "spanish"
                          ? "Por favor intenta de nuevo"
                          : "Please try again")}
                    </p>
                    <Button onClick={() => refetch()}>
                      {language === "spanish" ? "Reintentar" : "Try Again"}
                    </Button>
                  </div>
                ) : (
                  <TimelineView events={events} isLoading={isLoading} />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Back to Dashboard Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "spanish"
              ? "Volver al Dashboard"
              : "Back to Dashboard"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
