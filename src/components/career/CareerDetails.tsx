"use client";

import React from "react";
import { useCareerDetails } from "@/hooks/useCareerQueries";
import { useParams } from "next/navigation";
import { useGlobalStore } from "@/store/useGlobalStore";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import FavoriteButton from "./FavoriteButton";
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Target,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CareerDetails() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id ?? "";
  const { data } = useCareerDetails(id);
  const { language } = useGlobalStore();
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = !!favorites.find((f) => f === id);

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading career details...</p>
        </div>
      </div>
    );

  const c = data as any;
  const title = c.title[language === "spanish" ? "es" : "en"] || c.title.en;
  const matchScore = Math.round(c.matchScore ?? 0);

  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
                <p className="text-blue-100 text-lg">
                  {t("careerExplorer.jobSummary")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-blue-100 mb-1">Match Score</p>
                  <div className="text-3xl font-bold text-white">
                    {matchScore}%
                  </div>
                </div>
                <FavoriteButton
                  isFavorite={isFavorite}
                  onToggle={() => toggleFavorite(id)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {t("careerExplorer.jobSummary")}
                </h2>
              </div>
              <p className="text-slate-700 leading-relaxed text-base">
                {c.longDescription?.[language === "spanish" ? "es" : "en"]}
              </p>
            </motion.div>

            {/* Key Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {t("careerExplorer.keyResponsibilities")}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {((c.responsibilities || []) as any[]).map(
                  (r: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                      className="flex gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        {r[language === "spanish" ? "es" : "en"]}
                      </span>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>

            {/* Skills & Education */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {t("careerExplorer.skillsEducation")}
                </h3>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-semibold text-purple-900 mb-2">
                    Education Level
                  </p>
                  <p className="text-lg font-bold text-purple-700">
                    {c.educationLevel || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-4">
                    Required Skills
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {((c.skills || []) as any[]).map((s: any, idx: number) => (
                      <motion.div
                        key={s.skillId}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.05 * idx }}
                        className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors group"
                      >
                        <Zap className="w-4 h-4 text-purple-600 group-hover:text-purple-700" />
                        <span className="text-slate-700 font-medium">
                          {s.name[language === "spanish" ? "es" : "en"]}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {t("career.salaryRange")}
                </p>
              </div>
              <p className="text-3xl font-bold text-green-700">
                ${c.salaryRange?.median?.toLocaleString() || "N/A"}
              </p>
              <p className="text-xs text-green-600 mt-2">Median salary</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {t("career.laborDemand")}
                </p>
              </div>
              <p className="text-3xl font-bold text-blue-700">
                {c.demandStats?.jobCount?.toLocaleString() || "N/A"}
              </p>
              <p className="text-xs text-blue-600 mt-2">Active job postings</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {t("career.whyRecommended")}
                </p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {c.recommendedReasoning?.[language === "spanish" ? "es" : "en"]}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push("/careers/compare")}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                <Users className="w-5 h-5" />
                Compare Careers
              </button>
              <button
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
