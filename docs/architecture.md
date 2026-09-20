# EduPath — System Architecture & Agent Control Specification

EduPath is an AI-powered Career Navigation & Skill-Gap Agent designed to convert career ambitions into verifiable, rubric-backed proof of ability. Unlike legacy e-learning platforms that track course completion or passive video watching, EduPath acts as an active, autonomous feedback loop between industry competency models, the student's current portfolio of evidence, and personalized high-leverage challenges.

---

## 1. High-Level System Architecture

```
                                  +-----------------------------+
                                  |     Target Industry Model   |
                                  |   (e.g., AI Product Manager)|
                                  +--------------+--------------+
                                                 |
                                                 v
+-------------------+             +--------------+--------------+             +----------------------+
|  Student Dossier  |             |      Reasoning Engine       |             |  Autonomous Replan   |
| (Resume, History) +------------>+  - DAG Dependency Traversal +------------>+  - 30-Day Milestone  |
+-------------------+             |  - Gap Severity Computation |             |  - Next Best Action  |
                                  +--------------+--------------+             +----------+-----------+
                                                 ^                                       |
                                                 |                                       v
                                  +--------------+--------------+             +----------+-----------+
                                  |    AI Evaluation Engine     |             | Practical Challenge  |
                                  | - Structure / Depth / Pract |<------------+ - Business Scenario  |
                                  | - Confidence Matrix Updates |             | - Rubric & Templates |
                                  +-----------------------------+             +----------------------+
```

The system operates across three tiers:
1. **Client Tier (`client/`)**: Single-Page Application built on React 18, Vite, Tailwind CSS, `@xyflow/react`, and Recharts. Implements an **Editorial Tech Brutalism** design language (monospaced figure labels, hairline structural borders, high typographic hierarchy, paper off-white palette `#F9F9F8`, electric blue `#0D52FF`).
2. **API & Service Tier (`server/`)**: Service-oriented Express & TypeScript application encapsulating:
   - **Agent Service**: Orchestrates the Observe-Reason-Plan-Act cycle and dynamic roadmap replanning.
   - **Skills Service**: Builds and validates Directed Acyclic Graph (DAG) dependencies, calculating target vs. current proficiency.
   - **Evaluation Service**: Validates and executes 3-dimensional rubric evaluations (Structure, Depth, Practicality) with multi-model fallbacks.
   - **Roadmap Service**: Chronologically sequences 30-day intervention tracks and mutates priorities dynamically.
3. **Data & Storage Tier (`server/src/db`)**:
   - **Relational Storage**: Drizzle ORM configured for PostgreSQL with automated zero-config fallback to `@electric-sql/pglite` WASM when no external PostgreSQL server is active.
   - **File Storage**: Supabase Storage with local filesystem fallback for uploaded resumes, deliverables, and attachments.

---

## 2. Agent Control Loop (Observe - Reason - Plan - Act)

The core innovation of EduPath is its continuous closed-loop autonomy:

### Phase 1: OBSERVE (State Ingestion)
- **Inputs**: User career goal vector $(R_{target}, L_{target}, T_{weeks})$, historical resume text/file, and existing verified submissions $\{P_1, P_2, \dots, P_n\}$.
- **Output**: Calibrated skill proficiency state $S_{user} = \{ (skill_i, level_i, confidence_i, state_i) \}$.

### Phase 2: REASON (DAG Gap Synthesis)
- **Topological Sorting**: Evaluates prerequisite chains (e.g., `Product Discovery` & `LLM Concepts` $\to$ `AI Evaluation`).
- **Gap Size Computation**:
  $$\text{GapSize}_i = \max(0, \text{TargetLevel}_i - \text{CurrentLevel}_i)$$
- **Priority Scoring**:
  $$\text{PriorityScore}_i = \text{GapSize}_i \times W_{prereqs} \times W_{career}$$
  Skills with completed prerequisites and the highest priority score are flagged as **Critical Bottlenecks**.

### Phase 3: ACT (Next Best Action & Challenge Selection)
- Instead of prescribing a generic course, the agent synthesizes or selects a specific, high-fidelity **Work Challenge** directly targeting the highest-leverage gap.
- Supplies rich context: Realistic enterprise scenarios (e.g., "Customer-Support Tier-1 Bot"), explicit deliverable rubrics, and starters.

### Phase 4: VERIFY & REPLAN (Proof-of-Work Evaluation)
- The student submits real work: PRDs, benchmark frameworks, architectural diagrams, or system code.
- The **Evaluation Engine** grades against three rubrics:
  - **Structure (0–100)**: Logical coherence, document completeness, and systematic clarity.
  - **Depth (0–100)**: Technical rigor, edge-case consideration, and metric awareness.
  - **Practicality (0–100)**: Engineering feasibility, operational readiness, and business impact.
- **State Mutation**: If overall score $\ge 70$, skill confidence and current level are upgraded; status transitions from `in_progress` to `verified`.
- **Dynamic Replanning**: The agent recalculates remaining gaps, removes satisfied milestones, and generates the next iteration of the 30-day roadmap.

---

## 3. Security, Authentication & Session Model

- **Authentication**: Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256. Passwords hashed using `bcrypt` (10 salt rounds).
- **Context Injection**: Authenticated user ID is attached to Express `req.user` via `authMiddleware`.
- **Input Validation**: All REST endpoints validate incoming payloads via shared `Zod` schemas before touching controllers or database models.
- **Fail-Safe AI Abstraction**: AI calls support timeout guards, schema output parsing, and instant deterministic heuristic fallback to ensure 100% demo uptime under poor or zero network connectivity.
