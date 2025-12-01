"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { SubscriptionPlanManager } from "./_components/SubscriptionPlanManager";
import { DashboardStats } from "./_components/DashboardStats";
import { Users, GraduationCap, Settings, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Manage Coaches",
      description: "Invite, approve, and manage coach profiles.",
      icon: Users,
      href: "/dashboard/admin/coaches",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Course Management",
      description: "Create and update learning courses.",
      icon: GraduationCap,
      href: "/dashboard/learning/courses", // Assuming this is the path, or admin specific
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "360° Questions",
      description: "Configure feedback questions.",
      icon: FileText,
      href: "/dashboard/admin/questions",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "System Settings",
      description: "Global platform configuration.",
      icon: Settings,
      href: "/dashboard/admin/settings",
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-10 font-sans">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-lg text-gray-500 font-medium">Overview of your platform's performance</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              Last updated: Just now
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href} className="group block">
                <div className="h-full bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-100 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {action.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                    Access <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Subscription Manager */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <h2 className="text-xl font-bold text-gray-900">Subscription Plans</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your pricing tiers and features</p>
          </div>
          <div className="p-6">
            <SubscriptionPlanManager />
          </div>
        </div>
      </div>
    </div>
  );
}
