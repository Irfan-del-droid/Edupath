import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'early_career', 'career_changer', 'admin']).default('student'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  headline: z.string().optional(),
  bio: z.string().optional(),
  currentRole: z.string().optional(),
  experienceYears: z.number().min(0).optional(),
  education: z.string().optional(),
  weeklyHoursAvailable: z.number().min(1).max(80).optional(),
});

export const createCareerGoalSchema = z.object({
  targetRole: z.string().min(2, 'Target role is required'),
  targetLevel: z.string().default('Mid-Level'),
  timelineWeeks: z.number().min(1).max(52).default(12),
});

export const submitProofSchema = z.object({
  challengeId: z.string().min(1, 'Challenge ID is required'),
  skillId: z.string().min(1, 'Skill ID is required'),
  title: z.string().min(3, 'Title is required'),
  submissionType: z.enum(['text', 'document', 'github_url', 'prototype_url']),
  content: z.string().min(20, 'Content must contain substantial proof/analysis (at least 20 characters)'),
  fileUrl: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
});

export const aiEvaluationResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  structureScore: z.number().min(0).max(100),
  depthScore: z.number().min(0).max(100),
  practicalityScore: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  missingElements: z.array(z.string()).min(1),
  recommendations: z.array(z.string()).min(1),
  skillConfidenceDelta: z.number().min(0).max(100),
  nextActionTitle: z.string(),
  nextActionReason: z.string(),
});

export const copilotChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  conversationId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateCareerGoalInput = z.infer<typeof createCareerGoalSchema>;
export type SubmitProofInput = z.infer<typeof submitProofSchema>;
export type AIEvaluationResponse = z.infer<typeof aiEvaluationResponseSchema>;
export type CopilotChatInput = z.infer<typeof copilotChatSchema>;
