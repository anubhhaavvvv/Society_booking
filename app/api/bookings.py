from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, select
from datetime import date

from app.db.deps import get_db
from app.auth.dependencies import get_current_user
from app.models.booking import Booking
from app.models.timeslot import TimeSlot
from app.models.facility import Facility

from app.core.consumption import calculate_consumed_units
from app.core.capacity import (
    get_max_capacity_units,
    get_allowed_capacity,
)

router = APIRouter()


@router.post("/bookings")
def create_booking(
    facility_id: int,
    time_slot_id: int,
    booking_date: date,
    booking_type: str,
    player_count: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    # 1. Validate facility
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facility not found",
        )

    # 2. Validate time slot
    slot = (
        db.query(TimeSlot)
        .filter(
            TimeSlot.id == time_slot_id,
            TimeSlot.facility_id == facility_id,
            TimeSlot.is_active == True,
        )
        .first()
    )

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Time slot not found for this facility",
        )

    # 3. Prevent duplicate booking by same user
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
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already booked this slot for the selected date",
        )

    # 4. Calculate consumed units for this booking
    try:
        consumed_units = calculate_consumed_units(
            booking_type=booking_type,
            player_count=player_count,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # 5. Lock existing bookings for this slot & date
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

    # 6. Determine max capacity (facility-specific)
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
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Slot capacity exceeded",
        )

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

    return {
        "message": "Booking successful",
        "booking_id": booking.id,
    }


@router.post("/bookings/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    booking = (
        db.query(Booking)
        .filter(
            Booking.id == booking_id,
            Booking.user_id == user_id,
        )
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if booking.status != "BOOKED":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Booking is already cancelled",
        )

    booking.status = "CANCELLED"
    db.commit()

    return {
        "message": "Booking cancelled successfully",
        "booking_id": booking.id,
    }


@router.get("/bookings/me")
def get_my_bookings(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    bookings = (
        db.query(Booking)
        .join(TimeSlot, Booking.time_slot_id == TimeSlot.id)
        .join(Facility, Booking.facility_id == Facility.id)
        .filter(Booking.user_id == user_id)
        .order_by(
            Booking.booking_date.desc(),
            TimeSlot.start_time.asc(),
        )
        .all()
    )

    return [
        {
            "id": booking.id,
            "facility_id": booking.facility_id,
            "facility_name": booking.facility.name,
            "booking_date": booking.booking_date,
            "time_slot_id": booking.time_slot_id,
            "start_time": booking.time_slot.start_time,
            "end_time": booking.time_slot.end_time,
            "status": booking.status,
            "booking_type": booking.booking_type,
            "player_count": booking.player_count,
        }
        for booking in bookings
    ]
