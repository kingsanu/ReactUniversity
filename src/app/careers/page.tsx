"use client";

import React from "react";
import CareerExplorer from "@/components/career/CareerExplorer";
import { Sidebar } from "../dashboard/_components/Sidebar";
import { TopNav } from "../dashboard/_components/TopNav";

export default function CareersPage() {
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
