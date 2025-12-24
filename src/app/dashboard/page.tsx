"use client";

import dynamic from "next/dynamic";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from "react-i18next";
import { ActionCards } from "./_components/ActionCards";
import { CompetencyChart } from "./_components/CompetencyChart";
import { OpportunitiesTable } from "./_components/OpportunitiesTable";
import { Top3Careers } from "@/components/career/Top3Careers";
import { PCAResults } from "./_components/PCAResults";
import { MILResults } from "./_components/MILResults";
import { AssessmentProgressCard } from "@/components/dashboard/AssessmentProgressCard";
import { FeaturedCoaches } from "./_components/FeaturedCoaches";
import "@/utils/adminTestUtils";
import "@/utils/milTestUtils";
import "@/utils/debugUserRole";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useGlobalStore();

  // Check if user is a coach (case-insensitive)
  const isCoach = user.role && user.role.toLowerCase() === "coach";

  console.log("🔍 Dashboard - Current user:", user);
  console.log("🔍 Dashboard - User role:", user.role);
  console.log("🔍 Dashboard - Is coach:", isCoach);

  // If user is a coach, render the coach dashboard content
  if (isCoach) {
    const CoachDashboard = dynamic(
      () => import("@/components/dashboard/CoachDashboard"),
      { ssr: false }
    );
    return <CoachDashboard />;
  }

  // Otherwise, render the student dashboard content
  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-full">
      <h1 className="sr-only">{t("dashboard.title")}</h1>
      {/* Action Cards */}
      <ActionCards />

      {/* Featured Coaches Section */}
      <FeaturedCoaches />

      {/* Top Row - Assessment Progress and Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Progress */}
        <div className="lg:col-span-1">
          <AssessmentProgressCard />
        </div>

        {/* Key Results */}
        <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-1 gap-6">
          <PCAResults />
          <MILResults />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Competency Chart */}
        <div className="lg:col-span-2">
          <CompetencyChart />
        </div>

        {/* Right: Career Matches (Top 3) */}
        <div>
          <Top3Careers />
        </div>
      </div>

      {/* Opportunities Table */}
      <OpportunitiesTable />
    </div>
  );
}
