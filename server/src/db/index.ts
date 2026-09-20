import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import path from 'path';
import fs from 'fs';
import * as schema from './schema/index.js';
import { config } from '../config/index.js';

let dbInstance: any = null;
let rawClient: any = null;

export async function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  // Attempt external PostgreSQL connection if DATABASE_URL is configured
  if (config.databaseUrl && !config.databaseUrl.includes('localhost:5432/edupath_fallback')) {
    try {
      const pool = new pg.Pool({
        connectionString: config.databaseUrl,
        ssl: config.databaseUrl.includes('supabase') || config.databaseUrl.includes('neon') ? { rejectUnauthorized: false } : undefined,
        connectionTimeoutMillis: 3000,
      });

      // Quick test query
      const client = await pool.connect();
      client.release();

      rawClient = pool;
      dbInstance = drizzlePg(pool, { schema });
      console.log('✅ Connected to external PostgreSQL via node-postgres');
      await ensureTables(dbInstance, 'postgres');
      return dbInstance;
    } catch (err: any) {
      console.warn('⚠️ External PostgreSQL connection failed, falling back to embedded PGlite WASM Postgres:', err.message);
    }
  }

  // Resilient fallback: Embedded PGlite WASM (Real PostgreSQL running in Node.js)
  const dataDir = path.resolve(process.cwd(), '.pglite_data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const pglite = new PGlite(dataDir);
  await pglite.waitReady;
  rawClient = pglite;
  dbInstance = drizzlePglite(pglite, { schema });
  console.log('✅ Using embedded PGlite WASM PostgreSQL engine (Zero-dependency mode)');
  await ensureTables(dbInstance, 'pglite');

  return dbInstance;
}

export function getRawClient() {
  return rawClient;
}

async function ensureTables(db: any, driver: 'postgres' | 'pglite') {
  const ddl = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      headline TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      current_job_title TEXT DEFAULT 'Student',
      experience_years INTEGER DEFAULT 0,
      education TEXT DEFAULT '',
      resume_url TEXT,
      weekly_hours_available INTEGER DEFAULT 15,
      completeness INTEGER DEFAULT 50,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS career_goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_role TEXT NOT NULL DEFAULT 'AI Product Manager',
      target_level TEXT NOT NULL DEFAULT 'Mid-Level',
      timeline_weeks INTEGER NOT NULL DEFAULT 12,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      target_level INTEGER NOT NULL DEFAULT 4,
      weight INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS skill_dependencies (
      id TEXT PRIMARY KEY,
      skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
      prerequisite_skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
      dependency_type TEXT NOT NULL DEFAULT 'strict'
    );

    CREATE TABLE IF NOT EXISTS user_skills (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
      current_level INTEGER NOT NULL DEFAULT 1,
      confidence_score INTEGER NOT NULL DEFAULT 20,
      verified_evidence_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'in_progress',
      last_assessed_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skill_gaps (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
      current_level INTEGER NOT NULL,
      target_level INTEGER NOT NULL,
      confidence_score INTEGER NOT NULL,
      gap_size INTEGER NOT NULL,
      priority TEXT NOT NULL,
      rationale TEXT NOT NULL,
      prerequisites_met BOOLEAN NOT NULL DEFAULT TRUE,
      estimated_hours_to_close INTEGER NOT NULL DEFAULT 10
    );

    CREATE TABLE IF NOT EXISTS roadmaps (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      career_goal_id TEXT NOT NULL REFERENCES career_goals(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS roadmap_items (
      id TEXT PRIMARY KEY,
      roadmap_id TEXT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
      week_number INTEGER NOT NULL,
      order_index INTEGER NOT NULL,
      skill_id TEXT NOT NULL REFERENCES skills(id),
      title TEXT NOT NULL,
      objective TEXT NOT NULL,
      estimated_minutes INTEGER NOT NULL DEFAULT 45,
      status TEXT NOT NULL DEFAULT 'pending',
      is_next_best_action BOOLEAN NOT NULL DEFAULT FALSE,
      evidence_required BOOLEAN NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      skill_id TEXT NOT NULL REFERENCES skills(id),
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      scenario TEXT NOT NULL,
      prompt TEXT NOT NULL,
      expected_deliverables_json TEXT NOT NULL,
      starter_template TEXT NOT NULL,
      rubric_json TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'Intermediate',
      estimated_minutes INTEGER NOT NULL DEFAULT 45
    );

    CREATE TABLE IF NOT EXISTS proof_of_work (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      challenge_id TEXT NOT NULL REFERENCES challenges(id),
      skill_id TEXT NOT NULL REFERENCES skills(id),
      title TEXT NOT NULL,
      submission_type TEXT NOT NULL DEFAULT 'text',
      content TEXT NOT NULL,
      file_url TEXT,
      file_name TEXT,
      status TEXT NOT NULL DEFAULT 'submitted',
      submitted_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS evaluations (
      id TEXT PRIMARY KEY,
      proof_id TEXT NOT NULL REFERENCES proof_of_work(id) ON DELETE CASCADE,
      overall_score INTEGER NOT NULL,
      structure_score INTEGER NOT NULL,
      depth_score INTEGER NOT NULL,
      practicality_score INTEGER NOT NULL,
      strengths_json TEXT NOT NULL,
      weaknesses_json TEXT NOT NULL,
      missing_elements_json TEXT NOT NULL,
      recommendations_json TEXT NOT NULL,
      skill_confidence_delta INTEGER NOT NULL DEFAULT 0,
      next_action_title TEXT NOT NULL,
      next_action_reason TEXT NOT NULL,
      evaluated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS agent_actions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      action_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      executed_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'Career Copilot',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS conversation_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      state_snapshot_json TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  if (driver === 'pglite') {
    await rawClient.exec(ddl);
  } else {
    await rawClient.query(ddl);
  }
}
