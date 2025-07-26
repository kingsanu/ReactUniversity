"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const topNavItems = [
  { name: "Dashboard", active: true },
  { name: "Analytics", active: false },
  { name: "Career Paths", active: false },
  { name: "Jobs & Internship", active: false },
  { name: "Learnings", active: false },
  { name: "Community & Netw..", active: false },
];

interface TopNavProps {
  className?: string;
  onMenuClick?: () => void;
}

export function TopNav({ className, onMenuClick }: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className={cn("bg-white border-b border-gray-200", className)}>
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-8">
          {topNavItems.map((item) => (
            <button
              key={item.name}
              className={cn(
                "text-sm font-medium pb-3 border-b-2 transition-colors",
                item.active
                  ? "text-gray-900 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              )}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-48 md:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Mobile Search Button */}
          <button className="sm:hidden p-2 text-gray-400 hover:text-gray-500 transition-colors">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5-5-5h5zm0 0v-12a3 3 0 10-6 0v12"
              />
            </svg>
          </button>

          {/* User Avatar */}
          <button className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white text-sm font-medium">
            U
          </button>
        </div>
      </div>
    </header>
  );
}
