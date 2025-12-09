"use client";

import React, { useState } from "react";
import { Sidebar } from "../_components/Sidebar";
import { TopNav } from "../_components/TopNav";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Target, Flag, CheckCircle2, Clock } from "lucide-react";

export default function ProgressMilestonesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900">
                Progress Milestones
              </h1>
              <p className="text-gray-600 mt-2">
                Track your key achievements and upcoming goals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Milestones Coming Soon
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                We are currently building this feature to help you visualize your progress better. Check back soon!
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
