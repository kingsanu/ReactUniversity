# Coach Onboarding API Specifications

## Overview
This document outlines the API endpoints required to support the coach onboarding flow, user-side booking, and the coach dashboard.

## Onboarding Endpoints

### 1. Get Coach Onboarding Status
**GET** `/api/v1/coaches/:id/onboarding-status`

Used to verify the coach's invitation and current status when they land on the onboarding page.

**Response (200 OK):**
```json
{
  "id": "123",
  "email": "coach@example.com",
  "name": "Sarah Wilson", // Pre-filled if available from invite
  "status": "invited", // 'invited', 'onboarding_started', 'completed'
  "invitedAt": "2023-10-27T10:00:00Z"
}
```

### 2. Upload Profile Image
**POST** `/api/v1/upload`

Used to upload the coach's profile picture.

**Request (Multipart/Form-Data):**
- `file`: (Binary)

**Response (200 OK):**
```json
{
  "url": "https://storage.example.com/coaches/profile_123.jpg"
}
```

### 3. Submit Onboarding Data
**POST** `/api/v1/coaches/:id/onboarding`

Used to save the coach's profile, availability, and calendar preferences.

**Request Body:**
```json
{
  "personalInfo": {
    "name": "Sarah Wilson",
    "title": "Senior Career Coach",
    "bio": "Experienced leader in tech...",
    "specialization": "Tech Leadership",
    "location": "San Francisco, CA",
    "languages": ["English", "Spanish"],
    "tags": ["Leadership", "Management", "Tech"],
    "image": "https://storage.example.com/coaches/profile_123.jpg"
  },
  "availability": {
    "timezone": "America/Los_Angeles",
    "weeklySchedule": [
      {
        "day": "Monday",
        "enabled": true,
        "timeSlots": [
          { "start": "09:00", "end": "12:00" },
          { "start": "13:00", "end": "17:00" }
        ]
      },
      // ... other days
    ]
  },
  "calendarIntegrations": {
    "google": {
      "connected": true,
      "accessToken": "oauth_token_..."
    },
    "outlook": {
      "connected": false
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "coachId": "123",
  "redirectUrl": "/dashboard/coaching/dashboard"
}
```

### 4. Calendar Auth (Optional)
**GET** `/api/v1/auth/google/url`
**GET** `/api/v1/auth/outlook/url`

Returns the OAuth consent URL for the respective calendar services.

---

## User Side APIs

### 1. List Coaches
**Endpoint:** `GET /api/v1/coach`
**Description:** Get a paginated list of available coaches.
**Query Params:**
- `page`: number (default 1)
- `limit`: number (default 10)
- `specialization`: string (optional)
- `search`: string (optional, name or title)

**Response:**
```json
{
  "data": [
    {
      "id": "123",
      "name": "Sarah Wilson",
      "title": "Senior Career Coach",
      "specialization": "Tech Leadership",
      "image": "https://example.com/photo.jpg",
      "rating": 4.9,
      "reviews": 12,
      "tags": ["Leadership", "Management"]
    }
  ],
  "meta": {
    "total": 24,
    "page": 1,
    "pages": 3
  }
}
```

### 2. Get Coach Details
**Endpoint:** `GET /api/v1/coach/:id`
**Description:** Get full public profile of a coach including availability.

**Response:**
```json
{
  "id": "123",
  "name": "Sarah Wilson",
  "title": "Senior Career Coach",
  "bio": "...",
  "specialization": "Tech Leadership",
  "image": "https://example.com/photo.jpg",
  "rating": 4.9,
  "reviews": 12,
  "location": "San Francisco, CA",
  "languages": ["English", "Spanish"],
  "tags": ["Leadership", "Management"],
  "availability": {
    "timezone": "America/Los_Angeles",
    "weeklySchedule": [...]
  }
}
```

### 3. Book Session
**Endpoint:** `POST /api/v1/bookings`
**Description:** Book a coaching session.

**Payload:**
```json
{
  "coachId": "123",
  "slot": {
    "start": "2023-11-25T14:00:00Z",
    "end": "2023-11-25T14:30:00Z"
  },
  "topic": "Career Guidance",
  "notes": "Looking for help with..."
}
```

**Response:**
```json
{
  "id": "booking_456",
  "status": "confirmed",
  "meetingLink": "https://meet.google.com/..."
}
```

---

## Coach Dashboard APIs

### 1. Get My Sessions
**Endpoint:** `GET /api/v1/coach/me/sessions`
**Description:** Get list of upcoming and past sessions for the logged-in coach.
**Query Params:**
- `status`: "upcoming" | "past" | "all"

**Response:**
```json
{
  "data": [
    {
      "id": "booking_456",
      "studentName": "Alex Johnson",
      "studentImage": "...",
      "topic": "Career Guidance",
      "startTime": "2023-11-25T14:00:00Z",
      "endTime": "2023-11-25T14:30:00Z",
      "status": "confirmed",
      "meetingLink": "https://meet.google.com/..."
    }
  ]
}
```

### 2. Reschedule Session
**Endpoint:** `PUT /api/v1/bookings/:id/reschedule`
**Description:** Reschedule an existing booking.

**Payload:**
```json
{
  "newSlot": {
    "start": "2023-11-26T10:00:00Z",
    "end": "2023-11-26T10:30:00Z"
  }
}
```

**Response:**
```json
{
  "id": "booking_456",
  "status": "rescheduled",
  "newStartTime": "2023-11-26T10:00:00Z"
}
```

### 3. Get My Availability
**Endpoint:** `GET /api/v1/coach/me/availability`
**Description:** Get current availability settings.

**Response:**
```json
{
  "timezone": "America/Los_Angeles",
  "weeklySchedule": [...]
}
```

### 4. Update Availability
**Endpoint:** `PUT /api/v1/coach/me/availability`
**Description:** Update availability settings.

**Payload:**
```json
{
  "timezone": "America/Los_Angeles",
  "weeklySchedule": [...]
}
```

### 5. Update Coach Profile
**Endpoint:** `PUT /api/v1/coach/me`
**Description:** Update coach's personal information (bio, title, etc.).

**Payload:**
```json
{
  "title": "Senior Career Coach",
  "bio": "Updated bio...",
  "specialization": "Tech Leadership",
  "location": "New York, NY",
  "languages": ["English", "French"],
  "tags": ["Leadership", "Management"]
}
```

### 6. Cancel Session
**Endpoint:** `POST /api/v1/bookings/:id/cancel`
**Description:** Cancel a booking (can be triggered by coach or user).

**Payload:**
```json
{
  "reason": "Unexpected conflict"
}
```

**Response:**
```json
{
  "id": "booking_456",
  "status": "cancelled"
}
```

---

## Additional User APIs

### 4. Post Review
**Endpoint:** `POST /api/v1/coach/:id/reviews`
**Description:** Submit a review for a coach after a session.

**Payload:**
```json
{
  "bookingId": "booking_456",
  "rating": 5,
  "comment": "Great session! Very helpful."
}
```

**Response:**
```json
{
  "id": "review_789",
  "status": "published"
}
```

---

## Admin Side APIs

### 1. Get All Coaches
**Endpoint:** `GET /authapi/coaches`
**Description:** Retrieves a paginated list of coaches with their details and status for the admin panel.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `search` (string, optional): Search by name or email

**Response:**
```json
{
  "data": [
    {
      "id": "coach_123",
      "fullName": "John Coach",
      "email": "john.coach@example.com",
      "status": "active",
      "joinedAt": "2023-01-15T10:00:00Z",
      "specialization": "Career Development",
      "activeStudents": 12
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2. Invite Coach (Single)
**Endpoint:** `POST /authapi/invite-coach`
**Description:** Invites a single coach by email.

**Body:**
```json
{
  "email": "new.coach@example.com"
}
```

**Response:**
```json
{
  "message": "Invitation sent successfully",
  "invitationId": "inv_456"
}
```

### 3. Bulk Invite Coaches
**Endpoint:** `POST /authapi/signup-coach-bulk`
**Description:** Registers/Invites multiple coaches at once.

**Body:**
```json
{
  "coaches": [
    {
      "fullName": "Alice Coach",
      "email": "alice@example.com",
      "password": "generated_password"
    }
  ]
}
```

**Response:**
```json
[
  {
    "email": "alice@example.com",
    "success": true,
    "id": "coach_789"
  }
]
```

---

## Stripe & Payments APIs

### 1. Get Stripe Config
**Endpoint:** `GET /api/stripe/config`
**Description:** Get public Stripe configuration.

### 2. Create Payment Intent
**Endpoint:** `POST /api/stripe/create-payload`
**Description:** Create a payment intent for a custom payment flow.
**Payload:**
```json
{
  "userId": "user_123",
  "amount": 2000,
  "currency": "usd",
  "description": "Test payment"
}
```

### 3. Create Checkout Session
**Endpoint:** `POST /api/stripe/create-checkout-session`
**Description:** Create a Stripe Checkout Session for hosted payment page.
**Payload:**
```json
{
  "userId": "user_123",
  "amount": 2000,
  "currency": "usd",
  "productName": "Coaching Session",
  "successUrl": "https://domain.com/success",
  "cancelUrl": "https://domain.com/cancel"
}
```

### 4. Check Payment Status
**Endpoint:** `GET /api/stripe/status/:sessionId`
**Description:** Check status of a payment intent or checkout session.

### 5. Get User Payments
**Endpoint:** `GET /api/stripe/user/:userId`
**Description:** Get payment history for a user.
