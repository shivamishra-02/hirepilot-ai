# 🚀 HirePilot AI

An AI-powered job application automation system that analyzes job descriptions, selects the best-fit resume, generates personalized outreach emails, and automates recruiter communication using Google Workspace and Gemini API.

---

## 📌 Overview

HirePilot AI eliminates manual job applications by fully automating the workflow:

- Reads job details from Google Sheets  
- Uses Gemini AI to analyze Job Descriptions (JD)  
- Automatically selects the best resume  
- Generates personalized cold emails  
- Sends emails with correct resume attachments via Gmail  
- Tracks application status in real time  

---

## ⚙️ Features

### 🧠 AI-Powered Intelligence
- JD understanding using Gemini API  
- Smart resume selection (AI / Automation / Development roles)  
- Human-like email generation with strict constraints  

### 📧 Email Automation
- Personalized recruiter emails  
- HTML fallback template system  
- Automatic resume attachment  
- Dynamic subject generation  

### 📊 Workflow Tracking
- Application status (Sent / Failed / Pending)  
- Date logging  
- Error tracking in Notes column  

### 📂 Resume Management
- Google Drive-based resume storage  
- Role-based resume selection  

---

## 🏗️ Tech Stack

- Google Apps Script  
- Google Sheets  
- Google Drive  
- Gmail API  
- Gemini API  
- HTML Service  

---

## 📁 Project Structure
HirePilot-AI/
│
├── Code.gs
├── template.html
├── README.md
└── screenshots/


---

## 🔄 System Architecture

```

Google Sheet (Job Input)
↓
Gemini API (JD Analysis)
↓
Resume Selection Engine
↓
Email Generator (AI / Fallback)
↓
HTML Template Renderer
↓
Gmail API (Send Email + Resume)
↓
Google Sheet (Status Update)


## 🧠 How It Works

### Step 1: Job Input
User fills the Google Sheet with job details:

- Company Name  
- HR Name  
- HR Email  
- Job Title  
- Job Description (JD)  

---

### Step 2: AI Processing (Gemini)

Gemini API analyzes the Job Description and decides the best matching resume:

- RESUME_AI → AI / ML / Data Science roles  
- RESUME_AUTOMATION → Automation / Apps Script / Tools roles  
- RESUME_DEV → Web Development / Backend roles  

This ensures role-specific applications.

---

### Step 3: Email Generation

System generates a personalized cold email in two ways:

#### ✅ AI Mode (Gemini Success)
- Context-aware email based on JD  
- Human-like tone  
- Strict word limits  
- No exaggerated or robotic phrases  

#### 🔁 Fallback Mode (Gemini Failure)
- Predefined HTML template is used  
- Safe, clean, and professional structure  
- Ensures email is always generated  

---

### Step 4: Resume Selection

Based on JD analysis:
- Correct resume is picked from Google Drive  
- Resume is attached dynamically during email sending  

---

### Step 5: Email Sending

- Gmail API sends email automatically  
- Selected resume is attached  
- Subject line is dynamically generated  
- Email is delivered to recruiter HR email  

---

### Step 6: Tracking & Logging

Google Sheet is updated automatically:

- Status → Sent / Failed  
- Date Sent → Timestamp of delivery  
- Notes → Error logs or fallback info  

---

## 🚀 Future Enhancements

- Resume match scoring (0–100) based on JD similarity  
- LinkedIn job URL scraping  
- Automated follow-up emails after 3–5 days  
- Dashboard UI using React  
- Analytics for email open & success tracking  
- Multi-template A/B testing system  
- Daily sending limits & safety controls  

---

## 👨‍💻 Author

**Shivam Mishra**

Built as an AI-powered automation system to eliminate manual job applications using Google Workspace and Gemini API.

---

## ⭐ Support

If you like this project:

- ⭐ Star the repository  
- 🍴 Fork it  
- 🚀 Improve and build your own version  