# University Suggestions API Routes Documentation

This document outlines the backend API routes needed for the University Suggestions feature. These routes will provide personalized university recommendations based on user assessments, search/filter capabilities, and administrative functions.

## Overview

The University Suggestions module recommends universities based on:
- **PCA Assessment** - Personality traits for major/program matching
- **MIL/LIA Assessment** - Cognitive abilities for academic rigor matching
- **Career Goals** - Target career alignment with university programs
- **User Preferences** - Location, budget, campus size, etc.

---

## Data Models

### University Entity

```typescript
interface University {
  id: string;
  name: string;
  shortName?: string;
  logo: string;
  coverImage?: string;
  type: "public" | "private" | "community";
  
  // Location
  country: string;
  state?: string;
  city: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  
  // Rankings & Stats
  ranking: {
    global?: number;
    national?: number;
    byField?: Record<string, number>;
    source?: string;
    year?: number;
  };
  acceptanceRate?: number;
  graduationRate?: number;
  studentCount?: number;
  facultyCount?: number;
  studentFacultyRatio?: number;
  
  // Academics
  programs: UniversityProgram[];
  majors: string[];
  researchAreas?: string[];
  accreditations?: string[];
  
  // Financial
  tuition: {
    inState?: number;
    outOfState?: number;
    international?: number;
    currency: string;
    period: "year" | "semester" | "credit";
  };
  financialAid?: {
    scholarshipsAvailable: boolean;
    averageAid?: number;
    percentReceivingAid?: number;
  };
  
  // Campus Life
  campusSize?: "small" | "medium" | "large";
  setting?: "urban" | "suburban" | "rural";
  housing?: boolean;
  athletics?: boolean;
  
  // Contact & Links
  website: string;
  admissionsUrl?: string;
  email?: string;
  phone?: string;
  
  // Metadata
  description: string;
  highlights?: string[];
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UniversityProgram {
  id: string;
  name: string;
  degree: "Associate" | "Bachelor" | "Master" | "Doctorate" | "Certificate";
  field: string;
  duration: number; // in years
  credits?: number;
  description?: string;
  careerOutcomes?: string[];
  requiredCompetencies?: string[];
  matchingPersonalityTraits?: string[]; // D, I, S, C preferences
}
```

### Recommendation Response

```typescript
interface UniversityRecommendation {
  university: University;
  matchScore: number; // 0-100
  matchBreakdown: {
    personalityMatch: number;   // PCA-based
    academicMatch: number;      // MIL-based
    careerAlignment: number;    // Career goals
    preferencesMatch: number;   // User preferences
  };
  matchReasons: {
    en: string[];
    es: string[];
  };
  recommendedPrograms: UniversityProgram[];
  rank: number;
}
```

---

## API Routes

### 1. Search Universities

**Endpoint:** `GET /api/v1/universities`

**Description:** Search and filter universities with pagination support.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Text search (name, location, programs) |
| `country` | string[] | No | - | Filter by country codes |
| `type` | string[] | No | - | Filter by type: `public`, `private`, `community` |
| `degree` | string[] | No | - | Filter by degree level |
| `field` | string[] | No | - | Filter by field of study |
| `tuitionMin` | number | No | - | Minimum tuition (USD) |
| `tuitionMax` | number | No | - | Maximum tuition (USD) |
| `rankingMax` | number | No | - | Maximum ranking (e.g., top 100) |
| `acceptanceRateMin` | number | No | - | Minimum acceptance rate % |
| `campusSize` | string[] | No | - | Filter: `small`, `medium`, `large` |
| `setting` | string[] | No | - | Filter: `urban`, `suburban`, `rural` |
| `sort` | string | No | `recommended` | Sort: `recommended`, `ranking`, `name`, `tuition`, `acceptance` |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Items per page |
| `lang` | string | No | `en` | Language: `en` or `es` |

**Request Example:**
```http
GET /api/v1/universities?country=US,MX&type=public&degree=Bachelor&tuitionMax=30000&sort=ranking&page=1&limit=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "universities": [
      {
        "id": "uni_mit_001",
        "name": "Massachusetts Institute of Technology",
        "shortName": "MIT",
        "logo": "https://example.com/mit-logo.png",
        "type": "private",
        "country": "US",
        "state": "Massachusetts",
        "city": "Cambridge",
        "ranking": {
          "global": 1,
          "national": 1,
          "source": "QS World Rankings",
          "year": 2024
        },
        "acceptanceRate": 3.96,
        "tuition": {
          "outOfState": 57986,
          "international": 57986,
          "currency": "USD",
          "period": "year"
        },
        "campusSize": "medium",
        "setting": "urban",
        "description": "World-leading research university...",
        "highlights": ["#1 Engineering", "Top Research Output", "92% Employment Rate"],
        "programCount": 53
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    },
    "filters": {
      "availableCountries": ["US", "MX", "CA", "UK", "ES"],
      "availableFields": ["Engineering", "Business", "Computer Science", "Medicine"],
      "tuitionRange": { "min": 0, "max": 75000 }
    }
  }
}
```

**Where Used:**
- `src/app/dashboard/university/page.tsx` - University catalog page
- `src/hooks/useUniversityQueries.ts` - Data fetching hook

---

### 2. Get University Details

**Endpoint:** `GET /api/v1/universities/:id`

**Description:** Get complete details for a specific university.

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | University ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language: `en` or `es` |
| `includePrograms` | boolean | No | Include full program list (default: true) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "university": {
      "id": "uni_stanford_001",
      "name": "Stanford University",
      "shortName": "Stanford",
      "logo": "https://example.com/stanford-logo.png",
      "coverImage": "https://example.com/stanford-cover.jpg",
      "type": "private",
      "country": "US",
      "state": "California",
      "city": "Stanford",
      "address": "450 Serra Mall, Stanford, CA 94305",
      "coordinates": { "lat": 37.4275, "lng": -122.1697 },
      "ranking": {
        "global": 3,
        "national": 3,
        "byField": {
          "Computer Science": 1,
          "Business": 2,
          "Engineering": 2
        },
        "source": "QS World Rankings",
        "year": 2024
      },
      "acceptanceRate": 3.68,
      "graduationRate": 95,
      "studentCount": 17249,
      "facultyCount": 2288,
      "studentFacultyRatio": 5,
      "programs": [
        {
          "id": "prog_cs_bs",
          "name": "Computer Science",
          "degree": "Bachelor",
          "field": "Technology",
          "duration": 4,
          "credits": 180,
          "description": "Comprehensive CS program...",
          "careerOutcomes": ["Software Engineer", "Data Scientist", "Product Manager"],
          "requiredCompetencies": ["Problem Solving", "Analytical Thinking", "Creativity"],
          "matchingPersonalityTraits": ["C", "D"]
        }
      ],
      "majors": ["Computer Science", "Engineering", "Business", "Medicine", "Law"],
      "researchAreas": ["AI", "Biotechnology", "Clean Energy", "Medicine"],
      "accreditations": ["WASC", "AACSB", "ABET"],
      "tuition": {
        "outOfState": 56169,
        "international": 56169,
        "currency": "USD",
        "period": "year"
      },
      "financialAid": {
        "scholarshipsAvailable": true,
        "averageAid": 52000,
        "percentReceivingAid": 68
      },
      "campusSize": "large",
      "setting": "suburban",
      "housing": true,
      "athletics": true,
      "website": "https://www.stanford.edu",
      "admissionsUrl": "https://admission.stanford.edu",
      "email": "admission@stanford.edu",
      "phone": "+1-650-723-2300",
      "description": "Stanford University is a private research university...",
      "highlights": [
        "World-renowned faculty",
        "Strong industry connections in Silicon Valley",
        "Exceptional research opportunities",
        "Beautiful 8,180-acre campus"
      ],
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-11-30T14:30:00Z"
    },
    "relatedUniversities": [
      { "id": "uni_mit_001", "name": "MIT", "matchScore": 95 },
      { "id": "uni_berkeley_001", "name": "UC Berkeley", "matchScore": 88 }
    ]
  }
}
```

**Where Used:**
- `src/components/dashboard/University/UniversityDetailsModal.tsx` - Details modal

---

### 3. Get Personalized Recommendations

**Endpoint:** `GET /api/v1/universities/recommendations`

**Description:** Get AI-powered personalized university recommendations based on user's assessments and preferences.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of recommendations (default: 10, max: 50) |
| `degree` | string[] | No | Filter by degree level |
| `field` | string[] | No | Filter by field of study |
| `country` | string[] | No | Preferred countries |
| `includeReasons` | boolean | No | Include match reasoning (default: true) |
| `lang` | string | No | Language: `en` or `es` |

**Recommendation Algorithm:**
```
Total Score = (PersonalityMatch × 0.30) + (AcademicMatch × 0.25) + 
              (CareerAlignment × 0.25) + (PreferencesMatch × 0.20)

Where:
- PersonalityMatch: PCA (D,I,S,C) alignment with program requirements
- AcademicMatch: MIL cognitive scores vs program academic rigor
- CareerAlignment: Target career match with program outcomes
- PreferencesMatch: User preferences (location, budget, size) alignment
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "university": {
          "id": "uni_stanford_001",
          "name": "Stanford University",
          "logo": "https://example.com/stanford-logo.png",
          "country": "US",
          "city": "Stanford, California",
          "ranking": { "global": 3, "national": 3 },
          "tuition": { "international": 56169, "currency": "USD" },
          "acceptanceRate": 3.68
        },
        "matchScore": 94,
        "matchBreakdown": {
          "personalityMatch": 92,
          "academicMatch": 96,
          "careerAlignment": 95,
          "preferencesMatch": 90
        },
        "matchReasons": {
          "en": [
            "Your high Conscientiousness (C) aligns well with their rigorous programs",
            "Strong match for your target career in Technology",
            "Academic programs match your cognitive strengths",
            "Located in your preferred region"
          ],
          "es": [
            "Tu alta Responsabilidad (C) se alinea bien con sus programas rigurosos",
            "Fuerte coincidencia con tu carrera objetivo en Tecnología",
            "Los programas académicos coinciden con tus fortalezas cognitivas",
            "Ubicado en tu región preferida"
          ]
        },
        "recommendedPrograms": [
          {
            "id": "prog_cs_bs",
            "name": "Computer Science",
            "degree": "Bachelor",
            "field": "Technology",
            "matchScore": 96
          },
          {
            "id": "prog_ee_bs",
            "name": "Electrical Engineering",
            "degree": "Bachelor",
            "field": "Engineering",
            "matchScore": 91
          }
        ],
        "rank": 1
      }
    ],
    "meta": {
      "totalMatches": 45,
      "generatedAt": "2024-12-03T10:30:00Z",
      "basedOn": {
        "pcaCompleted": true,
        "milCompleted": true,
        "careerPreferences": ["Technology", "Engineering"],
        "targetDegree": "Bachelor"
      }
    }
  }
}
```

**Where Used:**
- `src/app/dashboard/university/page.tsx` - Recommendations section
- `src/components/dashboard/University/UniversityStats.tsx` - Match insights
- `src/hooks/useUniversityQueries.ts` - React Query hook

---

### 4. Get Recommendation Stats

**Endpoint:** `GET /api/v1/universities/recommendations/stats`

**Description:** Get aggregated statistics about user's university recommendations.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language: `en` or `es` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalMatches": 127,
      "excellentMatches": 12,
      "goodMatches": 45,
      "averageMatchScore": 78,
      "topMatchScore": 94
    },
    "byDegree": {
      "Bachelor": { "count": 89, "avgScore": 76 },
      "Master": { "count": 38, "avgScore": 82 }
    },
    "byField": {
      "Technology": { "count": 45, "avgScore": 85 },
      "Engineering": { "count": 32, "avgScore": 80 },
      "Business": { "count": 28, "avgScore": 72 }
    },
    "byCountry": {
      "US": { "count": 78, "avgScore": 79 },
      "MX": { "count": 25, "avgScore": 75 },
      "UK": { "count": 24, "avgScore": 77 }
    },
    "topRecommendedFields": [
      { "field": "Computer Science", "matchScore": 92 },
      { "field": "Data Science", "matchScore": 88 },
      { "field": "Software Engineering", "matchScore": 85 }
    ],
    "assessmentInsights": {
      "strengthsApplied": [
        "High analytical ability (MIL) matches STEM programs",
        "Conscientiousness (PCA) suits research-intensive universities"
      ],
      "suggestedImprovements": [
        "Consider programs that develop leadership skills (Influence)",
        "Look for universities with strong internship programs"
      ]
    }
  }
}
```

**Where Used:**
- `src/components/dashboard/University/UniversityStats.tsx` - Stats display

---

### 5. Save/Unsave Favorite University

**Endpoint:** `POST /api/v1/universities/:id/favorite`

**Description:** Toggle favorite status for a university.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | University ID |

**Request Body:**
```json
{
  "action": "save" | "unsave"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "universityId": "uni_stanford_001",
    "isFavorited": true,
    "favoritedAt": "2024-12-03T10:30:00Z"
  },
  "message": "University saved to favorites"
}
```

**Where Used:**
- `src/components/dashboard/University/UniversityCard.tsx` - Favorite button
- `src/hooks/useUniversityQueries.ts` - Mutation hook

---

### 6. Get User's Favorite Universities

**Endpoint:** `GET /api/v1/universities/favorites`

**Description:** Get list of user's favorited universities.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20) |
| `lang` | string | No | Language: `en` or `es` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "universityId": "uni_stanford_001",
        "university": { /* University object */ },
        "favoritedAt": "2024-12-03T10:30:00Z",
        "matchScore": 94,
        "notes": "Top choice for CS"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

**Where Used:**
- `src/app/dashboard/university/page.tsx` - Favorites tab
- `src/hooks/useUniversityQueries.ts` - Query hook

---

### 7. Compare Universities

**Endpoint:** `POST /api/v1/universities/compare`

**Description:** Get side-by-side comparison of multiple universities.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "universityIds": ["uni_stanford_001", "uni_mit_001", "uni_berkeley_001"],
  "lang": "en"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "universities": [
      {
        "id": "uni_stanford_001",
        "name": "Stanford University",
        "logo": "https://example.com/stanford-logo.png",
        "matchScore": 94,
        "ranking": { "global": 3 },
        "acceptanceRate": 3.68,
        "tuition": { "international": 56169 },
        "graduationRate": 95,
        "studentCount": 17249,
        "setting": "suburban",
        "financialAid": { "averageAid": 52000 }
      },
      {
        "id": "uni_mit_001",
        "name": "MIT",
        "logo": "https://example.com/mit-logo.png",
        "matchScore": 92,
        "ranking": { "global": 1 },
        "acceptanceRate": 3.96,
        "tuition": { "international": 57986 },
        "graduationRate": 94,
        "studentCount": 11574,
        "setting": "urban",
        "financialAid": { "averageAid": 48000 }
      },
      {
        "id": "uni_berkeley_001",
        "name": "UC Berkeley",
        "logo": "https://example.com/berkeley-logo.png",
        "matchScore": 88,
        "ranking": { "global": 10 },
        "acceptanceRate": 11.4,
        "tuition": { "international": 44066 },
        "graduationRate": 93,
        "studentCount": 45057,
        "setting": "urban",
        "financialAid": { "averageAid": 24000 }
      }
    ],
    "comparisonFields": [
      "ranking", "acceptanceRate", "tuition", "graduationRate", 
      "studentCount", "setting", "financialAid"
    ],
    "recommendation": {
      "bestOverall": "uni_stanford_001",
      "bestValue": "uni_berkeley_001",
      "bestAcademics": "uni_mit_001"
    }
  }
}
```

**Where Used:**
- `src/components/dashboard/University/UniversityCompareModal.tsx` - Comparison view

---

### 8. Get Available Filters

**Endpoint:** `GET /api/v1/universities/filters`

**Description:** Get available filter options with counts.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "countries": [
      { "code": "US", "name": "United States", "count": 156 },
      { "code": "MX", "name": "Mexico", "count": 45 },
      { "code": "CA", "name": "Canada", "count": 38 },
      { "code": "UK", "name": "United Kingdom", "count": 52 }
    ],
    "types": [
      { "value": "public", "label": "Public", "count": 189 },
      { "value": "private", "label": "Private", "count": 142 },
      { "value": "community", "label": "Community College", "count": 67 }
    ],
    "degrees": [
      { "value": "Associate", "label": "Associate", "count": 45 },
      { "value": "Bachelor", "label": "Bachelor's", "count": 312 },
      { "value": "Master", "label": "Master's", "count": 287 },
      { "value": "Doctorate", "label": "Doctorate", "count": 156 },
      { "value": "Certificate", "label": "Certificate", "count": 89 }
    ],
    "fields": [
      { "value": "Technology", "label": "Technology", "count": 245 },
      { "value": "Engineering", "label": "Engineering", "count": 223 },
      { "value": "Business", "label": "Business", "count": 298 },
      { "value": "Medicine", "label": "Medicine & Health", "count": 178 },
      { "value": "Arts", "label": "Arts & Humanities", "count": 234 },
      { "value": "Science", "label": "Natural Sciences", "count": 256 }
    ],
    "campusSizes": [
      { "value": "small", "label": "Small (< 5,000)", "count": 98 },
      { "value": "medium", "label": "Medium (5,000 - 15,000)", "count": 156 },
      { "value": "large", "label": "Large (> 15,000)", "count": 144 }
    ],
    "settings": [
      { "value": "urban", "label": "Urban", "count": 189 },
      { "value": "suburban", "label": "Suburban", "count": 156 },
      { "value": "rural", "label": "Rural", "count": 53 }
    ],
    "tuitionRange": {
      "min": 0,
      "max": 75000,
      "currency": "USD"
    },
    "rankingRange": {
      "min": 1,
      "max": 1000
    }
  }
}
```

**Where Used:**
- `src/components/dashboard/University/UniversityFilters.tsx` - Filter sidebar

---

## Admin Routes

### 9. List All Universities (Admin)

**Endpoint:** `GET /api/v1/admin/universities`

**Description:** Get all universities with admin-level details.

**Headers:**
```
Authorization: Bearer <token>
X-Admin-Role: admin
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search by name |
| `isActive` | boolean | No | Filter by active status |
| `page` | number | No | Page number |
| `limit` | number | No | Items per page |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "universities": [
      {
        "id": "uni_stanford_001",
        "name": "Stanford University",
        "country": "US",
        "isActive": true,
        "programCount": 53,
        "viewCount": 1234,
        "favoriteCount": 456,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-11-30T14:30:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 398, "totalPages": 20 }
  }
}
```

---

### 10. Create University (Admin)

**Endpoint:** `POST /api/v1/admin/universities`

**Description:** Create a new university entry.

**Headers:**
```
Authorization: Bearer <token>
X-Admin-Role: admin
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Stanford University",
  "shortName": "Stanford",
  "type": "private",
  "country": "US",
  "state": "California",
  "city": "Stanford",
  "ranking": { "global": 3, "national": 3 },
  "acceptanceRate": 3.68,
  "tuition": {
    "international": 56169,
    "currency": "USD",
    "period": "year"
  },
  "description": "Stanford University is a private research university...",
  "website": "https://www.stanford.edu",
  "programs": [
    {
      "name": "Computer Science",
      "degree": "Bachelor",
      "field": "Technology",
      "duration": 4
    }
  ],
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "university": { /* Full university object */ }
  },
  "message": "University created successfully"
}
```

---

### 11. Update University (Admin)

**Endpoint:** `PUT /api/v1/admin/universities/:id`

**Description:** Update an existing university.

**Headers:**
```
Authorization: Bearer <token>
X-Admin-Role: admin
Content-Type: application/json
```

**Request Body:** (Partial update supported)
```json
{
  "ranking": { "global": 2, "national": 2 },
  "acceptanceRate": 3.5,
  "tuition": {
    "international": 58000,
    "currency": "USD",
    "period": "year"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "university": { /* Updated university object */ }
  },
  "message": "University updated successfully"
}
```

---

### 12. Delete University (Admin)

**Endpoint:** `DELETE /api/v1/admin/universities/:id`

**Description:** Soft delete a university (sets isActive to false).

**Headers:**
```
Authorization: Bearer <token>
X-Admin-Role: admin
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "University deleted successfully"
}
```

---

### 13. Toggle University Active Status (Admin)

**Endpoint:** `PATCH /api/v1/admin/universities/:id/toggle-active`

**Description:** Toggle the active status of a university.

**Headers:**
```
Authorization: Bearer <token>
X-Admin-Role: admin
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "universityId": "uni_stanford_001",
    "isActive": false
  },
  "message": "University status updated"
}
```

---

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Invalid request parameters |
| 401 | Unauthorized - invalid/missing token |
| 403 | Forbidden - admin access required |
| 404 | University not found |
| 409 | Conflict - duplicate entry |
| 422 | Validation error |
| 500 | Internal server error |

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "UNIVERSITY_NOT_FOUND",
    "message": "The requested university does not exist",
    "details": { "universityId": "invalid_id" }
  }
}
```

---

## Recommendation Algorithm Details

### Scoring Factors

| Factor | Weight | Data Source | Description |
|--------|--------|-------------|-------------|
| Personality Match | 30% | PCA Assessment | Matches D,I,S,C scores with program personality requirements |
| Academic Match | 25% | MIL Assessment | Matches cognitive abilities with program academic rigor |
| Career Alignment | 25% | User Preferences | Matches target career with program career outcomes |
| Preferences Match | 20% | User Profile | Matches location, budget, campus preferences |

### Personality-Program Matching Matrix

| PCA Trait | Best Program Types | Example Fields |
|-----------|-------------------|----------------|
| High D (Dominance) | Leadership, Management, Competitive | Business, Law, Politics |
| High I (Influence) | Communication, Creative, Social | Marketing, Arts, Psychology |
| High S (Steadiness) | Supportive, Structured, Team-based | Healthcare, Education, HR |
| High C (Conscientiousness) | Analytical, Detail-oriented, Research | Engineering, Science, Finance |

### Academic Rigor Matching (MIL-based)

| MIL Score Range | Recommended Program Rigor |
|-----------------|--------------------------|
| 90-100% | Top-tier research universities, highly competitive programs |
| 75-89% | Competitive programs at reputable universities |
| 60-74% | Standard programs at good universities |
| Below 60% | Programs with additional support, community colleges |

---

## Implementation Notes

### Caching Strategy

- **University List:** 24-hour TTL, invalidate on admin changes
- **Recommendations:** 24-hour TTL per user, invalidate on new assessment completion
- **Filters:** 48-hour TTL
- **User Favorites:** No cache, real-time

### Performance Targets

- University search: < 300ms
- Recommendation generation: < 1s
- Detail fetch: < 200ms

### Database Indexes (Recommended)

```sql
-- Primary indexes
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_universities_type ON universities(type);
CREATE INDEX idx_universities_ranking ON universities(ranking_global);
CREATE INDEX idx_universities_active ON universities(is_active);

-- Full-text search
CREATE INDEX idx_universities_search ON universities USING gin(to_tsvector('english', name || ' ' || description));

-- Programs indexes
CREATE INDEX idx_programs_university ON university_programs(university_id);
CREATE INDEX idx_programs_field ON university_programs(field);
CREATE INDEX idx_programs_degree ON university_programs(degree);

-- Favorites index
CREATE INDEX idx_favorites_user ON university_favorites(user_id);
```

---

## Frontend Integration

### Components That Use These APIs

| Component | API Routes Used |
|-----------|-----------------|
| `UniversityPage` | Search, Recommendations, Filters |
| `UniversityCard` | Favorite toggle |
| `UniversityDetailsModal` | Get Details |
| `UniversityFilters` | Get Filters |
| `UniversityStats` | Recommendation Stats |
| `UniversityCompareModal` | Compare |
| `AdminUniversityManager` | Admin CRUD routes |

### React Query Keys

```typescript
const universityKeys = {
  all: ['universities'] as const,
  lists: () => [...universityKeys.all, 'list'] as const,
  list: (filters: UniversityFilters) => [...universityKeys.lists(), filters] as const,
  details: () => [...universityKeys.all, 'detail'] as const,
  detail: (id: string) => [...universityKeys.details(), id] as const,
  recommendations: () => [...universityKeys.all, 'recommendations'] as const,
  stats: () => [...universityKeys.all, 'stats'] as const,
  favorites: () => [...universityKeys.all, 'favorites'] as const,
  filters: () => [...universityKeys.all, 'filters'] as const,
  compare: (ids: string[]) => [...universityKeys.all, 'compare', ids] as const,
};
```
