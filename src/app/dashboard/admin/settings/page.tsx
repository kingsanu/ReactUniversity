"use client";
import { useState, useEffect } from "react";
import { RoleExplorer } from "../_components/RoleExplorer";
import { TokenManager } from "../_components/TokenManager";
import StripeUrlDiagnostic from "../_components/StripeUrlDiagnostic";
import { setTestAdminRole } from "@/services/adminService";
import { useRouter } from "next/navigation";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [showDevTools, setShowDevTools] = useState(false);
  const { isAdmin, loading } = useAdminAccess();

  // Handle admin access check
  useEffect(() => {
    if (!loading) {
      if (!isAdmin) {
        alert("Access denied. This area is for administrators only.");
        router.push("/dashboard");
        return;
      }

      // Show dev tools in development
      setShowDevTools(process.env.NODE_ENV === "development");
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
            System Settings
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Configure system settings and development tools
          </p>
        </div>
      </div>

      {/* Token Management */}
      <TokenManager />

      {/* Stripe URL Diagnostic */}
      <StripeUrlDiagnostic />

      {/* Development Tools */}
      {showDevTools && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            Development Tools
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => {
                setTestAdminRole("user");
                window.location.reload();
              }}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Set User Role
            </button>
            <button
              onClick={() => {
                setTestAdminRole("admin");
                window.location.reload();
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Set Admin Role
            </button>
            <button
              onClick={() => {
                setTestAdminRole("super_admin");
                window.location.reload();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Set Super Admin Role
            </button>
          </div>
          <RoleExplorer />
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            General Settings
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600">
              General system settings coming soon
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Settings
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600">
              Stripe and payment configuration coming soon
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Email Settings
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600">
              Email configuration and templates coming soon
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Security Settings
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600">
              Security and authentication settings coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
