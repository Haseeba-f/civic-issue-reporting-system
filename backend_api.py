"""
FastAPI Backend Integration Example
Connect civic_issue_reporter.py with your React frontend
"""

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
from pathlib import Path
from database import SessionLocal, engine
import models
from sqlalchemy.orm import Session
from fastapi import Depends


# Import your AI logic
from civic_issue_reporter import (
    get_report_json,
    get_complaint_text,
    quick_classify,
    process_civic_report
)

app = FastAPI(title="AI Civic Issue Reporting API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)


# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# ========================================
# API ENDPOINTS
# ========================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "AI Civic Issue Reporting System API",
        "version": "1.0"
    }


@app.post("/api/quick-classify")
async def quick_classify_endpoint(file: UploadFile = File(...)):
    """
    Quick classification without full report.
    Returns: issue_type, confidence, severity, priority
    Use this for instant feedback while user is uploading.
    """
    try:
        # Save uploaded file temporarily
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get quick classification
        result = quick_classify(file.filename)
        
        return JSONResponse(content={
            "success": True,
            "data": result
        })
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@app.post("/api/submit-report")
async def submit_report(
    file: UploadFile = File(...),
    latitude: float = Form(None),
    longitude: float = Form(None),
    address: str = Form(None),
    db: Session = Depends(get_db)
):
    """
    Full report submission with location data.
    Returns: complete report JSON
    """
    try:
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Prepare location data if provided
        location = None
        if latitude and longitude:
            location = {
                "lat": latitude,
                "lng": longitude,
                "address": address or "Location captured",
                "ward": "Auto-detected",
                "accuracy": "±10 meters"
            }
        
        # Generate full report
        report = get_report_json(file.filename, location)

        new_complaint = models.Complaint(
            report_id=report["data"]["report_id"],
            issue_type=report["data"]["issue"]["type"],
            category=report["data"]["issue"]["category"],
            confidence=report["data"]["issue"]["confidence"],
            severity=report["data"]["issue"]["severity"],
            priority=report["data"]["issue"]["priority"],
            latitude=latitude,
            longitude=longitude,
            address=report["data"]["location"]["address"],
            resolution_timeline=report["data"]["resolution_timeline"],
            department=report["data"]["department"],
            complaint_text=report["data"]["user_feedback"]["message"]
        )

        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)
        
        
        # TODO: Save to database here
        # save_to_database(report)
        
        return JSONResponse(content={
            "success": True,
            "data": report
        })
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@app.post("/api/get-complaint")
async def get_complaint_endpoint(
    file: UploadFile = File(...),
    latitude: float = Form(None),
    longitude: float = Form(None),
    address: str = Form(None)
):
    """
    Get only the complaint text.
    Use this if frontend needs just the complaint for display.
    """
    try:
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Prepare location
        location = None
        if latitude and longitude:
            location = {
                "lat": latitude,
                "lng": longitude,
                "address": address or "Location captured",
                "ward": "Auto-detected"
            }
        
        # Get complaint text
        complaint = get_complaint_text(file.filename, location)
        
        return JSONResponse(content={
            "success": True,
            "complaint": complaint
        })
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


# ========================================
# RUN SERVER
# ========================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    # Access at: http://localhost:8000
    # API docs at: http://localhost:8000/docs