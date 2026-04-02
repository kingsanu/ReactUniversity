"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from "react-i18next";
import { Sidebar as DashboardSidebar } from "./_components/Sidebar";
import { TopNav } from "./_components/TopNav";
// removed GlassBackground
import { Button } from "@/components/ui/button";
import { usePageViewTracking } from "@/hooks/usePageViewTracking";
import { Bell, List as Menu, User } from "@phosphor-icons/react";
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
  const { t } = useTranslation();

  // Track page views across dashboard routes
  usePageViewTracking();

  // Check if user is a coach (case-insensitive)
  const isCoach = user.role && user.role.toLowerCase() === "coach";

  // Check if current path is resume builder
  const pathname = usePathname();
  const isResumeBuilder = pathname?.startsWith("/dashboard/resume-builder");

  if (isResumeBuilder) {
    return <>{children}</>;
  }

  if (isCoach) {
    return (
      <div className="flex bg-slate-50 lg:gap-6 transition-colors duration-300 h-[100dvh] lg:p-6 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} className="h-full lg:rounded-[2.5rem] lg:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] lg:ring-1 lg:ring-slate-100 border-r lg:border-none bg-white z-50 flex-shrink-0" />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 relative lg:rounded-[2.5rem] lg:bg-transparent">
          {/* Mobile header */}
          <div className="bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40 lg:hidden rounded-b-3xl">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label={t("accessibility.openMenu", "Open menu")}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>

            <div className="flex items-center gap-2 ml-auto">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative" aria-label={t("nav.notifications", "Notifications")}>
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" aria-hidden="true"></span>
              </Button>

              {/* User Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label={t("accessibility.userMenu", "User menu")}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || user.image || undefined} />
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
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t("nav.profile", "Profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/coaching/settings")}
                  >
                    {t("nav.settings", "Settings")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      useGlobalStore.getState().logout();
                      router.push("/login");
                    }}
                    className="text-red-600"
                  >
                    {t("common.logout", "Logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto bg-transparent focus:outline-none w-full h-full lg:px-4">
            <div className="max-w-[1400px] mx-auto h-full pb-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Student Layout
  return (
    <div className="flex h-[100dvh] bg-slate-50 lg:gap-6 transition-colors duration-300 lg:p-6 overflow-hidden relative">

      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} className="h-full z-50 flex-shrink-0" />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 relative bg-transparent z-10 gap-6">
        <TopNav onMenuClick={() => setSidebarOpen(true)} className="flex-shrink-0" />

        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto focus:outline-none w-full h-full lg:px-4 isolate pt-24 lg:pt-28">
          <div className="max-w-[1400px] mx-auto h-full pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

