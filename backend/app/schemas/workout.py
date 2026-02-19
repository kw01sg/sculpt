from pydantic import BaseModel
from typing import List, Optional


class ExerciseBase(BaseModel):
    name: str
    sets: int
    reps: int
    weight: int


class ExerciseCreate(ExerciseBase):
    pass


class Exercise(ExerciseBase):
    id: int
    workout_id: int

    class Config:
        from_attributes = True


class WorkoutUpdate(BaseModel):
    name: str


class ExerciseUpdate(BaseModel):
    name: Optional[str] = None
    sets: Optional[int] = None
    reps: Optional[int] = None
    weight: Optional[int] = None


class WorkoutBase(BaseModel):
    name: str


class WorkoutCreate(WorkoutBase):
    exercises: List[ExerciseCreate]


class Workout(WorkoutBase):
    id: int
    user_id: int
    exercises: List[Exercise] = []

    class Config:
        from_attributes = True


class ExerciseDefinitionCreate(BaseModel):
    name: str


class ExerciseDefinitionUpdate(BaseModel):
    name: str


class ExerciseDefinition(BaseModel):
    id: int
    name: str
    user_id: int

    class Config:
        from_attributes = True
