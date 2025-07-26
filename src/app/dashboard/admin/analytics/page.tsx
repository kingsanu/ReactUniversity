"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "../_components/AdminLayout";
import { AdminStats } from "../_components/AdminStats";
import { useRouter } from "next/navigation";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function AdminAnalyticsPage() {
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
              Analytics & Reports
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              View detailed analytics and generate reports
            </p>
          </div>
        </div>

        {/* Admin Stats */}
        <AdminStats />

        {/* Additional Analytics */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue Analytics
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600">
                Revenue charts and trends coming soon
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Growth
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600">User growth analytics coming soon</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Subscription Metrics
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600">
                Subscription analytics coming soon
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Performance
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600">Performance metrics coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
