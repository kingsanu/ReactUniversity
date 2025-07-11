import { motion } from 'motion/react';
import { dashboardData } from './data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OpportunitiesTableProps {
  className?: string;
}

export function OpportunitiesTable({ className }: OpportunitiesTableProps) {
  const { opportunities } = dashboardData;

  const getStatusStyles = (color: string) => {
    const styles = {
      green: 'bg-green-100 text-green-700',
      blue: 'bg-blue-100 text-blue-700', 
      red: 'bg-red-100 text-red-700'
    };
    return styles[color as keyof typeof styles] || styles.blue;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={cn(
        "text-sm",
        i < rating ? "text-yellow-400" : "text-gray-300"
      )}>
        ★
      </span>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Opportunities for you</h3>
        <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filter</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="pb-3 text-sm font-medium text-gray-500">No.</th>
              <th className="pb-3 text-sm font-medium text-gray-500">Cat no.</th>
              <th className="pb-3 text-sm font-medium text-gray-500">Driver</th>
              <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
              <th className="pb-3 text-sm font-medium text-gray-500">Rating</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity, index) => (
              <motion.tr
                key={opportunity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 last:border-b-0"
              >
                <td className="py-4 text-sm text-gray-700">{opportunity.id}</td>
                <td className="py-4 text-sm text-gray-700">{opportunity.catNo}</td>
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        {opportunity.driver.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">
                      {opportunity.driver.name}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={cn(
                    "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                    getStatusStyles(opportunity.statusColor)
                  )}>
                    {opportunity.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(opportunity.rating)}
                  </div>
                </td>
                <td className="py-4">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Apply
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
