# EduPath — AI Career Navigation & Skill-Gap Agent

> **Turn career aspirations into verified proof of ability.**  
> EduPath continuously identifies verified skill gaps, prescribes the single next best action, and evaluates practical deliverables against rigorous multi-dimensional rubrics.

Built according to the **Editorial Tech Brutalism + Swiss Modernism** design language.

---

## Key Features

1. **Autonomous Closed-Loop Agent Engine**:
   - **Observe**: Ingests resumes, career goals, and past verified artifacts.
   - **Reason**: Topological DAG dependency analysis calculates critical skill bottlenecks.
   - **Plan & Act**: Synthesizes custom 30-day roadmaps and pinpoints the single **Next Best Action**.
   - **Verify & Replan**: Evaluates real deliverables (Structure, Depth, Practicality) and dynamically adapts the roadmap.
2. **Flagship Dashboard Surface**:
   - High-contrast editorial layout with monospaced figure labels (`FIG. 01 / SKILL SYSTEM`).
   - Real-time Career Readiness score and benchmark comparison.
   - High-leverage gap spotlight and instant challenge trigger.
3. **Interactive React Flow Skill DAG Explorer**:
   - Visual dependency graph with node inspection drawers, prerequisite validation, and confidence indicators.
4. **Authentic Workplace Challenges & Submissions**:
   - Real enterprise scenarios, starter templates, and explicit scoring rubrics.
   - Quick "Auto-fill Sample Submission" button for rapid 1-click live demo evaluation.
5. **Detailed Rubric Evaluation Reports**:
   - Multi-dimensional scoring (Structure, Depth, Practicality).
   - Concrete strengths, missing elements, and next sequential recommendations.
6. **Career Readiness & Evidence Dossier**:
   - Quantified portfolio matrix ready to present to hiring managers and technical interviewers.

---

## Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, `@xyflow/react`, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, Drizzle ORM, Zod, JWT, bcrypt.
- **Database**: PostgreSQL with automatic `@electric-sql/pglite` (WASM real Postgres) fallback for zero-config local runs.
- **AI Engine**: Provider abstraction supporting Gemini and OpenAI APIs, with intelligent deterministic heuristic rubrics for offline resilience.

---

## Quick Start (Local Setup)

### 1. Install Dependencies
```bash
# From the project root
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(No external API keys or running database required! Zero-config fallback is active by default.)*

### 3. Run Development Servers
```bash
# Starts both frontend (port 5173) and backend API (port 5000)
npm run dev
```

Open your browser at:  
👉 **`http://localhost:5173`**

### 4. Instant Demo Credentials
Click **"Instant Demo (Arjun)"** on the landing page, or log in with:
- **Email**: `arjun@demo.edupath.ai`
- **Password**: `demo1234`
- **Target Role**: AI Product Manager

---

## Documentation

- [Architecture & Agent Specification](file:///c:/Users/DELL/Downloads/Edupath/docs/architecture.md)
- [REST API Reference](file:///c:/Users/DELL/Downloads/Edupath/docs/api.md)
- [Database Schema & Data Models](file:///c:/Users/DELL/Downloads/Edupath/docs/database.md)
- [Design System Guide](file:///c:/Users/DELL/Downloads/Edupath/docs/design-system.md)
- [3-Minute Hackathon Demo Script](file:///c:/Users/DELL/Downloads/Edupath/docs/demo-script.md)
