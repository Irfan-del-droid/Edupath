import { pgTable, text, integer, timestamp, uuid, boolean, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('student'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  headline: text('headline').default(''),
  bio: text('bio').default(''),
  currentRole: text('current_job_title').default('Student'),
  experienceYears: integer('experience_years').default(0),
  education: text('education').default(''),
  resumeUrl: text('resume_url'),
  weeklyHoursAvailable: integer('weekly_hours_available').default(15),
  completeness: integer('completeness').default(50),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const careerGoals = pgTable('career_goals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetRole: text('target_role').notNull().default('AI Product Manager'),
  targetLevel: text('target_level').notNull().default('Mid-Level'),
  timelineWeeks: integer('timeline_weeks').notNull().default(12),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const skills = pgTable('skills', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  targetLevel: integer('target_level').notNull().default(4),
  weight: integer('weight').notNull().default(1),
});

export const skillDependencies = pgTable('skill_dependencies', {
  id: text('id').primaryKey(),
  skillId: text('skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
  prerequisiteSkillId: text('prerequisite_skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
  dependencyType: text('dependency_type').notNull().default('strict'),
});

export const userSkills = pgTable('user_skills', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  skillId: text('skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
  currentLevel: integer('current_level').notNull().default(1),
  confidenceScore: integer('confidence_score').notNull().default(20),
  verifiedEvidenceCount: integer('verified_evidence_count').notNull().default(0),
  status: text('status').notNull().default('in_progress'), // 'verified' | 'in_progress' | 'unassessed'
  lastAssessedAt: timestamp('last_assessed_at'),
});

export const skillGaps = pgTable('skill_gaps', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  skillId: text('skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
  currentLevel: integer('current_level').notNull(),
  targetLevel: integer('target_level').notNull(),
  confidenceScore: integer('confidence_score').notNull(),
  gapSize: integer('gap_size').notNull(),
  priority: text('priority').notNull(), // 'Critical' | 'High' | 'Medium' | 'Low'
  rationale: text('rationale').notNull(),
  prerequisitesMet: boolean('prerequisites_met').notNull().default(true),
  estimatedHoursToClose: integer('estimated_hours_to_close').notNull().default(10),
});

export const roadmaps = pgTable('roadmaps', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  careerGoalId: text('career_goal_id').notNull().references(() => careerGoals.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  version: integer('version').notNull().default(1),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const roadmapItems = pgTable('roadmap_items', {
  id: text('id').primaryKey(),
  roadmapId: text('roadmap_id').notNull().references(() => roadmaps.id, { onDelete: 'cascade' }),
  weekNumber: integer('week_number').notNull(),
  orderIndex: integer('order_index').notNull(),
  skillId: text('skill_id').notNull().references(() => skills.id),
  title: text('title').notNull(),
  objective: text('objective').notNull(),
  estimatedMinutes: integer('estimated_minutes').notNull().default(45),
  status: text('status').notNull().default('pending'), // 'pending' | 'in_progress' | 'completed' | 'skipped'
  isNextBestAction: boolean('is_next_best_action').notNull().default(false),
  evidenceRequired: boolean('evidence_required').notNull().default(true),
});

export const challenges = pgTable('challenges', {
  id: text('id').primaryKey(),
  skillId: text('skill_id').notNull().references(() => skills.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  scenario: text('scenario').notNull(),
  prompt: text('prompt').notNull(),
  expectedDeliverablesJson: text('expected_deliverables_json').notNull(),
  starterTemplate: text('starter_template').notNull(),
  rubricJson: text('rubric_json').notNull(),
  difficulty: text('difficulty').notNull().default('Intermediate'),
  estimatedMinutes: integer('estimated_minutes').notNull().default(45),
});

export const proofOfWork = pgTable('proof_of_work', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  challengeId: text('challenge_id').notNull().references(() => challenges.id),
  skillId: text('skill_id').notNull().references(() => skills.id),
  title: text('title').notNull(),
  submissionType: text('submission_type').notNull().default('text'),
  content: text('content').notNull(),
  fileUrl: text('file_url'),
  fileName: text('file_name'),
  status: text('status').notNull().default('submitted'), // 'submitted' | 'evaluated' | 'revision_requested'
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

export const evaluations = pgTable('evaluations', {
  id: text('id').primaryKey(),
  proofId: text('proof_id').notNull().references(() => proofOfWork.id, { onDelete: 'cascade' }),
  overallScore: integer('overall_score').notNull(),
  structureScore: integer('structure_score').notNull(),
  depthScore: integer('depth_score').notNull(),
  practicalityScore: integer('practicality_score').notNull(),
  strengthsJson: text('strengths_json').notNull(),
  weaknessesJson: text('weaknesses_json').notNull(),
  missingElementsJson: text('missing_elements_json').notNull(),
  recommendationsJson: text('recommendations_json').notNull(),
  skillConfidenceDelta: integer('skill_confidence_delta').notNull().default(0),
  nextActionTitle: text('next_action_title').notNull(),
  nextActionReason: text('next_action_reason').notNull(),
  evaluatedAt: timestamp('evaluated_at').defaultNow().notNull(),
});

export const agentActions = pgTable('agent_actions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  actionType: text('action_type').notNull(),
  payloadJson: text('payload_json').notNull(),
  executedAt: timestamp('executed_at').defaultNow().notNull(),
});

export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default('Career Copilot'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversationMessages = pgTable('conversation_messages', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' | 'assistant' | 'system'
  content: text('content').notNull(),
  stateSnapshotJson: text('state_snapshot_json'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
