from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.models.facility import Facility

router = APIRouter()


@router.get("/facilities")
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
            "description": f.description,
        }
        for f in facilities
    ]
