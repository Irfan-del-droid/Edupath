import { Skill, SkillDependency, Challenge } from '../types/index.js';

export const AI_PM_SKILLS: Skill[] = [
  {
    id: 'skill-prod-discovery',
    name: 'Product Discovery',
    category: 'Product Discovery',
    description: 'Identifying real user pain points, framing problem statements, and validating early demand.',
    targetLevel: 4,
    weight: 1.5,
  },
  {
    id: 'skill-prd-writing',
    name: 'PRD Writing',
    category: 'Execution & Delivery',
    description: 'Authoring crisp, structured Product Requirement Documents with clear technical and business scope.',
    targetLevel: 4,
    weight: 1.4,
  },
  {
    id: 'skill-user-research',
    name: 'User Research',
    category: 'Product Discovery',
    description: 'Conducting user interviews, synthesizing feedback, and formulating behavioral user journeys.',
    targetLevel: 4,
    weight: 1.2,
  },
  {
    id: 'skill-analytics',
    name: 'Product Analytics & SQL',
    category: 'Analytics & Data',
    description: 'Instrumenting funnels, defining core metrics (North Star, LTV, Retention), and executing analytical SQL queries.',
    targetLevel: 4,
    weight: 1.3,
  },
  {
    id: 'skill-ai-fundamentals',
    name: 'AI Fundamentals',
    category: 'AI Core',
    description: 'Understanding neural architectures, transformer mechanisms, tokenization, embeddings, and context windows.',
    targetLevel: 4,
    weight: 1.6,
  },
  {
    id: 'skill-llm-concepts',
    name: 'LLM Concepts & Prompting',
    category: 'AI Core',
    description: 'Designing robust system prompts, few-shot conditioning, structured output generation, and guardrails.',
    targetLevel: 4,
    weight: 1.5,
  },
  {
    id: 'skill-ai-evaluation',
    name: 'AI Evaluation & Benchmarking',
    category: 'AI Core',
    description: 'Building evaluation datasets, golden sets, LLM-as-a-judge rubrics, hallucination detection, and benchmark metrics.',
    targetLevel: 5,
    weight: 1.8,
  },
  {
    id: 'skill-agent-design',
    name: 'AI Agent Architecture',
    category: 'AI Core',
    description: 'Architecting multi-step autonomous agent loops (Observe-Reason-Plan-Act), tool calling, and human-in-the-loop workflows.',
    targetLevel: 4,
    weight: 1.7,
  },
  {
    id: 'skill-product-strategy',
    name: 'AI Product Strategy & Moats',
    category: 'Product Strategy',
    description: 'Evaluating proprietary data flywheel advantages, pricing token economies, and defending against foundation model commoditization.',
    targetLevel: 4,
    weight: 1.4,
  },
];

export const SKILL_DEPENDENCIES: SkillDependency[] = [
  {
    id: 'dep-1',
    skillId: 'skill-prd-writing',
    prerequisiteSkillId: 'skill-prod-discovery',
    dependencyType: 'strict',
  },
  {
    id: 'dep-2',
    skillId: 'skill-llm-concepts',
    prerequisiteSkillId: 'skill-ai-fundamentals',
    dependencyType: 'strict',
  },
  {
    id: 'dep-3',
    skillId: 'skill-ai-evaluation',
    prerequisiteSkillId: 'skill-llm-concepts',
    dependencyType: 'strict',
  },
  {
    id: 'dep-4',
    skillId: 'skill-agent-design',
    prerequisiteSkillId: 'skill-ai-evaluation',
    dependencyType: 'strict',
  },
  {
    id: 'dep-5',
    skillId: 'skill-product-strategy',
    prerequisiteSkillId: 'skill-prd-writing',
    dependencyType: 'recommended',
  },
];

export const CORE_CHALLENGES: Challenge[] = [
  {
    id: 'chal-ai-eval-framework',
    skillId: 'skill-ai-evaluation',
    skillName: 'AI Evaluation & Benchmarking',
    title: 'Design an AI Evaluation Framework for a Customer-Support Agent',
    slug: 'ai-evaluation-framework-support-agent',
    description: 'Create a rigorous evaluation rubric and automated golden-set testing protocol for an enterprise tier-1 customer support LLM agent.',
    scenario: 'FinFlow Inc. is deploying an autonomous AI support agent handling credit dispute tickets. Hallucinations or incorrect policy guidance carry regulatory risk. Leadership refuses to launch without a verifiable evaluation framework.',
    prompt: `You are the Lead AI Product Manager. Design the complete AI Evaluation Framework:
1. Define 4 core evaluation dimensions (e.g. Policy Accuracy, Hallucination Rate, Tone/De-escalation, Latency).
2. Detail the Golden Dataset structure (number of test samples, edge cases, adversarial prompts).
3. Specify the automated scoring methodology (LLM-as-a-judge prompt rubric vs deterministic heuristics).
4. Establish the release gate threshold criteria for production deployment.`,
    expectedDeliverables: [
      'Evaluation rubric criteria with scoring scale 1-5',
      'Golden test dataset composition table (minimum 4 edge-case categories)',
      'LLM-as-a-judge system prompt and consensus protocol',
      'Production deployment release gate policy document',
    ],
    starterTemplate: `# AI Evaluation Framework: FinFlow Tier-1 Support Agent
Author: Arjun (Lead AI PM)
Date: September 2026

## 1. Executive Summary & Objective
[State the business stakes, deployment goal, and target failure tolerances]

## 2. Evaluation Dimensions & Scoring Rubrics
### Dimension A: Policy Adherence & Regulatory Compliance
- 5 (Exceptional): ...
- 3 (Borderline): ...
- 1 (Critical Failure): ...

### Dimension B: Factuality & Hallucination Resistance
...

## 3. Golden Test Dataset Composition
| Category | Sample Count | Target Edge Case | Synthetic or Production |
| :--- | :--- | :--- | :--- |
| Disputed Chargeback | 50 | Outdated transaction date | Sanitized Real |
| Adversarial Prompt Injection | 30 | "Ignore previous rules" jailbreak | Synthetic Red-team |

## 4. LLM-as-a-Judge Protocol & Calibration
[Specify evaluator model, judging prompt, and human spot-check sample %]

## 5. Release Gate Deployment Thresholds
[Specify exact numerical pass rates required before deployment]
`,
    rubric: {
      criteria: [
        {
          name: 'Structure & Rigor',
          maxScore: 35,
          description: 'Completeness of rubric dimensions, scoring anchors, and realistic boundary definitions.',
        },
        {
          name: 'Domain Depth & Edge Cases',
          maxScore: 35,
          description: 'Inclusion of adversarial attacks, prompt injection defenses, and specific regulatory financial edge cases.',
        },
        {
          name: 'Operational Practicality',
          maxScore: 30,
          description: 'Clear release gates, realistic evaluator architectures, and latency/cost trade-off considerations.',
        },
      ],
    },
    difficulty: 'Advanced',
    estimatedMinutes: 45,
  },
  {
    id: 'chal-agent-architecture',
    skillId: 'skill-agent-design',
    skillName: 'AI Agent Architecture',
    title: 'Architect an Autonomous Refund Processing Agent',
    slug: 'autonomous-refund-agent-architecture',
    description: 'Design the state machine, tool specifications, and human-in-the-loop escalation gates for an autonomous e-commerce refund agent.',
    scenario: 'ShopEase experiences 40,000 refund requests weekly. You need to architect an autonomous agent that handles eligible standard refunds under $50 while safely escalating high-value or suspicious requests.',
    prompt: `Draft the technical PM spec for the autonomous agent:
1. Define the state transition loop (Observe -> Reason -> Plan -> Act).
2. Write JSON tool definitions for 'query_order_status', 'check_fraud_score', and 'issue_stripe_refund'.
3. Specify strict deterministic guardrails preventing unauthorized transactions.`,
    expectedDeliverables: [
      'Agent state transition diagram / specification',
      'OpenAPI / JSON schemas for 3 external tools',
      'Guardrail policy and escalation triggers matrix',
    ],
    starterTemplate: `# Technical Specification: Autonomous Refund Processing Agent
Author: AI PM
Status: Proposed

## 1. Agent Architecture & Control Loop
...`,
    rubric: {
      criteria: [
        { name: 'Tooling & Interface Specs', maxScore: 35, description: 'Correct JSON tool parameters and error states.' },
        { name: 'Safety & Human-in-the-loop Guardrails', maxScore: 35, description: 'Fraud gates, transaction limits, and fallbacks.' },
        { name: 'State Flow Clarity', maxScore: 30, description: 'Loop termination criteria and idempotency.' },
      ],
    },
    difficulty: 'Advanced',
    estimatedMinutes: 60,
  },
];
