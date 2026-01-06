print("seed script running")
from datetime import time
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.facility import Facility
from app.models.timeslot import TimeSlot


FACILITIES = [
    "Gym",
    "Swimming Pool",
    "Badminton Court",
    "Lawn Tennis",
    "Table Tennis",
    "Pickleball",
]


def seed_facilities_and_slots():
    db: Session = SessionLocal()

    try:
        for name in FACILITIES:
            facility = db.query(Facility).filter_by(name=name).first()
            if not facility:
                facility = Facility(name=name, is_active=True)
                db.add(facility)
                db.commit()
                db.refresh(facility)

            # Create time slots for each facility
            for hour in range(6, 23):
                start = time(hour, 0)
                end = time(hour + 1, 0)

                exists = (
                    db.query(TimeSlot)
                    .filter_by(
                        facility_id=facility.id,
                        start_time=start,
                        end_time=end,
                    )
                    .first()
                )

                if not exists:
                    slot = TimeSlot(
                        facility_id=facility.id,
                        start_time=start,
                        end_time=end,
                        is_active=True,
                    )
                    db.add(slot)

        db.commit()
        print("Facilities and time slots seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_facilities_and_slots()
