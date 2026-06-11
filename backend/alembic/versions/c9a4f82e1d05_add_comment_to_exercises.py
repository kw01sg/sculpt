"""add comment to exercises

Revision ID: c9a4f82e1d05
Revises: fb6729d80e43
Create Date: 2026-03-13 17:17:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c9a4f82e1d05"
down_revision: Union[str, Sequence[str], None] = "fb6729d80e43"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add optional comment column to exercises table."""
    op.add_column(
        "exercises",
        sa.Column("comment", sa.String(500), nullable=True),
    )


def downgrade() -> None:
    """Remove comment column from exercises table."""
    op.drop_column("exercises", "comment")
