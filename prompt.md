# EduPath — Master Build Prompt

## Editorial AI Systems UI/UX Edition

EDUPATH — MASTER BUILD PROMPT
EDITORIAL AI SYSTEMS UI/UX EDITION

You are a world-class product manager, senior full-stack engineer,
AI agent architect, UX/UI designer, database architect, design systems
engineer, and hackathon evaluator.

Your task is to BUILD a production-quality hackathon MVP called:

EDUPATH
AI Career Navigation \& Skill-Gap Agent

Tagline:
"Turn career goals into proof of ability."

==================================================

1. PRODUCT VISION
==================================================

EduPath is NOT a generic AI chatbot and NOT a generic course
recommendation platform.

EduPath is an AI-powered career navigation system that continuously
understands a user's current capabilities, compares them with a target
career, identifies skill gaps, recommends the next best action, gives
the user practical work to complete, evaluates the resulting proof of
work, updates the user's skill confidence, and replans the journey.

The core product loop is:

CURRENT PROFILE
↓
CAREER GOAL
↓
SKILL GRAPH
↓
SKILL GAP ANALYSIS
↓
PERSONALIZED ROADMAP
↓
NEXT BEST ACTION
↓
LEARN / PRACTICE / BUILD
↓
PROOF OF WORK
↓
AI EVALUATION
↓
SKILL CONFIDENCE UPDATE
↓
REPLAN
↓
NEXT BEST ACTION

The product should feel like an intelligent Career Operating System,
not a chatbot wrapped in a dashboard.

==================================================
2. PRIMARY USER
===

For the hackathon MVP, optimize for:

College students and early-career professionals trying to become
AI Product Managers.

The architecture should remain extensible to:

* Product Manager
* Software Engineer
* Data Analyst
* AI Engineer
* Business Analyst

Do NOT overbuild these additional personas in the MVP.

==================================================
3. CORE PRODUCT PROMISE
===

Traditional learning platforms answer:

"What should I learn?"

EduPath should answer:

"What should I do NEXT, why should I do it, and can I prove
that I actually know how to do it?"

The product must prioritize:

1. Skill understanding
2. Skill-gap identification
3. Next Best Action
4. Practical challenges
5. Proof of work
6. AI evaluation
7. Skill progression
8. Dynamic replanning

The central differentiator is the:

PROOF-OF-WORK LOOP

Career goal
→ skill gap
→ practical task
→ proof
→ evaluation
→ verified skill state
→ new next-best action.

==================================================
4. NON-NEGOTIABLE TECH STACK
===

FRONTEND

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router
* React Flow
* Recharts
* Lucide React

BACKEND

* Node.js
* Express.js
* TypeScript
* REST API
* Zod
* JWT authentication
* bcrypt

DATABASE

* PostgreSQL
* Drizzle ORM
* pgvector

AI

* LLM API
* Provider isolated behind an AI service abstraction

STORAGE

* Supabase Storage ONLY

IMPORTANT:

Supabase is ONLY for file/object storage.

DO NOT use:

* Supabase Database
* Supabase Auth
* Supabase Edge Functions
* Supabase Realtime

Application data lives in PostgreSQL.

Authentication is implemented in the Node.js backend.

Database access happens through Drizzle ORM.

Supabase Storage contains:

* resumes
* profile assets
* project files
* proof-of-work submissions
* optional generated artifacts

Never store uploaded binary files directly inside PostgreSQL.

==================================================
5. ARCHITECTURE
===

Use a clean client-server architecture.

&#x20;                   React + Vite
                         │
                         │ REST API
                         ▼
                 Node.js + Express
                         │
          ┌──────────────┼───────────────┐
          │              │               │
          ▼              ▼               ▼
     PostgreSQL        AI Service    Supabase Storage
      + pgvector
          │
          ▼
      Drizzle ORM


The frontend must NEVER directly access PostgreSQL.

The frontend must NEVER contain:

* database credentials
* LLM API keys
* Supabase service-role credentials

All sensitive operations happen on the backend.

==================================================
6. MONOREPO / FILE ALLOCATION
===

Use this structure:

edupath/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   ├── types/
│   │   ├── constants/
│   │   ├── assets/
│   │   ├── routes/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   │   ├── schema/
│   │   │   ├── migrations/
│   │   │   ├── index.ts
│   │   │   └── seed.ts
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   ├── agent/
│   │   │   ├── profile/
│   │   │   ├── skills/
│   │   │   ├── roadmap/
│   │   │   ├── proof/
│   │   │   ├── evaluation/
│   │   │   └── storage/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── types/
│   │   ├── prompts/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── drizzle.config.ts
│   └── package.json
│
├── shared/
│   ├── types/
│   ├── schemas/
│   └── constants/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── demo-script.md
│
├── .env.example
├── .gitignore
├── package.json
└── README.md

==================================================
7. FRONTEND FILE RESPONSIBILITIES
===

client/src/app/

Application-level configuration:

* providers
* global state
* query configuration
* theme configuration

client/src/pages/

Page-level components only.

Create:

* LandingPage
* LoginPage
* RegisterPage
* OnboardingPage
* DashboardPage
* ProfilePage
* CareerGoalPage
* SkillGraphPage
* SkillGapPage
* RoadmapPage
* ChallengePage
* ProofOfWorkPage
* EvaluationPage
* CareerReadinessPage
* CopilotPage
* SettingsPage

Do not put large business logic directly inside pages.

client/src/features/

Create:
features/profile/
features/career/
features/skills/
features/roadmap/
features/challenges/
features/proof/
features/evaluation/
features/copilot/
features/dashboard/

Each feature can contain:

* components
* hooks
* API helpers
* types

client/src/components/

Reusable components such as:

* EditorialCard
* SectionLabel
* FigureLabel
* MetricCard
* SkillBadge
* ProgressBar
* SkillGraph
* GapCard
* RoadmapTimeline
* NextBestAction
* ChallengeCard
* EvidenceCard
* EvaluationScore
* UploadZone
* EmptyState
* LoadingState
* ErrorState
* Modal
* ConfirmationDialog
* DataTable
* StatusChip
* ArchitectureDiagram

Avoid giant components.

client/src/services/

Frontend API clients only:

apiClient.ts
authApi.ts
profileApi.ts
careerApi.ts
skillsApi.ts
roadmapApi.ts
challengeApi.ts
proofApi.ts
evaluationApi.ts
copilotApi.ts

No database code here.

client/src/lib/

Generic frontend utilities:

* API configuration
* auth token handling
* formatting
* date helpers
* React Query configuration if used

==================================================
8. BACKEND FILE RESPONSIBILITIES
===

server/src/controllers/

Thin HTTP request/response handlers.

Responsibilities:

* validate request
* call service
* return response

Controllers must NOT contain large business algorithms.

server/src/routes/

Express route definitions:

auth.routes.ts
profile.routes.ts
career.routes.ts
skills.routes.ts
roadmap.routes.ts
challenge.routes.ts
proof.routes.ts
evaluation.routes.ts
copilot.routes.ts
dashboard.routes.ts
storage.routes.ts

server/src/services/

Actual product intelligence.

services/profile/

* resume processing
* profile extraction
* project extraction
* experience normalization
* profile completeness

services/skills/

* skill taxonomy
* skill extraction
* skill normalization
* skill confidence
* skill dependencies
* skill graph generation
* skill gap calculation

services/roadmap/

* roadmap generation
* roadmap prioritization
* weekly planning
* next-best-action calculation
* roadmap replanning

services/proof/

* proof-of-work submission
* evidence normalization
* artifact metadata
* submission lifecycle

services/evaluation/

* AI evaluation
* rubric application
* strengths
* weaknesses
* evidence quality
* recommendations
* skill confidence updates

services/agent/

Orchestration layer:

OBSERVE
→ REASON
→ PLAN
→ ACT
→ EVALUATE
→ UPDATE
→ REPLAN

Do not blindly call an LLM for every action.

Use deterministic application logic wherever possible.

services/ai/

Provider abstraction.

Methods may include:

* extractProfile()
* extractSkills()
* analyzeSkillGap()
* generateChallenge()
* evaluateProof()
* generateRoadmap()
* generateCopilotResponse()

Implement:
aiProvider.ts
llmProvider.ts

services/storage/

ONLY Supabase Storage integration.

Implement:

* uploadFile()
* createSignedUploadUrl()
* createSignedDownloadUrl()
* deleteFile()
* getFileMetadata()

Do NOT put database operations here.

==================================================
9. DATABASE DESIGN
===

Use PostgreSQL with Drizzle ORM.

Minimum entities:

users
profiles
career\_goals
skills
skill\_dependencies
user\_skills
skill\_evidence
skill\_gaps
roadmaps
roadmap\_items
learning\_tasks
challenges
proof\_of\_work
evaluations
evaluation\_items
agent\_actions
projects
career\_readiness
conversations
conversation\_messages

Relationships:

User
↓
Profile
↓
Career Goal
↓
Skill Graph
↓
Skill Gaps
↓
Roadmap
↓
Tasks
↓
Challenges
↓
Proof of Work
↓
Evaluation
↓
Skill Update
↓
Roadmap Replanning

Use:

* UUID primary identifiers
* timestamps
* foreign keys
* indexes
* enums where useful
* pgvector only where semantic similarity genuinely adds value

Do NOT add vector search everywhere just because pgvector exists.

==================================================
10. AUTHENTICATION
===

Backend-managed authentication.

Registration:
email
password
name

Use bcrypt for password hashing.
Use JWT for authentication.

Never store plain-text passwords.
Never expose JWT secrets to the frontend.

Implement:

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Protect private routes with auth middleware.

==================================================
11. ONBOARDING
===

Collect:

* Name
* Current education / experience
* Current role
* Target career
* Years of experience
* Skills
* Projects
* Resume
* Weekly available time
* Career timeline

Resume uploads go to Supabase Storage.

Backend uses the AI service to extract useful information.

Do not blindly trust AI extraction.

Allow the user to review and edit extracted information.

==================================================
12. CAREER TARGET
===

Initial target:

"I want to become an AI Product Manager."

EduPath determines:

* required skills
* skill dependencies
* expected proficiency
* current proficiency
* gaps
* priority
* evidence requirements

Example skills:

Product Discovery
PRD Writing
User Research
Product Analytics
SQL
AI Fundamentals
LLM Concepts
Prompt Engineering
AI Evaluation
Agent Design
Experimentation
Metrics
Product Strategy
Communication

Do not hardcode every skill directly into UI components.

Skills should come from database/configuration.

==================================================
13. SKILL GRAPH
===

Create a visual skill graph.

Nodes:
skills

Edges:
dependencies / relationships

Example:

AI Fundamentals
↓
LLM Concepts
↓
Prompt Engineering
↓
AI Evaluation
↓
AI Product Management

Each skill shows:

* confidence
* evidence count
* required level
* gap
* status

Use React Flow.

The graph must be functional, not decorative.

Clicking a skill opens:

* why it matters
* current level
* target level
* evidence
* missing proof
* recommended action

==================================================
14. SKILL GAP ENGINE
===

Base calculation:

skill\_gap =
target\_level - current\_verified\_level

But do not reduce the entire product to one numerical formula.

Consider:

* skill importance
* dependency relationships
* evidence quality
* career relevance
* current confidence
* time required
* prerequisite skills

Prioritize gaps with the highest impact on the target career.

Use priority states:
Critical
High
Medium
Low

These priorities should be explainable.

==================================================
15. NEXT BEST ACTION
===

This is one of the most important product surfaces.

The dashboard must clearly answer:

"What should I do next?"

Example:

NEXT BEST ACTION

Complete:
"Design an AI evaluation framework for a customer-support agent."

WHY
"AI Evaluation is currently your largest verified skill gap
for the AI Product Manager role."

Estimated time:
45 minutes

Impact:
High

Action:
\[ START CHALLENGE ]

The recommendation must be generated from actual user state.

Never hardcode the same recommendation for every user.

==================================================
16. PERSONALIZED ROADMAP
===

Create:

* 30-day roadmap
* weekly action plan

Each roadmap item includes:

* skill
* objective
* task
* estimated time
* difficulty
* expected outcome
* evidence requirement
* completion state

The roadmap changes when:

* a challenge is completed
* skill confidence increases
* new evidence is submitted
* career goal changes
* a task is skipped
* new evidence changes the user's state

==================================================
17. PROOF OF WORK
===

Users should not simply click:
"I completed this skill."

They submit evidence.

Examples:

* PRD
* product teardown
* SQL analysis
* AI evaluation report
* product strategy
* prototype
* GitHub project
* presentation
* written analysis

Proof may be:

* text
* file
* URL

Files go to Supabase Storage.
Metadata goes to PostgreSQL.

Each proof contains:

* skill
* challenge
* submission
* evidence
* submitted\_at
* evaluation state
* evaluation result

==================================================
18. AI EVALUATION
===

When proof is submitted:

1. Retrieve relevant challenge.
2. Retrieve target skill.
3. Retrieve rubric.
4. Retrieve submitted proof.
5. Ask AI to evaluate.
6. Validate AI response schema.
7. Store evaluation.
8. Update skill confidence.
9. Trigger roadmap replanning.

Evaluation contains:

* overall score
* strengths
* weaknesses
* missing elements
* evidence quality
* improvement suggestions
* recommended next action

Never allow arbitrary LLM text to directly mutate critical state.

Use structured JSON output.
Validate AI output using Zod.

==================================================
19. AI AGENT DESIGN
===

OBSERVE

Read:

* profile
* career goal
* skills
* evidence
* roadmap
* previous actions
* recent evaluation

REASON

Determine:

* biggest verified gap
* prerequisites
* evidence weakness
* next useful intervention

PLAN

Create:

* next action
* challenge
* roadmap adjustment

ACT

Perform:

* recommendation generation
* challenge generation
* evaluation
* explanation

EVALUATE

Check:

* user evidence
* skill improvement
* completion quality

UPDATE

Update:

* skill confidence
* evidence state
* roadmap state

REPLAN

Generate the next best action.

==================================================
20. AGENT SAFETY / CONTROL
===

The AI agent must NOT have unrestricted database access.

Use service-level tools:

getUserProfile()
getCareerGoal()
getSkillState()
getSkillGaps()
createChallenge()
evaluateProof()
updateSkillConfidence()
replanRoadmap()

The agent may request actions.

The backend decides whether those actions are valid.

Never allow:

* arbitrary SQL from an LLM
* arbitrary code execution
* model modification of authentication/security data

==================================================
21. DASHBOARD
===

The dashboard is the primary product surface.

It should immediately communicate:

CAREER / AI PRODUCT MANAGEMENT

CAREER READINESS
72%

SKILL SYSTEM

Product Discovery       86%
PRD                     81%
Analytics               61%
AI Fundamentals         54%
AI Evaluation           38%
Agent Design            22%

NEXT BEST ACTION

Complete AI Evaluation Challenge

45 MIN
HIGH IMPACT

\[ START CHALLENGE ]

CURRENT ROADMAP

WEEK 01
WEEK 02
WEEK 03
WEEK 04

RECENT PROOF

AI Product Teardown
Evaluation: 82%

CAREER READINESS

Skills verified
Portfolio evidence
Interview readiness
Project depth

The dashboard must feel like an intelligence/control surface,
not a collection of rounded SaaS cards.

==================================================
22. CAREER READINESS
===

Track:

* verified skills
* portfolio evidence
* project depth
* interview readiness
* confidence
* missing proof

Do not claim:
"You are job ready."

Show measurable evidence instead.

Example:

CAREER READINESS
72%

8/12 target skills demonstrated
5 proof-of-work artifacts
2 projects
3 skills requiring stronger evidence

==================================================
23. AI COPILOT
===

Include an AI Copilot that understands actual EduPath state.

Examples:

"What should I work on today?"
"Why is AI Evaluation my biggest gap?"
"What evidence do I need for Product Analytics?"
"Am I ready for an AI PM interview?"
"How can I improve this PRD?"

The Copilot must use real user state rather than generic answers.

==================================================
24. UI / UX — PRIMARY DESIGN SYSTEM
===

THIS SECTION IS NON-NEGOTIABLE.

Use the visual language of the provided reference image as inspiration.

The desired direction is:

EDITORIAL TECH BRUTALISM
+
SWISS / INTERNATIONAL MODERNISM
+
AI SYSTEMS / ARCHITECTURE EDITORIAL

Do NOT use the previous Glassmorphism direction.

Do NOT make EduPath look like a generic modern SaaS dashboard.

The visual identity should feel like:

* AI research publication
* premium product intelligence report
* systems architecture document
* editorial technology magazine
* modern AI operating system

==================================================
25. GRID SYSTEM
===

Build the interface around a strict editorial grid.

Use:

* visible or extremely subtle grid lines
* consistent columns
* strong alignment
* modular sections
* thin horizontal and vertical rules
* deliberate asymmetry
* large whitespace

The grid should be part of the visual identity.

Do not randomly place cards.

Sections should feel architecturally positioned.

Use CSS grid heavily.

Example composition:

┌───────────────────────────────────────────────┐
│ PRODUCT / CAREER INTELLIGENCE                 │
├───────────────────────────┬───────────────────┤
│                           │ CONTEXT           │
│ LARGE HEADLINE            │                   │
│                           │ STATUS            │
├───────────────────────────┼───────────────────┤
│ FIG. 01                   │ FIG. 02           │
│ SKILL SYSTEM              │ BEHAVIOUR         │
│                           │                   │
├───────────────────────────┴───────────────────┤
│ NEXT BEST ACTION                              │
└───────────────────────────────────────────────┘

Adapt this concept to interactive application UX.

==================================================
26. COLOR SYSTEM
===

Use a restrained palette.

Primary:

* warm/off-white paper-like background
* near-black typography
* one strong electric blue accent

The blue should be used strategically for:

* active state
* emphasis
* key numbers
* primary action
* important words
* progress
* selected nodes

Do NOT use blue everywhere.

Avoid:

* purple AI gradients
* neon rainbow palettes
* excessive color coding
* glowing effects
* glossy gradients

The interface should feel printed/editorial first,
digital/interactive second.

==================================================
27. TYPOGRAPHY
===

Typography is a primary design element.

Use a strong modern grotesk/sans-serif for:

* headlines
* section titles
* navigation
* major metrics

Use a restrained monospace or technical font for:

* metadata
* figure labels
* timestamps
* technical identifiers
* small category labels
* system status
* architecture annotations

Create strong typographic contrast.

Example:

AI CAREER / NAVIGATION

YOUR NEXT MOVE

AI EVALUATION

38%

The typography should carry visual hierarchy.

Avoid excessive font weights and decorative typography.

==================================================
28. EDITORIAL MICROTYPOGRAPHY
===

Use small labels such as:

FIG. 01
SKILL SYSTEM
CAREER STATE
EVIDENCE
BEHAVIOUR
AGENT ACTION
PROOF
EVALUATION
SYSTEM STATUS

Use uppercase labels with increased letter spacing.

These labels should create an editorial/research-document feeling.

Do not overuse them.

==================================================
29. BORDERS AND SURFACES
===

Prefer:

* thin 1px borders
* black/neutral rules
* flat surfaces
* paper-like backgrounds
* subtle separators

Avoid:

* heavy shadows
* floating glass cards
* excessive rounded corners
* glowing borders
* glossy surfaces

Cards may have small or moderate corner radii,
but avoid the typical "everything is a 20px rounded card" SaaS look.

Some important sections may intentionally use square corners.

==================================================
30. BUTTONS
===

Buttons should be strong and editorial.

Primary action:

* black or accent blue
* high contrast
* compact
* confident typography

Secondary action:

* transparent/light
* thin border

Avoid:

* pill-shaped buttons everywhere
* excessive gradients
* oversized CTA buttons

Example:

\[ START CHALLENGE → ]

==================================================
31. DASHBOARD COMPOSITION
===

Do NOT create a dashboard with 12 identical rounded cards.

Instead use editorial composition.

For example:

CAREER / AI PRODUCT MANAGEMENT
────────────────────────────────────────

72%
CAREER READINESS

8/12 SKILLS VERIFIED

─────────────────────────┬──────────────────

YOUR SKILL SYSTEM        │ CURRENT STATE

Product Discovery  86%   │ AI EVALUATION
PRD Writing        81%   │ 38%
Analytics          61%   │
AI Fundamentals    54%   │ Largest verified
Agent Design       22%   │ gap

─────────────────────────┴──────────────────

FIG. 04 / NEXT BEST ACTION

DESIGN AN AI EVALUATION FRAMEWORK

45 MIN / HIGH IMPACT

\[ START CHALLENGE → ]

This should feel like an interactive intelligence report.

==================================================
32. SKILL GRAPH VISUAL LANGUAGE
===

The React Flow skill graph should follow the editorial system.

Nodes should be:

* flat
* sharply defined
* minimal
* typographic
* state-aware

Avoid glowing futuristic nodes.

Use:

* black
* off-white
* electric blue
* thin connectors

Selected node:
electric blue accent.

Weak skill:
clear visual state, but not excessive red/yellow/green traffic-light
colors.

The graph should feel like a systems diagram.

==================================================
33. ROADMAP DESIGN
===

Avoid a generic colorful timeline.

Use an editorial sequence:

WEEK 01
────────────────────────

01 / AI FUNDAMENTALS
Understand model behavior

STATUS
IN PROGRESS

EVIDENCE
Required

────────────────────────

WEEK 02
...

Use:

* numbering
* figure labels
* thin rules
* compact metadata
* progress indicators

==================================================
34. PROOF-OF-WORK DESIGN
===

Treat proof as evidence in a professional portfolio.

Example:

FIG. 07 / EVIDENCE

AI EVALUATION FRAMEWORK
Submitted 18 Sep 2026

SKILL
AI Evaluation

TYPE
Document

STATUS
UNDER REVIEW

Then show:

* evaluation score
* evidence quality
* strengths
* gaps
* next action

Make the evidence feel important.

==================================================
35. AI EVALUATION DESIGN
===

Avoid presenting evaluation as a generic AI chat response.

Present it like an analytical report.

Example:

EVALUATION / 082

AI EVALUATION FRAMEWORK

────────────────────────

STRUCTURE
████████████████░░  82

DEPTH
██████████████░░░░  74

PRACTICALITY
████████████████░░  81

────────────────────────

WHAT WORKED

...

WHAT IS MISSING

...

NEXT ACTION

...

This is much more aligned with the product identity.

==================================================
36. AI COPILOT DESIGN
===

The Copilot may be conversational,
but it must not visually dominate the product.

Use it as an intelligent side panel or contextual workspace.

Avoid:

* giant chat bubbles
* playful chatbot avatars
* excessive gradients

Make it feel like:

SYSTEM INTELLIGENCE
CONTEXT
REASONING
RECOMMENDATION

==================================================
37. ANIMATION
===

Use restrained motion only.

Good:

* subtle page transitions
* graph node transitions
* progress animation
* hover underline
* smooth panel expansion
* loading state

Avoid:

* floating particles
* glowing animations
* excessive parallax
* flashy AI effects
* constant movement

Animation should communicate state, not decoration.

==================================================
38. RESPONSIVE DESIGN
===

Must work on:

* desktop
* tablet
* mobile

Preserve the editorial hierarchy on mobile.

Do not simply shrink desktop.

On mobile:

* collapse grid columns intelligently
* preserve headline hierarchy
* preserve section labels
* preserve key actions
* allow skill graph horizontal scrolling or a usable mobile mode
* stack evidence and evaluation sections cleanly

==================================================
39. UX STATES
===

Every major feature supports:

Loading
Success
Empty
Error
Retry
Disabled
Unauthorized
Not Found

Maintain the editorial design language even in these states.

Example:

FIG. 03 / SKILL EVIDENCE

NO VERIFIED EVIDENCE YET

Complete your first challenge to create
evidence for this skill.

\[ VIEW CHALLENGE → ]

==================================================
40. API DESIGN
===

Use REST.

Base path:
/api

Examples:

POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/profile
PUT    /api/profile
POST   /api/profile/resume

GET    /api/career-goals
POST   /api/career-goals
PUT    /api/career-goals/:id

GET    /api/skills
GET    /api/skills/graph
GET    /api/skills/gaps

GET    /api/roadmap
POST   /api/roadmap/replan

GET    /api/challenges
GET    /api/challenges/:id

POST   /api/proof
GET    /api/proof
GET    /api/proof/:id

POST   /api/evaluations
GET    /api/evaluations/:id

GET    /api/dashboard
GET    /api/career-readiness

POST   /api/copilot

Use consistent JSON responses.
Validate requests with Zod.

==================================================
41. SECURITY
===

Implement:

* bcrypt password hashing
* JWT authentication
* environment variables
* CORS configuration
* request validation
* file type validation
* file size limits
* rate limiting on AI endpoints
* safe error messages
* no secrets in Git
* no service-role keys in frontend
* SQL injection protection through Drizzle
* authorization checks for every user-owned resource

Never trust user IDs from request bodies when authenticated identity
is available from JWT.

==================================================
42. ENVIRONMENT VARIABLES
===

Create .env.example:

DATABASE\_URL=
JWT\_SECRET=
LLM\_API\_KEY=
LLM\_MODEL=
SUPABASE\_URL=
SUPABASE\_SERVICE\_ROLE\_KEY=
SUPABASE\_STORAGE\_BUCKET=
CLIENT\_URL=

Never commit actual secrets.

SUPABASE\_SERVICE\_ROLE\_KEY must only exist on the backend.

==================================================
43. DEMO MODE
===

Create realistic demo data.

Demo user:
Arjun

Goal:
AI Product Manager

Example skill state:

Product Discovery        Strong
PRD Writing              Strong
User Research            Strong
Product Analytics        Developing
AI Fundamentals          Developing
LLM Concepts             Developing
AI Evaluation            Weak
Agent Design             Weak

Primary demo flow:

1. Login
2. Dashboard
3. Show career readiness
4. Open skill system
5. Show AI Evaluation gap
6. Click Next Best Action
7. Open challenge
8. Submit proof
9. AI evaluates proof
10. Show analytical evaluation
11. Skill confidence changes
12. Roadmap automatically updates
13. Dashboard shows new Next Best Action

This is the primary hackathon demo.

==================================================
44. DEMO QUALITY
===

Judge should understand the product within 30 seconds.

Main demo target:
approximately 3 minutes.

Do not spend demo time on:

* login implementation
* database tables
* generic chat
* configuration screens

Show:

PROFILE
→ SKILL SYSTEM
→ GAP
→ NEXT BEST ACTION
→ CHALLENGE
→ PROOF
→ AI EVALUATION
→ SKILL UPDATE
→ REPLAN

==================================================
45. DO NOT BUILD THESE IN MVP
===

Do NOT waste hackathon time on:

* social networking
* student messaging
* complex payments
* marketplace
* enterprise admin panel
* advanced notifications
* dozens of integrations
* mobile app
* unnecessary microservices
* huge course marketplace
* complicated gamification

The goal is one complete intelligent loop.

==================================================
46. IMPLEMENTATION PRIORITY
===

Priority 1:
Authentication
Profile
Career Goal
Skill Graph
Skill Gap
Dashboard
Next Best Action

Priority 2:
Challenges
Proof of Work
AI Evaluation

Priority 3:
Skill Update
Dynamic Roadmap Replanning

Priority 4:
Career Readiness
AI Copilot

Priority 5:
Visual polish
Analytics
Additional enhancements

Never build Priority 5 before Priority 1-3 work end-to-end.

==================================================
47. ERROR HANDLING
===

Use centralized backend error handling.

Return consistent responses.

Example:

{
"success": false,
"error": {
"code": "PROFILE\_NOT\_FOUND",
"message": "Profile not found"
}
}

Never expose stack traces in production responses.

==================================================
48. AI OUTPUT CONTRACT
===

Every AI workflow uses structured output.

Example:

{
"skills": \[],
"confidence": 0,
"reasoning\_summary": "",
"recommendations": \[]
}

Validate using Zod.

If AI output fails validation:

1. retry if appropriate
2. otherwise return controlled error
3. never silently store malformed AI output

==================================================
49. OBSERVABILITY
===

Create basic structured logging.

Track:

* request ID
* user ID
* endpoint
* execution time
* AI operation
* AI latency
* AI failure
* database failure

Do not log:

* passwords
* JWTs
* API keys
* sensitive uploaded content unnecessarily

==================================================
50. TESTING
===

Create tests for critical logic:

Authentication
Skill-gap calculation
Next-best-action selection
Roadmap generation
Proof submission
Evaluation validation
Skill update
Authorization
File upload validation

Test:

* missing resume
* empty profile
* no career goal
* no skill evidence
* invalid proof
* AI timeout
* malformed AI response
* duplicate proof
* unauthorized resource access
* deleted file
* incomplete onboarding

==================================================
51. DATABASE MIGRATIONS
===

Use Drizzle migrations.

Maintain:
server/src/db/schema/
server/src/db/migrations/

Create a seed script for demo data.

==================================================
52. STORAGE ARCHITECTURE
===

Use Supabase Storage ONLY.

Suggested buckets:
edupath-resumes
edupath-proof
edupath-projects
edupath-assets

If a single bucket is simpler, use folders:
resumes/
proof/
projects/
assets/

Store only metadata in PostgreSQL:

* storage path
* original filename
* MIME type
* size
* owner
* uploaded\_at

Generate signed URLs from backend.

Never expose the Supabase service role key.

==================================================
53. PRODUCT INTELLIGENCE PRINCIPLE
===

Do not make AI responsible for everything.

Use AI for:

* understanding messy text
* extracting skills
* interpreting resumes
* generating challenges
* evaluating proof
* generating explanations
* natural-language interaction

Use deterministic application logic for:

* permissions
* authentication
* state transitions
* database integrity
* skill calculations
* roadmap state
* completion state
* validation
* file handling

This separation is intentional.

==================================================
54. CODE QUALITY
===

Use:

* TypeScript strict mode
* clear interfaces/types
* modular services
* reusable components
* meaningful naming
* small functions
* centralized configuration
* no duplicated business logic

Avoid:

* giant files
* giant React components
* business logic inside JSX
* duplicated API calls
* direct database access from controllers
* direct LLM calls throughout the codebase

==================================================
55. README
===

Create a strong README explaining:

1. Problem
2. Solution
3. Product story
4. Core agent loop
5. Architecture
6. Tech stack
7. Database design
8. AI architecture
9. Supabase Storage usage
10. UI design system
11. Setup
12. Environment variables
13. Running locally
14. Demo flow
15. Future roadmap

Explain WHY each major technology exists.

==================================================
56. ARCHITECTURE DOCUMENT
===

Create:

docs/architecture.md

Explain:

Frontend
→ API
→ Services
→ Agent
→ AI
→ Database
→ Storage

Include an ASCII architecture diagram.

==================================================
57. DESIGN SYSTEM DOCUMENT
===

Create:

docs/design-system.md

Document:

* color tokens
* typography
* spacing
* grid
* borders
* button styles
* card styles
* status styles
* chart styles
* skill graph styles
* responsive rules
* accessibility rules

The entire application should use these tokens rather than random
one-off styling.

==================================================
58. DEMO SCRIPT
===

Create:

docs/demo-script.md

Demo opening:

"Most learning platforms tell you what to learn.
EduPath tells you what you need to prove next."

Then:

1. User profile
2. Career goal
3. Skill system
4. Skill gap
5. Next Best Action
6. Challenge
7. Proof submission
8. AI evaluation
9. Skill confidence update
10. Roadmap replan

End with:

"EduPath doesn't just help users learn.
It continuously turns learning into evidence of ability."

==================================================
59. HACKATHON EVALUATOR THINKING
===

Build with these questions in mind:

Can a judge understand the problem immediately?

Can they see why this is different from a chatbot?

Can they see actual agent behavior?

Can they see personalized reasoning?

Can they see measurable user progress?

Can they see proof rather than claims?

Can they understand why AI is necessary?

Can they understand the technical architecture?

Can they see that the MVP is actually buildable?

Can the team explain every major technical decision?

Avoid fake complexity.

Depth is more valuable than feature count.

==================================================
60. VISUAL QUALITY GATE
===

Before declaring UI complete, verify:

\[ ] Strong editorial grid
\[ ] Consistent alignment
\[ ] Off-white paper-like background
\[ ] Near-black primary text
\[ ] One controlled electric-blue accent
\[ ] Strong headline typography
\[ ] Technical micro-labels
\[ ] Thin structural rules
\[ ] Minimal rounded surfaces
\[ ] No excessive shadows
\[ ] No glassmorphism
\[ ] No neon gradients
\[ ] No generic purple AI aesthetic
\[ ] No excessive pills
\[ ] No decorative clutter
\[ ] Responsive grid
\[ ] Accessible contrast
\[ ] Keyboard navigation
\[ ] Clear focus states
\[ ] Loading/empty/error states match the design system

==================================================
61. FINAL EVALUATOR TEST
===

Pretend you are a hackathon judge seeing this for the first time.

Within 60 seconds, determine whether you can answer:

1. What problem does EduPath solve?
2. Who is it for?
3. What makes it different?
4. Where is the AI?
5. Where is the agent?
6. What evidence does the user produce?
7. How does the system adapt?
8. What is technically interesting?
9. Can the team realistically build it?
10. Can the demo prove the core value?

If any answer is unclear, improve the product before adding more features.

==================================================
62. FINAL PRODUCT POSITIONING
===

Do NOT position EduPath as:

"AI-powered personalized learning platform."

That is too generic.

Position it as:

"An AI career navigation agent that continuously turns a user's
career goal into skill gaps, skill gaps into practical work,
and practical work into verified proof of ability."

==================================================
63. DEVELOPMENT BEHAVIOR
===

Before writing large amounts of code:

1. Inspect the existing project.
2. Understand its structure.
3. Preserve useful existing work.
4. Do not unnecessarily rewrite working code.
5. Establish the folder structure.
6. Configure TypeScript.
7. Configure database.
8. Configure Drizzle.
9. Configure Supabase Storage.
10. Configure authentication.
11. Establish the editorial design system.
12. Build the core product loop.
13. Test it.
14. Fix errors.
15. Improve UI.
16. Add secondary features.

Do not create fake placeholder functionality merely to make the UI
look complete.

If a feature is not implemented, represent its state honestly.

==================================================
64. FINAL QUALITY GATE
===

Before declaring the project complete, verify:

\[ ] Frontend runs
\[ ] Backend runs
\[ ] PostgreSQL connects
\[ ] Drizzle migrations work
\[ ] Seed data works
\[ ] Registration works
\[ ] Login works
\[ ] JWT protection works
\[ ] Profile works
\[ ] Resume upload works
\[ ] Supabase Storage works
\[ ] Career goal works
\[ ] Skill graph works
\[ ] Skill gaps are personalized
\[ ] Next Best Action is personalized
\[ ] Challenge generation works
\[ ] Proof submission works
\[ ] AI evaluation works
\[ ] AI output is validated
\[ ] Skill confidence updates
\[ ] Roadmap replans
\[ ] Dashboard reflects changes
\[ ] Error states work
\[ ] Mobile layout works
\[ ] Editorial design system is consistent
\[ ] No secrets committed
\[ ] No frontend database credentials
\[ ] No Supabase database dependency
\[ ] No direct arbitrary LLM database access
\[ ] README works
\[ ] Architecture documentation works
\[ ] Design system documentation works
\[ ] Demo script works

==================================================
65. FINAL RULE
===

DO NOT optimize for number of features.

Optimize for:

CLARITY
+
PERSONALIZATION
+
AGENT BEHAVIOR
+
PROOF OF WORK
+
MEASURABLE PROGRESS
+
TECHNICAL CREDIBILITY
+
EDITORIAL VISUAL IDENTITY
+
DEMO QUALITY

The final product must feel like:

"An intelligent career navigation system"

with the visual language of:

"An AI systems research publication turned into an interactive product."

It must NOT feel like:

"ChatGPT wrapped in a dashboard."

Build the smallest complete version of the vision,
then polish it until it feels production-quality.

