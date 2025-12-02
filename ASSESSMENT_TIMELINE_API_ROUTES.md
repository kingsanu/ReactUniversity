# Assessment Timeline API Routes Documentation

This document outlines the backend API routes needed for the Assessment Timeline feature. These routes will aggregate assessment events and support export functionality.

## Overview

The timeline feature aggregates events from 4 assessment sources:
- **PCA** (Personal Competence Analysis)
- **MIL/LIA** (Labor Intelligence Assessment - 5 subtests)
- **360° Evaluation** (Multi-rater feedback)
- **Courses** (Learning Management)

---

## API Routes

### 1. Get Timeline Events

**Endpoint:** `GET /api/v1/assessments/me/timeline`

**Description:** Retrieves all assessment events for the authenticated user, aggregated chronologically from all assessment types.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string (ISO 8601) | No | Filter events from this date |
| `endDate` | string (ISO 8601) | No | Filter events until this date |
| `types` | string[] | No | Filter by assessment type: `pca`, `mil`, `evaluation`, `course` |
| `status` | string[] | No | Filter by status: `not_started`, `in_progress`, `completed` |
| `lang` | string | No | Language: `en` or `sp` (default: `en`) |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 50) |

**Request Example:**
```http
GET /api/v1/assessments/me/timeline?types=pca,mil&status=completed&startDate=2024-01-01&lang=en
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event_pca_001",
        "type": "pca",
        "eventType": "completed",
        "title": "PCA Assessment Completed",
        "description": "Personal Competence Analysis finished with 78% overall score",
        "timestamp": "2024-11-30T15:20:00Z",
        "status": "completed",
        "metadata": {
          "pcaCod": "PCA_2024_001",
          "overallScore": 78,
          "scores": {
            "dominance": 72,
            "influence": 65,
            "steadiness": 58,
            "conscientiousness": 81
          }
        },
        "icon": "clipboard-check",
        "color": "green"
      },
      {
        "id": "event_mil_feature_001",
        "type": "mil",
        "eventType": "completed",
        "title": "Pattern Recognition Completed",
        "description": "Feature Detection subtest completed with 85.5% score",
        "timestamp": "2024-11-28T11:15:00Z",
        "status": "completed",
        "metadata": {
          "examId": "feature-detection-001",
          "examType": 0,
          "scorePercentage": 85.5,
          "accuracyPercentage": 82.0,
          "totalQuestions": 20,
          "correctAnswers": 17,
          "timeSpent": "00:45:30"
        },
        "icon": "brain",
        "color": "green"
      },
      {
        "id": "event_eval_group_001",
        "type": "evaluation",
        "eventType": "response_received",
        "title": "360° Feedback Received",
        "description": "Evaluation from Jane Smith (Mother) completed",
        "timestamp": "2024-11-22T14:30:00Z",
        "status": "completed",
        "metadata": {
          "groupId": "eval_group_001",
          "groupType": "Parent",
          "evaluatorName": "Jane Smith",
          "relation": "Mother"
        },
        "icon": "users",
        "color": "green"
      },
      {
        "id": "event_course_enroll_001",
        "type": "course",
        "eventType": "enrolled",
        "title": "Course Enrolled",
        "description": "Enrolled in Advanced Python Programming",
        "timestamp": "2024-10-15T08:00:00Z",
        "status": "in_progress",
        "metadata": {
          "enrollmentId": "enroll_123",
          "courseId": "course_456",
          "courseTitle": "Advanced Python Programming",
          "progress": 37.5
        },
        "icon": "book-open",
        "color": "blue"
      }
    ],
    "summary": {
      "totalEvents": 45,
      "byType": {
        "pca": 3,
        "mil": 12,
        "evaluation": 8,
        "course": 22
      },
      "byStatus": {
        "completed": 28,
        "in_progress": 12,
        "not_started": 5
      },
      "dateRange": {
        "earliest": "2024-01-15T10:00:00Z",
        "latest": "2024-11-30T15:20:00Z"
      }
    },
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 45,
      "totalPages": 1
    }
  }
}
```

**Where Used:**
- `src/app/dashboard/timeline/page.tsx` - Main timeline page
- `src/hooks/useTimelineQueries.ts` - React Query hook for data fetching
- `src/components/dashboard/Timeline/TimelineView.tsx` - Timeline visualization

---

### 2. Export Timeline Data

**Endpoint:** `POST /api/v1/assessments/me/timeline/export`

**Description:** Exports timeline data in PDF or CSV format.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "format": "pdf",
  "dateRange": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z"
  },
  "filterTypes": ["pca", "mil", "evaluation", "course"],
  "filterStatus": ["completed", "in_progress"],
  "includeDetails": true,
  "language": "en"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `format` | string | Yes | Export format: `pdf` or `csv` |
| `dateRange` | object | No | Date range filter |
| `dateRange.startDate` | string (ISO 8601) | No | Start date |
| `dateRange.endDate` | string (ISO 8601) | No | End date |
| `filterTypes` | string[] | No | Assessment types to include |
| `filterStatus` | string[] | No | Status filters |
| `includeDetails` | boolean | No | Include detailed metadata (default: true) |
| `language` | string | No | Language for export: `en` or `sp` |

**Response (200 OK - PDF):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="assessment_timeline_2024-12-02.pdf"

[Binary PDF data]
```

**Response (200 OK - CSV):**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="assessment_timeline_2024-12-02.csv"

Date,Type,Event,Title,Description,Status,Score
2024-11-30T15:20:00Z,PCA,completed,PCA Assessment Completed,Personal Competence Analysis finished,completed,78
2024-11-28T11:15:00Z,MIL,completed,Pattern Recognition Completed,Feature Detection subtest completed,completed,85.5
...
```

**Where Used:**
- `src/components/dashboard/Timeline/TimelineExport.tsx` - Export button component
- `src/services/timelineService.ts` - Export service function

---

### 3. Get Timeline Statistics

**Endpoint:** `GET /api/v1/assessments/me/timeline/stats`

**Description:** Retrieves aggregated statistics for the timeline dashboard header.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | string | No | Time period: `week`, `month`, `quarter`, `year`, `all` (default: `all`) |
| `lang` | string | No | Language: `en` or `sp` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overallCompletion": {
      "percentage": 67,
      "completedAssessments": 2,
      "totalAssessments": 3
    },
    "recentActivity": {
      "lastActivityDate": "2024-11-30T15:20:00Z",
      "eventsThisWeek": 5,
      "eventsThisMonth": 18
    },
    "assessmentBreakdown": {
      "pca": {
        "status": "completed",
        "completedAt": "2024-11-30T15:20:00Z",
        "score": 78
      },
      "mil": {
        "status": "in_progress",
        "completedSubtests": 3,
        "totalSubtests": 5,
        "averageScore": 82.3
      },
      "evaluation": {
        "status": "in_progress",
        "completedEvaluations": 2,
        "totalEvaluators": 4
      },
      "courses": {
        "enrolled": 5,
        "inProgress": 3,
        "completed": 2,
        "averageProgress": 45.5
      }
    },
    "milestones": {
      "achieved": 8,
      "total": 15,
      "nextMilestone": {
        "title": "Complete MIL Assessment",
        "progress": 60
      }
    }
  }
}
```

**Where Used:**
- `src/components/dashboard/Timeline/TimelineStats.tsx` - Statistics cards
- `src/hooks/useTimelineQueries.ts` - React Query hook

---

## Event Types Reference

### PCA Events
| Event Type | Description |
|------------|-------------|
| `created` | PCA assessment created/started |
| `in_progress` | Assessment is being taken |
| `completed` | Assessment finished with results |

### MIL/LIA Events
| Event Type | Description |
|------------|-------------|
| `started` | Subtest started |
| `completed` | Subtest completed with score |
| `time_expired` | Subtest ended due to time limit |

### 360° Evaluation Events
| Event Type | Description |
|------------|-------------|
| `group_created` | Evaluator group added |
| `invitation_sent` | Invitation email sent |
| `response_received` | Evaluator completed feedback |
| `completed` | All required evaluations received |

### Course Events
| Event Type | Description |
|------------|-------------|
| `enrolled` | User enrolled in course |
| `progress_updated` | Course progress updated |
| `module_completed` | Course module completed |
| `completed` | Course fully completed |
| `dropped` | User dropped the course |

---

## Implementation Notes

### Current Data Sources (No Backend Changes)

Until these routes are implemented, the frontend can aggregate timeline data from existing endpoints:

1. **PCA Data:** `pcaService.checkPCAStatus()` - Returns status, lastActivity
2. **MIL Data:** `milService.getUserExamHistory()` - Returns examStatus array with dates
3. **Evaluation Data:** `evaluationService.getUserEvaluationGroups()` - Returns groups with timestamps
4. **Course Data:** Local enrollment store (to be replaced with API)

### Frontend Aggregation (Initial Implementation)

```typescript
// src/services/timelineService.ts
export async function getTimelineEvents(userId: string, filters: TimelineFilters) {
  // Fetch from existing services
  const [milData, evalData, pcaData] = await Promise.all([
    getUserExamHistory(userId),
    getUserEvaluationGroups(userId),
    checkPCAStatus(userId)
  ]);
  
  // Transform and aggregate into timeline events
  const events = [
    ...transformMILToEvents(milData),
    ...transformEvalToEvents(evalData),
    ...transformPCAToEvents(pcaData)
  ];
  
  // Sort chronologically and apply filters
  return sortAndFilter(events, filters);
}
```

### Backend Route Priority

1. **High Priority:** Timeline export endpoint (PDF/CSV generation requires server)
2. **Medium Priority:** Timeline events aggregation (improves performance)
3. **Low Priority:** Statistics endpoint (can be calculated client-side)

---

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Invalid request parameters |
| 401 | Unauthorized - invalid/missing token |
| 403 | Forbidden - user doesn't have access |
| 404 | User not found |
| 500 | Internal server error |

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "End date must be after start date",
    "details": {}
  }
}
```
