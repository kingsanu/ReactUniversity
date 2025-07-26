import { createSubscriptionPlan } from "@/services/subscriptionService";

// Three subscription plans based on the mock data structure
const subscriptionPlansToCreate = [
  {
    name: "One-Time Payment",
    description: "Download PDF Document, limited information",
    price: 15,
    interval: "one-time",
    features: [
      "Download PDF Document",
      "Limited Information Access",
      "Basic Career Guidance",
      "Email Support",
    ],
    // UI-specific fields for better design
    popular: false,
    ctaText: "Buy Now",
    additionalInfo: "Single purchase",
  },
  {
    name: "Monthly Subscription",
    description: "Complete access to the platform",
    price: 29,
    interval: "monthly",
    features: [
      "Everything in One-Time",
      "Complete Platform Access",
      "Advanced Analytics",
      "Priority Support",
      "Career Mentorship",
      "Skill Assessments",
      "Job Matching Algorithm",
      "Resume Builder Pro",
      "Interview Preparation",
    ],
    // UI-specific fields for better design
    popular: true,
    ctaText: "Start Monthly",
    additionalInfo: "7-day free trial",
  },
  {
    name: "Yearly Subscription",
    description: "Complete access with significant savings",
    price: 279,
    originalPrice: 348,
    interval: "yearly",
    features: [
      "Everything in Monthly",
      "Priority Customer Support",
      "Advanced Reporting",
      "Early Access to New Features",
      "Dedicated Account Manager",
      "Custom Training Sessions",
    ],
    // UI-specific fields for better design
    popular: false,
    ctaText: "Start Yearly",
    additionalInfo: "Save $69 per year",
    discount: 20,
  },
];

/**
 * Create all three subscription plans
 */
export async function createAllSubscriptionPlans() {
  console.log("🚀 Starting to create subscription plans...");

  const results = [];

  for (const plan of subscriptionPlansToCreate) {
    try {
      console.log(`📝 Creating plan: ${plan.name}...`);

      const result = await createSubscriptionPlan(plan);

      console.log(`✅ Successfully created: ${plan.name}`, result);
      results.push({ success: true, plan: plan.name, data: result });
    } catch (error) {
      console.error(`❌ Failed to create plan: ${plan.name}`, error);
      results.push({ success: false, plan: plan.name, error: error });
    }
  }

  console.log("🏁 Finished creating subscription plans");
  console.log("📊 Results summary:", results);

  return results;
}

/**
 * Create a single subscription plan by index (0, 1, or 2)
 */
export async function createSingleSubscriptionPlan(index: number) {
  if (index < 0 || index >= subscriptionPlansToCreate.length) {
    throw new Error(`Invalid index: ${index}. Must be 0, 1, or 2.`);
  }

  const plan = subscriptionPlansToCreate[index];
  console.log(`📝 Creating plan: ${plan.name}...`);

  try {
    const result = await createSubscriptionPlan(plan);
    console.log(`✅ Successfully created: ${plan.name}`, result);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create plan: ${plan.name}`, error);
    throw error;
  }
}

// Export the plans data for reference
export { subscriptionPlansToCreate };
