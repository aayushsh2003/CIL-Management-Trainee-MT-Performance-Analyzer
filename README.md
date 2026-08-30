# CIL MT & DigiALM Answer Key Performance Analyzer

A full-stack performance analyzer and evaluation dashboard for **Coal India Limited Management Trainee (CIL MT)**, **TCS iON**, and **DigiALM Touchstone** computer-based assessment answer keys.

---

## Features

- **Automated Answer Key Parsing**:
  - Live proxy fetch for DigiALM response sheet URLs bypassing CORS limitations.
  - Supports uploading `.html` / `.htm` answer key files directly or pasting raw HTML source code.
  - Relative image resolution linking to DigiALM CDN assets.

- **Candidate Profile & Summary**:
  - Extracts candidate metadata: Participant Name, Roll / Participant ID, Test Date, Test Center, Subject / Discipline.
  - Displays Total Marks Scored, Max Marks, Score Percentage, Overall Accuracy, and Attempt Rate.
  - **Paper 1 vs Paper 2 Split**: Dedicated scorecards for General Aptitude (Paper 1 - 100 Marks) and Technical Domain (Paper 2 - 100 Marks).

- **Section-Wise Breakdown**:
  - Detailed metrics for all 5 assessment sections:
    1. Part 1: General Knowledge Awareness
    2. Part 2: Numerical Ability
    3. Part 3: Reasoning
    4. Part 4: General English
    5. Part 5: Domain Knowledge
  - Accuracy %, Attempt Rate, Correct, Incorrect, and Unattempted question counts with visual stacked progress bars.

- **Configurable Marking Schemes**:
  - **CIL MT Standard**: `+1` per correct answer, `0` negative marking.
  - **CIL MT with Negative**: `+1` per correct answer, `-0.25` negative deduction.
  - **SSC Pattern**: `+2` per correct answer, `-0.5` negative deduction.
  - **RRB / GATE Pattern**: `+1` per correct answer, `-0.33` negative deduction.
  - **Custom Scheme**: Set custom positive and negative marks with live recalculation.

- **Interactive Question Palette & Audit**:
  - 1-to-200 Question Matrix with instant click-to-scroll navigation.
  - Color-coded badges for Correct (Green), Incorrect (Red), and Unattempted (Slate).
  - Search questions by text, keyword, or Question ID.
  - Status filters: All, Correct, Incorrect, Unattempted, Marked for Review.
  - **AI Solution Explainer**: Powered by Gemini API to provide step-by-step reasoning and high-yield revision tips for any question.

- **Printable Scorecard**:
  - Export and print an official-style candidate performance scorecard with complete sectional tables.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas-Confetti
- **Backend Server**: Node.js, Express, tsx, esbuild
- **HTML Parsing**: DOMParser & Cheerio for DigiALM DOM structure
- **AI Explanations**: `@google/genai` (Gemini 2.5 Flash)

---

## Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   PORT=3000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

---

## Deploying to Vercel

This repository is pre-configured with Vercel Serverless API functions (`/api/parse-url.ts`, `/api/explain-question.ts`, and `vercel.json`):

1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. (Optional) Set the `GEMINI_API_KEY` environment variable in Vercel Project Settings for AI concept explanations.
4. Deploy! Both the React SPA frontend and `/api/*` serverless routes will work immediately.
5. If the DigiALM CDN link is protected or session-expired, users can also use the **Upload HTML File** or **Paste HTML Source** tabs directly.

---

## Supported Answer Key Sources

- Coal India Limited (CIL) MT Answer Keys (`cdn.digialm.com`)
- SSC CGL / CHSL / JE / MTS Response Sheets
- RRB NTPC / Group D / ALP Answer Keys
- Any standard TCS iON Touchstone assessment HTML response page
