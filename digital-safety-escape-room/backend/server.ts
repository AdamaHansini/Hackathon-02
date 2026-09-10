import express from 'express';
import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import { seedDatabase } from './src/data/seedData.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import challengeRoutes from './src/routes/challengeRoutes.js';
import gameRoutes from './src/routes/gameRoutes.js';
import resultRoutes from './src/routes/resultRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import { resultController } from './src/controllers/resultController.js';
import { errorHandler } from './src/middleware/errorMiddleware.js';

const PORT = Number(process.env.PORT) || 3000;
async function startServer() {
  const app = express();

  // Basic Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS Headers
  app.use((req, res, next) => {
    const allowedOrigin = process.env.CLIENT_URL || '*';
    res.header('Access-Control-Allow-Origin', allowedOrigin);
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Digital Safety Escape Room server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal Server Boot Error:', err);
});
