import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './index.js';
import * as schema from './schema/index.js';
import { AI_PM_SKILLS, SKILL_DEPENDENCIES, CORE_CHALLENGES } from '@edupath/shared';

export async function seedDatabase() {
  const db = await getDb();
  console.log('🌱 Seeding EduPath database with demo persona Irfan (AI Product Manager)...');

  // Check if skills already exist
  const existingSkills = await db.select().from(schema.skills);
  if (existingSkills.length === 0) {
    console.log('📦 Seeding skill taxonomy...');
    for (const skill of AI_PM_SKILLS) {
      await db.insert(schema.skills).values({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        description: skill.description,
        targetLevel: skill.targetLevel,
        weight: Math.round(skill.weight),
      });
    }

    console.log('🔗 Seeding skill dependencies...');
    for (const dep of SKILL_DEPENDENCIES) {
      await db.insert(schema.skillDependencies).values({
        id: dep.id,
        skillId: dep.skillId,
        prerequisiteSkillId: dep.prerequisiteSkillId,
        dependencyType: dep.dependencyType,
      });
    }
  }

  // Check if challenges already exist
  const existingChallenges = await db.select().from(schema.challenges);
  if (existingChallenges.length === 0) {
    console.log('🎯 Seeding core practical challenges...');
    for (const chal of CORE_CHALLENGES) {
      await db.insert(schema.challenges).values({
        id: chal.id,
        skillId: chal.skillId,
        title: chal.title,
        slug: chal.slug,
        description: chal.description,
        scenario: chal.scenario,
        prompt: chal.prompt,
        expectedDeliverablesJson: JSON.stringify(chal.expectedDeliverables),
        starterTemplate: chal.starterTemplate,
        rubricJson: JSON.stringify(chal.rubric),
        difficulty: chal.difficulty,
        estimatedMinutes: chal.estimatedMinutes,
      });
    }
  }

  // Check if demo user Irfan exists
  const demoEmail = 'irfan@edupath.ai';
  const existingUsers = await db.select().from(schema.users);
  const existingDemoUser = existingUsers.find((u: any) => u.email === demoEmail);

  if (!existingDemoUser) {
    console.log('👤 Creating demo user Irfan...');
    const userId = 'usr-irfan-demo';
    const passwordHash = await bcrypt.hash('password123', 10);

    await db.insert(schema.users).values({
      id: userId,
      email: demoEmail,
      passwordHash,
      name: 'Irfan',
      role: 'student',
    });

    await db.insert(schema.profiles).values({
      id: 'prof-irfan-demo',
      userId,
      headline: 'Aspiring AI Product Manager | CS & Business Senior',
      bio: 'Final year university student passionate about AI agents and production LLM systems. Seeking associate / APM roles.',
      currentRole: 'Undergraduate Product Intern',
      experienceYears: 1,
      education: 'B.S. in Computer Science & Cognitive Systems, Expected Dec 2026',
      weeklyHoursAvailable: 15,
      completeness: 85,
    });

    const careerGoalId = 'goal-irfan-aipm';
    await db.insert(schema.careerGoals).values({
      id: careerGoalId,
      userId,
      targetRole: 'AI Product Manager',
      targetLevel: 'Associate / APM',
      timelineWeeks: 12,
      status: 'active',
    });

    // Seed User Skills matching prompt.md specifications:
    // Product Discovery: 86%, PRD: 81%, User Research: 78%
    // Analytics: 61%, AI Fundamentals: 54%, LLM Concepts: 50%
    // AI Evaluation: 38% (Critical Gap), Agent Design: 22% (Critical Gap)
    const userSkillConfigs = [
      { skillId: 'skill-prod-discovery', level: 4, confidence: 86, count: 2, status: 'verified' },
      { skillId: 'skill-prd-writing', level: 4, confidence: 81, count: 2, status: 'verified' },
      { skillId: 'skill-user-research', level: 3, confidence: 78, count: 1, status: 'verified' },
      { skillId: 'skill-analytics', level: 3, confidence: 61, count: 1, status: 'in_progress' },
      { skillId: 'skill-ai-fundamentals', level: 3, confidence: 54, count: 1, status: 'in_progress' },
      { skillId: 'skill-llm-concepts', level: 3, confidence: 50, count: 1, status: 'in_progress' },
      { skillId: 'skill-ai-evaluation', level: 2, confidence: 38, count: 0, status: 'in_progress' }, // CRITICAL GAP
      { skillId: 'skill-agent-design', level: 1, confidence: 22, count: 0, status: 'unassessed' },  // CRITICAL GAP
      { skillId: 'skill-product-strategy', level: 2, confidence: 45, count: 0, status: 'in_progress' },
    ];

    for (const usc of userSkillConfigs) {
      await db.insert(schema.userSkills).values({
        id: `usk-${usc.skillId}`,
        userId,
        skillId: usc.skillId,
        currentLevel: usc.level,
        confidenceScore: usc.confidence,
        verifiedEvidenceCount: usc.count,
        status: usc.status,
        lastAssessedAt: new Date(),
      });
    }

    // Seed Skill Gaps
    const gapConfigs = [
      {
        skillId: 'skill-ai-evaluation',
        currentLevel: 2,
        targetLevel: 5,
        confidence: 38,
        gapSize: 3,
        priority: 'Critical',
        rationale: 'AI Evaluation & Benchmarking is currently your largest verified skill gap for the AI Product Manager role.',
        prereqs: true,
        hours: 12,
      },
      {
        skillId: 'skill-agent-design',
        currentLevel: 1,
        targetLevel: 4,
        confidence: 22,
        gapSize: 3,
        priority: 'Critical',
        rationale: 'Autonomous agent loops require strong foundations in AI evaluation and safety guardrails.',
        prereqs: false,
        hours: 15,
      },
      {
        skillId: 'skill-product-strategy',
        currentLevel: 2,
        targetLevel: 4,
        confidence: 45,
        gapSize: 2,
        priority: 'High',
        rationale: 'Need practical proof demonstrating defensibility, pricing token margins, and foundation model moat economics.',
        prereqs: true,
        hours: 8,
      },
      {
        skillId: 'skill-analytics',
        currentLevel: 3,
        targetLevel: 4,
        confidence: 61,
        gapSize: 1,
        priority: 'Medium',
        rationale: 'Demonstrated basic funnel metrics, but missing complex cohort retention SQL analysis.',
        prereqs: true,
        hours: 6,
      },
    ];

    for (const gc of gapConfigs) {
      await db.insert(schema.skillGaps).values({
        id: `gap-${gc.skillId}`,
        userId,
        skillId: gc.skillId,
        currentLevel: gc.currentLevel,
        targetLevel: gc.targetLevel,
        confidenceScore: gc.confidence,
        gapSize: gc.gapSize,
        priority: gc.priority,
        rationale: gc.rationale,
        prerequisitesMet: gc.prereqs,
        estimatedHoursToClose: gc.hours,
      });
    }

    // Seed Starter Proof of Work (Perplexity Teardown)
    const proofId = 'proof-sample-teardown';
    await db.insert(schema.proofOfWork).values({
      id: proofId,
      userId,
      challengeId: 'chal-ai-eval-framework',
      skillId: 'skill-ai-fundamentals',
      title: 'AI Search Engine Architecture & Latency Teardown',
      submissionType: 'text',
      content: `# Perplexity Architecture & Latency Teardown
Author: Irfan

Analyzed index retrieval, web-search summarization pipelines, and hallucination guardrails. Benchmarked latency tradeoffs across streaming tokens vs speculative decoding...`,
      status: 'evaluated',
    });

    await db.insert(schema.evaluations).values({
      id: 'eval-sample-teardown',
      proofId,
      overallScore: 82,
      structureScore: 85,
      depthScore: 80,
      practicalityScore: 81,
      strengthsJson: JSON.stringify([
        'Strong technical clarity on vector index vs live web retrieval tradeoffs',
        'Realistic understanding of latency vs context-window costs',
      ]),
      weaknessesJson: JSON.stringify([
        'Lacks quantifiable golden set evaluation metrics for search citation accuracy',
      ]),
      missingElementsJson: JSON.stringify([
        'Statistical confidence intervals for hallucination rates',
      ]),
      recommendationsJson: JSON.stringify([
        'Complete the AI Evaluation & Benchmarking challenge to demonstrate formal test rubric mastery',
      ]),
      skillConfidenceDelta: 24,
      nextActionTitle: 'Design an AI Evaluation Framework for a Customer-Support Agent',
      nextActionReason: 'AI Evaluation is your largest verified gap for AI Product Management.',
    });

    // Seed 4-week Roadmap
    const roadmapId = 'rdm-irfan-active';
    await db.insert(schema.roadmaps).values({
      id: roadmapId,
      userId,
      careerGoalId,
      title: '30-Day AI PM Acceleration Roadmap',
      version: 1,
    });

    const roadmapItemsList = [
      {
        weekNumber: 1,
        orderIndex: 1,
        skillId: 'skill-ai-evaluation',
        title: 'Design an AI Evaluation Framework for Customer-Support Agent',
        objective: 'Construct golden test set, LLM-as-a-judge rubric, and release gate policies.',
        estimatedMinutes: 45,
        status: 'in_progress',
        isNextBestAction: true,
      },
      {
        weekNumber: 1,
        orderIndex: 2,
        skillId: 'skill-ai-evaluation',
        title: 'Calibrate LLM-as-a-Judge against 50 Adversarial Injections',
        objective: 'Measure inter-annotator agreement between human reviewers and judge model.',
        estimatedMinutes: 60,
        status: 'pending',
        isNextBestAction: false,
      },
      {
        weekNumber: 2,
        orderIndex: 1,
        skillId: 'skill-agent-design',
        title: 'Architect Autonomous Refund Agent State Machine',
        objective: 'Draft tool specifications, escalation thresholds, and idempotency guarantees.',
        estimatedMinutes: 60,
        status: 'pending',
        isNextBestAction: false,
      },
      {
        weekNumber: 3,
        orderIndex: 1,
        skillId: 'skill-product-strategy',
        title: 'Model Enterprise Token Margin & Defensibility Moats',
        objective: 'Calculate gross margins across cached prompts and fine-tuned open weights.',
        estimatedMinutes: 50,
        status: 'pending',
        isNextBestAction: false,
      },
      {
        weekNumber: 4,
        orderIndex: 1,
        skillId: 'skill-analytics',
        title: 'Cohort Retention & Token Churn Analysis in SQL',
        objective: 'Write analytical queries analyzing active agent session dropoffs.',
        estimatedMinutes: 40,
        status: 'pending',
        isNextBestAction: false,
      },
    ];

    for (let i = 0; i < roadmapItemsList.length; i++) {
      const item = roadmapItemsList[i];
      await db.insert(schema.roadmapItems).values({
        id: `rdm-item-${i + 1}`,
        roadmapId,
        weekNumber: item.weekNumber,
        orderIndex: item.orderIndex,
        skillId: item.skillId,
        title: item.title,
        objective: item.objective,
        estimatedMinutes: item.estimatedMinutes,
        status: item.status,
        isNextBestAction: item.isNextBestAction,
        evidenceRequired: true,
      });
    }

    // Seed Starter Copilot conversation
    const convId = 'conv-irfan-init';
    await db.insert(schema.conversations).values({
      id: convId,
      userId,
      title: 'AI Career Onboarding Copilot',
    });

    await db.insert(schema.conversationMessages).values({
      id: 'msg-1',
      conversationId: convId,
      role: 'assistant',
      content: `Welcome Irfan. I have analyzed your background against the AI Product Manager role profile.
Your Product Discovery and PRD Writing foundations are strong (81%+ verified), but your **AI Evaluation & Benchmarking** capability is your primary unverified gap (38% confidence).
To prove job-ready ability, I recommend starting with the customer-support evaluation challenge.`,
    });

    console.log('✅ Demo seed complete! Irfan ready at irfan@edupath.ai / password123');
  } else {
    console.log('ℹ️ Demo user Irfan already exists.');
  }
}

// Allow direct execution
if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase()
    .then(() => {
      console.log('🌱 Seeding process finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
