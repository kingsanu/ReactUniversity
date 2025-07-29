"use client";

import { useState } from "react";
import {
  authenticateNexaAPI,
  addPCAAssessmentSpanish,
} from "@/services/pcaService";

export default function PCATestButton() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const testPCAAPI = async () => {
    setTesting(true);
    setResult(null);

    try {
      // Test authentication first
      console.log("🔐 Testing Nexa API Authentication...");
      const authResult = await authenticateNexaAPI();
      console.log("✅ Auth Result:", authResult);

      // Test PCA assessment creation
      console.log("📝 Testing PCA Assessment Creation...");
      const testUserData = {
        PerNom: "Test User",
        PerApe: "PCA Assessment",
        PerNumIde: "123456789",
        PerGen: "M" as const,
        permail: "test@example.com",
        JcaCod: "",
        BillingCenter: "",
        UserMail: "test@example.com",
      };

      const pcaResult = await addPCAAssessmentSpanish(testUserData);
      console.log("✅ PCA Result:", pcaResult);

      if (pcaResult.success) {
        setResult(
          `✅ Success!\nPCA Code: ${pcaResult.pcaCod}\nAssessment URL: ${pcaResult.assessmentUrl}`
        );
      } else {
        setResult(`❌ Failed: ${pcaResult.message}`);
      }
    } catch (error) {
      console.error("❌ Test Error:", error);
      setResult(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-yellow-900 mb-1">🧪 PCA API Test</h3>
          <p className="text-sm text-yellow-700">
            Test the Nexa Developments PCA API integration
          </p>
        </div>
        <button
          onClick={testPCAAPI}
          disabled={testing}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm disabled:opacity-50"
        >
          {testing ? "Testing..." : "Test PCA API"}
        </button>
      </div>

      {result && (
        <div
          className={`p-3 rounded-lg text-sm ${
            result.startsWith("✅")
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <pre className="whitespace-pre-wrap font-mono text-xs">{result}</pre>
        </div>
      )}

      <div className="mt-4 text-xs text-yellow-600">
        <p>
          <strong>Note:</strong> This will make real API calls to timshr.com
        </p>
        <p>
          <strong>CoKey:</strong> NXDAPS (Spanish PCA format)
        </p>
        <p>
          <strong>Account:</strong> Nexa Developments
          (8A38EEAA-9B94-474D-BE6A-0AB193DDD98D)
        </p>
      </div>
    </div>
  );
}
