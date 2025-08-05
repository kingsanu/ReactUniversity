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
              { id: "results", label: "Results" },
              { id: "competences", label: "Competences" },
              { id: "analysis", label: "JCA Analysis" },
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
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(results, null, 2)}
                </pre>
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
