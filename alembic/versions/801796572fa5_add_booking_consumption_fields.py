"""add booking consumption fields

Revision ID: 801796572fa5
Revises: 50211a6ff8f0
Create Date: 2026-01-05 12:56:17.140158
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "801796572fa5"
down_revision: Union[str, Sequence[str], None] = "50211a6ff8f0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # BOOKINGS — add new fields (TEMPORARILY nullable)
    op.add_column(
        "bookings",
        sa.Column("booking_type", sa.String(length=20), nullable=True),
    )
    op.add_column(
        "bookings",
        sa.Column("player_count", sa.Integer(), nullable=True),
    )
    op.add_column(
        "bookings",
        sa.Column("consumed_units", sa.Integer(), nullable=True),
    )

    # FACILITIES — add capacity fields (TEMPORARILY nullable)
    op.add_column(
        "facilities",
        sa.Column("total_courts", sa.Integer(), nullable=True),
    )
    op.add_column(
        "facilities",
        sa.Column("max_players_per_court", sa.Integer(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("facilities", "max_players_per_court")
    op.drop_column("facilities", "total_courts")

    op.drop_column("bookings", "consumed_units")
    op.drop_column("bookings", "player_count")
    op.drop_column("bookings", "booking_type")
