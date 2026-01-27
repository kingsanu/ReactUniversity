"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  School,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

interface SchoolAdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { key: "dashboard", path: "/school-admin", icon: LayoutDashboard, label: "Dashboard" },
  { key: "students", path: "/school-admin/students", icon: Users, label: "Students" },
  { key: "analytics", path: "/school-admin/analytics", icon: BarChart3, label: "Analytics" },
  { key: "results", path: "/school-admin/results", icon: FileText, label: "Results" },
  { key: "settings", path: "/school-admin/settings", icon: Settings, label: "Settings" },
];

export function SchoolAdminLayout({ children }: SchoolAdminLayoutProps) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useGlobalStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => {
    if (path === "/school-admin") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-teal-900 via-teal-800 to-cyan-900 text-white h-screen flex flex-col transform transition-transform duration-300 ease-in-out shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-teal-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <School className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">School Admin</span>
                <p className="text-cyan-200 text-xs font-medium">UNIV.365</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-teal-300 hover:text-white hover:bg-teal-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  active
                    ? "bg-white/15 text-white shadow-lg backdrop-blur-sm"
                    : "text-teal-100 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5 transition-transform group-hover:scale-110", active ? "text-cyan-300" : "text-teal-300")} />
                <span className="flex-1">{t(`schoolAdmin.nav.${item.key}`, item.label)}</span>
                {active && <ChevronRight className="w-4 h-4 text-cyan-300" />}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-teal-700/50 space-y-2">
          <div className="px-4 py-3 bg-white/5 rounded-xl">
            <p className="text-sm font-medium text-white truncate">{user?.name || "School Admin"}</p>
            <p className="text-xs text-teal-300 truncate">{user?.email || "admin@school.com"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="mr-3 h-5 w-5 text-teal-300 group-hover:text-red-400 transition-colors" />
            <span>{t("common.logout", "Logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center space-x-3">
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {t("schoolAdmin.title", "School Admin Portal")}
                </h1>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                {t("schoolAdmin.role", "School Admin")}
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
