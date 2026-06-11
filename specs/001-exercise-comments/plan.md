# Implementation Plan: Add Exercise Comments

**Branch**: `001-exercise-comments` | **Date**: 2026-03-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-exercise-comments/spec.md`

## Summary

Add an optional free-text `comment` field (max 500 chars) to each exercise entry. The `exercises` table gains a nullable `VARCHAR(500)` column via an Alembic migration. Pydantic schemas and the SQLAlchemy model are updated to expose this field through all existing create/read/update endpoints with no new routes required. The React workout-log page gains a comment `TextField` in the new-workout form, the add-to-existing form, the inline-edit form, and the past-workouts display.

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript / Node 18 (frontend)
**Primary Dependencies**: FastAPI, SQLAlchemy 2.0 async, Alembic, Pydantic v2, React 19, MUI v7, Axios
**Storage**: PostgreSQL 13 (via asyncpg)
**Testing**: pytest (backend), Jest + React Testing Library (frontend)
**Target Platform**: Docker Compose (Linux containers), localhost dev
**Project Type**: Full-stack web application (React SPA + FastAPI REST API)
**Performance Goals**: All endpoints ≤500 ms p95 (constitution requirement)
**Constraints**: No N+1 queries; async SQLAlchemy only; `black`/`ruff` clean; TypeScript strict typing (no `any`)
**Scale/Scope**: Single-user dev/staging; small data volume

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
| --------- | ------ | ----- |
| I. Code Quality | ✅ PASS | New column uses SQLAlchemy 2.0 `Mapped[Optional[str]]`. Pydantic v2 `field_validator` for whitespace coercion. No new abstractions introduced — the `model_dump()` pattern in `crud.py` picks up `comment` automatically. TypeScript type updated with explicit `comment?: string` (no `any`). |
| II. Testing Standards | ✅ PASS | Migration includes `downgrade()`. Backend integration test required for new `comment` field on create/update. Frontend component test required for comment `TextField`. |
| III. UX Consistency | ✅ PASS | Uses MUI `TextField` (same as all other form inputs). Comment displayed via `ListItemText` `secondary` prop. No hard-coded colors or pixel values. Responsive by MUI defaults. |
| IV. Performance | ✅ PASS | `comment` column is nullable with no index (not used in queries). `selectinload` eager-loading pattern unchanged. No N+1 risk introduced. |

**No violations.** Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-exercise-comments/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── api-contracts.md ← Phase 1 output
├── checklists/
│   └── requirements.md
└── tasks.md             ← Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── models/
│   │   └── workout.py        ← add Optional[str] comment field to Exercise
│   ├── schemas/
│   │   └── workout.py        ← add comment to ExerciseBase + ExerciseUpdate
│   └── crud.py               ← NO CHANGE (model_dump() covers new field)
├── alembic/
│   └── versions/
│       └── <rev>_add_comment_to_exercises.py  ← NEW migration

frontend/
├── src/
│   ├── types.ts              ← add comment?: string to Exercise + ExerciseUpdate
│   ├── services/
│   │   └── api.ts            ← add comment?: string to addExerciseToWorkout param type
│   └── pages/
│       └── WorkoutLogPage.tsx ← add comment field to all exercise forms + display
```

**Structure Decision**: Web application (Option 2). Backend and frontend are separate trees under the repo root. This mirrors the existing project layout exactly; no new directories are introduced.
