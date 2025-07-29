"use client";

import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [selectedJCA, setSelectedJCA] = useState<JCACode>("GTCML");
  const [activeTab, setActiveTab] = useState<"results" | "competences" | "gap">(
    "results"
  );

  const handleGetResults = async () => {
    setLoading(true);
    try {
      const data = await getPCAResult(pcaCod);
      setResults(data);
      console.log("PCA Results:", data);
    } catch (error) {
      console.error("Error getting PCA results:", error);
      setResults({
        error: error instanceof Error ? error.message : "Failed to get results",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetCompetences = async () => {
    setLoading(true);
    try {
      const data = await getPCACompetences(pcaCod);
      setResults(data);
      console.log("PCA Competences:", data);
    } catch (error) {
      console.error("Error getting PCA competences:", error);
      setResults({
        error:
          error instanceof Error ? error.message : "Failed to get competences",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetGapAnalysis = async () => {
    setLoading(true);
    try {
      const data = await getPCAVsJCAAnalysis(pcaCod, selectedJCA);
      setResults(data);
      console.log("PCA Gap Analysis:", data);
    } catch (error) {
      console.error("Error getting gap analysis:", error);
      setResults({
        error:
          error instanceof Error ? error.message : "Failed to get gap analysis",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            PCA Results & Analysis
          </h3>
          <p className="text-sm text-gray-600">
            PCA Code:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">{pcaCod}</code>
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("results")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "results"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          PCA Results
        </button>
        <button
          onClick={() => setActiveTab("competences")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "competences"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Competences
        </button>
        <button
          onClick={() => setActiveTab("gap")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "gap"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Gap Analysis
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "results" && (
          <div>
            <p className="text-gray-600 mb-4">
              Get the complete PCA assessment results.
            </p>
            <button
              onClick={handleGetResults}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Get PCA Results"}
            </button>
          </div>
        )}

        {activeTab === "competences" && (
          <div>
            <p className="text-gray-600 mb-4">
              Get competences analysis from the PCA assessment.
            </p>
            <button
              onClick={handleGetCompetences}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Get Competences"}
            </button>
          </div>
        )}

        {activeTab === "gap" && (
          <div>
            <p className="text-gray-600 mb-4">
              Compare PCA results with job competency analysis (JCA).
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-medium text-gray-700">
                Select Position:
              </label>
              <select
                value={selectedJCA}
                onChange={(e) => setSelectedJCA(e.target.value as JCACode)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(JCA_CODES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGetGapAnalysis}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Get Gap Analysis"}
            </button>
          </div>
        )}
      </div>

      {/* Results Display */}
      {results && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">API Response:</h4>
          {results.error ? (
            <div className="text-red-600 text-sm">{results.error}</div>
          ) : (
            <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(results, null, 2)}
            </pre>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-medium text-blue-800 mb-2">💡 Next Steps</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Complete the assessment first before getting results</li>
          <li>• Use the PCA Code to retrieve results and analysis</li>
          <li>• Gap analysis compares your results with job requirements</li>
          <li>• Results can be used for career planning and development</li>
        </ul>
      </div>
    </div>
  );
}
