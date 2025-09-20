"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getPCAResult,
  getPCACompetences,
  getPCAVsJCAAnalysis,
  JCA_CODES,
  JCACode,
} from "@/services/pcaService";

interface PCAResultsPanelProps {
  pcaCod: string;
  onClose: () => void;
}

export default function PCAResultsPanel({
  pcaCod,
  onClose,
}: PCAResultsPanelProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [competences, setCompetences] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [selectedJCA, setSelectedJCA] = useState<JCACode>("GTCML");
  const [activeTab, setActiveTab] = useState<
    "results" | "competences" | "analysis"
  >("results");

  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await getPCAResult(pcaCod);
      setResults(data);
    } catch (error) {
      console.error("Failed to load PCA results:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCompetences = async () => {
    setLoading(true);
    try {
      const data = await getPCACompetences(pcaCod, "1"); // TIMS format
      setCompetences(data);
    } catch (error) {
      console.error("Failed to load PCA competences:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const data = await getPCAVsJCAAnalysis(pcaCod, selectedJCA, "g");
      setAnalysis(data);
    } catch (error) {
      console.error("Failed to load PCA analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: "results" | "competences" | "analysis") => {
    setActiveTab(tab);

    switch (tab) {
      case "results":
        if (!results) loadResults();
        break;
      case "competences":
        if (!competences) loadCompetences();
        break;
      case "analysis":
        if (!analysis) loadAnalysis();
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            PCA Results - {pcaCod.slice(0, 8)}...
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "results", label: t("dashboard.results") },
              { id: "competences", label: t("dashboard.competences") },
              { id: "analysis", label: t("dashboard.jcaAnalysis") },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === "results" && !loading && (
            <div>
              {results ? (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-gray-900">
                          {results.data?.perNom} {results.data?.perApe}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">ID:</span>
                        <span className="ml-2 text-gray-900">
                          {results.data?.perNumIde}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Gender:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {results.data?.perGen === "M" ? "Male" : "Female"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {results.data?.perMail}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DISC Profile Scores */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      DISC Profile Scores
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Primary Scores */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">
                          Primary Dimensions
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-600">
                              Dominance (D)
                            </span>
                            <span className="text-sm font-bold">
                              {results.data?.pcaD1 || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${results.data?.pcaD1 || 0}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">
                              Influence (I)
                            </span>
                            <span className="text-sm font-bold">
                              {results.data?.pcaI1 || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${results.data?.pcaI1 || 0}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-yellow-600">
                              Steadiness (S)
                            </span>
                            <span className="text-sm font-bold">
                              {results.data?.pcaS1 || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${results.data?.pcaS1 || 0}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-600">
                              Conscientiousness (C)
                            </span>
                            <span className="text-sm font-bold">
                              {results.data?.pcaC1 || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${results.data?.pcaC1 || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Secondary Scores */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">
                          Secondary Dimensions
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-400">
                              Dominance 2 (D2)
                            </span>
                            <span className="text-sm font-bold">
                              {results.data?.pcaD2 || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${results.data?.pcaD2 || 0}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-400">
                              Influence 2 (I2)
                            </span>
                            <span className="text-sm font-bold">
                              {results.data?.pcaI2 || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${results.data?.pcaI2 || 0}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-yellow-400">
                              Steadiness 2 (S2)
                            </span>
                            <span className="text-sm font-bold">
                              {results.data?.pcaS2 || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${results.data?.pcaS2 || 0}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-400">
                              Conscientiousness 2 (C2)
                            </span>
                            <span className="text-sm font-bold">
                              {results.data?.pcaC2 || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${results.data?.pcaC2 || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Assessment Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          PCA Code:
                        </span>
                        <span className="ml-2 text-gray-900 font-mono">
                          {results.data?.pcaCod}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Date:</span>
                        <span className="ml-2 text-gray-900">
                          {results.data?.pcaFec}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Time:</span>
                        <span className="ml-2 text-gray-900">
                          {results.data?.pcaHor}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Report Link:
                        </span>
                        <a
                          href={results.data?.pcaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 underline"
                        >
                          View Full Report
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Image Report */}
                  {results.data?.pcaImg && (
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Visual Report
                      </h3>
                      <div className="text-center">
                        <a
                          href={results.data.pcaImg}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Visual Report
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <button
                    onClick={loadResults}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Load Results
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Competences Tab */}
          {activeTab === "competences" && !loading && (
            <div>
              {competences ? (
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(competences, null, 2)}
                </pre>
              ) : (
                <div className="text-center py-8">
                  <button
                    onClick={loadCompetences}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Load Competences
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === "analysis" && !loading && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select JCA for Analysis:
                </label>
                <select
                  value={selectedJCA}
                  onChange={(e) => {
                    setSelectedJCA(e.target.value as JCACode);
                    setAnalysis(null); // Reset analysis when JCA changes
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(JCA_CODES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {analysis ? (
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(analysis, null, 2)}
                </pre>
              ) : (
                <div className="text-center py-8">
                  <button
                    onClick={loadAnalysis}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Load Analysis for {JCA_CODES[selectedJCA]}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
