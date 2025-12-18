# API Endpoints Quick Reference

All endpoints follow the format: `{{baseUrl}}/api/v1/...` or `{{baseUrl}}/api/v1/admin/...`

## Transaction Management

### 1. Get Transaction Statistics

```
GET /api/v1/transactions/stats
Authorization: Bearer {{jwtToken}}

Response: {totalSpent, invoiceCount, lastPaymentMethod, spendingTrend}
Status: 200/401/500
```

### 2. Export Transactions

```
GET /api/v1/transactions/export?format=csv&startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {{jwtToken}}

Response: CSV file (attachment)
Status: 200/400/401/501/500
```

## Payment Methods

### 3. List Payment Methods

```
GET /api/v1/user/payment-methods
Authorization: Bearer {{jwtToken}}

Response: [{ id, type, brand, last4, expiryMonth, expiryYear, isDefault }]
Status: 200/401/500
```

### 4. Create Payment Method

```
POST /api/v1/user/payment-methods
Authorization: Bearer {{jwtToken}}

Response: { clientSecret }
Status: 201/401/500
```

### 5. Delete Payment Method

```
DELETE /api/v1/user/payment-methods/:id
Authorization: Bearer {{jwtToken}}

Response: { success: true, message: "..." }
Status: 200/401/500
```

### 6. Set Default Payment Method

```
PATCH /api/v1/user/payment-methods/:id/default
Authorization: Bearer {{jwtToken}}

Response: { success: true, data: { id, isDefault: true } }
Status: 200/401/500
```

## Subscriptions

### 7. Get Subscription Status

```
GET /api/v1/user/subscription/status
Authorization: Bearer {{jwtToken}}

Response: { hasActiveSubscription, planId, status, expiryDate }
Status: 200/401/500
```

### 8. Create Subscription

```
POST /api/v1/subscriptions
Authorization: Bearer {{jwtToken}}

Body: { planId, paymentMethodId? }
Response: { subscriptionId, planId, status, startDate, nextBillingDate }
Status: 201/400/401/500
```

## Admin - User Management

### 9. List All Users

```
GET /api/v1/admin/users?page=1&limit=20&search=&role=&status=
Authorization: Bearer {{jwtToken}}

Query Params:
  - page (default: 1)
  - limit (default: 20, max: 100)
  - search (name/email)
  - role (student/coach/admin)
  - status (active/inactive)

Response: { items: [...], total, page, limit }
Status: 200/400/401/403/500
```

## Admin - Transaction Management

### 10. List All Transactions

```
GET /api/v1/admin/transactions?page=1&limit=20&search=&status=
Authorization: Bearer {{jwtToken}}

Query Params:
  - page (default: 1)
  - limit (default: 20, max: 100)
  - search (user email/name)
  - status (payment status)

Response: { items: [...], total, page, limit }
Status: 200/400/401/403/500
```

## Admin - Analytics

### 11. Get Platform Analytics

```
GET /api/v1/admin/analytics?period=month
Authorization: Bearer {{jwtToken}}

Query Params:
  - period (week/month/year, default: month)

Response: {
  stats: { totalUsers, totalRevenue, activeCourses, growthRate, monthlyGrowth },
  revenueData: [...],
  userGrowthData: [...],
  topCoaches: [...],
  topCourses: [...],
  recentActivity: [...]
}
Status: 200/400/401/403/500
```

## Error Response Format

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Common Error Codes

| Code            | Meaning                     | Status |
| --------------- | --------------------------- | ------ |
| UNAUTHORIZED    | Missing/invalid JWT         | 401    |
| FORBIDDEN       | User lacks permission       | 403    |
| INVALID_REQUEST | Bad parameters              | 400    |
| NOT_FOUND       | Resource not found          | 404    |
| INTERNAL_ERROR  | Server error                | 500    |
| INVALID_FORMAT  | Invalid format parameter    | 400    |
| INVALID_PAGE    | Invalid page number         | 400    |
| INVALID_LIMIT   | Invalid limit value         | 400    |
| NOT_IMPLEMENTED | Feature not yet implemented | 501    |
| INVALID_PERIOD  | Invalid period parameter    | 400    |

## Testing with curl

```bash
# Get Transaction Stats
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/transactions/stats

# Export Transactions as CSV
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/transactions/export?format=csv" \
  -o transactions.csv

# List Payment Methods
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/user/payment-methods

# Add Payment Method
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/v1/user/payment-methods

# Get Subscription Status
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/user/subscription/status

# Create Subscription
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"planId":"plan_premium_monthly"}' \
  http://localhost:3000/api/v1/subscriptions

# List All Users (Admin)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/v1/admin/users?page=1&limit=20"

# List All Transactions (Admin)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/v1/admin/transactions?page=1&limit=20"

# Get Analytics (Admin)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/v1/admin/analytics?period=month"
```

## Implementation Files

| Endpoint                   | File                                                        |
| -------------------------- | ----------------------------------------------------------- |
| Transaction Stats          | `src/app/api/v1/transactions/stats/route.ts`                |
| Transaction Export         | `src/app/api/v1/transactions/export/route.ts`               |
| Payment Methods (GET/POST) | `src/app/api/v1/user/payment-methods/route.ts`              |
| Payment Methods (DELETE)   | `src/app/api/v1/user/payment-methods/[id]/route.ts`         |
| Set Default Payment        | `src/app/api/v1/user/payment-methods/[id]/default/route.ts` |
| Subscription Status        | `src/app/api/v1/user/subscription/status/route.ts`          |
| Create Subscription        | `src/app/api/v1/subscriptions/route.ts`                     |
| Admin Users                | `src/app/api/v1/admin/users/route.ts`                       |
| Admin Transactions         | `src/app/api/v1/admin/transactions/route.ts`                |
| Admin Analytics            | `src/app/api/v1/admin/analytics/route.ts`                   |

## Documentation Files

- `API_IMPLEMENTATION_GUIDE_2025-12-19.md` - Complete implementation guide with production notes
- `API_IMPLEMENTATION_SUMMARY_2025-12-19.md` - Project summary and status
- `API_REQUIREMENTS_2025-12-15.md` - Original requirements document

## Next Steps

1. Test all endpoints with provided curl commands or Postman
2. Connect to MongoDB for persistent data
3. Integrate Stripe for payment processing
4. Add admin role verification
5. Optimize database queries
6. Add comprehensive error handling
7. Write automated tests
8. Deploy to production

---

**Last Updated**: December 19, 2025  
**Status**: ✅ Ready for Testing
