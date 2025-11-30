"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CoursesCatalog } from "../../../../components/dashboard/courses/CoursesCatalog";
import { Breadcrumb } from "../../../../components/ui/breadcrumb";
import { BookOpen } from "lucide-react";
import { Sidebar } from "../../_components/Sidebar";
import { TopNav } from "../../_components/TopNav";

export default function CoursesPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: t("nav.learning"), href: "/dashboard/learning" },
                { label: t("dashboard.courses") },
              ]}
            />

            {/* Header Section */}
            <div className="mb-10 mt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
                <div className="space-y-2 max-w-2xl">
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    {t("dashboard.courseCatalog")}
                  </h1>
                  <p className="text-gray-500 text-lg ml-[3.75rem] leading-relaxed">
                    {t("courses.discoverCourses")}
                  </p>
                </div>
              </div>
            </div>

            {/* Courses Catalog */}
            <div className="">
              <CoursesCatalog />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
