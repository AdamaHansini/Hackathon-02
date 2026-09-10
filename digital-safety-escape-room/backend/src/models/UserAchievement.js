import { createDocumentModel } from '../config/db.js';

/**
 * UserAchievement Model
 * Fields:
 * - _id: string
 * - userId: string
 * - achievementCode: string
 * - name: string
 * - description: string
 * - icon: string
 * - earnedAt: Date
 */
export const UserAchievement = createDocumentModel('userachievements');
