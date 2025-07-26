"use client";

import { useState } from "react";

// Mock data structure (rich UI)
const mockPlan = {
  id: "monthly",
  name: "Monthly Subscription",
  description: "Complete access to the platform",
  price: 29,
  period: "month",
  popular: true,
  ctaText: "Start Monthly",
  additionalInfo: "7-day free trial",
  features: [
    "Complete Platform Access",
    "Advanced Analytics",
    "Priority Support",
    "Career Mentorship",
  ],
};

// Database data structure (basic fields only)
const dbPlan = {
  id: "67890abcdef",
  name: "Monthly Subscription",
  price: 29,
  interval: "monthly",
  features: [
    "Complete Platform Access",
    "Advanced Analytics",
    "Priority Support",
    "Career Mentorship",
  ],
  isActive: true,
  createdAt: "2025-01-25T10:30:00Z",
  updatedAt: "2025-01-25T10:30:00Z",
};

// Enhanced database plan (with UI enhancements)
const enhancedDbPlan = {
  ...dbPlan,
  description: "Complete access to the platform",
  period: "month",
  popular: true,
  ctaText: "Start Monthly",
  additionalInfo: "7-day free trial",
};

interface PlanCardProps {
  plan: any;
  title: string;
  subtitle: string;
}

function PlanCard({ plan, title, subtitle }: PlanCardProps) {
  return (
    <div className="bg-white rounded-lg border-2 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>

      {/* Popular Badge */}
      {plan.popular && (
        <div className="mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-6">
        <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
        {plan.description && (
          <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
        )}

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-bold text-gray-900">
              ${plan.price}
            </span>
            <span className="text-gray-600 ml-2">
              /{plan.period || plan.interval}
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2 mb-6">
        {plan.features.map((feature: string, index: number) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <svg
                className="w-2 h-2 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="ml-2 text-gray-700 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
          plan.popular
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
      >
        {plan.ctaText || "Subscribe"}
      </button>

      {/* Additional Info */}
      {plan.additionalInfo && (
        <p className="text-center text-sm text-gray-500 mt-3">
          {plan.additionalInfo}
        </p>
      )}

      {/* Data Structure Preview */}
      <details className="mt-4 pt-4 border-t border-gray-200">
        <summary className="text-xs text-gray-500 cursor-pointer">
          View Data Structure
        </summary>
        <pre className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded overflow-x-auto">
          {JSON.stringify(plan, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default function PlanDesignComparison() {
  const [showComparison, setShowComparison] = useState(false);

  if (!showComparison) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900 mb-1">
              🎨 Plan Design Comparison
            </h3>
            <p className="text-sm text-blue-700">
              See the visual difference between mock data and database data
              designs
            </p>
          </div>
          <button
            onClick={() => setShowComparison(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Show Comparison
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Plan Design Comparison</h3>
          <p className="text-gray-600 text-sm">
            Understanding why mock data looks different from database data
          </p>
        </div>
        <button
          onClick={() => setShowComparison(false)}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlanCard
          plan={mockPlan}
          title="Mock Data Design"
          subtitle="Rich UI with all design fields"
        />

        <PlanCard
          plan={dbPlan}
          title="Raw Database Data"
          subtitle="Basic fields only - plain design"
        />

        <PlanCard
          plan={enhancedDbPlan}
          title="Enhanced Database Data"
          subtitle="Database data + UI enhancements"
        />
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-3">Key Differences:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-green-700 mb-2">
              ✅ Mock Data Has:
            </h5>
            <ul className="space-y-1 text-gray-600">
              <li>
                • <code>popular</code> field for badges
              </li>
              <li>
                • <code>ctaText</code> for custom buttons
              </li>
              <li>
                • <code>additionalInfo</code> for extra text
              </li>
              <li>
                • <code>description</code> for plan details
              </li>
              <li>
                • <code>discount</code> & <code>originalPrice</code>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-red-700 mb-2">
              ❌ Database Data Missing:
            </h5>
            <ul className="space-y-1 text-gray-600">
              <li>
                • No <code>popular</code> → No badges
              </li>
              <li>
                • No <code>ctaText</code> → Generic buttons
              </li>
              <li>
                • No <code>additionalInfo</code> → No extra text
              </li>
              <li>
                • No <code>description</code> → Plain appearance
              </li>
              <li>• No discount indicators</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Solution:</strong> The enhanced subscription service now
            automatically adds UI-specific fields to database plans based on
            their interval type, making them look as good as mock data!
          </p>
        </div>
      </div>
    </div>
  );
}
