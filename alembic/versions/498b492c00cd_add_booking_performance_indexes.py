"""add booking performance indexes

Revision ID: 498b492c00cd
Revises: 8dc899523b8b
Create Date: 2026-01-05 15:15:12.705610

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '498b492c00cd'
down_revision: Union[str, Sequence[str], None] = '8dc899523b8b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Composite index for slot availability + locking
    op.create_index(
        "idx_bookings_slot_date_status",
        "bookings",
        ["facility_id", "time_slot_id", "booking_date", "status"],
    )

    # Index for slot availability aggregation
    op.create_index(
        "idx_bookings_timeslot_date_status",
        "bookings",
        ["time_slot_id", "booking_date", "status"],
    )

    # Index for user bookings page
    op.create_index(
        "idx_bookings_user_date",
        "bookings",
        ["user_id", "booking_date"],
    )



def downgrade() -> None:
    op.drop_index("idx_bookings_user_date", table_name="bookings")
    op.drop_index("idx_bookings_timeslot_date_status", table_name="bookings")
    op.drop_index("idx_bookings_slot_date_status", table_name="bookings")