# Frontend Integration Guide - Courses API

## Current State
- ✅ All UI components built and functional
- ✅ Mock data integration complete
- ✅ Admin management interface ready
- ❌ Backend API integration pending

## What Needs to Be Done

### Step 1: Create API Service Layer
Create `src/services/courseService.ts` to replace mock data calls:

```typescript
export async function getCourses(filters?: CourseFilter) {
  const response = await fetch('/api/courses', { /* params */ });
  return response.json();
}

export async function getRecommendedCourses(limit = 6) {
  const response = await fetch(`/api/courses/recommended?limit=${limit}`);
  return response.json();
}

export async function enrollCourse(courseId: string) {
  const response = await fetch('/api/courses/enroll', {
    method: 'POST',
    body: JSON.stringify({ courseId })
  });
  return response.json();
}
```

### Step 2: Update Components
Replace mock data with API calls in:
- `src/components/dashboard/courses/CoursesCatalog.tsx`
- `src/app/dashboard/admin/courses/_components/CourseManager.tsx`

### Step 3: Add Loading States
- Show loading spinner while fetching
- Handle errors gracefully
- Show empty states when no data

### Step 4: Add Error Handling
- Catch API errors
- Show user-friendly error messages
- Log errors for debugging

## Integration Points

### CoursesCatalog Component
```typescript
// Current: Uses mockCourses
const [courses] = useState<Course[]>(mockCourses);

// Should be: Fetch from API
useEffect(() => {
  const fetchCourses = async () => {
    const data = await getCourses(filters);
    setCourses(data.data.courses);
  };
  fetchCourses();
}, [filters]);
```

### Recommended Courses
```typescript
// Current: Sorts mock data by recommendedScore
const recommendedCourses = [...courses]
  .sort((a, b) => b.recommendedScore - a.recommendedScore)
  .slice(0, 6);

// Should be: Call recommendation endpoint
useEffect(() => {
  const fetchRecommended = async () => {
    const data = await getRecommendedCourses(6);
    setRecommendedCourses(data.data.courses);
  };
  fetchRecommended();
}, []);
```

## API Endpoints to Integrate

### Public Endpoints
- `GET /api/courses` - List courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/recommended` - Get recommendations
- `POST /api/courses/enroll` - Enroll in course
- `PUT /api/courses/:id/progress` - Update progress
- `POST /api/courses/:id/complete` - Mark complete

### Admin Endpoints
- `GET /api/admin/courses` - List all courses
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `PATCH /api/admin/courses/:id/toggle-active` - Toggle status
- `DELETE /api/admin/courses/:id` - Delete course

## Deployment Checklist

- [ ] Backend API deployed
- [ ] API endpoints tested
- [ ] Frontend service layer created
- [ ] Components updated to use API
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Performance optimized
- [ ] CORS properly configured
- [ ] Rate limiting tested
- [ ] Monitoring/logging enabled

## Timeline

- **Day 1:** Create API service layer
- **Day 2:** Update CoursesCatalog component
- **Day 3:** Update admin components
- **Day 4:** Add error handling and loading states
- **Day 5:** Testing and optimization

## Support

For questions about:
- **API Spec:** See COURSES_API_SPEC.md
- **Backend:** See BACKEND_IMPLEMENTATION_GUIDE.md
- **Frontend Components:** See component source code

