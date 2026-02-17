from pydantic import BaseModel
from typing import List

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
