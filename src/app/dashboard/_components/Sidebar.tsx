"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { sidebarData } from "./data";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useTranslation } from "react-i18next";

// Icon mapping - in a real app, use proper icon library
const IconMap = {
  dashboard: "🏠",
  analytics: "📊",
  career: "📋",
  opportunities: "💼",
  learning: "🎓",
  assessments: "📝",
  subscriptions: "💳",
};

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["analytics"]);
  const { logout } = useGlobalStore();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (itemPath: string) => {
    return pathname === itemPath;
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white h-screen flex flex-col transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {sidebarData.logo.icon}
                </span>
              </div>
              <span className="text-xl font-bold">{sidebarData.logo.text}</span>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {sidebarData.navigation.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isActive = isItemActive(item.path);

            return (
              <div key={item.id}>
                {/* Main Menu Item */}
                <div
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                  onClick={() => hasSubmenu && toggleExpanded(item.id)}
                >
                  <Link href={item.path} className="flex items-center flex-1">
                    <span className="mr-3 text-base">
                      {IconMap[item.icon as keyof typeof IconMap] || "📄"}
                    </span>
                    <span>{t(item.name)}</span>
                  </Link>
                  {hasSubmenu && (
                    <span
                      className={cn(
                        "text-xs transition-transform",
                        isExpanded ? "rotate-180" : ""
                      )}
                    >
                      ▼
                    </span>
                  )}
                </div>

                {/* Submenu */}
                {hasSubmenu && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu?.map((subItem) => {
                      const isSubItemActive = isItemActive(subItem.path);
                      return (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={cn(
                            "block px-3 py-2 text-xs rounded transition-colors",
                            isSubItemActive
                              ? "text-white bg-gray-800"
                              : "text-gray-400 hover:text-white hover:bg-gray-800"
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

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            <span>{t("common.logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
