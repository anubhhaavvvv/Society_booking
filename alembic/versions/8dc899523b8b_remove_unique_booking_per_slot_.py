"""remove unique booking per slot constraint

Revision ID: 8dc899523b8b
Revises: 801796572fa5
Create Date: 2026-01-05 13:11:58.322735

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8dc899523b8b'
down_revision: Union[str, Sequence[str], None] = '801796572fa5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Create a NON-UNIQUE index FIRST (so FK always has support)
    op.create_index(
        "ix_booking_slot_lookup",
        "bookings",
        ["facility_id", "time_slot_id", "booking_date"],
        unique=False,
    )

    # 2. Now drop the UNIQUE constraint (safe now)
    op.execute(
        "ALTER TABLE bookings DROP INDEX unique_booking_per_slot_per_day"
    )
def downgrade() -> None:
    # Remove non-unique index
    op.drop_index("ix_booking_slot_lookup", table_name="bookings")

    # Restore UNIQUE index
    op.create_unique_constraint(
        "unique_booking_per_slot_per_day",
        "bookings",
        ["facility_id", "time_slot_id", "booking_date"],
    )
