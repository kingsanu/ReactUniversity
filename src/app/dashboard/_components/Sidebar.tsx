"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { sidebarData, coachSidebarData, adminSidebarData } from "./data";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BarChart2,
  Briefcase,
  GraduationCap,
  CreditCard,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  User,
  BookOpen,
  Target,
  Users,
  Receipt,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icon mapping
const IconMap: Record<string, any> = {
  dashboard: LayoutDashboard,
  analytics: BarChart2,
  career: Briefcase,
  opportunities: Target,
  learning: GraduationCap,
  assessments: FileText,
  subscriptions: CreditCard,
  transactions: Receipt,
  sessions: Calendar,
  calendar: Calendar,
  settings: Settings,
  people: Users,
  resources: BookOpen,
};

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["analytics"]);
  const { logout, user } = useGlobalStore();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  // Select sidebar data based on current path, then role
  const role = user.role?.toLowerCase();
  const isAdminRoute = pathname?.includes("/dashboard/admin");
  
  let currentSidebarData = sidebarData;
  // Admin routes take priority - show admin sidebar only on /dashboard/admin/* pages
  if (isAdminRoute) {
    currentSidebarData = adminSidebarData;
  } else if (role === "coach") {
    currentSidebarData = coachSidebarData;
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (itemPath: string) => {
    return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white h-screen flex flex-col transform transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-lg">
                  {currentSidebarData.logo.icon}
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                {currentSidebarData.logo.text}
              </span>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {currentSidebarData.navigation.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            const hasSubmenu =
              Array.isArray((item as any).submenu) &&
              (item as any).submenu.length > 0;
            const isActive = isItemActive(item.path);
            const Icon = IconMap[item.icon as keyof typeof IconMap] || FileText;

            return (
              <div key={item.id} className="mb-1">
                {/* Main Menu Item */}
                <div
                  className={cn(
                    "group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border border-transparent",
                    isActive
                      ? "bg-white/10 backdrop-blur-sm text-white border-white/5 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white hover:border-slate-700/50"
                  )}
                  onClick={() =>
                    hasSubmenu
                      ? toggleExpanded(item.id)
                      : router.push(item.path)
                  }
                >
                  <div className="flex items-center flex-1">
                    <Icon
                      className={cn(
                        "w-5 h-5 mr-3 transition-colors",
                        isActive
                          ? "text-blue-400"
                          : "text-slate-500 group-hover:text-slate-300"
                      )}
                    />
                    <span>{t(item.name)}</span>
                  </div>
                  {hasSubmenu && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-slate-500 transition-transform duration-200",
                        isExpanded ? "rotate-180 text-slate-300" : ""
                      )}
                    />
                  )}
                </div>

                {/* Submenu */}
                {hasSubmenu && isExpanded && (
                  <div className="ml-4 mt-1 pl-4 border-l border-slate-800 space-y-1">
                    {(item as any).submenu?.map((subItem: any) => {
                      const isSubItemActive = isItemActive(subItem.path);
                      return (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-lg transition-all duration-200",
                            isSubItemActive
                              ? "text-white bg-blue-600/20 font-medium"
                              : "text-slate-500 hover:text-white hover:bg-slate-800/50"
                          )}
                        >
                          {t(subItem.name)}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-950/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar className="h-10 w-10 border border-slate-700">
              <AvatarImage src={`/api/users/${user?.id}/avatar`} />
              <AvatarFallback className="bg-slate-800 text-slate-300">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate capitalize">
                {user?.role || "Member"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>{t("common.logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
