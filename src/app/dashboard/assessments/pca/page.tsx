"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useGlobalStore } from "@/store/useGlobalStore";
import {
  addPCAAssessmentSpanish,
  addPCAAssessmentEnglish,
  PCAAssessmentResponse,
} from "@/services/pcaService";
import { usePCAData } from "@/hooks/usePCAData";

export default function PCAAssessmentPage() {
  const { user } = useGlobalStore();
  const { savePCACode } = usePCAData();
  const [gender, setGender] = useState<"M" | "F">("M");
  const [language, setLanguage] = useState<"spanish" | "english">("spanish");
  const [loading, setLoading] = useState(false);
  const [assessmentUrl, setAssessmentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse full name into first and last name
  const parseFullName = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    return { firstName, lastName };
  };

  const handleStartAssessment = async () => {
    if (!user.name || !user.email) {
      setError("User information not available. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { firstName, lastName } = parseFullName(user.name);

      const userData = {
        PerNom: firstName,
        PerApe: lastName,
        PerNumIde: user.id || "",
        PerGen: gender,
        permail: user.email,
        JcaCod: "",
        BillingCenter: "",
        UserMail: user.email,
      };

      let response: PCAAssessmentResponse;
      if (language === "spanish") {
        response = await addPCAAssessmentSpanish(userData);
      } else {
        response = await addPCAAssessmentEnglish(userData);
      }

      if (response.success && response.assessmentUrl) {
        setAssessmentUrl(response.assessmentUrl);

        // Save PCA code for future use
        if (response.pcaCod) {
          savePCACode(response.pcaCod);
        }

        console.log("✅ PCA Assessment Started:", {
          url: response.assessmentUrl,
          pcaCod: response.pcaCod,
        });
      } else {
        setError(response.message || "Failed to start PCA assessment");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start PCA assessment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = "/dashboard";
  };

  if (assessmentUrl) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-semibold text-gray-900">
                PCA Assessment
              </h1>
              <button
                onClick={handleBackToDashboard}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh-4rem)]">
          <iframe
            src={assessmentUrl}
            className="w-full h-full border-0"
            title="PCA Assessment"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBackToDashboard}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personal Competence Analysis
          </h1>
          <p className="text-gray-600">
            Complete your PCA assessment to unlock insights about your
            competencies
          </p>
        </div>

        {/* Assessment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-8"
        >
          {/* User Info Display */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{user.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{user.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">User ID:</span>
                <span className="ml-2 text-gray-900">{user.id}</span>
              </div>
            </div>
          </div>

          {/* Gender Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Gender *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="M"
                  checked={gender === "M"}
                  onChange={(e) => setGender(e.target.value as "M" | "F")}
                  className="mr-2"
                />
                <span className="text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="F"
                  checked={gender === "F"}
                  onChange={(e) => setGender(e.target.value as "M" | "F")}
                  className="mr-2"
                />
                <span className="text-gray-700">Female</span>
              </label>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Assessment Language *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setLanguage("spanish")}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  language === "spanish"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium">Spanish</div>
                <div className="text-sm text-gray-600">
                  Evaluación en Español
                </div>
              </button>
              <button
                onClick={() => setLanguage("english")}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  language === "english"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium">English</div>
                <div className="text-sm text-gray-600">
                  Assessment in English
                </div>
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStartAssessment}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Starting Assessment...
              </div>
            ) : (
              `Start PCA Assessment (${
                language === "spanish" ? "Spanish" : "English"
              })`
            )}
          </button>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              About PCA Assessment
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Personal Competence Analysis evaluates your professional
                competencies
              </li>
              <li>
                • The assessment takes approximately 15-20 minutes to complete
              </li>
              <li>
                • Results will be available on your dashboard after completion
              </li>
              <li>• You can use results for career planning and development</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
