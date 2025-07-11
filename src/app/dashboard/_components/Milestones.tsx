import { motion } from 'motion/react';
import { dashboardData } from './data';
import { cn } from '@/lib/utils';

interface MilestonesProps {
  className?: string;
}

export function Milestones({ className }: MilestonesProps) {
  const { milestones } = dashboardData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Milestones</h3>
      
      {/* Progress Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg width="128" height="128" className="transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="transparent"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - milestones.progress / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - milestones.progress / 100) }}
              transition={{ duration: 1.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {milestones.current}/{milestones.total}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Skills Legend */}
      <div className="space-y-3">
        {milestones.skills.map((skill) => (
          <div key={skill.name} className="flex items-center space-x-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: skill.color }}
            />
            <span className="text-sm text-gray-600">{skill.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
