# 🩺 NudgeDoc

### Turning Complex Medical Reports into Clear Health Actions

<p align="center">
  <strong>An AI-powered patient health intelligence portal built for clarity, safety, and accessibility.</strong>
</p>

<p align="center">
  <a href="https://nudge-doc.vercel.app/">🌐 Live Demo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" />
</p>

---

## 🌐 Live Demo

**Production Deployment:**
https://nudge-doc.vercel.app/

**Hackathon Demo Mode:** Available via the Interactive Mock AI Engine.

---

# 📖 Project Overview

Medical reports are often difficult for patients to understand. Prescriptions, pathology reports, discharge summaries, and diagnostic charts contain medical jargon, abbreviations, and Latin dosing instructions such as **BD PC**, **OD AC**, **TDS**, and **SOS**. This creates confusion, anxiety, and can even lead to medication errors.

**NudgeDoc** transforms complex clinical documents into an intuitive patient-friendly dashboard. Using AI-powered interpretation, it converts prescriptions into structured medication schedules, visualizes laboratory biomarkers through interactive indicators, and highlights critical health warnings in a clear and actionable format.

### 🎯 Why This Matters

Patients frequently struggle to interpret prescriptions and lab reports. Important information is often hidden behind technical terminology that healthcare professionals understand but patients do not.

NudgeDoc bridges this communication gap by transforming medical complexity into simple, actionable health guidance.

---

# ✨ Key Features

### 💊 Interactive Daily Pill Planner

* Converts prescription shorthand into clear schedules
* Morning, Afternoon, and Night medication timeline
* Human-readable dosage instructions
* Reduces medication interpretation errors

### 📊 Visual Lab Biomarker Gauges

* Interactive biomarker sliders
* Low, Normal, and High indicators
* Easy-to-understand laboratory analysis
* Visual representation of patient health metrics

### 🚨 Critical Warning Alerts

* Medication safety warnings
* Abnormal biomarker detection
* Risk notification cards
* Follow-up recommendations

### ⚙️ Developer Control Panel

* Interactive Mock AI Engine
* Offline demonstration mode
* No API key required for judging
* Built-in patient scenarios

### 🧪 Preloaded Demo Cases

* Diabetes Report
* Lipid Profile Report
* Post-Angioplasty Summary

---

# 🏗️ System Architecture

Frontend (Next.js + React + TypeScript)
↓
Next.js API Routes
↓
┌─────────────────┬─────────────────┐
│                 │                 │
▼                 ▼                 ▼
db.json      Mock AI Engine    Gemini 2.5 Flash

### Frontend Layer

Built using:

* Next.js 15/16
* React 19
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide Icons

### Data Layer

A lightweight local JSON database enables zero-configuration testing:

`src/data/db.json`

### AI Layer

Powered by **Google Gemini 2.5 Flash** using the official:

`@google/genai`

SDK.

### Offline Mock AI Engine

For hackathons and demonstrations, developers can activate a simulated OCR and AI pipeline using pre-canned patient records.

Benefits:

* No API costs
* No API key required
* Fully offline demonstrations
* Reliable judge experience

---

# 🎯 2-Minute Demo Flow

### Step 1

Open:

https://nudge-doc.vercel.app/

### Step 2

Enable **Interactive Mock AI Engine** from the Developer Panel.

### Step 3

Select a sample report:

* Diabetes Report
* Lipid Profile Report
* Post-Angioplasty Summary

### Step 4

Watch NudgeDoc generate:

* Medication schedules
* Biomarker visualizations
* Health insights
* Risk alerts

### Step 5

Explore the patient dashboard and health recommendations.

---

# 🛠️ Tech Stack

| Category   | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 15/16           |
| UI Library | React 19                |
| Language   | TypeScript              |
| Styling    | Tailwind CSS            |
| Animation  | Framer Motion           |
| Icons      | Lucide React            |
| AI Model   | Google Gemini 2.5 Flash |
| SDK        | @google/genai           |
| Storage    | JSON Database           |
| Deployment | Vercel                  |

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/shivbhardwaj18/NudgeDoc.git

cd NudgeDoc
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_api_key_here
```

## Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📂 Project Structure

```text
src/
├── app/
├── components/
├── data/
│   └── db.json
├── lib/
├── hooks/
└── types/
```

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

### Built to make healthcare information understandable for everyone.

**NudgeDoc — Turning Complex Medical Reports into Clear Health Actions**

</div>
