"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "../_components/AdminLayout";
import { useRouter } from "next/navigation";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function AdminUsersPage() {
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
              User Management
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage users, roles, and permissions
            </p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            User Management
          </h3>
          <p className="text-gray-600 mb-4">
            User management features are coming soon. This will include user
            roles, permissions, and account management.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h4 className="font-medium text-gray-900 mb-2">
              Planned Features:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• View all registered users</li>
              <li>• Manage user roles and permissions</li>
              <li>• User account activation/deactivation</li>
              <li>• User subscription status</li>
              <li>• Bulk user operations</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
