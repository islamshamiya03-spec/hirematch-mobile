from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from models import User
from recruiter_profile import RecruiterProfile
from auth import get_current_user


router = APIRouter(
    prefix="/recruiter-profile",
    tags=["Recruiter Profile"]
)


class RecruiterProfileCreate(BaseModel):
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
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    user = db.query(User).filter(
        User.id == current_user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.role != "RECRUITER":
        raise HTTPException(
            status_code=403,
            detail="Only Recruiters can create this profile",
        )

    existing_profile = db.query(RecruiterProfile).filter(
        RecruiterProfile.recruiter_id == current_user_id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Recruiter profile already exists",
        )

    new_profile = RecruiterProfile(
        recruiter_id=current_user_id,
        company_name=profile.company_name,
        company_description=profile.company_description,
        company_location=profile.company_location,
        industry=profile.industry,
        website=profile.website,
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return {
        "message": "Recruiter profile created successfully",
        "profile": {
            "id": new_profile.id,
            "recruiter_id": new_profile.recruiter_id,
            "company_name": new_profile.company_name,
            "company_description": new_profile.company_description,
            "company_location": new_profile.company_location,
            "industry": new_profile.industry,
            "website": new_profile.website,
        },
    }


@router.get("/")
def get_recruiter_profile(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    user = db.query(User).filter(
        User.id == current_user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.role != "RECRUITER":
        raise HTTPException(
            status_code=403,
            detail="Only Recruiters can view this profile",
        )

    profile = db.query(RecruiterProfile).filter(
        RecruiterProfile.recruiter_id == current_user_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Recruiter profile not found",
        )

    return {
        "profile": {
            "id": profile.id,
            "recruiter_id": profile.recruiter_id,
            "company_name": profile.company_name,
            "company_description": profile.company_description,
            "company_location": profile.company_location,
            "industry": profile.industry,
            "website": profile.website,
        }
    }


@router.put("/")
def update_recruiter_profile(
    profile: RecruiterProfileCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    user = db.query(User).filter(
        User.id == current_user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.role != "RECRUITER":
        raise HTTPException(
            status_code=403,
            detail="Only Recruiters can update this profile",
        )

    existing_profile = db.query(RecruiterProfile).filter(
        RecruiterProfile.recruiter_id == current_user_id
    ).first()

    if not existing_profile:
        raise HTTPException(
            status_code=404,
            detail="Recruiter profile not found",
        )

    existing_profile.company_name = profile.company_name
    existing_profile.company_description = profile.company_description
    existing_profile.company_location = profile.company_location
    existing_profile.industry = profile.industry
    existing_profile.website = profile.website

    db.commit()
    db.refresh(existing_profile)

    return {
        "message": "Recruiter profile updated successfully",
        "profile": {
            "id": existing_profile.id,
            "recruiter_id": existing_profile.recruiter_id,
            "company_name": existing_profile.company_name,
            "company_description": existing_profile.company_description,
            "company_location": existing_profile.company_location,
            "industry": existing_profile.industry,
            "website": existing_profile.website,
        },
    }