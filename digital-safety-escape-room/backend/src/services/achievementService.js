import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { Answer } from '../models/Answer.js';
import { Challenge } from '../models/Challenge.js';
import { User } from '../models/User.js';

export const achievementService = {
  async checkAndAward(userId, session) {
    if (!userId) return [];
    const newlyAwarded = [];

    // Fetch existing user achievements
    const existingUserAchievements = await UserAchievement.find({ userId });
    const existingCodes = new Set(existingUserAchievements.map(ua => ua.achievementCode));

    // Fetch user answers to compute category stats
    const userAnswers = await Answer.find({ userId, isCorrect: true });
    
    // Map answer challenge categories
    let phishingCount = 0;
    let passwordCount = 0;
    let qrCount = 0;
    let scamCount = 0;

    for (const ans of userAnswers) {
      const ch = await Challenge.findById(ans.challengeId);
      if (ch) {
        if (ch.category === 'PHISHING') phishingCount++;
        else if (ch.category === 'PASSWORD') passwordCount++;
        else if (ch.category === 'FAKE_QR') qrCount++;
        else if (ch.category === 'SCAM_MESSAGE') scamCount++;
      }
    }

    const checks = [
      {
        code: 'PHISHING_HUNTER',
        name: 'Phishing Hunter',
        description: 'Correctly identify 5 phishing attempts.',
        icon: 'Fish',
        eligible: phishingCount >= 5
      },
      {
        code: 'PASSWORD_GUARDIAN',
        name: 'Password Guardian',
        description: 'Correctly answer 5 password challenges.',
        icon: 'Lock',
        eligible: passwordCount >= 5
      },
      {
        code: 'QR_DETECTIVE',
        name: 'QR Detective',
        description: 'Correctly identify 5 suspicious QR scenarios.',
        icon: 'QrCode',
        eligible: qrCount >= 5
      },
      {
        code: 'SCAM_SPOTTER',
        name: 'Scam Spotter',
        description: 'Correctly identify 5 scam messages.',
        icon: 'MessageSquareWarning',
        eligible: scamCount >= 5
      },
      {
        code: 'CYBER_SAFETY_EXPERT',
        name: 'Cyber Safety Expert',
        description: 'Achieve 76% or higher on an escape room run.',
        icon: 'Award',
        eligible: session && session.percentage >= 76
      },
      {
        code: 'FLAWLESS_ESCAPE',
        name: 'Flawless Escape',
        description: 'Escape without losing any lives (3/3 hearts intact).',
        icon: 'ShieldCheck',
        eligible: session && session.lives === 3 && session.status === 'COMPLETED'
      },
      {
        code: 'FIRST_ESCAPE',
        name: 'Escape Artist',
        description: 'Successfully unlock and escape the digital safety room.',
        icon: 'Key',
        eligible: session && session.status === 'COMPLETED'
      }
    ];

    for (const check of checks) {
      if (check.eligible && !existingCodes.has(check.code)) {
        const created = await UserAchievement.create({
          userId,
          achievementCode: check.code,
          name: check.name,
          description: check.description,
          icon: check.icon,
          earnedAt: new Date().toISOString()
        });
        newlyAwarded.push(created);

        // Also update User record
        const user = await User.findById(userId);
        if (user) {
          const userAchievements = user.achievements || [];
          if (!userAchievements.includes(check.code)) {
            userAchievements.push(check.code);
            await User.findByIdAndUpdate(userId, { achievements: userAchievements });
          }
        }
      }
    }

    return newlyAwarded;
  }
};
