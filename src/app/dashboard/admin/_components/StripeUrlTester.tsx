"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { debugStripeUrls, getSafeStripeUrls } from "@/utils/debugStripeUrls";

export default function StripeUrlTester() {
  const [testResults, setTestResults] = useState<any>(null);
  const [showTester, setShowTester] = useState(false);
  const { t } = useTranslation();

  const runUrlTest = () => {
    try {
      // Test current environment
      const debugInfo = debugStripeUrls();
      const safeUrls = getSafeStripeUrls();

      const results = {
        success: true,
        debugInfo,
        safeUrls,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
          windowOrigin:
            typeof window !== "undefined"
              ? window.location.origin
              : "N/A (SSR)",
          windowLocation:
            typeof window !== "undefined" ? window.location.href : "N/A (SSR)",
        },
      };

      setTestResults(results);
    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
          windowOrigin:
            typeof window !== "undefined"
              ? window.location.origin
              : "N/A (SSR)",
          windowLocation:
            typeof window !== "undefined" ? window.location.href : "N/A (SSR)",
        },
      });
    }
  };

  if (!showTester) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-yellow-900 mb-1">{t('admin.stripeTester.title')}</h3>
            <p className="text-sm text-yellow-700">{t('admin.stripeTester.description')}</p>
          </div>
          <button
            onClick={() => setShowTester(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
          >
            {t('admin.stripeTester.testButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{t('admin.stripeTester.title')}</h3>
          <p className="text-gray-600 text-sm">{t('admin.stripeTester.descriptionShort')}</p>
        </div>
        <button
          onClick={() => setShowTester(false)}
          className="text-gray-400 hover:text-gray-600"
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

      <div className="space-y-4">
        <button
          onClick={runUrlTest}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('admin.stripeTester.runTest')}
        </button>

        {testResults && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">{t('admin.stripeTester.resultsTitle')}</h4> 

            {testResults.success ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">{t('admin.stripeTester.urlsGeneratedSuccess')}</h5>
                  <div className="text-sm text-green-700">
                    <p>
                      <strong>{t('admin.stripeTester.successUrlLabel')}:</strong>{" "}
                      {testResults.safeUrls.successUrl}
                    </p>
                    <p>
                      <strong>{t('admin.stripeTester.cancelUrlLabel')}:</strong>{" "}
                      {testResults.safeUrls.cancelUrl}
                    </p>
                    <p>
                      <strong>{t('admin.stripeTester.baseUrlLabel')}:</strong> {testResults.safeUrls.baseUrl}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="font-medium text-red-800 mb-2">
                  {t('admin.stripeTester.urlGenerationFailedTitle')}
                </h5>
                <p className="text-sm text-red-700">{testResults.error}</p>
              </div>
            )}

            {/* Environment Info */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2">
                {t('admin.stripeTester.environmentInfo')}
              </h5> 
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>NODE_ENV:</strong> {testResults.environment.NODE_ENV}
                </p>
                <p>
                  <strong>NEXT_PUBLIC_API_BASE_URL:</strong>{" "}
                  {testResults.environment.NEXT_PUBLIC_API_BASE_URL ||
                    "Not set"}
                </p>
                <p>
                  <strong>Window Origin:</strong>{" "}
                  {testResults.environment.windowOrigin}
                </p>
                <p>
                  <strong>Current Location:</strong>{" "}
                  {testResults.environment.windowLocation}
                </p>
              </div>
            </div>

            {/* Debug Info */}
            {testResults.debugInfo && (
              <details className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <summary className="font-medium text-blue-800 cursor-pointer">
                  {t('admin.stripeTester.debugDetails')}
                </summary>
                <pre className="text-xs text-blue-700 mt-2 overflow-x-auto">
                  {JSON.stringify(testResults.debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Quick Fixes */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">💡 {t('admin.stripeTester.quickFixesTitle')}</h5>
          <div className="text-sm text-blue-700 space-y-2">
            <p>
              <strong>{t('admin.stripeTester.quickFixesIfInvalid')}:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>{t('admin.stripeTester.quickFixes.checkDomain')}</li>
              <li>{t('admin.stripeTester.quickFixes.ensureBaseUrl')}</li>
              <li>{t('admin.stripeTester.quickFixes.includeProtocol')}</li>
              <li>{t('admin.stripeTester.quickFixes.verifyDeployment')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
