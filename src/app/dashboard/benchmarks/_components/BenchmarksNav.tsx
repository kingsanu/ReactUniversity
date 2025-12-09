"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Overview", path: "/dashboard/benchmarks/overview" },
  { name: "Compensation", path: "/dashboard/benchmarks/compensation" },
  { name: "Market Analysis", path: "/dashboard/benchmarks/market" },
  { name: "Skills & Learning", path: "/dashboard/benchmarks/skills" },
  { name: "Demographics", path: "/dashboard/benchmarks/demographics" },
];

export function BenchmarksNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
