"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "./_components/Sidebar";
import { TopNav } from "./_components/TopNav";
import { ActionCards } from "./_components/ActionCards";
import { CompetencyChart } from "./_components/CompetencyChart";
import { OpportunitiesTable } from "./_components/OpportunitiesTable";
import { Top3Careers } from "@/components/career/Top3Careers";
import { ActivityChart } from "./_components/ActivityChart";
import { Benchmarks } from "./_components/Benchmarks";
import { Milestones } from "./_components/Milestones";
import { PCAResults } from "./_components/PCAResults";
import { MILResults } from "./_components/MILResults";
import { AssessmentProgressCard } from "@/components/dashboard/AssessmentProgressCard";
import "@/utils/adminTestUtils"; // Make admin test functions available globally
import "@/utils/milTestUtils"; // Make MIL test functions available globally

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Action Cards */}
          <ActionCards />

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

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Benchmarks />
            <Milestones />
            <ActivityChart />
          </div>
        </main>
      </div>
    </div>
  );
}
