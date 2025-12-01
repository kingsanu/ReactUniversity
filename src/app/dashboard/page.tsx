"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Sidebar } from "./_components/Sidebar";
import { TopNav } from "./_components/TopNav";
import { ActionCards } from "./_components/ActionCards";
import { CompetencyChart } from "./_components/CompetencyChart";
import { OpportunitiesTable } from "./_components/OpportunitiesTable";
import { Top3Careers } from "@/components/career/Top3Careers";
import { PCAResults } from "./_components/PCAResults";
import { MILResults } from "./_components/MILResults";
import { AssessmentProgressCard } from "@/components/dashboard/AssessmentProgressCard";
import { FeaturedCoaches } from "./_components/FeaturedCoaches";
import "@/utils/adminTestUtils"; // Make admin test functions available globally
import "@/utils/milTestUtils"; // Make MIL test functions available globally
import "@/utils/debugUserRole"; // Make debug user role function available globally
import { Button } from "@/components/ui/button";
import { Bell, Menu, User } from "lucide-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user } = useGlobalStore();

  // Check if user is a coach (case-insensitive)
  const isCoach = user.role && user.role.toLowerCase() === "coach";

  console.log("🔍 Dashboard - Current user:", user);
  console.log("🔍 Dashboard - User role:", user.role);
  console.log("🔍 Dashboard - Is coach:", isCoach);

  // If user is a coach, render the coach dashboard with sidebar and header
  if (isCoach) {
    // Dynamically import the coach dashboard component
    const CoachDashboard = dynamic(() => import("@/app/dashboard/coaching/dashboard/page"), { ssr: false });
    
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Mobile header */}
          <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 ml-auto">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/api/users/${user.id}/avatar`} />
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || 'C'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard/coaching/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/coaching/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { useGlobalStore.getState().logout(); router.push("/login"); }} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto">
            <CoachDashboard />
          </main>
        </div>
      </div>
    );
  }

  // Otherwise, render the student dashboard
  return (

    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
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
          </main>
        </div>
      </div>
    );
  }
