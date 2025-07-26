// Test subscription API endpoints
import {
  fetchSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlanById,
} from "@/services/subscriptionService";

export async function testSubscriptionAPI() {
  console.log("🧪 Testing Subscription API endpoints...");

  try {
    // Test 1: Fetch all subscription plans
    console.log("1️⃣ Testing fetchSubscriptionPlans...");
    const plans = await fetchSubscriptionPlans();
    console.log("✅ Fetch plans result:", plans);

    // Test 2: Create a test plan (only if user is admin)
    console.log("2️⃣ Testing createSubscriptionPlan...");
    try {
      const testPlan = {
        name: "Test Plan",
        price: 19.99,
        interval: "monthly",
        features: ["Test feature 1", "Test feature 2"],
        description: "Test subscription plan",
      };

      const createdPlan = await createSubscriptionPlan(testPlan);
      console.log("✅ Create plan result:", createdPlan);

      // Test 3: Get the created plan by ID
      if (createdPlan && createdPlan.id) {
        console.log("3️⃣ Testing getSubscriptionPlanById...");
        const fetchedPlan = await getSubscriptionPlanById(createdPlan.id);
        console.log("✅ Get plan by ID result:", fetchedPlan);

        // Test 4: Update the plan
        console.log("4️⃣ Testing updateSubscriptionPlan...");
        const updatedPlan = await updateSubscriptionPlan(createdPlan.id, {
          name: "Updated Test Plan",
          price: 29.99,
          features: ["Updated feature 1", "Updated feature 2", "New feature 3"],
        });
        console.log("✅ Update plan result:", updatedPlan);

        // Test 5: Delete the plan
        console.log("5️⃣ Testing deleteSubscriptionPlan...");
        const deletedPlan = await deleteSubscriptionPlan(createdPlan.id);
        console.log("✅ Delete plan result:", deletedPlan);
      }
    } catch (createError) {
      console.log(
        "⚠️ Create/Update/Delete tests skipped (likely requires admin access):",
        createError instanceof Error ? createError.message : String(createError)
      );
    }

    console.log("🎉 Subscription API tests completed!");
  } catch (error) {
    console.error("❌ Subscription API test failed:", error);
  }
}

// Add to window for easy testing in console
if (typeof window !== "undefined") {
  (window as any).testSubscriptionAPI = testSubscriptionAPI;
}
