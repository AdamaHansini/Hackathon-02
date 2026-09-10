import express from 'express';
import path from 'path';
import 'dotenv/config';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/src/config/db.js';
import { seedDatabase } from './server/src/data/seedData.js';
import authRoutes from './server/src/routes/authRoutes.js';
import userRoutes from './server/src/routes/userRoutes.js';
import challengeRoutes from './server/src/routes/challengeRoutes.js';
import gameRoutes from './server/src/routes/gameRoutes.js';
import resultRoutes from './server/src/routes/resultRoutes.js';
import adminRoutes from './server/src/routes/adminRoutes.js';
import { resultController } from './server/src/controllers/resultController.js';
import { errorHandler } from './server/src/middleware/errorMiddleware.js';

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  // Basic Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS Headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Connect & Seed Document DB
  await connectDB();
  await seedDatabase();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Digital Safety Escape Room Backend'
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/challenges', challengeRoutes);
  app.use('/api/games', gameRoutes);
  app.use('/api/game', gameRoutes);
  app.use('/api/results', resultRoutes);
  app.use('/api/admin', adminRoutes);
  app.get('/api/leaderboard', resultController.getLeaderboard);

  // API Error Handler
  app.use('/api', errorHandler);

  // Vite Middleware (development) or Static Serve (production)
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Digital Safety Escape Room server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal Server Boot Error:', err);
});
