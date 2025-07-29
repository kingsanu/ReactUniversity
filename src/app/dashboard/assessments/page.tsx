"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  addPCAAssessmentSpanish,
  addPCAAssessmentEnglish,
  PCAAssessmentResponse,
} from "@/services/pcaService";
import PCATestButton from "./_components/PCATestButton";
import PCAResultsPanel from "./_components/PCAResultsPanel";
import { usePCAData } from "@/hooks/usePCAData";

interface PersonalData {
  firstName: string;
  lastName: string;
  idNumber: string;
  gender: "M" | "F";
  email: string;
  userEmail: string;
}

export default function AssessmentsPage() {
  const [currentStep, setCurrentStep] = useState<
    "personal" | "pca" | "mil" | "360"
  >("personal");
  const [personalData, setPersonalData] = useState<PersonalData>({
    firstName: "",
    lastName: "",
    idNumber: "",
    gender: "M",
    email: "",
    userEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [assessmentUrl, setAssessmentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { savePCACode, pcaData } = usePCAData();

  const handlePersonalDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !personalData.firstName ||
      !personalData.lastName ||
      !personalData.email
    ) {
      setError("Please fill in all required fields");
      return;
    }
    setError(null);
    setCurrentStep("pca");
  };

  const handleStartPCA = async (language: "spanish" | "english") => {
    setLoading(true);
    setError(null);

    try {
      const userData = {
        PerNom: personalData.firstName,
        PerApe: personalData.lastName,
        PerNumIde: personalData.idNumber,
        PerGen: personalData.gender,
        permail: personalData.email,
        JcaCod: "",
        BillingCenter: "",
        UserMail: personalData.userEmail || personalData.email,
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

  const handleBackToPersonal = () => {
    setCurrentStep("personal");
    setAssessmentUrl(null);
    setError(null);
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
                onClick={handleBackToPersonal}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Assessments
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessments</h1>
          <p className="text-gray-600">
            Complete your professional assessments to unlock insights
          </p>
        </div>

        {/* Development Test Button */}
        {process.env.NODE_ENV === "development" && <PCATestButton />}

        {/* Personal Data Step */}
        {currentStep === "personal" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-6 mb-6"
          >
            <div className="flex items-center mb-6">
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
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Data
                </h2>
                <p className="text-gray-600">
                  Capture the user's personal data before beginning the
                  evaluations.
                </p>
              </div>
            </div>

            <form onSubmit={handlePersonalDataSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={personalData.firstName}
                    onChange={(e) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={personalData.lastName}
                    onChange={(e) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Number
                  </label>
                  <input
                    type="text"
                    value={personalData.idNumber}
                    onChange={(e) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        idNumber: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={personalData.gender}
                    onChange={(e) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        gender: e.target.value as "M" | "F",
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={personalData.email}
                  onChange={(e) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email (Optional)
                </label>
                <input
                  type="email"
                  value={personalData.userEmail}
                  onChange={(e) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      userEmail: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave empty to use main email"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue to Assessments
              </button>
            </form>
          </motion.div>
        )}

        {/* Assessment Options */}
        {currentStep === "pca" && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={handleBackToPersonal}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              ← Back to Personal Data
            </button>

            {/* PCA Results Panel - Show if we have a PCA code */}
            {pcaData?.pcaCod && (
              <PCAResultsPanel pcaCod={pcaData.pcaCod} onClose={() => {}} />
            )}

            {/* PCA Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                1. Personal Competence Analysis (via API)
              </h2>
              <p className="text-gray-600 mb-6">
                Redirect the user to an external ipsative test.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleStartPCA("spanish")}
                  disabled={loading}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Starting..." : "Start PCA (Spanish)"}
                </button>
                <button
                  onClick={() => handleStartPCA("english")}
                  disabled={loading}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Starting..." : "Start PCA (English)"}
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </motion.div>

            {/* MIL Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                2. MIL
              </h2>
              <p className="text-gray-600 mb-6">
                Conduct internal assessment of logical reasoning and
                problem-solving
              </p>

              <button
                disabled
                className="bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed font-medium"
              >
                Start MIL (Coming Soon)
              </button>
            </motion.div>

            {/* 360 Evaluation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                3. 360 Evaluation
              </h2>
              <p className="text-gray-600 mb-6">
                Invite external evaluators (Parents, Teachers, Friends) before
                prompting the user to perform a self-assessment
              </p>

              <div className="space-y-3">
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed font-medium"
                >
                  Invite Evaluators (Coming Soon)
                </button>
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed font-medium"
                >
                  Start 360 Evaluation (Coming Soon)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
