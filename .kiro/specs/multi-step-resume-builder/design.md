# Design Document

## Overview

The multi-step resume builder will enhance the existing resume builder functionality by adding intelligent user profiling, template recommendation, and design customization capabilities. The system will guide users through a structured process that adapts to their professional background and creates optimized, single-page resumes.

The design builds upon the existing Next.js application with React, TypeScript, Zustand for state management, React Hook Form for form handling, and @react-pdf/renderer for PDF generation. The current 5-step process will be expanded to include profiling and template selection phases.

## Architecture

### High-Level Flow

```
User Profile Assessment → Template Recommendation → Data Collection → Content Optimization → Design Customization → Final Review
```

### Enhanced Step Structure

1. **Profile Assessment** (New) - Understand user's professional context
2. **Template Selection** (New) - AI-recommended templates based on profile
3. **Personal Information** (Enhanced) - Existing step with profile-aware guidance
4. **Work Experience** (Enhanced) - Adaptive based on career level
5. **Education** (Enhanced) - Emphasis adjustment based on experience level
6. **Skills** (Enhanced) - Industry-specific skill suggestions
7. **Content Optimization** (New) - Single-page fitting and content refinement
8. **Design Customization** (Enhanced) - Real-time template switching and preview

### State Management Architecture

The existing Zustand store will be extended to support the new functionality:

```typescript
interface EnhancedResumeBuilderState {
  // Existing state
  currentStep: number;
  data: ResumeData;
  isLoading: boolean;
  isDirty: boolean;

  // New profile-based state
  userProfile: UserProfile;
  recommendedTemplates: TemplateRecommendation[];
  contentOptimization: ContentOptimizationState;
  designCustomization: DesignCustomizationState;
}
```

## Components and Interfaces

### Core Data Models

#### UserProfile Interface

```typescript
interface UserProfile {
  careerLevel: "entry-level" | "mid-career" | "senior" | "executive";
  employmentStatus: "student" | "employed" | "unemployed" | "career-change";
  industry: string;
  targetRole?: string;
  yearsOfExperience: number;
  hasWorkExperience: boolean;
  profileScore: number; // 0-100 for template matching
}
```

#### TemplateRecommendation Interface

```typescript
interface TemplateRecommendation {
  templateId: string;
  suitabilityScore: number; // 0-100
  reasoning: string[];
  isCurrentDesign: boolean;
  preview: {
    thumbnailUrl: string;
    sampleContent: Partial<ResumeData>;
  };
}
```

#### ContentOptimization Interface

```typescript
interface ContentOptimizationState {
  currentPageCount: number;
  contentDensity: "sparse" | "optimal" | "dense" | "overflow";
  suggestions: OptimizationSuggestion[];
  autoAppliedOptimizations: string[];
}

interface OptimizationSuggestion {
  type: "condense" | "expand" | "prioritize" | "remove";
  section: string;
  description: string;
  impact: "low" | "medium" | "high";
  autoApplicable: boolean;
}
```

### New Components

#### ProfileAssessmentStep

- Career level selection with visual indicators
- Employment status with contextual questions
- Industry selection with autocomplete
- Target role input (optional)
- Progress indicator showing completion

#### TemplateRecommendationStep

- Grid layout showing 3-5 recommended templates
- Template cards with preview, suitability score, and reasoning
- "Current Design" badge for existing template
- Real-time preview with user's sample data
- Template comparison feature

#### ContentOptimizationStep

- Real-time page count indicator
- Content density visualization
- Optimization suggestions panel
- One-click optimization application
- Manual content editing interface
- Preview pane showing before/after

#### DesignCustomizationStep

- Template switcher with live preview
- Color scheme customization
- Font selection (limited options for ATS compatibility)
- Layout adjustments (margins, spacing)
- Real-time PDF preview
- Mobile-responsive design preview

### Enhanced Existing Components

#### Enhanced StepIndicator

- Support for 8 steps instead of 5
- Progress percentage calculation
- Step completion status
- Conditional step display based on user profile

#### Enhanced NavigationButtons

- Smart navigation (skip irrelevant steps)
- Validation-aware progression
- Save progress functionality
- Step-specific action buttons

#### Profile-Aware Form Steps

- Dynamic field prioritization based on career level
- Contextual help text and examples
- Industry-specific suggestions
- Experience-level appropriate validation

## Data Models

### Extended ResumeData Interface

```typescript
interface EnhancedResumeData extends ResumeData {
  userProfile: UserProfile;
  selectedTemplate: string;
  customizations: {
    colorScheme?: string;
    fontFamily?: string;
    layoutSettings?: LayoutSettings;
  };
  optimizationSettings: {
    prioritizedSections: string[];
    condensationLevel: "minimal" | "moderate" | "aggressive";
    autoOptimizationsEnabled: boolean;
  };
  metadata: {
    createdAt: Date;
    lastModified: Date;
    version: number;
    isCompleted: boolean;
  };
}
```

### Template System Enhancement

```typescript
interface EnhancedTemplate {
  id: string;
  name: string;
  description: string;
  category: "traditional" | "modern" | "creative" | "minimal";
  suitableFor: {
    careerLevels: UserProfile["careerLevel"][];
    industries: string[];
    employmentStatuses: UserProfile["employmentStatus"][];
  };
  features: {
    atsOptimized: boolean;
    colorCustomizable: boolean;
    layoutFlexible: boolean;
    singlePageOptimized: boolean;
  };
  preview: {
    thumbnailUrl: string;
    fullPreviewUrl: string;
  };
  component: React.ComponentType<TemplateProps>;
}
```

## Error Handling

### Validation Strategy

- **Progressive Validation**: Validate as user progresses through steps
- **Profile-Aware Validation**: Different validation rules based on user profile
- **Content Length Validation**: Real-time checking for single-page compliance
- **Template Compatibility**: Ensure selected template works with user's content

### Error Recovery

- **Auto-Save**: Save progress every 30 seconds and on step transitions
- **Graceful Degradation**: Fallback to basic templates if recommendations fail
- **Validation Bypass**: Allow users to proceed with warnings for non-critical issues
- **Data Recovery**: Restore from last saved state on session interruption

### Error Types and Handling

```typescript
interface ResumeBuilderError {
  type: "validation" | "template" | "optimization" | "save" | "network";
  severity: "error" | "warning" | "info";
  message: string;
  field?: string;
  step?: number;
  recoverable: boolean;
  autoRetry?: boolean;
}
```

## Testing Strategy

### Unit Testing

- **Component Testing**: Each new component with React Testing Library
- **Hook Testing**: Custom hooks for profile assessment and optimization
- **Utility Testing**: Template recommendation algorithm and content optimization logic
- **Validation Testing**: All validation functions with edge cases

### Integration Testing

- **Step Flow Testing**: Complete user journey through all steps
- **State Management Testing**: Zustand store actions and state transitions
- **Template Rendering Testing**: PDF generation with different templates and data
- **API Integration Testing**: Save/load functionality with backend

### End-to-End Testing

- **Complete Resume Creation**: Full flow from profile to final PDF
- **Template Switching**: Changing templates at different stages
- **Content Optimization**: Automatic and manual optimization scenarios
- **Responsive Design**: Mobile and desktop user experiences

### Performance Testing

- **PDF Generation Speed**: Template rendering performance
- **Real-time Preview**: Template switching and customization responsiveness
- **Large Content Handling**: Performance with extensive work experience/education
- **Memory Usage**: State management efficiency with complex data

## Technical Implementation Details

### Template Recommendation Algorithm

```typescript
function calculateTemplateSuitability(
  userProfile: UserProfile,
  template: EnhancedTemplate
): number {
  let score = 0;

  // Career level matching (40% weight)
  if (template.suitableFor.careerLevels.includes(userProfile.careerLevel)) {
    score += 40;
  }

  // Industry matching (30% weight)
  if (template.suitableFor.industries.includes(userProfile.industry)) {
    score += 30;
  }

  // Employment status matching (20% weight)
  if (
    template.suitableFor.employmentStatuses.includes(
      userProfile.employmentStatus
    )
  ) {
    score += 20;
  }

  // Experience level bonus (10% weight)
  if (userProfile.hasWorkExperience && template.features.atsOptimized) {
    score += 10;
  }

  return Math.min(score, 100);
}
```

### Content Optimization Engine

```typescript
class ContentOptimizer {
  private maxPageHeight = 792; // PDF points for letter size
  private targetDensity = 0.85; // 85% page utilization

  analyzeContent(data: ResumeData, template: string): ContentOptimizationState {
    // Calculate current page usage
    // Generate optimization suggestions
    // Return optimization state
  }

  applyOptimizations(
    data: ResumeData,
    optimizations: OptimizationSuggestion[]
  ): ResumeData {
    // Apply selected optimizations
    // Return optimized data
  }
}
```

### Real-time Preview System

- **Debounced Updates**: Prevent excessive re-renders during typing
- **Incremental Rendering**: Only re-render changed sections
- **Template Caching**: Cache rendered templates for quick switching
- **Progressive Loading**: Show skeleton while generating preview

### Accessibility Considerations

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: Ensure all customization options meet WCAG standards
- **Focus Management**: Logical focus flow through multi-step process
- **Error Announcements**: Screen reader announcements for validation errors

### Mobile Optimization

- **Responsive Step Indicator**: Collapsible progress indicator
- **Touch-Friendly Controls**: Larger touch targets for mobile
- **Swipe Navigation**: Optional swipe gestures between steps
- **Mobile Preview**: Optimized preview rendering for small screens
- **Offline Support**: Basic functionality when network is unavailable
