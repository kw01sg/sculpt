from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, schemas
from ..auth import current_active_user
from ..database import get_async_db
from ..models import User

router = APIRouter(
    prefix="/exercise-definitions",
    tags=["exercise-definitions"],
    dependencies=[Depends(current_active_user)],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[schemas.ExerciseDefinition])
async def read_exercise_definitions(
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    return await crud.get_exercise_definitions(db, user_id=user.id)


@router.post("/", response_model=schemas.ExerciseDefinition)
async def create_exercise_definition(
    payload: schemas.ExerciseDefinitionCreate,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    return await crud.create_exercise_definition(db, name=payload.name, user_id=user.id)
