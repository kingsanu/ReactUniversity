# Requirements Document

## Introduction

The MIL assessment currently auto-advances to the next subtest immediately after completing one, which doesn't give users a chance to see their completion status or take a break. Users should see a completion screen after each subtest and manually choose to continue to the next one.

## Requirements

### Requirement 1

**User Story:** As a test taker, I want to see a completion screen after finishing each subtest, so that I can see my progress and take a break before continuing.

#### Acceptance Criteria

1. WHEN a user completes a subtest THEN the system SHALL display a subtest completion screen
2. WHEN the subtest completion screen is shown THEN the system SHALL show the completed subtest name and progress
3. WHEN the subtest completion screen is shown THEN the system SHALL provide a "Continue to Next Subtest" button
4. WHEN the user clicks "Continue to Next Subtest" THEN the system SHALL proceed to the next subtest's instructions

### Requirement 2

**User Story:** As a test taker, I want to see my overall progress on the completion screen, so that I know how many subtests I have left.

#### Acceptance Criteria

1. WHEN the subtest completion screen is displayed THEN the system SHALL show "X of Y subtests completed"
2. WHEN the subtest completion screen is displayed THEN the system SHALL show a progress bar indicating overall completion
3. WHEN this is the last subtest THEN the system SHALL show the final completion screen instead

### Requirement 3

**User Story:** As a test taker, I want the option to return to the dashboard from the completion screen, so that I can take a longer break if needed.

#### Acceptance Criteria

1. WHEN the subtest completion screen is displayed THEN the system SHALL provide a "Return to Dashboard" option
2. WHEN the user clicks "Return to Dashboard" THEN the system SHALL save progress and navigate to the main dashboard
3. WHEN the user returns later THEN the system SHALL resume from the next subtest
