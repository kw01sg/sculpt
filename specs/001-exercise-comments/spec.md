# Feature Specification: Add Exercise Comments

**Feature Branch**: `001-exercise-comments`
**Created**: 2026-03-13
**Status**: Draft
**Input**: User description: "in the page to log your workout, add a new column for users to add comments for an exercise. for example, for a new chest press record, the user might want to mention that he needs to have better form"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Comment When Logging Exercise (Priority: P1)

A user logging a workout can optionally type a comment for any exercise they add. After saving the workout, the comment is stored alongside the exercise's sets, reps, and weight data.

**Why this priority**: This is the core of the feature. Without it, no other story is possible. It delivers immediate value as users can capture notes the first time they try the feature.

**Independent Test**: Can be fully tested by logging a new workout with an exercise comment and verifying the comment appears correctly after saving.

**Acceptance Scenarios**:

1. **Given** a user is on the workout log page and has added an exercise row, **When** they type a comment in the comment field for that exercise, **Then** the comment is saved with the exercise when the workout is submitted.
2. **Given** a user is on the workout log page, **When** they leave the comment field empty for an exercise, **Then** the exercise is saved normally without any comment (comment is optional).
3. **Given** a user submits a workout with multiple exercises, **When** some exercises have comments and some do not, **Then** each exercise retains only its own comment.

---

### User Story 2 - View Saved Comments in Workout History (Priority: P2)

A user reviewing their previously logged workouts can see the comments they left for each exercise alongside the sets, reps, and weight data.

**Why this priority**: Saving comments is only useful if users can later recall and act on them. This closes the feedback loop (e.g., "needs better form" is visible next time).

**Independent Test**: Can be fully tested by viewing a previously saved workout that contains exercise comments and confirming the comments are displayed.

**Acceptance Scenarios**:

1. **Given** a workout was saved with exercise comments, **When** the user views the workout history list, **Then** each exercise with a comment displays that comment.
2. **Given** a workout was saved where some exercises have no comment, **When** the user views that workout, **Then** exercises without comments show no comment text (no placeholder or empty label).

---

### Edge Cases

- What happens when a comment exceeds a very long length (e.g., a paragraph)? The field should gracefully handle or truncate display without breaking the layout.
- How does the system handle a comment that is only whitespace? Whitespace-only comments should be treated as empty (not saved).
- What happens to existing workouts already saved before this feature was introduced? They display no comment field value, which is valid since comments are optional.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to enter an optional free-text comment for each exercise when logging a workout.
- **FR-002**: The comment field MUST be displayed on the workout log page as a new column in the exercise input area, alongside sets, reps, and weight.
- **FR-003**: Comments MUST be optional — submitting an exercise without a comment MUST succeed.
- **FR-004**: The system MUST persist exercise comments so they are retrievable in subsequent sessions.
- **FR-005**: Comments consisting solely of whitespace MUST be treated as empty and not stored.
- **FR-006**: Saved exercise comments MUST be visible when the user views previously logged workouts.
- **FR-007**: Comments MUST be scoped per exercise entry — each exercise row has its own independent comment.
- **FR-008**: The comment field MUST accept up to 500 characters.

### Key Entities

- **Exercise**: Represents a single exercise entry within a workout. Gains a new optional `comment` attribute (free text, max 500 characters) in addition to existing name, sets, reps, and weight.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a comment to an exercise and see it persisted in under 5 seconds of submitting the workout.
- **SC-002**: 100% of existing workouts without comments continue to display correctly with no visual regression after the feature is released.
- **SC-003**: A user can enter and retrieve a comment of up to 500 characters without data loss.
- **SC-004**: The comment field addition does not require users to change their existing workflow — the field is optional and the form remains submittable without it.

## Assumptions

- Comment length cap of 500 characters is a reasonable default for brief notes; this can be adjusted based on user feedback.
- No rich-text formatting is required — plain text comments are sufficient for this use case.
- Comments are not searchable or filterable in this version; that is out of scope.
- Editing or deleting a comment on a saved exercise is out of scope for this feature (aligns with the existing known limitation that workout update/delete is not yet supported).
