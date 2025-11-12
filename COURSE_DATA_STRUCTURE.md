# Course Data Structure Documentation

## Course Entity Fields

### Core Course Information

- **id**: `string` - Unique identifier for the course
- **title**: `string` - Course title/name
- **shortDescription**: `string` - Brief description (max 200 characters)
- **fullDescription**: `string` - Complete course description with syllabus details
- **category**: `string` - Course category (e.g., "Technology", "Business", "Design", "Data Science")
- **subcategory**: `string` - More specific category within main category
- **provider**: `string` - University or institution name (e.g., "Stanford University", "Google")
- **instructor**: `string` - Primary instructor name(s)
- **language**: `string` - Primary language of instruction (e.g., "English", "Spanish")
- **country**: `string` - Country where the institution is located
- **region**: `string` - Geographic region (e.g., "North America", "Europe", "Asia")

### Course Metadata

- **duration**: `number` - Duration in weeks
- **durationUnit**: `string` - Unit for duration ("weeks", "months")
- **difficulty**: `string` - Difficulty level ("Beginner", "Intermediate", "Advanced")
- **estimatedHours**: `number` - Estimated weekly time commitment in hours
- **certificate**: `boolean` - Whether course offers certificate upon completion
- **enrollmentCount**: `number` - Number of enrolled students
- **rating**: `number` - Average rating (0-5 scale)
- **reviewCount**: `number` - Number of reviews/ratings

### Content & Structure

- **thumbnailUrl**: `string` - URL to course thumbnail image
- **videoUrl**: `string` - URL to introductory video (optional)
- **syllabus**: `CourseModule[]` - Array of course modules/weeks
- **learningObjectives**: `string[]` - Array of learning objectives
- **prerequisites**: `string[]` - Array of prerequisite knowledge/skills
- **skills**: `string[]` - Skills that will be gained

### External Links & Integration

- **courseraUrl**: `string` - Direct link to course on Coursera platform
- **externalId**: `string` - Coursera's internal course ID

### Recommendation & Personalization

- **recommendedScore**: `number` - Recommendation score (0-100) based on student's assessments
- **matchingCompetencies**: `string[]` - Competencies this course helps develop
- **careerPaths**: `string[]` - Related career paths this course supports

### Admin & Management (Future Use)

- **isActive**: `boolean` - Whether course is currently available
- **createdAt**: `Date` - When course was added to catalog
- **updatedAt**: `Date` - Last update timestamp
- **adminNotes**: `string` - Internal notes for administrators

## Supporting Types

### CourseModule

```typescript
interface CourseModule {
  id: string;
  title: string;
  description: string;
  week: number;
  estimatedHours: number;
}
```

### CourseFilter

```typescript
interface CourseFilter {
  search?: string; // Search query
  category?: string[];
  language?: string[];
  difficulty?: string[];
  country?: string[];
  duration?: { min: number; max: number };
  provider?: string[];
  certificate?: boolean;
  rating?: { min: number; max: number };
}
```

### CourseSortOption

```typescript
type CourseSortOption =
  | "recommended" // Based on assessment results
  | "rating" // Highest rated first
  | "enrollment" // Most popular first
  | "newest" // Recently added first
  | "duration" // Shortest first
  | "title"; // Alphabetical
```

## UI Display Requirements

### Course Card (Grid/List View)

- Thumbnail image (aspect ratio 16:9)
- Title (truncated to 2 lines)
- Provider name
- Rating stars + review count
- Duration + difficulty badge
- Category tag
- "Recommended" badge (if applicable)
- "View Details" button

### Course Details Modal/Page

- Full thumbnail
- Complete title and description
- Provider and instructor info
- Rating and enrollment stats
- Duration, difficulty, language
- Learning objectives
- Prerequisites
- Syllabus overview
- "Start Course" button (external link)

### Filter Options

- Search input (title, description, provider)
- Category multi-select
- Language multi-select
- Difficulty multi-select
- Country/Region multi-select
- Duration range slider
- Certificate toggle
- Rating filter

### Recommendation Logic

- Based on student's MIL, PCA, and 360 assessment results
- Match course skills/competencies with student's competency gaps
- Boost courses related to student's career interests
- Consider student's current skill level vs course difficulty</content>
  <parameter name="filePath">k:\2025\timcare\COURSE_DATA_STRUCTURE.md
