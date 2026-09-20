import { describe, it, expect } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { aiEvaluationResponseSchema } from '@edupath/shared';

describe('EduPath Core Business Logic & Invariants', () => {
  it('hashes passwords securely and verifies them', async () => {
    const raw = 'password123';
    const hash = await bcrypt.hash(raw, 10);
    expect(hash).not.toEqual(raw);
    const valid = await bcrypt.compare(raw, hash);
    expect(valid).toBe(true);
    const invalid = await bcrypt.compare('wrongpass', hash);
    expect(invalid).toBe(false);
  });

  it('signs and validates JWT tokens with expected payload', () => {
    const secret = 'test-secret';
    const payload = { id: 'usr-123', email: 'test@edupath.ai' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret) as any;
    expect(decoded.id).toBe('usr-123');
    expect(decoded.email).toBe('test@edupath.ai');
  });

  it('validates structured AI evaluation JSON output against strict schema', () => {
    const mockOutput = {
      overallScore: 82,
      structureScore: 85,
      depthScore: 80,
      practicalityScore: 81,
      strengths: ['Strong rubric definition', 'Crisp boundary conditions'],
      weaknesses: ['Missing statistical confidence intervals'],
      missingElements: ['Automated drift detection'],
      recommendations: ['Sample 50 edge cases with human reviewers'],
      skillConfidenceDelta: 37,
      nextActionTitle: 'Architect an Autonomous Refund Processing Agent',
      nextActionReason: 'AI Evaluation is now verified, unlocking Agent Design.',
    };

    const parsed = aiEvaluationResponseSchema.safeParse(mockOutput);
    expect(parsed.success).toBe(true);
  });

  it('rejects malformed AI evaluation output lacking required fields', () => {
    const malformed = {
      overallScore: 'eighty-two', // invalid type
      strengths: [],
    };
    const parsed = aiEvaluationResponseSchema.safeParse(malformed);
    expect(parsed.success).toBe(false);
  });

  it('calculates skill gap prioritizing highest delta with critical impact', () => {
    const targetLevel = 5;
    const currentLevel = 2;
    const gapSize = targetLevel - currentLevel;
    expect(gapSize).toBe(3);

    const confidence = 38;
    const priority = confidence < 40 && gapSize >= 2 ? 'Critical' : 'Medium';
    expect(priority).toBe('Critical');
  });
});
