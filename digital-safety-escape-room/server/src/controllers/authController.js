import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const normalizedEmail = email.toLowerCase().trim();

      // Prohibit admin registration: admin credentials must be provided directly in MongoDB documents
      if (
        (req.body.role && req.body.role.toLowerCase() === 'admin') ||
        normalizedEmail === 'admin@gmail.com' ||
        normalizedEmail === 'admin@example.com' ||
        normalizedEmail.startsWith('admin@') ||
        normalizedEmail.includes('+admin')
      ) {
        return res.status(403).json({
          success: false,
          message: 'Admin registration is not allowed. Administrator credentials must be configured directly within MongoDB documents.'
        });
      }

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please log in.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'user',
        gamesPlayed: 0,
        gamesCompleted: 0,
        bestScore: 0,
        averageScore: 0,
        accuracy: 0,
        badges: [],
        achievements: []
      });

      const token = generateToken(newUser._id, newUser.role);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Welcome to the Escape Room!',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          gamesPlayed: newUser.gamesPlayed,
          gamesCompleted: newUser.gamesCompleted,
          bestScore: newUser.bestScore,
          averageScore: newUser.averageScore,
          accuracy: newUser.accuracy,
          badges: newUser.badges,
          achievements: newUser.achievements
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken(user._id, user.role);

      res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          gamesPlayed: user.gamesPlayed || 0,
          gamesCompleted: user.gamesCompleted || 0,
          bestScore: user.bestScore || 0,
          averageScore: user.averageScore || 0,
          accuracy: user.accuracy || 0,
          badges: user.badges || [],
          achievements: user.achievements || []
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          gamesPlayed: user.gamesPlayed || 0,
          gamesCompleted: user.gamesCompleted || 0,
          bestScore: user.bestScore || 0,
          averageScore: user.averageScore || 0,
          accuracy: user.accuracy || 0,
          badges: user.badges || [],
          achievements: user.achievements || []
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res) {
    res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  }
};
