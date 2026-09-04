from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from database import get_db_connection

app = FastAPI()

# Enable CORS so our React frontend can talk to this Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure the uploads folder exists to save resume PDFs
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 1. ROOT ENDPOINT: Check if backend is running
@app.get("/")
def read_root():
    return {"message": "ATS Backend is running successfully!"}

# 2. GET ALL JOBS: Fetch open positions for the frontend dropdown/list
@app.get("/jobs")
def get_jobs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jobs WHERE is_active = TRUE")
    jobs = cursor.fetchall()
    cursor.close()
    conn.close()
    return jobs

# 3. CREATE A JOB: Simple endpoint for recruiters to post new roles
@app.post("/jobs")
def create_job(title: str = Form(...), department: str = Form(...)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO jobs (title, department) VALUES (%s, %s)",
        (title, department)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Job created successfully!"}

# 4. SUBMIT APPLICATION: Handle form data and file upload together
@app.post("/apply")
def apply_job(
    job_id: int = Form(...),
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...)
):
    # Save the uploaded resume PDF to our local uploads directory
    file_path = os.path.join(UPLOAD_DIR, resume.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)

    # Save the candidate details and resume path into MySQL
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO candidates (job_id, name, email, resume_file_path, status) 
        VALUES (%s, %s, %s, %s, 'Applied')
        """,
        (job_id, name, email, file_path)
    )
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"message": "Application submitted successfully!", "file": resume.filename}

# 5. GET ALL CANDIDATES: Fetch applicants for the recruiter pipeline
@app.get("/candidates")
def get_candidates():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM candidates")
    candidates = cursor.fetchall()
    cursor.close()
    conn.close()
    return candidates

# 6. UPDATE CANDIDATE STATUS: Move applicants across Kanban stages
@app.put("/candidates/{candidate_id}/status")
def update_candidate_status(candidate_id: int, status_data: dict):
    new_status = status_data.get("status")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE candidates SET status = %s WHERE id = %s",
        (new_status, candidate_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Candidate status updated successfully!"}

# 7. DATA ANALYTICS: Time-to-Hire, Drop-Off Rates, and Role Velocity
@app.get("/analytics")
def get_analytics():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # 1. Time-to-Hire: Average days from application to 'Hired' status
    cursor.execute("""
        SELECT AVG(DATEDIFF(CURRENT_TIMESTAMP, applied_at)) as avg_days_to_hire 
        FROM candidates WHERE status = 'Hired'
    """)
    time_to_hire = cursor.fetchone()["avg_days_to_hire"] or 0
    
    # 2. Pipeline Drop-Off Rates: Percentage of candidates marked as 'Rejected'
    cursor.execute("""
        SELECT 
            (SELECT COUNT(*) FROM candidates WHERE status = 'Rejected') * 100.0 / 
            NULLIF((SELECT COUNT(*) FROM candidates), 0) as drop_off_rate
    """)
    drop_off_rate = cursor.fetchone()["drop_off_rate"] or 0
    
    # 3. Role Velocity: Track which jobs have open candidates longest
    cursor.execute("""
        SELECT j.title, COUNT(c.id) as total_applicants
        FROM jobs j
        LEFT JOIN candidates c ON j.id = c.job_id
        GROUP BY j.id, j.title
    """)
    role_velocity = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return {
        "average_days_to_hire": round(float(time_to_hire), 1),
        "drop_off_rate_percentage": round(float(drop_off_rate), 1),
        "role_velocity": role_velocity
    }