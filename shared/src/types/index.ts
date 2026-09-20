export type UserRole = 'student' | 'early_career' | 'career_changer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  currentRole: string;
  experienceYears: number;
  education: string;
  resumeUrl?: string | null;
  weeklyHoursAvailable: number;
  completeness: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
}

export type CareerStatus = 'active' | 'exploring' | 'completed';

export interface CareerGoal {
  id: string;
  userId: string;
  targetRole: string; // e.g. "AI Product Manager"
  targetLevel: string; // e.g. "Mid-Level" or "Associate"
  timelineWeeks: number; // e.g. 12
  status: CareerStatus;
  createdAt: string;
  updatedAt: string;
}

export type SkillCategory =
  | 'Product Discovery'
  | 'Product Strategy'
  | 'AI Core'
  | 'Analytics & Data'
  | 'Execution & Delivery';

export type SkillProficiency = 'none' | 'developing' | 'competent' | 'strong' | 'expert';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  targetLevel: number; // 1 to 5
  weight: number; // importance weight 1.0 - 2.0
}

export interface SkillDependency {
  id: string;
  skillId: string;
  prerequisiteSkillId: string;
  dependencyType: 'strict' | 'recommended';
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  currentLevel: number; // 0 to 5
  confidenceScore: number; // 0 - 100%
  verifiedEvidenceCount: number;
  status: 'verified' | 'in_progress' | 'unassessed';
  lastAssessedAt?: string | null;
}

export type GapPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface SkillGap {
  id: string;
  userId: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  currentLevel: number;
  targetLevel: number;
  confidenceScore: number;
  gapSize: number; // target - current
  priority: GapPriority;
  rationale: string;
  prerequisitesMet: boolean;
  estimatedHoursToClose: number;
}

export interface NextBestAction {
  id: string;
  title: string;
  rationale: string;
  targetSkillId: string;
  targetSkillName: string;
  challengeId: string;
  estimatedMinutes: number;
  impactLevel: 'Critical' | 'High' | 'Medium';
  actionType: 'challenge' | 'course' | 'project_review';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Challenge {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  slug: string;
  description: string;
  scenario: string;
  prompt: string;
  expectedDeliverables: string[];
  starterTemplate: string;
  rubric: EvaluationRubric;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
}

export interface EvaluationRubric {
  criteria: Array<{
    name: string;
    maxScore: number;
    description: string;
  }>;
}

export type ProofSubmissionType = 'text' | 'document' | 'github_url' | 'prototype_url';

export interface ProofOfWork {
  id: string;
  userId: string;
  challengeId: string;
  skillId: string;
  title: string;
  submissionType: ProofSubmissionType;
  content: string; // text body or markdown
  fileUrl?: string | null;
  fileName?: string | null;
  status: 'submitted' | 'evaluated' | 'revision_requested';
  submittedAt: string;
  evaluation?: AIEvaluation | null;
}

export interface AIEvaluation {
  id: string;
  proofId: string;
  overallScore: number; // 0 - 100
  structureScore: number; // 0 - 100
  depthScore: number; // 0 - 100
  practicalityScore: number; // 0 - 100
  strengths: string[];
  weaknesses: string[];
  missingElements: string[];
  recommendations: string[];
  skillConfidenceDelta: number; // e.g. +37%
  nextActionTitle: string;
  nextActionReason: string;
  evaluatedAt: string;
}

export interface RoadmapItem {
  id: string;
  roadmapId: string;
  weekNumber: number;
  orderIndex: number;
  skillId: string;
  skillName: string;
  title: string;
  objective: string;
  estimatedMinutes: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  isNextBestAction: boolean;
  evidenceRequired: boolean;
}

export interface Roadmap {
  id: string;
  userId: string;
  careerGoalId: string;
  title: string;
  version: number;
  generatedAt: string;
  updatedAt: string;
  items: RoadmapItem[];
}

export interface CareerReadiness {
  userId: string;
  overallScore: number; // 0 - 100%
  skillsVerifiedCount: number;
  totalRequiredSkills: number;
  proofArtifactsCount: number;
  projectsCount: number;
  interviewReadinessScore: number;
  criticalGapsCount: number;
  breakdown: {
    productDiscovery: number;
    aiTechnicalDepth: number;
    analyticsAndMetrics: number;
    agentArchitecture: number;
  };
}

export interface DashboardData {
  user: User;
  profile: UserProfile;
  careerGoal: CareerGoal;
  readiness: CareerReadiness;
  userSkills: UserSkill[];
  topGaps: SkillGap[];
  nextBestAction: NextBestAction;
  activeRoadmap: Roadmap;
  recentProof: ProofOfWork[];
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  stateContext?: {
    currentGap?: string;
    suggestedAction?: string;
  };
}
