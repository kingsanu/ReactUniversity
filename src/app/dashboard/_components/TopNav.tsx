"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  className?: string;
  onMenuClick?: () => void;
}

export function TopNav({ className, onMenuClick }: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const translatedNavItems = [
    { name: t("nav.dashboard"), active: true, path: "/dashboard" },
  ];

  return (
    <header className={cn("bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40", className)}>
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-50"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-8">
          {translatedNavItems.map((item) => (
            <button
              key={item.name}
              className={cn(
                "text-sm font-medium pb-1 border-b-2 transition-all duration-200",
                item.active
                  ? "text-blue-600 border-blue-600"
                  : "text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-200"
              )}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {/* Search */}
          <div className="relative hidden sm:block group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <Input
              type="text"
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 md:w-72 pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 rounded-full transition-all duration-200"
            />
          </div>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="sm:hidden text-slate-500 hover:text-slate-700">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>

          {/* User Profile Dropdown */}
          <div className="pl-2 border-l border-slate-100">
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
