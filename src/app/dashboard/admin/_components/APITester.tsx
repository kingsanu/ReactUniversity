"use client";
import { useState } from "react";
import { motion } from "motion/react";

export function APITester() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testPaymentAPIs = async () => {
    setTesting(true);
    addResult("Starting payment API tests...");

    try {
      // Test Stripe Config
      addResult("Testing Stripe config...");
      const configResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/config`
      );
      addResult(
        `Stripe config: ${configResponse.ok ? "✅ Success" : "❌ Failed"}`
      );

      // Test Create Payment Intent
      addResult("Testing create payment intent...");
      const paymentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/create-payload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId: "test-admin-user",
            amount: 2900,
            currency: "usd",
            description: "Admin test payment",
          }),
        }
      );
      addResult(
        `Payment intent: ${paymentResponse.ok ? "✅ Success" : "❌ Failed"}`
      );

      // Test Subscription Plans API
      addResult("Testing subscription plans API...");
      const plansResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscriptionplan`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      addResult(
        `Subscription plans: ${plansResponse.ok ? "✅ Success" : "❌ Failed"}`
      );

      addResult("All API tests completed!");
    } catch (error) {
      addResult(`❌ Test failed: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const testStripeCheckout = async () => {
    setTesting(true);
    addResult("Testing Stripe checkout session...");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId: "admin-test-user",
            amount: 2900,
            currency: "usd",
            productName: "Admin Test Plan",
            successUrl: `${window.location.origin}/dashboard/admin?test=success`,
            cancelUrl: `${window.location.origin}/dashboard/admin?test=cancelled`,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        addResult("✅ Checkout session created successfully");
        addResult(`Session URL: ${data.sessionUrl}`);
      } else {
        addResult("❌ Checkout session creation failed");
      }
    } catch (error) {
      addResult(`❌ Checkout test failed: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const testRoleAPIs = async () => {
    setTesting(true);
    addResult("Testing Role APIs...");

    try {
      const { testRoleAPIs } = await import("@/services/roleService");

      // Capture console.log output
      const originalLog = console.log;
      console.log = (message: string, ...args: any[]) => {
        addResult(`${message} ${args.length > 0 ? JSON.stringify(args) : ""}`);
        originalLog(message, ...args);
      };

      await testRoleAPIs();

      // Restore console.log
      console.log = originalLog;

      addResult("Role API testing completed!");
    } catch (error) {
      addResult(`❌ Role API test failed: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const testAuthAPIs = async () => {
    setTesting(true);
    addResult("Testing Auth APIs...");

    try {
      const { testAuthAPIs } = await import("@/services/authService");

      // Capture console.log output
      const originalLog = console.log;
      console.log = (message: string, ...args: any[]) => {
        addResult(`${message} ${args.length > 0 ? JSON.stringify(args) : ""}`);
        originalLog(message, ...args);
      };

      await testAuthAPIs();

      // Restore console.log
      console.log = originalLog;

      addResult("Auth API testing completed!");
    } catch (error) {
      addResult(`❌ Auth API test failed: ${error}`);
    } finally {
      setTesting(false);
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
          API Testing Tools
        </h3>
        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
          Development Only
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={testPaymentAPIs}
          disabled={testing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? "Testing..." : "🧪 Test Payment APIs"}
        </button>
        <button
          onClick={testStripeCheckout}
          disabled={testing}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? "Testing..." : "💳 Test Stripe Checkout"}
        </button>
        <button
          onClick={testRoleAPIs}
          disabled={testing}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? "Testing..." : "🎭 Test Role APIs"}
        </button>
        <button
          onClick={testAuthAPIs}
          disabled={testing}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? "Testing..." : "🔐 Test Auth APIs"}
        </button>
        <button
          onClick={clearResults}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          🗑️ Clear Results
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Test Results:
          </h4>
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-xs font-mono text-gray-700">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
