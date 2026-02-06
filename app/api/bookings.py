from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date

from app.db.deps import get_db
from app.auth.dependencies import get_current_user

from app.services.booking_service import (
    create_booking_service,
    cancel_booking_service,
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
    try:
        booking = create_booking_service(
            db=db,
            user_id=user_id,
            facility_id=facility_id,
            time_slot_id=time_slot_id,
            booking_date=booking_date,
            booking_type=booking_type,
            player_count=player_count,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

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
    try:
        booking = cancel_booking_service(
            db=db,
            user_id=user_id,
            booking_id=booking_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

    return {
        "message": "Booking cancelled successfully",
        "booking_id": booking.id,
    }
