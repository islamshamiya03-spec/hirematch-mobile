from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class JobSeekerProfileCreate(BaseModel):
    skills: str | None = None
    education: str | None = None
    experience: str | None = None
    resume: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str