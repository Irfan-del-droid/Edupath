# EduPath — REST API Reference

Base URL: `http://localhost:5000/api`

All authenticated endpoints require an `Authorization: Bearer <JWT_TOKEN>` header.

---

## 1. Authentication (`/auth`)

### `POST /auth/register`
Creates a new candidate account.
- **Request Body**:
  ```json
  {
    "name": "Arjun Mehta",
    "email": "arjun@example.com",
    "password": "password123"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "name": "Arjun Mehta", "email": "arjun@example.com", "role": "candidate" }
  }
  ```

### `POST /auth/login`
Authenticates existing candidate.
- **Request Body**:
  ```json
  {
    "email": "arjun@demo.edupath.ai",
    "password": "demo1234"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "name": "Arjun Mehta", "email": "arjun@demo.edupath.ai", "role": "candidate" }
  }
  ```

### `GET /auth/me`
Retrieves current session identity. Requires Bearer Token.

### `POST /auth/demo/reset`
Resets Arjun demo persona data back to baseline hackathon seed values.

---

## 2. Profile & Career Goals (`/profile`, `/career`)

### `GET /profile`
Retrieves candidate profile, experience years, resume metadata, and completeness score.

### `POST /profile`
Updates headline, bio, experience years, and career summary.

### `POST /career/goal`
Defines target occupation, seniority benchmark, and timeline.
- **Request Body**:
  ```json
  {
    "targetRole": "AI Product Manager",
    "targetLevel": "Senior",
    "targetTimelineWeeks": 8
  }
  ```

---

## 3. Skills & DAG Graph (`/skills`)

### `GET /skills`
Returns full skill taxonomy with current user proficiency levels, verification states (`verified`, `in_progress`, `unassessed`), and confidence scores.

### `GET /skills/graph`
Returns nodes and edges ready for React Flow visualization, complete with position coordinates, prerequisite connections, and status badges.

### `GET /skills/gaps`
Returns prioritized skill gaps computed by the reasoning engine, classified into `Critical`, `High`, `Medium`, and `Low` with explainable rationale.

---

## 4. Roadmaps (`/roadmap`)

### `GET /roadmap`
Retrieves the active 30-day adaptive roadmap partitioned into weekly milestones with task status, estimated completion minutes, and prerequisite relationships.

### `POST /roadmap/replan`
Forces an autonomous agent replanning pass based on newly cleared evidence or goal modifications.

---

## 5. Challenges & Proof of Work (`/challenges`, `/proof`)

### `GET /challenges`
Lists available work challenges filtered by target skill and difficulty.

### `GET /challenges/:id`
Retrieves comprehensive challenge details: industry business scenario, starter templates, deliverable requirements, and evaluation rubrics.

### `POST /proof`
Submits real student deliverables for evaluation.
- **Request Body**:
  ```json
  {
    "challengeId": "uuid-challenge-04",
    "skillId": "uuid-skill-ai-eval",
    "submissionType": "text",
    "content": "### AI Customer-Support Evaluation Framework\n..."
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "uuid-proof-submission",
    "status": "evaluated",
    "evaluation": {
      "score": 84,
      "structureScore": 88,
      "depthScore": 80,
      "practicalityScore": 84,
      "strengths": ["Clear metric formulas", "Covers edge cases"],
      "weaknesses": ["Omitted human-in-the-loop review costs"],
      "nextActionTitle": "Synthesize Agent Guardrail Spec"
    }
  }
  ```

---

## 6. Evaluations & Readiness (`/evaluations`, `/dashboard`)

### `GET /evaluations`
Lists all historical evaluations and analytical reports.

### `GET /evaluations/:id`
Returns full rubric breakdown and actionable recommendations for a specific submission.

### `GET /dashboard`
Returns aggregated intelligence payload:
- Target career role and readiness percentage
- Next Best Action recommendation card
- Highlighted critical gap
- 30-day roadmap progression
- Recent proof submissions and verification metrics
