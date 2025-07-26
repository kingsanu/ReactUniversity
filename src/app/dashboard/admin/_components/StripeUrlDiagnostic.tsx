"use client";

import { useState } from "react";
import { debugStripeUrls, getSafeStripeUrls } from "@/utils/debugStripeUrls";

export default function StripeUrlDiagnostic() {
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = () => {
    try {
      setError(null);

      // Get debug info
      const debugInfo = debugStripeUrls();

      // Try to get safe URLs
      const safeUrls = getSafeStripeUrls();

      setDiagnosticResult({
        debugInfo,
        safeUrls,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Diagnostic error:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Stripe URL Diagnostic</h3>
          <p className="text-gray-600 text-sm">
            Debug Stripe checkout URL generation issues
          </p>
        </div>
        <button
          onClick={runDiagnostic}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Run Diagnostic
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-red-800 mb-2">❌ Error</h4>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {diagnosticResult && (
        <div className="space-y-4">
          {/* Environment Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">🌍 Environment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">NODE_ENV:</span>{" "}
                <code className="bg-gray-200 px-1 rounded">
                  {diagnosticResult.debugInfo.environment.NODE_ENV ||
                    "undefined"}
                </code>
              </div>
              <div>
                <span className="font-medium">NEXT_PUBLIC_API_BASE_URL:</span>{" "}
                <code className="bg-gray-200 px-1 rounded">
                  {diagnosticResult.debugInfo.environment
                    .NEXT_PUBLIC_API_BASE_URL || "undefined"}
                </code>
              </div>
            </div>
          </div>

          {/* URL Generation */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">🔗 Generated URLs</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Base URL:</span>{" "}
                <code className="bg-blue-100 px-1 rounded">
                  {diagnosticResult.safeUrls.baseUrl}
                </code>
              </div>
              <div>
                <span className="font-medium">Success URL:</span>{" "}
                <code className="bg-blue-100 px-1 rounded text-xs">
                  {diagnosticResult.safeUrls.successUrl}
                </code>
              </div>
              <div>
                <span className="font-medium">Cancel URL:</span>{" "}
                <code className="bg-blue-100 px-1 rounded">
                  {diagnosticResult.safeUrls.cancelUrl}
                </code>
              </div>
            </div>
          </div>

          {/* Validation Results */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">✅ Validation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    diagnosticResult.debugInfo.validation.isAbsoluteSuccess
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                Success URL Absolute
              </div>
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    diagnosticResult.debugInfo.validation.isAbsoluteCancel
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                Cancel URL Absolute
              </div>
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    diagnosticResult.debugInfo.validation.hasValidProtocol
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                Valid Protocol
              </div>
            </div>
          </div>

          {/* Raw Debug Data */}
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-medium cursor-pointer">
              🔍 Raw Debug Data
            </summary>
            <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
              {JSON.stringify(diagnosticResult, null, 2)}
            </pre>
          </details>

          {/* Quick Fixes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">💡 Quick Fixes</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • Make sure you're accessing the site via HTTP/HTTPS (not
                file://)
              </li>
              <li>
                • Check if NEXT_PUBLIC_API_BASE_URL is set correctly in your
                .env file
              </li>
              <li>
                • Ensure your domain includes the protocol
                (https://yourdomain.com)
              </li>
              <li>• Try refreshing the page if running in development</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
