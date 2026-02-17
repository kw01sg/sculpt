from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import Integer
from ..database import Base

class User(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    
    workouts: Mapped[list["Workout"]] = relationship(back_populates="user")
    nutrition_entries: Mapped[list["Nutrition"]] = relationship(back_populates="user")

