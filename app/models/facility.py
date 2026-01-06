from sqlalchemy import Column, Integer, String, Boolean
from app.db.base_class import Base



class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255))
    is_active = Column(Boolean, default=True)
    total_courts = Column(Integer, nullable=False)
    max_players_per_court = Column(Integer, nullable=False)