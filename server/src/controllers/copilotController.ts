import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/index.js';
import * as schema from '../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import { copilotChatSchema } from '@edupath/shared';
import { aiProvider } from '../services/ai/aiProvider.js';
import { agentService } from '../services/agent/agentService.js';
import { skillsService } from '../services/skills/skillsService.js';

export async function chatCopilot(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const parseResult = copilotChatSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parseResult.error.errors[0].message },
      });
      return;
    }

    const { message, conversationId } = parseResult.data;
    const db = await getDb();

    // Get user state context
    const readiness = await agentService.calculateCareerReadiness(userId);
    const nextBestAction = await agentService.calculateNextBestAction(userId);
    const gaps = await skillsService.calculateAndStoreSkillGaps(userId);

    const copilotResponseText = await aiProvider.generateCopilotResponse(
      {
        userName: req.user!.name,
        targetRole: 'AI Product Manager',
        careerReadinessScore: readiness.overallScore,
        criticalGaps: gaps.filter((g) => g.priority === 'Critical').map((g) => g.skillName),
        nextBestActionTitle: nextBestAction.title,
      },
      message
    );

    // Ensure conversation exists
    let activeConvId = conversationId;
    if (!activeConvId) {
      const existingConvs = await db.select().from(schema.conversations).where(eq(schema.conversations.userId, userId)).limit(1);
      if (existingConvs.length > 0) {
        activeConvId = existingConvs[0].id;
      } else {
        activeConvId = `conv-${uuidv4()}`;
        await db.insert(schema.conversations).values({
          id: activeConvId,
          userId,
          title: 'Career Intelligence Copilot',
        });
      }
    }

    // Record user message
    await db.insert(schema.conversationMessages).values({
      id: `msg-${uuidv4()}`,
      conversationId: activeConvId,
      role: 'user',
      content: message,
    });

    // Record assistant message
    const assistantMsgId = `msg-${uuidv4()}`;
    await db.insert(schema.conversationMessages).values({
      id: assistantMsgId,
      conversationId: activeConvId,
      role: 'assistant',
      content: copilotResponseText,
    });

    res.json({
      success: true,
      data: {
        id: assistantMsgId,
        conversationId: activeConvId,
        role: 'assistant',
        content: copilotResponseText,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'COPILOT_ERROR', message: err.message } });
  }
}

export async function getConversationHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const db = await getDb();

    const convs = await db.select().from(schema.conversations).where(eq(schema.conversations.userId, userId));
    if (convs.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    const messages = await db
      .select()
      .from(schema.conversationMessages)
      .where(eq(schema.conversationMessages.conversationId, convs[0].id));

    res.json({
      success: true,
      data: messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.createdAt).toISOString(),
      })),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'HISTORY_ERROR', message: err.message } });
  }
}
