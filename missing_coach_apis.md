# Missing Coach Dashboard APIs

Based on the current implementation of the Coach Dashboard and the available `coachService.ts` methods, the following APIs are missing or need to be implemented to support all features.

## 1. Analytics & Reports
Currently, the `AnalyticsPage` uses mock data. We need real endpoints to fetch performance metrics.

### `GET /api/v1/coach/me/analytics`
Fetches the high-level stats and chart data.

**Response:**
```json
{
  "data": {
    "totalEarnings": 12450,
    "totalSessions": 142,
    "averageRating": 4.9,
    "activeStudents": 28,
    "earningsHistory": [
      { "month": "Jan", "amount": 1200 },
      { "month": "Feb", "amount": 1900 }
    ],
    "sessionDistribution": [
      { "topic": "Career Planning", "count": 45 },
      { "topic": "Resume Review", "count": 30 }
    ],
    "recentActivity": [
      { "id": "1", "type": "booking", "message": "Alice booked a session", "date": "2023-11-20T10:00:00Z" }
    ]
  }
}
```

### `GET /api/v1/coach/me/analytics/report`
Generates and downloads a CSV/PDF report.
- **Query Params**: `startDate`, `endDate`, `type` (csv/pdf).

---

## 2. Session Management
We have `getCoachSessions`, but we lack specific actions for notes and deeper management.

### `GET /api/v1/bookings/{bookingId}/notes`
Fetch private notes for a specific session.
*(Currently assuming notes come with the list, but for security/size, a separate endpoint is better)*.

### `PUT /api/v1/bookings/{bookingId}/notes`
Update or save private notes for a session.

**Request:**
```json
{
  "notes": "Student needs help with..."
}
```

---

## 3. Student Management
The "Student Profile" link currently goes to a generic page. Coaches need a specific view of their students.

### `GET /api/v1/coach/me/students`
List of all students who have booked this coach.

### `GET /api/v1/coach/me/students/{studentId}`
Detailed view of a student, including past sessions with *this* coach and shared notes.

---

## 4. Payouts & Banking
There is no implementation for managing bank accounts or viewing payout history.

### `GET /api/v1/coach/me/payouts`
History of payouts/withdrawals.

### `GET /api/v1/coach/me/bank-account`
Get current linked bank account status (e.g., Stripe Connect status).

### `POST /api/v1/coach/me/bank-account`
Link a bank account or generate a Stripe onboarding link.

---

## 5. Notifications
To show the "Recent Activity" or real-time updates.

### `GET /api/v1/notifications`
Fetch user notifications.

### `PUT /api/v1/notifications/{id}/read`
Mark notification as read.

---

## 6. Student Side APIs (My Sessions)
For the student dashboard (`/dashboard/my-sessions`), we need these APIs:

### `GET /api/v1/bookings/me` ✅ Implemented
Fetch all sessions for the logged-in student.
- **Query Params**: `status` ("upcoming" | "past" | "all")

**Response:**
```json
{
  "data": [
    {
      "id": "booking_123",
      "coachId": "coach_456",
      "coachName": "Sarah Wilson",
      "coachImage": "https://...",
      "coachTitle": "Senior Career Coach",
      "topic": "Career Guidance",
      "notes": "Looking for help with...",
      "startTime": "2025-12-01T14:00:00Z",
      "endTime": "2025-12-01T14:30:00Z",
      "status": "confirmed",
      "meetingLink": "https://meet.google.com/..."
    }
  ]
}
```

### `POST /api/v1/bookings/{bookingId}/cancel` ✅ Implemented
Cancel a booking (student-side).

**Request:**
```json
{
  "reason": "Schedule conflict"
}
```

**Response:**
```json
{
  "id": "booking_123",
  "status": "cancelled"
}
```

### `PUT /api/v1/bookings/{bookingId}/reschedule` ✅ Implemented
Allows a student to propose a new time for an existing booking.

**Request:**
```json
{
  "newSlot": {
    "start": "2025-12-02T10:00:00Z",
    "end": "2025-12-02T10:30:00Z"
  }
}
```

**Response:**
```json
{
  "id": "booking_123",
  "status": "rescheduled",
  "newStartTime": "2025-12-02T10:00:00Z"
}
```

### `POST /api/v1/coach/{coachId}/reviews` ✅ Implemented
Submit a rating and review for a completed session.

**Request:**
```json
{
  "bookingId": "booking_123",
  "rating": 5,
  "comment": "Great session! Very helpful advice."
}
```

**Response:**
```json
{
  "id": "review_789",
  "bookingId": "booking_123",
  "rating": 5,
  "comment": "Great session! Very helpful advice.",
  "status": "published"
}
```

---

## 7. Booking Flow APIs (Book Coach Page)
For the booking flow (`/dashboard/book-coach`):

### `GET /api/v1/coach` ✅ Implemented
List all available coaches with optional filters.
- **Query Params**: `page`, `limit`, `specialization`, `search`

### `GET /api/v1/coach/{coachId}` ✅ Implemented
Get coach details including availability.

**Response includes:**
```json
{
  "data": {
    "id": "coach_456",
    "name": "Sarah Wilson",
    "title": "Senior Career Coach",
    "bio": "...",
    "specialization": "Tech Leadership",
    "image": "https://...",
    "rating": 4.9,
    "reviews": 12,
    "location": "San Francisco, CA",
    "languages": ["English", "Spanish"],
    "tags": ["Leadership", "Management"],
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
        }
      ]
    }
  }
}
```

### `GET /api/v1/coach/{coachId}/slots` ❌ Optional - Nice to have
Get available slots for a specific coach on a specific date (considering existing bookings).
- **Query Params**: `date` (YYYY-MM-DD)

**Response:**
```json
{
  "slots": ["09:00am", "09:30am", "10:00am", "02:00pm", "02:30pm"]
}
```
*Note: If not implemented, frontend falls back to coach's weekly schedule from profile.*

### `POST /api/v1/bookings` ✅ Implemented
Create a new booking.

**Request:**
```json
{
  "coachId": "coach_456",
  "slot": {
    "start": "2025-12-01T14:00:00Z",
    "end": "2025-12-01T14:30:00Z"
  },
  "topic": "Career Guidance",
  "notes": "Looking for help with..."
}
```

**Response:**
```json
{
  "id": "booking_123",
  "status": "confirmed",
  "meetingLink": "https://meet.google.com/..."
}
```

