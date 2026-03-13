# Research: Add Exercise Comments

**Branch**: `001-exercise-comments` | **Date**: 2026-03-13

## Decision Log

### 1. Comment storage: column on `exercises` table vs. separate table

**Decision**: Add a nullable `comment` column directly to the `exercises` table.

**Rationale**: Comments are a 1-to-1 attribute of an exercise entry — there is exactly one optional comment per exercise. A separate table would add a join with no benefit. The existing `exercises` table is the authoritative home for all exercise-level attributes (name, sets, reps, weight).

**Alternatives considered**:
- *Separate `exercise_comments` table*: Rejected. Adds unnecessary complexity and a JOIN for no gain, since comments are not multi-valued.
- *JSON column on workouts*: Rejected. Would break the existing per-exercise entity model and make updates more complex.

---

### 2. Migration strategy: Alembic `upgrade` / `downgrade`

**Decision**: Write a hand-authored Alembic migration that adds the `comment` column as `VARCHAR(500) NULL` with a `downgrade()` path that drops the column.

**Rationale**: The Sculpt constitution mandates every migration include a `downgrade()`. The column is nullable so existing rows are unaffected on upgrade (no `server_default` needed for data already in the table). 500 characters maps to `VARCHAR(500)` in PostgreSQL.

**Alternatives considered**:
- *`alembic revision --autogenerate`*: Viable but produces noisier output; hand-authoring keeps the diff clean and reviewable.

---

### 3. Whitespace trimming: application layer vs. database constraint

**Decision**: Trim and null-coerce whitespace-only comments in the Pydantic schema using a `field_validator`.

**Rationale**: The spec requires whitespace-only comments not be stored. Pydantic validators run before the ORM layer, keeping the database clean without DB-level constraints that are harder to test.

**Alternatives considered**:
- *DB CHECK constraint*: Would catch raw SQL inserts but is invisible to application tests and harder to iterate on.

---

### 4. Frontend display: inline text vs. tooltip

**Decision**: Display the comment as plain secondary text beneath the exercise summary line (using MUI `ListItemText` `secondary` prop for the past-workouts view, and a `TextField` in the input row).

**Rationale**: Inline display is always visible and requires no hover/click interaction — appropriate for a personal fitness log where comments aid recall at a glance. Tooltips would hide important context.

**Alternatives considered**:
- *Tooltip on hover*: Rejected. Mobile-unfriendly; hides information users want to see without additional interaction.
- *Expandable sub-row*: Rejected. Over-engineered for a short text field; the `secondary` prop provides sufficient visual hierarchy.

---

### 5. Edit support for comment field

**Decision**: Include `comment` in the inline edit form for existing exercises (alongside name, sets, reps, weight).

**Rationale**: The `PATCH /api/workouts/{workout_id}/exercises/{exercise_id}` endpoint already exists and `ExerciseUpdate` accepts partial fields. Adding `comment` to `ExerciseUpdate` gives edit support for free with no new endpoint needed.

**Alternatives considered**:
- *Read-only comment after save*: Rejected. The spec doesn't restrict editing; omitting it from `ExerciseUpdate` would create an inconsistent UX.
