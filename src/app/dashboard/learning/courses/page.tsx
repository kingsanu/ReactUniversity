"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CoursesCatalog } from "../../../../components/dashboard/courses/CoursesCatalog";

export default function CoursesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.courseCatalog")}
        </h1>
        <p className="text-gray-600 mt-1">{t("courses.discoverCourses")}</p>
      </div>

      <CoursesCatalog />
    </div>
  );
}
