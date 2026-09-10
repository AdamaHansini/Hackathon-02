import { createDocumentModel } from '../config/db.js';

/**
 * Achievement Model
 * Fields:
 * - _id: string
 * - code: string
 * - name: string
 * - description: string
 * - icon: string
 * - condition: string
 */
export const Achievement = createDocumentModel('achievements');
