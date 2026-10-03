from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import (
    verify_password,
    create_access_token,
    hash_password,
    get_current_user,
)
from database import SessionLocal
from models import User, JobSeekerProfile
from schemas import UserCreate, UserLogin, JobSeekerProfileCreate

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if user.role not in ["JOB_SEEKER", "RECRUITER"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be JOB_SEEKER or RECRUITER",
        )

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
        },
    }


@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(user.password, existing_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    token = create_access_token(existing_user.id)

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email,
            "role": existing_user.role,
        },
    }


@router.post("/jobseeker/profile")
def create_jobseeker_profile(
    profile: JobSeekerProfileCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.role != "JOB_SEEKER":
        raise HTTPException(
            status_code=403,
            detail="Only Job Seekers can create this profile",
        )

    existing_profile = (
        db.query(JobSeekerProfile)
        .filter(JobSeekerProfile.user_id == current_user_id)
        .first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Job Seeker profile already exists",
        )

    new_profile = JobSeekerProfile(
        user_id=current_user_id,
        skills=profile.skills,
        education=profile.education,
        experience=profile.experience,
        resume=profile.resume,
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return {
        "message": "Job Seeker profile created successfully",
        "profile": {
            "id": new_profile.id,
            "user_id": new_profile.user_id,
            "skills": new_profile.skills,
            "education": new_profile.education,
            "experience": new_profile.experience,
            "resume": new_profile.resume,
        },
    }


@router.get("/jobseeker/profile")
def get_jobseeker_profile(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    profile = (
        db.query(JobSeekerProfile)
        .filter(JobSeekerProfile.user_id == current_user_id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Job Seeker profile not found",
        )

    return {
        "profile": {
            "id": profile.id,
            "user_id": profile.user_id,
            "skills": profile.skills,
            "education": profile.education,
            "experience": profile.experience,
            "resume": profile.resume,
        }
    }


@router.put("/jobseeker/profile")
def update_jobseeker_profile(
    profile: JobSeekerProfileCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    existing_profile = (
        db.query(JobSeekerProfile)
        .filter(JobSeekerProfile.user_id == current_user_id)
        .first()
    )

    if not existing_profile:
        raise HTTPException(
            status_code=404,
            detail="Job Seeker profile not found",
        )

    existing_profile.skills = profile.skills
    existing_profile.education = profile.education
    existing_profile.experience = profile.experience
    existing_profile.resume = profile.resume

    db.commit()
    db.refresh(existing_profile)

    return {
        "message": "Job Seeker profile updated successfully",
        "profile": {
            "id": existing_profile.id,
            "user_id": existing_profile.user_id,
            "skills": existing_profile.skills,
            "education": existing_profile.education,
            "experience": existing_profile.experience,
            "resume": existing_profile.resume,
        },
    }