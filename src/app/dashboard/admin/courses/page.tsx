"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "../_components/AdminLayout";
import { CourseManager } from "./_components/CourseManager";
import { useRouter } from "next/navigation";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function AdminCoursesPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAdminAccess();

  // Handle admin access check
  useEffect(() => {
    if (!loading) {
      if (!isAdmin) {
        alert("Access denied. This area is for administrators only.");
        router.push("/dashboard");
        return;
      }
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying admin access...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Course Management
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Create, edit, and manage courses in the catalog
            </p>
          </div>
        </div>

        {/* Course Manager */}
        <CourseManager />
      </div>
    </AdminLayout>
  );
}

