# EduPath — Database Schema & Data Models

EduPath utilizes **Drizzle ORM** with standard PostgreSQL dialect. For zero-config local runs, it seamlessly leverages `@electric-sql/pglite` (WASM-based real PostgreSQL engine in-memory or persisted locally) when `DATABASE_URL` is unset or points to internal fallback.

---

## Entity Relationship Summary

```
[users]
   |--- 1:1 --- [profiles]
   |--- 1:M --- [careerGoals]
   |--- 1:M --- [userSkills] ---- M:1 ---- [skills]
   |                  |                       |
   |                  |--- 1:M --- [skillEvidence]
   |                                          |
   |--- 1:M --- [proofOfWork] <---------------+
   |                  |
   |                  |--- 1:1 --- [evaluations]
   |
   |--- 1:M --- [roadmaps]
   |                  |--- 1:M --- [roadmapItems]
   |
   |--- 1:M --- [skillGaps]
   |--- 1:M --- [agentActions]
```

---

## Core Tables

### 1. `users`
- `id` (uuid, Primary Key)
- `email` (varchar, unique)
- `passwordHash` (varchar)
- `name` (varchar)
- `role` (varchar: 'candidate' | 'reviewer' | 'admin')
- `createdAt` (timestamp)

### 2. `skills` & `skillDependencies`
- `skills`:
  - `id` (uuid, PK)
  - `name` (varchar) — e.g. "AI Evaluation", "Product Discovery"
  - `category` (varchar) — e.g. "AI/ML Systems", "Product Strategy"
  - `description` (text)
  - `targetLevel` (integer: 0-100) — benchmark for target role
- `skillDependencies`:
  - `id` (uuid, PK)
  - `skillId` (uuid, FK $\to$ `skills.id`)
  - `prerequisiteSkillId` (uuid, FK $\to$ `skills.id`)

### 3. `userSkills` & `skillEvidence`
- `userSkills`:
  - `id` (uuid, PK)
  - `userId` (uuid, FK $\to$ `users.id`)
  - `skillId` (uuid, FK $\to$ `skills.id`)
  - `currentLevel` (integer: 0-100)
  - `confidence` (integer: 0-100)
  - `verifiedState` (varchar: 'unassessed' | 'in_progress' | 'verified')
  - `lastAssessedAt` (timestamp)
- `skillEvidence`:
  - `id` (uuid, PK)
  - `userSkillId` (uuid, FK $\to$ `userSkills.id`)
  - `proofId` (uuid, FK $\to$ `proofOfWork.id`)
  - `score` (integer: 0-100)
  - `verifiedAt` (timestamp)

### 4. `challenges`
- `id` (uuid, PK)
- `skillId` (uuid, FK $\to$ `skills.id`)
- `title` (varchar)
- `slug` (varchar, unique)
- `description` (text)
- `scenario` (text) — real-world business context
- `prompt` (text) — explicit instructions & constraints
- `starterTemplate` (text) — scaffolding document or code
- `rubricJson` (jsonb) — criteria for Structure, Depth, Practicality
- `difficulty` (varchar: 'Beginner' | 'Intermediate' | 'Advanced')
- `estimatedMinutes` (integer)

### 5. `proofOfWork` & `evaluations`
- `proofOfWork`:
  - `id` (uuid, PK)
  - `userId` (uuid, FK $\to$ `users.id`)
  - `challengeId` (uuid, FK $\to$ `challenges.id`)
  - `skillId` (uuid, FK $\to$ `skills.id`)
  - `submissionType` (varchar: 'text' | 'file' | 'url')
  - `content` (text)
  - `fileUrl` (varchar)
  - `status` (varchar: 'pending' | 'evaluated' | 'failed')
  - `submittedAt` (timestamp)
- `evaluations`:
  - `id` (uuid, PK)
  - `proofId` (uuid, FK $\to$ `proofOfWork.id`)
  - `score` (integer: 0-100)
  - `structureScore` (integer: 0-100)
  - `depthScore` (integer: 0-100)
  - `practicalityScore` (integer: 0-100)
  - `strengthsJson` (jsonb)
  - `weaknessesJson` (jsonb)
  - `missingElementsJson` (jsonb)
  - `recommendationsJson` (jsonb)
  - `nextActionTitle` (text)
  - `nextActionReason` (text)
  - `evaluatedAt` (timestamp)

### 6. `roadmaps` & `roadmapItems`
- `roadmaps`:
  - `id` (uuid, PK)
  - `userId` (uuid, FK $\to$ `users.id`)
  - `careerGoalId` (uuid, FK $\to$ `careerGoals.id`)
  - `generatedAt` (timestamp)
  - `version` (integer)
- `roadmapItems`:
  - `id` (uuid, PK)
  - `roadmapId` (uuid, FK $\to$ `roadmaps.id`)
  - `weekNumber` (integer: 1-4)
  - `orderIndex` (integer)
  - `skillId` (uuid, FK $\to$ `skills.id`)
  - `title` (varchar)
  - `objective` (text)
  - `estimatedMinutes` (integer)
  - `status` (varchar: 'pending' | 'in_progress' | 'completed' | 'skipped')
