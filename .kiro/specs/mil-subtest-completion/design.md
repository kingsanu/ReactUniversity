# Design Document

## Overview

The MIL assessment flow needs to be modified to include individual subtest completion screens between each subtest, rather than automatically advancing to the next one. This will provide better user experience and allow users to take breaks between intensive cognitive tasks.

## Architecture

### Current Flow

1. Complete Subtest → Auto-advance to Next Instructions → Next Subtest

### New Flow

1. Complete Subtest → Subtest Completion Screen → User Choice → Next Instructions → Next Subtest

## Components and Interfaces

### New Component: MILSubtestCompletion

- **Purpose**: Display completion status for individual subtests
- **Props**:
  - `completedExam`: The exam that was just completed
  - `currentIndex`: Current subtest index
  - `totalExams`: Total number of subtests
  - `onContinue`: Callback to proceed to next subtest
  - `onReturnToDashboard`: Callback to return to dashboard

### Modified Component: MIL Page

- **New State**: Add "subtest-completed" step to the flow
- **Modified Logic**: Update `handleExamComplete` to go to completion screen first

## Data Models

### Updated Step Type

```typescript
type Step =
  | "overview"
  | "instructions"
  | "exam"
  | "subtest-completed"
  | "completed";
```

### Completion Screen Data

```typescript
interface SubtestCompletionData {
  completedExam: MILExamMetadata;
  completedIndex: number;
  totalExams: number;
  isLastSubtest: boolean;
}
```

## Error Handling

- If user navigates away during completion screen, progress is already saved
- If next subtest fails to load, show error with option to retry or return to dashboard

## Testing Strategy

### Unit Tests

- Test completion screen renders correctly
- Test progress calculations
- Test navigation callbacks

### Integration Tests

- Test full flow from subtest completion to next subtest
- Test dashboard return functionality
- Test progress persistence
