<div align="center">
  <h1>🚀 TeacHforPLaCeMeNt</h1>
  <p><strong>An all-in-one career platform featuring an AI resume builder, interview simulation, job tracking, and portfolio generation.</strong></p>
  <p>
    <a href="#-quick-install"><img src="https://img.shields.io/badge/install-one%20command-7c3aed?style=for-the-badge&logo=rocket" alt="Install"/></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white" alt="Express"/>
    <img src="https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb&logoColor=white" alt="MongoDB"/>
    <img src="https://img.shields.io/badge/Redis-7.0-DC382D?logo=redis&logoColor=white" alt="Redis"/>
    <img src="https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white" alt="Socket.IO"/>
    <img src="https://img.shields.io/badge/BullMQ-queues-EA2424?logo=bull&logoColor=white" alt="BullMQ"/>
    <img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" alt="React"/>
    <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite"/>
    <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
    <img src="https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black" alt="Firebase"/>
    <img src="https://img.shields.io/badge/Razorpay-payments-3395FF?logo=razorpay&logoColor=white" alt="Razorpay"/>
    <img src="https://img.shields.io/badge/Multi--AI-Supported-7c3aed" alt="Multi-AI"/>
  </p>
</div>

---

## Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Installation Guide](#-installation-guide)
- [Modules](#-modules)
  - [Resume Builder](#-resume-builder)
  - [Mock Interviews](#-mock-interviews)
  - [Job Application Tracker](#-job-application-tracker)
  - [Portfolio Generator](#-portfolio-generator)
  - [AI Utilities](#-ai-utilities)
  - [Community Features](#-community-features)
- [Security](#-security)
- [System Architecture](#-system-architecture)
- [Documentation](#-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🌟 Overview

**TeacHforPLaCeMeNt** is a comprehensive toolkit designed to streamline the job search and career development process. By bringing multiple disparate tools into a single, cohesive dashboard, it allows users to manage their professional profiles seamlessly.

Leveraging multi-provider AI (including OpenAI, Anthropic, Groq, and Google Gemini), the platform helps craft resumes, simulate interviews with feedback, track job applications across stages, and deploy responsive portfolios. 

---

## 🛠 Key Features

The application is structured around six core modules, each offering specialized tools while sharing common backend services like authentication and rate limiting.

| Module | Capabilities |
|---|---|
| **Resume Builder** | AI-assisted resume creation, numerous templates, ATS optimization scoring, dynamic sections, and text-to-resume conversion. |
| **Mock Interviews** | Real-time audio and video mock interviews with an AI avatar, coding challenges using Monaco editor, and confidence analytics. |
| **Job Application Tracker** | Integrated job search, Kanban-style application tracker, scheduled alerts, company research tools, and outreach generation. |
| **Portfolio Generator** | Multiple themes, automatic content extraction from resumes, one-click deployments, SEO optimization, and GitHub synchronization. |
| **AI Utilities** | Generators for cover letters, networking emails, and LinkedIn summaries, plus career trajectory and skill-gap analysis. |
| **Community Features** | Discussion channels, scheduled posts, fellowship challenges, payment integration, and project visualization tools. |

---

## 🚀 Installation Guide

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (v6.0+)
- **Redis** (v7.0+)
- **Firebase Project** configured with Authentication and Firestore
- Optional API keys for AI providers, Razorpay, etc.

### Setup Process

```bash
# Clone the repository
git clone <repository-url>
cd TeacHforPLaCeMeNt

# Install dependencies across all workspaces
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Environment Configuration

Configure the environment variables based on the provided templates:

```bash
# Backend Configuration
cp backend/.env.example backend/.env
# Edit backend/.env to include MONGODB_URI, REDIS_URL, API keys, etc.

# Frontend Configuration
cp frontend/.env.example frontend/.env
# Edit frontend/.env to include VITE_API_URL and Firebase configuration.
```

### Running the Application

```bash
# Start the backend server (runs on port 5000)
cd backend
npm run dev

# Start the frontend server (runs on port 5173)
cd frontend
npm run dev
```

Visit `http://localhost:5173` to access the application.

### Using Docker

For a streamlined setup using Docker:
```bash
docker compose up --build
```
This handles starting the frontend, backend, MongoDB, and Redis automatically.

---

## 📖 Modules

### 📝 Resume Builder
A complete environment for creating, editing, and analyzing resumes.
- **Templates**: Choose from a wide variety of industry-specific designs.
- **AI Enhancement**: Automatically rewrite bullet points, improve ATS scores, and tailor content to specific job descriptions.
- **Export**: Generate print-ready PDFs or share public web links.

### 🎤 Mock Interviews
Practice interviews with realistic AI-driven scenarios.
- **Speech & Video**: Uses browser APIs to simulate a real conversation.
- **Coding Assessment**: Includes a fully-functional code editor with hidden test evaluation for technical rounds.
- **Feedback**: Provides immediate feedback on answer quality, confidence, and posture.

### 💼 Job Application Tracker
Manage your job search pipeline efficiently.
- **Kanban Board**: Track statuses from "Saved" to "Offer".
- **Automated Alerts**: Receive periodic updates on matching jobs.
- **Outreach Drafts**: Generate personalized cold emails to recruiters.

### 🎨 Portfolio Generator
Turn your resume into a personalized website.
- **Theme Selection**: Preview and customize themes live.
- **Deployment**: Deploy instantly to popular static hosting platforms.
- **Accessibility & SEO**: Built-in checks to ensure high quality and search visibility.

### 🧠 AI Utilities
A suite of tools to give you a competitive edge.
- **Cover Letters & Emails**: Context-aware content generation.
- **LinkedIn Optimizer**: Recommendations to improve profile engagement.
- **Skill-Gap Analysis**: Identify areas for growth based on target roles.

### 🌐 Community Features
Connect and collaborate with others.
- **Channels & Messaging**: Real-time communication powered by Socket.IO.
- **Fellowships**: Participate in challenges and manage proposals.
- **Repository Analysis**: Tools to visualize and understand codebases.

---

## 🔐 Security

- **Authentication**: Handled via Firebase (Email, Google, GitHub).
- **Two-Factor Authentication**: TOTP support for enhanced account security.
- **Rate Limiting**: Protects AI endpoints and sensitive routes.
- **Sanitization**: Prevents XSS vulnerabilities in user-generated content.

---

## 🏗 System Architecture

The project operates as a standard full-stack application:
- **Frontend**: React, Vite, TailwindCSS, Zustand for state management.
- **Backend**: Node.js, Express, Mongoose, Socket.IO, BullMQ for background tasks.
- **Infrastructure**: MongoDB, Redis, Firebase.

---

## 📚 Documentation

For deeper technical details, refer to the following documents:
- System Architecture Details
- API Documentation
- Deployment Strategies
- Contribution Guidelines

---

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

---

## 🚢 Deployment

The frontend can be built and served statically, making it compatible with Vercel, Netlify, or similar platforms. The backend requires a Node.js runtime and connections to MongoDB and Redis (e.g., Render, Railway, or AWS).

---

## 📄 License

This project is licensed under the MIT License.
