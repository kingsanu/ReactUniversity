
# API Requirements

This document consolidates all API requirements for the TimCare platform.

## 1. User Profile
**Endpoint**: `GET /api/v1/user/profile`
**Description**: Fetches the current user's profile details.
**Response**:
```json
{
  "id": "string",
  "fullName": "string",
  "email": "string",
  "headline": "string",
  "bio": "string",
  "location": "string",
  "phone": "string",
  "avatarUrl": "string",
  "coverUrl": "string",
  "socialLinks": { "website": "string", "linkedin": "string", "twitter": "string", "github": "string" },
  "skills": ["string"],
  "stats": { "coursesCompleted": "number", "applicationsSubmitted": "number", "mentorshipSessions": "number" }
}
```

**Endpoint**: `PUT /api/v1/user/profile`
**Description**: Updates the user's personal information.

**Endpoint**: `POST /api/v1/user/profile/avatar`
**Description**: Uploads a new profile picture.

**Endpoint**: `POST /api/v1/user/profile/cover`
**Description**: Uploads a new cover background image.

**Endpoint**: `GET /api/v1/user/activity`
**Description**: Fetches recent user activities.

**Endpoint**: `PATCH /api/v1/user/settings`
**Description**: Updates user interactions preferences (notifications, theme).

## 2. Transactions (User)
**Endpoint**: `GET /api/v1/transactions`
**Description**: Fetches a paginated list of transactions.
**Response**: `items: [{ id, amount, currency, status, date, description, method }]`

**Endpoint**: `GET /api/v1/transactions/:id`
**Description**: Fetches transaction details.

**Endpoint**: `POST /api/stripe/create-checkout-session`
**Description**: Creates a Stripe Checkout session for payments.

## 3. Coach Earnings (Coach)
**Endpoint**: `GET /api/v1/coach/me/earnings`
**Description**: Fetches current earning statistics.
**Response**:
```json
{
  "totalEarnings": "number",
  "pendingPayout": "number",
  "lastPayoutAmount": "number",
  "lastPayoutDate": "ISO8601 string"
}
```

**Endpoint**: `GET /api/v1/coach/me/earnings/history`
**Description**: List of earning events (sessions).
**Response**: `[{ date, description, amountGross, platformFee, amountNet, status }]`

## 4. Coach Payout Settings (Coach)
**Endpoint**: `GET /api/v1/coach/me/payout-settings`
**Description**: Fetches payout configuration.
**Response**: `frequency: "biweekly"|"monthly", method: "stripe"|"bank_transfer"`

**Endpoint**: `PUT /api/v1/coach/me/payout-settings`
**Description**: Updates payout frequency.

## 5. Super Admin Payouts (Admin)
**Endpoint**: `GET /api/v1/admin/payouts`
**Query**: `status=pending`
**Description**: Lists pending payouts grouped by coach.
**Response**:
```json
[
  {
    "payoutId": "string",
    "coachId": "string",
    "coachName": "string",
    "amount": "number",
    "periodStart": "ISO8601 string",
    "periodEnd": "ISO8601 string",
    "status": "pending"
  }
]
```

**Endpoint**: `POST /api/v1/admin/payouts/:id/approve`
**Description**: Approves a payout for processing.

**Endpoint**: `POST /api/v1/admin/payouts/:id/reject`
**Description**: Rejects a payout (requires reason).

**Endpoint**: `GET /api/v1/admin/commission-stats`
**Description**: Returns total platform commission earned over time.
