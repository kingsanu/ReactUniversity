"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { name: "Dashboard", path: "/dashboard/admin", icon: "📊" },
  { name: "Subscription Plans", path: "/dashboard/admin/plans", icon: "💳" },
  { name: "Users", path: "/dashboard/admin/users", icon: "👥" },
  { name: "Courses", path: "/dashboard/admin/courses", icon: "📚" },
  { name: "360° Questions", path: "/dashboard/admin/questions", icon: "❓" },
  { name: "Analytics", path: "/dashboard/admin/analytics", icon: "📈" },
  { name: "Settings", path: "/dashboard/admin/settings", icon: "⚙️" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useGlobalStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const goToUserDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-red-900 text-white h-screen flex flex-col transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Admin Logo */}
        <div className="p-6 border-b border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <span className="text-xl font-bold">Admin Panel</span>
                <p className="text-red-200 text-xs">UNIV.365</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-red-400 hover:text-white hover:bg-red-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Admin Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {adminNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-red-200 hover:bg-red-800 hover:text-white"
            >
              <span className="mr-3 text-base">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Admin Actions */}
        <div className="p-4 border-t border-red-800 space-y-2">
          <button
            onClick={goToUserDashboard}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-200 hover:text-white hover:bg-red-800 rounded-lg transition-colors"
          >
            <span className="mr-3">👤</span>
            <span>User Dashboard</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-200 hover:text-white hover:bg-red-800 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Top Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Admin Title */}
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Administrator Dashboard
              </h1>
            </div>

            {/* Admin User Info */}
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Super Admin
              </div>
              <button className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full text-white text-sm font-medium">
                A
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
