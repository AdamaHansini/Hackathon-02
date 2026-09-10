/**
 * MongoDB Administrator Document Configuration
 * 
 * IMPORTANT SECURITY POLICY:
 * Admin accounts CANNOT be created or registered through the public web interface or registration API.
 * Administrator credentials must be defined directly within MongoDB documents (in the 'users' collection).
 */

export const DIRECT_MONGO_ADMIN_DOCUMENT = {
  name: 'System Admin',
  email: 'admin@gmail.com',
  // bcrypt hash for default password 'admin@123' (10 salt rounds)
  password: process.env.ADMIN_PASSWORD_HASH || '$2b$10$oLLjN7W5dVaO7C04.5zK8ebtft9y4ppd6n7a82MWECA.D8t4hclkW',
  role: 'admin',
  gamesPlayed: 12,
  gamesCompleted: 11,
  bestScore: 95,
  averageScore: 88,
  accuracy: 92,
  badges: ['CYBER SAFETY EXPERT'],
  achievements: [
    'PHISHING_HUNTER',
    'PASSWORD_GUARDIAN',
    'QR_DETECTIVE',
    'SCAM_SPOTTER',
    'CYBER_SAFETY_EXPERT',
    'FLAWLESS_ESCAPE'
  ],
  createdAt: '2026-09-10T00:00:00.000Z',
  updatedAt: '2026-09-10T00:00:00.000Z'
};
