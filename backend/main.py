from fastapi import FastAPI

from database import Base, engine
from jobs import Job
from job_routes import router as job_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(job_router)


@app.get("/")
def home():
    return {"message": "HireMatch backend is running!"}