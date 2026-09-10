import { calculateBadge } from '../utils/calculateScore.js';

export const badgeService = {
  resolveBadge(percentage) {
    return calculateBadge(percentage);
  },

  getAllBadges() {
    return [
      {
        tier: 'BEGINNER',
        title: 'CYBER BEGINNER',
        range: '0–40%',
        description: 'Needs more practice with basic cyber safety.',
        icon: 'ShieldAlert',
        color: 'emerald'
      },
      {
        tier: 'SMART',
        title: 'CYBER SMART',
        range: '41–75%',
        description: 'Understands most common digital safety risks.',
        icon: 'ShieldCheck',
        color: 'indigo'
      },
      {
        tier: 'EXPERT',
        title: 'CYBER SAFETY EXPERT',
        range: '76–100%',
        description: 'Strong awareness of common cyber threats.',
        icon: 'Award',
        color: 'amber'
      }
    ];
  }
};
