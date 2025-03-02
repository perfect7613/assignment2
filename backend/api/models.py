from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from db.database import Base

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    avatar = Column(String, nullable=True)
    rating = Column(Float, default=0.0)
    stage = Column(String, default="Screening")
    role = Column(String)
    date = Column(DateTime, default=datetime.now)
    files = Column(Integer, default=0)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    rejected = Column(Boolean, default=False)