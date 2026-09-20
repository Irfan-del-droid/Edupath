import app from './app.js';
import { config } from './config/index.js';
import { getDb } from './db/index.js';
import { seedDatabase } from './db/seed.js';

async function startServer() {
  try {
    const server = app.listen(config.port, () => {
      console.log(`==================================================`);
      console.log(`🚀 EduPath Backend Running on port ${config.port}`);
      console.log(`🎯 API Base: /api`);
      console.log(`💡 Demo Account: irfan@edupath.ai / password123`);
      console.log(`==================================================`);
    });

    console.log('⚡ Initializing EduPath backend database...');
    await getDb();

    // Auto-seed demo persona Irfan on first launch
    try {
      await seedDatabase();
    } catch (seedErr) {
      console.warn('⚠️ Seeding warning (non-fatal):', seedErr);
    }

    // Keep-alive ping every 14 minutes to prevent Render free tier sleep
    if (config.nodeEnv === 'production') {
      const RENDER_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${config.port}`;
      setInterval(async () => {
        try {
          const res = await fetch(`${RENDER_URL}/health`);
          console.log(`[keep-alive] ping -> ${res.status}`);
        } catch (e: any) {
          console.warn('[keep-alive] ping failed:', e.message);
        }
      }, 14 * 60 * 1000); // 14 minutes
      console.log('🏓 Keep-alive ping enabled (every 14 min)');
    }

    const shutdown = () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('Server terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
}

startServer();
