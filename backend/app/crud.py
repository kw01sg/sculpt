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
