"use client";

import React from "react";
import { Sidebar } from "../_components/Sidebar";
import { TopNav } from "../_components/TopNav";
import CareerExplorer from "@/components/career/CareerExplorer";

export default function DashboardCareerPaths() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={false} onClose={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav onMenuClick={() => {}} />
        <main className="flex-1 overflow-y-auto p-6">
          <CareerExplorer />
        </main>
      </div>
    </div>
  );
}
