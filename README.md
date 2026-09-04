Enterprise Applicant Tracking System (ATS)
A modern, corporate-ready full-stack Applicant Tracking System designed to streamline the entire recruitment lifecycle—from candidate application submission to interactive recruiter pipeline management and real-time data analytics.

Tech Stack
Frontend: React, React Router, Axios, Vite

Backend: Python, FastAPI, Uvicorn, Python-Multipart

Database: MySQL (mysql-connector-python)

File Storage: Local Directory Storage for Resume PDFs (backend/uploads/)

Key Features
Candidate Portal: Clean form interface allowing applicants to select open roles, input personal details, and upload PDF resumes.

Recruiter Kanban Dashboard: Interactive multi-stage hiring pipeline supporting real-time status transitions across Applied, Reviewed, Interviewing, Hired, and Rejected.

Recruitment Analytics Dashboard: Dynamic insights tracking Average Time-to-Hire, candidate drop-off percentages, and role-based applicant volume through custom SQL aggregation queries.

Project Structure
Plaintext
ats-project/
├── backend/
│   ├── uploads/           # Stored candidate PDF resumes
│   ├── venv/              # Python virtual environment
│   ├── main.py            # FastAPI application and routes
│   └── database.py        # MySQL connection configuration
├── database/
│   └── schema.sql         # Initial database schema and tables
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analytics.jsx
│   │   │   └── RecruiterDashboard.jsx
│   │   ├── App.jsx        # Main router and application form
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── .gitignore
Getting Started & Installation
1. Clone the Repository
Bash
git clone https://github.com/Partha-x-dev/ats-project.git
cd ats-project
2. Database Setup
Ensure you have MySQL installed and running locally. Run the schema script to create the necessary database and tables:

SQL
-- Execute commands from database/schema.sql in your MySQL client
CREATE DATABASE ats_db;
USE ats_db;
-- Create tables for jobs and candidates...
3. Backend Configuration & Execution
Navigate to the backend directory, set up your virtual environment, install dependencies, and launch the FastAPI server:

Bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install fastapi uvicorn mysql-connector-python python-multipart pydantic
uvicorn main:app --reload
The backend server will run at [http://127.0.0.1:8000](http://127.0.0.1:8000).

4. Frontend Configuration & Execution
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the Vite development server:

Bash
cd frontend
npm install
npm run dev
The frontend application will run at http://localhost:5173.

Core API Endpoints
Method	Endpoint	Description
GET	/	Verify backend server status
GET	/jobs	Fetch all active open positions
POST	/jobs	Create a new job posting
GET	/candidates	Fetch all job applicants for the pipeline
POST	/apply	Submit candidate application form with resume file upload
PUT	/candidates/{id}/status	Update a candidate's Kanban pipeline stage
GET	/analytics	Retrieve time-to-hire, drop-off rates, and role velocity metrics
