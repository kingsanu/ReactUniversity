// Debug subscription API to see what's actually happening
import { apiRequest } from "@/lib/api/apiClient";

export async function debugSubscriptionAPI() {
  console.log("🧪 === DEBUGGING SUBSCRIPTION API ===");

  try {
    // Test 1: Direct API call to get plans
    console.log("1️⃣ Testing direct API call to /api/subscriptionplan");
    const directResult = await apiRequest("/api/subscriptionplan", {
      method: "GET",
    });
    console.log("📥 Direct API result:", directResult);
    console.log("📥 Type:", typeof directResult);
    console.log("📥 Is array:", Array.isArray(directResult));
    console.log("📥 Length:", directResult?.length);

    if (Array.isArray(directResult)) {
      directResult.forEach((plan, index) => {
        console.log(`📋 Plan ${index + 1}:`, plan);
      });
    }

    // Test 2: Test the service function
    console.log("\n2️⃣ Testing fetchSubscriptionPlans service function");
    const { fetchSubscriptionPlans } = await import(
      "@/services/subscriptionService"
    );
    const serviceResult = await fetchSubscriptionPlans();
    console.log("📥 Service result:", serviceResult);
    console.log("📥 Billing options:", serviceResult.billingOptions);

    // Test 3: Check token
    console.log("\n3️⃣ Checking authentication token");
    const token = localStorage.getItem("token");
    console.log("🔑 Token exists:", !!token);
    console.log("🔑 Token length:", token?.length);
    console.log("🔑 Token preview:", token?.substring(0, 50) + "...");
  } catch (error) {
    console.error("❌ Debug test failed:", error);
  }

  console.log("🧪 === DEBUG COMPLETE ===");
}

// Add to window for easy access
if (typeof window !== "undefined") {
  (window as any).debugSubscriptionAPI = debugSubscriptionAPI;
}
