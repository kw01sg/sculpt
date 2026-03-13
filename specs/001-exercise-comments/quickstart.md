# Quickstart: Add Exercise Comments

**Branch**: `001-exercise-comments` | **Date**: 2026-03-13

## What This Feature Does

Adds an optional `comment` field to each exercise when logging a workout. Users can capture notes like "needs better form" or "felt strong today" alongside sets, reps, and weight. Comments are saved to the database and displayed in workout history.

## Files to Change

### Backend

| File | Change |
|------|--------|
| `backend/app/models/workout.py` | Add `comment: Mapped[Optional[str]]` to `Exercise` model |
| `backend/app/schemas/workout.py` | Add `comment: Optional[str] = None` to `ExerciseBase`; add `comment: Optional[str] = None` to `ExerciseUpdate`; add Pydantic `field_validator` to coerce whitespace-only to `None` |
| `backend/alembic/versions/<rev>_add_comment_to_exercises.py` | New migration: `ADD COLUMN comment VARCHAR(500) NULL` with `downgrade()` |

> `crud.py` and `routers/workouts.py` require **no changes** — they use `model_dump()` and generic update patterns that pick up the new field automatically.

### Frontend

| File | Change |
|------|--------|
| `frontend/src/types.ts` | Add `comment?: string` to `Exercise` and `ExerciseUpdate` interfaces |
| `frontend/src/services/api.ts` | Add `comment?: string` to the inline type in `addExerciseToWorkout` |
| `frontend/src/pages/WorkoutLogPage.tsx` | Add `comment` state and `TextField` to new-workout form; show comment in staged exercise list; add `comment` to inline edit and add-to-existing forms; display comment in past-workouts list |

## New Migration

```bash
# Generate (or write manually — see data-model.md)
docker-compose exec backend alembic revision -m "add_comment_to_exercises"

# Apply
docker-compose exec backend alembic upgrade head

# Verify rollback works
docker-compose exec backend alembic downgrade -1
docker-compose exec backend alembic upgrade head
```

## Testing Checklist

- [ ] Log a new workout with a comment on one exercise and no comment on another — both save correctly
- [ ] View past workouts — comment appears under the exercise that has one; no label shown for exercises without comments
- [ ] Edit an existing exercise's comment via inline edit — saved correctly
- [ ] Submit an exercise with only whitespace in the comment field — stored as null, not displayed
- [ ] Submit a comment of exactly 500 characters — accepted
- [ ] Submit a comment of 501 characters — rejected with validation error
- [ ] Existing workouts (saved before the migration) display without errors (`comment` shows as null/absent)
- [ ] `alembic downgrade -1` then `upgrade head` completes without errors

## Running Locally

```bash
# Rebuild and start
docker-compose up -d --build

# Watch backend logs
docker-compose logs -f backend

# Frontend available at
open http://localhost:3000
```
