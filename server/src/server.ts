import app from './app.js';
import { config } from './config/index.js';
import { getDb } from './db/index.js';
import { seedDatabase } from './db/seed.js';

async function startServer() {
  try {
    console.log('⚡ Initializing EduPath backend systems...');
    await getDb();

    // Auto-seed demo persona Irfan on first launch
    await seedDatabase();

    const server = app.listen(config.port, () => {
      console.log(`==================================================`);
      console.log(`🚀 EduPath Backend Running on http://localhost:${config.port}`);
      console.log(`🎯 API Base: http://localhost:${config.port}/api`);
      console.log(`💡 Demo Account: irfan@edupath.ai / password123`);
      console.log(`==================================================`);
    });

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
