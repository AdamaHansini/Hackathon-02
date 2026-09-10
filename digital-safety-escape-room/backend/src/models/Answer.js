import { createDocumentModel } from '../config/db.js';

/**
 * Answer Model
 * Fields:
 * - _id: string
 * - userId: string
 * - gameId: string
 * - challengeId: string
 * - selectedAnswer: string
 * - correctAnswer: string
 * - isCorrect: boolean
 * - pointsEarned: number
 * - lifeLost: boolean
 * - answeredAt: Date
 */
export const Answer = createDocumentModel('answers');
