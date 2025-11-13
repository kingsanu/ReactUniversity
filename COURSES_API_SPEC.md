# Courses API Specification

## Overview

This document specifies all API endpoints required for the Courses Catalog feature. All endpoints follow RESTful conventions and use JSON for request/response payloads.

**Current Status:** Frontend implementation complete. Backend endpoints require implementation.

**Implementation Priority:**

1. **Phase 1 (Essential):** Endpoints 1-6 (Core course browsing and enrollment)
2. **Phase 2 (Important):** Endpoints 3, 7-11 (Recommendations and admin management)
3. **Phase 3 (Advanced):** Recommendation algorithm and personalization

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

**Admin Endpoints:** Require `role: "admin"` in JWT token claims

## Implementation Notes

### Frontend Status

- ✅ All UI components built and functional
- ✅ Mock data integration complete
- ✅ Admin management interface ready
- ✅ Responsive design implemented
- ❌ Backend API integration pending

### Current Behavior

- Frontend uses mock data from `src/data/mockCourses.ts`
- All operations are client-side only
- Recommendations show top 3 mock courses (static scoring)
- No persistence across sessions

### What Needs Backend Implementation

1. **Data Persistence:** Store courses, enrollments, progress in database
2. **User-Specific Data:** Track which courses each user has enrolled in
3. **Personalization:** Calculate recommendation scores based on user profile
4. **Progress Tracking:** Store and retrieve course progress per user
5. **Admin Operations:** CRUD operations for course management

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

### Common Error Codes

- `UNAUTHORIZED`: User not authenticated or lacks required permissions
- `FORBIDDEN`: User authenticated but lacks access to resource
- `NOT_FOUND`: Resource does not exist
- `VALIDATION_ERROR`: Request data failed validation
- `CONFLICT`: Resource already exists or operation conflicts with existing data
- `INTERNAL_ERROR`: Server error

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

Fetch courses recommended for the current student based on their assessment results and profile.

**Method:** GET
**Authentication:** Required
**Query Parameters:**

- `limit` (number): Number of recommendations to return (default: 3, max: 20)

**Request Example:**

```
GET /api/courses/recommended?limit=3
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
        "duration": 8,
        "estimatedHours": 5,
        "rating": 4.7,
        "reviewCount": 1250,
        "enrollmentCount": 15420,
        "recommendedScore": 92,
        "matchingCompetencies": ["Data Analysis", "Programming"],
        "skills": ["Python", "Pandas", "NumPy"],
        "thumbnailUrl": "https://example.com/thumbnail.jpg",
        "courseraUrl": "https://coursera.org/learn/python-data-science",
        "matchReason": "Aligns with your analytical skills and career interest in data science"
      }
    ],
    "recommendationReason": "Based on your assessment results showing strong analytical skills and interest in data science",
    "generatedAt": "2024-11-13T10:30:00Z"
  }
}
```

**Recommendation Algorithm:**

The backend should calculate `recommendedScore` for each course based on:

1. **Competency Gap Matching (40% weight)**

   - Extract user's weak competencies from 360° assessment
   - Match with course.matchingCompetencies
   - Score: (matching competencies / total course competencies) × 100

2. **Career Path Alignment (30% weight)**

   - Get user's target career from profile
   - Match with course.careerPaths
   - Score: 100 if match, 0 if no match

3. **Difficulty Appropriateness (20% weight)**

   - Compare course.difficulty with user's current level
   - User level determined from assessment scores
   - Score: 100 if appropriate, 50 if slightly above, 0 if too advanced

4. **User Preferences (10% weight)**
   - Category preferences from user profile
   - Language preferences
   - Score: 100 if matches, 50 if neutral, 0 if doesn't match

**Final Score Calculation:**

```
recommendedScore = (competencyMatch × 0.4) + (careerMatch × 0.3) + (difficultyMatch × 0.2) + (preferenceMatch × 0.1)
```

**Status Codes:**

- 200: Success
- 401: Unauthorized
- 500: Internal server error

**Implementation Notes:**

- Cache recommendations for 24 hours per user to reduce computation
- Return courses sorted by recommendedScore (descending)
- Exclude courses user is already enrolled in
- Include matchReason for each course to explain why it's recommended

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

### 7. GET /api/admin/courses

Fetch all courses for admin management (Admin only). Returns all courses including inactive ones.

**Method:** GET
**Authentication:** Required (Admin role)
**Query Parameters:**

- `search` (string): Search query for course title, description, or provider
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50, max: 100)

**Response Payload:**

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course_123",
        "title": "Python for Data Science",
        "provider": "Coursera",
        "category": "Technology",
        "difficulty": "Beginner",
        "enrollmentCount": 1234,
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-02-20T14:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

**Status Codes:**

- 200: Success
- 401: Unauthorized (not admin)
- 500: Internal server error

---

### 8. POST /api/admin/courses

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

### 9. PUT /api/admin/courses/:id

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

### 10. PATCH /api/admin/courses/:id/toggle-active

Toggle course active status (Admin only).

**Method:** PATCH
**Authentication:** Required (Admin role)
**Path Parameters:**

- `id` (string): Course ID

**Response Payload:**

```json
{
  "success": true,
  "data": {
    "id": "course_123",
    "isActive": false,
    "updatedAt": "2024-03-15T10:00:00Z"
  },
  "message": "Course status updated successfully"
}
```

**Status Codes:**

- 200: Status toggled successfully
- 401: Unauthorized (not admin)
- 404: Course not found
- 500: Internal server error

---

### 11. DELETE /api/admin/courses/:id

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

## Database Schema

### Courses Table

```sql
CREATE TABLE courses (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  shortDescription TEXT,
  fullDescription TEXT,
  provider VARCHAR(255),
  instructor VARCHAR(255),
  category VARCHAR(100),
  difficulty VARCHAR(50), -- 'Beginner', 'Intermediate', 'Advanced'
  duration INT, -- weeks
  estimatedHours INT, -- hours per week
  thumbnailUrl VARCHAR(500),
  videoUrl VARCHAR(500),
  courseraUrl VARCHAR(500),
  rating DECIMAL(3,2),
  reviewCount INT DEFAULT 0,
  enrollmentCount INT DEFAULT 0,
  certificate BOOLEAN DEFAULT false,
  language VARCHAR(100),
  country VARCHAR(100),
  region VARCHAR(100),
  skills JSON, -- Array of skill strings
  matchingCompetencies JSON, -- Array of competency strings
  careerPaths JSON, -- Array of career path strings
  learningObjectives JSON, -- Array of objectives
  prerequisites JSON, -- Array of prerequisites
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdBy VARCHAR(255), -- Admin user ID
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty),
  INDEX idx_isActive (isActive),
  INDEX idx_createdAt (createdAt)
);
```

### Course Enrollments Table

```sql
CREATE TABLE course_enrollments (
  id VARCHAR(255) PRIMARY KEY,
  courseId VARCHAR(255) NOT NULL,
  studentId VARCHAR(255) NOT NULL,
  enrollmentSource VARCHAR(50), -- 'catalog', 'recommended', 'dashboard'
  status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'dropped'
  enrolledAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completedAt TIMESTAMP NULL,
  progress INT DEFAULT 0, -- 0-100 percentage
  lastAccessedAt TIMESTAMP NULL,
  FOREIGN KEY (courseId) REFERENCES courses(id),
  UNIQUE KEY unique_enrollment (courseId, studentId),
  INDEX idx_studentId (studentId),
  INDEX idx_status (status),
  INDEX idx_enrolledAt (enrolledAt)
);
```

### Course Progress Table

```sql
CREATE TABLE course_progress (
  id VARCHAR(255) PRIMARY KEY,
  enrollmentId VARCHAR(255) NOT NULL,
  moduleId VARCHAR(255),
  sectionId VARCHAR(255),
  completedAt TIMESTAMP,
  progressPercentage INT DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (enrollmentId) REFERENCES course_enrollments(id),
  INDEX idx_enrollmentId (enrollmentId),
  INDEX idx_completedAt (completedAt)
);
```

### Recommendation Cache Table (Optional)

```sql
CREATE TABLE recommendation_cache (
  id VARCHAR(255) PRIMARY KEY,
  studentId VARCHAR(255) NOT NULL,
  recommendedCourses JSON, -- Array of course IDs with scores
  generatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiresAt TIMESTAMP,
  UNIQUE KEY unique_student_cache (studentId),
  INDEX idx_expiresAt (expiresAt)
);
```

## Implementation Checklist

### Phase 1: Core Functionality (Week 1-2)

- [ ] Create database tables (courses, course_enrollments, course_progress)
- [ ] Implement GET /api/courses endpoint with filtering
- [ ] Implement GET /api/courses/:id endpoint
- [ ] Implement POST /api/courses/enroll endpoint
- [ ] Implement PUT /api/courses/:id/progress endpoint
- [ ] Implement POST /api/courses/:id/complete endpoint
- [ ] Connect frontend to backend APIs
- [ ] Test all endpoints with Postman/Insomnia

### Phase 2: Admin Management (Week 2-3)

- [ ] Implement GET /api/admin/courses endpoint
- [ ] Implement POST /api/admin/courses endpoint
- [ ] Implement PUT /api/admin/courses/:id endpoint
- [ ] Implement PATCH /api/admin/courses/:id/toggle-active endpoint
- [ ] Implement DELETE /api/admin/courses/:id endpoint
- [ ] Add admin authentication middleware
- [ ] Test admin endpoints

### Phase 3: Recommendations (Week 3-4)

- [ ] Fetch user assessment data (MIL, PCA, 360°)
- [ ] Implement recommendation algorithm
- [ ] Implement GET /api/courses/recommended endpoint
- [ ] Add recommendation caching
- [ ] Test recommendation accuracy
- [ ] Optimize performance

### Phase 4: Polish & Testing (Week 4)

- [ ] Add comprehensive error handling
- [ ] Implement rate limiting
- [ ] Add logging and monitoring
- [ ] Performance testing and optimization
- [ ] Security audit
- [ ] Documentation

## Notes

- All course data is sourced from Coursera API
- Course enrollments redirect users to Coursera platform
- Progress tracking is synchronized with Coursera's completion data
- Admin endpoints require elevated permissions
- All dates are in ISO 8601 format (UTC)
- Recommendation algorithm should be cached to reduce computation
- Consider using Redis for caching recommendations
- Implement proper error handling and validation on all endpoints
- Add request/response logging for debugging</content>
  <parameter name="filePath">k:\2025\timcare\COURSES_API_SPEC.md
