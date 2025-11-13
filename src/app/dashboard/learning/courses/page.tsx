"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CoursesCatalog } from "../../../../components/dashboard/courses/CoursesCatalog";
import { Breadcrumb } from "../../../../components/ui/breadcrumb";
import { BookOpen, GraduationCap } from "lucide-react";

export default function CoursesPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Learning", href: "/dashboard/learning" },
            { label: "Courses" },
          ]}
        />

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("dashboard.courseCatalog")}
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                {t("courses.discoverCourses")}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">50+</p>
                  <p className="text-sm text-gray-600">
                    {t("courses.totalCourses")}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">★</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-sm text-gray-600">
                    {t("courses.avgRating")}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">🏆</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">10k+</p>
                  <p className="text-sm text-gray-600">
                    {t("courses.enrollments")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Catalog */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <CoursesCatalog />
        </div>
      </div>
    </div>
  );
}
