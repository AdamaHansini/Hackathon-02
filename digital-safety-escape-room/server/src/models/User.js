import mongoose from 'mongoose';
import { createDocumentModel } from '../config/db.js';

/**
 * User Mongoose Schema
 * Admin accounts cannot be created via user registration.
 * Admin documents must be provided directly in MongoDB documents.
 */
export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  gamesCompleted: {
    type: Number,
    default: 0
  },
  bestScore: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String
  }],
  achievements: [{
    type: String
  }]
}, {
  timestamps: true
});

export const User = createDocumentModel('users', userSchema);

