# API Specification: Get Coach Booking Slots

## Overview
This API endpoint allows the frontend to fetch available booking slots for a specific coach on a specific date. Moving this logic to the backend ensures that availability rules (working hours, breaks, existing bookings, buffer times) are consistently applied and secure.

## Endpoint
`GET /api/v1/coach/:coachId/slots`

## Request

### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `coachId` | string | Yes | The unique identifier of the coach. |

### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `date` | string | Yes | The date to fetch slots for (ISO 8601 format `YYYY-MM-DD`). |
| `timezone` | string | No | The timezone of the user (e.g., `America/New_York`). If provided, slots will be returned in this timezone. Defaults to UTC or Coach's timezone. |

### Example Request
```http
GET /api/v1/coach/12345/slots?date=2024-12-25&timezone=Asia/Kolkata
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "date": "2024-12-25",
    "timezone": "Asia/Kolkata",
    "coachId": "12345",
    "sessionDurationMinutes": 30,
    "price": {
      "amount": 50.00,
      "currency": "USD"
    },
    "slots": [
      "2024-12-25T09:00:00+05:30",
      "2024-12-25T09:30:00+05:30",
      "2024-12-25T10:30:00+05:30",
      "2024-12-25T12:30:00+05:30",
      "2024-12-25T13:00:00+05:30",
      "2024-12-25T13:30:00+05:30",
      "2024-12-25T15:00:00+05:30"
    ],
    "nextAvailableDate": "2024-12-26" // Optional: If no slots are available on the requested date
  }
}
```

### Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "message": "Date parameter is required."
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Coach not found."
}
```

## Backend Logic Requirements
1.  **Fetch Schedule**: Retrieve the coach's `weeklySchedule` and `timezone`.
2.  **Fetch Bookings**: Retrieve existing bookings for the coach on the requested date.
3.  **Generate Slots (Chunking Logic)**:
    *   Convert the requested `date` to the coach's timezone.
    *   Identify the day of the week (e.g., Monday).
    *   Get the time ranges for that day from `weeklySchedule` (e.g., `09:00` to `11:00`).
    *   **Crucial Step**: Break these continuous ranges into discrete slots based on the `slotInterval` (e.g., 30 mins), but ensure each slot has enough duration for `sessionDuration` (e.g., 60 mins).
        *   *Logic*: `Slot Start Time` + `Session Duration` <= `Availability End Time`.
        *   *Example*: Availability is `09:00 - 11:00` (2 hours).
            *   Session Duration: `60 mins`.
            *   Slot Interval: `30 mins`.
            *   **Generated Slots**: `["09:00", "09:30", "10:00"]`.
            *   *Note*: `10:30` is NOT generated because `10:30 + 60 mins = 11:30`, which is outside availability.
4.  **Filter Slots**:
    *   **Past Time**: Exclude slots that are in the past (relative to server time).
    *   **Booked**: Exclude slots that overlap with existing bookings.
    *   **Buffer**: (Optional) Exclude slots that don't satisfy buffer time requirements.
5.  **Timezone Conversion**: Convert the final list of slots to the requested `timezone` (or UTC) before returning.

## UI Recommendations (Additional Details)

Based on this API, the Booking Modal UI should be enhanced to display:

1.  **Session Price**:
    *   Display the price per session (e.g., "$50.00 / 30 min") prominently in the modal header or near the "Book" button.
    *   *Why*: Users need to know the cost before committing.

2.  **Timezone Clarity**:
    *   Explicitly state the timezone being used for the displayed slots (e.g., "Times shown in Asia/Kolkata").
    *   Add a timezone picker if the user wants to see slots in a different timezone (passed as the `timezone` query param).

3.  **"Next Available" Suggestion**:
    *   If the selected date has no slots (empty array), use the `nextAvailableDate` from the response to show a button: "Jump to next available date (Dec 26)".

4.  **Session Duration**:
    *   Display the duration (e.g., "30 Minutes") clearly.

---

# API Specification: Get User Sessions (Bookings)

## Overview
This API endpoint allows a logged-in user (student) to fetch their own booking history, including upcoming, past, or all sessions.

## Endpoint
`GET /api/v1/bookings/me`

## Request

### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `status` | string | No | Filter bookings by status. Options: `upcoming`, `past`, `all`. Defaults to `all`. |

### Headers
| Header | Value | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | `Bearer <token>` | Yes | JWT token of the logged-in user. |

### Example Request
```http
GET /api/v1/bookings/me?status=upcoming
Authorization: Bearer <token>
```

## Response

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "booking_123",
      "coachId": "coach_456",
      "coachName": "Coach Name",
      "coachImage": "https://example.com/avatar.jpg",
      "coachTitle": "Senior Coach",
      "studentName": "John Doe",
      "studentImage": "https://example.com/student_avatar.jpg",
      "topic": "Career Guidance",
      "notes": "Preparation for interview",
      "slot": {
        "start": "2024-12-25T10:00:00Z",
        "end": "2024-12-25T11:00:00Z"
      },
      "startTime": "2024-12-25T10:00:00Z",
      "endTime": "2024-12-25T11:00:00Z",
      "status": "confirmed",
      "meetingLink": "https://meet.google.com/abc-defg-hij"
    }
  ]
}
```

### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to fetch user sessions"
}
```

---

# API Specification: Admin Settings

## Overview
This API endpoint allows administrators to configure system-wide settings, currently focused on the platform fee percentage.

> [!NOTE]
> Currently, this API uses an in-memory store. For production usage, this should be migrated to a persistent database backed by the backend service.

## Endpoint
`GET /api/admin/settings`
`POST /api/admin/settings`

## Resources

### Settings Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `platformFee` | number | The percentage of the session fee taken by the platform (0-100). |

---

## 1. Get Settings
Retrieve the current system settings.

### Request
`GET /api/admin/settings`

### Response

#### Success Response (200 OK)
```json
{
  "platformFee": 15
}
```

---

## 2. Update Settings
Update one or more system settings.

### Request
`POST /api/admin/settings`

**Body**
```json
{
  "platformFee": 20
}
```

### Response

#### Success Response (200 OK)
Returns the updated settings object.

```json
{
  "platformFee": 20
}
```

#### Error Responses

**500 Internal Server Error**
```json
{
  "error": "Failed to update settings"
}
```

---

# API Specification: Cancel Session

## Overview
This API endpoint allows a coach or user to cancel a confirmed booking.

## Endpoint
`POST /api/v1/bookings/:bookingId/cancel`

## Request

### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `bookingId` | string | Yes | The ID of the booking to cancel. |

### Body Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `reason` | string | Yes | Reason for cancellation (e.g., "Schedule conflict"). |

### Example Request
```http
POST /api/v1/bookings/booking_123/cancel
Content-Type: application/json

{
  "reason": "Unexpected emergency"
}
```

## Response

### Success Response (200 OK)
```json
{
  "id": "booking_123",
  "status": "cancelled",
  "reason": "Unexpected emergency",
  "cancelledBy": "coach_456",
  "cancelledAt": "2025-12-07T10:00:00Z"
}
```

### Error Responses

**404 Not Found**
```json
{
  "success": false,
  "message": "Booking not found"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "Cannot cancel a completed session"
}
```
