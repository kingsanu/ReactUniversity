"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { debugStripeUrls, getSafeStripeUrls } from "@/utils/debugStripeUrls";

export default function StripeUrlDiagnostic() {
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

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
          <h3 className="text-lg font-semibold">{t('admin.stripeDiagnostic.title')}</h3>
          <p className="text-gray-600 text-sm">{t('admin.stripeDiagnostic.description')}</p>
        </div>
        <button
          onClick={runDiagnostic}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('admin.stripeDiagnostic.runButton')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-red-800 mb-2">{t('admin.stripeDiagnostic.errorTitle')}</h4>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {diagnosticResult && (
        <div className="space-y-4">
          {/* Environment Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">{t('admin.stripeDiagnostic.environmentTitle')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">{t('admin.stripeDiagnostic.nodeEnvLabel')}:</span>{" "}
                <code className="bg-gray-200 px-1 rounded">
                  {diagnosticResult.debugInfo.environment.NODE_ENV ||
                    t('admin.stripeDiagnostic.undefined')}
                </code>
              </div>
              <div>
                <span className="font-medium">{t('admin.stripeDiagnostic.apiBaseLabel')}:</span>{" "}
                <code className="bg-gray-200 px-1 rounded">
                  {diagnosticResult.debugInfo.environment
                    .NEXT_PUBLIC_API_BASE_URL || t('admin.stripeDiagnostic.undefined')}
                </code>
              </div>
            </div>
          </div>

          {/* URL Generation */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">{t('admin.stripeDiagnostic.generatedUrlsTitle')}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">{t('admin.stripeDiagnostic.baseUrlLabel')}:</span>{" "}
                <code className="bg-blue-100 px-1 rounded">
                  {diagnosticResult.safeUrls.baseUrl}
                </code>
              </div>
              <div>
                <span className="font-medium">{t('admin.stripeDiagnostic.successUrlLabel')}:</span>{" "}
                <code className="bg-blue-100 px-1 rounded text-xs">
                  {diagnosticResult.safeUrls.successUrl}
                </code>
              </div>
              <div>
                <span className="font-medium">{t('admin.stripeDiagnostic.cancelUrlLabel')}:</span>{" "}
                <code className="bg-blue-100 px-1 rounded">
                  {diagnosticResult.safeUrls.cancelUrl}
                </code>
              </div>
            </div>
          </div>

          {/* Validation Results */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">{t('admin.stripeDiagnostic.validationTitle')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    diagnosticResult.debugInfo.validation.isAbsoluteSuccess
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                {t('admin.stripeDiagnostic.successUrlAbsolute')}
              </div>
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    diagnosticResult.debugInfo.validation.isAbsoluteCancel
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                {t('admin.stripeDiagnostic.cancelUrlAbsolute')}
              </div>
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    diagnosticResult.debugInfo.validation.hasValidProtocol
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                {t('admin.stripeDiagnostic.validProtocol')}
              </div>
            </div>
          </div>

          {/* Raw Debug Data */}
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-medium cursor-pointer">
              {t('admin.stripeDiagnostic.rawDebugTitle')}
            </summary>
            <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
              {JSON.stringify(diagnosticResult, null, 2)}
            </pre>
          </details>

          {/* Quick Fixes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">💡 {t('admin.stripeDiagnostic.quickFixesTitle')}</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>{t('admin.stripeDiagnostic.quickFixes.checkProtocol')}</li>
              <li>{t('admin.stripeDiagnostic.quickFixes.checkEnvVar')}</li>
              <li>{t('admin.stripeDiagnostic.quickFixes.includeProtocol')}</li>
              <li>{t('admin.stripeDiagnostic.quickFixes.refreshPage')}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
