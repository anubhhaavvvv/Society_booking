# app/services/booking_service.py

from sqlalchemy.orm import Session
from sqlalchemy import and_, select
from datetime import date

from app.models.booking import Booking
from app.models.timeslot import TimeSlot
from app.models.facility import Facility

from app.core.consumption import calculate_consumed_units
from app.core.capacity import (
    get_max_capacity_units,
    get_allowed_capacity,
)


def create_booking_service(
    *,
    db: Session,
    user_id: int,
    facility_id: int,
    time_slot_id: int,
    booking_date: date,
    booking_type: str,
    player_count: int,
) -> Booking:
    # 1. Validate facility
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise ValueError("Facility not found")

    # 2. Validate time slot
    slot = (
        db.query(TimeSlot)
        .filter(
            TimeSlot.id == time_slot_id,
            TimeSlot.facility_id == facility_id,
            TimeSlot.is_active.is_(True),
        )
        .first()
    )
    if not slot:
        raise ValueError("Time slot not found for this facility")

    # 3. Prevent duplicate booking
    existing_booking = (
        db.query(Booking)
        .filter(
            and_(
                Booking.user_id == user_id,
                Booking.facility_id == facility_id,
                Booking.time_slot_id == time_slot_id,
                Booking.booking_date == booking_date,
                Booking.status == "BOOKED",
            )
        )
        .first()
    )
    if existing_booking:
        raise ValueError("Duplicate booking detected")

    # 4. Calculate consumed units
    consumed_units = calculate_consumed_units(
        booking_type=booking_type,
        player_count=player_count,
    )

    # 5. Lock existing bookings
    locked_bookings = (
        db.execute(
            select(Booking)
            .where(
                Booking.facility_id == facility_id,
                Booking.time_slot_id == time_slot_id,
                Booking.booking_date == booking_date,
                Booking.status == "BOOKED",
            )
            .with_for_update()
        )
        .scalars()
        .all()
    )

    current_consumed_units = sum(
        booking.consumed_units for booking in locked_bookings
    )

    # 6. Determine capacity
    facility_name = facility.name.lower().strip()

    if facility_name in {"gym", "swimming pool"}:
        max_capacity_units = get_allowed_capacity(
            facility_name=facility_name,
            current_units=current_consumed_units,
        )
    else:
        max_capacity_units = get_max_capacity_units(
            total_courts=facility.total_courts,
            max_players_per_court=facility.max_players_per_court,
        )

    # 7. Capacity check
    if current_consumed_units + consumed_units > max_capacity_units:
        raise ValueError("Slot capacity exceeded")

    # 8. Create booking
    booking = Booking(
        user_id=user_id,
        facility_id=facility_id,
        time_slot_id=time_slot_id,
        booking_date=booking_date,
        booking_type=booking_type.lower(),
        player_count=player_count,
        consumed_units=consumed_units,
        status="BOOKED",
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking


def cancel_booking_service(
    *,
    db: Session,
    user_id: int,
    booking_id: int,
) -> Booking:
    booking = (
        db.query(Booking)
        .filter(
            Booking.id == booking_id,
            Booking.user_id == user_id,
        )
        .first()
    )

    if not booking:
        raise ValueError("Booking not found")

    if booking.status != "BOOKED":
        raise ValueError("Booking already cancelled")

    booking.status = "CANCELLED"
    db.commit()

    return booking
