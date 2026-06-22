````md
<div align="center">

# 🩺 NudgeDoc

### Turning Complex Medical Reports into Clear Health Actions

<p align="center">
  <strong>An AI-powered patient health intelligence portal built for clarity, safety, and accessibility.</strong>
</p>

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

</div>

---

# 📖 Project Overview

Medical reports are designed for healthcare professionals—not patients. Prescriptions, pathology reports, discharge summaries, and diagnostic charts often contain complex medical terminology, abbreviations, and Latin dosing instructions such as **BD PC**, **OD AC**, **TDS**, and **SOS**. For patients and caregivers, understanding these documents can be difficult, stressful, and error-prone.

**NudgeDoc** transforms clinical documents into an intuitive health dashboard powered by AI. Instead of forcing patients to interpret dense medical jargon, the platform generates personalized medication schedules, highlights abnormal laboratory findings using visual indicators, and surfaces critical health warnings in a simple, actionable format.

The result is a safer, more understandable healthcare experience that helps patients move from confusion to confidence.

---

# ✨ Key Features

### 💊 Interactive Daily Pill Planner
Convert prescription shorthand into a structured medication schedule.

- Morning / Afternoon / Night timeline
- Human-readable dosage instructions
- Clear medication reminders
- Reduced risk of dosing mistakes

### 📊 Visual Lab Biomarker Gauges
Understand lab reports instantly.

- Interactive health metric sliders
- Low / Normal / High indicators
- Easy interpretation of biomarker values
- Patient-friendly visualizations

### 🚨 Critical Warning Alerts
Surface important health concerns immediately.

- High-risk medication warnings
- Abnormal laboratory findings
- Follow-up recommendations
- Safety-focused notification cards

### ⚙️ Developer Control Panel
Built for demos, testing, and hackathons.

- Toggle Mock AI Engine
- Offline operation support
- No API key required for demonstrations
- Pre-seeded clinical document simulations

### 🧪 Preloaded Demo Patient Cases

Includes realistic mock patient scenarios:

- Diabetes Report
- Lipid Profile Report
- Post-Angioplasty Summary

Perfect for judges, recruiters, and hackathon demonstrations.

---

# 🏗️ System Architecture

```text
┌─────────────────────────────────────┐
│          Next.js Frontend           │
│   React + TypeScript + Tailwind     │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│        Next.js API Routes           │
│     Server Actions & Endpoints      │
└───────────────┬─────────────────────┘
                │
      ┌─────────┴─────────┐
      ▼                   ▼

┌──────────────┐   ┌──────────────────┐
│  db.json     │   │ Google Gemini    │
│ Local Store  │   │ 2.5 Flash Model  │
└──────────────┘   └──────────────────┘

````

### Frontend Layer

Built using **Next.js**, **React 19**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Lucide Icons** for a modern, responsive, and accessible user experience.

### API Layer

Next.js API routes handle document processing, AI orchestration, patient retrieval, and report generation workflows.

### Local Data Storage

A lightweight simulated database writes patient information into:

```text
src/data/db.json
```

This enables zero-configuration local testing without requiring external database setup.

### AI Intelligence Layer

The platform integrates with **Google Gemini 2.5 Flash** using the official SDK:

```bash
@google/genai
```

Gemini interprets uploaded clinical documents and generates patient-friendly health insights.

### Offline Mock AI Engine

For hackathons and demos, developers can activate a mock pipeline that simulates OCR and AI outputs using pre-canned medical reports.

This allows:

* Offline demonstrations
* No API costs
* No API keys required
* Reliable judge presentations

---

# 🎯 Live Demo Flow (2-Minute Judge Experience)

### Step 1 — Open NudgeDoc

Judge lands on a clean dashboard focused on patient health insights.

### Step 2 — Upload Clinical Document

Upload a prescription, lab report, or discharge summary.

**OR**

Enable the Mock AI Engine and select:

* Diabetes Report
* Lipid Profile
* Post-Angioplasty Case

### Step 3 — AI Interpretation

The platform processes the document and extracts:

* Medications
* Lab biomarkers
* Clinical observations
* Risk indicators

### Step 4 — Medication Timeline

The judge immediately sees a structured:

```text
🌅 Morning
☀️ Afternoon
🌙 Night
```

medication planner instead of confusing prescription shorthand.

### Step 5 — Biomarker Visualization

Lab values appear as intuitive visual sliders showing:

```text
Low | Normal | High
```

with the patient’s position highlighted.

### Step 6 — Risk & Warning Cards

Critical issues are surfaced instantly using actionable warning alerts.

### Step 7 — Developer Panel

Toggle the Mock AI Engine to demonstrate how the application works entirely offline without external dependencies.

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
| AI Engine  | Google Gemini 2.5 Flash |
| SDK        | @google/genai           |
| Storage    | JSON Database           |
| Deployment | Vercel                  |

---

# 🚀 Getting Started

## Prerequisites

* Node.js 18+
* npm or pnpm
* Google Gemini API Key (optional when Mock AI Mode is enabled)

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/nudgedoc.git

cd nudgedoc
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a file named:

```bash
.env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

Get your API key from:

```text
https://ai.google.dev/
```

---

## 4. Run the Development Server

```bash
npm run dev
```

---

## 5. Open the Application

Navigate to:

```text
http://localhost:3000
```

---

## 6. Optional: Enable Mock AI Engine

Open the Developer Panel and enable:

```text
Interactive Mock AI Engine
```

This allows the application to function entirely offline using built-in patient scenarios.

---

# 📂 Project Structure

```text
src/
│
├── app/
│   ├── api/
│   └── dashboard/
│
├── components/
│
├── data/
│   └── db.json
│
├── lib/
│
├── hooks/
│
└── types/
```

---

# 🌟 Why NudgeDoc?

✅ Converts medical jargon into understandable actions

✅ Reduces prescription interpretation errors

✅ Makes laboratory reports visually intuitive

✅ Supports offline hackathon demonstrations

✅ Requires zero database setup for testing

✅ Built with modern AI-powered architecture

---

# 🔮 Future Enhancements

* OCR integration for scanned documents
* Multi-language support
* Patient health history tracking
* Doctor collaboration dashboard
* Medication adherence notifications
* PDF report exports
* Secure cloud patient records

---

# 📄 License

This project is licensed under the MIT License.

```text
MIT License

Copyright (c) 2026 NudgeDoc

Permission is hereby granted, free of charge,
to any person obtaining a copy of this software
and associated documentation files...
```

---

<div align="center">

### Built with ❤️ to make healthcare information understandable for everyone.

**NudgeDoc — Turning Complex Medical Reports into Clear Health Actions**

</div>
```
