from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from jobs import Job


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


class JobCreate(BaseModel):
    recruiter_id: int
    title: str
    company_name: str
    description: str
    location: str
    employment_type: str
    salary: str | None = None
    required_skills: str | None = None
    experience_required: str | None = None

class JobUpdate(BaseModel):
    title: str
    company_name: str
    description: str
    location: str
    employment_type: str
    salary: str | None = None
    required_skills: str | None = None
    experience_required: str | None = None
    active: bool


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    new_job = Job(
        recruiter_id=job.recruiter_id,
        title=job.title,
        company_name=job.company_name,
        description=job.description,
        location=job.location,
        employment_type=job.employment_type,
        salary=job.salary,
        required_skills=job.required_skills,
        experience_required=job.experience_required,
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return {
        "message": "Job created successfully",
        "job_id": new_job.id
    }

@router.get("/")
def get_my_jobs(recruiter_id: int, db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(
        Job.recruiter_id == recruiter_id
    ).all()

    return {
        "jobs": jobs
    }

@router.put("/{job_id}")
def update_job(
    job_id: int,
    recruiter_id: int,
    job_data: JobUpdate,
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.recruiter_id == recruiter_id
    ).first()

    if not job:
        return {
            "message": "Job not found or you are not authorized"
        }

    job.title = job_data.title
    job.company_name = job_data.company_name
    job.description = job_data.description
    job.location = job_data.location
    job.employment_type = job_data.employment_type
    job.salary = job_data.salary
    job.required_skills = job_data.required_skills
    job.experience_required = job_data.experience_required
    job.active = job_data.active

    db.commit()
    db.refresh(job)

    return {
        "message": "Job updated successfully",
        "job_id": job.id
    }


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    recruiter_id: int,
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.recruiter_id == recruiter_id
    ).first()

    if not job:
        return {
            "message": "Job not found or you are not authorized"
        }

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully",
        "job_id": job_id
    }