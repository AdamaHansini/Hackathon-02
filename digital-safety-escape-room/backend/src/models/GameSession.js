import { createDocumentModel } from '../config/db.js';

/**
 * GameSession Model
 * Fields:
 * - _id: string
 * - userId: string
 * - challengeIds: string[]
 * - currentChallengeIndex: number
 * - score: number
 * - lives: number (starts at 3)
 * - correctAnswers: number
 * - wrongAnswers: number
 * - status: 'IN_PROGRESS' | 'COMPLETED' | 'GAME_OVER' | 'ABANDONED'
 * - percentage: number
 * - badge: string
 * - categoryBreakdown: object
 * - startedAt: Date
 * - completedAt: Date
 */
export const GameSession = createDocumentModel('gamesessions');
