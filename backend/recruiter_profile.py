from sqlalchemy import Column, Integer, String, Text

from database import Base


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)

    recruiter_id = Column(Integer, nullable=False, unique=True, index=True)

    company_name = Column(String, nullable=False)

    company_description = Column(Text, nullable=True)

    company_location = Column(String, nullable=True)

    industry = Column(String, nullable=True)

    website = Column(String, nullable=True)