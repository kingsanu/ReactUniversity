"use client";
import { Sidebar } from './_components/Sidebar';
import { TopNav } from './_components/TopNav';
import { ActionCards } from './_components/ActionCards';
import { CompetencyChart } from './_components/CompetencyChart';
import { OpportunitiesTable } from './_components/OpportunitiesTable';
import { CareerMatches } from './_components/CareerMatches';
import { ActivityChart } from './_components/ActivityChart';
import { Benchmarks } from './_components/Benchmarks';
import { Milestones } from './_components/Milestones';

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Action Cards */}
          <ActionCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Competency Chart */}
            <div className="lg:col-span-2">
              <CompetencyChart />
            </div>
            
            {/* Right: Career Matches */}
            <CareerMatches />
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
