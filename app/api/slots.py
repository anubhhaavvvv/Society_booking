from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime

from app.db.deps import get_db
from app.models.facility import Facility
from app.models.timeslot import TimeSlot
from app.models.booking import Booking
from app.core.capacity import get_max_capacity_units
from app.core.capacity import resolve_max_capacity_units



router = APIRouter()


@router.get("/facilities/{facility_id}/slots")
def list_time_slots(
    facility_id: int,
    booking_date: date = Query(...),
    db: Session = Depends(get_db),
):
    # 1. Validate facility
    facility = (
        db.query(Facility)
        .filter(Facility.id == facility_id)
        .first()
    )

    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    # 2. Calculate max capacity units ONCE per facility
    max_capacity_units = resolve_max_capacity_units(
        facility_name=facility.name,
        total_courts=facility.total_courts,
        max_players_per_court=facility.max_players_per_court,
    )
    # 3. Fetch slots + consumed units in ONE query
    slots = (
        db.query(
            TimeSlot.id,
            TimeSlot.start_time,
            TimeSlot.end_time,
            func.coalesce(func.sum(Booking.consumed_units), 0).label(
                "consumed_units"
            ),
        )
        .outerjoin(
            Booking,
            (Booking.time_slot_id == TimeSlot.id)
            & (Booking.booking_date == booking_date)
            & (Booking.status == "BOOKED"),
        )
        .filter(
            TimeSlot.facility_id == facility_id,
            TimeSlot.is_active == True,
        )
        .group_by(TimeSlot.id)
        .order_by(TimeSlot.start_time.asc())
        .all()
    )

    today = date.today()
    now_time = datetime.now().time()

    response = []

    for slot in slots:
        remaining_units = max_capacity_units - slot.consumed_units

        # Past slot detection
        is_past = (
            booking_date < today
            or (
                booking_date == today
                and slot.end_time <= now_time
            )
        )

        if is_past:
            status = "past"
        elif remaining_units <= 0:
            status = "full"
        elif remaining_units < max_capacity_units:
            status = "limited"
        else:
            status = "available"

        response.append(
            {
                "id": slot.id,
                "start_time": slot.start_time.strftime("%H:%M"),
                "end_time": slot.end_time.strftime("%H:%M"),
                "max_capacity_units": max_capacity_units,
                "consumed_units": slot.consumed_units,
                "remaining_units": remaining_units,
                "status": status,
            }
        )

    return response
