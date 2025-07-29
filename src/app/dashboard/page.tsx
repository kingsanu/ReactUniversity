"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "./_components/Sidebar";
import { TopNav } from "./_components/TopNav";
import { ActionCards } from "./_components/ActionCards";
import { CompetencyChart } from "./_components/CompetencyChart";
import { OpportunitiesTable } from "./_components/OpportunitiesTable";
import { CareerMatches } from "./_components/CareerMatches";
import { ActivityChart } from "./_components/ActivityChart";
import { Benchmarks } from "./_components/Benchmarks";
import { Milestones } from "./_components/Milestones";
import { PCAResults } from "./_components/PCAResults";
import "@/utils/adminTestUtils"; // Make admin test functions available globally

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Action Cards */}
          <ActionCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Competency Chart */}
            <div className="lg:col-span-2">
              <CompetencyChart />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* PCA Results */}
              <PCAResults />

              {/* Career Matches */}
              <CareerMatches />
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
