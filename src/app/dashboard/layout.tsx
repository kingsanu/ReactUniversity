"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Sidebar } from "@/components/dashboard/Sidebar"; // Changed to use the shared sidebar component if available, OR reuse local one. 
// Wait, the page.tsx used "./_components/Sidebar". Let's verify where the robust Sidebar is. 
// k:\2025\timcare\src\components\dashboard\Sidebar.tsx exists (I viewed it in Step 11).
// k:\2025\timcare\src\app\dashboard\_components\Sidebar.tsx likely also exists. 
// The one in src/components/dashboard/Sidebar.tsx seemed complete. Let's use the one from page.tsx logic for consistency first.
// Actually, let's use the local one to minimize breakage for now, or check if they are duplicates. 
// 'k:\2025\timcare\src\components\dashboard\Sidebar.tsx' vs 'k:\2025\timcare\src\app\dashboard\_components\Sidebar.tsx'
// I will assume the one used in page.tsx is the correct one for the dashboard.
// Re-checking imports in page.tsx: import { Sidebar } from "./_components/Sidebar";

import { Sidebar as DashboardSidebar } from "./_components/Sidebar";
import { TopNav } from "./_components/TopNav";
import { Button } from "@/components/ui/button";
import { Bell, Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user } = useGlobalStore();

  // Check if user is a coach (case-insensitive)
  const isCoach = user.role && user.role.toLowerCase() === "coach";

  if (isCoach) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 transition-all duration-300">
          {/* Mobile header */}
          <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40 lg:hidden">
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
                        {user.name?.charAt(0).toUpperCase() || "C"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/coaching/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/coaching/settings")}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      useGlobalStore.getState().logout();
                      router.push("/login");
                    }}
                    className="text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto bg-gray-50">
             {children}
          </main>
        </div>
      </div>
    );
  }

  // Student Layout
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 transition-all duration-300">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
