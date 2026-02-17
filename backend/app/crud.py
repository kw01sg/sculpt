from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models, schemas

async def create_workout(db: AsyncSession, workout: schemas.WorkoutCreate, user_id: int):
    db_workout = models.Workout(name=workout.name, user_id=user_id)
    db.add(db_workout)
    await db.commit()
    await db.refresh(db_workout)
    for exercise_data in workout.exercises:
        db_exercise = models.Exercise(**exercise_data.model_dump(), workout_id=db_workout.id)
        db.add(db_exercise)
    await db.commit()
    await db.refresh(db_workout)
    return db_workout

async def get_workouts(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.Workout).filter(models.Workout.user_id == user_id).offset(skip).limit(limit)
    )
    return result.scalars().all()

async def create_nutrition_entry(db: AsyncSession, nutrition: schemas.NutritionCreate, user_id: int):
    db_nutrition = models.Nutrition(**nutrition.model_dump(), user_id=user_id)
    db.add(db_nutrition)
    await db.commit()
    await db.refresh(db_nutrition)
    return db_nutrition

async def get_nutrition_entries(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.Nutrition).filter(models.Nutrition.user_id == user_id).offset(skip).limit(limit)
    )
    return result.scalars().all()
