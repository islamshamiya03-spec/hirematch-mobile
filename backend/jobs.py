from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func

from database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    recruiter_id = Column(Integer, nullable=False, index=True)

    title = Column(String, nullable=False)
    company_name = Column(String, nullable=False)

    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)

    employment_type = Column(String, nullable=False)

    salary = Column(String, nullable=True)

    required_skills = Column(Text, nullable=True)

    experience_required = Column(String, nullable=True)

    active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )