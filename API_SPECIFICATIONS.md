# Resume Builder API Specifications

This document provides comprehensive API specifications for the Resume Builder application backend development.

## Table of Contents

1. [Authentication](#authentication)
2. [Resume Management](#resume-management)
3. [Section Management](#section-management)
4. [Template Management](#template-management)
5. [Error Responses](#error-responses)

---

### Authentication

All API endpoints require JWT authentication.

**Authentication Header:**

```
Authorization: Bearer <JWT_TOKEN>
```

The JWT token should be obtained from the login endpoint and stored in localStorage.

---

## Resume Management

### 1. Create Resume

**Endpoint:** `POST /api/resume`

**Description:** Creates a new resume for the authenticated user.

**Request Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body:**

```json
{
  "name": "Software Engineer Resume",
  "template": "modern",
  "careerField": "technology",
  "personalInfo": {
    "fullName": "John Doe",
    "professionalTitle": "Senior Software Engineer",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "linkedin": "linkedin.com/in/johndoe",
    "website": "johndoe.com",
    "github": "github.com/johndoe",
    "twitter": "@johndoe",
    "dateOfBirth": "1990-01-15",
    "nationality": "American",
    "languages": "English, Spanish",
    "maritalStatus": "Single",
    "driversLicense": "Yes",
    "militaryService": "None",
    "visaStatus": "Citizen",
    "preferredPronouns": "He/Him",
    "summary": "Experienced software engineer with 8+ years...",
    "careerObjective": "Seeking a challenging role..."
  },
  "experience": [
    {
      "id": "exp-1",
      "company": "Tech Corp",
      "position": "Senior Software Engineer",
      "location": "San Francisco, CA",
      "startDate": "2020-01",
      "endDate": "Present",
      "description": "Led development of microservices architecture..."
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "degree": "Bachelor of Science in Computer Science",
      "school": "Stanford University",
      "location": "Stanford, CA",
      "startDate": "2008-09",
      "endDate": "2012-06",
      "gpa": "3.8"
    }
  ],
  "skills": [
    {
      "id": "skill-1",
      "name": "JavaScript",
      "level": "expert"
    },
    {
      "id": "skill-2",
      "name": "React",
      "level": "expert"
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "type": "languages",
      "title": "Languages",
      "isExpanded": false,
      "entries": [
        {
          "id": "lang-1",
          "language": "English",
          "proficiency": "Native"
        }
      ]
    }
  ],
  "fieldVisibility": {
    "professionalTitle": true,
    "email": true,
    "phone": true,
    "location": true,
    "linkedin": true,
    "website": false,
    "github": true,
    "twitter": false,
    "dateOfBirth": false,
    "nationality": false,
    "languages": false,
    "maritalStatus": false,
    "driversLicense": false,
    "militaryService": false,
    "visaStatus": false,
    "preferredPronouns": false,
    "summary": true,
    "careerObjective": false
  },
  "customFields": []
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "_id": "resume-123",
    "userId": "user-456",
    "name": "Software Engineer Resume",
    "template": "modern",
    "careerField": "technology",
    "personalInfo": { ... },
    "experience": [ ... ],
    "education": [ ... ],
    "skills": [ ... ],
    "sections": [ ... ],
    "fieldVisibility": { ... },
    "customFields": [],
    "createdAt": "2025-10-28T10:00:00Z",
    "updatedAt": "2025-10-28T10:00:00Z"
  }
}
```

---

### 2. Get All Resumes

**Endpoint:** `GET /api/resume`

**Description:** Retrieves all resumes for the authenticated user.

**Request Headers:**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Query Parameters:**

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of resumes per page (default: 10)
- `sortBy` (optional): Field to sort by (default: "updatedAt")
- `order` (optional): Sort order "asc" or "desc" (default: "desc")

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "resume-123",
      "name": "Software Engineer Resume",
      "template": "modern",
      "careerField": "technology",
      "createdAt": "2025-10-20T10:00:00Z",
      "updatedAt": "2025-10-28T15:30:00Z",
      "preview": "https://cdn.example.com/previews/resume-123.png"
    },
    {
      "_id": "resume-124",
      "name": "Product Manager Resume",
      "template": "classic",
      "careerField": "business",
      "createdAt": "2025-10-15T14:00:00Z",
      "updatedAt": "2025-10-25T09:15:00Z",
      "preview": "https://cdn.example.com/previews/resume-124.png"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

---

### 3. Get Resume by ID

**Endpoint:** `GET /api/resume/:id`

**Description:** Retrieves a specific resume by ID.

**Request Headers:**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "resume-123",
    "userId": "user-456",
    "name": "Software Engineer Resume",
    "template": "modern",
    "careerField": "technology",
    "personalInfo": { ... },
    "experience": [ ... ],
    "education": [ ... ],
    "skills": [ ... ],
    "sections": [ ... ],
    "fieldVisibility": { ... },
    "customFields": [],
    "createdAt": "2025-10-28T10:00:00Z",
    "updatedAt": "2025-10-28T10:00:00Z"
  }
}
```

---

### 4. Update Resume

**Endpoint:** `PUT /api/resume/:id`

**Description:** Updates an existing resume. This endpoint supports partial updates (only send fields that changed).

**Request Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body (Partial Update Example):**

```json
{
  "name": "Updated Resume Name",
  "personalInfo": {
    "fullName": "John Smith",
    "email": "john.smith@example.com"
  }
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "resume-123",
    "userId": "user-456",
    "name": "Updated Resume Name",
    "template": "modern",
    "personalInfo": { ... },
    "updatedAt": "2025-10-28T16:00:00Z"
  }
}
```

---

## Section Management

### 11. Update Section Order

**Endpoint:** `PATCH /api/resume/:id/sections/order`

**Description:** Updates the order of sections in a resume (for drag-and-drop functionality).

**Request Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body:**

```json
{
  "sectionIds": ["section-3", "section-1", "section-2", "section-4"]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "resumeId": "resume-123",
    "sections": [
      {
        "id": "section-3",
        "type": "languages",
        "title": "Languages",
        "order": 0
      },
      {
        "id": "section-1",
        "type": "certificates",
        "title": "Certificates",
        "order": 1
      },
      {
        "id": "section-2",
        "type": "projects",
        "title": "Projects",
        "order": 2
      },
      {
        "id": "section-4",
        "type": "awards",
        "title": "Awards",
        "order": 3
      }
    ],
    "updatedAt": "2025-10-28T18:00:00Z"
  }
}
```

---

### 12. Add Section

**Endpoint:** `POST /api/resume/:id/sections`

**Description:** Adds a new section to a resume.

**Request Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body:**

```json
{
  "type": "languages",
  "title": "Languages",
  "entries": []
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "section-5",
    "type": "languages",
    "title": "Languages",
    "isExpanded": false,
    "entries": [],
    "createdAt": "2025-10-28T18:30:00Z"
  }
}
```

---

### 13. Delete Section

**Endpoint:** `DELETE /api/resume/:id/sections/:sectionId`

**Description:** Deletes a section from a resume.

**Request Headers:**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Section deleted successfully"
}
```

---

## Template Management

### 14. Update Template

**Endpoint:** `PATCH /api/resume/:id/template`

**Description:** Updates the template for a resume.

**Request Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body:**

```json
{
  "template": "classic"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "resumeId": "resume-123",
    "template": "classic",
    "updatedAt": "2025-10-28T19:00:00Z"
  }
}
```

---

## Error Responses

All error responses follow this format:

### 400 Bad Request

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Invalid request body. Missing required field: personalInfo.fullName"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Authentication token is missing or invalid"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Forbidden",
  "message": "You do not have permission to access this resume"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Not Found",
  "message": "Resume not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred. Please try again later."
}
```

---

## Database Schema Recommendations

### Resume Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  name: string,
  template: string,
  careerField: string,
  personalInfo: {
    fullName: string,
    professionalTitle?: string,
    email: string,
    phone?: string,
    location?: string,
    linkedin?: string,
    website?: string,
    github?: string,
    twitter?: string,
    dateOfBirth?: string,
    nationality?: string,
    languages?: string,
    maritalStatus?: string,
    driversLicense?: string,
    militaryService?: string,
    visaStatus?: string,
    preferredPronouns?: string,
    summary?: string,
    careerObjective?: string
  },
  experience: Array<{
    id: string,
    company: string,
    position: string,
    location?: string,
    startDate: string,
    endDate?: string,
    description?: string
  }>,
  education: Array<{
    id: string,
    degree: string,
    school: string,
    location?: string,
    startDate: string,
    endDate?: string,
    gpa?: string
  }>,
  skills: Array<{
    id: string,
    name: string,
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  }>,
  sections: Array<{
    id: string,
    type: string,
    title: string,
    isExpanded: boolean,
    order: number,
    entries: Array<Record<string, any>>
  }>,
  fieldVisibility: Record<string, boolean>,
  customFields: Array<{
    id: string,
    name: string,
    type: 'text' | 'textarea'
  }>,
  createdAt: Date,
  updatedAt: Date
}

---

```
