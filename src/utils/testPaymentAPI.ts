// Test utility to verify payment API endpoints
import * as paymentService from "@/services/paymentService";
import * as subscriptionService from "@/services/subscriptionService";

export async function testPaymentAPIs() {
  console.log("🧪 Testing Payment APIs...");

  try {
    // Test 1: Get Stripe Config
    console.log("1. Testing Stripe Config...");
    try {
      const config = await paymentService.getStripeConfig();
      console.log("✅ Stripe Config:", config);
    } catch (error) {
      console.log("❌ Stripe Config failed:", error);
    }

    // Test 2: Create Checkout Session
    console.log("2. Testing Checkout Session Creation...");
    try {
      const checkoutSession = await paymentService.createCheckoutSession({
        userId: "test-user-123",
        amount: 2900,
        currency: "usd",
        productName: "Test Monthly Subscription",
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment-cancelled`,
      });
      console.log("✅ Checkout Session:", checkoutSession);

      // Test 3: Check Payment Status (if we have a session ID)
      if (checkoutSession.sessionId) {
        console.log("3. Testing Payment Status...");
        try {
          const status = await paymentService.getPaymentStatus(
            checkoutSession.sessionId
          );
          console.log("✅ Payment Status:", status);
        } catch (error) {
          console.log("❌ Payment Status failed:", error);
        }
      }
    } catch (error) {
      console.log("❌ Checkout Session failed:", error);
    }

    // Test 4: Get User Payments
    console.log("4. Testing User Payments...");
    try {
      const userPayments = await paymentService.getUserPayments(
        "test-user-123"
      );
      console.log("✅ User Payments:", userPayments);
    } catch (error) {
      console.log("❌ User Payments failed:", error);
    }

    // Test 5: Fetch Subscription Plans
    console.log("5. Testing Subscription Plans...");
    try {
      const plans = await subscriptionService.fetchSubscriptionPlans();
      console.log("✅ Subscription Plans:", plans);
    } catch (error) {
      console.log("❌ Subscription Plans failed:", error);
    }

    // Test 6: Get User Subscription
    console.log("6. Testing User Subscription...");
    try {
      const userSub = await subscriptionService.getUserSubscription(
        "test-user-123"
      );
      console.log("✅ User Subscription:", userSub);
    } catch (error) {
      console.log("❌ User Subscription failed:", error);
    }
  } catch (error) {
    console.error("❌ Test suite failed:", error);
  }
}

// Helper function to test individual billing options
export async function testBillingOption(billingOptionId: string) {
  console.log(`🧪 Testing billing option: ${billingOptionId}`);

  try {
    // Get amount based on billing option
    const amounts = {
      "one-time": 1500, // $15.00
      monthly: 2900, // $29.00
      yearly: 27900, // $279.00
    };

    const amount = amounts[billingOptionId as keyof typeof amounts] || 2900;

    const checkoutSession = await paymentService.createCheckoutSession({
      userId: "test-user-123",
      amount,
      currency: "usd",
      productName: `Test ${billingOptionId} Subscription`,
      successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/payment-cancelled`,
    });

    console.log(`✅ Checkout Session for ${billingOptionId}:`, checkoutSession);
    return checkoutSession;
  } catch (error) {
    console.log(`❌ Failed to test ${billingOptionId}:`, error);
  }
}

// Test all billing options
export async function testAllBillingOptions() {
  console.log("🧪 Testing all billing options...");

  const billingOptions = ["one-time", "monthly", "yearly"];

  for (const option of billingOptions) {
    await testBillingOption(option);
    // Add delay between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Test checkout session redirect flow
export async function testCheckoutFlow(billingOptionId: string) {
  console.log(`🧪 Testing checkout flow for: ${billingOptionId}`);

  try {
    // Get amount based on billing option
    const amounts = {
      "one-time": 1500, // $15.00
      monthly: 2900, // $29.00
      yearly: 27900, // $279.00
    };

    const amount = amounts[billingOptionId as keyof typeof amounts] || 2900;

    // Step 1: Create checkout session
    const checkoutSession = await paymentService.createCheckoutSession({
      userId: "test-user-123",
      amount,
      currency: "usd",
      productName: `${billingOptionId} Subscription`,
      successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/payment-cancelled`,
    });

    console.log(
      "Step 1 - Checkout Session created:",
      checkoutSession.sessionId
    );

    if (checkoutSession.sessionUrl) {
      console.log(
        "Step 2 - Session URL available:",
        checkoutSession.sessionUrl
      );

      // Ask user if they want to test the redirect
      const testRedirect = confirm(
        `Checkout session created successfully!\n\nWould you like to test the redirect to Stripe?\n\nSession ID: ${checkoutSession.sessionId}`
      );

      if (testRedirect) {
        window.location.href = checkoutSession.sessionUrl;
      }

      return checkoutSession;
    }
  } catch (error) {
    console.error(`❌ Checkout flow failed for ${billingOptionId}:`, error);
  }
}

// Mock payment flow test (for demo purposes)
export async function testMockPaymentFlow(billingOptionId: string) {
  console.log(`🧪 Testing mock payment flow for: ${billingOptionId}`);

  try {
    // Get amount based on billing option
    const amounts = {
      "one-time": 1500, // $15.00
      monthly: 2900, // $29.00
      yearly: 27900, // $279.00
    };

    const amount = amounts[billingOptionId as keyof typeof amounts] || 2900;

    // Step 1: Create checkout session
    const checkoutSession = await paymentService.createCheckoutSession({
      userId: "test-user-123",
      amount,
      currency: "usd",
      productName: `Mock ${billingOptionId} Subscription`,
      successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/payment-cancelled`,
    });

    console.log(
      "Step 1 - Mock Checkout Session created:",
      checkoutSession.sessionId
    );

    // Step 2: Simulate payment processing
    console.log("Step 2 - Simulating payment processing...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 3: Mock subscription creation
    if (checkoutSession.sessionId) {
      try {
        const subscription = await subscriptionService.createSubscription({
          userId: "test-user-123",
          planId: billingOptionId,
          paymentIntentId: checkoutSession.sessionId,
        });

        console.log("Step 3 - Mock Subscription created:", subscription);
        return subscription;
      } catch (error) {
        console.log("Step 3 - Subscription creation skipped (demo mode)");
        return { id: "mock-subscription", status: "active" };
      }
    }
  } catch (error) {
    console.error(`❌ Mock payment flow failed for ${billingOptionId}:`, error);
    throw error;
  }
}

// Test payment amount validation
export function testPaymentValidation() {
  console.log("🧪 Testing payment validation...");

  const testAmounts = [0, -100, 100, 2900, 99999999, 100000000];

  testAmounts.forEach((amount) => {
    const isValid = paymentService.validatePaymentAmount(amount);
    const formatted = paymentService.formatPaymentAmount(amount);
    console.log(`Amount: ${amount} cents (${formatted}) - Valid: ${isValid}`);
  });
}

// Export for use in browser console
if (typeof window !== "undefined") {
  (window as any).testPaymentAPIs = testPaymentAPIs;
  (window as any).testBillingOption = testBillingOption;
  (window as any).testAllBillingOptions = testAllBillingOptions;
  (window as any).testCheckoutFlow = testCheckoutFlow;
  (window as any).testPaymentValidation = testPaymentValidation;
  (window as any).testMockPaymentFlow = testMockPaymentFlow;
}
