"use client";

import { motion } from "motion/react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useDashboardAssessmentSummary } from "@/hooks/useAssessmentQueries";
import { CheckCircle2, Circle, Clock, Brain, Target, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function AssessmentProgressCard() {
  const { user } = useGlobalStore();
  
  // Use React Query for assessment data
  const { 
    data: assessmentData, 
    isLoading: loading, 
    error 
  } = useDashboardAssessmentSummary(user?.id || '');

  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case "pca":
        return <Brain className="w-5 h-5 text-blue-600" />;
      case "mil":
        return <Target className="w-5 h-5 text-purple-600" />;
      case "evaluation":
        return <Users className="w-5 h-5 text-orange-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-100";
      case "in_progress":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/3"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          <div className="h-32 bg-gray-100 rounded-xl"></div>
        </div>
      </motion.div>
    );
  }

  if (!assessmentData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Assessment Journey
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Your professional growth path
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {assessmentData.overallCompletion}%
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${assessmentData.overallCompletion}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-full rounded-full"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500 font-medium">
          <span>Start</span>
          <span>Professional Certified</span>
        </div>
      </div>

      {/* Individual Assessments */}
      <div className="space-y-3 flex-1">
        {assessmentData.assessments.map((assessment: any, index: number) => (
          <motion.div
            key={assessment.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
                assessment.type === 'pca' ? "bg-blue-50" :
                assessment.type === 'mil' ? "bg-purple-50" : "bg-orange-50"
              )}>
                {getAssessmentIcon(assessment.type)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {assessment.name}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium border uppercase tracking-wider",
                    getStatusColor(assessment.status)
                  )}>
                    {assessment.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {assessment.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <div className="text-sm font-medium text-gray-400">
                  {assessment.completion}%
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <a
          href="/dashboard/assessments"
          className="group w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20"
        >
          <span>Continue Assessment</span>
          <Clock className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
}
