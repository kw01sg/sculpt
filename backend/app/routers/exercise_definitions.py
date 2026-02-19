from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response
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


@router.patch("/{id}", response_model=schemas.ExerciseDefinition)
async def update_exercise_definition(
    id: int,
    payload: schemas.ExerciseDefinitionUpdate,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    updated = await crud.update_exercise_definition(
        db, id=id, name=payload.name, user_id=user.id
    )
    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Exercise definition not found or name already exists",
        )
    return updated


@router.delete("/{id}", status_code=204)
async def delete_exercise_definition(
    id: int,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user),
):
    deleted = await crud.delete_exercise_definition(db, id=id, user_id=user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Exercise definition not found")
    return Response(status_code=204)
