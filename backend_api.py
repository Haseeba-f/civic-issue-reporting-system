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

# Import your AI logic
from civic_issue_reporter import (
    get_report_json,
    get_complaint_text,
    quick_classify,
    process_civic_report
)

app = FastAPI(title="AI Civic Issue Reporting API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",  # Added this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


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
        print(f"📸 Received file: {file.filename}")
        
        # Save uploaded file temporarily
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"✅ File saved to: {file_path}")
        
        # Get quick classification
        result = quick_classify(file.filename)
        
        print(f"✅ Classification result: {result}")
        
        return JSONResponse(content={
            "success": True,
            "data": result
        })
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@app.post("/api/submit-report")
async def submit_report(
    file: UploadFile = File(...),
    latitude: float = Form(None),
    longitude: float = Form(None),
    address: str = Form(None)
):
    """
    Full report submission with location data.
    Returns: complete report JSON
    """
    try:
        print(f"📸 Received file: {file.filename}")
        print(f"📍 Location: {latitude}, {longitude}")
        
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"✅ File saved to: {file_path}")
        
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
        
        print(f"✅ Report generated: {report['report_id']}")
        
        # TODO: Save to database here
        # save_to_database(report)
        
        return JSONResponse(content={
            "success": True,
            "data": report
        })
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
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