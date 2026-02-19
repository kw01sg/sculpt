from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from . import models, schemas


async def create_workout(
    db: AsyncSession, workout: schemas.WorkoutCreate, user_id: int
):
    db_workout = models.Workout(name=workout.name, user_id=user_id)
    db.add(db_workout)
    await db.commit()
    await db.refresh(db_workout)
    for exercise_data in workout.exercises:
        db_exercise = models.Exercise(
            **exercise_data.model_dump(), workout_id=db_workout.id
        )
        db.add(db_exercise)
    await db.commit()

    # After committing, the db_workout object is expired.
    # We need to query for it again with the exercises relationship eagerly loaded.
    result = await db.execute(
        select(models.Workout)
        .options(selectinload(models.Workout.exercises))
        .filter(models.Workout.id == db_workout.id)
    )
    return result.scalar_one()


async def get_workouts(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.Workout)
        .options(
            selectinload(models.Workout.exercises)
        )  # Eager load exercises here too
        .filter(models.Workout.user_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


async def create_nutrition_entry(
    db: AsyncSession, nutrition: schemas.NutritionCreate, user_id: int
):
    db_nutrition = models.Nutrition(**nutrition.model_dump(), user_id=user_id)
    db.add(db_nutrition)
    await db.commit()
    await db.refresh(db_nutrition)
    return db_nutrition


async def delete_workout(db: AsyncSession, workout_id: int, user_id: int) -> bool:
    result = await db.execute(
        select(models.Workout).filter(
            models.Workout.id == workout_id,
            models.Workout.user_id == user_id,
        )
    )
    workout = result.scalar_one_or_none()
    if not workout:
        return False
    await db.delete(workout)
    await db.commit()
    return True


async def update_workout(db: AsyncSession, workout_id: int, name: str, user_id: int):
    result = await db.execute(
        select(models.Workout).filter(
            models.Workout.id == workout_id,
            models.Workout.user_id == user_id,
        )
    )
    workout = result.scalar_one_or_none()
    if not workout:
        return None
    workout.name = name
    await db.commit()
    result = await db.execute(
        select(models.Workout)
        .options(selectinload(models.Workout.exercises))
        .filter(models.Workout.id == workout_id)
    )
    return result.scalar_one()


async def add_exercise_to_workout(
    db: AsyncSession, workout_id: int, exercise: schemas.ExerciseCreate, user_id: int
):
    result = await db.execute(
        select(models.Workout).filter(
            models.Workout.id == workout_id,
            models.Workout.user_id == user_id,
        )
    )
    workout = result.scalar_one_or_none()
    if not workout:
        return None
    db_exercise = models.Exercise(**exercise.model_dump(), workout_id=workout_id)
    db.add(db_exercise)
    await db.commit()
    result = await db.execute(
        select(models.Workout)
        .options(selectinload(models.Workout.exercises))
        .filter(models.Workout.id == workout_id)
    )
    return result.scalar_one()


async def update_exercise(
    db: AsyncSession,
    workout_id: int,
    exercise_id: int,
    data: schemas.ExerciseUpdate,
    user_id: int,
):
    result = await db.execute(
        select(models.Exercise)
        .join(models.Workout)
        .filter(
            models.Exercise.id == exercise_id,
            models.Exercise.workout_id == workout_id,
            models.Workout.user_id == user_id,
        )
    )
    exercise = result.scalar_one_or_none()
    if not exercise:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(exercise, field, value)
    await db.commit()
    await db.refresh(exercise)
    return exercise


async def delete_exercise(
    db: AsyncSession, workout_id: int, exercise_id: int, user_id: int
) -> bool:
    result = await db.execute(
        select(models.Exercise)
        .join(models.Workout)
        .filter(
            models.Exercise.id == exercise_id,
            models.Exercise.workout_id == workout_id,
            models.Workout.user_id == user_id,
        )
    )
    exercise = result.scalar_one_or_none()
    if not exercise:
        return False
    await db.delete(exercise)
    await db.commit()
    return True


async def get_nutrition_entries(
    db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100
):
    result = await db.execute(
        select(models.Nutrition)
        .filter(models.Nutrition.user_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


async def get_exercise_definitions(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(models.ExerciseDefinition)
        .filter(models.ExerciseDefinition.user_id == user_id)
        .order_by(models.ExerciseDefinition.name)
    )
    return result.scalars().all()


async def create_exercise_definition(db: AsyncSession, name: str, user_id: int):
    result = await db.execute(
        select(models.ExerciseDefinition).filter(
            models.ExerciseDefinition.user_id == user_id,
            func.lower(models.ExerciseDefinition.name) == name.lower().strip(),
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        return existing
    db_def = models.ExerciseDefinition(name=name.strip(), user_id=user_id)
    db.add(db_def)
    await db.commit()
    await db.refresh(db_def)
    return db_def


async def update_exercise_definition(
    db: AsyncSession, id: int, name: str, user_id: int
):
    result = await db.execute(
        select(models.ExerciseDefinition).filter(
            models.ExerciseDefinition.id == id,
            models.ExerciseDefinition.user_id == user_id,
        )
    )
    db_def = result.scalar_one_or_none()
    if not db_def:
        return None
    # Check for case-insensitive duplicate (excluding this record)
    dup_result = await db.execute(
        select(models.ExerciseDefinition).filter(
            models.ExerciseDefinition.user_id == user_id,
            func.lower(models.ExerciseDefinition.name) == name.lower().strip(),
            models.ExerciseDefinition.id != id,
        )
    )
    if dup_result.scalar_one_or_none():
        return None  # caller treats this as a conflict
    db_def.name = name.strip()
    await db.commit()
    await db.refresh(db_def)
    return db_def


async def delete_exercise_definition(db: AsyncSession, id: int, user_id: int) -> bool:
    result = await db.execute(
        select(models.ExerciseDefinition).filter(
            models.ExerciseDefinition.id == id,
            models.ExerciseDefinition.user_id == user_id,
        )
    )
    db_def = result.scalar_one_or_none()
    if not db_def:
        return False
    await db.delete(db_def)
    await db.commit()
    return True
