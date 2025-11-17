"use client";

import React from "react";
import { useCareersStore } from "@/store/useCareersStore";
import { useCareerList } from "@/hooks/useCareerQueries";
import { Sidebar } from "@/app/dashboard/_components/Sidebar";
import { TopNav } from "@/app/dashboard/_components/TopNav";

export default function ComparePage() {
  const { compareList } = useCareersStore();
  const { data: careersData } = useCareerList();
  const selected = (careersData?.careers || []).filter((c) =>
    compareList.includes(c.id)
  );
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={false} onClose={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav onMenuClick={() => {}} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold">Compare Careers</h2>
            <p className="text-sm text-gray-500 mt-2">
              Select up to 3 careers to compare attributes side-by-side.
            </p>
            <div className="mt-6">
              {selected.length === 0 && (
                <div className="text-sm text-gray-500">
                  No careers selected. Choose up to 3 to compare.
                </div>
              )}
              {selected.length > 0 && (
                <div className="overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2">Attribute</th>
                        {selected.map((s) => (
                          <th key={s.id} className="p-2">
                            {s.title.en}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 font-semibold">Match</td>
                        {selected.map((s) => (
                          <td key={s.id} className="p-2">
                            {s.matchScore}%
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Education</td>
                        {selected.map((s) => (
                          <td key={s.id} className="p-2">
                            {s.educationLevel}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Salary</td>
                        {selected.map((s) => (
                          <td key={s.id} className="p-2">
                            {s.salaryRange?.median
                              ? `$${s.salaryRange.median}`
                              : "--"}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Skills</td>
                        {selected.map((s) => (
                          <td key={s.id} className="p-2">
                            {(s.skills || [])
                              .map((sk: any) => sk.name.en)
                              .join(", ")}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
