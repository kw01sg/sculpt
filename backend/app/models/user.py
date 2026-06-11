from typing import TYPE_CHECKING

from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import Integer, DateTime, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from ..database import Base
from datetime import datetime, timezone

if TYPE_CHECKING:
    from .workout import Workout
    from .nutrition import Nutrition


class User(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    workouts: Mapped[list["Workout"]] = relationship(back_populates="user")
    nutrition_entries: Mapped[list["Nutrition"]] = relationship(back_populates="user")
