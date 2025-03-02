from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CandidateBase(BaseModel):
    name: str
    avatar: Optional[str] = None
    rating: float
    stage: str
    role: str
    files: int = 0
    email: Optional[str] = None
    phone: Optional[str] = None
    experience: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    rating: Optional[float] = None
    stage: Optional[str] = None
    role: Optional[str] = None
    files: Optional[int] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    experience: Optional[str] = None
    rejected: Optional[bool] = None

class Candidate(CandidateBase):
    id: int
    date: datetime
    rejected: bool = False
    
    class Config:
        orm_mode = True