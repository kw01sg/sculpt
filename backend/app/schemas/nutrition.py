from pydantic import BaseModel
from datetime import date


class NutritionBase(BaseModel):
    date: date
    calories: int
    protein: int


class NutritionCreate(NutritionBase):
    pass


class Nutrition(NutritionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
