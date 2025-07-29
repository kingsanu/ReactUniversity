"use client";

import { motion } from "motion/react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { usePCAData } from "@/hooks/usePCAData";
import PCATestButton from "./_components/PCATestButton";

export default function AssessmentsPage() {
  const { user } = useGlobalStore();
  const { pcaData, hasPCA, isCompleted } = usePCAData();

  const getPCAStatus = () => {
    if (!hasPCA) return "not_started";
    if (hasPCA && !isCompleted) return "in_progress";
    return "completed";
  };

  const pcaStatus = getPCAStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessments</h1>
          <p className="text-gray-600">
            Complete your professional assessments to unlock insights about your
            competencies and career path
          </p>
        </div>

        {/* Development Test Button */}
        {process.env.NODE_ENV === "development" && <PCATestButton />}

        {/* User Info Card */}
        {user.name && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3 mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">
                  Ready to start, {user.name.split(" ")[0]}!
                </h3>
                <p className="text-sm text-blue-700">
                  Your profile information will be used for the assessments
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Assessment Cards */}
        <div className="space-y-6">
          {/* 1. Personal Competence Analysis (PCA) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 mr-3">
                    1. Personal Competence Analysis (via API)
                  </h2>
                  {pcaStatus === "completed" && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                  {pcaStatus === "in_progress" && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">
                  Redirect the user to an external ipsative test to analyze
                  personal competencies and professional strengths.
                </p>
              </div>
            </div>

            <a
              href="/dashboard/assessments/pca"
              className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {pcaStatus === "completed"
                ? "View Results"
                : pcaStatus === "in_progress"
                ? "Continue PCA"
                : "Start PCA"}
            </a>

            {pcaStatus === "completed" && pcaData?.pcaCod && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  PCA Code:{" "}
                  <code className="bg-gray-200 px-1 rounded">
                    {pcaData.pcaCod.slice(0, 8)}...
                  </code>
                  <span className="ml-2">
                    Completed:{" "}
                    {pcaData.lastUpdated
                      ? new Date(pcaData.lastUpdated).toLocaleDateString()
                      : "Recently"}
                  </span>
                </p>
              </div>
            )}
          </motion.div>

          {/* 2. MIL Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  2. MIL
                </h2>
                <p className="text-gray-600 mb-6">
                  Conduct internal assessment of logical reasoning and
                  problem-solving capabilities.
                </p>
              </div>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Coming Soon
              </span>
            </div>

            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed font-medium"
            >
              Start MIL
            </button>
          </motion.div>

          {/* 3. 360 Evaluation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  3. 360 Evaluation
                </h2>
                <p className="text-gray-600 mb-6">
                  Invite external evaluators (Parents, Teachers, Friends) before
                  prompting the user to perform a self-assessment.
                </p>
              </div>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Coming Soon
              </span>
            </div>

            <div className="space-y-3">
              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed font-medium"
              >
                Invite Evaluators
              </button>
              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed font-medium"
              >
                Start 360 Evaluation
              </button>
            </div>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Assessment Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">PCA Assessment</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Takes 15-20 minutes</li>
                <li>• Evaluates competencies</li>
                <li>• Available in Spanish/English</li>
                <li>• Results on dashboard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">MIL Assessment</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Logical reasoning test</li>
                <li>• Problem-solving focus</li>
                <li>• Internal assessment</li>
                <li>• Coming soon</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">360 Evaluation</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Multi-perspective feedback</li>
                <li>• External evaluators</li>
                <li>• Self-assessment included</li>
                <li>• Coming soon</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
