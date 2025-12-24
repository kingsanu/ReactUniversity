# API Requirements Update - 2025-12-24

This document outlines additional API endpoints required to optimize the Admin Coaches Dashboard.

---

## 1. Coach Statistics (Admin)

**Current Issue**: The frontend currently fetches all coaches (limit: 500) and calculates statistics client-side. This is inefficient for large datasets and creates unnecessary network overhead.

**New Endpoint**: `GET /api/v1/admin/coaches/stats`

**Description**: Returns aggregated statistics for all coaches in the system.

**Authentication**: Required (Admin role only)

### Request

```
GET /api/v1/admin/coaches/stats
Authorization: Bearer {token}
```

No query parameters required.

### Response

```json
{
  "totalCoaches": 24,
  "activeNow": 18,
  "pendingInvites": 4,
  "expiringContracts": 2,
  "statusBreakdown": {
    "active": 18,
    "invited": 3,
    "pending": 1,
    "inactive": 2
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalCoaches` | number | Total count of all coaches in the system |
| `activeNow` | number | Count of coaches with `status = "active"` |
| `pendingInvites` | number | Count of coaches with `status = "invited"` or `"pending"` |
| `expiringContracts` | number | Count of coaches whose `contractEnd` is within the next 30 days |
| `statusBreakdown` | object | Detailed breakdown by each status type |

### Implementation Notes

- **Expiring Contracts Logic**: A contract is considered "expiring" if:
  - `contractEnd` is not null
  - `contractEnd >= today`
  - `contractEnd <= today + 30 days`

- **Performance**: This endpoint should aggregate data at the database level, not in application code.

- **Caching**: Consider caching for 5 minutes to reduce database load on frequently accessed dashboards.

- **Security**: Requires admin role verification before returning data.

---

## Frontend Integration

Once implemented, update `src/app/dashboard/admin/coaches/page.tsx` to use this endpoint instead of calculating stats from the full coaches list.

```typescript
// New service function to add:
export async function getCoachStats(): Promise<CoachStats> {
  const response = await apiRequest("/api/v1/admin/coaches/stats", {
    method: "GET",
  });
  return response.data || response;
}
```

---

## 2. User Profile (Required Fields)

**Current Issue**: The profile page (`/dashboard/profile`) needs complete data from the backend to display the Overview tab dynamically.

**Endpoint**: `GET /api/v1/user/profile`

**Authentication**: Required (any authenticated user)

### Expected Response

```json
{
  "id": "string",
  "fullName": "string",
  "email": "string",
  "headline": "string (optional) - e.g. 'Senior Product Designer at Acme Inc.'",
  "bio": "string (optional) - User's about me text",
  "location": "string (optional) - e.g. 'San Francisco, CA'",
  "phone": "string (optional)",
  "avatarUrl": "string (optional) - URL to profile picture",
  "coverUrl": "string (optional) - URL to cover image",
  "socialLinks": {
    "website": "string (optional)",
    "linkedin": "string (optional)",
    "twitter": "string (optional)",
    "github": "string (optional)"
  },
  "skills": ["string"] // Array of skill tags
  "stats": {
    "coursesCompleted": 12,
    "applicationsSubmitted": 5,
    "mentorshipSessions": 8
  }
}
```

### Required Fields for Profile Overview

| Field | Type | Used For |
|-------|------|----------|
| `bio` | string | "About Me" section content |
| `skills` | string[] | Skill tags displayed as badges |
| `stats.coursesCompleted` | number | Stats card "Courses Completed" |
| `stats.applicationsSubmitted` | number | Stats card "Applications" |
| `stats.mentorshipSessions` | number | Stats card "Certificates/Sessions" |

---

## 3. User Activity Timeline

**Endpoint**: `GET /api/v1/user/activity`

**Authentication**: Required

### Expected Response

```json
{
  "data": [
    {
      "id": "string",
      "type": "course_completed | application_sent | profile_updated | session_completed | certificate_earned",
      "description": "Completed 'Advanced UI Design'",
      "timestamp": "2024-12-22T10:00:00Z",
      "metadata": {
        "score": 98,
        "courseName": "Advanced UI Design"
      }
    }
  ]
}
```

### Activity Types

| Type | Icon | Description Example |
|------|------|---------------------|
| `course_completed` | Star | "Completed 'Advanced UI Design'" |
| `application_sent` | Briefcase | "Applied for 'Senior UX Role'" |
| `profile_updated` | User | "Profile Updated" |
| `session_completed` | Calendar | "Coaching session with John" |
| `certificate_earned` | Award | "Earned 'React Fundamentals' certificate" |

