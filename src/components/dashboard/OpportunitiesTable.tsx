import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const opportunities = [
  {
    id: '01',
    catNo: '6465',
    role: 'Sr. software developer',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    id: '02', 
    catNo: '5665',
    role: 'Database Engineer',
    status: 'Pending',
    statusColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: '03',
    catNo: '1755',
    role: 'Network Engineer', 
    status: 'In route',
    statusColor: 'bg-red-100 text-red-700',
  },
];

export function OpportunitiesTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Opportunities for you</h3>
        <button className="text-sm text-gray-500 flex items-center space-x-2">
          <span>Filter</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-3">No.</th>
              <th className="pb-3">Cat no.</th>
              <th className="pb-3">Driver</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <motion.tr
                key={opportunity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b last:border-b-0"
              >
                <td className="py-4 text-sm text-gray-700">{opportunity.id}</td>
                <td className="py-4 text-sm text-gray-700">{opportunity.catNo}</td>
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <span className="text-sm text-gray-700">{opportunity.role}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${opportunity.statusColor}`}>
                    {opportunity.status}
                  </span>
                </td>
                <td className="py-4 text-sm text-gray-500">★★★★★</td>
                <td className="py-4">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
