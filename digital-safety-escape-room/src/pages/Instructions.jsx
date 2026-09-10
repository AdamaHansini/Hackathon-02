import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Award, 
  Lightbulb, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Lock,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import BadgeCard from '../components/BadgeCard';

export default function Instructions({ navigate }) {
  const { isAuthenticated } = useAuth();
  const { startNewGame } = useGame();

  const handleStart = async () => {
    if (isAuthenticated) {
      await startNewGame();
      navigate('game');
    } else {
      navigate('login');
    }
  };

  const mechanics = [
    {
      icon: Award,
      title: 'Points System',
      badge: '⭐ Points',
      color: 'text-amber-500 bg-amber-50 border-amber-200',
      description: 'Earn points for every correct safety choice: +10 for Easy, +20 for Medium, and +30 for Hard scenarios.'
    },
    {
      icon: Heart,
      title: 'Lives System',
      badge: '❤️ Lives',
      color: 'text-rose-500 bg-rose-50 border-rose-200',
      description: 'You start every room with 3 lives. Each incorrect decision costs 1 life. If your lives hit zero, it is Game Over!'
    },
    {
      icon: Compass,
      title: 'Progress System',
      badge: '📊 Progress',
      color: 'text-indigo-500 bg-indigo-50 border-indigo-200',
      description: 'Track your path through the escape chambers. Complete all required stages to unlock the emergency exit.'
    },
    {
      icon: Lightbulb,
      title: 'Instant Learning',
      badge: '💡 Instant Learning',
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      description: 'After every choice, get an in-depth breakdown explaining the attack vectors and key warning signs to memorize.'
    },
    {
      icon: ShieldCheck,
      title: 'Cybersecurity Badge',
      badge: '🏆 Final Badge',
      color: 'text-purple-500 bg-purple-50 border-purple-200',
      description: 'Your final percentage awards you an official badge: Cyber Beginner, Cyber Smart, or Cyber Safety Expert.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cadet Briefing Manual</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How to Escape the Digital Safety Room
        </h1>
        <p className="text-base text-slate-600 font-medium max-w-xl mx-auto">
          Read each scenario, inspect the simulated environment, and identify whether you are safe or facing an active cyber attack.
        </p>
      </div>

      {/* Rules Box (Section 9) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Game Rules & Protocols
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <p className="text-sm font-semibold text-slate-800">
              There are four major cybersecurity challenge categories (Phishing, Passwords, Fake QR, Scam Messages).
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <p className="text-sm font-semibold text-slate-800">
              Read each scenario carefully. Look for subtle red flags, disguised URLs, and emotional urgency.
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <p className="text-sm font-semibold text-slate-800">
              Select the safest answer. Submissions cannot be changed once locked in.
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">4</span>
            <p className="text-sm font-semibold text-slate-800">
              Correct answers earn points (+10 to +30). Wrong answers cost one life (-1 Heart).
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">5</span>
            <p className="text-sm font-semibold text-slate-800">
              Read the explanation after every answer to learn the exact defensive technique.
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">6</span>
            <p className="text-sm font-semibold text-slate-800">
              Complete the challenges with at least 1 life remaining to unlock the Escape Room!
            </p>
          </div>
        </div>
      </div>

      {/* Mechanics Grid (Section 9 Display Items) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Core Game Mechanics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mechanics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl border ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge Tiers Overview (Section 23) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Badge Qualification Tiers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BadgeCard
            badge="CYBER BEGINNER"
            percentage={25}
            showDescription={true}
          />
          <BadgeCard
            badge="CYBER SMART"
            percentage={65}
            showDescription={true}
          />
          <BadgeCard
            badge="CYBER SAFETY EXPERT"
            percentage={90}
            showDescription={true}
          />
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center pt-4">
        <button
          onClick={handleStart}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-extrabold text-base text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>I Understand — Enter the Escape Room</span>
        </button>
      </div>
    </div>
  );
}
