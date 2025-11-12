# Courses API Specification

## Overview
This document specifies all API endpoints required for the Courses Catalog feature. All endpoints follow RESTful conventions and use JSON for request/response payloads.

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Response Format
### Success Response
```json
{
  "success": true,
  "data": <payload>,
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Optional detailed error information"
  }
}
```

## Endpoints

### 1. GET /api/courses
Fetch all available courses with optional filtering and pagination.

**Method:** GET
**Authentication:** Required
**Query Parameters:**
- `search` (string): Search query for course title, description, or provider
- `category` (string[]): Filter by categories (comma-separated)
- `language` (string[]): Filter by languages (comma-separated)
- `difficulty` (string[]): Filter by difficulty levels (comma-separated)
- `country` (string[]): Filter by countries (comma-separated)
- `duration_min` (number): Minimum duration in weeks
- `duration_max` (number): Maximum duration in weeks
- `certificate` (boolean): Filter by certificate availability
- `rating_min` (number): Minimum rating (0-5)
- `rating_max` (number): Maximum rating (0-5)
- `sort` (string): Sort option ("recommended", "rating", "enrollment", "newest", "duration", "title")
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)

**Request Example:**
```
GET /api/courses?search=python&category=Technology&difficulty=Beginner&sort=recommended&page=1&limit=12
```

**Response Payload:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course_123",
        "title": "Python for Data Science",
        "shortDescription": "Learn Python programming for data analysis and visualization",
        "category": "Technology",
        "provider": "Stanford University",
        "language": "English",
        "country": "United States",
        "duration": 8,
        "difficulty": "Beginner",
        "estimatedHours": 5,
        "certificate": true,
        "enrollmentCount": 15420,
        "rating": 4.7,
        "reviewCount": 1250,
        "thumbnailUrl": "https://example.com/thumbnail.jpg",
        "courseraUrl": "https://coursera.org/learn/python-data-science",
        "recommendedScore": 85,
        "matchingCompetencies": ["Data Analysis", "Python Programming"],
        "skills": ["Python", "Pandas", "NumPy", "Data Visualization"],
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 156,
      "totalPages": 13
    },
    "filters": {
      "categories": ["Technology", "Business", "Design"],
      "languages": ["English", "Spanish", "French"],
      "difficulties": ["Beginner", "Intermediate", "Advanced"],
      "countries": ["United States", "United Kingdom", "Canada"]
    }
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Internal server error

---

### 2. GET /api/courses/:id
Fetch detailed information for a specific course.

**Method:** GET
**Authentication:** Required
**Path Parameters:**
- `id` (string): Course ID

**Request Example:**
```
GET /api/courses/course_123
```

**Response Payload:**
```json
{
  "success": true,
  "data": {
    "id": "course_123",
    "title": "Python for Data Science",
    "shortDescription": "Learn Python programming for data analysis and visualization",
    "fullDescription": "This comprehensive course covers Python programming fundamentals with a focus on data science applications...",
    "category": "Technology",
    "subcategory": "Data Science",
    "provider": "Stanford University",
    "instructor": "Dr. John Smith",
    "language": "English",
    "country": "United States",
    "region": "North America",
    "duration": 8,
    "durationUnit": "weeks",
    "difficulty": "Beginner",
    "estimatedHours": 5,
    "certificate": true,
    "enrollmentCount": 15420,
    "rating": 4.7,
    "reviewCount": 1250,
    "thumbnailUrl": "https://example.com/thumbnail.jpg",
    "videoUrl": "https://example.com/intro-video.mp4",
    "courseraUrl": "https://coursera.org/learn/python-data-science",
    "externalId": "coursera_course_123",
    "syllabus": [
      {
        "id": "module_1",
        "title": "Introduction to Python",
        "description": "Basic Python syntax and data types",
        "week": 1,
        "estimatedHours": 4
      }
    ],
    "learningObjectives": [
      "Write basic Python programs",
      "Use Python for data analysis",
      "Create data visualizations"
    ],
    "prerequisites": [
      "Basic computer skills",
      "No prior programming experience required"
    ],
    "skills": ["Python", "Pandas", "NumPy", "Matplotlib"],
    "matchingCompetencies": ["Data Analysis", "Python Programming"],
    "careerPaths": ["Data Scientist", "Data Analyst"],
    "recommendedScore": 85,
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-11-01T14:30:00Z"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Course not found
- 500: Internal server error

---

### 3. GET /api/courses/recommended
Fetch courses recommended for the current student based on their assessment results.

**Method:** GET
**Authentication:** Required
**Query Parameters:**
- `limit` (number): Number of recommendations to return (default: 10)

**Request Example:**
```
GET /api/courses/recommended?limit=6
```

**Response Payload:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course_123",
        "title": "Python for Data Science",
        "shortDescription": "Learn Python programming for data analysis",
        "category": "Technology",
        "provider": "Stanford University",
        "difficulty": "Beginner",
        "recommendedScore": 92,
        "matchingCompetencies": ["Data Analysis", "Programming"],
        "thumbnailUrl": "https://example.com/thumbnail.jpg",
        "courseraUrl": "https://coursera.org/learn/python-data-science"
      }
    ],
    "recommendationReason": "Based on your assessment results showing strong analytical skills and interest in data science"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Internal server error

---

### 4. POST /api/courses/enroll
Enroll the current student in a course (track enrollment event).

**Method:** POST
**Authentication:** Required
**Request Payload:**
```json
{
  "courseId": "course_123",
  "enrollmentSource": "catalog" // "catalog", "recommended", "dashboard"
}
```

**Response Payload:**
```json
{
  "success": true,
  "data": {
    "enrollmentId": "enrollment_456",
    "courseId": "course_123",
    "studentId": "student_789",
    "enrolledAt": "2024-11-12T10:30:00Z",
    "status": "enrolled",
    "progress": {
      "completedModules": 0,
      "totalModules": 8,
      "percentage": 0
    }
  },
  "message": "Successfully enrolled in course"
}
```

**Status Codes:**
- 201: Enrollment successful
- 400: Invalid request (already enrolled, course not found)
- 401: Unauthorized
- 500: Internal server error

---

### 5. GET /api/courses/progress
Fetch the current student's course progress and enrolled courses.

**Method:** GET
**Authentication:** Required
**Query Parameters:**
- `status` (string): Filter by status ("enrolled", "in_progress", "completed")

**Request Example:**
```
GET /api/courses/progress?status=in_progress
```

**Response Payload:**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "enrollmentId": "enrollment_456",
        "courseId": "course_123",
        "courseTitle": "Python for Data Science",
        "courseThumbnail": "https://example.com/thumbnail.jpg",
        "courseraUrl": "https://coursera.org/learn/python-data-science",
        "enrolledAt": "2024-11-12T10:30:00Z",
        "status": "in_progress",
        "progress": {
          "completedModules": 2,
          "totalModules": 8,
          "percentage": 25,
          "lastAccessedAt": "2024-11-10T15:45:00Z",
          "estimatedCompletionDate": "2024-12-15T00:00:00Z"
        }
      }
    ],
    "summary": {
      "totalEnrolled": 3,
      "inProgress": 2,
      "completed": 1,
      "totalHoursLearned": 45
    }
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Internal server error

---

### 6. PUT /api/courses/progress/:enrollmentId
Update progress for an enrolled course.

**Method:** PUT
**Authentication:** Required
**Path Parameters:**
- `enrollmentId` (string): Enrollment ID

**Request Payload:**
```json
{
  "completedModules": 3,
  "totalModules": 8,
  "lastAccessedAt": "2024-11-12T16:00:00Z",
  "status": "in_progress" // "enrolled", "in_progress", "completed", "dropped"
}
```

**Response Payload:**
```json
{
  "success": true,
  "data": {
    "enrollmentId": "enrollment_456",
    "courseId": "course_123",
    "progress": {
      "completedModules": 3,
      "totalModules": 8,
      "percentage": 37.5,
      "lastAccessedAt": "2024-11-12T16:00:00Z",
      "status": "in_progress"
    },
    "updatedAt": "2024-11-12T16:00:00Z"
  },
  "message": "Progress updated successfully"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid progress data
- 401: Unauthorized
- 404: Enrollment not found
- 500: Internal server error

---

### 7. POST /api/admin/courses
Add a new course to the catalog (Admin only).

**Method:** POST
**Authentication:** Required (Admin role)
**Request Payload:**
```json
{
  "title": "Advanced Machine Learning",
  "shortDescription": "Deep dive into ML algorithms and applications",
  "fullDescription": "Comprehensive course covering advanced ML techniques...",
  "category": "Technology",
  "subcategory": "Machine Learning",
  "provider": "Stanford University",
  "instructor": "Dr. Andrew Ng",
  "language": "English",
  "country": "United States",
  "duration": 10,
  "difficulty": "Advanced",
  "estimatedHours": 8,
  "certificate": true,
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "courseraUrl": "https://coursera.org/learn/machine-learning",
  "externalId": "coursera_ml_2024",
  "syllabus": [
    {
      "title": "Neural Networks",
      "description": "Introduction to neural network architectures",
      "week": 1,
      "estimatedHours": 6
    }
  ],
  "learningObjectives": ["Build neural networks", "Apply ML algorithms"],
  "prerequisites": ["Basic calculus", "Python programming"],
  "skills": ["TensorFlow", "Neural Networks", "Deep Learning"],
  "matchingCompetencies": ["Machine Learning", "AI Development"],
  "careerPaths": ["ML Engineer", "Data Scientist"]
}
```

**Response Payload:**
```json
{
  "success": true,
  "data": {
    "id": "course_789",
    "title": "Advanced Machine Learning",
    "provider": "Stanford University",
    "createdAt": "2024-11-12T17:00:00Z",
    "isActive": true
  },
  "message": "Course added successfully"
}
```

**Status Codes:**
- 201: Course created
- 400: Invalid course data
- 401: Unauthorized (not admin)
- 409: Course with this external ID already exists
- 500: Internal server error

---

### 8. PUT /api/admin/courses/:id
Update an existing course (Admin only).

**Method:** PUT
**Authentication:** Required (Admin role)
**Path Parameters:**
- `id` (string): Course ID

**Request Payload:** Same as POST /api/admin/courses, all fields optional

**Response Payload:**
```json
{
  "success": true,
  "data": {
    "id": "course_789",
    "title": "Advanced Machine Learning",
    "updatedAt": "2024-11-12T17:30:00Z"
  },
  "message": "Course updated successfully"
}
```

**Status Codes:**
- 200: Course updated
- 400: Invalid course data
- 401: Unauthorized (not admin)
- 404: Course not found
- 500: Internal server error

---

### 9. DELETE /api/admin/courses/:id
Remove a course from the catalog (Admin only).

**Method:** DELETE
**Authentication:** Required (Admin role)
**Path Parameters:**
- `id` (string): Course ID

**Response Payload:**
```json
{
  "success": true,
  "message": "Course removed successfully"
}
```

**Status Codes:**
- 200: Course deleted
- 401: Unauthorized (not admin)
- 404: Course not found
- 409: Cannot delete course with active enrollments
- 500: Internal server error

---

## Error Codes
- `INVALID_REQUEST`: Malformed request data
- `COURSE_NOT_FOUND`: Specified course does not exist
- `ENROLLMENT_NOT_FOUND`: Specified enrollment does not exist
- `ALREADY_ENROLLED`: Student already enrolled in this course
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `EXTERNAL_API_ERROR`: Error communicating with Coursera API
- `VALIDATION_ERROR`: Request data failed validation

## Rate Limiting
- Public endpoints: 100 requests per minute per user
- Admin endpoints: 50 requests per minute per admin user

## Notes
- All course data is sourced from Coursera API
- Course enrollments redirect users to Coursera platform
- Progress tracking is synchronized with Coursera's completion data
- Admin endpoints require elevated permissions
- All dates are in ISO 8601 format (UTC)</content>
<parameter name="filePath">k:\2025\timcare\COURSES_API_SPEC.md