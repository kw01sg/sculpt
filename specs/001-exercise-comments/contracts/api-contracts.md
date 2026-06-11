# API Contracts: Add Exercise Comments

**Branch**: `001-exercise-comments` | **Date**: 2026-03-13

---

## Affected Endpoints

### 1. `POST /api/workouts/` — Create Workout

**Change**: `exercises[].comment` is now an accepted optional field.

**Request body** (changed fields shown with `+`):
```json
{
  "name": "Morning Session",
  "exercises": [
    {
      "name": "Chest Press",
      "sets": 3,
      "reps": 10,
      "weight": 60,
      "+ comment": "Focus on keeping elbows at 45°"
    },
    {
      "name": "Squat",
      "sets": 4,
      "reps": 8,
      "weight": 80
    }
  ]
}
```

**Response** (changed fields shown with `+`):
```json
{
  "id": 42,
  "name": "Morning Session",
  "user_id": 1,
  "exercises": [
    {
      "id": 101,
      "workout_id": 42,
      "name": "Chest Press",
      "sets": 3,
      "reps": 10,
      "weight": 60,
      "+ comment": "Focus on keeping elbows at 45°"
    },
    {
      "id": 102,
      "workout_id": 42,
      "name": "Squat",
      "sets": 4,
      "reps": 8,
      "weight": 80,
      "+ comment": null
    }
  ]
}
```

**Validation**:
- `comment` is optional; omitting it or sending `null` are both valid
- `comment` exceeding 500 characters → `422 Unprocessable Entity`
- `comment` containing only whitespace is stored as `null`

---

### 2. `GET /api/workouts/` — List Workouts

**Change**: Each exercise in the response now includes `comment` (may be `null`).

**Response shape** (exercises array item):
```json
{
  "id": 101,
  "workout_id": 42,
  "name": "Chest Press",
  "sets": 3,
  "reps": 10,
  "weight": 60,
  "+ comment": "Focus on keeping elbows at 45°"
}
```

No request changes.

---

### 3. `POST /api/workouts/{workout_id}/exercises/` — Add Exercise to Existing Workout

**Change**: `comment` is now an accepted optional field in the request body.

**Request body**:
```json
{
  "name": "Pull-up",
  "sets": 3,
  "reps": 8,
  "weight": 0,
  "+ comment": "Needs better form — flaring elbows"
}
```

**Response**: Full `Workout` object (same shape as `POST /api/workouts/`), with all exercises including `comment`.

---

### 4. `PATCH /api/workouts/{workout_id}/exercises/{exercise_id}` — Update Exercise

**Change**: `comment` is now an accepted optional patch field.

**Request body** (all fields optional as before):
```json
{
  "+ comment": "Improved form today — keep this up"
}
```

To clear a comment, send `"comment": null`.

**Response**: Updated `Exercise` object including `comment`.

---

## Backward Compatibility

- All existing clients that omit `comment` continue to work without changes
- Existing stored exercises return `comment: null` — clients must handle `null` gracefully
- No existing fields are removed or renamed
