# Data Model: Add Exercise Comments

**Branch**: `001-exercise-comments` | **Date**: 2026-03-13

## Changed Entity: Exercise

### Current Schema (exercises table)

| Column      | Type         | Nullable | Notes                         |
|-------------|--------------|----------|-------------------------------|
| id          | INTEGER      | NO       | Primary key, auto-increment   |
| name        | VARCHAR      | NO       | Indexed                       |
| sets        | INTEGER      | NO       |                               |
| reps        | INTEGER      | NO       |                               |
| weight      | INTEGER      | NO       |                               |
| workout_id  | INTEGER      | NO       | FK → workouts.id (indexed)    |
| created_at  | TIMESTAMPTZ  | NO       | Server default: now()         |
| updated_at  | TIMESTAMPTZ  | NO       | Server default: now()         |

### Updated Schema (after migration)

| Column      | Type         | Nullable | Notes                                    |
|-------------|--------------|----------|------------------------------------------|
| id          | INTEGER      | NO       | Primary key, auto-increment              |
| name        | VARCHAR      | NO       | Indexed                                  |
| sets        | INTEGER      | NO       |                                          |
| reps        | INTEGER      | NO       |                                          |
| weight      | INTEGER      | NO       |                                          |
| **comment** | **VARCHAR(500)** | **YES** | **Optional free-text note. NULL = no comment.** |
| workout_id  | INTEGER      | NO       | FK → workouts.id (indexed)               |
| created_at  | TIMESTAMPTZ  | NO       | Server default: now()                    |
| updated_at  | TIMESTAMPTZ  | NO       | Server default: now()                    |

### Validation Rules

- `comment` is optional (NULL allowed)
- Max length: 500 characters
- Whitespace-only values are coerced to NULL at the application layer (Pydantic validator) before persistence
- No format or content restrictions beyond length

### Migration

- **Alembic revision**: `add_comment_to_exercises`
- **upgrade()**: `ALTER TABLE exercises ADD COLUMN comment VARCHAR(500) NULL`
- **downgrade()**: `ALTER TABLE exercises DROP COLUMN comment`
- No backfill required — NULL is the correct default for existing rows

### No New Indexes

The `comment` column does not require an index. It is not used in WHERE clauses, JOINs, or ORDER BY expressions.

## Unchanged Entities

- `Workout` — no changes
- `Nutrition` — no changes
- `ExerciseDefinition` — no changes
- `User` — no changes
