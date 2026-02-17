from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .. import crud, schemas
from ..database import get_async_db
from ..auth import current_active_user
from ..models import User

router = APIRouter(
    prefix="/nutrition",
    tags=["nutrition"],
    dependencies=[Depends(current_active_user)],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Nutrition)
async def create_nutrition_entry(
    nutrition: schemas.NutritionCreate,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user)
):
    return await crud.create_nutrition_entry(db=db, nutrition=nutrition, user_id=user.id)

@router.get("/", response_model=List[schemas.Nutrition])
async def read_nutrition_entries(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_async_db),
    user: User = Depends(current_active_user)
):
    return await crud.get_nutrition_entries(db, user_id=user.id, skip=skip, limit=limit)
