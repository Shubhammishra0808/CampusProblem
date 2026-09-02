# 🚀 CampusFix — Smart AI Campus Problem Solving Platform
### Built by Team Shubham for Engineering Colleges & Universities

[![Deploy CampusFix to GitHub Pages](https://github.com/Shubhammishra0808/CampusProblem/actions/workflows/deploy.yml/badge.svg)](https://github.com/Shubhammishra0808/CampusProblem/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen)](https://shubhammishra0808.github.io/CampusProblem/)

**CampusFix** is a full-featured campus operations and facility management platform designed to automate student grievances, facility work orders, attendance tracking, classroom equipment health telemetry, smart study room booking, placement drives, and interactive campus communications.

---

## 🌐 Live Website & Demo Link

- **Live URL:** [https://shubhammishra0808.github.io/CampusProblem/](https://shubhammishra0808.github.io/CampusProblem/)
- **Live Local API (Development):** `http://localhost:5000`
- **Live Local Client (Vite):** `http://localhost:5173` / `http://localhost:5174`

---


## ✨ Key Platform Features

1. **Multimodal Grievance Reporting**:
   - 1-Tap QR code scanner for classroom desks, labs, and hostel assets.
   - Speech-to-text voice dictation and photo evidence attachment.
   - Autonomous AI category classification, SLA assignment, and duplicate detection.

2. **Role-Based Command Centers**:
   - **Student Home:** Quick ticket tracker, live notices, 75% attendance widget, cafeteria ratings.
   - **Admin Command Center:** Real-time campus heatmap, resolution metrics, user management, and department triage.
   - **Faculty Dashboard:** Classroom facility requests, student query broadcasts, study resource sharing.
   - **Staff & Technician Desk:** Work orders, 1-tap resolution updates, and digital proof of repair.
   - **Core Team Lead:** Fleet dispatch, escalation handling, and campus event notices.

3. **Smart Attendance System**:
   - 75% university eligibility tracker, safe bunk calculator, subject-wise analytics.
   - Faculty live session generation with passcode & RFID verification.

4. **Campus AI Copilot & Real-Time Chat**:
   - Instant assistance for examination queries, IT Wi-Fi status, hostel complaints, and directory access.

5. **Predictive Maintenance & IoT Telemetry**:
   - Equipment vibration and thermal gauges, scheduled replacement advice, and QR asset tracking.

6. **Smart Study Hub & Pomodoro Pods**:
   - Interactive whiteboard canvas with AI schematic analysis, ambient study sounds (Rain, Cafe, White Noise), and focus timers.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Router (HashRouter for 100% 404-free GitHub Pages hosting).
- **Backend:** Node.js, Express.js, MongoDB / Mongoose, JWT Authentication, Multer file storage.
- **Hosting & CI/CD:** GitHub Actions + GitHub Pages (with intelligent client mock engine for instantaneous standalone preview).

---

## 💻 Local Setup & Execution

### 1. Clone the repository
```bash
git clone https://github.com/Shubhammishra0808/CampusProblem.git
cd CampusProblem
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Seed demo data (Optional for local MongoDB)
```bash
npm run seed
```

### 4. Start the Application
```bash
npm run dev
```

The server runs on `http://localhost:5000` and the client frontend runs on `http://localhost:5173`.

---

## 📄 License
MIT License © 2026 Team Shubham.
