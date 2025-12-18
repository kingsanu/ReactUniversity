# API Implementation Guide - December 2025

This document provides a comprehensive guide for the newly implemented APIs based on the requirements in `API_REQUIREMENTS_2025-12-15.md`.

## ✅ Implemented APIs Overview

All 7 API groups have been implemented with mock data and proper error handling. The endpoints follow the existing codebase patterns and include:

- Authentication via JWT tokens
- Proper HTTP status codes
- Consistent error responses
- Request validation
- Pagination support (where applicable)

## API Implementation Details

### 1. Transaction Statistics API
**Endpoint:** `GET /api/v1/transactions/stats`  
**Location:** `src/app/api/v1/transactions/stats/route.ts`  
**Authentication:** Required (JWT Bearer token)

**Response:**
```json
{
  "success": true,
  "data": {
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
      "direction": "up"
    }
  }
}
```

**Status Codes:**
- `200`: Successfully retrieved statistics
- `401`: Unauthorized (invalid or missing token)
- `500`: Server error

**Production Implementation Notes:**
- Query the transactions collection for the user
- Calculate aggregated totals across all transactions
- Get last payment method from user profile or most recent transaction
- Calculate trend by comparing with previous period

---

### 2. Transaction Export API
**Endpoint:** `GET /api/v1/transactions/export`  
**Location:** `src/app/api/v1/transactions/export/route.ts`  
**Authentication:** Required (JWT Bearer token)

**Query Parameters:**
- `format` (optional): `csv` or `pdf` (default: `csv`)
- `startDate` (optional): ISO date string (e.g., "2025-01-01")
- `endDate` (optional): ISO date string (e.g., "2025-12-31")

**Response:** Binary file stream
- Content-Type: `text/csv` or `application/pdf`
- Content-Disposition: `attachment; filename=transactions.{csv|pdf}`

**Status Codes:**
- `200`: Successfully exported file
- `400`: Invalid format parameter
- `401`: Unauthorized
- `501`: PDF export not implemented
- `500`: Server error

**Production Implementation Notes:**
- Implement CSV generation for all user transactions
- Add optional PDF export using a PDF library (e.g., `pdfkit`, `html2pdf`)
- Filter transactions by date range if parameters provided
- Include comprehensive transaction details (date, description, amount, status, etc.)

---

### 3. Payment Methods Management APIs

#### 3a. List Payment Methods
**Endpoint:** `GET /api/v1/user/payment-methods`  
**Location:** `src/app/api/v1/user/payment-methods/route.ts`  
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": [
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
}
```

#### 3b. Create Payment Method
**Endpoint:** `POST /api/v1/user/payment-methods`  
**Location:** `src/app/api/v1/user/payment-methods/route.ts`  
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "seti_12345..."
  }
}
```

#### 3c. Delete Payment Method
**Endpoint:** `DELETE /api/v1/user/payment-methods/:id`  
**Location:** `src/app/api/v1/user/payment-methods/[id]/route.ts`  
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Payment method deleted successfully"
}
```

#### 3d. Set Default Payment Method
**Endpoint:** `PATCH /api/v1/user/payment-methods/:id/default`  
**Location:** `src/app/api/v1/user/payment-methods/[id]/default/route.ts`  
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Payment method set as default",
  "data": {
    "id": "pm_123456789",
    "isDefault": true
  }
}
```

**Production Implementation Notes:**
- Integrate with Stripe API for payment method management
- Validate payment method belongs to user before operations
- Store payment methods in database with Stripe IDs
- Ensure only one default payment method per user
- Implement proper error handling for Stripe failures

---

### 4. Subscription Status & Creation APIs

#### 4a. Get Subscription Status
**Endpoint:** `GET /api/v1/user/subscription/status`  
**Location:** `src/app/api/v1/user/subscription/status/route.ts`  
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "hasActiveSubscription": true,
    "planId": "plan_premium_monthly",
    "status": "active",
    "expiryDate": "2026-01-15"
  }
}
```

#### 4b. Create Subscription
**Endpoint:** `POST /api/v1/subscriptions`  
**Location:** `src/app/api/v1/subscriptions/route.ts`  
**Authentication:** Required

**Request Body:**
```json
{
  "planId": "plan_premium_monthly",
  "paymentMethodId": "pm_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_abc123",
    "planId": "plan_premium_monthly",
    "status": "active",
    "startDate": "2025-12-19T10:30:00Z",
    "nextBillingDate": "2026-01-18T10:30:00Z"
  }
}
```

**Status Codes:**
- `201`: Subscription created successfully
- `400`: Invalid plan ID or request parameters
- `401`: Unauthorized
- `500`: Server error

**Production Implementation Notes:**
- Validate plan exists in subscription_plans collection
- Integrate with Stripe for subscription creation
- Store subscription in user_subscriptions collection
- Send confirmation email to user
- Handle subscription webhooks for status updates
- Implement renewal logic

---

### 5. Admin Users Management API
**Endpoint:** `GET /api/v1/admin/users`  
**Location:** `src/app/api/v1/admin/users/route.ts`  
**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search by name or email
- `role` (optional): Filter by role (student, coach, admin)
- `status` (optional): Filter by status (active, inactive)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "user_1",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student",
        "status": "active",
        "joinedDate": "2024-01-15",
        "subscriptionStatus": "active"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

**Status Codes:**
- `200`: Successfully retrieved users
- `400`: Invalid pagination parameters
- `401`: Unauthorized
- `403`: Forbidden (non-admin user)
- `500`: Server error

**Production Implementation Notes:**
- Add role-based access control (admin only)
- Query users collection with filters
- Implement efficient pagination
- Include subscription status for each user
- Consider adding sorting options (by joinedDate, name, etc.)

---

### 6. Admin Transactions Management API
**Endpoint:** `GET /api/v1/admin/transactions`  
**Location:** `src/app/api/v1/admin/transactions/route.ts`  
**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search by user email or name
- `status` (optional): Filter by payment status

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "txn_1",
        "userId": "user_1",
        "userName": "John Doe",
        "userEmail": "john@example.com",
        "amount": 299.99,
        "currency": "USD",
        "status": "completed",
        "date": "2025-12-15",
        "description": "Course: Python for Data Science",
        "paymentMethodId": "pm_123",
        "bookingId": "booking_1"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

**Production Implementation Notes:**
- Implement admin-only access control
- Query transactions collection with user details
- Include all transaction fields for complete visibility
- Support filtering by date range (consider adding parameters)
- Include payment method and booking references
- Consider adding export functionality

---

### 7. Admin Analytics Dashboard API
**Endpoint:** `GET /api/v1/admin/analytics`  
**Location:** `src/app/api/v1/admin/analytics/route.ts`  
**Authentication:** Required (Admin role)

**Query Parameters:**
- `period` (optional): Time period - `week`, `month`, or `year` (default: `month`)

**Response:** (Comprehensive analytics data)
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 1234,
      "totalRevenue": 45231.89,
      "activeCourses": 12,
      "growthRate": 12.5,
      "monthlyGrowth": {
        "users": 20.1,
        "revenue": 15.0,
        "courses": 16.7
      }
    },
    "revenueData": [
      {
        "month": "Jan",
        "revenue": 2400.0,
        "transactions": 24
      }
    ],
    "userGrowthData": [
      {
        "month": "Jan",
        "users": 400,
        "newUsers": 45
      }
    ],
    "topCoaches": [
      {
        "id": "coach_123",
        "name": "Dr. Sarah Johnson",
        "earnings": 12500.0,
        "sessions": 48,
        "rating": 4.9
      }
    ],
    "topCourses": [
      {
        "id": "course_123",
        "title": "Advanced Web Development",
        "enrollments": 245,
        "revenue": 12250.0,
        "rating": 4.8
      }
    ],
    "recentActivity": [
      {
        "type": "user",
        "message": "New user registered: John Doe",
        "timestamp": "2025-12-19T10:30:00Z"
      }
    ]
  }
}
```

**Production Implementation Notes:**
- Aggregate data from users, transactions, coaches, courses, and bookings collections
- Calculate growth percentages based on period
- Implement caching (5-10 minutes) to reduce database load
- Query top coaches by earnings in selected period
- Query top courses by revenue/enrollments
- Fetch recent activities in chronological order (last 10-20 items)
- Support different time periods (week/month/year)
- Include proper date range calculations for trend analysis

---

## Implementation Roadmap

### Phase 1: Database Integration (Week 1)
- [ ] Add database queries for transaction statistics
- [ ] Implement aggregation pipelines for analytics
- [ ] Add proper indexes for performance
- [ ] Implement database filters and pagination

### Phase 2: Third-Party Integration (Week 1-2)
- [ ] Integrate Stripe API for payment methods
- [ ] Implement Stripe webhook handlers
- [ ] Add subscription management with Stripe
- [ ] Set up transaction recording from Stripe events

### Phase 3: Admin Role Verification (Week 2)
- [ ] Add role-based access control middleware
- [ ] Verify admin role on all admin endpoints
- [ ] Log admin activities for audit trail
- [ ] Add rate limiting for admin endpoints

### Phase 4: Advanced Features (Week 2-3)
- [ ] Add PDF export functionality
- [ ] Implement caching for analytics
- [ ] Add date range filtering to transactions
- [ ] Add more sorting options

### Phase 5: Testing & Optimization (Week 3)
- [ ] Write comprehensive test cases
- [ ] Performance testing and optimization
- [ ] Error handling and edge cases
- [ ] Documentation update

---

## Testing with Postman

All endpoints are documented in `JwtMongoApi.postman_collection.json`. Use the following variables:
- `jwtToken`: Your JWT token from login
- `userId`: Your user ID

### Example Requests:

```bash
# Get Transaction Stats
GET /api/v1/transactions/stats
Authorization: Bearer {{jwtToken}}

# Export Transactions
GET /api/v1/transactions/export?format=csv&startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {{jwtToken}}

# List Payment Methods
GET /api/v1/user/payment-methods
Authorization: Bearer {{jwtToken}}

# Get Admin Users
GET /api/v1/admin/users?page=1&limit=20&search=&role=&status=
Authorization: Bearer {{jwtToken}}

# Get Analytics
GET /api/v1/admin/analytics?period=month
Authorization: Bearer {{jwtToken}}
```

---

## Error Handling

All endpoints follow a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED`: Missing or invalid JWT token (401)
- `FORBIDDEN`: User lacks required permissions (403)
- `INVALID_REQUEST`: Invalid request parameters (400)
- `NOT_FOUND`: Resource not found (404)
- `INTERNAL_ERROR`: Server error (500)

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Admin endpoints should verify admin role
3. **Validation**: All input parameters should be validated
4. **Rate Limiting**: Consider implementing rate limiting
5. **Audit Logging**: Log all admin operations
6. **Data Privacy**: Ensure sensitive data is not exposed
7. **SQL Injection Prevention**: Use parameterized queries/ORM

---

## Performance Optimization

1. **Database Indexes**: Create indexes on frequently queried fields
2. **Caching**: Cache analytics data (5-10 minute TTL)
3. **Pagination**: Always use pagination for large result sets
4. **Aggregation**: Use MongoDB aggregation pipelines for complex queries
5. **Query Optimization**: Limit returned fields to necessary ones only
6. **Batch Operations**: Combine multiple operations where possible

---

## Next Steps

1. Review this implementation in your codebase
2. Test all endpoints with Postman (use JwtMongoApi.postman_collection.json)
3. Integrate with your database (MongoDB)
4. Add Stripe integration for payment methods
5. Implement role-based access control
6. Add comprehensive error handling
7. Optimize performance with caching
8. Write automated tests
9. Deploy to production

---

## References

- API Requirements: `API_REQUIREMENTS_2025-12-15.md`
- Postman Collection: `JwtMongoApi.postman_collection.json`
- Authentication: `src/lib/auth.ts`
- Existing Services: `src/services/`

---

**Implementation Status:** ✅ All API endpoints created with mock data  
**Last Updated:** December 19, 2025
