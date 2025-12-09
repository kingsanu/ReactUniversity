"use client";

import React, { useState } from "react";
import { Sidebar } from "@/app/dashboard/_components/Sidebar";
import BenchmarksHeader from "./_components/BenchmarksHeader";
import { TopNav } from "@/app/dashboard/_components/TopNav";

export default function BenchmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleExportCSV = () => {
    // Implement export functionality
    console.log("Exporting CSV...");
  };

  const handleExportImage = () => {
    // Implement export functionality
    console.log("Exporting Image...");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <BenchmarksHeader
              onExportCSV={handleExportCSV}
              onExportImage={handleExportImage}
            />
             <div className="mt-6">
                {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
