from sqlalchemy import Column, Integer, String, Float
from database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, unique=True, index=True)
    issue_type = Column(String)
    category = Column(String)
    confidence = Column(Float)
    severity = Column(String)
    priority = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String)
    resolution_timeline = Column(String)
    department = Column(String)
    complaint_text = Column(String)
