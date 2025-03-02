from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from fastapi.responses import JSONResponse, HTMLResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from api import crud, schemas
from db.database import get_db
import io
import csv
import json
import requests

router = APIRouter()

@router.get("/candidates/", response_model=List[schemas.Candidate])
def read_candidates(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_desc: bool = False,
    stage: Optional[str] = None
):
    candidates = crud.get_candidates(db, skip, limit, search, sort_by, sort_desc, stage)
    return candidates

@router.get("/candidates/{candidate_id}", response_model=schemas.Candidate)
def read_candidate(candidate_id: int, db: Session = Depends(get_db)):
    db_candidate = crud.get_candidate(db, candidate_id)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate

@router.post("/candidates/", response_model=schemas.Candidate)
def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
    return crud.create_candidate(db, candidate)

@router.put("/candidates/{candidate_id}", response_model=schemas.Candidate)
def update_candidate(candidate_id: int, candidate: schemas.CandidateUpdate, db: Session = Depends(get_db)):
    return crud.update_candidate(db, candidate_id, candidate)

@router.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    return crud.delete_candidate(db, candidate_id)

@router.post("/candidates/import/", response_model=List[schemas.Candidate])
async def import_candidates(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    buffer = io.StringIO(content.decode('utf-8'))
    reader = csv.DictReader(buffer)
    
    candidates = []
    for row in reader:
        try:
            candidate = schemas.CandidateCreate(
                name=row.get('name', ''),
                avatar=row.get('avatar'),
                rating=float(row.get('rating', 0)),
                stage=row.get('stage', 'Screening'),
                role=row.get('role', ''),
                files=int(row.get('files', 0)),
                email=row.get('email'),
                phone=row.get('phone'),
                experience=row.get('experience')
            )
            candidates.append(candidate)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error parsing row: {str(e)}")
    
    return crud.import_candidates(db, candidates)

@router.put("/candidates/{candidate_id}/next-stage", response_model=schemas.Candidate)
def advance_candidate_stage(candidate_id: int, next_stage: str = Query(...), db: Session = Depends(get_db)):
    return crud.advance_candidate_stage(db, candidate_id, next_stage)

@router.put("/candidates/{candidate_id}/reject", response_model=schemas.Candidate)
def reject_candidate(candidate_id: int, db: Session = Depends(get_db)):
    return crud.reject_candidate(db, candidate_id)

@router.get("/candidates/{candidate_id}/pdf", response_class=HTMLResponse)
def generate_candidate_html(candidate_id: int, db: Session = Depends(get_db)):
    """
    Instead of generating a PDF server-side (which requires WeasyPrint dependencies),
    we return an HTML page that's formatted for printing. The frontend can then
    trigger the browser's print functionality.
    """
    db_candidate = crud.get_candidate(db, candidate_id)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Create printable HTML
    html_content = f"""
    <!DOCTYPE html>
    <html>
        <head>
            <title>Candidate Profile: {db_candidate.name}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ 
                    font-family: Arial, sans-serif; 
                    margin: 20px;
                    line-height: 1.6;
                }}
                h1 {{ 
                    color: #333;
                    border-bottom: 2px solid #6E38E0;
                    padding-bottom: 10px;
                }}
                .header {{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }}
                .logo {{
                    font-weight: bold;
                    font-size: 20px;
                    color: #6E38E0;
                }}
                .section {{ 
                    margin-bottom: 20px; 
                    border: 1px solid #eee;
                    padding: 15px;
                    border-radius: 5px;
                }}
                .section-title {{
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #6E38E0;
                }}
                .field {{
                    margin-bottom: 10px;
                }}
                .label {{ 
                    font-weight: bold; 
                    color: #666;
                    display: inline-block;
                    width: 150px;
                }}
                .value {{ 
                    display: inline-block;
                }}
                @media print {{
                    body {{
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }}
                    .no-print {{
                        display: none;
                    }}
                }}
                .print-button {{
                    background-color: #6E38E0;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">RSKD Talent</div>
                <button class="print-button no-print" onclick="window.print()">Print PDF</button>
            </div>
            
            <h1>Candidate Profile: {db_candidate.name}</h1>
            
            <div class="section">
                <div class="section-title">Personal Information</div>
                <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">{db_candidate.name}</div>
                </div>
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">{db_candidate.email or 'N/A'}</div>
                </div>
                <div class="field">
                    <div class="label">Phone:</div>
                    <div class="value">{db_candidate.phone or 'N/A'}</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Application Details</div>
                <div class="field">
                    <div class="label">Applied Role:</div>
                    <div class="value">{db_candidate.role}</div>
                </div>
                <div class="field">
                    <div class="label">Current Stage:</div>
                    <div class="value">{db_candidate.stage}</div>
                </div>
                <div class="field">
                    <div class="label">Rating:</div>
                    <div class="value">{db_candidate.rating} / 5.0</div>
                </div>
                <div class="field">
                    <div class="label">Application Date:</div>
                    <div class="value">{db_candidate.date.strftime('%d/%m/%Y')}</div>
                </div>
                <div class="field">
                    <div class="label">Files Attached:</div>
                    <div class="value">{db_candidate.files}</div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Professional Experience</div>
                <div class="field">
                    <div class="label">Experience:</div>
                    <div class="value">{db_candidate.experience or 'N/A'}</div>
                </div>
            </div>
            
            <script>
                // Auto-print when loaded (optional)
                // window.onload = function() {{
                //     window.print();
                // }};
            </script>
        </body>
    </html>
    """
    
    return HTMLResponse(content=html_content)