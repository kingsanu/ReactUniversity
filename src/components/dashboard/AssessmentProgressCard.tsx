"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { getDashboardAssessmentSummary } from "@/services/assessmentProgressService";

export function AssessmentProgressCard() {
  const { user } = useGlobalStore();
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAssessmentData();
    }
  }, [user]);

  const loadAssessmentData = async () => {
    try {
      if (!user?.id) return;
      setLoading(true);
      const data = await getDashboardAssessmentSummary(user.id);
      setAssessmentData(data);
    } catch (error) {
      console.error("Error loading assessment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case "in_progress":
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
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
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Assessment Progress
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {assessmentData.overallCompletion}%
          </div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${assessmentData.overallCompletion}%` }}
          />
        </div>
      </div>

      {/* Individual Assessments */}
      <div className="space-y-4">
        {assessmentData.assessments.map((assessment: any) => (
          <div
            key={assessment.type}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(assessment.status)}
              <div>
                <div className="font-medium text-gray-900">
                  {assessment.name}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {assessment.status.replace("_", " ")}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {assessment.completion}%
              </div>
              {assessment.stats && Object.keys(assessment.stats).length > 0 && (
                <div className="text-xs text-gray-500">
                  {assessment.type === "mil" &&
                    assessment.stats.totalAttempts > 0 &&
                    `${assessment.stats.totalAttempts} attempts`}
                  {assessment.type === "evaluation" &&
                    assessment.stats.totalEvaluators > 0 &&
                    `${assessment.stats.totalEvaluators} evaluators`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href="/dashboard/assessments"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-center block font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          View All Assessments
        </a>
      </div>
    </motion.div>
  );
}
