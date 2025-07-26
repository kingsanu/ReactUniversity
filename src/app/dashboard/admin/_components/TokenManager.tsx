"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  getTokenStatus,
  setRealToken,
  clearTokens,
} from "@/services/tokenService";

export function TokenManager() {
  const [tokenInput, setTokenInput] = useState("");
  const [tokenStatus, setTokenStatus] = useState(getTokenStatus());
  const [message, setMessage] = useState("");
  const [loginEmail, setLoginEmail] = useState("hey@kanishkumar.in");
  const [loginPassword, setLoginPassword] = useState("");

  const refreshStatus = () => {
    setTokenStatus(getTokenStatus());
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const handleSetToken = () => {
    if (!tokenInput.trim()) {
      setMessage("Please enter a token");
      return;
    }

    try {
      setRealToken(tokenInput.trim());
      refreshStatus();
      setMessage(
        "✅ Token set successfully! You can now access subscription plan APIs."
      );
      setTokenInput("");
    } catch (error) {
      setMessage("❌ Failed to set token");
    }
  };

  const handleClearTokens = () => {
    clearTokens();
    refreshStatus();
    setMessage("🗑️ All tokens cleared");
  };

  const handleRawTest = async () => {
    setMessage("🧪 Testing raw API call (like Postman)...");

    try {
      const requestBody = {
        email: loginEmail,
        password: loginPassword,
      };

      console.log(
        "🧪 Raw test - Request body:",
        JSON.stringify(requestBody, null, 2)
      );
      console.log(
        "🧪 Raw test - URL:",
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authapi/login`
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authapi/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("🧪 Raw test - Response status:", response.status);
      console.log(
        "🧪 Raw test - Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      const responseText = await response.text();
      console.log("🧪 Raw test - Response body:", responseText);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.data && data.data.token) {
            setRealToken(data.data.token);
            refreshStatus();
            setMessage("✅ Raw test successful! Token extracted and set.");
          } else {
            setMessage(
              "❌ Raw test: Response missing token in expected format"
            );
          }
        } catch (parseError) {
          setMessage("❌ Raw test: Failed to parse JSON response");
        }
      } else {
        setMessage(`❌ Raw test failed: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      console.error("🧪 Raw test error:", error);
      setMessage(`❌ Raw test error: ${error}`);
    }
  };

  const handleTestLogin = async () => {
    setMessage("🔄 Testing login...");

    try {
      const { login } = await import("@/services/authService");

      // You can replace these with real test credentials
      const result = await login(loginEmail, loginPassword);

      if (result.token) {
        setRealToken(result.token);
        refreshStatus();
        setMessage("✅ Login successful! Token obtained from API.");
      } else {
        setMessage("❌ Login response missing token");
      }
    } catch (error) {
      setMessage(`❌ Login error: ${error}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Token Management
        </h3>
        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          Required for API Access
        </div>
      </div>

      {/* Current Token Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">
          Current Token Status:
        </h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Has Token:</span>
            <span
              className={
                tokenStatus.hasToken ? "text-green-600" : "text-red-600"
              }
            >
              {tokenStatus.hasToken ? "✅ Yes" : "❌ No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Is Test Token:</span>
            <span
              className={
                tokenStatus.isTestToken ? "text-yellow-600" : "text-green-600"
              }
            >
              {tokenStatus.isTestToken ? "⚠️ Yes" : "✅ No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Valid for API:</span>
            <span
              className={
                tokenStatus.isValidForAPI ? "text-green-600" : "text-red-600"
              }
            >
              {tokenStatus.isValidForAPI ? "✅ Yes" : "❌ No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Token Preview:</span>
            <span className="font-mono text-xs">
              {tokenStatus.tokenPreview}
            </span>
          </div>
        </div>
      </div>

      {/* Token Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Real JWT Token:
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
          />
          <button
            onClick={handleSetToken}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Set Token
          </button>
        </div>
      </div>

      {/* Login Credentials */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-3">
          Test Login Credentials:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="admin123"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleTestLogin}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
        >
          🔐 Test Login API
        </button>
        <button
          onClick={handleRawTest}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
        >
          🧪 Raw API Test
        </button>
        <button
          onClick={handleClearTokens}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          🗑️ Clear Tokens
        </button>
        <button
          onClick={refreshStatus}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          🔄 Refresh Status
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          {message}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">
          How to get a real token:
        </h4>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. Use the "Test Login API" button with real credentials</li>
          <li>2. Or manually login via your login page and copy the token</li>
          <li>3. Or paste a JWT token from Postman/API testing</li>
          <li>4. Once set, you can access subscription plan APIs</li>
        </ol>
      </div>
    </motion.div>
  );
}
