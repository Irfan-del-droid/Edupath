import { getDb } from '../../db/index.js';
import * as schema from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { aiProvider } from '../ai/aiProvider.js';

export class ProfileService {
  async getProfileByUserId(userId: string) {
    const db = await getDb();
    const rows = await db.select().from(schema.profiles).where(eq(schema.profiles.userId, userId));
    return rows[0] || null;
  }

  async updateProfile(userId: string, data: any) {
    const db = await getDb();
    await db
      .update(schema.profiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.profiles.userId, userId));

    return this.getProfileByUserId(userId);
  }

  async processResumeText(userId: string, resumeText: string, resumeUrl?: string) {
    const db = await getDb();
    const extracted = await aiProvider.extractResumeData(resumeText);

    await db
      .update(schema.profiles)
      .set({
        resumeUrl: resumeUrl || undefined,
        completeness: 95,
        updatedAt: new Date(),
      })
      .where(eq(schema.profiles.userId, userId));

    return {
      extracted,
      resumeUrl,
    };
  }
}

export const profileService = new ProfileService();
