from sqlalchemy.orm import Session
from api import models, schemas
from typing import List, Optional
from fastapi import HTTPException
from datetime import datetime

def get_candidates(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_desc: bool = False,
    stage: Optional[str] = None
) -> List[models.Candidate]:
    query = db.query(models.Candidate)
    
    # Apply search filter
    if search:
        query = query.filter(
            models.Candidate.name.ilike(f"%{search}%") |
            models.Candidate.email.ilike(f"%{search}%") |
            models.Candidate.role.ilike(f"%{search}%")
        )
    
    # Apply stage filter
    if stage and stage.lower() != "all":
        if stage.lower() == "accepted":
            query = query.filter(models.Candidate.rejected == False)
        elif stage.lower() == "rejected":
            query = query.filter(models.Candidate.rejected == True)
    
    # Apply sorting
    if sort_by:
        column = getattr(models.Candidate, sort_by, models.Candidate.id)
        if sort_desc:
            query = query.order_by(column.desc())
        else:
            query = query.order_by(column)
    
    return query.offset(skip).limit(limit).all()

def get_candidate(db: Session, candidate_id: int):
    return db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

def create_candidate(db: Session, candidate: schemas.CandidateCreate):
    db_candidate = models.Candidate(**candidate.dict(), date=datetime.now())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def update_candidate(db: Session, candidate_id: int, candidate: schemas.CandidateUpdate):
    db_candidate = get_candidate(db, candidate_id)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    update_data = candidate.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_candidate, key, value)
    
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def delete_candidate(db: Session, candidate_id: int):
    db_candidate = get_candidate(db, candidate_id)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    db.delete(db_candidate)
    db.commit()
    return {"success": True}

def import_candidates(db: Session, candidates: List[schemas.CandidateCreate]):
    db_candidates = []
    for candidate in candidates:
        db_candidate = models.Candidate(**candidate.dict(), date=datetime.now())
        db.add(db_candidate)
        db_candidates.append(db_candidate)
    db.commit()
    for candidate in db_candidates:
        db.refresh(candidate)
    return db_candidates

def advance_candidate_stage(db: Session, candidate_id: int, next_stage: str):
    db_candidate = get_candidate(db, candidate_id)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    db_candidate.stage = next_stage
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def reject_candidate(db: Session, candidate_id: int):
    db_candidate = get_candidate(db, candidate_id)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    db_candidate.rejected = True
    db_candidate.stage = "Rejected"
    db.commit()
    db.refresh(db_candidate)
    return db_candidate