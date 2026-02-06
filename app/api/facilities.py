from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.facility import Facility

router = APIRouter(prefix="/facilities", tags=["Facilities"])


@router.get("")
def list_facilities(db: Session = Depends(get_db)):
    facilities = (
        db.query(Facility)
        .filter(Facility.is_active == True)
        .all()
    )

    return [
        {
            "id": f.id,
            "name": f.name,
        }
        for f in facilities
    ]
