from typing import List
from fastapi import APIRouter, Depends
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
    user: User = Depends(current_active_user)
):
    return await crud.create_workout(db=db, workout=workout, user_id=user.id)

@router.get("/", response_model=List[schemas.Workout])
async def read_workouts(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_async_db), 
    user: User = Depends(current_active_user)
):
    workouts = await crud.get_workouts(db, user_id=user.id, skip=skip, limit=limit)
    return workouts
