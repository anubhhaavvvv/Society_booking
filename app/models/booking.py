from sqlalchemy import (
    Column,
    Integer,
    Date,
    String,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=False)
    booking_date = Column(Date, nullable=False)
    status = Column(String(20), default="BOOKED")
    booking_type = Column(String(20), nullable=False)     # SINGLES / DOUBLES
    player_count = Column(Integer, nullable=False)        # 1–4
    consumed_units = Column(Integer, nullable=False)      # capacity units
    status = Column(String(20), default="BOOKED")
    facility = relationship("Facility")
    time_slot = relationship("TimeSlot")
