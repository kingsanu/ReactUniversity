# API Requirements Update - 2025-12-15

This document outlines additional API endpoints required to fully support the Transaction Dashboard features (Statistics, Export, and Payment Method Management).

## 1. Transaction Statistics
**Current Issue**: The frontend currently calculates "Total Spent" and "Invoice Count" based only on the *fetched* transactions (current page). This leads to inaccurate statistics if the user has more transactions than the page limit.

**New Endpoint**: `GET /api/v1/transactions/stats`
**Description**: Fetches aggregated statistics for the user's transaction history.
**Response**:
```json
{
  "totalSpent": 2404.99,
  "currency": "USD",
  "invoiceCount": 12,
  "lastPaymentMethod": {
    "type": "visa",
    "last4": "4242",
    "expiry": "12/28"
  },
  "spendingTrend": {
    "percentage": 12,
    "direction": "up" // or "down"
  }
}
```

## 2. Transaction Export
**Current Issue**: The "Export CSV" button currently generates a CSV from only the *loaded* data on the client side. This misses older transactions not currently in the view.

**New Endpoint**: `GET /api/v1/transactions/export`
**Description**: Generates and returns a downloadable export of the user's full transaction history.
**Query Parameters**:
- `format`: `csv` | `pdf` (default: `csv`)
- `startDate`: ISO Date string (optional)
- `endDate`: ISO Date string (optional)
**Response**: Binary file stream (Content-Type: `text/csv` or `application/pdf`)

## 3. Payment Methods Management
**Current Issue**: The "Manage Methods" button is a placeholder. Users need a way to view, add, and remove saved payment methods.

**New Endpoint**: `GET /api/v1/user/payment-methods`
**Description**: Lists all saved payment methods for the user.
**Response**:
```json
[
  {
    "id": "pm_123456789",
    "type": "card",
    "brand": "visa",
    "last4": "4242",
    "expiryMonth": 12,
    "expiryYear": 2028,
    "isDefault": true
  }
]
```

**New Endpoint**: `POST /api/v1/user/payment-methods`
**Description**: Initiates the process to add a new payment method (e.g., returns a Stripe SetupIntent client secret).
**Response**:
```json
{
  "clientSecret": "seti_12345..."
}
```

**New Endpoint**: `DELETE /api/v1/user/payment-methods/:id`
**Description**: Removes a saved payment method.

**New Endpoint**: `PATCH /api/v1/user/payment-methods/:id/default`
**Description**: Sets a specific payment method as the default for future charges.

## 4. Admin Management
**New Endpoint**: `GET /api/admin/users`
**Description**: Fetches a paginated list of all users with filtering capabilities.
**Query Parameters**:
- `page`: number
- `limit`: number
- `search`: string (name/email)
- `role`: string (student/coach/admin)
- `status`: string (active/inactive)
**Response**:
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "status": "active" | "inactive",
      "joinedDate": "string",
      "subscriptionStatus": "active" | "expired" | "none"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

**New Endpoint**: `GET /api/admin/transactions`
**Description**: Fetches a paginated list of all system transactions.
**Query Parameters**:
- `page`, `limit`, `search`
- `status`: string
**Response**: Similar to user transactions but includes `userId` and `userName`.

## 5. Subscription Enforcement
**New Endpoint**: `GET /api/v1/user/subscription/status`
**Description**: Checks if the current user has an active subscription.
**Response**:
```json
{
  "hasActiveSubscription": boolean,
  "planId": "string" | null,
  "status": "active" | "past_due" | "canceled" | "none",
  "expiryDate": "string" | null
}
```

**New Endpoint**: `POST /api/v1/subscriptions`
**Description**: Creates a new subscription (integrates with Stripe).

## 6. Admin Analytics Dashboard
**New Endpoint**: `GET /api/admin/analytics`
**Description**: Fetches comprehensive platform analytics data for the admin dashboard. This endpoint provides aggregated statistics, trends, and insights across the entire platform.
**Query Parameters**:
- `period`: `week` | `month` | `year` (default: `month`) - The time period for analytics data

**Response**:
```json
{
  "stats": {
    "totalUsers": 1234,
    "totalRevenue": 45231.89,
    "activeCourses": 12,
    "growthRate": 12.5,
    "monthlyGrowth": {
      "users": 20.1,          // Percentage change from previous period
      "revenue": 15.0,        // Percentage change from previous period
      "courses": 16.7         // Percentage change from previous period
    }
  },
  "revenueData": [
    {
      "month": "Jan",         // Or "Week 1", "Q1" depending on period
      "revenue": 2400.00,
      "transactions": 24      // Number of transactions in this period
    },
    {
      "month": "Feb",
      "revenue": 1398.00,
      "transactions": 18
    }
    // ... more data points based on period
  ],
  "userGrowthData": [
    {
      "month": "Jan",         // Or "Week 1", "Q1" depending on period
      "users": 400,           // Total active users in this period
      "newUsers": 45          // New user registrations in this period
    },
    {
      "month": "Feb",
      "users": 300,
      "newUsers": 38
    }
    // ... more data points based on period
  ],
  "topCoaches": [
    {
      "id": "coach_123",
      "name": "Dr. Sarah Johnson",
      "earnings": 12500.00,
      "sessions": 48,         // Total completed sessions
      "rating": 4.9           // Average rating from students
    },
    {
      "id": "coach_456",
      "name": "Prof. Michael Chen",
      "earnings": 10800.00,
      "sessions": 42,
      "rating": 4.8
    }
    // Top 5 coaches by earnings
  ],
  "topCourses": [
    {
      "id": "course_123",
      "title": "Advanced Web Development",
      "enrollments": 245,      // Total enrolled students
      "revenue": 12250.00,     // Total revenue generated
      "rating": 4.8            // Average course rating
    },
    {
      "id": "course_456",
      "title": "Data Science Fundamentals",
      "enrollments": 198,
      "revenue": 9900.00,
      "rating": 4.7
    }
    // Top 5 courses by revenue
  ],
  "recentActivity": [
    {
      "type": "user",                              // "user" | "transaction" | "course" | "session"
      "message": "New user registered: John Doe",
      "timestamp": "2025-12-15T10:30:00Z"
    },
    {
      "type": "transaction",
      "message": "Payment completed: $299.99",
      "timestamp": "2025-12-15T10:15:00Z"
    },
    {
      "type": "course",
      "message": "New course published: React Mastery",
      "timestamp": "2025-12-15T10:00:00Z"
    },
    {
      "type": "session",
      "message": "Coaching session completed",
      "timestamp": "2025-12-15T09:45:00Z"
    }
    // Last 10-20 recent activities
  ]
}
```

**Data Details:**

### Stats Card Metrics:
- **totalUsers**: Total number of registered users across all roles
- **totalRevenue**: Sum of all completed transactions (in USD)
- **activeCourses**: Number of published/active courses
- **growthRate**: Overall platform growth percentage
- **monthlyGrowth**: Percentage change compared to previous period for each metric

### Revenue Data Chart:
- Monthly/weekly breakdown of revenue and transaction count
- Used for bar chart visualization
- Should include at least 6 data points for meaningful trends

### User Growth Chart:
- Tracks total active users vs new registrations
- Helps identify user retention and acquisition trends
- Used for line chart visualization

### Top Performers:
- **topCoaches**: Ranked by total earnings in selected period
- Includes session count and average rating for performance context
- **topCourses**: Ranked by total revenue generated
- Includes enrollment count and rating for popularity context

### Recent Activity Feed:
- Real-time platform events in chronological order
- Shows last 10-20 activities
- Types: user registration, transactions, course publications, session completions
- Timestamps should be ISO 8601 format for proper time-ago calculation

**Implementation Notes:**
- All monetary values should be in the platform's base currency (USD)
- Percentages should be rounded to 1 decimal place
- Ratings should be rounded to 1 decimal place (out of 5.0)
- Activity timestamps must be recent (within last 24 hours) for relevance
- Data should be cached for 5-10 minutes to reduce database load
- Admin-only endpoint - requires admin role verification

## 7. Coach Stripe Connect Integration
**Status**: ✅ **Already Implemented** in Postman collection

These endpoints handle Stripe Connect onboarding for coaches to receive payouts.

### Get Coach Bank Account Status
**Endpoint**: `GET /api/v1/coach/bank-account`
**Description**: Returns the coach's bank account connection status and Stripe onboarding link if needed.
**Authentication**: Required (Coach role)

**Response**:
```json
{
  "isConnected": true,
  "accountType": "checking",
  "last4": "6789",
  "bankName": "Example Bank",
  "accountHolderName": "John Doe",
  "onboardingLink": "https://connect.stripe.com/setup/...",
  "requiresOnboarding": false,
  "status": "connected"
}
```

**Response Fields:**
- `isConnected`: Boolean - Whether bank account is linked to Stripe
- `accountType`: String - Type of account ("checking" or "savings")
- `last4`: String - Last 4 digits of account number
- `bankName`: String - Name of the bank
- `accountHolderName`: String - Name on the account
- `onboardingLink`: String - Stripe Connect onboarding URL (if onboarding required)
- `requiresOnboarding`: Boolean - Whether coach needs to complete Stripe onboarding
- `status`: String - Connection status ("connected", "pending", "not_connected")

### Link Coach Bank Account (Generate Stripe Connect URL)
**Endpoint**: `POST /api/v1/coach/bank-account`
**Description**: Initiates Stripe Connect onboarding or links bank account manually. For Stripe Connect (recommended), returns an onboarding URL to redirect the coach to complete setup.
**Authentication**: Required (Coach role)

**Request Body**:
```json
{
  "accountHolderName": "John Doe",
  "bankName": "Example Bank",
  "accountType": "checking",
  "provider": "stripe",
  "accountNumber": "optional",
  "routingNumber": "optional"
}
```

**Request Fields:**
- `provider`: String - Payment provider ("stripe" recommended, or "manual")
- `accountHolderName`: String - Required - Name on the account
- `bankName`: String - Required - Bank name
- `accountType`: String - Required - "checking" or "savings"
- `accountNumber`: String - Optional for Stripe, required for manual
- `routingNumber`: String - Optional for Stripe, required for manual

**Response (Stripe Connect)**:
```json
{
  "success": true,
  "onboardingUrl": "https://connect.stripe.com/setup/s/...",
  "message": "Complete Stripe onboarding to receive payouts",
  "accountId": "acct_1234567890"
}
```

**Response (Manual Entry)**:
```json
{
  "success": true,
  "message": "Bank account linked successfully",
  "accountId": "ba_1234567890",
  "status": "connected"
}
```

**Frontend Implementation Example**:
```typescript
// Call the endpoint
const response = await linkCoachBankAccount({
  provider: "stripe",
  accountHolderName: "John Doe",
  bankName: "Chase",
  accountType: "checking"
});

// Redirect to Stripe Connect onboarding
if (response.onboardingUrl) {
  window.location.href = response.onboardingUrl;
}
```

**Stripe Connect Flow:**
1. Coach clicks "Connect Stripe Account" button
2. Frontend calls `POST /api/v1/coach/bank-account` with provider: "stripe"
3. Backend creates Stripe Connect account and returns onboarding URL
4. Coach is redirected to Stripe's onboarding page
5. Coach completes identity verification and bank account setup on Stripe
6. Stripe redirects back to platform (return URL configured in backend)
7. Backend receives webhook from Stripe confirming account setup
8. Coach can now receive payouts automatically

**Return URLs:**
- Success: `https://yourdomain.com/dashboard/coaching/settings?tab=payments&stripe=success`
- Failure: `https://yourdomain.com/dashboard/coaching/settings?tab=payments&stripe=failed`

**Webhook Events:**
- `account.updated` - Stripe Connect account status changed
- `payout.paid` - Payout successfully transferred to coach's bank account
- `payout.failed` - Payout failed (insufficient funds, account closed, etc.)

**Implementation Notes:**
- Stripe Connect Express is recommended for simplicity
- Backend must handle Stripe webhooks to update account status
- Onboarding URL expires after 7 days
- Coach must complete identity verification (KYC) for payouts
- Minimum payout amount is typically $1.00 USD
- Payout frequency can be set (daily, weekly, monthly)
- Platform commission/fees deducted before payout

