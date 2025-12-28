"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createAllSubscriptionPlans,
  createSingleSubscriptionPlan,
  subscriptionPlansToCreate,
} from "@/utils/createSubscriptionPlans";

export default function SubscriptionPlanCreator() {
  const { t } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleCreateAll = async () => {
    setIsCreating(true);
    setShowResults(false);

    try {
      const results = await createAllSubscriptionPlans();
      setResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Error creating plans:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateSingle = async (index: number) => {
    setIsCreating(true);

    try {
      const result = await createSingleSubscriptionPlan(index);
      setResults([
        {
          success: true,
          plan: subscriptionPlansToCreate[index].name,
          data: result,
        },
      ]);
      setShowResults(true);
    } catch (error) {
      console.error("Error creating plan:", error);
      setResults([
        {
          success: false,
          plan: subscriptionPlansToCreate[index].name,
          error: error,
        },
      ]);
      setShowResults(true);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">{t('admin.plans.createTitle')}</h3>

      <div className="space-y-4">
        {/* Create All Button */}
        <div>
          <button
            onClick={handleCreateAll}
            disabled={isCreating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? t('admin.plans.creating') : t('admin.plans.createAll', { count: subscriptionPlansToCreate.length })}
          </button>
        </div>

        {/* Individual Plan Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subscriptionPlansToCreate.map((plan, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">{plan.name}</h4>
              <p className="text-xs text-gray-600 mb-2">
                ${plan.price} / {plan.interval}
              </p>
              <p className="text-xs text-gray-500 mb-3">{plan.description}</p>
              <button
                onClick={() => handleCreateSingle(index)}
                disabled={isCreating}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {isCreating ? t('admin.plans.creating') : t('admin.plans.createThisPlan')}
              </button>
            </div>
          ))}
        </div>

        {/* Results Display */}
        {showResults && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">{t('admin.plans.creationResultsTitle')}</h4>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    result.success
                      ? "bg-green-100 border border-green-300"
                      : "bg-red-100 border border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {result.success ? "✅" : "❌"} {result.plan}
                    </span>
                    {result.success && result.data?.data?.id && (
                      <span className="text-xs text-gray-600">
                        ID: {result.data.data.id}
                      </span>
                    )}
                  </div>
                  {!result.success && result.error && (
                    <p className="text-sm text-red-600 mt-1">
                      Error: {result.error.message || "Unknown error"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plans Preview */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">{t('admin.plans.previewTitle')}</h4>
          <div className="space-y-3">
            {subscriptionPlansToCreate.map((plan, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">{plan.name}</h5>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                    <p className="text-sm font-medium text-green-600">
                      ${plan.price} / {plan.interval}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">
                    Features ({plan.features.length}):
                  </p>
                  <ul className="text-xs text-gray-600 list-disc list-inside">
                    {plan.features.slice(0, 3).map((feature, fIndex) => (
                      <li key={fIndex}>{feature}</li>
                    ))}
                    {plan.features.length > 3 && (
                      <li>{t('admin.plans.moreFeatures', { count: plan.features.length - 3 })}</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
