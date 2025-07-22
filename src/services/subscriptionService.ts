import { apiRequest } from '@/lib/api/apiClient';

// Subscription Plan Interfaces
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  period: string;
  popular: boolean;
  ctaText: string;
  additionalInfo?: string;
  discount?: number;
  features: string[];
  stripeProductId?: string;
  stripePriceId?: string;
}

export interface SubscriptionData {
  subscription: {
    name: string;
    description: string;
    icon: string;
    features: string[];
  };
  billingOptions: SubscriptionPlan[];
  features: FeatureComparison[];
}

export interface FeatureComparison {
  name: string;
  availability: {
    [billingId: string]: boolean | string;
  };
}

// User Subscription Interfaces
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate?: string;
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPayload {
  userId: string;
  planId: string;
  paymentIntentId: string;
}

export interface UpdateSubscriptionPayload {
  status?: 'active' | 'inactive' | 'cancelled' | 'expired';
  endDate?: string;
}

// Default subscription data (fallback)
const defaultSubscriptionData: SubscriptionData = {
  subscription: {
    name: 'UNIV.365 Premium',
    description: 'Complete access to accelerate your career journey',
    icon: '🎓',
    features: [
      'Complete Platform Access',
      'Advanced Career Analytics',
      'Priority Support',
      'Career Mentorship Program',
      'Unlimited Skill Assessments',
      'Advanced Job Matching Algorithm',
      'Resume Builder Pro',
      'Interview Preparation Tools',
      'Resource Library Access',
      'Community & Networking'
    ]
  },
  billingOptions: [
    {
      id: 'one-time',
      name: 'One-Time Payment',
      description: 'Download PDF Document, limited information',
      price: 15,
      period: 'one-time',
      popular: false,
      ctaText: 'Buy Now',
      additionalInfo: 'Single purchase',
      features: [
        'Download PDF Document',
        'Limited Information Access',
        'Basic Career Guidance',
        'Email Support'
      ]
    },
    {
      id: 'monthly',
      name: 'Monthly Subscription',
      description: 'Complete access to the platform',
      price: 29,
      period: 'month',
      popular: true,
      ctaText: 'Start Monthly',
      additionalInfo: '7-day free trial',
      features: [
        'Everything in One-Time',
        'Complete Platform Access',
        'Advanced Analytics',
        'Priority Support',
        'Career Mentorship',
        'Skill Assessments',
        'Job Matching Algorithm',
        'Resume Builder Pro',
        'Interview Preparation'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Subscription',
      description: 'Complete access with significant savings',
      price: 279,
      originalPrice: 348,
      period: 'year',
      popular: false,
      ctaText: 'Start Yearly',
      additionalInfo: 'Save $69 per year',
      discount: 20,
      features: [
        'Everything in Monthly',
        'Priority Customer Support',
        'Advanced Reporting',
        'Early Access to New Features',
        'Dedicated Account Manager',
        'Custom Training Sessions'
      ]
    }
  ],
  features: [
    {
      name: 'PDF Downloads',
      availability: { 'one-time': true, 'monthly': true, 'yearly': true }
    },
    {
      name: 'Career Analytics',
      availability: { 'one-time': false, 'monthly': true, 'yearly': true }
    },
    {
      name: 'Priority Support',
      availability: { 'one-time': false, 'monthly': true, 'yearly': true }
    },
    {
      name: 'Mentorship Program',
      availability: { 'one-time': false, 'monthly': true, 'yearly': true }
    },
    {
      name: 'Advanced Reporting',
      availability: { 'one-time': false, 'monthly': false, 'yearly': true }
    },
    {
      name: 'Early Access Features',
      availability: { 'one-time': false, 'monthly': false, 'yearly': true }
    },
    {
      name: 'Dedicated Account Manager',
      availability: { 'one-time': false, 'monthly': false, 'yearly': true }
    },
    {
      name: 'Skill Assessments',
      availability: { 'one-time': 'Limited', 'monthly': 'Unlimited', 'yearly': 'Unlimited' }
    },
    {
      name: 'Job Matching',
      availability: { 'one-time': 'Basic', 'monthly': 'Advanced', 'yearly': 'Advanced' }
    },
    {
      name: 'Resume Templates',
      availability: { 'one-time': '3 templates', 'monthly': '50+ templates', 'yearly': '50+ templates' }
    }
  ]
};

// API Functions

/**
 * Fetch subscription plans from API (with fallback to default data)
 */
export async function fetchSubscriptionPlans(): Promise<SubscriptionData> {
  try {
    // TODO: Replace with actual API endpoint when available
    // return apiRequest('/api/subscriptions/plans', { method: 'GET' });
    
    // For now, return default data
    return defaultSubscriptionData;
  } catch (error) {
    console.warn('Failed to fetch subscription plans from API, using default data:', error);
    return defaultSubscriptionData;
  }
}

/**
 * Create a new subscription
 */
export async function createSubscription(
  payload: CreateSubscriptionPayload
): Promise<UserSubscription> {
  return apiRequest('/api/subscriptions', {
    method: 'POST',
    data: payload,
  });
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    return await apiRequest(`/api/subscriptions/user/${userId}`, {
      method: 'GET',
    });
  } catch (error) {
    // Return null if no subscription found
    if ((error as any)?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Update user subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  payload: UpdateSubscriptionPayload
): Promise<UserSubscription> {
  return apiRequest(`/api/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    data: payload,
  });
}

/**
 * Cancel user subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<UserSubscription> {
  return apiRequest(`/api/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
  });
}

/**
 * Get all user subscriptions (history)
 */
export async function getUserSubscriptionHistory(userId: string): Promise<UserSubscription[]> {
  return apiRequest(`/api/subscriptions/user/${userId}/history`, {
    method: 'GET',
  });
}

/**
 * Helper function to check if user has active subscription
 */
export function hasActiveSubscription(subscription: UserSubscription | null): boolean {
  if (!subscription) return false;
  
  const now = new Date();
  const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
  
  return subscription.status === 'active' && (!endDate || endDate > now);
}

/**
 * Helper function to get subscription plan by ID
 */
export function getSubscriptionPlanById(planId: string, plans: SubscriptionPlan[]): SubscriptionPlan | null {
  return plans.find(plan => plan.id === planId) || null;
}
