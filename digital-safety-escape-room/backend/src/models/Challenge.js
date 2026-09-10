import { createDocumentModel } from '../config/db.js';

/**
 * Challenge Model
 * Fields:
 * - _id: string
 * - title: string
 * - category: 'PHISHING' | 'PASSWORD' | 'FAKE_QR' | 'SCAM_MESSAGE'
 * - scenario: string
 * - question: string
 * - options: string[]
 * - correctAnswer: string
 * - explanation: string
 * - warningSigns: string[]
 * - difficulty: 'EASY' | 'MEDIUM' | 'HARD'
 * - points: number
 * - active: boolean
 * - createdBy: string
 * - metadata: object (optional UI details like emailSender, mockUrl, smsSender, etc.)
 * - createdAt: Date
 * - updatedAt: Date
 */
export const Challenge = createDocumentModel('challenges');
