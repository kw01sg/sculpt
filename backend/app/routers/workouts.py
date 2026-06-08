from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from .. import crud, schemas
from ..database import get_async_db
from ..auth import current_active_user
from ..models import User

router = APIRouter(
    prefix="/workouts",
    tags=["workouts"],
    dependencies=[Depends(current_active_user)],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_model=schemas.Workout)
async def create_workout(
    workout: schemas.WorkoutCreate,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    return await crud.create_workout(db=db, workout=workout, user_id=user.id)


@router.get("/", response_model=List[schemas.Workout])
async def read_workouts(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    workouts = await crud.get_workouts(db, user_id=user.id, skip=skip, limit=limit)
    return workouts


@router.patch("/{workout_id}", response_model=schemas.Workout)
async def update_workout(
    workout_id: int,
    data: schemas.WorkoutUpdate,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    workout = await crud.update_workout(
        db, workout_id=workout_id, name=data.name, user_id=user.id
    )
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout


@router.delete("/{workout_id}", status_code=204)
async def delete_workout(
    workout_id: int,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    deleted = await crud.delete_workout(db, workout_id=workout_id, user_id=user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Workout not found")
    return Response(status_code=204)


@router.post(
    "/{workout_id}/exercises/", response_model=schemas.Workout, status_code=201
)
async def add_exercise(
    workout_id: int,
    exercise: schemas.ExerciseCreate,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    workout = await crud.add_exercise_to_workout(
        db, workout_id=workout_id, exercise=exercise, user_id=user.id
    )
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout


@router.patch("/{workout_id}/exercises/{exercise_id}", response_model=schemas.Exercise)
async def update_exercise(
    workout_id: int,
    exercise_id: int,
    data: schemas.ExerciseUpdate,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    exercise = await crud.update_exercise(
        db, workout_id=workout_id, exercise_id=exercise_id, data=data, user_id=user.id
    )
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise


@router.delete("/{workout_id}/exercises/{exercise_id}", status_code=204)
async def delete_exercise(
    workout_id: int,
    exercise_id: int,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    deleted = await crud.delete_exercise(
        db, workout_id=workout_id, exercise_id=exercise_id, user_id=user.id
    )
    if not deleted:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return Response(status_code=204)
