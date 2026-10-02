from sqlalchemy import Column, Integer, String
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

class JobSeekerProfile(Base):
    __tablename__ = "job_seeker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    skills = Column(String, nullable=True)
    education = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    resume = Column(String, nullable=True)
    