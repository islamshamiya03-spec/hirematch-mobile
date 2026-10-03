from fastapi import FastAPI

from database import Base, engine
from jobs import Job
from recruiter_profile import RecruiterProfile
from job_routes import router as job_router
from recruiter_profile_routes import router as recruiter_profile_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(job_router)
app.include_router(recruiter_profile_router)


@app.get("/")
def home():
    return {"message": "HireMatch backend is running!"}