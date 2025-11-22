"use client";
import { useState, useEffect } from "react";
import { SubscriptionPlanManager } from "./_components/SubscriptionPlanManager";
import { AdminStats } from "./_components/AdminStats";
import { Questions360Stats } from "./_components/Questions360Stats";

import { useRouter } from "next/navigation";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function AdminPage() {
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
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Manage subscription plans and system settings
          </p>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AdminStats />
        <Questions360Stats />
      </div>

      {/* Subscription Plan Manager */}
      <SubscriptionPlanManager />
    </div>
  );
}
