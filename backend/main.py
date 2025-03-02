from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import routes
from db.database import engine
from api.models import Base
from db.database import SessionLocal
from api import models, schemas
from datetime import datetime
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR Management API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to HR Management API"}


def init_sample_data():
    db = SessionLocal()
    count = db.query(models.Candidate).count()
    
    if count == 0:
        sample_candidates = [
            {
                "name": "Charlie Kristen",
                "avatar": "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
                "rating": 4.0,
                "stage": "Design Challenge",
                "role": "Sr. UX Designer",
                "files": 3,
                "email": "charlie.k@gmail.com",
            },
            {
                "name": "Malaika Brown",
                "avatar": "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
                "rating": 3.5,
                "stage": "Screening",
                "role": "Growth Manager",
                "files": 1,
                "email": "malaika.br@gmail.com",
            },
            {
                "name": "Simon Minter",
                "avatar": "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
                "rating": 2.8,
                "stage": "Design Challenge",
                "role": "Financial Analyst",
                "files": 2,
                "email": "simon.m@gmail.com",
            },
            {
                "name": "Ashley Brooks",
                "avatar": "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
                "rating": 4.5,
                "stage": "HR Round",
                "role": "Financial Analyst",
                "files": 3,
                "email": "ashley.b@gmail.com",
            },
            {
                "name": "Nishant Talwar",
                "avatar": "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
                "rating": 5.0,
                "stage": "Round 2 Interview",
                "role": "Sr. UX Designer",
                "files": 2,
                "email": "nishant.t@gmail.com",
            },
            {
                "name": "Mark Jacobs",
                "avatar": "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
                "rating": 2.0,
                "stage": "Rejected",
                "role": "Growth Manager",
                "files": 1,
                "email": "mark.j@gmail.com",
                "rejected": True,
            },
        ]
        
        for candidate_data in sample_candidates:
            rejected = candidate_data.pop("rejected", False)
            candidate = models.Candidate(**candidate_data, date=datetime.now(), rejected=rejected)
            db.add(candidate)
        
        db.commit()
    
    db.close()

init_sample_data()