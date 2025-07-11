"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBarChart2, FiBookOpen, FiBriefcase, FiUsers, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { name: 'Analytics', icon: FiBarChart2, path: '/dashboard/analytics' },
  { name: 'Career Planning', icon: FiBookOpen, path: '/dashboard/career-planning', hasSubmenu: true },
  { name: 'Opportunities', icon: FiBriefcase, path: '/dashboard/opportunities' },
  { name: 'Learning & Tools', icon: FiUsers, path: '/dashboard/learning', hasSubmenu: true },
];

const subMenuItems = {
  'Career Planning': [
    { name: 'Career Paths Explorer', path: '/dashboard/career-paths' },
    { name: 'University Suggestions', path: '/dashboard/university' },
    { name: 'Assessments', path: '/dashboard/assessments' },
    { name: 'Progress Milestones', path: '/dashboard/progress' },
    { name: 'Benchmark', path: '/dashboard/benchmark' },
  ],
  'Learning & Tools': [
    { name: 'Course Catalog', path: '/dashboard/courses' },
    { name: 'Resume Builder', path: '/dashboard/resume' },
    { name: 'Resource Library', path: '/dashboard/resources' },
  ],
  'Opportunities': [
    { name: 'Job Openings', path: '/dashboard/jobs' },
    { name: 'Internship Opportunities', path: '/dashboard/internships' },
    { name: 'Mentorship Matches', path: '/dashboard/mentorship' },
    { name: 'Coaching Sessions', path: '/dashboard/coaching' },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-10">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold">U</span>
        </div>
        <span className="text-xl font-bold">UNIV.365</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <div key={item.name}>
              <Link
                href={item.path}
                className={cn(
                  'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  'hover:bg-gray-800',
                  isActive && 'bg-blue-600 text-white'
                )}
              >
                <Icon className="mr-3 text-lg" />
                <span>{item.name}</span>
                {item.hasSubmenu && (
                  <span className="ml-auto">▼</span>
                )}
              </Link>
              
              {/* Submenu for expanded items */}
              {item.hasSubmenu && item.name in subMenuItems && (
                <div className="ml-6 mt-2 space-y-1">
                  {subMenuItems[item.name as keyof typeof subMenuItems].map((subItem) => (
                    <Link
                      key={subItem.path}
                      href={subItem.path}
                      className="block px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-800 rounded"
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
      
      {/* Logout Button */}
      <button className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
        <FiLogOut className="mr-3 text-lg" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
