# Backend Implementation Guide - Courses API

## Quick Start

### Current State
- ✅ Frontend fully implemented with mock data
- ❌ Backend API endpoints not implemented
- ❌ Database not created
- ❌ Recommendation engine not built

### What You Need to Build
11 API endpoints across 3 categories:
- 2 Public endpoints (courses browsing)
- 1 Recommendation endpoint
- 3 Enrollment endpoints
- 5 Admin endpoints

## Phase 1: Essential (Week 1-2)

### Step 1: Create Database Tables
```bash
# Run these SQL scripts in your database
# See COURSES_API_SPEC.md for full schema
- courses
- course_enrollments
- course_progress
```

### Step 2: Implement Core Endpoints
1. **GET /api/courses** - List all courses with filters
2. **GET /api/courses/:id** - Get single course details
3. **POST /api/courses/enroll** - Track enrollment
4. **PUT /api/courses/:id/progress** - Update progress
5. **POST /api/courses/:id/complete** - Mark complete

### Step 3: Test & Connect
- Test endpoints with Postman
- Frontend will connect automatically once endpoints are live

## Phase 2: Admin (Week 2-3)

### Implement Admin Endpoints
1. **GET /api/admin/courses** - List all courses (admin)
2. **POST /api/admin/courses** - Create course
3. **PUT /api/admin/courses/:id** - Update course
4. **PATCH /api/admin/courses/:id/toggle-active** - Toggle status
5. **DELETE /api/admin/courses/:id** - Delete course

### Add Admin Middleware
- Verify JWT token has `role: "admin"`
- Return 401 if not admin

## Phase 3: Recommendations (Week 3-4)

### Implement Recommendation Algorithm
See COURSES_API_SPEC.md for detailed algorithm:
- Fetch user's assessment data (MIL, PCA, 360°)
- Calculate scores based on 4 factors
- Cache results for 24 hours
- Return top N courses

### Implement Endpoint
- **GET /api/courses/recommended** - Get personalized recommendations

## Key Implementation Details

### Authentication
```
Header: Authorization: Bearer <jwt_token>
```

### Response Format
```json
{
  "success": true,
  "data": { /* payload */ },
  "message": "Optional message"
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": "Optional details"
  }
}
```

### Recommendation Algorithm
```
Score = (competencyMatch × 0.4) + (careerMatch × 0.3) + 
        (difficultyMatch × 0.2) + (preferenceMatch × 0.1)
```

## Testing Checklist

### Phase 1 Testing
- [ ] GET /api/courses returns courses
- [ ] Filters work (category, difficulty, etc.)
- [ ] GET /api/courses/:id returns single course
- [ ] POST /api/courses/enroll creates enrollment
- [ ] PUT /api/courses/:id/progress updates progress
- [ ] POST /api/courses/:id/complete marks complete

### Phase 2 Testing
- [ ] Admin endpoints require admin role
- [ ] CRUD operations work correctly
- [ ] Toggle active status works
- [ ] Delete prevents active enrollments

### Phase 3 Testing
- [ ] Recommendations are personalized
- [ ] Algorithm scores are correct
- [ ] Caching works (24-hour TTL)
- [ ] Performance is acceptable

## Performance Considerations

1. **Database Indexes:** Already specified in schema
2. **Caching:** Use Redis for recommendations
3. **Pagination:** Implement for large result sets
4. **Rate Limiting:** 100 req/min for users, 50 for admins

## Security Checklist

- [ ] Validate all input data
- [ ] Sanitize search queries
- [ ] Verify admin role on admin endpoints
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Hash sensitive data
- [ ] Log all admin operations
- [ ] Rate limit endpoints

## Frontend Integration

Frontend will automatically work once endpoints are live:
- No frontend changes needed
- Just ensure endpoints match specification
- Return data in exact format specified
- Use correct HTTP status codes

## Questions?

Refer to COURSES_API_SPEC.md for:
- Complete endpoint specifications
- Request/response examples
- Database schema
- Error codes
- Implementation checklist

