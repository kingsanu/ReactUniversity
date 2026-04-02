"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import { AccessibleLanguageSwitcher } from "@/components/accessibility/AccessibleLanguageSwitcher";
import { MagnifyingGlass as Search, Bell, List as Menu } from "@phosphor-icons/react";
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
    <header 
      className={cn("absolute left-0 right-0 top-4 lg:top-6 z-40 px-4 w-full flex justify-center pointer-events-none transition-transform duration-500", className)}
      role="banner"
    >
      <div className="pointer-events-auto bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-200/60 px-4 md:px-5 py-2.5 rounded-full flex items-center justify-between gap-4 md:gap-8 max-w-fit backdrop-blur-md">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-full h-10 w-10 border border-slate-100/50 shadow-sm mr-2"
          aria-label={t("accessibility.openMenu")}
        >
          <Menu weight="bold" className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-2 bg-slate-50 p-1.5 rounded-full border border-slate-100" aria-label={t("accessibility.navigation")}>
          {translatedNavItems.map((item) => (
            <button
              key={item.name}
              className={cn(
                "text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                item.active
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200 scale-100"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 scale-95 hover:scale-100"
              )}
              aria-current={item.active ? "page" : undefined}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-1.5 md:space-x-3 ml-auto">
          {/* Search */}
          <div className="relative hidden sm:block group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search weight="bold" className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-900 transition-colors duration-500" aria-hidden="true" />
            </div>
            <Input
              type="search"
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 lg:w-64 h-10 pl-11 pr-4 bg-white/30 border border-white/40 focus:bg-white/60 focus:border-white focus:ring-4 focus:ring-white/20 focus:shadow-sm rounded-full transition-all duration-500 text-sm font-medium placeholder:text-slate-500 placeholder:font-medium shadow-inner hover:bg-white/50"
              aria-label={t("common.search")}
            />
          </div>

          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden text-slate-500 hover:text-slate-900 bg-transparent hover:bg-white/40 rounded-full h-10 w-10 transition-all duration-300 active:scale-95"
            aria-label={t("common.search")}
          >
            <Search weight="bold" className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* Language Switcher */}
          <div className="hidden sm:block">
            <AccessibleLanguageSwitcher />
          </div>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-slate-500 hover:text-slate-900 bg-transparent hover:bg-white/40 rounded-full h-10 w-10 transition-all duration-300 active:scale-95 group"
            aria-label={t("nav.notifications")}
          >
            <Bell weight="bold" className="h-[18px] w-[18px] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" aria-hidden="true" />
            <span className="absolute top-2 right-2.5 h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" aria-hidden="true"></span>
            <span className="sr-only">{t("nav.notificationsCount", { count: 3, defaultValue: "3 new notifications" })}</span>
          </Button>

          {/* User Profile Dropdown */}
          <div className="pl-1 flex items-center border-l border-white/40 ml-1.5 h-6">
            <div className="ml-2.5">
              <UserProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
