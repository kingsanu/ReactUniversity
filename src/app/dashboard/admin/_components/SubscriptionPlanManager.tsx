"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "one_time" | "monthly" | "yearly";
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isMockData?: boolean;
}

interface CreatePlanData {
  name: string;
  price: number;
  interval: "one_time" | "monthly" | "yearly";
  features: string[];
}

const PLAN_INTERVALS = [
  { value: "one_time", label: "One Time", description: "Single payment" },
  { value: "monthly", label: "Monthly", description: "Recurring monthly" },
  { value: "yearly", label: "Yearly", description: "Recurring yearly" },
] as const;

export function SubscriptionPlanManager() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<CreatePlanData>({
    name: "",
    price: 0,
    interval: "monthly",
    features: [""],
  });

  // Fetch all subscription plans
  const fetchPlans = async () => {
    try {
      setLoading(true);

      // Import the subscription service functions
      const { fetchSubscriptionPlans } = await import(
        "@/services/subscriptionService"
      );

      // Use the service function which handles API calls and fallbacks
      const subscriptionData = await fetchSubscriptionPlans();

      console.log("📥 Received subscription data:", subscriptionData);
      console.log("📥 Billing options:", subscriptionData.billingOptions);

      // Check if this is real API data or mock data
      // Mock data typically has IDs like "one-time", "monthly", "yearly"
      const hasRealPlans = subscriptionData.billingOptions.some(
        (plan) =>
          plan.id && !["one-time", "monthly", "yearly"].includes(plan.id)
      );

      console.log("🔍 Has real plans?", hasRealPlans);

      // Extract the billing options (plans) from the response
      const plansData = subscriptionData.billingOptions.map((plan) => {
        const isMockPlan = ["one-time", "monthly", "yearly"].includes(plan.id);
        console.log(
          `📋 Processing plan: ${plan.name} (ID: ${plan.id}) - Mock: ${isMockPlan}`
        );

        return {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          interval:
            plan.period === "month"
              ? ("monthly" as const)
              : plan.period === "year"
              ? ("yearly" as const)
              : ("one_time" as const),
          features: plan.features,
          isActive: true, // Default to active for now
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "system",
          updatedBy: "system",
          isMockData: isMockPlan,
        };
      });

      // Show all plans - both real and mock
      setPlans(plansData);
      console.log("✅ Final plans set:", plansData);

      // Clear any previous errors if we got data (even if mock)
      setError(null);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  // Create new subscription plan
  const createPlan = async (planData: CreatePlanData) => {
    try {
      console.log("🔄 Creating plan with data:", planData);

      const { createSubscriptionPlan } = await import(
        "@/services/subscriptionService"
      );

      // Transform the data to match API expectations
      const apiPayload = {
        name: planData.name,
        price: planData.price,
        interval:
          planData.interval === "monthly"
            ? "month"
            : planData.interval === "yearly"
            ? "year"
            : "one_time",
        features: planData.features,
        description: `${planData.name} subscription plan`,
      };

      console.log("📤 Sending API payload:", apiPayload);

      const result = await createSubscriptionPlan(apiPayload);
      console.log("✅ Plan created successfully:", result);

      console.log("🔄 Refreshing plans list...");
      await fetchPlans(); // Refresh the list

      setShowCreateModal(false);
      resetForm();

      console.log("✅ Plan creation process completed");
    } catch (err) {
      console.error("❌ Failed to create plan:", err);
      alert(
        `Failed to create plan: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  // Update subscription plan
  const updatePlan = async (
    planId: string,
    planData: CreatePlanData & { isActive: boolean }
  ) => {
    try {
      const { updateSubscriptionPlan } = await import(
        "@/services/subscriptionService"
      );

      // Transform the data to match API expectations
      const apiPayload = {
        name: planData.name,
        price: planData.price,
        interval:
          planData.interval === "monthly"
            ? "month"
            : planData.interval === "yearly"
            ? "year"
            : "one_time",
        features: planData.features,
        description: `${planData.name} subscription plan`,
        isActive: planData.isActive,
      };

      await updateSubscriptionPlan(planId, apiPayload);
      await fetchPlans(); // Refresh the list
      setEditingPlan(null);
      resetForm();
    } catch (err) {
      console.error("Failed to update plan:", err);
      alert(
        `Failed to update plan: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  // Delete (deactivate) subscription plan
  const deletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to deactivate this plan?")) {
      return;
    }

    try {
      const { deleteSubscriptionPlan } = await import(
        "@/services/subscriptionService"
      );

      await deleteSubscriptionPlan(planId);
      await fetchPlans(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete plan:", err);
      alert(
        `Failed to delete plan: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      interval: "monthly",
      features: [""],
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.name.trim() ||
      formData.price <= 0 ||
      formData.features.some((f) => !f.trim())
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if we already have 3 real plans and trying to create a new one
    const realPlans = plans.filter((p) => !p.isMockData);
    if (!editingPlan && realPlans.length >= 3) {
      alert(
        "Maximum of 3 subscription plans allowed (one-time, monthly, yearly)"
      );
      return;
    }

    // Check if interval already exists among real plans (when creating)
    if (!editingPlan) {
      const existingInterval = realPlans.find(
        (p) => p.interval === formData.interval
      );
      if (existingInterval) {
        alert(
          `A ${formData.interval} plan already exists. Please choose a different interval.`
        );
        return;
      }
    }

    const cleanedFeatures = formData.features
      .filter((f) => f.trim())
      .map((f) => f.trim());

    if (editingPlan) {
      await updatePlan(editingPlan.id, {
        ...formData,
        features: cleanedFeatures,
        isActive: editingPlan.isActive,
      });
    } else {
      await createPlan({ ...formData, features: cleanedFeatures });
    }
  };

  // Handle edit
  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      interval: plan.interval,
      features: plan.features.length > 0 ? plan.features : [""],
    });
    setShowCreateModal(true);
  };

  // Add feature field
  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  // Remove feature field
  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Update feature
  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading subscription plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-semibold">
            Failed to load subscription plans
          </p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>

        {error.includes("token") || error.includes("Authentication") ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left max-w-md mx-auto">
            <h4 className="font-medium text-yellow-800 mb-2">
              🔑 Token Required
            </h4>
            <p className="text-sm text-yellow-700 mb-2">
              You need a real JWT token to access subscription plan APIs.
            </p>
            <p className="text-sm text-yellow-700">
              Go to <strong>Settings</strong> →{" "}
              <strong>Token Management</strong> to set a real token.
            </p>
          </div>
        ) : null}

        <div className="space-x-2">
          <button
            onClick={fetchPlans}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          {(error.includes("token") || error.includes("Authentication")) && (
            <button
              onClick={() =>
                (window.location.href = "/dashboard/admin/settings")
              }
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Go to Settings
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mock Data Warning */}
      {plans.some((plan) => plan.isMockData) && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="font-medium text-orange-800 mb-1">
                Mock Data Displayed
              </h4>
              <p className="text-sm text-orange-700">
                The plans shown below are mock data because no real subscription
                plans exist in the database yet. Create your first real plan to
                start managing actual subscription data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Subscription Plans
          </h2>
          <p className="text-gray-600 text-sm">
            Manage your subscription plans (max 3 real plans: one-time, monthly,
            yearly)
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              console.log("🔄 Refreshing plans...");
              fetchPlans();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Refresh
          </button>
          {plans.some((p) => p.isMockData) && (
            <button
              onClick={() => {
                setPlans(plans.filter((p) => !p.isMockData));
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              Hide Mock Data
            </button>
          )}
          <button
            onClick={() => {
              const realPlansCount = plans.filter((p) => !p.isMockData).length;
              if (realPlansCount >= 3) {
                alert("Maximum of 3 subscription plans allowed");
                return;
              }
              setShowCreateModal(true);
              setEditingPlan(null);
              resetForm();
            }}
            disabled={plans.filter((p) => !p.isMockData).length >= 3}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              plans.filter((p) => !p.isMockData).length >= 3
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            Create Plan ({plans.filter((p) => !p.isMockData).length}/3)
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "bg-white rounded-lg border-2 p-6 shadow-sm hover:shadow-md transition-all",
              plan.isActive ? "border-green-200" : "border-red-200"
            )}
          >
            {/* Plan Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                  {plan.isMockData && (
                    <span className="ml-2 text-xs text-orange-600 font-normal">
                      (Mock Data)
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  {plan.interval.replace("_", " ")}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <div
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    plan.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </div>
                {plan.isMockData && (
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Mock
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ${plan.price}
              </span>
              <span className="text-gray-600 ml-1">
                {plan.interval === "one_time" ? "" : `/${plan.interval}`}
              </span>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Features:
              </h4>
              <ul className="space-y-1">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-start text-sm text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

          </motion.div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-[60]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingPlan ? "Edit Plan" : "Create New Plan"}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingPlan(null);
                    resetForm();
                  }}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Plan Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Basic Plan"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="29.99"
                    required
                  />
                </div>

                {/* Interval */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Interval *
                  </label>
                  <select
                    value={formData.interval}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        interval: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {PLAN_INTERVALS.map((interval) => {
                      const realPlans = plans.filter((p) => !p.isMockData);
                      const isDisabled =
                        !editingPlan &&
                        realPlans.some((p) => p.interval === interval.value);
                      return (
                        <option
                          key={interval.value}
                          value={interval.value}
                          disabled={isDisabled}
                        >
                          {interval.label} - {interval.description}
                          {isDisabled ? " (Already exists)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features *
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Unlimited projects"
                          required
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingPlan(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingPlan ? "Update Plan" : "Create Plan"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
