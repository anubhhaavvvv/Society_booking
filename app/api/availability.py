from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime, time

from app.db.deps import get_db
from app.models.facility import Facility
from app.models.timeslot import TimeSlot
from app.models.booking import Booking
from app.core.capacity import get_allowed_capacity

router = APIRouter()

@router.get("/facilities/{facility_id}/availability")
def get_facility_availability(
    facility_id: int,
    booking_date: date,
    db: Session = Depends(get_db),
):
    facility = (
        db.query(Facility)
        .filter(Facility.id == facility_id, Facility.is_active == True)
        .first()
    )

    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    # --------------------------------------------------
    # 1. Fetch all slots + consumed units in ONE query
    # --------------------------------------------------
    rows = (
        db.query(
            TimeSlot.id.label("slot_id"),
            TimeSlot.start_time,
            TimeSlot.end_time,
            func.coalesce(func.sum(Booking.consumed_units), 0).label("consumed"),
        )
        .outerjoin(
            Booking,
            (Booking.time_slot_id == TimeSlot.id)
            & (Booking.booking_date == booking_date)
            & (Booking.status == "BOOKED")
            & (Booking.facility_id == facility_id),
        )
        .filter(
            TimeSlot.facility_id == facility_id,
            TimeSlot.is_active == True,
        )
        .group_by(TimeSlot.id)
        .order_by(TimeSlot.start_time)
        .all()
    )

    # --------------------------------------------------
    # 2. Compute availability per slot
    # --------------------------------------------------
    results = []
    now = datetime.now()

    for row in rows:
        slot_start = datetime.combine(
            booking_date, row.start_time
        )

        total_capacity = get_allowed_capacity(
            facility=facility,
            current_consumed_units=row.consumed,
        )

        remaining = max(total_capacity - row.consumed, 0)

        # Status
        if booking_date < date.today() or slot_start < now:
            status = "past"
        elif remaining == 0:
            status = "full"
        elif remaining <= facility.max_players_per_court:
            status = "limited"
        else:
            status = "available"

        results.append(
            {
                "id": row.slot_id,
                "start_time": row.start_time.strftime("%H:%M"),
                "end_time": row.end_time.strftime("%H:%M"),
                "total_capacity": total_capacity,
                "consumed": row.consumed,
                "remaining": remaining,
                "status": status,
            }
        )

    return results
