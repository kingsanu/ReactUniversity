"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sidebarData } from './data';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/store/useGlobalStore';

// Icon mapping - in a real app, use proper icon library
const IconMap = {
  dashboard: "🏠",
  analytics: "📊", 
  career: "📋",
  opportunities: "💼",
  learning: "🎓"
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['analytics']);
  const { logout } = useGlobalStore();
  const router = useRouter();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className={cn("w-64 bg-gray-900 text-white h-screen flex flex-col", className)}>
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">{sidebarData.logo.icon}</span>
          </div>
          <span className="text-xl font-bold">{sidebarData.logo.text}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {sidebarData.navigation.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          
          return (
            <div key={item.id}>
              {/* Main Menu Item */}
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  item.active 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
                onClick={() => hasSubmenu && toggleExpanded(item.id)}
              >
                <Link href={item.path} className="flex items-center flex-1">
                  <span className="mr-3 text-base">
                    {IconMap[item.icon as keyof typeof IconMap] || "📄"}
                  </span>
                  <span>{item.name}</span>
                </Link>
                {hasSubmenu && (
                  <span className={cn(
                    "text-xs transition-transform",
                    isExpanded ? "rotate-180" : ""
                  )}>
                    ▼
                  </span>
                )}
              </div>

              {/* Submenu */}
              {hasSubmenu && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenu?.map((subItem) => (
                    <Link
                      key={subItem.path}
                      href={subItem.path}
                      className="block px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="mr-3">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
