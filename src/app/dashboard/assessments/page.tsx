"use client";

import { motion } from "motion/react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { usePCAData } from "@/hooks/usePCAData";
import { useEvaluationData } from "@/hooks/useEvaluationData";
import { useState, useEffect } from "react";
import { getDashboardAssessmentSummary } from "@/services/assessmentProgressService";

export default function AssessmentsPage() {
  const { user } = useGlobalStore();
  const { pcaData, hasPCA, isCompleted } = usePCAData();
  const { createNewEvaluationSession, isLoading } = useEvaluationData();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [assessmentProgress, setAssessmentProgress] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAssessmentProgress();
    }
  }, [user]);

  const loadAssessmentProgress = async () => {
    try {
      if (!user?.id) return;
      setLoadingProgress(true);
      const progress = await getDashboardAssessmentSummary(user.id);
      setAssessmentProgress(progress);
    } catch (error) {
      console.error("Error loading assessment progress:", error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const getPCAStatus = () => {
    if (!hasPCA) return "not_started";
    if (hasPCA && !isCompleted) return "in_progress";
    return "completed";
  };

  const pcaStatus = getPCAStatus();

  const handleInviteEvaluators = async () => {
    try {
      // Create a new evaluation session
      await createNewEvaluationSession({
        title: "360 Degree Evaluation",
        description: "Comprehensive evaluation from multiple perspectives",
      });

      // Navigate to the evaluator invitation page
      window.location.href = "/dashboard/assessments/evaluators";
    } catch (error) {
      console.error("Error creating evaluation session:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Assessments
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Professional Assessments
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete your professional assessments to unlock personalized
            insights about your competencies, cognitive abilities, and ideal
            career path. Each assessment provides valuable data for your
            professional development.
          </p>
        </div>

        {/* Progress Overview - API Driven */}
        {!loadingProgress && assessmentProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white rounded-lg p-3 mr-4 shadow-sm">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {user.name
                      ? `Welcome back, ${user.name.split(" ")[0]}!`
                      : "Welcome!"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Complete all assessments to unlock your full professional
                    profile
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {assessmentProgress.completedAssessments}/
                  {assessmentProgress.totalAssessments}
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Overall Progress
                </span>
                <span className="text-sm text-gray-600">
                  {assessmentProgress.overallCompletion}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${assessmentProgress.overallCompletion}%`,
                  }}
                />
              </div>
            </div>

            {/* Individual Assessment Status */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {assessmentProgress.assessments.map((assessment: any) => (
                <div
                  key={assessment.type}
                  className="bg-white rounded-lg p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {assessment.name}
                    </h4>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        assessment.status === "completed"
                          ? "bg-green-500"
                          : assessment.status === "in_progress"
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div className="text-xs text-gray-600 capitalize mb-1">
                    {assessment.status.replace("_", " ")}
                  </div>
                  {assessment.stats &&
                    Object.keys(assessment.stats).length > 0 && (
                      <div className="text-xs text-gray-500">
                        {assessment.type === "mil" &&
                          assessment.stats.totalAttempts > 0 &&
                          `${assessment.stats.totalAttempts} attempts, ${assessment.stats.bestScore}% best`}
                        {assessment.type === "evaluation" &&
                          assessment.stats.totalEvaluators > 0 &&
                          `${assessment.stats.totalEvaluators} evaluators, ${assessment.stats.completedEvaluations} completed`}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {loadingProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-gray-600">
                Loading your assessment progress...
              </p>
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
                    1. Personal Competence Analysis (PCA)
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

          {/* 2. LIA Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  2. Labor Intelligence Assessment (LIA)
                </h2>
                <p className="text-gray-600 mb-6">
                  Assess your cognitive abilities through pattern recognition,
                  verbal reasoning, and problem-solving tasks
                </p>
              </div>
            </div>

            <a
              href="/dashboard/assessments/mil"
              className="inline-flex items-center justify-center w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Start LIA Assessment
            </a>
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
            </div>

            <div className="space-y-3">
              <button
                onClick={handleInviteEvaluators}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {isLoading ? "Loading..." : "Invite Evaluators"}
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
              <h4 className="font-medium text-gray-900 mb-2">LIA Assessment</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• 5 cognitive subtests</li>
                <li>• Pattern recognition & reasoning</li>
                <li>• 15-20 minutes total</li>
                <li>• Available now</li>
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
