from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from recruiter_profile import RecruiterProfile


router = APIRouter(
    prefix="/recruiter-profile",
    tags=["Recruiter Profile"]
)


class RecruiterProfileCreate(BaseModel):
    recruiter_id: int
    company_name: str
    company_description: str | None = None
    company_location: str | None = None
    industry: str | None = None
    website: str | None = None


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_recruiter_profile(
    profile: RecruiterProfileCreate,
    db: Session = Depends(get_db)
):
    existing_profile = db.query(RecruiterProfile).filter(
        RecruiterProfile.recruiter_id == profile.recruiter_id
    ).first()

    if existing_profile:
        return {
            "message": "Recruiter profile already exists"
        }

    new_profile = RecruiterProfile(
        recruiter_id=profile.recruiter_id,
        company_name=profile.company_name,
        company_description=profile.company_description,
        company_location=profile.company_location,
        industry=profile.industry,
        website=profile.website
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return {
        "message": "Recruiter profile created successfully",
        "profile_id": new_profile.id
    }

@router.get("/{recruiter_id}")
def get_recruiter_profile(
    recruiter_id: int,
    db: Session = Depends(get_db)
):
    profile = db.query(RecruiterProfile).filter(
        RecruiterProfile.recruiter_id == recruiter_id
    ).first()

    if not profile:
        return {
            "message": "Recruiter profile not found"
        }

    return profile

@router.put("/{recruiter_id}")
def update_recruiter_profile(
    recruiter_id: int,
    profile: RecruiterProfileCreate,
    db: Session = Depends(get_db)
):
    existing_profile = db.query(RecruiterProfile).filter(
        RecruiterProfile.recruiter_id == recruiter_id
    ).first()

    if not existing_profile:
        return {
            "message": "Recruiter profile not found"
        }

    existing_profile.company_name = profile.company_name
    existing_profile.company_description = profile.company_description
    existing_profile.company_location = profile.company_location
    existing_profile.industry = profile.industry
    existing_profile.website = profile.website

    db.commit()
    db.refresh(existing_profile)

    return {
        "message": "Recruiter profile updated successfully",
        "profile_id": existing_profile.id
    }