# Tasks: Add Exercise Comments

**Input**: Design documents from `/specs/001-exercise-comments/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not explicitly requested — test tasks omitted. Per constitution (Principle II), backend integration test and frontend component test MUST be added before merging; tracked in Polish phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to ([US1], [US2])

---

## Phase 1: Setup

**Purpose**: Verify the existing development environment is ready before any changes.

- [x] T001 Confirm Docker Compose environment starts cleanly and `alembic upgrade head` succeeds on the current main schema (`docker-compose up -d --build && docker-compose exec backend alembic upgrade head`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database migration and shared type changes that MUST be complete before any user story work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Write Alembic migration `add_comment_to_exercises` in `backend/alembic/versions/` — `upgrade()` adds `comment VARCHAR(500) NULL` to `exercises` table; `downgrade()` drops the column
- [x] T003 [P] Add `comment: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)` to `Exercise` class in `backend/app/models/workout.py`; add `Optional` import from `typing`
- [x] T004 [P] Add `comment: Optional[str] = None` to `ExerciseBase` and `ExerciseUpdate` in `backend/app/schemas/workout.py`; add a `field_validator("comment")` on `ExerciseBase` that strips whitespace and coerces empty/whitespace-only strings to `None`
- [x] T005 [P] Add `comment?: string` to `Exercise` and `ExerciseUpdate` interfaces in `frontend/src/types.ts`

**Checkpoint**: Migration written, backend model and schema updated, TypeScript types updated. The API now accepts and returns `comment` on all exercise-related endpoints. User story implementation can begin.

---

## Phase 3: User Story 1 — Add Comment When Logging Exercise (Priority: P1) 🎯 MVP

**Goal**: Users can type an optional comment for each exercise in every exercise input form and have it persisted when the workout is saved.

**Independent Test**: Log a new workout with a comment on one exercise and no comment on another — both save correctly. Verify by checking the API response from `POST /api/workouts/`. Also test inline edit and add-to-existing paths.

- [x] T006 [P] [US1] Update `addExerciseToWorkout` function signature in `frontend/src/services/api.ts` — add `comment?: string` to the `data` parameter type (line 95)
- [x] T007 [US1] Add `newComment` state (`useState<string>('')`) to `WorkoutLogPage.tsx` and add a `comment` `TextField` (label "Comment", `size="small"`, `sx={{ flexGrow: 1 }}`, `inputProps={{ maxLength: 500 }}`) to the new-workout exercise input row after the Weight field in `frontend/src/pages/WorkoutLogPage.tsx`
- [x] T008 [US1] Update `handleAddExercise` in `WorkoutLogPage.tsx` to include `comment: newComment.trim() || undefined` in the new exercise object, and reset `setNewComment('')` after adding; update the staged exercises `ListItemText` to show the comment when present (e.g. append `— {ex.comment}` or use `secondary`) in `frontend/src/pages/WorkoutLogPage.tsx`
- [x] T009 [US1] Add `comment: string` to the `editingExercise` state shape (default `''`), populate it in `startEditExercise`, and add a `comment` `TextField` (`size="small"`, `sx={{ flexGrow: 1 }}`, `inputProps={{ maxLength: 500 }}`) to the inline exercise edit row; pass `comment` in the `updateExercise` call inside `saveExercise` in `frontend/src/pages/WorkoutLogPage.tsx`
- [x] T010 [US1] Add `comment: string` to the `newExForExisting` state shape (default `''`), add a `comment` `TextField` (`size="small"`, `sx={{ flexGrow: 1 }}`, `inputProps={{ maxLength: 500 }}`) to the "add exercise to existing workout" inline row, and pass `comment` in the `addExerciseToWorkout` call inside `saveAddExercise` in `frontend/src/pages/WorkoutLogPage.tsx`

**Checkpoint**: User Story 1 fully functional. Users can add comments through all three exercise input paths (new workout, inline edit, add-to-existing). Comments are persisted via the backend.

---

## Phase 4: User Story 2 — View Saved Comments in Workout History (Priority: P2)

**Goal**: Users can see their saved exercise comments in the past-workouts section.

**Independent Test**: View a previously saved workout that has exercise comments — the comment text appears beneath each exercise that has one; exercises without comments show no comment UI.

**Note**: Depends on User Story 1 having persisted comment data; implement after Phase 3 checkpoint.

- [x] T011 [US2] In the past-workouts collapsible exercise list in `frontend/src/pages/WorkoutLogPage.tsx`, update the read-only (non-editing) `ListItemText` to use `secondary={ex.comment || undefined}` so that comments appear as secondary text beneath the exercise summary line (line ~400)

**Checkpoint**: User Stories 1 and 2 complete. Comments flow from input → database → display.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T012 [P] Run `black backend/app/models/workout.py backend/app/schemas/workout.py` and `ruff check backend/app/models/workout.py backend/app/schemas/workout.py` inside the backend container; fix any issues
- [x] T013 Validate migration round-trip: run `docker-compose exec backend alembic downgrade -1` then `docker-compose exec backend alembic upgrade head` and confirm no errors
- [x] T014 [P] Smoke-test the full feature in Docker Compose against the quickstart.md testing checklist — cover: save with comment, save without comment, whitespace-only comment stored as null, 500-char comment accepted, existing workouts display without regression

> **Constitution note (Principle II)**: Before merging, add a backend integration test for `POST /api/workouts/` with a `comment` field, and a React Testing Library test confirming the comment `TextField` renders in `WorkoutLogPage`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 completion
- **Phase 4 (US2)**: Depends on Phase 3 (requires saved comment data to display)
- **Phase 5 (Polish)**: Depends on Phases 3 and 4

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2. No dependency on US2.
- **US2 (P2)**: Starts after Phase 3. Requires comment data written by US1 to be testable.

### Within Each Phase

- T002 (migration) should be committed first in Phase 2 to keep schema and code in sync
- T003, T004, T005 can proceed in parallel (different files) after T002 is written
- T007 → T008 → T009 → T010 are sequential (all in `WorkoutLogPage.tsx`)
- T006 can run in parallel with T007 (different file)

---

## Parallel Opportunities

```
# Phase 2 — all different files, run in parallel after writing T002:
T003: backend/app/models/workout.py
T004: backend/app/schemas/workout.py
T005: frontend/src/types.ts

# Phase 3 — T006 (api.ts) parallel with T007 start (WorkoutLogPage.tsx):
T006: frontend/src/services/api.ts
T007: frontend/src/pages/WorkoutLogPage.tsx  ← then T008 → T009 → T010 sequentially

# Phase 5:
T012: backend linting
T014: Docker smoke test
```

---

## Implementation Strategy

### MVP (User Story 1 Only)

1. Complete Phase 1: Verify environment
2. Complete Phase 2: Migration + model + schema + types
3. Complete Phase 3: All exercise input forms support comment
4. **STOP and VALIDATE**: Confirm comment saves via API; staged list shows comment
5. This is shippable — users can capture notes immediately

### Incremental Delivery

1. Phase 1 + 2 → Schema ready
2. Phase 3 → Write path live (MVP ✅)
3. Phase 4 → Read path live (full feature ✅)
4. Phase 5 → Polish and verify

---

## Notes

- [P] tasks = different files, no dependencies between them
- All four `WorkoutLogPage.tsx` tasks (T007–T010) modify the same file; execute sequentially
- `crud.py` and `routers/workouts.py` require **zero changes** — `model_dump()` picks up `comment` automatically once Pydantic schemas are updated
- `comment` is nullable; `null` in the API response means no comment — handle gracefully in the frontend (don't render an empty secondary label)
- Constitution Principle II requires tests before merge; see Polish phase note
