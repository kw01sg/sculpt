"""add cascade delete to exercises

Revision ID: 27c33a6843cf
Revises: 37aa95c9190b
Create Date: 2026-02-19 06:17:14.960191

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "27c33a6843cf"
down_revision: Union[str, Sequence[str], None] = "37aa95c9190b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint("exercises_workout_id_fkey", "exercises", type_="foreignkey")
    op.create_foreign_key(
        "exercises_workout_id_fkey",
        "exercises",
        "workouts",
        ["workout_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("exercises_workout_id_fkey", "exercises", type_="foreignkey")
    op.create_foreign_key(
        "exercises_workout_id_fkey", "exercises", "workouts", ["workout_id"], ["id"]
    )
