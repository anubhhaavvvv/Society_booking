from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.booking import Booking


def get_consumed_units_for_slot(
    db: Session,
    facility_id: int,
    time_slot_id: int,
    booking_date,
) -> int:
    """
    Returns total consumed capacity units for a facility slot on a given date.
    """

    consumed_units = (
        db.query(func.coalesce(func.sum(Booking.consumed_units), 0))
        .filter(
            Booking.facility_id == facility_id,
            Booking.time_slot_id == time_slot_id,
            Booking.booking_date == booking_date,
            Booking.status == "BOOKED",
        )
        .scalar()
    )

    return consumed_units
