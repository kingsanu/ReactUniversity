"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function RoleExplorer() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const { t } = useTranslation();

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);

    try {
      const { getAllRoles } = await import("@/services/roleService");
      const rolesData = await getAllRoles();
      setRoles(rolesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.roleExplorer.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUserRole = async () => {
    try {
      const { testAuthAPIs, decodeJWTToken } = await import(
        "@/services/authService"
      );

      // Try to get current user role from token
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeJWTToken(token);
        if (decoded && decoded.roleId) {
          setCurrentUserRole(decoded.roleId);
        }
      }
    } catch (error) {
      console.warn("Failed to get current user role:", error);
    }
  };

  useEffect(() => {
    checkCurrentUserRole();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('admin.roleExplorer.title')}</h3>
        <button
          onClick={fetchRoles}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? t('common.loading') : t('admin.roleExplorer.fetchButton')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">❌ {error}</p>
        </div>
      )}

      {currentUserRole && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-blue-800 text-sm">
            👤 {t('admin.roleExplorer.currentUserRole')}: {" "}
            <code className="bg-blue-100 px-1 rounded">{currentUserRole}</code>
          </p>
        </div>
      )}

      {roles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">{t('admin.roleExplorer.availableRoles')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`p-3 rounded-lg border ${
                  role.id === currentUserRole
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{role.name}</h5>
                  <div className="flex items-center space-x-2">
                    {role.id === currentUserRole && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {t('admin.roleExplorer.current')}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        role.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {role.isActive ? t('admin.roleExplorer.active') : t('admin.roleExplorer.inactive')}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                <div className="text-xs text-gray-500">
                  <p>
                    {t('admin.roleExplorer.idLabel')}: {" "}
                    <code className="bg-gray-100 px-1 rounded">{role.id}</code>
                  </p>
                  <p>
                    Created: {new Date(role.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && roles.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          <p>{t('admin.roleExplorer.instruction')}</p>
        </div>
      )}
    </motion.div>
  );
}
